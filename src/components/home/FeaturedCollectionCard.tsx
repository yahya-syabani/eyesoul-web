"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { EyewearCollection } from "@/lib/cms/types";
import { getMediaUrl } from "@/lib/utils/media";

interface FeaturedCollectionCardProps {
  collection: EyewearCollection;
  imageAspect: string;
}

export function FeaturedCollectionCard({ collection, imageAspect }: FeaturedCollectionCardProps) {
  const coverUrl = getMediaUrl(collection.coverImage);

  return (
    <Link href={`/collections/${collection.slug}`} className="block group w-full h-full">
      <div className={`relative w-full ${imageAspect} overflow-hidden rounded-md bg-neutral-900`}>
        {/* Background Image */}
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={collection.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-1000 ease-[0.25,0.25,0,1]"
          />
        ) : (
          <Image
            src="/brand-fallback.svg"
            alt={collection.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover opacity-60"
          />
        )}
        
        {/* Strong protective gradient for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        {/* Content anchored to bottom */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 lg:p-10 z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            
            {/* Title & Description */}
            <div className="max-w-md transform transition-transform duration-500 ease-out group-hover:-translate-y-2">
              {/* Optional pill label could go here, e.g. "Featured" */}
              <p className="text-white/70 text-xs font-semibold tracking-widest uppercase mb-3 drop-shadow-md">
                Collection
              </p>
              <h3 className="font-display text-3xl md:text-4xl text-white font-medium mb-3 drop-shadow-md">
                {collection.name}
              </h3>
              {collection.description && (
                <p className="text-white/80 text-sm md:text-base leading-relaxed line-clamp-2 drop-shadow-md hidden md:block">
                  {collection.description}
                </p>
              )}
            </div>
            
            {/* CTA Button (Always visible on mobile, reveals on hover on desktop) */}
            <div className="shrink-0 transform transition-all duration-500 ease-out md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0">
              <span className="inline-flex items-center justify-center bg-white text-black px-6 py-3 text-xs font-medium uppercase tracking-widest hover:bg-neutral-200 transition-colors rounded-sm shadow-lg">
                Discover
              </span>
            </div>

          </div>
        </div>
      </div>
    </Link>
  );
}
