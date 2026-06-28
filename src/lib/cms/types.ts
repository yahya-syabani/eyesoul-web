export type Locale = 'en' | 'id';

export interface CMSResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface Media {
  id: number;
  alt?: string;
  url: string;
  filename: string;
  mimeType: string;
  filesize: number;
  width?: number;
  height?: number;
}

export interface Product {
  id: number;
  name: string; // Note: Currently returning as stringified JSON from seed
  slug: string;
  brand: number | Brand;
  category: number | import('./categories').Category | string;
  collections?: number[] | EyewearCollection[];
  sku: string;
  description: any; // Lexical rich text
  specs?: {
    material?: string;
    shape?: string;
    color?: string;
    gender?: string;
    lensWidthMm?: number;
    bridgeWidthMm?: number;
    templeLengthMm?: number;
  };
  images?: {
    front?: number | Media;
    side?: number | Media;
    lifestyle?: number | Media;
    onFace?: number | Media;
  };
  status?: {
    newArrival?: boolean;
    featured?: boolean;
    bestseller?: boolean;
    available?: boolean;
  };
  marketplaceLinks?: {
    platform: 'tokopedia' | 'shopee';
    url: string;
    inStock: boolean;
  }[];
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  history?: any;
  story?: string;
  country?: string;
  designPhilosophy?: string;
}

export interface EyewearCollection {
  id: number;
  name: string;
  slug: string;
  description?: string;
  coverImage?: number | Media;
}

export interface StoreLocation {
  id: number;
  name: string;
  address: string;
  lat?: number;
  lng?: number;
  phone?: string;
  whatsapp?: string;
  hours?: {
    day: string;
    open: string;
    close: string;
  }[];
  servicesOffered?: any[];
  hasParking?: boolean;
  images?: { image: number | Media }[];
}

export interface Service {
  id: number;
  name: string;
  slug: string;
  description?: string;
  process?: any;
  duration?: string;
  pricing?: string;
  ctaLabel?: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  author: any; // User relationship
  coverImage?: number | Media;
  excerpt?: string;
  content: any; // Lexical rich text
  publishedAt?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: number | Media;
  };
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  order?: number;
}

export interface SiteSettings {
  id: number;
  siteName: string;
  siteTagline?: string;
  contactEmail?: string;
  whatsapp?: string;
  phone?: string;
  address?: string;
  defaultOgImage?: number | Media;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface HomepageBanner {
  id: number;
  title?: string;
  subtitle?: string;
  image: number | Media;
  ctaLink?: string;
  ctaLabel?: string;
  order?: number;
}

export interface Testimonial {
  id: number;
  author: string;
  company?: string;
  quote: string;
  avatar?: number | Media;
  rating: number;
}

export interface SiteBannerSettings {
  id: number;
  enabled?: boolean;
  message?: string;
  link?: string;
  linkLabel?: string;
}
