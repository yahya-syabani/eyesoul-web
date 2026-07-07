import { getBrands } from "@/lib/cms/brands";
import { Locale } from "@/lib/cms/types";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { getTranslations } from 'next-intl/server';
import { PageHero } from "@/components/ui/PageHero";
import { getMediaUrl } from "@/lib/utils/media";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'page.brands' });
  return { title: t('meta.title'), description: t('meta.description') };
}

export default async function BrandsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'page.brands' });
  const brands = await getBrands(locale as Locale);

  return (
    <main className="flex-grow bg-neutral-50/30">
      <PageHero
        title={t('hero.title')}
        subtitle={t('hero.subtitle')}
        imageUrl="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2940&auto=format&fit=crop"
        imageAlt="Luxury retail interior"
        height="standard"
        overlayOpacity={0.5}
      />
      <div className="container py-16 md:py-24">

        {brands.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {brands.map((brand, index) => {
              const coverUrl = getMediaUrl(brand.coverImage);
              return (
              <RevealOnScroll key={brand.id} delay={0.1 * index}>
                <Link href={`/brands/${brand.slug}`} className="block group h-full">
                  <Card className="h-full overflow-hidden border-transparent shadow-sm hover:shadow-xl transition-all duration-300">
                    {coverUrl && coverUrl !== "/placeholder.png" && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={coverUrl}
                          alt={brand.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <CardContent className="p-8 flex flex-col h-full bg-white relative">
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
            )})}
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
