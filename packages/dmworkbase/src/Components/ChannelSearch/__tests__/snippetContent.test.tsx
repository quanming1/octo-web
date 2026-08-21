// @vitest-environment jsdom

import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("../../../App", () => ({
  default: {
    emojiService: {
      emojiRegExp: () => /\[有品位\]|\[OK\]/,
      getImage: (key: string) => {
        if (key === "[有品位]") return "./emoji/custom_taste.png";
        if (key === "[OK]") return "./emoji/ok.png";
        return "";
      },
    },
  },
}));

import ChannelSearchSnippetContent, {
  buildChannelSearchSnippetTokens,
  parseChannelSearchSnippetHighlights,
} from "../snippetContent";

let container: HTMLDivElement | null = null;

afterEach(() => {
  if (!container) return;
  ReactDOM.unmountComponentAtNode(container);
  container.remove();
  container = null;
});

function renderSnippet(element: React.ReactElement) {
  container = document.createElement("div");
  document.body.appendChild(container);
  act(() => {
    ReactDOM.render(element, container);
  });
  return container;
}

describe("ChannelSearchSnippetContent", () => {
  it("converts backend mark tags into highlight ranges without rendering html", () => {
    const parsed = parseChannelSearchSnippetHighlights(
      "你好<mark>搜索</mark><b>结果</b>",
      "nope"
    );

    expect(parsed).toEqual({
      text: "你好搜索<b>结果</b>",
      ranges: [{ start: 2, end: 4 }],
    });
  });

  it("renders a whole custom emoji when mark splits the emoji key", () => {
    const parsed = parseChannelSearchSnippetHighlights(
      "这个[有<mark>品</mark>位]不错",
      "品"
    );
    const tokens = buildChannelSearchSnippetTokens(
      parsed.text,
      parsed.ranges,
      (key) => (key === "[有品位]" ? "./emoji/custom_taste.png" : ""),
      /\[有品位\]/
    );

    expect(tokens).toEqual([
      { type: "text", text: "这个", highlighted: false },
      {
        type: "emoji",
        key: "[有品位]",
        url: "./emoji/custom_taste.png",
        highlighted: true,
      },
      { type: "text", text: "不错", highlighted: false },
    ]);
  });

  it("highlights a custom emoji when keyword matches inside the emoji key", () => {
    const parsed = parseChannelSearchSnippetHighlights("这个[有品位]不错", "品");
    const tokens = buildChannelSearchSnippetTokens(
      parsed.text,
      parsed.ranges,
      (key) => (key === "[有品位]" ? "./emoji/custom_taste.png" : ""),
      /\[有品位\]/
    );

    expect(tokens[1]).toMatchObject({
      type: "emoji",
      key: "[有品位]",
      highlighted: true,
    });
  });

  it("accepts global emoji regexes from custom emoji services", () => {
    const parsed = parseChannelSearchSnippetHighlights("[OK][OK]", "");
    const tokens = buildChannelSearchSnippetTokens(
      parsed.text,
      parsed.ranges,
      (key) => (key === "[OK]" ? "./emoji/ok.png" : ""),
      /\[OK\]/g
    );

    expect(tokens).toEqual([
      {
        type: "emoji",
        key: "[OK]",
        url: "./emoji/ok.png",
        highlighted: false,
      },
      {
        type: "emoji",
        key: "[OK]",
        url: "./emoji/ok.png",
        highlighted: false,
      },
    ]);
  });

  it("renders only emoji images and keeps unrelated html as text", () => {
    const root = renderSnippet(
      <ChannelSearchSnippetContent
        text={'hello <img src="x"> [OK]'}
        keyword="hello"
      />
    );

    expect(root.textContent).toContain('<img src="x">');
    expect(root.querySelectorAll("img")).toHaveLength(1);
    expect(root.querySelector("img")?.getAttribute("alt")).toBe("[OK]");
    expect(root.querySelector("mark")?.textContent).toBe("hello");
  });
});
