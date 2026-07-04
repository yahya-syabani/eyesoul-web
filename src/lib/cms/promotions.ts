import { fetchCMS } from './client';
import { CMSResponse, Locale, Media } from './types';

export interface Promotion {
  id: number;
  title: string;
  description?: string;
  bannerImage?: number | Media;
  active?: boolean;
  startDate?: string;
  endDate?: string;
}

export async function getActivePromotions(locale?: Locale): Promise<Promotion[]> {
  const endpoint = `/promotions?where[active][equals]=true&limit=10&sort=-createdAt`;
  try {
    const response = await fetchCMS<CMSResponse<Promotion>>(endpoint, { locale });
    return response.docs || [];
  } catch {
    return [];
  }
}
