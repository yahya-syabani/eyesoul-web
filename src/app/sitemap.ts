import { MetadataRoute } from "next";

const BASE_URL = process.env.FRONTEND_URL || "http://localhost:3001";

const locales = ["en", "id"] as const;

const staticRoutes = [
  "",
  "/products",
  "/brands",
  "/collections",
  "/services",
  "/articles",
  "/faq",
  "/contact",
  "/store-locator",
  "/privacy",
  "/terms",
  "/wishlist",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Static routes for each locale
  for (const locale of locales) {
    for (const route of staticRoutes) {
      entries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1.0 : 0.8,
      });
    }
  }

  return entries;
}
