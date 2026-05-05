'use client';

import { Component, ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error?: Error; }

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen"
          style={{ background: '#0a0a0f' }}>
          <div className="text-center p-8 rounded-2xl max-w-md"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,0,0,0.2)' }}>
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-white font-bold text-xl mb-2">Something went wrong</h2>
            <p className="text-gray-400 text-sm mb-6">{this.state.error?.message}</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-6 py-3 rounded-xl font-medium text-white"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}