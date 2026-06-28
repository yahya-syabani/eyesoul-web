import { getServiceBySlug } from "@/lib/cms/services";
import { getSiteSettings } from "@/lib/cms/settings";
import { Locale } from "@/lib/cms/types";
import { notFound } from "next/navigation";
import { RichText } from "@/components/ui/RichText";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Clock, Tag, MessageCircle, ArrowLeft } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const service = await getServiceBySlug(slug, locale as Locale);

  if (!service) {
    return { title: "Service Not Found" };
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
  const [service, settings] = await Promise.all([
    getServiceBySlug(slug, locale as Locale),
    getSiteSettings(locale as Locale),
  ]);

  if (!service) {
    notFound();
  }

  const whatsappNumber = settings?.whatsapp || "6281234567890";
  const defaultCta = "Book Consultation";

  return (
    <main className="flex-grow bg-background">
      <div className="container mx-auto px-4 py-24 md:py-32 max-w-4xl">
        
        <RevealOnScroll>
          <Link href={`/${locale}/services`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Services
          </Link>
          
          <h1 className="font-display text-4xl md:text-5xl font-light mb-6 tracking-tight">
            {service.name}
          </h1>
          
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
                The Process
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
              Find a Store
            </Link>
          </div>
        </RevealOnScroll>
        
      </div>
    </main>
  );
}
