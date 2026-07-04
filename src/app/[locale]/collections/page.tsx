import { getCollections } from "@/lib/cms/collections";
import { Locale } from "@/lib/cms/types";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { getMediaUrl } from "@/lib/utils/media";
import { getTranslations } from 'next-intl/server';
import { PageHero } from "@/components/ui/PageHero";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'page.collections' });
  return { title: t('meta.title'), description: t('meta.description') };
}

export default async function CollectionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'page.collections' });
  const collections = await getCollections(locale as Locale);

  return (
    <main className="flex-grow bg-background">
      <PageHero
        title={t('hero.title')}
        subtitle={t('hero.subtitle')}
        imageUrl="https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=2960&auto=format&fit=crop"
        imageAlt="Premium eyewear lifestyle portrait"
        height="standard"
        overlayOpacity={0.4}
      />
      <div className="container py-16 md:py-24">

        {collections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((collection, index) => {

              const coverUrl = getMediaUrl(collection.coverImage);
              const coverAlt = collection.name;

              return (
                <RevealOnScroll key={collection.id} delay={0.1 * index}>
                  <Link href={`/collections/${collection.slug}`} className="block group h-full">
                    <Card className="h-full overflow-hidden border-transparent shadow-none hover:shadow-2xl transition-all duration-500 bg-neutral-50 rounded-2xl">
                      <CardHeader className="p-0 relative aspect-[4/3] overflow-hidden">
                        {coverUrl && coverUrl !== "/placeholder.png" ? (
                          <Image
                            src={coverUrl}
                            alt={coverAlt}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                        ) : (
                          <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-neutral-400">
                            No Cover Image
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                        <div className="absolute bottom-6 left-6 right-6 text-white">
                          <h3 className="font-display text-2xl font-medium mb-1 drop-shadow-sm group-hover:translate-x-2 transition-transform duration-300">
                            {collection.name}
                          </h3>
                        </div>
                      </CardHeader>

                      {collection.description && (
                        <CardContent className="p-6">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {collection.description}
                          </p>
                        </CardContent>
                      )}
                    </Card>
                  </Link>
                </RevealOnScroll>
              );
            })}
          </div>
        ) : (
          <div className="py-24 text-center border border-dashed rounded-xl border-neutral-300">
            <h2 className="text-2xl font-display text-neutral-400">No collections found.</h2>
          </div>
        )}

      </div>
    </main>
  );
}
