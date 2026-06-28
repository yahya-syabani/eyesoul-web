import { getProducts } from "@/lib/cms/products";
import { getCategoryBySlug } from "@/lib/cms/categories";
import { CatalogueGrid } from "@/components/ui/CatalogueGrid";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { FilterSidebar } from "@/components/ui/FilterSidebar";
import { getTranslations } from "next-intl/server";
import { Locale } from "@/lib/cms/types";

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Navigation");
  const sp = await searchParams;
  
  // Extract filters from URL
  const categorySlug = sp.category;
  const material = sp.material;
  const shape = sp.shape;
  const gender = sp.gender;
  
  // Fetch products from our CMS adapter
  const productsRes = await getProducts({ 
    locale: locale as Locale,
    categorySlug,
    material,
    shape,
    gender
  });
  const products = productsRes.docs || [];

  // Fetch category data if a category is selected (to get merchandising blocks)
  let category = null;
  if (categorySlug) {
    category = await getCategoryBySlug(categorySlug, locale as Locale);
  }
  const merchandisingBlocks = category?.merchandising || [];

  return (
    <main className="flex-grow bg-neutral-50/30">
      <div className="container pt-32 pb-16 md:pt-40 md:pb-24">
        
        {/* Header */}
        <RevealOnScroll className="mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-light mb-4">
            {t("products")}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Explore our curated selection of premium eyewear. Designed for comfort, crafted for durability.
          </p>
        </RevealOnScroll>

        {/* Filter & Grid Layout */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          <FilterSidebar />

          <div className="flex-1 w-full">
            {/* Filters/Sort Shell (MVP) */}
            <RevealOnScroll className="mb-6 flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="text-sm text-muted-foreground">
                Showing {products.length} {products.length === 1 ? 'result' : 'results'}
              </div>
              {/* Future: Select Dropdown for Sort */}
              <select className="text-sm border border-neutral-200 rounded-md px-3 py-1.5 bg-transparent outline-none focus:border-foreground">
                <option>Sort by: Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </RevealOnScroll>

            {/* Product Grid */}
            <CatalogueGrid products={products} merchandisingBlocks={merchandisingBlocks} />
          </div>
        </div>
        
      </div>
    </main>
  );
}
