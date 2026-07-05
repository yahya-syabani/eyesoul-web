"use client";

import { useTranslations, useLocale } from 'next-intl';
import { Product } from "@/lib/cms/types";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useWishlist } from "@/lib/hooks/useWishlist";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className = "" }: ProductCardProps) {
  const t = useTranslations('product');
  const locale = useLocale();
  const { toggle, isWishlisted } = useWishlist();
  let frontImage = "/brand-fallback.svg";
  let angleImage = null;

  if (product.images?.front) {
    if (typeof product.images.front === "object" && product.images.front.url) {
      frontImage = product.images.front.url;
    }
  }
  
  if (product.images?.side) {
    if (typeof product.images.side === "object" && product.images.side.url) {
      angleImage = product.images.side.url;
    }
  }

  return (
    <Link href={`/products/${product.slug}`} className={`group block ${className}`}>
      {/* Image Container */}
      <div className="relative aspect-[4/5] bg-[#F5F5F5] overflow-hidden rounded-sm mb-4">
        {frontImage && (
          <Image
            src={frontImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover object-center transition-opacity duration-700 ${
              angleImage ? "group-hover:opacity-0" : ""
            }`}
          />
        )}
        {angleImage && (
          <Image
            src={angleImage}
            alt={`${product.name} alternate angle`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 scale-105"
          />
        )}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.status?.newArrival && (
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-md text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-sm shadow-sm border-none">
              {t('badge.new')}
            </Badge>
          )}
          {product.status?.bestseller && (
            <Badge variant="secondary" className="bg-foreground text-background text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-sm shadow-sm border-none">
              {t('badge.bestseller')}
            </Badge>
          )}
        </div>

        {/* Wishlist Toggle */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(product.id);
          }}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm"
          aria-label={isWishlisted(product.id) ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg
            viewBox="0 0 24 24"
            className={`w-4 h-4 transition-colors ${
              isWishlisted(product.id) ? "fill-red-500 text-red-500" : "fill-none text-neutral-600"
            }`}
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
      
      {/* Text Container */}
      <div className="flex flex-col">
        <div className="flex justify-between items-start gap-4">
          <h3 className="font-display font-medium text-base text-foreground group-hover:text-primary/70 transition-colors">
            {product.name}
          </h3>
          {product.price && (
            <span className="font-display font-medium text-sm text-foreground shrink-0">
              {new Intl.NumberFormat(locale === 'id' ? 'id-ID' : 'en-US', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0,
              }).format(product.price)}
            </span>
          )}
        </div>
        
        <div className="mt-1 flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
          <span>{typeof product.category === 'object' && product.category?.name ? product.category.name : (typeof product.category === 'string' ? product.category.replace('-', ' ') : 'Product')}</span>
          {product.specs?.material && (
            <>
              <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground/40 inline-block" />
              <span>{product.specs.material}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
