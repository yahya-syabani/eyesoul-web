import { getStores } from "@/lib/cms/stores";
import { StoreLocatorClient } from "./StoreLocatorClient";
import { Locale } from "@/lib/cms/types";

export const metadata = {
  title: "Store Locator - Eyesoul Premium Eyewear",
  description: "Find an Eyesoul showroom near you for a comprehensive eye examination and to explore our collections.",
};

export default async function StoreLocatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Fetch store locations server-side (great for SEO and initial load)
  const stores = await getStores(locale as Locale);

  return (
    <main className="flex-grow bg-background">
      {/* 
        We pass the server-fetched stores to our client component.
        This enables interactive mapping while keeping the initial data load fast and crawlable.
      */}
      <StoreLocatorClient stores={stores} />
    </main>
  );
}
