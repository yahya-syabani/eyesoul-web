import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SiteBanner } from "@/components/home/SiteBanner";
import { getSiteBanner } from "@/lib/cms/settings";
import { getSiteSettings } from "@/lib/cms/globals";
import { getBrands } from "@/lib/cms/brands";
import { getCollections } from "@/lib/cms/collections";
import { getCategories } from "@/lib/cms/categories";
import { Locale } from "@/lib/cms/types";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.FRONTEND_URL || 'http://localhost:3001'),
  title: "Eyesoul Premium Eyewear",
  description: "Quiet luxury, custom acetate, lightweight feel.",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  const [siteBanner, siteSettings, brands, collections, categories] = await Promise.all([
    getSiteBanner(locale as Locale),
    getSiteSettings(locale as Locale),
    getBrands(locale as Locale),
    getCollections(locale as Locale),
    getCategories(locale as Locale)
  ]);

  const bannerEnabled = siteBanner?.enabled !== false;
  const bannerMessage = bannerEnabled ? siteBanner?.message : undefined;

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <NextIntlClientProvider messages={messages}>
          <SiteBanner
            message={bannerMessage}
            link={siteBanner?.link}
            linkLabel={siteBanner?.linkLabel}
          />
          <Header brands={brands} collections={collections} categories={categories} />
          <main className="flex-1 flex flex-col w-full relative">
            {children}
          </main>
          <Footer siteSettings={siteSettings} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
