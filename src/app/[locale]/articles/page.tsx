import { getArticles } from "@/lib/cms/articles";
import { Locale } from "@/lib/cms/types";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import Image from "next/image";

export const metadata = {
  title: "The Journal - Eyesoul Premium Eyewear",
  description: "Read our latest articles on eye health, style guides, and eyewear care.",
};

export default async function ArticlesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const articles = await getArticles(locale as Locale);

  return (
    <main className="flex-grow bg-background">
      <div className="container pt-32 pb-16 md:pt-40 md:pb-24">
        
        <RevealOnScroll className="mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-light mb-4">
            The Journal
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Insights on style, guides on eye health, and the latest news from Eyesoul.
          </p>
        </RevealOnScroll>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => {
              let coverUrl = "/placeholder.png";
              let coverAlt = article.title;
              if (article.coverImage && typeof article.coverImage === 'object' && article.coverImage.url) {
                coverUrl = article.coverImage.url;
                if (article.coverImage.alt) coverAlt = article.coverImage.alt;
              }

              return (
                <RevealOnScroll key={article.id} delay={0.1 * index}>
                  <Link href={`/articles/${article.slug}`} className="block group h-full">
                    <Card className="h-full overflow-hidden border-transparent shadow-none hover:shadow-lg transition-all duration-300 bg-neutral-50/50">
                      <CardHeader className="p-0 relative aspect-[16/10] overflow-hidden bg-neutral-100">
                        {coverUrl !== "/placeholder.png" ? (
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
