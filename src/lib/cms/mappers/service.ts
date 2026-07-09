import { Service, Media } from '../types';

export interface ServiceViewModel {
  id: number;
  name: string;
  slug: string;
  description: string;
  duration: string;
  pricing: string;
  ctaLabel: string;
  coverUrl: string;
}

export function mapService(raw: Service): ServiceViewModel {
  const getUrl = (media: number | Media | null | undefined): string =>
    media && typeof media === 'object' && media.url ? media.url : '';

  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    description: raw.description || '',
    duration: raw.duration || '',
    pricing: raw.pricing || '',
    ctaLabel: raw.ctaLabel || 'Learn More',
    coverUrl: getUrl(raw.coverImage),
  };
}
