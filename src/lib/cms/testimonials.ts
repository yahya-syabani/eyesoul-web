import { fetchCMS } from './client';
import { CMSResponse, Testimonial, Locale } from './types';

/**
 * Fetches all testimonials.
 */
export async function getTestimonials(locale?: Locale): Promise<Testimonial[]> {
  const endpoint = `/testimonials?limit=50`;
  const response = await fetchCMS<CMSResponse<Testimonial>>(endpoint, { locale });
  return response.docs || [];
}
