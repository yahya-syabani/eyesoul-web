import { Brand, Media } from '../types';

export interface BrandViewModel {
  id: number;
  name: string;
  slug: string;
  country: string;
  designPhilosophy: string;
  coverUrl: string;
  story: string;
}

export function mapBrand(raw: Brand): BrandViewModel {
  const getUrl = (media: number | Media | null | undefined): string =>
    media && typeof media === 'object' && media.url ? media.url : '';

  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    country: raw.country || 'Global',
    designPhilosophy: raw.designPhilosophy || '',
    coverUrl: getUrl(raw.coverImage),
    story: raw.story || '',
  };
}
