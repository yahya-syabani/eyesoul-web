import { fetchCMS } from "./client";
import { Locale, CMSResponse } from "./types";

export interface Page {
  id: string;
  title: string;
  slug: string;
  heroImage?: any; // eslint-disable-line @typescript-eslint/no-explicit-any -- Media upload
  content: any; // eslint-disable-line @typescript-eslint/no-explicit-any -- Lexical rich text
  seo?: {
    title?: string;
    description?: string;
  };
}

export async function getPageBySlug(slug: string, locale?: Locale): Promise<Page | null> {
  const endpoint = `/pages?where[slug][equals]=${slug}&limit=1`;
  const response = await fetchCMS<CMSResponse<Page>>(endpoint, { locale });
  return response.docs?.[0] || null;
}
