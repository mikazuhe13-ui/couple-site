export const SITE_URL = "https://couple-site-dusky.vercel.app";
export const SITE_NAME = "杜明洋 × 陈柯嘉";
export const SITE_DESCRIPTION =
  "记录杜明洋与陈柯嘉共同走过的浪漫时光，珍藏相遇、陪伴与每一个值得纪念的瞬间。";

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    inLanguage: "zh-CN",
    about: [
      { "@type": "Person", name: "杜明洋" },
      { "@type": "Person", name: "陈柯嘉" },
    ],
  };
}
