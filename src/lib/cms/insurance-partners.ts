import { fetchCMS } from './client';
import { CMSResponse, InsurancePartner, Locale } from './types';

/**
 * Fetches all active insurance partners.
 */
export async function getInsurancePartners(locale?: Locale): Promise<InsurancePartner[]> {
  try {
    const endpoint = `/insurance-partners?where[active][equals]=true&sort=order&limit=50`;
    const response = await fetchCMS<CMSResponse<InsurancePartner>>(endpoint, { 
      locale,
      next: { revalidate: 86400 }
    });

    if (!response || !response.docs) {
      return [];
    }
    
    return response.docs;
  } catch (error) {
    console.error('Failed to fetch insurance partners:', error);
    return [];
  }
}
