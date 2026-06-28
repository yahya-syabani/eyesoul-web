import { getCollections } from "@/lib/cms/collections";
import { Locale } from "@/lib/cms/types";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import Image from "next/image";

export const metadata = {
  title: "Eyewear Collections - Eyesoul Premium Eyewear",
  description: "Browse curated eyewear collections, categorized by aesthetic and lifestyle.",
};

export default async function CollectionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const collections = await getCollections(locale as Locale);

  return (
    <main className="flex-grow bg-background">
      <div className="container pt-32 pb-16 md:pt-40 md:pb-24">
        
        <RevealOnScroll className="mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-light mb-4">
            Curated Collections
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Discover eyewear curated by aesthetic, material, and lifestyle. Find the perfect collection that speaks to your personal style.
          </p>
        </RevealOnScroll>

        {collections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((collection, index) => {
              
              let coverUrl = "/placeholder.png";
              let coverAlt = collection.name;
              if (collection.coverImage && typeof collection.coverImage === 'object' && collection.coverImage.url) {
                coverUrl = collection.coverImage.url;
                if (collection.coverImage.alt) coverAlt = collection.coverImage.alt;
              }

              return (
                <RevealOnScroll key={collection.id} delay={0.1 * index}>
                  <Link href={`/collections/${collection.slug}`} className="block group h-full">
                    <Card className="h-full overflow-hidden border-transparent shadow-none hover:shadow-2xl transition-all duration-500 bg-neutral-50 rounded-2xl">
                      <CardHeader className="p-0 relative aspect-[4/3] overflow-hidden">
                        {coverUrl !== "/placeholder.png" ? (
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
