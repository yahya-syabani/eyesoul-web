import { fetchCMS } from './client';
import { CMSResponse, HomepageBanner, Locale } from './types';

/**
 * Fetches all homepage banners sorted by order.
 */
export async function getBanners(locale?: Locale): Promise<HomepageBanner[]> {
  const endpoint = `/homepage-banners?limit=10&sort=order&depth=2`;
  const response = await fetchCMS<CMSResponse<HomepageBanner>>(endpoint, { locale });
  return response.docs || [];
}
