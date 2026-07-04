import { getProducts, getProductFilterOptions } from "@/lib/cms/products";
import { getCategoryBySlug } from "@/lib/cms/categories";
import { CatalogueGrid } from "@/components/ui/CatalogueGrid";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { FilterSidebar } from "@/components/ui/FilterSidebar";
import { SortSelect } from "@/components/ui/SortSelect";
import { getTranslations } from "next-intl/server";
import { Locale } from "@/lib/cms/types";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";

export async function generateMetadata({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ [key: string]: string | undefined }> }): Promise<Metadata> {
  const { locale } = await params;
  const sp = await searchParams;
  const cat = sp.category || "all";
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:3001";
  const t = await getTranslations({ locale, namespace: 'page.products' });
  return {
    title: `${t('meta.title')}${cat !== "all" ? ` (${cat})` : ""}`,
    description: t('meta.description'),
    alternates: { canonical: `${baseUrl}/${locale}/products` },
  };
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'page.products' });
  const sp = await searchParams;
  
  const categorySlug = sp.category;
  const material = sp.material;
  const shape = sp.shape;
  const gender = sp.gender;
  const sort = sp.sort || "newest";
  
  // Fetch products from our CMS adapter
  const productsRes = await getProducts({ 
    locale: locale as Locale,
    categorySlug,
    material,
    shape,
    gender,
    sort
  });
  const products = productsRes.docs || [];

  // Fetch category data if a category is selected (to get merchandising blocks)
  let category = null;
  if (categorySlug) {
    category = await getCategoryBySlug(categorySlug, locale as Locale);
  }
  const merchandisingBlocks = category?.merchandising || [];

  // Fetch dynamic filter options from product data
  const dynamicFilters = await getProductFilterOptions(locale as Locale);

  return (
    <main className="flex-grow bg-neutral-50/30">
      <PageHero
        title={t('hero.title')}
        subtitle={t('hero.subtitle')}
        imageUrl="https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=2940&auto=format&fit=crop"
        imageAlt="Clean eyewear product flat lay"
        height="standard"
        overlayOpacity={0.4}
      />
      <div className="container py-16 md:py-24">

        {/* Filter & Grid Layout */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          <FilterSidebar dynamicFilters={dynamicFilters} />

          <div className="flex-1 w-full">
            {/* Filters/Sort Shell (MVP) */}
            <RevealOnScroll className="mb-6 flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="text-sm text-muted-foreground">
                Showing {products.length} {products.length === 1 ? 'result' : 'results'}
              </div>
              {/* Sort Dropdown */}
              <SortSelect defaultValue={sort} />
            </RevealOnScroll>

            {/* Product Grid */}
            <CatalogueGrid products={products} merchandisingBlocks={merchandisingBlocks} />
          </div>
        </div>
        
      </div>
    </main>
  );
}
