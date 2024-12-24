import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

class BlockTreeErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('BlockTree Error:', {
            error,
            errorInfo,
            componentStack: errorInfo.componentStack
        });

        this.setState({
            error,
            errorInfo
        });
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: undefined,
            errorInfo: undefined
        });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '20px',
                    margin: '10px',
                    border: '1px solid #ff6b6b',
                    borderRadius: '4px',
                    backgroundColor: '#fff5f5'
                }}>
                    <h3 style={{
                        color: '#c92a2a',
                        marginTop: 0,
                        marginBottom: '10px'
                    }}>
                        Something went wrong with the block tree
                    </h3>

                    <div style={{
                        marginBottom: '15px',
                        color: '#666'
                    }}>
                        {this.state.error?.message}
                    </div>

                    <button
                        onClick={this.handleReset}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#4a5568',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Try Again
                    </button>

                    {process.env.NODE_ENV === 'development' && (
                        <details style={{
                            marginTop: '20px',
                            whiteSpace: 'pre-wrap'
                        }}>
                            <summary style={{
                                cursor: 'pointer',
                                color: '#666'
                            }}>
                                Error Details
                            </summary>
                            <pre style={{
                                padding: '10px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '4px',
                                fontSize: '12px',
                                overflowX: 'auto'
                            }}>
                                {this.state.errorInfo?.componentStack}
                            </pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default BlockTreeErrorBoundary;