import { Link } from "@/i18n/routing";

export default function NotFound() {
  return (
    <main className="flex-grow flex items-center justify-center bg-background">
      <div className="text-center px-4 py-24">
        <h1 className="font-display text-6xl font-medium mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium hover:bg-primary/80 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
