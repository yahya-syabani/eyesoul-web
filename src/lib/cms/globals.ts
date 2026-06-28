import { fetchCMS } from './client';
import { SiteSettings, Locale } from './types';

export async function getSiteSettings(locale?: Locale): Promise<SiteSettings | null> {
  const endpoint = `/globals/site-settings`;
  try {
    return await fetchCMS<SiteSettings>(endpoint, { locale });
  } catch (e) {
    console.error("Failed to fetch Site Settings", e);
    return null;
  }
}
