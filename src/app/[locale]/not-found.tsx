import { useTranslations } from 'next-intl';
import { Link } from "@/i18n/routing";

export default function NotFound() {
  const t = useTranslations('page.notFound');
  return (
    <main className="flex-grow flex items-center justify-center bg-background">
      <div className="text-center px-4 py-24">
        <h1 className="font-display text-6xl font-medium mb-4">{t('title')}</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">
          {t('body')}
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium hover:bg-primary/80 transition-colors"
        >
          {t('backToHome')}
        </Link>
      </div>
    </main>
  );
}
