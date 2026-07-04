import { fetchCMS } from './client';
import { CMSResponse, Locale } from './types';

export interface MerchandisingBlock {
  blockType: 'merchandisingBanner' | 'merchandisingEditorial';
  positionIndex: number;
  // Banner fields
  title?: string;
  subtitle?: string;
  image?: any; // eslint-disable-line @typescript-eslint/no-explicit-any -- Media upload
  ctaLabel?: string;
  ctaLink?: string;
  spanTwoCols?: boolean;
  // Editorial fields
  quote?: string;
  author?: string;
  backgroundColor?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  heroImage?: any; // eslint-disable-line @typescript-eslint/no-explicit-any -- Media upload
  merchandising?: MerchandisingBlock[];
}

export async function getCategoryBySlug(slug: string, locale?: Locale): Promise<Category | null> {
  const endpoint = `/categories?where[slug][equals]=${slug}&limit=1`;
  const response = await fetchCMS<CMSResponse<Category>>(endpoint, { locale });

  if (response.docs && response.docs.length > 0) {
    return response.docs[0];
  }
  return null;
}

export async function getCategories(locale?: Locale): Promise<Category[]> {
  const endpoint = `/categories?limit=100`;
  const response = await fetchCMS<CMSResponse<Category>>(endpoint, { locale });
  return response.docs || [];
}
