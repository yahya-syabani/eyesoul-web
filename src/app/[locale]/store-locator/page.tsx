import { getStores } from "@/lib/cms/stores";
import { StoreLocatorClient } from "./StoreLocatorClient";
import { Locale } from "@/lib/cms/types";
import { getTranslations } from 'next-intl/server';
import { PageHero } from "@/components/ui/PageHero";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'page.stores' });
  return { title: t('meta.title'), description: t('meta.description') };
}

export default async function StoreLocatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'page.stores' });
  
  // Fetch store locations server-side (great for SEO and initial load)
  const stores = await getStores(locale as Locale);

  return (
    <main className="flex-grow bg-background">
      <PageHero
        title={t('hero.title')}
        subtitle={t('hero.subtitle')}
        imageUrl="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=2960&auto=format&fit=crop"
        imageAlt="Eyewear display on modern shelving"
        height="standard"
        overlayOpacity={0.4}
      />
      {/* 
        We pass the server-fetched stores to our client component.
        This enables interactive mapping while keeping the initial data load fast and crawlable.
      */}
      <StoreLocatorClient stores={stores} />
    </main>
  );
}
