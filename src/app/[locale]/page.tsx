import { getBanners } from "@/lib/cms/banners";
import { getCollections } from "@/lib/cms/collections";
import { getProducts } from "@/lib/cms/products";
import { getTestimonials } from "@/lib/cms/testimonials";
import { getArticles } from "@/lib/cms/articles";
import { getServices } from "@/lib/cms/services";
import { Locale } from "@/lib/cms/types";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { FeaturedCollections } from "@/components/home/FeaturedCollections";
import { TestimonialCarousel } from "@/components/home/TestimonialCarousel";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { ProductCard } from "@/components/ui/ProductCard";
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

  const [banners, collections, productsRes, testimonials, articles, services] = await Promise.all([
    getBanners(locale as Locale),
    getCollections(locale as Locale),
    getProducts({ locale: locale as Locale, limit: 8 }),
    getTestimonials(locale as Locale),
    getArticles(locale as Locale),
    getServices(locale as Locale),
  ]);

  const featuredProducts = productsRes.docs.filter((p) => p.status?.featured).slice(0, 4);
  const latestArticles = articles.slice(0, 3);

  return (
    <main className="flex-grow bg-background">
      {/* Hero Carousel - Cinematic & Borderless */}
      <HeroCarousel banners={banners} />

      {/* Brand Philosophy - Asymmetrical Text Block */}
      <section className="py-16 md:py-24">
        <div className="container">
          <RevealOnScroll className="max-w-3xl ml-auto">
            <p className="text-muted-foreground uppercase tracking-widest text-xs font-semibold mb-6">
              The Eyesoul Philosophy
            </p>
            <h2 className="font-display text-2xl md:text-4xl lg:text-5xl font-light leading-snug tracking-tight">
              "We believe eyewear is the most intimate accessory. It defines how the world sees you, and how you see the world."
            </h2>
          </RevealOnScroll>
        </div>
      </section>

      {/* Featured Collections - Editorial Layout */}
      <FeaturedCollections collections={collections} />

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container">
            <RevealOnScroll className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div>
                <AnimatedText 
                  text="Iconic Frames"
                  el="h2"
                  className="font-display text-3xl md:text-5xl font-light mb-4 tracking-tight"
                />
                <p className="text-muted-foreground">Our most sought-after designs.</p>
              </div>
              <Link
                href="/products"
                className="group flex items-center gap-4 text-sm font-medium tracking-widest uppercase hover:text-primary/70 transition-colors"
              >
                View Collection 
                <span className="w-12 h-[1px] bg-foreground group-hover:w-16 transition-all duration-300" />
              </Link>
            </RevealOnScroll>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {featuredProducts.map((product, index) => (
                <RevealOnScroll key={product.id} delay={0.1 * (index % 4)}>
                  <ProductCard product={product} />
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services Preview - Minimal Text Focused */}
      {services.length > 0 && (
        <section className="py-16 md:py-24 bg-[#F5F5F5]">
          <div className="container">
            <RevealOnScroll className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
              <div className="md:col-span-5 flex flex-col justify-center">
                <AnimatedText 
                  text="Bespoke Services"
                  el="h2"
                  className="font-display text-4xl md:text-5xl font-light mb-6 tracking-tight"
                />
                <p className="text-muted-foreground text-lg mb-10 leading-relaxed max-w-md">
                  Beyond eyewear, we offer comprehensive optical care from expert optometrists and opticians, tailored to your exact visual needs.
                </p>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center border border-foreground text-foreground px-8 py-3 text-sm font-medium uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors w-max"
                >
                  Explore Services
                </Link>
              </div>

              <div className="md:col-span-6 md:col-start-7 flex flex-col gap-8">
                {services.slice(0, 3).map((service, index) => (
                  <div key={service.id} className="border-b border-border/50 pb-8 last:border-0">
                    <h3 className="font-display font-medium text-2xl mb-2">{service.name}</h3>
                    {service.description && (
                      <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <TestimonialCarousel testimonials={testimonials} />

      {/* Blog Preview - Borderless Editorial */}
      {latestArticles.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container">
            <RevealOnScroll className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <AnimatedText 
                text="The Journal"
                el="h2"
                className="font-display text-3xl md:text-5xl font-light tracking-tight"
              />
              <Link
                href="/articles"
                className="group flex items-center gap-4 text-sm font-medium tracking-widest uppercase hover:text-primary/70 transition-colors"
              >
                Read More
                <span className="w-12 h-[1px] bg-foreground group-hover:w-16 transition-all duration-300" />
              </Link>
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {latestArticles.map((article, index) => {
                const coverUrl =
                  article.coverImage && typeof article.coverImage === "object"
                    ? article.coverImage.url
                    : null;

                return (
                  <RevealOnScroll key={article.id} delay={0.1 * index}>
                    <Link href={`/articles/${article.slug}`} className="block group h-full">
                      <div className="flex flex-col h-full">
                        <div className="relative aspect-[16/10] mb-6 overflow-hidden bg-[#F5F5F5] rounded-sm">
                          {coverUrl ? (
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

      {/* CTA Banner - Cinematic Full Bleed */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-neutral-900 flex items-center justify-center text-center">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/campaign-fallback.svg"
            alt="Showroom"
            fill
            sizes="100vw"
            className="object-cover opacity-60"
          />
        </div>
        <div className="relative z-10 container flex flex-col items-center">
          <RevealOnScroll>
            <h2 className="font-display text-4xl md:text-6xl font-light text-white mb-6 tracking-tight">
              Experience the Difference
            </h2>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light">
              Visit our showroom for a complimentary consultation and discover your perfect frame with our dedicated opticians.
            </p>
            <Link
              href="/store-locator"
              className="inline-flex items-center justify-center bg-white text-black px-10 py-3.5 text-sm font-medium uppercase tracking-widest hover:bg-white/90 transition-colors"
            >
              Find a Store
            </Link>
          </RevealOnScroll>
        </div>
      </section>
    </main>
  );
}
