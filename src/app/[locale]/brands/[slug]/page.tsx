import { getBrandBySlug } from "@/lib/cms/brands";
import { getProducts } from "@/lib/cms/products";
import { Locale } from "@/lib/cms/types";
import { notFound } from "next/navigation";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { ProductCard } from "@/components/ui/ProductCard";
import { CatalogueGrid } from "@/components/ui/CatalogueGrid";
import { extractLexicalText } from "@/lib/utils/lexical";
import { RichText } from "@/components/ui/RichText";
import { Link } from "@/i18n/routing";
import { ChevronRight } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const brand = await getBrandBySlug(slug, locale as Locale);
  if (!brand) return { title: "Brand Not Found" };
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
  
  const brand = await getBrandBySlug(slug, locale as Locale);
  if (!brand) notFound();

  // Fetch products that belong to this brand
  const productsRes = await getProducts({ locale: locale as Locale, brandId: brand.id, limit: 20 });
  const products = productsRes.docs || [];

  return (
    <main className="flex-grow bg-background">
      {/* Brand Hero/Info */}
      <section className="bg-neutral-50/50 pt-32 pb-16 md:pt-40 md:pb-24 border-b border-neutral-100">
        <div className="container mx-auto px-4">
          <RevealOnScroll className="max-w-3xl mx-auto text-center">
            <p className="text-sm text-muted-foreground uppercase tracking-widest mb-3 font-medium">
              {brand.country || "Global Heritage"}
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium mb-8">
              {brand.name}
            </h1>
            
            {brand.story && (
              <p className="text-xl md:text-2xl font-light text-neutral-700 leading-relaxed mb-10">
                "{brand.story}"
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

      {/* Products Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <RevealOnScroll className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-medium mb-2">The Collection</h2>
              <p className="text-muted-foreground">
                Discover frames designed by {brand.name}.
              </p>
            </div>
            <div className="text-sm text-muted-foreground bg-neutral-100 px-3 py-1 rounded-full">
              {products.length} Products
            </div>
          </RevealOnScroll>

          {/* Product Grid */}
          <CatalogueGrid products={products} />
        </div>
      </section>
    </main>
  );
}
