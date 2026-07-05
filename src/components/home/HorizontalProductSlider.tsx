"use client";

import { useTranslations } from 'next-intl';
import { Product } from "@/lib/cms/types";
import { ProductCard } from "@/components/ui/ProductCard";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { Link } from "@/i18n/routing";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

interface HorizontalProductSliderProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export function HorizontalProductSlider({ 
  products, 
  title, 
  subtitle 
}: HorizontalProductSliderProps) {
  const t = useTranslations('home');
  const displayTitle = title || t('featuredProducts.title');
  const displaySubtitle = subtitle || t('featuredProducts.subtitle');
  const sliderRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 overflow-hidden bg-background">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        
        <RevealOnScroll className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <AnimatedText 
              text={displayTitle}
              el="h2"
              className="font-display text-4xl md:text-5xl font-light mb-4 tracking-tight"
            />
            <p className="text-muted-foreground">{displaySubtitle}</p>
          </div>
          
          <div className="flex items-center gap-6">
            <Link
              href="/products"
              className="hidden md:flex items-center gap-4 text-sm font-medium tracking-widest uppercase hover:text-primary/70 transition-colors mr-8"
            >
              Shop All 
              <span className="w-12 h-[1px] bg-foreground transition-all duration-300" />
            </Link>
            
            {/* Slider Controls */}
            <div className="flex gap-2">
              <button 
                onClick={scrollLeft}
                className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={scrollRight}
                className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </RevealOnScroll>

        {/* The Slider Container */}
        <div className="relative -mx-6 md:-mx-12 lg:-mx-20 px-6 md:px-12 lg:px-20">
          <div 
            ref={sliderRef}
            className="flex gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product, index) => (
              <div 
                key={product.id} 
                className="w-[280px] md:w-[320px] lg:w-[380px] shrink-0 snap-start"
              >
                <RevealOnScroll delay={0.1 * (index % 4)}>
                  <ProductCard product={product} />
                </RevealOnScroll>
              </div>
            ))}
          </div>
        </div>

      </div>
      
      {/* Global CSS to hide scrollbar for webkit browsers */}
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
      `}} />
    </section>
  );
}
