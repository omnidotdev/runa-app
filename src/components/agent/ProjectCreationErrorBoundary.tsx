import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react";
import { Component } from "react";

import { Button } from "@/components/ui/button";

import type { ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary for project creation panel.
 *
 * Catches rendering errors and displays a fallback UI with retry option.
 * Required as a class component since React doesn't support error boundaries
 * with hooks yet.
 */
export class ProjectCreationErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error for debugging (could be sent to error tracking service)
    console.error("ProjectCreationPanel error:", error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangleIcon className="size-6 text-destructive" />
          </div>
          <div>
            <p className="font-medium text-sm">Something went wrong</p>
            <p className="mt-1 max-w-[280px] text-muted-foreground text-xs">
              An unexpected error occurred. Please try again or close and reopen
              the panel.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={this.handleReset}
            className="mt-2"
          >
            <RefreshCwIcon className="mr-2 size-3" />
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
