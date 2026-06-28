import { fetchCMS } from './client';
import { CMSResponse, EyewearCollection, Locale } from './types';

/**
 * Fetches a list of collections.
 */
export async function getCollections(locale?: Locale): Promise<EyewearCollection[]> {
  const endpoint = `/eyewear-collections?limit=100`;
  const response = await fetchCMS<CMSResponse<EyewearCollection>>(endpoint, { locale });
  return response.docs || [];
}

/**
 * Fetches a single collection by its slug.
 */
export async function getCollectionBySlug(slug: string, locale?: Locale): Promise<EyewearCollection | null> {
  const endpoint = `/eyewear-collections?where[slug][equals]=${slug}&limit=1`;
  const response = await fetchCMS<CMSResponse<EyewearCollection>>(endpoint, { locale });
  return response.docs?.[0] || null;
}
