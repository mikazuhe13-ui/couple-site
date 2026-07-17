import CoupleSite from "@/components/CoupleSite";
import { getInitialContent } from "@/lib/content";
import { buildWebsiteJsonLd } from "@/lib/site-metadata.mjs";

export const revalidate = 60;

export default async function Home() {
  const initialContent = await getInitialContent();
  const websiteJsonLd = buildWebsiteJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <CoupleSite initialContent={initialContent} />
    </>
  );
}
