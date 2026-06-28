import { getServices } from "@/lib/cms/services";
import { getSiteSettings } from "@/lib/cms/settings";
import { Locale } from "@/lib/cms/types";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { MessageCircle, Clock, Tag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { extractLexicalText } from "@/lib/utils/lexical";
import { RichText } from "@/components/ui/RichText";

export const metadata = {
  title: "Optical Services - Eyesoul Premium Eyewear",
  description: "Explore our comprehensive optical services including eye examinations, frame adjustments, and lens fitting.",
};

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [services, settings] = await Promise.all([
    getServices(locale as Locale),
    getSiteSettings(locale as Locale),
  ]);
  const whatsappNumber = settings?.whatsapp || "6281234567890";

  return (
    <main className="flex-grow bg-neutral-50/30">
      <div className="container mx-auto px-4 py-12 md:py-24">
        
        <RevealOnScroll className="mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-light mb-4">
            Optical Services
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Our expert optometrists and opticians provide comprehensive care to ensure your vision is clear and your frames fit perfectly.
          </p>
        </RevealOnScroll>

        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service, index) => (
              <RevealOnScroll key={service.id} delay={0.1 * index}>
                <Card className="h-full overflow-hidden border-transparent shadow-sm hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8 flex flex-col h-full bg-white relative">
                    <div className="mb-auto">
                      <h3 className="font-display text-2xl font-medium mb-3">
                        {service.name}
                      </h3>
                      
                      <div className="flex flex-wrap gap-4 mb-4">
                        {service.duration && (
                          <div className="flex items-center text-xs font-medium text-muted-foreground bg-neutral-100 px-2.5 py-1 rounded-md">
                            <Clock className="w-3.5 h-3.5 mr-1.5" />
                            {service.duration}
                          </div>
                        )}
                        {service.pricing && (
                          <div className="flex items-center text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                            <Tag className="w-3.5 h-3.5 mr-1.5" />
                            {service.pricing}
                          </div>
                        )}
                      </div>

                      {service.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                          {service.description}
                        </p>
                      )}
                      
                      {service.process && (
                        <div className="text-sm text-neutral-600 mb-6 border-l-2 border-primary/20 pl-4 py-1">
                          <strong className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">The Process</strong>
                          <RichText data={service.process} />
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-6 border-t border-neutral-100 flex gap-2">
                      <Link 
                        href={`/${locale}/services/${service.slug}`}
                        className={buttonVariants({ variant: "outline", className: "flex-1" })}
                      >
                        Details
                      </Link>
                      <a 
                        href={`https://wa.me/${whatsappNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonVariants({ variant: "default", className: "flex-1" })}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Book
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </RevealOnScroll>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border border-dashed rounded-xl border-neutral-300">
            <h2 className="text-2xl font-display text-neutral-400">No services listed yet.</h2>
          </div>
        )}
        
      </div>
    </main>
  );
}
