import CoupleSite from "@/components/CoupleSite";
import { buildWebsiteJsonLd } from "@/lib/site-metadata.mjs";

export default function Home() {
  const websiteJsonLd = buildWebsiteJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <CoupleSite />
    </>
  );
}
