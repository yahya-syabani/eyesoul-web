import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin/",
    },
    sitemap: `${process.env.FRONTEND_URL || "http://localhost:3001"}/sitemap.xml`,
  };
}
