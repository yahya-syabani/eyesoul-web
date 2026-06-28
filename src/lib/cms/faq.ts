import { fetchCMS } from './client';
import { CMSResponse, FAQItem, Locale } from './types';

/**
 * Fetches all FAQs sorted by order.
 */
export async function getFAQs(locale?: Locale): Promise<FAQItem[]> {
  const endpoint = `/faq?limit=100&sort=order`;
  const response = await fetchCMS<CMSResponse<FAQItem>>(endpoint, { locale });
  return response.docs || [];
}
