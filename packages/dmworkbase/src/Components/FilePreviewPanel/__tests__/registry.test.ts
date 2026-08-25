import { describe, it, expect, vi } from "vitest";

// Mock 所有渲染器组件，避免 Semi UI 在 vitest 环境报错
vi.mock("../renderers/FileViewerRenderer", () => ({ default: () => null }));
vi.mock("../renderers/MarkdownRenderer", () => ({ default: () => null }));
vi.mock("../renderers/CodeRenderer", () => ({ default: () => null }));
vi.mock("../renderers/TextRenderer", () => ({ default: () => null }));
vi.mock("../renderers/HtmlRenderer", () => ({ default: () => null }));
vi.mock("../renderers/FallbackRenderer", () => ({ default: () => null }));
vi.mock("../renderers/JsonRenderer", () => ({ default: () => null }));
vi.mock("../renderers/JsonlRenderer", () => ({ default: () => null }));
vi.mock("../renderers/ImageRenderer", () => ({ default: () => null }));
vi.mock("../renderers/VideoRenderer", () => ({ default: () => null }));

import fileRendererRegistry from "../registry";

/**
 * 注册映射测试 — 锁定 extension → renderer 的映射关系，防止回归。
 *
 * Office 文档（pdf / word / ppt / excel）统一路由到 FileViewerRenderer
 * （@file-viewer），这些扩展名必须 canPreview 返回 true。
 */

describe("fileRendererRegistry — 扩展名 → 渲染器映射", () => {
  it("Excel 格式全部映射到 excel type", () => {
    for (const ext of ["xlsx", "xls", "xlsb", "xlsm", "csv"]) {
      const item = fileRendererRegistry.getRenderer(ext);
      expect(item).toBeDefined();
      expect(item.type).toBe("excel");
    }
  });

  it("Word 格式映射到 word type", () => {
    for (const ext of ["docx", "doc", "rtf", "wps"]) {
      const item = fileRendererRegistry.getRenderer(ext);
      expect(item).toBeDefined();
      expect(item.type).toBe("word");
    }
  });

  it("PPT 格式映射到 ppt type", () => {
    for (const ext of ["pptx", "ppt", "pptm", "dps"]) {
      const item = fileRendererRegistry.getRenderer(ext);
      expect(item).toBeDefined();
      expect(item.type).toBe("ppt");
    }
  });

  it("PDF 映射到 pdf type", () => {
    expect(fileRendererRegistry.getRenderer("pdf").type).toBe("pdf");
  });

  it("Office 格式 canPreview 全部返回 true", () => {
    for (const ext of ["pdf", "docx", "doc", "rtf", "wps", "pptx", "ppt", "dps", "xlsx", "xls", "csv"]) {
      expect(fileRendererRegistry.canPreview(ext)).toBe(true);
    }
  });

  it("大写扩展名也能正确解析", () => {
    expect(fileRendererRegistry.canPreview("XLSX")).toBe(true);
    expect(fileRendererRegistry.canPreview("DOCX")).toBe(true);
    expect(fileRendererRegistry.canPreview("PPTX")).toBe(true);
    expect(fileRendererRegistry.canPreview("PDF")).toBe(true);
  });

  it("非 Office 格式映射到其他 type", () => {
    expect(fileRendererRegistry.getRenderer("md").type).toBe("markdown");
    expect(fileRendererRegistry.getRenderer("png").type).toBe("image");
  });

  it("不支持的格式 canPreview 返回 false", () => {
    expect(fileRendererRegistry.canPreview("exe")).toBe(false);
    expect(fileRendererRegistry.canPreview("dmg")).toBe(false);
  });
});
