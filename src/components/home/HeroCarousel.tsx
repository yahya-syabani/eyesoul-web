"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { HomepageBanner } from "@/lib/cms/types";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { Link } from "@/i18n/routing";

interface HeroCarouselProps {
  banners: HomepageBanner[];
}

export function HeroCarousel({ banners }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const length = banners.length;

  const goTo = useCallback((index: number) => {
    setCurrent(((index % length) + length) % length);
  }, [length]);

  const goNext = useCallback(() => goTo(current + 1), [goTo, current]);

  useEffect(() => {
    if (length <= 1) return;
    const timer = setInterval(goNext, 6000);
    return () => clearInterval(timer);
  }, [goNext, length]);

  if (length === 0) return null;

  return (
    <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden bg-neutral-900 flex items-center justify-center -mt-20 lg:-mt-24">
      <AnimatePresence mode="wait">
        {banners.map((banner, index) => {
          if (index !== current) return null;
          const imageUrl = typeof banner.image === "object" ? banner.image.url : "";

          return (
            <motion.div
              key={banner.id}
              className="absolute inset-0 z-0"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: [0.25, 0.25, 0, 1] }}
            >
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt={banner.title || "Campaign"}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority={index === 0}
                />
              )}
              {/* Removed heavy scrim for premium editorial feel */}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Content overlay */}
      <div className="absolute inset-0 z-10 container mx-auto px-6 md:px-12 lg:px-20 flex flex-col items-center justify-center text-center pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.25, 0, 1] }}
            className="max-w-4xl flex flex-col items-center pointer-events-auto"
          >
            {banners[current]?.subtitle && (
              <p className="text-white/90 font-sans tracking-[0.2em] uppercase text-xs md:text-sm mb-6 font-medium">
                {banners[current].subtitle}
              </p>
            )}
            
            {banners[current]?.title && (
              <AnimatedText 
                text={banners[current]?.title}
                el="h1"
                className="font-display text-6xl md:text-8xl lg:text-9xl font-light text-white mb-8 tracking-tight leading-[1.0] mix-blend-difference"
              />
            )}
            
            {banners[current]?.ctaLink && (
              <Link 
                href={banners[current].ctaLink!}
                className="inline-flex items-center justify-center bg-white text-black px-10 py-3.5 text-sm font-medium tracking-wide uppercase hover:bg-white/90 transition-colors"
              >
                {banners[current]?.ctaLabel || "Discover"}
              </Link>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation - Minimalist Progress Lines */}
      {length > 1 && (
        <div className="absolute bottom-12 right-12 z-20 flex gap-3 pointer-events-auto">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className="group relative h-12 flex items-center justify-center"
              aria-label={`Go to slide ${index + 1}`}
            >
              <div
                className={`h-[2px] transition-all duration-500 rounded-full ${
                  index === current ? "w-12 bg-white" : "w-6 bg-white/30 group-hover:bg-white/60"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
