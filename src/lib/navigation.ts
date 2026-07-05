import type { Brand, EyewearCollection } from '@/lib/cms/types';

export interface NavItem {
  labelKey: string;
  href: string;
  isCmsDriven?: boolean;
  cmsCollection?: 'categories' | 'eyewear-collections' | 'brands';
  highlight?: boolean;
}

export interface MegaMenuSection {
  id: string;
  columns: {
    titleKey: string;
    links: NavItem[];
  }[];
}

// Build CMS-driven mega menu data from fetched CMS items
export function buildEyewearSections(): MegaMenuSection {

  return {
    id: 'eyewear',
    columns: [
      {
        titleKey: 'Navigation.optical',
        links: [
          { labelKey: "Men's Optical", href: '/products?category=frames&gender=men' },
          { labelKey: "Women's Optical", href: '/products?category=frames&gender=women' },
          { labelKey: 'Blue Light Protection', href: '/products?category=frames&feature=blue-light' },
        ],
      },
      {
        titleKey: 'Navigation.sunglasses',
        links: [
          { labelKey: "Men's Sunglasses", href: '/products?category=sunglasses&gender=men' },
          { labelKey: "Women's Sunglasses", href: '/products?category=sunglasses&gender=women' },
          { labelKey: 'Polarized', href: '/products?category=sunglasses&feature=polarized' },
        ],
      },
      {
        titleKey: 'Navigation.discover',
        links: [
          { labelKey: 'New Arrivals', href: '/products?sort=newest' },
          { labelKey: 'Best Sellers', href: '/products?sort=popular' },
          { labelKey: 'View All', href: '/products', highlight: true },
        ],
      },
    ],
  };
}

export function buildCollectionSections(collections: EyewearCollection[]): MegaMenuSection {
  return {
    id: 'collections',
    columns: [
      {
        titleKey: 'Navigation.featured',
        links: collections.slice(0, 5).map(c => ({
          labelKey: c.name,
          href: `/collections/${c.slug}`,
        })),
      },
      {
        titleKey: 'Navigation.discover',
        links: [
          { labelKey: 'Navigation.collections', href: '/collections', highlight: true },
        ],
      },
    ],
  };
}

export function buildBrandSections(brands: Brand[]): MegaMenuSection {
  return {
    id: 'brands',
    columns: [
      {
        titleKey: 'Navigation.featured',
        links: brands.slice(0, 5).map(b => ({
          labelKey: b.name,
          href: `/brands/${b.slug}`,
        })),
      },
      {
        titleKey: 'Navigation.discover',
        links: [
          { labelKey: 'Navigation.brands', href: '/brands', highlight: true },
        ],
      },
    ],
  };
}

export function buildServiceSections(services: { name: string; slug: string }[]): MegaMenuSection {
  return {
    id: 'services',
    columns: [
      {
        titleKey: 'Navigation.featured',
        links: services.slice(0, 5).map(s => ({
          labelKey: s.name,
          href: `/services/${s.slug}`,
        })),
      },
      {
        titleKey: 'Navigation.discover',
        links: [
          { labelKey: 'Navigation.services', href: '/services', highlight: true },
        ],
      },
    ],
  };
}

// Nav links for the desktop header bar
export const DESKTOP_NAV_LINKS = [
  { id: 'eyewear', labelKey: 'Navigation.eyewear', hasMegaMenu: true },
  { id: 'collections', labelKey: 'Navigation.collections', hasMegaMenu: true },
  { id: 'brands', labelKey: 'Navigation.brands', hasMegaMenu: true },
  { id: 'services', labelKey: 'Navigation.services', hasMegaMenu: true },
  { id: 'journal', labelKey: 'Navigation.journal', href: '/articles', hasMegaMenu: false },
] as const;

// Nav links for the mobile drawer
export const MOBILE_NAV_LINKS = [
  { labelKey: 'Navigation.optical', href: '/products?category=frames' },
  { labelKey: 'Navigation.sunglasses', href: '/products?category=sunglasses' },
  { labelKey: 'Navigation.collections', href: '/collections' },
  { labelKey: 'Navigation.brands', href: '/brands' },
  { labelKey: 'Navigation.services', href: '/services' },
  { labelKey: 'Navigation.journal', href: '/articles' },
] as const;

// Footer links
export const FOOTER_SHOP_LINKS = [
  { labelKey: 'footer.links.optical', href: '/products?category=frames' },
  { labelKey: 'footer.links.sunglasses', href: '/products?category=sunglasses' },
  { labelKey: 'Navigation.collections', href: '/collections' },
] as const;

export const FOOTER_SUPPORT_LINKS = [
  { labelKey: 'Navigation.faq', href: '/faq' },
  { labelKey: 'footer.links.repairs', href: '/services/repairs' },
  { labelKey: 'Navigation.contact', href: '/contact' },
  { labelKey: 'Navigation.stores', href: '/store-locator' },
] as const;
