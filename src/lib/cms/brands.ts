import { fetchCMS } from './client';
import { CMSResponse, Brand, Locale } from './types';

/**
 * Fetches a list of brands.
 */
export async function getBrands(locale?: Locale): Promise<Brand[]> {
  const endpoint = `/brands?limit=100`;
  const response = await fetchCMS<CMSResponse<Brand>>(endpoint, { locale });
  return response.docs || [];
}

/**
 * Fetches a single brand by its slug.
 */
export async function getBrandBySlug(slug: string, locale?: Locale): Promise<Brand | null> {
  const endpoint = `/brands?where[slug][equals]=${slug}&limit=1`;
  const response = await fetchCMS<CMSResponse<Brand>>(endpoint, { locale });
  return response.docs?.[0] || null;
}
