import React from "react";
import ReactDOM from "react-dom";
import { renderToStaticMarkup } from "react-dom/server";
import { act } from "react-dom/test-utils";
import { afterEach, describe, expect, it } from "vitest";

import DocTab from "../DocTab";

let container: HTMLDivElement | null = null;

afterEach(() => {
  if (!container) return;
  ReactDOM.unmountComponentAtNode(container);
  container.remove();
  container = null;
});

function renderInto(element: React.ReactElement) {
  container = document.createElement("div");
  document.body.appendChild(container);
  act(() => {
    ReactDOM.render(element, container);
  });
  return container;
}

/**
 * OCT-138 Stage A 骨架契约。守护三件事：
 *   1. src 缺失 → 只出空态（不能偷偷渲染 iframe，防止 undefined 拼进 URL）。
 *   2. src 给了 → iframe 挂上，src 属性和调用方传入的一致（防止组件私自改写）。
 *   3. sandbox 允许 allow-scripts + allow-same-origin（doc 页面 JS 通过同源
 *      fetch 走 capability cookie），但**不能**允许 allow-top-navigation
 *      （防恶意 doc 劫持宿主 tab）——回归之守门。
 */
describe("DocTab — OCT-138 Stage A skeleton", () => {
  it("renders the empty state and no iframe when src is missing", () => {
    const html = renderToStaticMarkup(<DocTab emptyText="暂无文档" />);
    expect(html).toContain("暂无文档");
    expect(html).not.toContain("<iframe");
    expect(html).toContain("data-testid=\"doc-tab-empty\"");
  });

  it("mounts an iframe with the caller-provided src verbatim", () => {
    const src = "https://docs.octo.example.com/d/plan/v/1";
    const root = renderInto(<DocTab src={src} title="octo-doc-tab" />);
    const iframe = root.querySelector(
      "iframe[data-testid=\"doc-tab-iframe\"]"
    ) as HTMLIFrameElement | null;
    expect(iframe).not.toBeNull();
    expect(iframe!.getAttribute("src")).toBe(src);
    expect(iframe!.getAttribute("title")).toBe("octo-doc-tab");
  });

  it("locks the sandbox policy — same-origin allowed, top-nav denied", () => {
    const html = renderToStaticMarkup(
      <DocTab src="https://docs.octo.example.com/me" />
    );
    // Positive: doc page JS 需要同源+脚本，否则 capability cookie 拿不到。
    expect(html).toMatch(/sandbox="[^"]*allow-scripts[^"]*"/);
    expect(html).toMatch(/sandbox="[^"]*allow-same-origin[^"]*"/);
    // Negative: 禁止顶层导航，否则恶意 doc 可 top.location=... 劫持宿主。
    expect(html).not.toMatch(/allow-top-navigation/);
  });

  it("shows a loading overlay before the iframe fires onLoad", () => {
    const root = renderInto(<DocTab src="https://docs.example.com/me" />);
    // 初始渲染时 loading=true，overlay 应存在。
    expect(
      root.querySelector("[data-testid=\"doc-tab-loading\"]")
    ).not.toBeNull();
  });
});
