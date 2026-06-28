import { getProductBySlug } from "@/lib/cms/products";
import { BuyMarketplaceButton } from "@/components/ui/BuyMarketplaceButton";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Locale, Product } from "@/lib/cms/types";
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
  if (!product) return { title: "Product Not Found" };
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

  return (
    <main className="flex-grow bg-background">
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

            {/* Actions */}
            <div className="mt-auto space-y-4">
              <BuyMarketplaceButton links={product.marketplaceLinks} />
            </div>
          </RevealOnScroll>

        </div>
      </div>
    </main>
  );
}
