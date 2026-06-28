import { getArticleBySlug } from "@/lib/cms/articles";
import { Locale } from "@/lib/cms/types";
import { notFound } from "next/navigation";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { extractLexicalText } from "@/lib/utils/lexical";
import { RichText } from "@/components/ui/RichText";
import { Link } from "@/i18n/routing";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(slug, locale as Locale);
  
  if (!article) return { title: 'Article Not Found' };

  return {
    title: article.seo?.metaTitle || `${article.title} - Eyesoul Journal`,
    description: article.seo?.metaDescription || article.excerpt,
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  
  const article = await getArticleBySlug(slug, locale as Locale);
  if (!article) notFound();

  let coverUrl = null;
  let coverAlt = article.title;
  if (article.coverImage && typeof article.coverImage === 'object' && article.coverImage.url) {
    coverUrl = article.coverImage.url;
    if (article.coverImage.alt) coverAlt = article.coverImage.alt;
  }

  // Author name extraction based on Payload schema (assumes it's a User object)
  const authorName = typeof article.author === 'object' && article.author?.name 
    ? article.author.name 
    : 'Eyesoul Editorial Team';

  return (
    <main className="flex-grow bg-background">
      <article>
        
        {/* Article Header */}
        <header className="container mx-auto px-4 py-12 md:py-16 max-w-4xl text-center">
          <RevealOnScroll>
            <div className="mb-8">
              <Link href="/articles" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Journal
              </Link>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium mb-6 leading-tight">
              {article.title}
            </h1>
            
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{authorName}</span>
              {article.publishedAt && (
                <>
                  <span className="w-1 h-1 rounded-full bg-neutral-300" />
                  <time dateTime={article.publishedAt}>
                    {new Date(article.publishedAt).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </time>
                </>
              )}
            </div>
          </RevealOnScroll>
        </header>

        {/* Cover Image */}
        {coverUrl && (
          <RevealOnScroll className="w-full max-w-5xl mx-auto px-4 mb-12 md:mb-16">
            <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden bg-neutral-100">
              <Image 
                src={coverUrl}
                alt={coverAlt}
                fill
                className="object-cover"
                priority
              />
            </div>
          </RevealOnScroll>
        )}

        {/* Article Content */}
        <section className="container mx-auto px-4 pb-24">
          <RevealOnScroll className="max-w-3xl mx-auto">
            {article.excerpt && !coverUrl && (
              <p className="text-xl md:text-2xl font-light text-neutral-600 leading-relaxed mb-10 text-center">
                {article.excerpt}
              </p>
            )}

            <div className="prose prose-neutral prose-lg mx-auto">
              <RichText data={article.content} />
            </div>
          </RevealOnScroll>
        </section>

      </article>
    </main>
  );
}
