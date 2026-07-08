"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class CMSErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="py-16 text-center border border-dashed border-neutral-200 rounded-xl mx-4 my-8">
            <p className="text-sm text-muted-foreground">
              Content temporarily unavailable. Please try again shortly.
            </p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
