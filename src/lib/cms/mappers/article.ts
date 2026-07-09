import { Article, Media } from '../types';

export interface ArticleViewModel {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverUrl: string;
  publishedAt: string;
  authorName: string;
}

export function mapArticle(raw: Article): ArticleViewModel {
  const getUrl = (media: number | Media | null | undefined): string =>
    media && typeof media === 'object' && media.url ? media.url : '';

  const author = typeof raw.author === 'object' && raw.author !== null ? raw.author : null;

  return {
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    excerpt: raw.excerpt || '',
    coverUrl: getUrl(raw.coverImage),
    publishedAt: raw.publishedAt || '',
    authorName: author?.name || 'Eyesoul Team',
  };
}
