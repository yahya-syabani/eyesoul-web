import { fetchCMS } from './client';
import { CMSResponse, StoreLocation, Locale } from './types';

/**
 * Fetches a list of store locations.
 */
export async function getStores(locale?: Locale): Promise<StoreLocation[]> {
  const endpoint = `/store-locations?limit=100`;
  const response = await fetchCMS<CMSResponse<StoreLocation>>(endpoint, { locale });
  return response.docs || [];
}
