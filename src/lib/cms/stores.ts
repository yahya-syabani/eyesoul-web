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

/**
 * Fetches a single store by its ID.
 */
export async function getStoreById(id: string | number, locale?: Locale): Promise<StoreLocation | null> {
  const endpoint = `/store-locations/${id}`;
  try {
    const store = await fetchCMS<StoreLocation>(endpoint, { locale });
    return store;
  } catch (error) {
    return null;
  }
}
