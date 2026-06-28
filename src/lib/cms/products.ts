import { fetchCMS } from './client';
import { CMSResponse, Product, Locale } from './types';

/**
 * Fetches a list of products with optional query parameters.
 */
export async function getProducts(options?: {
  locale?: Locale;
  limit?: number;
  page?: number;
  categorySlug?: string;
  brandId?: number;
  collectionId?: number;
  material?: string;
  shape?: string;
  gender?: string;
}): Promise<CMSResponse<Product>> {
  const params = new URLSearchParams();
  
  if (options?.limit) params.append('limit', options.limit.toString());
  if (options?.page) params.append('page', options.page.toString());
  
  if (options?.categorySlug) {
    // category is now a relation, we query the nested slug
    params.append('where[category.slug][equals]', options.categorySlug);
  }
  
  if (options?.brandId) {
    params.append('where[brand][equals]', options.brandId.toString());
  }

  if (options?.collectionId) {
    params.append('where[collections][equals]', options.collectionId.toString());
  }

  if (options?.material) {
    params.append('where[specs.material][equals]', options.material);
  }

  if (options?.shape) {
    params.append('where[specs.shape][equals]', options.shape);
  }

  if (options?.gender) {
    params.append('where[specs.gender][equals]', options.gender);
  }

  const queryString = params.toString();
  const endpoint = `/products${queryString ? `?${queryString}` : ''}`;

  return fetchCMS<CMSResponse<Product>>(endpoint, { locale: options?.locale });
}

/**
 * Fetches a single product by its slug.
 */
export async function getProductBySlug(slug: string, locale?: Locale): Promise<Product | null> {
  // We use the `where` query to find a product by slug
  const endpoint = `/products?where[slug][equals]=${slug}`;
  const response = await fetchCMS<CMSResponse<Product>>(endpoint, { locale });

  if (response.docs && response.docs.length > 0) {
    return response.docs[0];
  }
  return null;
}

/**
 * Fetches products marked as new arrivals.
 */
export async function getNewArrivals(locale?: Locale, limit = 4): Promise<Product[]> {
  const endpoint = `/products?where[status.newArrival][equals]=true&limit=${limit}`;
  const response = await fetchCMS<CMSResponse<Product>>(endpoint, { locale });
  return response.docs;
}

/**
 * Fetches featured/bestseller products.
 */
export async function getBestsellers(locale?: Locale, limit = 4): Promise<Product[]> {
  const endpoint = `/products?where[status.bestseller][equals]=true&limit=${limit}`;
  const response = await fetchCMS<CMSResponse<Product>>(endpoint, { locale });
  return response.docs;
}
