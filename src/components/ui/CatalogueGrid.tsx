"use client";

import { Product } from "@/lib/cms/types";
import { MerchandisingBlock } from "@/lib/cms/categories";
import { ProductCard } from "@/components/ui/ProductCard";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";

interface CatalogueGridProps {
  products: Product[];
  merchandisingBlocks?: MerchandisingBlock[];
}

export function CatalogueGrid({ products, merchandisingBlocks = [] }: CatalogueGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-24 text-center border border-dashed border-neutral-200 rounded-xl">
        <h2 className="text-xl font-display text-neutral-400 mb-2">No products found.</h2>
        <p className="text-muted-foreground text-sm">Try adjusting your filters.</p>
      </div>
    );
  }

  // Create a mapping of positionIndex -> block
  const blocksByPosition: Record<number, MerchandisingBlock> = {};
  merchandisingBlocks.forEach((block) => {
    blocksByPosition[block.positionIndex] = block;
  });

  const gridItems: React.ReactNode[] = [];
  
  products.forEach((product, index) => {
    // If there is a merchandising block meant to appear BEFORE this product (using index as position)
    const block = blocksByPosition[index];
    
    if (block) {
      if (block.blockType === "merchandisingBanner") {
        gridItems.push(
          <RevealOnScroll key={`block-${index}`} delay={0.1} className={`mb-4 relative rounded-xl overflow-hidden group ${block.spanTwoCols ? "md:col-span-2 lg:col-span-2 aspect-[16/9] lg:aspect-[2/1]" : "col-span-1 aspect-[4/5]"}`}>
            <Image
              src={block.image?.url || "/brand-fallback.svg"}
              alt={block.title || "Merchandising Banner"}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />
            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
              {block.subtitle && (
                <p className="text-xs uppercase tracking-widest font-semibold mb-2">{block.subtitle}</p>
              )}
              {block.title && (
                <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-medium mb-4">{block.title}</h3>
              )}
              {block.ctaLabel && block.ctaLink && (
                <Link href={block.ctaLink} className="inline-flex items-center gap-2 text-sm font-medium hover:underline underline-offset-4 w-fit">
                  {block.ctaLabel} <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </RevealOnScroll>
        );
      } else if (block.blockType === "merchandisingEditorial") {
        gridItems.push(
          <RevealOnScroll key={`block-${index}`} delay={0.1} className="col-span-1 md:col-span-2 lg:col-span-2 mb-4">
            <div className="rounded-xl p-8 flex flex-col justify-center items-center text-center h-full min-h-[300px]" style={{ backgroundColor: block.backgroundColor || "#f5f5f5" }}>
              <p className="font-display text-2xl md:text-3xl font-medium text-foreground leading-snug mb-6 max-w-2xl">
                &ldquo;{block.quote}&rdquo;
              </p>
              {block.author && (
                <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">— {block.author}</p>
              )}
            </div>
          </RevealOnScroll>
        );
      }
    }

    // Always push the product
    gridItems.push(
      <RevealOnScroll key={product.id} delay={0.1 * (index % 3)} className="h-full">
        <ProductCard product={product} />
      </RevealOnScroll>
    );
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
      {gridItems}
    </div>
  );
}
