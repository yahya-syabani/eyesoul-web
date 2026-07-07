"use client";

import Image from "next/image";
import { HomepageBanner } from "@/lib/cms/types";
import { Link } from "@/i18n/routing";
import { ArrowRight, Star, ShieldCheck } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

interface EditorialHeroProps {
  banners: HomepageBanner[];
}

export function EditorialHero({ banners }: EditorialHeroProps) {
  if (banners.length === 0) return null;
  const banner = banners[0]; // Use the primary banner
  const imageUrl = typeof banner.image === "object" ? banner.image.url : "";

  return (
    <section className="relative w-full min-h-[85vh] lg:min-h-[95vh] bg-neutral-950 -mt-[96px] lg:-mt-[128px] flex items-end lg:items-center overflow-hidden">
      
      {/* --- MEDIA LAYER (Background / Right Side) --- */}
      <div className="absolute inset-0 lg:left-[35%] z-0 h-[45vh] lg:h-full top-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={banner.title || "Hero Image"}
            fill
            sizes="(max-width: 1024px) 100vw, 75vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
            <span className="text-neutral-600 font-display">No Image</span>
          </div>
        )}
        
        {/* Gradients for smooth blending */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent lg:hidden" />
        <div className="hidden lg:block absolute inset-y-0 left-0 w-[400px] bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
        <div className="hidden lg:block absolute inset-0 bg-black/10" />

        {/* Floating Merchandising Badges (Desktop) */}
        <div className="absolute top-[20%] right-12 hidden lg:flex flex-col gap-4 items-end z-20">
          <RevealOnScroll delay={0.6}>
            <div className="bg-white/80 backdrop-blur-xl border border-white/60 text-neutral-950 px-5 py-2.5 rounded-full flex items-center gap-3 shadow-2xl">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-xs font-bold tracking-widest uppercase">4.9/5 Rating</span>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.8}>
            <div className="bg-white/80 backdrop-blur-xl border border-white/60 text-neutral-950 px-5 py-2.5 rounded-full flex items-center gap-3 shadow-2xl">
              <ShieldCheck className="w-4 h-4 text-neutral-900" />
              <span className="text-xs font-bold tracking-widest uppercase">150+ Premium Frames</span>
            </div>
          </RevealOnScroll>
        </div>

        {/* Featured Product Card Inset (Catalogue Focus) */}
        {banner.featuredProduct && typeof banner.featuredProduct === 'object' && (
          <RevealOnScroll delay={0.4} className="hidden lg:block absolute bottom-40 right-16 w-64 z-10">
            <Link href={`/products/${banner.featuredProduct.slug}`} className="block bg-white p-4 shadow-2xl group flex flex-col gap-3 hover:scale-105 transition-transform duration-500 cursor-pointer">
               <div className="relative w-full aspect-[4/3] bg-neutral-100 overflow-hidden">
                 <Image 
                    src={banner.featuredProduct.images?.front && typeof banner.featuredProduct.images.front === 'object' ? banner.featuredProduct.images.front.url : "/brand-fallback.svg"} 
                    alt={banner.featuredProduct.name} 
                    fill 
                    sizes="256px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out mix-blend-multiply" 
                 />
               </div>
               <div>
                 <p className="text-[10px] text-neutral-500 font-semibold tracking-widest uppercase mb-1">
                   {typeof banner.featuredProduct.category === 'object' ? banner.featuredProduct.category.name : "Featured Silhouette"}
                 </p>
                 <p className="text-sm font-display font-semibold text-neutral-900 line-clamp-1">{banner.featuredProduct.name}</p>
                 <p className="text-xs text-neutral-600 mt-1">View Details →</p>
               </div>
            </Link>
          </RevealOnScroll>
        )}
      </div>

      {/* --- CONTENT LAYER (Foreground / Left Side) --- */}
      <div className="container mx-auto px-6 md:px-12 lg:px-20 z-10 relative pb-12 lg:pb-24 pt-[120px] lg:pt-[140px]">
        <RevealOnScroll className="max-w-2xl lg:pr-12">
          
          {/* Subtitle / Eyebrow */}
          {banner.subtitle && (
            <p className="text-white/60 font-sans tracking-[0.2em] uppercase text-xs md:text-sm mb-6 lg:mb-8 font-semibold flex items-center gap-4">
              <span className="w-12 h-[1px] bg-white/60"></span>
              {banner.subtitle}
            </p>
          )}
          
          {/* Massive Headline */}
          <h1 className="font-display text-4xl sm:text-5xl leading-[1.05] md:text-7xl lg:text-[5.5rem] font-light text-white mb-6 tracking-tight drop-shadow-sm">
            {banner.title || "The Premium Catalogue"}
          </h1>
          
          {/* Paragraph */}
          <p className="text-white/70 text-lg md:text-xl lg:text-xl leading-relaxed mb-8 max-w-lg font-light">
            Discover our curated collection of quiet luxury eyewear. Explore over 150 handcrafted acetate silhouettes designed for the discerning eye.
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center mb-10">
            <Link 
              href={banner.ctaLink || "/products"}
              className="group inline-flex items-center justify-center bg-white text-neutral-950 px-10 py-4 lg:py-5 text-sm font-medium tracking-widest uppercase hover:bg-neutral-200 transition-all w-full sm:w-auto"
            >
              Browse Catalogue
              <ArrowRight className="w-4 h-4 ml-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/collections"
              className="group inline-flex items-center justify-center border border-white/30 bg-transparent text-white px-10 py-4 lg:py-5 text-sm font-medium tracking-widest uppercase hover:bg-white/10 hover:border-white/50 transition-all w-full sm:w-auto"
            >
              View Collections
            </Link>
          </div>

          {/* Quick Category Links (Catalogue Browsing Cues) */}
          <div className="hidden md:flex items-center gap-6 text-sm text-white/50 font-medium tracking-widest uppercase">
            <span className="text-white/30 text-xs">Explore:</span>
            <Link href="/products?category=optical" className="hover:text-white transition-colors">Optical</Link>
            <Link href="/products?category=sunglasses" className="hover:text-white transition-colors">Sunglasses</Link>
            <Link href="/collections/vintage" className="hover:text-white transition-colors">Vintage Archive</Link>
          </div>

          {/* Mobile Trust Signals */}
          <div className="mt-12 lg:hidden flex items-center gap-6 pt-8 border-t border-white/10">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs font-medium text-white tracking-widest uppercase">4.9/5 Rating</p>
            </div>
            <div className="h-8 w-[1px] bg-white/20"></div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-white" />
              <p className="text-xs font-semibold text-white uppercase tracking-widest">150+ Premium<br/>Frames</p>
            </div>
          </div>

        </RevealOnScroll>
      </div>

    </section>
  );
}
