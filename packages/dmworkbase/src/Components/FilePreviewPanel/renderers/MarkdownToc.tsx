import React, { useMemo, useCallback } from "react";
import { List } from "lucide-react";
import { useI18n } from "../../../i18n";
import "./MarkdownToc.css";

export interface TocItem {
  /** 标题 ID（用于锚点跳转） */
  id: string;
  /** 标题文本 */
  text: string;
  /** 标题层级：2 = h2, 3 = h3 */
  level: 2 | 3;
}

export interface MarkdownTocProps {
  /** Markdown 原始内容 */
  content: string;
  /** 是否展开 TOC 侧边栏 */
  isOpen: boolean;
  /** 切换 TOC 展开/收起 */
  onToggle: () => void;
  /** 点击目录项的回调，传入标题 ID */
  onItemClick?: (id: string) => void;
  /** 当前高亮的标题 ID（滚动定位时自动高亮） */
  activeId?: string;
}

/**
 * 从 Markdown 内容中提取 h2/h3 标题
 * 跳过代码块内的标题
 */
export function extractTocItems(content: string): TocItem[] {
  if (!content) {
    return [];
  }

  const items: TocItem[] = [];
  // 处理 Windows CRLF 和 Unix LF 换行符
  const normalizedContent = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = normalizedContent.split("\n");

  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // 检测代码块边界
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    // 跳过代码块内的内容
    if (inCodeBlock) continue;

    // 匹配 h2 和 h3 标题
    const h2Match = line.match(/^##\s+(.+)$/);
    const h3Match = line.match(/^###\s+(.+)$/);

    if (h2Match) {
      const text = h2Match[1].trim();
      const id = generateHeadingId(text, items.length);
      items.push({ id, text, level: 2 });
    } else if (h3Match) {
      const text = h3Match[1].trim();
      const id = generateHeadingId(text, items.length);
      items.push({ id, text, level: 3 });
    }
  }

  return items;
}

/**
 * 生成标题的唯一 ID
 * 用于锚点跳转
 */
function generateHeadingId(text: string, index: number): string {
  // 移除 Markdown 格式符号，转换为 kebab-case
  const slug = text
    .toLowerCase()
    .replace(/[`*_~\[\]()]/g, "") // 移除 Markdown 格式符号
    .replace(/\s+/g, "-") // 空格转连字符
    .replace(/[^\w\u4e00-\u9fa5-]/g, "") // 只保留字母数字中文和连字符
    .replace(/-+/g, "-") // 合并多个连字符
    .replace(/^-|-$/g, ""); // 移除首尾连字符

  // 添加索引确保唯一性
  return slug ? `${slug}-${index}` : `heading-${index}`;
}

/**
 * 判断是否应该显示 TOC 按钮
 * 条件：h2 标题数量 ≥ 3
 */
export function shouldShowToc(content: string): boolean {
  const items = extractTocItems(content);
  const h2Count = items.filter((item) => item.level === 2).length;
  return h2Count >= 3;
}

/**
 * Markdown 目录组件
 *
 * 功能：
 * 1. 从 Markdown 内容提取 h2/h3 标题
 * 2. 左侧侧边栏展示目录
 * 3. 点击目录项滚动到对应位置
 * 4. h3 相对 h2 有缩进
 */
const MarkdownToc: React.FC<MarkdownTocProps> = ({
  content,
  isOpen,
  onToggle,
  onItemClick,
  activeId,
}) => {
  const { t } = useI18n();
  // 提取目录项
  const tocItems = useMemo(() => extractTocItems(content), [content]);

  // 点击目录项
  const handleItemClick = useCallback(
    (id: string) => {
      onItemClick?.(id);
    },
    [onItemClick]
  );

  // 如果没有目录项，不渲染
  if (tocItems.length === 0) {
    return null;
  }

  return (
    <>
      {/* TOC 侧边栏 */}
      {isOpen && (
        <div className="wk-markdown-toc">
          <div className="wk-markdown-toc__header">
            <List size={14} />
            <span>{t("base.filePreview.toc.title")}</span>
          </div>
          <nav className="wk-markdown-toc__nav">
            <ul className="wk-markdown-toc__list">
              {tocItems.map((item) => (
                <li
                  key={item.id}
                  className={`wk-markdown-toc__item wk-markdown-toc__item--h${
                    item.level
                  } ${
                    activeId === item.id ? "wk-markdown-toc__item--active" : ""
                  }`}
                >
                  <button
                    className="wk-markdown-toc__link"
                    onClick={() => handleItemClick(item.id)}
                    title={item.text}
                  >
                    {item.text}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
};

export default MarkdownToc;
export { MarkdownToc };
