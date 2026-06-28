import { EyewearCollection } from "@/lib/cms/types";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Link } from "@/i18n/routing";
import Image from "next/image";

interface FeaturedCollectionsProps {
  collections: EyewearCollection[];
}

export function FeaturedCollections({ collections }: FeaturedCollectionsProps) {
  if (collections.length === 0) return null;

  const displayed = collections.slice(0, 3);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        
        <RevealOnScroll className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light mb-6 tracking-tight">
              Curated <br />
              <span className="italic text-muted-foreground">Collections</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Discover eyewear curated by aesthetic, material, and lifestyle. Each collection represents a unique approach to modern optical design.
            </p>
          </div>
          <Link
            href="/collections"
            className="group flex items-center gap-4 text-sm font-medium tracking-widest uppercase hover:text-primary/70 transition-colors"
          >
            Explore All 
            <span className="w-12 h-[1px] bg-foreground group-hover:w-16 transition-all duration-300" />
          </Link>
        </RevealOnScroll>

        <div className="flex flex-col space-y-16 md:space-y-0 md:grid md:grid-cols-12 md:gap-x-8 md:gap-y-24">
          {displayed.map((collection, index) => {
            const coverUrl =
              collection.coverImage && typeof collection.coverImage === "object"
                ? collection.coverImage.url
                : null;

            // Asymmetrical placement logic
            let colSpan = "md:col-span-12";
            let alignmentClasses = "";
            let imageAspect = "aspect-[16/9]";
            let isReversed = false;

            if (index === 0) {
              // Large hero-like collection taking up 8 columns, aligned left
              colSpan = "md:col-span-8";
              alignmentClasses = "";
              imageAspect = "aspect-[4/3]";
            } else if (index === 1) {
              // Tall portrait collection on the right side
              colSpan = "md:col-span-5 md:col-start-7";
              alignmentClasses = "md:mt-[-20%]"; // Pull up to overlap slightly with previous row space
              imageAspect = "aspect-[3/4]";
            } else if (index === 2) {
              // Medium landscape collection on the left
              colSpan = "md:col-span-7";
              alignmentClasses = "";
              imageAspect = "aspect-[16/10]";
            }

            return (
              <div key={collection.id} className={`${colSpan} ${alignmentClasses}`}>
                <RevealOnScroll delay={0.1}>
                  <Link href={`/collections/${collection.slug}`} className="block group">
                    <div className="flex flex-col">
                      <div className={`relative ${imageAspect} overflow-hidden bg-[#F5F5F5] mb-6`}>
                        {coverUrl ? (
                          <Image
                            src={coverUrl}
                            alt={collection.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-[0.25,0.25,0,1]"
                          />
                        ) : (
                          <Image
                            src="/brand-fallback.svg"
                            alt={collection.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                      </div>
                      
                      <div className="flex flex-col max-w-lg">
                        <h3 className="font-display text-2xl md:text-3xl font-medium mb-3 group-hover:text-primary/70 transition-colors">
                          {collection.name}
                        </h3>
                        {collection.description && (
                          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                            {collection.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </RevealOnScroll>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
