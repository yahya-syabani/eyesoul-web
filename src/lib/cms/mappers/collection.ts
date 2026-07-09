import { EyewearCollection, Media } from '../types';

export interface CollectionViewModel {
  id: number;
  name: string;
  slug: string;
  description: string;
  coverUrl: string;
}

export function mapCollection(raw: EyewearCollection): CollectionViewModel {
  const getUrl = (media: number | Media | null | undefined): string =>
    media && typeof media === 'object' && media.url ? media.url : '';

  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    description: raw.description || '',
    coverUrl: getUrl(raw.coverImage),
  };
}
