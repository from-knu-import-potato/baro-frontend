import { Component } from 'react';

import { AlertTriangle } from 'lucide-react';

import { Button } from '@/shadcn/ui/button';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message || null };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-6">
          <div className="relative flex items-center justify-center">
            <div className="absolute size-28 rounded-full bg-baro-red/8 blur-2xl" />
            <AlertTriangle className="relative size-16 text-baro-red" strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">오류가 발생했습니다</h1>
            <p className="pt-3 text-sm leading-relaxed text-muted-foreground">
              서비스를 이용하는 중 문제가 발생했어요.
              <br />
              잠시 후 다시 시도해 주세요.
            </p>
          </div>
          {this.state.errorMessage && (
            <p className="w-auto rounded-lg bg-muted px-4 py-3 font-mono text-xs leading-relaxed text-muted-foreground">
              {this.state.errorMessage}
            </p>
          )}
          <div className="mt-2 flex flex-col items-center gap-3">
            <Button
              size="lg"
              onClick={() => window.location.reload()}
              className="bg-baro-red px-8 text-white hover:bg-baro-red/80 rounded-full"
            >
              새로고침
            </Button>
            <button
              type="button"
              onClick={() => (window.location.href = '/')}
              className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
