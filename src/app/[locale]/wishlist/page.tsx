import { getProducts } from "@/lib/cms/products";
import { Locale } from "@/lib/cms/types";
import { getTranslations } from 'next-intl/server';
import { PageHero } from "@/components/ui/PageHero";
import { WishlistClient } from "./WishlistClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Header' });
  return {
    title: `${t('wishlist')} - Eyesoul Premium Eyewear`,
    description: "Your saved eyewear collection.",
  };
}

export default async function WishlistPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Header' });

  return (
    <main className="flex-grow bg-background">
      <PageHero
        title={t('wishlist')}
        subtitle="Your Saved Collection"
        imageUrl="https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=2940&auto=format&fit=crop"
        imageAlt="Wishlist"
        height="standard"
        overlayOpacity={0.4}
      />
      <div className="container py-16 md:py-24">
        <WishlistClient locale={locale} />
      </div>
    </main>
  );
}
