import { Product } from "@/lib/cms/types";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className = "" }: ProductCardProps) {
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
      {/* Image Container - Borderless, Edge-to-Edge */}
      <div className="relative aspect-[4/5] bg-[#F5F5F5] overflow-hidden rounded-sm mb-4">
        <Image
          src={frontImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover object-center transition-opacity duration-700 ${
            angleImage ? "group-hover:opacity-0" : ""
          }`}
        />
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
              New
            </Badge>
          )}
          {product.status?.bestseller && (
            <Badge variant="secondary" className="bg-foreground text-background text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-sm shadow-sm border-none">
              Bestseller
            </Badge>
          )}
        </div>
      </div>
      
      {/* Text Container - Minimalist */}
      <div className="flex flex-col">
        <div className="flex justify-between items-start gap-4">
          <h3 className="font-display font-medium text-base text-foreground group-hover:text-primary/70 transition-colors">
            {product.name}
          </h3>
          {/* Price could go here if added to schema */}
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
