import { getCollectionBySlug } from "@/lib/cms/collections";
import { getProducts } from "@/lib/cms/products";
import { Locale } from "@/lib/cms/types";
import { getTranslations } from 'next-intl/server';
import { notFound } from "next/navigation";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { ProductCard } from "@/components/ui/ProductCard";
import { CatalogueGrid } from "@/components/ui/CatalogueGrid";
import { Link } from "@/i18n/routing";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { getMediaUrl } from "@/lib/utils/media";
import { PageHero } from "@/components/ui/PageHero";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const collection = await getCollectionBySlug(slug, locale as Locale);
  const t = await getTranslations({ locale, namespace: 'page.collections' });
  if (!collection) return { title: t('notFound') };
  return {
    title: `${collection.name} - Eyesoul Premium Eyewear`,
    description: collection.description?.slice(0, 160),
  };
}

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'page.collections' });
  
  const collection = await getCollectionBySlug(slug, locale as Locale);
  if (!collection) notFound();

  // Fetch products that belong to this collection
  const productsRes = await getProducts({ locale: locale as Locale, collectionId: collection.id, limit: 20 });
  const products = productsRes.docs || [];

  let coverUrl = "/placeholder.png";
  let coverAlt = collection.name;
  coverUrl = getMediaUrl(collection.coverImage, "/placeholder.png");
  if (collection.coverImage && typeof collection.coverImage === 'object' && collection.coverImage.alt) coverAlt = collection.coverImage.alt;

  return (
    <main className="flex-grow bg-background">
      <PageHero
        title={collection.name}
        subtitle={t('hero.subtitle')}
        imageUrl={coverUrl}
        imageAlt={coverAlt}
        height="standard"
        overlayOpacity={0.6}
      />

      {/* Products Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <RevealOnScroll className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-100 pb-6">
            <div>
              <h2 className="font-display text-3xl font-medium mb-2">{t('shopTheEdit')}</h2>
            </div>
            <div className="text-sm text-muted-foreground">
              {products.length} {products.length === 1 ? t('product') : t('products')}
            </div>
          </RevealOnScroll>

          {/* Product Grid */}
          <CatalogueGrid products={products} />
        </div>
      </section>
    </main>
  );
}
