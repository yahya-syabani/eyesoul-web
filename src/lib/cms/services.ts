import { fetchCMS } from './client';
import { CMSResponse, Service, Locale } from './types';

/**
 * Fetches a list of optical services.
 */
export async function getServices(locale?: Locale): Promise<Service[]> {
  try {
    const endpoint = `/services?limit=100`;
    const response = await fetchCMS<CMSResponse<Service>>(endpoint, { locale });
    return response.docs || [];
  } catch (error) {
    console.warn('Failed to fetch services:', error);
    return [];
  }
}

/**
 * Fetches a single service by its slug.
 */
export async function getServiceBySlug(slug: string, locale?: Locale): Promise<Service | null> {
  const endpoint = `/services?where[slug][equals]=${slug}&limit=1`;
  const response = await fetchCMS<CMSResponse<Service>>(endpoint, { locale });
  return response.docs?.[0] || null;
}
