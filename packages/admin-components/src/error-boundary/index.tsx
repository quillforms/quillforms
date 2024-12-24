import React, { Component, ErrorInfo, ReactNode } from 'react';

// Simplified error configuration
interface ErrorConfig {
    title?: string;
    message?: string;
    actionLabel?: string;
    showDetails?: boolean;
}

interface ErrorBoundaryProps {
    children: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    onReset?: () => void;
    errorConfig?: ErrorConfig;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error | null;
    errorInfo?: ErrorInfo | null;
}

const defaultStyles = {
    wrapper: {
        padding: '20px',
        margin: '10px',
        border: '1px solid #ff6b6b',
        borderRadius: '4px',
        backgroundColor: '#fff5f5',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    heading: {
        color: '#c92a2a',
        marginTop: 0,
        marginBottom: '10px',
        fontSize: '16px',
        fontWeight: 500
    },
    message: {
        marginBottom: '15px',
        color: '#666',
        fontSize: '14px'
    },
    button: {
        padding: '8px 16px',
        backgroundColor: '#4a5568',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'background-color 0.2s ease'
    },
    details: {
        marginTop: '20px',
        whiteSpace: 'pre-wrap' as const
    },
    summary: {
        cursor: 'pointer',
        color: '#666',
        fontSize: '14px'
    },
    pre: {
        padding: '10px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        fontSize: '12px',
        overflowX: 'auto',
        margin: '10px 0'
    }
} as const;

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    public state: ErrorBoundaryState = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {
            hasError: true,
            error
        };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        this.setState({ errorInfo });

        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }

    private handleReset = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });

        if (this.props.onReset) {
            this.props.onReset();
        }
    };

    public render(): ReactNode {
        const { hasError, error, errorInfo } = this.state;
        const { children, errorConfig } = this.props;

        if (hasError) {
            return (
                <div style={defaultStyles.wrapper}>
                    <h3 style={defaultStyles.heading}>
                        {errorConfig?.title || 'Something went wrong'}
                    </h3>

                    {(error || errorConfig?.message) && (
                        <div style={defaultStyles.message}>
                            {errorConfig?.message || error?.message}
                        </div>
                    )}

                    <button
                        onClick={this.handleReset}
                        style={defaultStyles.button}
                    >
                        {errorConfig?.actionLabel || 'Try Again'}
                    </button>

                    {(errorConfig?.showDetails ?? process.env.NODE_ENV === 'development') && errorInfo && (
                        <details style={defaultStyles.details}>
                            <summary style={defaultStyles.summary}>
                                Error Details
                            </summary>
                            <pre style={defaultStyles.pre}>
                                {error?.stack}
                            </pre>
                            <pre style={defaultStyles.pre}>
                                {errorInfo.componentStack}
                            </pre>
                        </details>
                    )}
                </div>
            );
        }

        return children;
    }
}

export function withErrorBoundary<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    errorConfig?: ErrorConfig
): React.FC<P> {
    return function WithErrorBoundaryWrapper(props: P) {
        return (
            <ErrorBoundary errorConfig={errorConfig}>
                <WrappedComponent {...props} />
            </ErrorBoundary>
        );
    };
}

export default ErrorBoundary;