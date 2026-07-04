import { getArticles } from "@/lib/cms/articles";
import { Locale } from "@/lib/cms/types";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { getMediaUrl } from "@/lib/utils/media";
import { getTranslations } from 'next-intl/server';
import { PageHero } from "@/components/ui/PageHero";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'page.articles' });
  return { title: t('meta.title'), description: t('meta.description') };
}

export default async function ArticlesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'page.articles' });
  const articles = await getArticles(locale as Locale);

  return (
    <main className="flex-grow bg-background">
      <PageHero
        title={t('hero.title')}
        subtitle={t('hero.subtitle')}
        imageUrl="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2960&auto=format&fit=crop"
        imageAlt="Person reading a journal in eyewear"
        height="standard"
        overlayOpacity={0.4}
      />
      <div className="container py-16 md:py-24">

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => {
              const coverUrl = getMediaUrl(article.coverImage);
              const coverAlt = article.title;

              return (
                <RevealOnScroll key={article.id} delay={0.1 * index}>
                  <Link href={`/articles/${article.slug}`} className="block group h-full">
                    <Card className="h-full overflow-hidden border-transparent shadow-none hover:shadow-lg transition-all duration-300 bg-neutral-50/50">
                      <CardHeader className="p-0 relative aspect-[16/10] overflow-hidden bg-neutral-100">
                        {coverUrl && coverUrl !== "/placeholder.png" ? (
                          <Image
                            src={coverUrl}
                            alt={coverAlt}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-400">
                            No Image
                          </div>
                        )}
                      </CardHeader>
                      
                      <CardContent className="p-6">
                        <div className="mb-3 text-xs font-medium text-muted-foreground flex justify-between items-center">
                          <span className="uppercase tracking-wider">Guide</span>
                          {article.publishedAt && (
                            <span>{new Date(article.publishedAt).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          )}
                        </div>
                        <h3 className="font-display text-xl font-medium mb-3 group-hover:text-primary transition-colors leading-tight">
                          {article.title}
                        </h3>
                        {article.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-3 mb-6">
                            {article.excerpt}
                          </p>
                        )}
                        <div className="text-sm font-medium text-primary group-hover:underline underline-offset-4 mt-auto">
                          Read Article &rarr;
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </RevealOnScroll>
              );
            })}
          </div>
        ) : (
          <div className="py-24 text-center border border-dashed rounded-xl border-neutral-300">
            <h2 className="text-2xl font-display text-neutral-400">No articles published yet.</h2>
          </div>
        )}
        
      </div>
    </main>
  );
}
