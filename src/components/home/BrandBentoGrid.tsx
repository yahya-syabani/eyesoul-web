"use client";

import { useTranslations } from 'next-intl';
import Image from "next/image";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Shield, Sparkles, Feather } from "lucide-react";

export function BrandBentoGrid() {
  const t = useTranslations('home');
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        
        <RevealOnScroll className="mb-16 text-center max-w-3xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl font-light mb-6 tracking-tight">
            {t('philosophy.title')}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {t('philosophy.body')}
          </p>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          
          {/* Main Bento Box */}
          <RevealOnScroll delay={0.1} className="md:col-span-2 relative aspect-square md:aspect-auto md:h-[400px] rounded-3xl overflow-hidden bg-neutral-100 group">
            <Image 
              src="https://cdn.ruparupa.io/fit-in/800x600/filters:format(webp)/filters:quality(90)/ruparupa-com/image/upload/Products/10520815_1.jpg" 
              alt="Craftsmanship" 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
              <Sparkles className="w-8 h-8 text-white mb-4" />
              <h3 className="font-display text-2xl md:text-3xl text-white font-medium mb-2">{t('philosophy.craftsmanship.title')}</h3>
              <p className="text-white/80 max-w-md">{t('philosophy.craftsmanship.desc')}</p>
            </div>
          </RevealOnScroll>

          {/* Top Right Box */}
          <RevealOnScroll delay={0.2} className="relative h-[250px] md:h-[400px] rounded-3xl overflow-hidden bg-[#F5F5F5] p-8 flex flex-col justify-between border border-neutral-200">
            <div>
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-6">
                <Shield className="w-6 h-6 text-neutral-800" />
              </div>
              <h3 className="font-display text-xl font-medium mb-2">{t('philosophy.acetate.title')}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{t('philosophy.acetate.desc')}</p>
            </div>
          </RevealOnScroll>

          {/* Bottom Left Box */}
          <RevealOnScroll delay={0.3} className="relative h-[250px] md:h-[300px] rounded-3xl overflow-hidden bg-[#F5F5F5] p-8 flex flex-col justify-between border border-neutral-200">
            <div>
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-6">
                <Feather className="w-6 h-6 text-neutral-800" />
              </div>
              <h3 className="font-display text-xl font-medium mb-2">{t('philosophy.lightweight.title')}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{t('philosophy.lightweight.desc')}</p>
            </div>
          </RevealOnScroll>

          {/* Bottom Right Wide Box */}
          <RevealOnScroll delay={0.4} className="md:col-span-2 relative h-[300px] rounded-3xl overflow-hidden bg-neutral-900 group">
             <Image 
              src="https://cdn.ruparupa.io/fit-in/800x600/filters:format(webp)/filters:quality(90)/ruparupa-com/image/upload/Products/10495205_1.jpg" 
              alt="Optical Lenses" 
              fill 
              className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-1000"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <h3 className="font-display text-2xl md:text-3xl text-white font-medium mb-2">{t('philosophy.lenses.title')}</h3>
              <p className="text-white/80 max-w-md text-sm leading-relaxed">{t('philosophy.lenses.desc')}</p>
            </div>
          </RevealOnScroll>

        </div>
      </div>
    </section>
  );
}
