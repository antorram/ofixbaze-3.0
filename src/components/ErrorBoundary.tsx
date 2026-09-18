import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught application error in ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
    try {
      window.location.reload();
    } catch {
      // Ignore if iframe reload blocked
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-slate-900 font-sans">
          <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-lg text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
              <AlertCircle className="w-8 h-8" />
            </div>
            
            <h2 className="text-xl font-bold text-slate-900">
              Something went wrong
            </h2>
            
            <p className="text-xs text-slate-600 leading-relaxed">
              An unexpected error occurred while rendering the page. You can reload the view or try resetting your local session.
            </p>

            {this.state.error?.message && (
              <div className="p-3 bg-slate-100 rounded-lg text-[11px] font-mono text-slate-700 text-left overflow-x-auto max-h-24">
                {this.state.error.message}
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={this.handleReload}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reload Application</span>
              </button>
              
              <button
                onClick={() => {
                  try {
                    localStorage.removeItem('ofixbaze_cart');
                    localStorage.removeItem('ofixbaze_wishlist');
                  } catch {
                    // ignore
                  }
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                Reset Saved State
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
