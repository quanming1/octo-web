import { useState, useEffect, useCallback, useRef } from "react";
import { t } from "../../../i18n";

export type ResponseType = "text" | "arraybuffer";

export interface UseFileContentOptions<T extends ResponseType = "text"> {
  url: string;
  enabled?: boolean;
  /** 响应类型：text（默认）或 arraybuffer */
  responseType?: T;
}

export type ContentType<T extends ResponseType> = T extends "arraybuffer"
  ? ArrayBuffer
  : string;

export interface UseFileContentResult<T extends ResponseType = "text"> {
  content: ContentType<T> | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/**
 * 文件内容加载 Hook
 * 用于需要预加载内容的渲染器（Markdown、Code、Text、Excel 等）
 * @param options.responseType - 'text'（默认）或 'arraybuffer'
 */
export function useFileContent<T extends ResponseType = "text">(
  options: UseFileContentOptions<T>
): UseFileContentResult<T> {
  const { url, enabled = true, responseType = "text" as T } = options;

  const [content, setContent] = useState<ContentType<T> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 用于取消正在进行的请求，避免竞态条件
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadContent = useCallback(async () => {
    if (!url || !enabled) {
      return;
    }

    // 取消之前的请求（如果有）
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 创建新的 AbortController
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        signal: abortController.signal,
      });

      // 检查请求是否被取消
      if (abortController.signal.aborted) {
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (responseType === "arraybuffer") {
        const buffer = await response.arrayBuffer();
        // 再次检查是否被取消
        if (abortController.signal.aborted) {
          return;
        }
        setContent(buffer as ContentType<T>);
      } else {
        const buffer = await response.arrayBuffer();
        // 再次检查是否被取消
        if (abortController.signal.aborted) {
          return;
        }
        const text = new TextDecoder("utf-8").decode(buffer);
        setContent(text as ContentType<T>);
      }
    } catch (err) {
      // 忽略取消错误
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }
      const message = err instanceof Error ? err.message : t("base.filePreview.loadFailed");
      setError(message);
      setContent(null);
    } finally {
      // 只有当这个请求没有被取消时才更新 loading 状态
      if (!abortController.signal.aborted) {
        setLoading(false);
      }
    }
  }, [url, enabled, responseType]);

  useEffect(() => {
    loadContent();

    // 清理函数：组件卸载或依赖变化时取消请求
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [loadContent]);

  const reload = useCallback(() => {
    loadContent();
  }, [loadContent]);

  return {
    content,
    loading,
    error,
    reload,
  };
}

export default useFileContent;
