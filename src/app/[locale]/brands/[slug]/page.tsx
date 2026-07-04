import { getBrandBySlug } from "@/lib/cms/brands";
import { getProducts } from "@/lib/cms/products";
import { Locale } from "@/lib/cms/types";
import { getTranslations } from 'next-intl/server';
import { notFound } from "next/navigation";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { ProductCard } from "@/components/ui/ProductCard";
import { CatalogueGrid } from "@/components/ui/CatalogueGrid";
import { extractLexicalText } from "@/lib/utils/lexical";
import { RichText } from "@/components/ui/RichText";
import { Link } from "@/i18n/routing";
import { ChevronRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const brand = await getBrandBySlug(slug, locale as Locale);
  const t = await getTranslations({ locale, namespace: 'page.brands' });
  if (!brand) return { title: t('notFound') };
  return {
    title: `${brand.name} - Eyesoul Premium Eyewear`,
    description: brand.story?.slice(0, 160),
  };
}

export default async function BrandDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'page.brands' });
  
  const brand = await getBrandBySlug(slug, locale as Locale);
  if (!brand) notFound();

  // Fetch products that belong to this brand
  const productsRes = await getProducts({ locale: locale as Locale, brandId: brand.id, limit: 20 });
  const products = productsRes.docs || [];

  return (
    <main className="flex-grow bg-background">
      <PageHero
        title={brand.name}
        subtitle={brand.country || t('globalHeritage')}
        imageUrl="https://images.unsplash.com/photo-1555529771-835f59fc5efe?q=80&w=2960&auto=format&fit=crop"
        imageAlt="Brand Heritage"
        height="standard"
        overlayOpacity={0.5}
      />

      {/* Brand Story / History */}
      {(brand.story || brand.history) && (
        <section className="py-16 md:py-24 border-b border-neutral-100 bg-neutral-50/30">
          <div className="container mx-auto px-4">
            <RevealOnScroll className="max-w-3xl mx-auto text-center">
              {brand.story && (
                <p className="text-xl md:text-2xl font-light text-neutral-700 leading-relaxed mb-10">
                  &ldquo;{brand.story}&rdquo;
                </p>
              )}

              {brand.history && (
                <div className="prose prose-neutral mx-auto text-left">
                  <RichText data={brand.history} />
                </div>
              )}
            </RevealOnScroll>
          </div>
        </section>
      )}

      {/* Products Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <RevealOnScroll className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-medium mb-2">{t('theCollection')}</h2>
              <p className="text-muted-foreground">
                {t('discoverFrames', { brand: brand.name })}
              </p>
            </div>
            <div className="text-sm text-muted-foreground bg-neutral-100 px-3 py-1 rounded-full">
              {products.length} {t('products')}
            </div>
          </RevealOnScroll>

          {/* Product Grid */}
          <CatalogueGrid products={products} />
        </div>
      </section>
    </main>
  );
}
