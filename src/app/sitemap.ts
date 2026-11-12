import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { ARTICLES } from "@/content/blog";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const PAGES = ["", "/doctors", "/services", "/booking", "/telehealth", "/blog", "/contact", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...PAGES, ...ARTICLES.map((a) => `/blog/${a.slug}`)];
  return paths.map((path) => ({
    url: `${SITE}/fr${path}`,
    changeFrequency: path.startsWith("/blog/") ? "monthly" : "weekly",
    priority: path === "" ? 1 : 0.7,
    alternates: { languages: Object.fromEntries(routing.locales.map((l) => [l, `${SITE}/${l}${path}`])) },
  }));
}
