import { getBrands } from "@/lib/cms/brands";
import { Locale } from "@/lib/cms/types";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/routing";

export const metadata = {
  title: "Our Brands - Eyesoul Premium Eyewear",
  description: "Discover the heritage, design philosophy, and craftsmanship of the world's most distinguished eyewear brands available at Eyesoul.",
};

export default async function BrandsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const brands = await getBrands(locale as Locale);

  return (
    <main className="flex-grow bg-neutral-50/30">
      <div className="container pt-32 pb-16 md:pt-40 md:pb-24">
        
        <RevealOnScroll className="mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-light mb-4">
            Curated Brands
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            We partner with the world's most distinguished eyewear designers. Explore the heritage and craftsmanship behind each collection.
          </p>
        </RevealOnScroll>

        {brands.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {brands.map((brand, index) => (
              <RevealOnScroll key={brand.id} delay={0.1 * index}>
                <Link href={`/brands/${brand.slug}`} className="block group h-full">
                  <Card className="h-full overflow-hidden border-transparent shadow-sm hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-8 flex flex-col h-full bg-white relative">
                      {/* For the MVP, text-only card since there is no logo field. */}
                      <div className="mb-auto">
                        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2 font-medium">
                          {brand.country || "Global"}
                        </p>
                        <h3 className="font-display text-3xl font-medium mb-4 group-hover:text-primary transition-colors">
                          {brand.name}
                        </h3>
                        {brand.designPhilosophy && (
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {brand.designPhilosophy}
                          </p>
                        )}
                      </div>
                      <div className="mt-8">
                        <span className="text-sm font-medium text-primary group-hover:underline underline-offset-4">
                          Explore Collection &rarr;
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border border-dashed rounded-xl border-neutral-300">
            <h2 className="text-2xl font-display text-neutral-400">No brands found.</h2>
          </div>
        )}
        
      </div>
    </main>
  );
}
