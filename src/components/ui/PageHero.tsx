"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { AnimatedText } from "@/components/ui/AnimatedText";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  imageUrl: string;
  imageAlt?: string;
  align?: "left" | "center";
  overlayOpacity?: number;
  height?: "full" | "standard";
}

export function PageHero({
  title,
  subtitle,
  imageUrl,
  imageAlt = "Hero background",
  align = "center",
  overlayOpacity = 0.4,
  height = "standard",
}: PageHeroProps) {
  const heightClass = height === "full" ? "h-[85vh] min-h-[600px]" : "h-[60vh] min-h-[400px]";
  
  const alignmentClass = align === "center" 
    ? "items-center text-center" 
    : "items-start text-left";

  return (
    <section className={`relative w-full overflow-hidden bg-neutral-900 flex items-center justify-center -mt-[96px] lg:-mt-[128px] pt-[96px] lg:pt-[128px] ${heightClass}`}>
      {/* Background Media */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: [0.25, 0.25, 0, 1] }}
      >
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        {/* Dynamic Overlay */}
        <div 
          className="absolute inset-0 bg-black z-10"
          style={{ opacity: overlayOpacity }}
        />
      </motion.div>

      {/* Content */}
      <div className={`absolute inset-0 z-20 container mx-auto px-6 md:px-12 lg:px-20 flex flex-col justify-center ${alignmentClass}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.25, 0, 1] }}
          className={`max-w-4xl flex flex-col ${align === 'center' ? 'items-center' : 'items-start'} pt-16`}
        >
          {subtitle && (
            <p className="text-white/90 font-sans tracking-[0.2em] uppercase text-xs md:text-sm mb-4 md:mb-6 font-medium">
              {subtitle}
            </p>
          )}
          
          <AnimatedText 
            text={title}
            el="h1"
            className="font-display text-4xl md:text-6xl lg:text-7xl font-light text-white tracking-tight leading-[1.1]"
          />
        </motion.div>
      </div>
    </section>
  );
}
