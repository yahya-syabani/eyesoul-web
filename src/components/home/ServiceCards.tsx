"use client";

import { Service } from "@/lib/cms/types";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { Link } from "@/i18n/routing";
import { Eye, Ruler, Stethoscope, Glasses, Home, Building2 } from "lucide-react";
import { useTranslations } from 'next-intl';

interface ServiceCardsProps {
  services: Service[];
}

export function ServiceCards({ services }: ServiceCardsProps) {
  const t = useTranslations('home');
  if (services.length === 0) return null;

  const getServiceIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("home")) return <Home className="w-8 h-8 stroke-[1.5]" />;
    if (n.includes("company") || n.includes("corporate")) return <Building2 className="w-8 h-8 stroke-[1.5]" />;
    if (n.includes("exam") || n.includes("test")) return <Stethoscope className="w-8 h-8 stroke-[1.5]" />;
    if (n.includes("fit") || n.includes("tailor")) return <Ruler className="w-8 h-8 stroke-[1.5]" />;
    if (n.includes("lens") || n.includes("repair")) return <Glasses className="w-8 h-8 stroke-[1.5]" />;
    return <Eye className="w-8 h-8 stroke-[1.5]" />;
  };

  const displayed = services.slice(0, 4);

  return (
    <section className="py-24 bg-[#F5F5F5]">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <RevealOnScroll className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <AnimatedText
              text={t('services.title')}
              el="h2"
              className="font-display text-4xl md:text-5xl font-light mb-6 tracking-tight"
            />
            <p className="text-muted-foreground text-lg leading-relaxed max-w-lg">
              Beyond luxury frames, we offer comprehensive optical care from expert optometrists and opticians, tailored to your exact visual needs.
            </p>
          </div>
          <Link
            href="/services"
            className="hidden md:flex items-center justify-center bg-neutral-900 text-white px-8 py-4 text-sm font-medium uppercase tracking-widest hover:bg-neutral-800 transition-colors rounded-sm shrink-0"
          >
            {t('services.explore')}
          </Link>
        </RevealOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayed.map((service, index) => (
            <RevealOnScroll key={service.id} delay={0.1 * index}>
              <Link href={`/services/${service.slug}`} className="block h-full group">
                <div className="flex flex-col h-full bg-white p-8 md:p-10 rounded-2xl border border-neutral-200 hover:border-neutral-300 hover:shadow-md transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800 mb-8 group-hover:scale-110 group-hover:bg-neutral-900 group-hover:text-white transition-all duration-500">
                    {getServiceIcon(service.name)}
                  </div>
                  <h3 className="font-display font-medium text-xl md:text-2xl mb-4 group-hover:text-primary transition-colors">
                    {service.name}
                  </h3>
                  {service.description && (
                    <p className="text-muted-foreground text-sm leading-relaxed mt-auto">
                      {service.description}
                    </p>
                  )}
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>

        <Link
            href="/services"
            className="md:hidden mt-10 flex items-center justify-center border border-neutral-900 text-neutral-900 px-8 py-4 text-sm font-medium uppercase tracking-widest hover:bg-neutral-900 hover:text-white transition-colors rounded-sm w-full"
          >
            {t('services.exploreAll')}
        </Link>
      </div>
    </section>
  );
}
