import { SITE_URL } from "@/lib/site-metadata.mjs";

export default function sitemap() {
  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
