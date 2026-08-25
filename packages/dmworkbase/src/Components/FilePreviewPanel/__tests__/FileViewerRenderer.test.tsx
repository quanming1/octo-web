// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import { BaseRendererProps } from "../types";

type StateListener = (state: { error?: unknown }) => void;
type MountCall = { options: { onStateChange?: StateListener } };

// listeners must be hoisted: the mock factory runs before module top-level code.
const { listeners, mountCalls, destroyed } = vi.hoisted(() => ({
  listeners: [] as StateListener[],
  mountCalls: [] as MountCall[],
  destroyed: { count: 0 },
}));

vi.mock("@file-viewer/core/browser", () => ({
  mountViewer: (_container: HTMLElement, options: { onStateChange?: StateListener }) => {
    mountCalls.push({ options });
    if (options.onStateChange) listeners.push(options.onStateChange);
    return {
      destroy: () => {
        destroyed.count += 1;
      },
      update: vi.fn(),
      getState: () => ({}),
    };
  },
}));

vi.mock("@file-viewer/core", () => ({
  fileViewerCoreRendererRegistry: { name: "test-registry" },
}));

vi.mock("@file-viewer/preset-office", () => ({ default: [] }));
vi.mock("../renderers/FileViewerRenderer.css", () => ({}));
// FileTooLarge 内部走 useI18n → Semi Design 组件链（semi-icons 的 CJS
// require("../styles/icons.css") 在 vitest 下无法解析），测试中替换为轻量桩。
vi.mock("../renderers/FileTooLarge", () => ({
  default: () => <div data-testid="file-too-large" />,
}));
vi.mock("../renderers/RendererState", () => ({
  default: ({ type, message, onRetry }: { type: string; message?: string; onRetry?: () => void }) => (
    <div data-testid="renderer-state" data-type={type}>
      <span>{message}</span>
      {onRetry && <button onClick={onRetry}>retry</button>}
    </div>
  ),
}));

import FileViewerRenderer from "../renderers/FileViewerRenderer";

describe("FileViewerRenderer", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    listeners.length = 0;
    mountCalls.length = 0;
    destroyed.count = 0;
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    act(() => {
      ReactDOM.unmountComponentAtNode(container);
    });
    container.remove();
  });

  function renderViewer(props: BaseRendererProps) {
    act(() => {
      ReactDOM.render(<FileViewerRenderer {...props} />, container);
    });
  }

  it("mounts the file-viewer with url and name for office files", () => {
    renderViewer({
      file: { url: "/a.docx", name: "a.docx", extension: "docx", size: 1000 },
      onError: vi.fn(),
    });

    expect(container.querySelector('[data-testid="file-viewer-renderer"]')).not.toBeNull();
    expect(mountCalls.length).toBe(1);
    expect(mountCalls[0].options.url).toBe("/a.docx");
    expect(mountCalls[0].options.name).toBe("a.docx");
  });

  it("remaps WPS extensions to Office extensions", () => {
    renderViewer({
      file: { url: "/a.wps", name: "a.wps", extension: "wps", size: 1000 },
      onError: vi.fn(),
    });

    expect(mountCalls[0].options.name).toBe("a.docx");
  });

  it("forwards load failures reported through ViewerState.error", () => {
    const onError = vi.fn();
    renderViewer({
      file: { url: "/a.docx", name: "a.docx", extension: "docx", size: 1000 },
      onError,
    });

    act(() => {
      listeners[0]?.({ error: new Error("corrupted docx") });
    });

    const stateEl = container.querySelector('[data-testid="renderer-state"]');
    expect(stateEl).not.toBeNull();
    expect(stateEl?.getAttribute("data-type")).toBe("error");
    expect(container.textContent).toContain("corrupted docx");
    expect(onError).toHaveBeenCalledWith("corrupted docx");
  });

  it("renders normally when state has no error", () => {
    const onError = vi.fn();
    renderViewer({
      file: { url: "/a.docx", name: "a.docx", extension: "docx", size: 1000 },
      onError,
    });

    act(() => {
      listeners[0]?.({});
    });

    expect(container.querySelector('[data-testid="renderer-state"]')).toBeNull();
    expect(onError).not.toHaveBeenCalled();
  });

  it("retry clears the error and remounts the viewer", () => {
    renderViewer({
      file: { url: "/a.docx", name: "a.docx", extension: "docx", size: 1000 },
      onError: vi.fn(),
    });

    act(() => {
      listeners[0]?.({ error: "boom" });
    });
    expect(container.querySelector('[data-testid="renderer-state"]')).not.toBeNull();

    const mountsBefore = mountCalls.length;
    act(() => {
      container.querySelector("button")?.click();
    });

    expect(container.querySelector('[data-testid="renderer-state"]')).toBeNull();
    expect(container.querySelector('[data-testid="file-viewer-renderer"]')).not.toBeNull();
    // The key-based remount registers a fresh onStateChange listener.
    expect(mountCalls.length).toBeGreaterThan(mountsBefore);
  });

  it("destroys the controller on unmount", () => {
    renderViewer({
      file: { url: "/a.pdf", name: "a.pdf", extension: "pdf", size: 1000 },
      onError: vi.fn(),
    });
    expect(destroyed.count).toBe(0);

    act(() => {
      ReactDOM.unmountComponentAtNode(container);
    });

    expect(destroyed.count).toBe(1);
  });

  it("shows FileTooLarge instead of mounting the viewer", () => {
    renderViewer({
      file: { url: "/big.pdf", name: "big.pdf", extension: "pdf", size: 21 * 1024 * 1024 },
      onError: vi.fn(),
    });

    expect(container.querySelector('[data-testid="file-too-large"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="file-viewer-renderer"]')).toBeNull();
    expect(mountCalls.length).toBe(0);
  });
});
