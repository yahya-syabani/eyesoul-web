import { Product, Media } from '../types';

/** Clean view model for a product — safe to pass to any UI component */
export interface ProductViewModel {
  id: number;
  name: string;
  slug: string;
  sku: string;
  price?: number;
  categoryName: string;
  categorySlug: string;
  brandName: string;
  brandSlug: string;
  frontImage: string;
  sideImage: string | null;
  isNewArrival: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  isAvailable: boolean;
  material?: string;
  shape?: string;
  color?: string;
  marketplaceLinks: { platform: string; url: string; inStock: boolean }[];
}

export function mapProduct(raw: Product): ProductViewModel {
  const cat =
    typeof raw.category === 'object' && raw.category !== null
      ? raw.category
      : null;
  const brand =
    typeof raw.brand === 'object' && raw.brand !== null
      ? raw.brand
      : null;

  const getUrl = (media: number | Media | null | undefined): string =>
    media && typeof media === 'object' && media.url ? media.url : '';

  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    sku: raw.sku,
    price: raw.price,
    categoryName: cat?.name || 'Uncategorized',
    categorySlug: cat?.slug || '',
    brandName: brand?.name || 'Eyesoul',
    brandSlug: brand?.slug || '',
    frontImage: getUrl(raw.images?.front),
    sideImage: getUrl(raw.images?.side) || null,
    isNewArrival: raw.status?.newArrival || false,
    isFeatured: raw.status?.featured || false,
    isBestseller: raw.status?.bestseller || false,
    isAvailable: raw.status?.available !== false,
    material: raw.specs?.material,
    shape: raw.specs?.shape,
    color: raw.specs?.color,
    marketplaceLinks: (raw.marketplaceLinks || []).map(l => ({
      platform: l.platform,
      url: l.url,
      inStock: l.inStock,
    })),
  };
}
