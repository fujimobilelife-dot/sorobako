import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://sorobako.app"
  return [
    { url: base,                    lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/guide`,         lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/guide/kaigyou`, lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/terms`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/privacy`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/legal`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ]
}
