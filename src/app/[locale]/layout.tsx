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
import { getSiteSettings } from "@/lib/cms/settings";
import { getBrands } from "@/lib/cms/brands";
import { getCollections } from "@/lib/cms/collections";
import { getCategories } from "@/lib/cms/categories";
import { getServices } from "@/lib/cms/services";
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

const BASE_URL = process.env.FRONTEND_URL || "http://localhost:3001";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    metadataBase: new URL(BASE_URL),
    title: "Eyesoul Premium Eyewear",
    description: "Quiet luxury, custom acetate, lightweight feel.",
    openGraph: {
      siteName: "Eyesoul Premium Eyewear",
      type: "website",
      locale: locale === "id" ? "id_ID" : "en_US",
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        en: `${BASE_URL}/en`,
        id: `${BASE_URL}/id`,
      },
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  const [siteBanner, siteSettings, brands, collections, categories, services] = await Promise.all([
    getSiteBanner(locale as Locale),
    getSiteSettings(locale as Locale),
    getBrands(locale as Locale),
    getCollections(locale as Locale),
    getCategories(locale as Locale),
    getServices(locale as Locale)
  ]);

  const bannerEnabled = siteBanner?.enabled !== false;
  const bannerMessage = bannerEnabled ? siteBanner?.message : undefined;

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium"
        >
          Skip to main content
        </a>
        <NextIntlClientProvider messages={messages}>
          <SiteBanner
            message={bannerMessage}
            link={siteBanner?.link}
            linkLabel={siteBanner?.linkLabel}
          />
          <Header brands={brands} collections={collections} categories={categories} services={services} />
          <div id="main-content" className="flex-1 flex flex-col w-full relative">
            {children}
          </div>
          <Footer siteSettings={siteSettings} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
