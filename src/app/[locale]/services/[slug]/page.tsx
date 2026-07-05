import { getServiceBySlug } from "@/lib/cms/services";
import { getSiteSettings } from "@/lib/cms/settings";
import { Locale } from "@/lib/cms/types";
import { getTranslations } from 'next-intl/server';
import { notFound } from "next/navigation";
import { RichText } from "@/components/ui/RichText";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Clock, Tag, MessageCircle, ArrowLeft } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { PageHero } from "@/components/ui/PageHero";
import { getMediaUrl } from "@/lib/utils/media";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const service = await getServiceBySlug(slug, locale as Locale);
  const t = await getTranslations({ locale, namespace: 'page.services' });

  if (!service) {
    return { title: t('notFound') };
  }

  return {
    title: `${service.name} - Optical Services | Eyesoul`,
    description: service.description || `Learn more about our ${service.name} service.`,
  };
}

export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: 'page.services' });
  const [service, settings] = await Promise.all([
    getServiceBySlug(slug, locale as Locale),
    getSiteSettings(locale as Locale),
  ]);

  if (!service) {
    notFound();
  }

  const whatsappNumber = settings?.whatsapp || "6281234567890";
  const defaultCta = t('bookConsultation');

  // Per-service hero images
  const heroImages: Record<string, string> = {
    'eye-examination': 'https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=2940&auto=format&fit=crop',
    'repairs': 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?q=80&w=2940&auto=format&fit=crop',
    'home-service': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2958&auto=format&fit=crop',
    'corporate-service': 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2940&auto=format&fit=crop',
  };
  const heroUrl = getMediaUrl(service.heroImage) || getMediaUrl(service.coverImage) || heroImages[slug] || heroImages['eye-examination'];
  const heroAlt = `${service.name} - Eyesoul Premium Eyewear`;

  return (
    <main className="flex-grow bg-background">
      <PageHero
        title={service.name}
        subtitle={service.duration ? `${service.duration} · ${service.pricing || ''}` : t('hero.subtitle')}
        imageUrl={heroUrl}
        imageAlt={heroAlt}
        height="standard"
        overlayOpacity={0.55}
      />
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
        
        <RevealOnScroll>
          <Link href={`/${locale}/services`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {t('allServices')}
          </Link>
          
          <div className="flex flex-wrap gap-4 mb-10">
            {service.duration && (
              <div className="flex items-center text-sm font-medium text-muted-foreground bg-neutral-100 px-3 py-1.5 rounded-md">
                <Clock className="w-4 h-4 mr-2" />
                {service.duration}
              </div>
            )}
            {service.pricing && (
              <div className="flex items-center text-sm font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-md">
                <Tag className="w-4 h-4 mr-2" />
                {service.pricing}
              </div>
            )}
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          {service.description && (
            <div className="text-xl text-neutral-600 leading-relaxed mb-12">
              {service.description}
            </div>
          )}

          {service.process && (
            <div className="bg-neutral-50 p-8 md:p-12 rounded-2xl mb-12 border border-neutral-100">
              <h2 className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-6">
                {t('theProcess')}
              </h2>
              <div className="prose prose-neutral prose-lg max-w-none">
                <RichText data={service.process} />
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 border-t border-neutral-200 pt-12 mt-12">
            <a 
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "default", size: "lg", className: "px-8" })}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              {service.ctaLabel || defaultCta}
            </a>
            <Link 
              href={`/${locale}/store-locator`}
              className={buttonVariants({ variant: "outline", size: "lg", className: "px-8" })}
            >
              {t('findAStore')}
            </Link>
          </div>
        </RevealOnScroll>
        
      </div>
    </main>
  );
}
