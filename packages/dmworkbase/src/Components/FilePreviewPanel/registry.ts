import {
  FileType,
  FileRenderer,
  RendererRegistryItem,
  getExtension,
} from "./types";
import FileViewerRenderer from "./renderers/FileViewerRenderer";
import MarkdownRenderer from "./renderers/MarkdownRenderer";
import CodeRenderer from "./renderers/CodeRenderer";
import TextRenderer from "./renderers/TextRenderer";
import HtmlRenderer from "./renderers/HtmlRenderer";
import FallbackRenderer from "./renderers/FallbackRenderer";
import JsonRenderer from "./renderers/JsonRenderer";
import JsonlRenderer from "./renderers/JsonlRenderer";
import ImageRenderer from "./renderers/ImageRenderer";
import VideoRenderer from "./renderers/VideoRenderer";

/**
 * 文件渲染器注册表
 * 策略模式核心：根据文件扩展名选择对应的渲染器
 *
 * Office 文档（pdf / word / ppt / excel）统一由 FileViewerRenderer
 * （@file-viewer，Flyfish File Viewer）渲染；其余格式保留原渲染器。
 */
class FileRendererRegistry {
  private registry: Map<string, RendererRegistryItem> = new Map();
  private fallback: FileRenderer = FallbackRenderer;

  constructor() {
    this.registerDefaults();
  }

  /** 注册默认渲染器 */
  private registerDefaults() {
    // 图片
    this.register({
      type: "image",
      extensions: ["png", "jpg", "jpeg", "gif", "bmp", "webp", "svg"],
      renderer: ImageRenderer,
      needsFetch: false,
    });

    // 视频
    this.register({
      type: "video",
      extensions: ["mp4", "m4v", "mov", "webm", "ogv", "ogg"],
      renderer: VideoRenderer,
      needsFetch: false,
    });

    // PDF（@file-viewer renderer-pdf）
    this.register({
      type: "pdf",
      extensions: ["pdf"],
      renderer: FileViewerRenderer,
      needsFetch: false,
    });

    // Word（@file-viewer renderer-word）
    this.register({
      type: "word",
      extensions: ["docx", "doc", "docm", "dotx", "dotm", "rtf", "odt", "wps"],
      renderer: FileViewerRenderer,
      needsFetch: false,
    });

    // PPT（@file-viewer renderer-presentation）
    this.register({
      type: "ppt",
      extensions: ["pptx", "ppt", "pptm", "potx", "ppsx", "odp", "dps"],
      renderer: FileViewerRenderer,
      needsFetch: false,
    });

    // Markdown
    this.register({
      type: "markdown",
      extensions: ["md", "markdown"],
      renderer: MarkdownRenderer,
      needsFetch: true,
    });

    // 代码
    this.register({
      type: "code",
      extensions: [
        "js",
        "jsx",
        "ts",
        "tsx",
        "css",
        "scss",
        "less",
        "xml",
        "yaml",
        "yml",
        "py",
        "java",
        "c",
        "cpp",
        "h",
        "hpp",
        "go",
        "rs",
        "rb",
        "php",
        "sh",
        "bash",
        "sql",
        "vue",
        "svelte",
      ],
      renderer: CodeRenderer,
      needsFetch: true,
    });

    // JSON（格式化 + 树形视图）
    this.register({
      type: "json",
      extensions: ["json"],
      renderer: JsonRenderer,
      needsFetch: true,
    });

    // JSONL（格式化 + 表格视图）
    this.register({
      type: "jsonl",
      extensions: ["jsonl"],
      renderer: JsonlRenderer,
      needsFetch: true,
    });

    // HTML（渲染预览，非代码显示）
    this.register({
      type: "text",
      extensions: ["html", "htm"],
      renderer: HtmlRenderer,
      needsFetch: true,
    });

    // 纯文本
    this.register({
      type: "text",
      extensions: ["txt", "log", "ini", "conf", "cfg"],
      renderer: TextRenderer,
      needsFetch: true,
    });

    // Excel/CSV 表格（@file-viewer renderer-spreadsheet：xlsx, xls, xlsb, xlsm, csv, et）
    this.register({
      type: "excel",
      extensions: ["xlsx", "xls", "xlsb", "xlsm", "csv", "et"],
      renderer: FileViewerRenderer,
      needsFetch: false,
    });
  }

  /** 注册渲染器 */
  register(item: RendererRegistryItem) {
    for (const ext of item.extensions) {
      this.registry.set(ext.toLowerCase(), item);
    }
  }

  /** 根据扩展名获取渲染器 */
  getRenderer(extension: string, fileName?: string): RendererRegistryItem {
    const ext = getExtension(extension, fileName);
    return (
      this.registry.get(ext) || {
        type: "unknown" as FileType,
        extensions: [],
        renderer: this.fallback,
        needsFetch: false,
      }
    );
  }

  /** 设置兜底渲染器 */
  setFallback(renderer: FileRenderer) {
    this.fallback = renderer;
  }

  /** 判断是否支持预览 */
  canPreview(extension: string, fileName?: string): boolean {
    const ext = getExtension(extension, fileName);
    return this.registry.has(ext);
  }

  /** 获取所有支持的扩展名 */
  getSupportedExtensions(): string[] {
    return Array.from(this.registry.keys());
  }

  /** 根据文件类型获取所有扩展名 */
  getExtensionsByType(type: FileType): string[] {
    const extensions: string[] = [];
    for (const [ext, item] of this.registry.entries()) {
      if (item.type === type) {
        extensions.push(ext);
      }
    }
    return extensions;
  }
}

// 单例导出
export const fileRendererRegistry = new FileRendererRegistry();

export default fileRendererRegistry;
