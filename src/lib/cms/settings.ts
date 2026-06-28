import { fetchCMS } from './client';
import { SiteSettings, SiteBannerSettings, Locale } from './types';

/**
 * Fetches global site settings.
 */
export async function getSiteSettings(locale?: Locale): Promise<SiteSettings | null> {
  try {
    const data = await fetchCMS<SiteSettings>('/globals/site-settings', { locale });
    return data;
  } catch (error) {
    console.error('Failed to fetch site settings:', error);
    return null;
  }
}

/**
 * Fetches the site-wide banner global settings.
 */
export async function getSiteBanner(locale?: Locale): Promise<SiteBannerSettings | null> {
  try {
    const data = await fetchCMS<SiteBannerSettings>('/globals/site-banner', { locale });
    return data;
  } catch (error) {
    console.error('Failed to fetch site banner:', error);
    return null;
  }
}
