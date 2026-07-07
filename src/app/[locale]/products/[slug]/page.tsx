import { getProductBySlug } from "@/lib/cms/products";
import { BuyMarketplaceButton } from "@/components/ui/BuyMarketplaceButton";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Locale } from "@/lib/cms/types";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { extractLexicalText } from "@/lib/utils/lexical";
import { RichText } from "@/components/ui/RichText";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug, locale as Locale);
  const t = await getTranslations({ locale, namespace: 'page.products' });
  if (!product) return { title: t('notFound') };
  return {
    title: `${product.name} - Eyesoul Premium Eyewear`,
    description: product.description ? extractLexicalText(product.description).slice(0, 160) : undefined,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations("Navigation");

  const product = await getProductBySlug(slug, locale as Locale);

  if (!product) {
    notFound();
  }

  // Handle image mapping
  const images = [];
  if (product.images?.front && typeof product.images.front === "object") images.push(product.images.front);
  if (product.images?.side && typeof product.images.side === "object") images.push(product.images.side);
  if (product.images?.lifestyle && typeof product.images.lifestyle === "object") images.push(product.images.lifestyle);

  const mainImage = images.length > 0 ? images[0].url : "/brand-fallback.svg";
  const mainImageAlt = images.length > 0 ? (images[0].alt || product.name) : product.name;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    description: product.description ? extractLexicalText(product.description).slice(0, 300) : undefined,
    brand: typeof product.brand === "object" && product.brand?.name ? {
      "@type": "Brand",
      name: product.brand.name,
    } : undefined,
    offers: {
      "@type": "Offer",
      availability: product.status?.available !== false
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${process.env.FRONTEND_URL || "http://localhost:3001"}/${locale}/products/${product.slug}`,
    },
    image: images.length > 0 ? images[0].url : undefined,
  };

  return (
    <main className="flex-grow bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <div className="container pt-32 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Left: Gallery */}
          <RevealOnScroll className="space-y-4">
            <div className="relative aspect-square bg-neutral-100 rounded-2xl overflow-hidden">
                <Image
                  src={mainImage}
                  alt={mainImageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center"
                  priority
                />
            </div>
            
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative w-24 h-24 flex-shrink-0 bg-neutral-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                    <Image src={img.url} alt={img.alt || product.name} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </RevealOnScroll>

          {/* Right: Info */}
          <RevealOnScroll delay={0.2} className="flex flex-col pt-4 lg:pt-12">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
              {typeof product.category === 'object' ? product.category.name : (typeof product.category === 'string' ? product.category.replace('-', ' ') : 'Category')}
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-medium mb-6">
              {product.name}
            </h1>

            <div className="prose prose-neutral mb-10">
              <RichText data={product.description} />
            </div>

            {/* Specifications */}
            {product.specs && (
              <div className="mb-10">
                <h3 className="font-display text-xl mb-4">Specifications</h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  {product.specs.material && (
                    <div className="flex justify-between border-b pb-2"><dt className="text-muted-foreground">Material</dt><dd className="font-medium text-right">{product.specs.material}</dd></div>
                  )}
                  {product.specs.shape && (
                    <div className="flex justify-between border-b pb-2"><dt className="text-muted-foreground">Shape</dt><dd className="font-medium text-right">{product.specs.shape}</dd></div>
                  )}
                  {product.specs.color && (
                    <div className="flex justify-between border-b pb-2"><dt className="text-muted-foreground">Color</dt><dd className="font-medium text-right">{product.specs.color}</dd></div>
                  )}
                  {product.specs.lensWidthMm && (
                    <div className="flex justify-between border-b pb-2"><dt className="text-muted-foreground">Lens Width</dt><dd className="font-medium text-right">{product.specs.lensWidthMm} mm</dd></div>
                  )}
                  {product.specs.bridgeWidthMm && (
                    <div className="flex justify-between border-b pb-2"><dt className="text-muted-foreground">Bridge</dt><dd className="font-medium text-right">{product.specs.bridgeWidthMm} mm</dd></div>
                  )}
                  {product.specs.templeLengthMm && (
                    <div className="flex justify-between border-b pb-2"><dt className="text-muted-foreground">Temple Length</dt><dd className="font-medium text-right">{product.specs.templeLengthMm} mm</dd></div>
                  )}
                </dl>
              </div>
            )}

            {/* Actions — Desktop */}
            <div className="mt-auto space-y-4 hidden lg:block">
              <BuyMarketplaceButton links={product.marketplaceLinks} />
            </div>
          </RevealOnScroll>

          {/* Mobile Sticky CTA Bar */}
          <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-xl border-t border-neutral-200 px-4 py-3 safe-bottom">
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground truncate">{product.name}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                {product.marketplaceLinks?.filter((l: any) => l.inStock).slice(0, 2).map((link: any) => (
                  <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-neutral-900 text-white px-4 py-2 text-xs font-medium uppercase tracking-wide rounded-sm hover:bg-neutral-800 transition-colors">
                    Buy {link.platform === 'tokopedia' ? 'Tokopedia' : link.platform === 'shopee' ? 'Shopee' : 'Now'}
                  </a>
                ))}
                {(!product.marketplaceLinks || product.marketplaceLinks.length === 0) && (
                  <a href="/contact" className="inline-flex items-center justify-center bg-neutral-900 text-white px-4 py-2 text-xs font-medium uppercase tracking-wide rounded-sm">
                    Inquire
                  </a>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Related Products */}
      {(() => {
        const related = product.relatedProducts;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const items: { id: number; slug: string; name: string; images?: { front?: { url?: string } } }[] = Array.isArray(related) ? (related.filter((r) => typeof r === 'object' && r !== null) as any[]) : [];
        if (items.length === 0) return null;
        return (
          <section className="container pt-16 pb-8 border-t border-neutral-100">
            <RevealOnScroll>
              <h2 className="font-display text-2xl md:text-3xl font-light mb-8">Complete the Look</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                {items.slice(0, 4).map((rp) => {
                const imgUrl = rp.images?.front?.url ? rp.images.front.url : '/brand-fallback.svg';
                  return (
                    <Link key={rp.id} href={`/products/${rp.slug}`} className="group block">
                      <div className="relative aspect-square bg-neutral-100 rounded-lg overflow-hidden mb-3">
                        <Image src={imgUrl} alt={rp.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                      <h3 className="font-display font-medium text-sm group-hover:text-primary/70 transition-colors">{rp.name}</h3>
                    </Link>
                  );
                })}
              </div>
            </RevealOnScroll>
          </section>
        );
      })()}

      {/* Related Articles */}
      {(() => {
        const related = product.relatedArticles;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const items: { id: number; slug: string; title: string; excerpt?: string; coverImage?: { url?: string } }[] = Array.isArray(related) ? (related.filter((r) => typeof r === 'object' && r !== null) as any[]) : [];
        if (items.length === 0) return null;
        return (
          <section className="container pb-20">
            <RevealOnScroll>
              <h2 className="font-display text-2xl md:text-3xl font-light mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {items.slice(0, 3).map((ra) => {
                  const imgUrl = ra.coverImage && typeof ra.coverImage === 'object' ? ra.coverImage.url : null;
                  return (
                    <Link key={ra.id} href={`/articles/${ra.slug}`} className="group block">
                      <div className="relative aspect-[16/10] bg-neutral-100 rounded-lg overflow-hidden mb-3">
                        {imgUrl ? <Image src={imgUrl} alt={ra.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" /> : <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">No Image</div>}
                      </div>
                      <h3 className="font-display font-medium group-hover:text-primary/70 transition-colors">{ra.title}</h3>
                      {ra.excerpt && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{ra.excerpt}</p>}
                    </Link>
                  );
                })}
              </div>
            </RevealOnScroll>
          </section>
        );
      })()}
    </main>
  );
}
