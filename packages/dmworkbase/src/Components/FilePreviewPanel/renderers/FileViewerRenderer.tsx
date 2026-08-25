import React, { useCallback, useEffect, useRef, useState } from "react";
import { mountViewer, type ViewerController, type ViewerMountOptions, type ViewerState } from "@file-viewer/core/browser";
import { fileViewerCoreRendererRegistry } from "@file-viewer/core";
import officePreset from "@file-viewer/preset-office";
import { BaseRendererProps } from "../types";
import { isFileTooLarge } from "../config";
import FileTooLarge from "./FileTooLarge";
import RendererState from "./RendererState";
import "./FileViewerRenderer.css";

/** Convert an unknown load error into a readable message. */
function toErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string" && error) return error;
  return String(error ?? "Unable to render file");
}

/**
 * Unified file-viewer renderer for Office documents (pdf / word / ppt / excel).
 *
 * Uses the framework-neutral mountViewer API from @file-viewer/core directly
 * (instead of @file-viewer/react-legacy, whose peer range is react <18 while
 * this workspace runs react 18) so there is no second React instance.
 */
const FileViewerRenderer: React.FC<BaseRendererProps> = ({ file, onError }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<ViewerController | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  // Keep the latest onError without re-creating mountOptions (which would make
  // mountViewer re-run update() on every render).
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  // @file-viewer/core reports load failures through ViewerState.error
  // (the viewer event stream has no "error" event), so watch onStateChange.
  const handleStateChange = useCallback((state: ViewerState) => {
    if (state.error) {
      const message = toErrorMessage(state.error);
      setErrorMessage(message);
      onErrorRef.current?.(message);
    } else {
      setErrorMessage(null);
    }
  }, []);

  const handleRetry = useCallback(() => {
    setErrorMessage(null);
    setRetryKey((key) => key + 1);
  }, []);

  // WPS Office extensions are internally Microsoft Office formats.
  // Remap to the equivalent Office extension so file-viewer selects
  // the correct renderer (it dispatches by filename extension).
  const WPS_EXT_MAP: Record<string, string> = {
    wps: "docx",
    et: "xlsx",
    dps: "pptx",
  };
  const dot = file.name.lastIndexOf(".");
  const ext = dot > 0 ? file.name.substring(dot + 1).toLowerCase() : "";
  const mappedExt = WPS_EXT_MAP[ext];
  const viewerFilename = mappedExt
    ? file.name.substring(0, dot + 1) + mappedExt
    : file.name;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || controllerRef.current) return;

    const mountOptions: ViewerMountOptions = {
      url: file.url,
      name: viewerFilename,
      size: file.size,
      options: {
        preset: [officePreset],
        rendererMode: "replace",
        theme: "system",
        styleIsolation: "scoped",
        toolbar: { position: "bottom-right" },
        spreadsheet: {
          workerUrl: "/vendor/xlsx/sheet.worker.js",
        },
      },
      onStateChange: handleStateChange,
    };
    controllerRef.current = mountViewer(container, mountOptions, {
      registry: fileViewerCoreRendererRegistry,
    });

    return () => {
      controllerRef.current?.destroy();
      controllerRef.current = null;
      container.innerHTML = "";
    };
    // file.url / file.size / viewerFilename change on a new preview target;
    // retryKey remounts after a user-triggered retry.
  }, [file.url, file.size, viewerFilename, retryKey, handleStateChange]);

  if (file.size && isFileTooLarge(file.size)) {
    return <FileTooLarge fileName={file.name} fileSize={file.size} fileUrl={file.url} />;
  }

  if (errorMessage) {
    return <RendererState type="error" message={errorMessage} onRetry={handleRetry} />;
  }

  return (
    <div className="wk-file-preview-file-viewer" ref={containerRef} data-testid="file-viewer-renderer" />
  );
};

export default FileViewerRenderer;
export { FileViewerRenderer };
