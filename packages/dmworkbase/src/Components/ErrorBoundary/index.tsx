import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useI18n } from '../../i18n';
import './index.css';

export interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    /** Module name for display in error UI */
    moduleName?: string;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

/**
 * React Error Boundary component for catching and handling render errors.
 *
 * Usage:
 * - Wrap around components that might throw errors during rendering
 * - Provides a fallback UI when an error occurs
 * - Supports retry functionality
 * - Can report errors via onError callback
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.props.onError?.(error, errorInfo);
    }

    handleRetry = (): void => {
        this.setState({ hasError: false, error: undefined });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <ErrorFallback
                    error={this.state.error}
                    moduleName={this.props.moduleName}
                    onRetry={this.handleRetry}
                />
            );
        }

        return this.props.children;
    }
}

export interface ErrorFallbackProps {
    error?: Error;
    moduleName?: string;
    onRetry?: () => void;
}

/**
 * Default fallback UI displayed when an error is caught
 */
export function ErrorFallback({ error, moduleName, onRetry }: ErrorFallbackProps): JSX.Element {
    const { t } = useI18n();
    const displayName = moduleName || t('base.errorBoundary.module');

    return (
        <div className="wk-error-boundary">
            <div className="wk-error-boundary-content">
                <div className="wk-error-boundary-icon">
                    <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                </div>
                <h3 className="wk-error-boundary-title">
                    {t('base.errorBoundary.title', { values: { module: displayName } })}
                </h3>
                <p className="wk-error-boundary-message">
                    {error?.message || t('base.errorBoundary.unknownError')}
                </p>
                {onRetry && (
                    <button
                        className="wk-error-boundary-retry"
                        onClick={onRetry}
                    >
                        {t('base.filePreview.retry')}
                    </button>
                )}
            </div>
        </div>
    );
}

export default ErrorBoundary;
