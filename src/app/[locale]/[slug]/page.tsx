import { getPageBySlug } from "@/lib/cms/pages";
import { Locale } from "@/lib/cms/types";
import { notFound } from "next/navigation";
import { RichText } from "@/components/ui/RichText";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const page = await getPageBySlug(slug, locale as Locale);

  if (!page) {
    return {
      title: "Not Found",
    };
  }

  return {
    title: page.seo?.title || `${page.title} - Eyesoul`,
    description: page.seo?.description || `Eyesoul ${page.title} page`,
  };
}

export default async function GenericPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const page = await getPageBySlug(slug, locale as Locale);

  if (!page) {
    notFound();
  }

  return (
    <main className="flex-grow bg-background pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <RevealOnScroll className="mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-light mb-6 tracking-tight">
            {page.title}
          </h1>
          <div className="w-12 h-1 bg-primary mb-12"></div>
        </RevealOnScroll>
        
        <RevealOnScroll delay={0.1}>
          <div className="prose prose-neutral prose-lg max-w-none">
            <RichText data={page.content} />
          </div>
        </RevealOnScroll>
      </div>
    </main>
  );
}
