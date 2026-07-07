import { getBanners } from "@/lib/cms/banners";
import { getCollections } from "@/lib/cms/collections";
import { getProducts } from "@/lib/cms/products";
import { getTestimonials } from "@/lib/cms/testimonials";
import { getArticles } from "@/lib/cms/articles";
import { getServices } from "@/lib/cms/services";
import { getInsurancePartners } from "@/lib/cms/insurance-partners";
import { getMediaUrl } from "@/lib/utils/media";
import { getTranslations } from 'next-intl/server';
import { Locale } from "@/lib/cms/types";
import { EditorialHero } from "@/components/home/EditorialHero";
import { PartnerGrid } from "@/components/ui/PartnerGrid";
import { BrandBentoGrid } from "@/components/home/BrandBentoGrid";
import { FeaturedCollections } from "@/components/home/FeaturedCollections";
import { HorizontalProductSlider } from "@/components/home/HorizontalProductSlider";
import { ServiceCards } from "@/components/home/ServiceCards";
import { TestimonialCarousel } from "@/components/home/TestimonialCarousel";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { Link } from "@/i18n/routing";
import Image from "next/image";

export const metadata = {
  title: "Eyesoul Premium Eyewear",
  description: "Quiet luxury, custom acetate, lightweight feel. Premium eyewear crafted for the discerning.",
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });

  const [banners, collections, productsRes, testimonials, articles, services, insurancePartners] = await Promise.all([
    getBanners(locale as Locale),
    getCollections(locale as Locale),
    getProducts({ locale: locale as Locale, limit: 8 }),
    getTestimonials(locale as Locale),
    getArticles(locale as Locale),
    getServices(locale as Locale),
    getInsurancePartners(locale as Locale),
  ]);

  const featuredProducts = productsRes.docs.filter((p) => p.status?.featured).slice(0, 8);
  const latestArticles = articles.slice(0, 3);

  return (
    <main className="flex-grow bg-background">
      {/* 1. Hero (Editorial Split) */}
      <EditorialHero banners={banners} />


      {/* 2. The Craft (Bento Grid) */}
      <BrandBentoGrid />

      {/* 3. Featured Collections (Asymmetrical) */}
      <FeaturedCollections collections={collections} locale={locale} />

      {/* 4. Iconic Frames (Horizontal Scroll) */}
      {featuredProducts.length > 0 && (
        <HorizontalProductSlider products={featuredProducts} />
      )}

      {/* 5. Bespoke Services (Visual Cards) */}
      {services.length > 0 && (
        <ServiceCards services={services} />
      )}

      {/* 6. The Eyesoul Experience (Reviews) */}
      <TestimonialCarousel testimonials={testimonials} />

      {/* Trust Bar: Insurance Partners */}
      <PartnerGrid partners={insurancePartners} />

      {/* 7. The Journal */}
      {latestArticles.length > 0 && (
        <section className="py-24 bg-background border-t border-neutral-100">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <RevealOnScroll className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <AnimatedText 
                text={t('journal.title')}
                el="h2"
                className="font-display text-4xl md:text-5xl font-light tracking-tight"
              />
              <Link
                href="/articles"
                className="group flex items-center gap-4 text-sm font-medium tracking-widest uppercase hover:text-primary/70 transition-colors"
              >
                {t('journal.readMore')}
                <span className="w-12 h-[1px] bg-foreground group-hover:w-16 transition-all duration-300" />
              </Link>
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {latestArticles.map((article, index) => {
                const coverUrl = getMediaUrl(article.coverImage);
                const hasCover = coverUrl && coverUrl !== "/placeholder.png";

                return (
                  <RevealOnScroll key={article.id} delay={0.1 * index}>
                    <Link href={`/articles/${article.slug}`} className="block group h-full">
                      <div className="flex flex-col h-full">
                        <div className="relative aspect-[16/10] mb-6 overflow-hidden bg-[#F5F5F5] rounded-sm">
                          {hasCover ? (
                            <Image
                              src={coverUrl}
                              alt={article.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-[0.25,0.25,0,1]"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-300 text-xs tracking-widest uppercase">
                              No Image
                            </div>
                          )}
                        </div>
                        <h3 className="font-display text-xl font-medium mb-3 group-hover:text-primary/70 transition-colors leading-snug">
                          {article.title}
                        </h3>
                        {article.excerpt && (
                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{article.excerpt}</p>
                        )}
                      </div>
                    </Link>
                  </RevealOnScroll>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 8. Final CTA Banner */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-neutral-900 flex items-center justify-center text-center">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://cdn.ruparupa.io/fit-in/1200x800/filters:format(webp)/filters:quality(90)/ruparupa-com/image/upload/Products/10520815_1.jpg"
            alt="Showroom"
            fill
            sizes="100vw"
            unoptimized
            className="object-cover opacity-60"
          />
        </div>
        <div className="relative z-10 container flex flex-col items-center">
          <RevealOnScroll>
            <h2 className="font-display text-4xl md:text-6xl font-light text-white mb-6 tracking-tight">
              {t('cta.title')}
            </h2>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light">
              {t('cta.body')}
            </p>
            <Link
              href="/store-locator"
              className="inline-flex items-center justify-center bg-white text-black px-10 py-3.5 text-sm font-medium uppercase tracking-widest hover:bg-white/90 transition-colors rounded-sm"
            >
              {t('cta.button')}
            </Link>
          </RevealOnScroll>
        </div>
      </section>
    </main>
  );
}
