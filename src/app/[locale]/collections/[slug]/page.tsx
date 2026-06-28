import { getCollectionBySlug } from "@/lib/cms/collections";
import { getProducts } from "@/lib/cms/products";
import { Locale } from "@/lib/cms/types";
import { notFound } from "next/navigation";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { ProductCard } from "@/components/ui/ProductCard";
import { CatalogueGrid } from "@/components/ui/CatalogueGrid";
import { Link } from "@/i18n/routing";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const collection = await getCollectionBySlug(slug, locale as Locale);
  if (!collection) return { title: "Collection Not Found" };
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
  
  const collection = await getCollectionBySlug(slug, locale as Locale);
  if (!collection) notFound();

  // Fetch products that belong to this collection
  const productsRes = await getProducts({ locale: locale as Locale, collectionId: collection.id, limit: 20 });
  const products = productsRes.docs || [];

  let coverUrl = "/placeholder.png";
  let coverAlt = collection.name;
  if (collection.coverImage && typeof collection.coverImage === 'object' && collection.coverImage.url) {
    coverUrl = collection.coverImage.url;
    if (collection.coverImage.alt) coverAlt = collection.coverImage.alt;
  }

  return (
    <main className="flex-grow bg-background">
      {/* Hero with Parallax/Fade Effect */}
      <section className="relative h-[60vh] min-h-[400px] w-full flex items-center justify-center bg-black overflow-hidden">
        {coverUrl !== "/placeholder.png" && (
          <Image 
            src={coverUrl}
            alt={coverAlt}
            fill
            className="object-cover opacity-60"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-90" />
        
        <RevealOnScroll className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <p className="text-sm text-primary uppercase tracking-[0.3em] mb-4 font-medium">
            Curated Edit
          </p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-medium mb-6 text-foreground">
            {collection.name}
          </h1>
          {collection.description && (
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {collection.description}
            </p>
          )}
        </RevealOnScroll>
      </section>

      {/* Products Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <RevealOnScroll className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-100 pb-6">
            <div>
              <h2 className="font-display text-3xl font-medium mb-2">Shop the Edit</h2>
            </div>
            <div className="text-sm text-muted-foreground">
              {products.length} {products.length === 1 ? 'Product' : 'Products'}
            </div>
          </RevealOnScroll>

          {/* Product Grid */}
          <CatalogueGrid products={products} />
        </div>
      </section>
    </main>
  );
}
