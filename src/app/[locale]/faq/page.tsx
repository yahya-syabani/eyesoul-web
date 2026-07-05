import { getFAQs } from "@/lib/cms/faq";
import { Locale } from "@/lib/cms/types";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Plus } from "lucide-react";
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'page.faq' });
  return {
    title: `${t('hero.title')} - Eyesoul Premium Eyewear`,
    description: t('hero.subtitle'),
  };
}

export default async function FAQPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'page.faq' });
  const faqs = await getFAQs(locale as Locale);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <main className="flex-grow bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="container mx-auto px-4 py-12 md:py-24 max-w-3xl">
        <RevealOnScroll className="mb-16 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-light mb-4">
            {t('hero.title')}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
        </RevealOnScroll>

        {faqs.length > 0 ? (
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <RevealOnScroll key={faq.id} delay={0.05 * index}>
                <details className="group border-b border-neutral-200 pb-6 mb-6 open:pb-8">
                  <summary className="flex justify-between items-center cursor-pointer list-none text-lg font-display font-medium text-foreground hover:text-primary transition-colors">
                    <span>{faq.question}</span>
                    <span className="transition-transform duration-300 group-open:rotate-45">
                      <Plus className="w-5 h-5 text-neutral-400 group-hover:text-primary transition-colors" />
                    </span>
                  </summary>
                  <p className="mt-4 text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                    {faq.answer}
                  </p>
                </details>
              </RevealOnScroll>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border border-dashed rounded-xl border-neutral-300">
            <h2 className="text-2xl font-display text-neutral-400">No FAQs available yet.</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Check back later for answers to common questions.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
