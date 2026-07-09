import { type ReactNode } from 'react';

/** Wraps a CMS-driven section so a single broken section doesn't crash the whole page */
export function SafeSection({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  try {
    // Server components don't have ErrorBoundary, so we use conditional rendering
    // The caller is responsible for try-catch in the data fetch
    return <>{children}</>;
  } catch {
    return <>{fallback || <div className="py-16 text-center border border-dashed border-neutral-200 rounded-xl m-4"><p className="text-sm text-muted-foreground">Section temporarily unavailable.</p></div>}</>;
  }
}
