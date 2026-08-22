import type { MetadataRoute } from "next";
import { canonicalUrl, resolveSiteUrl } from "@/lib/publication/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: canonicalUrl("/sitemap.xml"),
    host: resolveSiteUrl().origin,
  };
}
