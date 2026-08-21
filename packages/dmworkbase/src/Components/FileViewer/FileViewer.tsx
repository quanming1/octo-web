import React, { useState, useRef } from 'react';
import DOMPurify from 'dompurify';
import { useI18n } from '../../i18n';
import './FileViewer.css';

/** 文件分组 */
export interface FileGroup {
  /** 分组标签 */
  label: string;
  /** 分组下的文件 */
  files: FileItem[];
}

/** 文件项 */
export interface FileItem {
  /** 文件名（如 AGENTS.md） */
  name: string;
  /** 文件路径（用于接口获取，如 memory/2026-05-07.md） */
  path: string;
  /** 文件大小（如 "412B"） */
  size: string;
}

/** 文件内容 */
export interface FileContent {
  /** 文件名 */
  name: string;
  /** 文件大小 */
  size: string;
  /** 修改时间 */
  mtime: string;
  /** 文件内容（Markdown 格式） */
  content: string;
}

export interface FileViewerProps {
  /** 文件分组列表 */
  groups: FileGroup[];
  /** 获取文件内容的函数（返回 Promise） */
  onFetchFile: (path: string) => Promise<FileContent>;
  /** 默认选中的文件路径 */
  defaultFile?: string;
  /** 容器高度（CSS 值，如 "480px" / "100%" / "calc(100vh - 200px)"），默认 "480px" */
  height?: string;
}

/**
 * FileViewer - 左右布局的文件预览器
 * 
 * 左侧：文件目录树（支持分组）
 * 右侧：Markdown 预览区
 * 
 * @example
 * ```tsx
 * const groups = [
 *   {
 *     label: '身份与人格',
 *     files: [
 *       { name: 'AGENTS.md', path: 'AGENTS.md', size: '412B' },
 *       { name: 'SOUL.md', path: 'SOUL.md', size: '128B' },
 *     ],
 *   },
 * ];
 * 
 * <FileViewer
 *   groups={groups}
 *   onFetchFile={async (path) => ({
 *     name: path,
 *     size: '412B',
 *     mtime: '2026-05-07 16:12',
 *     content: '# Hello\n\nWorld',
 *   })}
 *   defaultFile="AGENTS.md"
 * />
 * ```
 */
export default function FileViewer({
  groups,
  onFetchFile,
  defaultFile,
  height = '480px',
}: FileViewerProps) {
  const { t } = useI18n();
  const [activePath, setActivePath] = useState<string>(
    defaultFile || groups[0]?.files[0]?.path || ''
  );
  const [fileContent, setFileContent] = useState<FileContent | null>(null);
  const [loading, setLoading] = useState(false);
  // 竞态保护：每次发起请求时递增，响应回来时检查是否仍是最新请求
  const currentRequestIdRef = useRef(0);

  // 初始化时加载默认文件
  React.useEffect(() => {
    if (activePath) {
      handleFileClick(activePath);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileClick = async (path: string) => {
    setActivePath(path);
    setLoading(true);
    const requestId = ++currentRequestIdRef.current;
    try {
      const content = await onFetchFile(path);
      if (requestId !== currentRequestIdRef.current) return;
      setFileContent(content);
    } catch (error) {
      if (requestId !== currentRequestIdRef.current) return;
      console.error('Failed to fetch file:', error);
      setFileContent({
        name: path,
        size: '—',
        mtime: '—',
        content: t('base.fileViewer.loadFailedContent'),
      });
    } finally {
      if (requestId === currentRequestIdRef.current) {
        setLoading(false);
      }
    }
  };

  // 简易 Markdown 渲染（仅允许 div[class] 和 code 标签，经 DOMPurify 净化）
  const renderMarkdown = (md: string): string => {
    const raw = md
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/^### (.+)$/gm, '<div class="md-h3">$1</div>')
      .replace(/^## (.+)$/gm, '<div class="md-h2">$1</div>')
      .replace(/^# (.+)$/gm, '<div class="md-h1">$1</div>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
    // 信任边界：raw 已做实体转义，此处只允许展示用标签和 class 属性
    // 明确禁止 data-* 属性和所有事件处理器，防止 DOM clobbering 和 handler 注入
    return DOMPurify.sanitize(raw, {
      ALLOWED_TAGS: ['div', 'code'],
      ALLOWED_ATTR: ['class'],
      ALLOW_DATA_ATTR: false,
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
    });
  };

  const renderCenteredMessage = (message: string) =>
    `<div style="color:var(--t3);padding:24px;text-align:center">${message}</div>`;

  return (
    <div className="files-layout" data-testid="file-viewer" style={{ height }}>
      {/* 左侧目录 */}
      <div className="files-sidebar" data-testid="file-sidebar">
        <div className="files-sidebar-head">
          {t('base.fileViewer.sidebarTitle', { values: { count: groups.length } })}
        </div>
        <div className="files-sidebar-body">
          {groups.map((group, gIdx) => (
            <div className="files-group" key={gIdx} data-testid={`file-group-${gIdx}`}>
              <div className="files-group-label">{group.label}</div>
              {group.files.map((file, fIdx) => (
                <div
                  className={`file-item ${file.path === activePath ? 'active' : ''}`}
                  key={fIdx}
                  onClick={() => handleFileClick(file.path)}
                  data-testid={`file-item-${file.path}`}
                >
                  <svg
                    className="fi-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span className="fi-name">{file.name}</span>
                  <span className="fi-size">{file.size}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 右侧预览 */}
      <div className="file-viewer" data-testid="file-preview">
        <div className="file-viewer-head">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: '14px', height: '14px', color: 'var(--primary)' }}
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span className="fvh-name" data-testid="file-viewer-name">
            {fileContent?.name || '—'}
          </span>
          <span className="fvh-readonly">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            {t('base.fileViewer.readonly')}
          </span>
          <span className="fvh-meta" data-testid="file-viewer-meta">
            {fileContent ? `${fileContent.size} · ${fileContent.mtime}` : '—'}
          </span>
        </div>
        <div
          className="file-viewer-body"
          data-testid="file-viewer-body"
          dangerouslySetInnerHTML={{
            __html: loading
              ? renderCenteredMessage(t('base.fileViewer.loading'))
              : fileContent
              ? renderMarkdown(fileContent.content)
              : renderCenteredMessage(t('base.fileViewer.selectFile')),
          }}
        />
      </div>
    </div>
  );
}
