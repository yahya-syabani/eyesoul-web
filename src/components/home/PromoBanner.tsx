"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Promotion } from "@/lib/cms/promotions";

interface PromoBannerProps {
  promotions: Promotion[];
}

export function PromoBanner({ promotions }: PromoBannerProps) {
  if (promotions.length === 0) return null;

  const promo = promotions[0];
  const imgUrl = promo.bannerImage && typeof promo.bannerImage === "object" ? promo.bannerImage.url : null;

  return (
    <section className="py-16 md:py-20 bg-neutral-900 text-white">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {imgUrl && (
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
              <Image src={imgUrl} alt={promo.title} fill className="object-cover" />
            </div>
          )}
          <div className={imgUrl ? "" : "md:col-span-2 text-center"}>
            <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-4 font-medium">Promotion</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-light mb-6 leading-tight">
              {promo.title}
            </h2>
            {promo.description && (
              <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-lg">
                {promo.description}
              </p>
            )}
            <Link
              href="/products"
              className="group inline-flex items-center gap-4 text-sm font-medium tracking-widest uppercase text-white hover:text-white/70 transition-colors"
            >
              Shop Now
              <span className="w-12 h-[1px] bg-white group-hover:w-16 transition-all duration-300" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
