"use client";

import { useState, useEffect, startTransition } from "react";
import { Product } from "@/lib/cms/types";
import { ProductCard } from "@/components/ui/ProductCard";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/hooks/useWishlist";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3000';

interface WishlistClientProps {
  locale: string;
}

export function WishlistClient({ locale }: WishlistClientProps) {
  const { wishlist, clear } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products from wishlist IDs
  const ids = wishlist.join(',');

  useEffect(() => {
    if (wishlist.length === 0) {
      startTransition(() => {
        setProducts([]);
        setIsLoading(false);
      });
      return;
    }

    startTransition(() => setIsLoading(true));
    fetch(`${CMS_URL}/api/products?depth=0&limit=50&where[id][in]=${ids}&locale=${locale}`)
      .then(res => res.json())
      .then(data => setProducts(data.docs || []))
      .catch(() => setProducts([]))
      .finally(() => startTransition(() => setIsLoading(false)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wishlist, locale]);

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-24 text-center border border-dashed rounded-xl border-neutral-300">
        <Heart className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
        <h2 className="text-2xl font-display text-neutral-400 mb-2">Your wishlist is empty</h2>
        <p className="text-sm text-muted-foreground">Save products you love by tapping the heart icon.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8 border-b border-neutral-100 pb-4">
        <p className="text-sm text-muted-foreground">
          {products.length} {products.length === 1 ? 'item' : 'items'} saved
        </p>
        <button
          onClick={clear}
          className="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
        >
          Clear all
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {products.map((product, index) => (
          <RevealOnScroll key={product.id} delay={0.1 * (index % 4)}>
            <ProductCard product={product} />
          </RevealOnScroll>
        ))}
      </div>
    </div>
  );
}
