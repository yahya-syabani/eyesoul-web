import { EyewearCollection } from "@/lib/cms/types";
import { getTranslations } from 'next-intl/server';
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Link } from "@/i18n/routing";
import { FeaturedCollectionCard } from "@/components/home/FeaturedCollectionCard";

interface FeaturedCollectionsProps {
  collections: EyewearCollection[];
  locale: string;
}

export async function FeaturedCollections({ collections, locale }: FeaturedCollectionsProps) {
  const t = await getTranslations({ locale, namespace: 'home' });

  if (collections.length === 0) return null;

  const displayed = collections.slice(0, 3);

  return (
    <section className="py-16 md:py-20 bg-background border-t border-neutral-100">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        
        <RevealOnScroll className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl md:text-5xl font-light mb-6 tracking-tight">
              {t('collections.title')}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {t('collections.body')}
            </p>
          </div>
          <Link
            href="/collections"
            className="group flex items-center justify-center border border-neutral-300 text-neutral-900 px-8 py-3 text-sm font-medium uppercase tracking-widest hover:bg-neutral-100 transition-colors rounded-sm shrink-0"
          >
            {t('collections.explore')}
          </Link>
        </RevealOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {displayed.map((collection, index) => {
            // High-density Bento Box placement logic
            let colSpan = "lg:col-span-12";
            let imageAspect = "aspect-[4/3]";

            if (index === 0) {
              // Massive anchor card spanning two rows on the left
              colSpan = "lg:col-span-8 lg:row-span-2";
              imageAspect = "aspect-[4/3] lg:aspect-auto lg:h-[600px] xl:h-[700px]"; // Ensure it has enough fixed height to match two squares
            } else if (index === 1) {
              // Top right square
              colSpan = "lg:col-span-4";
              imageAspect = "aspect-[4/3] lg:aspect-auto lg:h-full";
            } else if (index === 2) {
              // Bottom right square
              colSpan = "lg:col-span-4";
              imageAspect = "aspect-[4/3] lg:aspect-auto lg:h-full";
            }

            return (
              <div key={collection.id} className={`${colSpan} h-full`}>
                <RevealOnScroll delay={0.1} className="h-full">
                  <FeaturedCollectionCard collection={collection} imageAspect={imageAspect} />
                </RevealOnScroll>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
