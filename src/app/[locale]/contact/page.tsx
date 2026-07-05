import { getSiteSettings } from "@/lib/cms/settings";
import { Locale } from "@/lib/cms/types";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { MapPin, Mail, MessageSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { getTranslations } from 'next-intl/server';
import { PageHero } from "@/components/ui/PageHero";
import { ContactFormClient } from "@/components/ui/ContactFormClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'page.contact' });
  return { title: t('meta.title'), description: t('meta.description') };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'page.contact' });
  const settings = await getSiteSettings(locale as Locale);
  
  const whatsappNumber = settings?.whatsapp || "6281234567890";
  const supportEmail = settings?.contactEmail || "hello@eyesoul.com";
  const phone = settings?.phone || "+1 (234) 567-890";

  return (
    <main className="flex-grow bg-background">
      <PageHero
        title={t('hero.title')}
        subtitle={t('hero.subtitle')}
        imageUrl="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2940&auto=format&fit=crop"
        imageAlt="Modern welcoming boutique reception"
        height="standard"
        overlayOpacity={0.3}
      />
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 max-w-6xl mx-auto">
          
          {/* Left Column: Information */}
          <div>
            <RevealOnScroll>
              <p className="text-muted-foreground text-lg mb-12 max-w-md leading-relaxed">
                {t('description')}
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={0.1}>
              <div className="space-y-10">
                
                {/* Contact Method: WhatsApp */}
                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-neutral-100 flex items-center justify-center rounded-full mr-6 shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <MessageSquare className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-medium mb-1">WhatsApp Concierge</h3>
                    <p className="text-muted-foreground text-sm mb-2">Fastest response time. Available 9am - 8pm.</p>
                    <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-primary transition-colors flex items-center">
                      Chat with us <ArrowRight className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>

                {/* Contact Method: Email */}
                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-neutral-100 flex items-center justify-center rounded-full mr-6 shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Mail className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-medium mb-1">Email Support</h3>
                    <p className="text-muted-foreground text-sm mb-2">We aim to respond within 24 hours.</p>
                    <a href={`mailto:${supportEmail}`} className="text-sm font-medium hover:text-primary transition-colors flex items-center">
                      {supportEmail} <ArrowRight className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>

                {/* Contact Method: Visit */}
                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-neutral-100 flex items-center justify-center rounded-full mr-6 shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <MapPin className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-medium mb-1">Flagship Store</h3>
                    <p className="text-muted-foreground text-sm mb-2">{settings?.address || "Visit our store locator for addresses"}</p>
                    <Link href="/store-locator" className="text-sm font-medium hover:text-primary transition-colors flex items-center">
                      Get Directions <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                  </div>
                </div>

              </div>
            </RevealOnScroll>
          </div>

          {/* Right Column: Form */}
          <div>
            <RevealOnScroll delay={0.2}>
              <ContactFormClient />
            </RevealOnScroll>
          </div>

        </div>
      </div>
    </main>
  );
}
