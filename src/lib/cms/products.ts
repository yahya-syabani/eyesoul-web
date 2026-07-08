import { fetchCMS } from './client';
import { CMSResponse, Product, Locale } from './types';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterSection {
  id: string;
  label: string;
  options: FilterOption[];
}

/**
 * Fetches all products (up to 200) and extracts unique filterable spec values.
 */
export async function getProductFilterOptions(locale?: Locale): Promise<FilterSection[]> {
  try {
    const endpoint = `/products?limit=200&depth=0`;
    const response = await fetchCMS<CMSResponse<Product>>(endpoint, { locale });
    const products = response.docs || [];

    const materials = new Set<string>();
    const shapes = new Set<string>();
    const genders = new Set<string>();

    for (const p of products) {
      if (p.specs?.material) materials.add(p.specs.material);
      if (p.specs?.shape) shapes.add(p.specs.shape);
      if (p.specs?.gender) genders.add(p.specs.gender);
    }

    const sections: FilterSection[] = [];

    if (materials.size > 0) {
      sections.push({
        id: 'material',
        label: 'Material',
        options: Array.from(materials).map((v) => ({ label: v, value: v })),
      });
    }

    if (shapes.size > 0) {
      sections.push({
        id: 'shape',
        label: 'Shape',
        options: Array.from(shapes).map((v) => ({ label: v, value: v })),
      });
    }

    if (genders.size > 0) {
      sections.push({
        id: 'gender',
        label: 'Gender',
        options: Array.from(genders).map((v) => ({ label: v.charAt(0).toUpperCase() + v.slice(1), value: v })),
      });
    }

    return sections;
  } catch {
    return [];
  }
}

/**
 * Fetches a list of products with optional query parameters.
 */
export async function getProducts(options?: {
  locale?: Locale;
  limit?: number;
  page?: number;
  categorySlug?: string;
  brandId?: number;
  collectionId?: number;
  material?: string;
  shape?: string;
  gender?: string;
  sort?: string;
}): Promise<CMSResponse<Product>> {
  const params = new URLSearchParams();
  
  if (options?.limit) params.append('limit', options.limit.toString());
  if (options?.page) params.append('page', options.page.toString());
  if (options?.sort) params.append('sort', options.sort);
  
  if (options?.categorySlug) {
    // category is now a relation, we query the nested slug
    params.append('where[category.slug][equals]', options.categorySlug);
  }
  
  if (options?.brandId) {
    params.append('where[brand][equals]', options.brandId.toString());
  }

  if (options?.collectionId) {
    params.append('where[collections][equals]', options.collectionId.toString());
  }

  if (options?.material) {
    params.append('where[specs.material][equals]', options.material);
  }

  if (options?.shape) {
    params.append('where[specs.shape][equals]', options.shape);
  }

  if (options?.gender) {
    params.append('where[specs.gender][equals]', options.gender);
  }

  const queryString = params.toString();
  const endpoint = `/products${queryString ? `?${queryString}` : ''}`;

  return fetchCMS<CMSResponse<Product>>(endpoint, { locale: options?.locale });
}

/**
 * Fetches a single product by its slug.
 */
export async function getProductBySlug(slug: string, locale?: Locale): Promise<Product | null> {
  // We use the `where` query to find a product by slug
  const endpoint = `/products?where[slug][equals]=${slug}`;
  const response = await fetchCMS<CMSResponse<Product>>(endpoint, { locale });

  if (response.docs && response.docs.length > 0) {
    return response.docs[0];
  }
  return null;
}
