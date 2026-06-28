import { fetchCMS } from './client';
import { CMSResponse, Article, Locale } from './types';

/**
 * Fetches a list of published articles.
 */
export async function getArticles(locale?: Locale): Promise<Article[]> {
  const endpoint = `/articles?limit=100`; // the CMS access control already filters out drafts for public users
  const response = await fetchCMS<CMSResponse<Article>>(endpoint, { locale });
  return response.docs || [];
}

/**
 * Fetches a single article by its slug.
 */
export async function getArticleBySlug(slug: string, locale?: Locale): Promise<Article | null> {
  const endpoint = `/articles?where[slug][equals]=${slug}&limit=1`;
  const response = await fetchCMS<CMSResponse<Article>>(endpoint, { locale });
  return response.docs?.[0] || null;
}
