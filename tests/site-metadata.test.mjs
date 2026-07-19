import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  SITE_URL,
  SITE_NAME,
  buildWebsiteJsonLd,
} from "../lib/site-metadata.mjs";

test("site identity is canonical and public", () => {
  assert.equal(SITE_URL, "https://www.dulovejia.me");
  assert.match(SITE_NAME, /杜明洋.*陈柯嘉/);
});

test("website JSON-LD uses the canonical URL and only the named people", () => {
  const jsonLd = buildWebsiteJsonLd();

  assert.equal(jsonLd["@type"], "WebSite");
  assert.equal(jsonLd.url, SITE_URL);
  assert.equal(jsonLd.inLanguage, "zh-CN");
  assert.deepEqual(jsonLd.about, [
    { "@type": "Person", name: "杜明洋" },
    { "@type": "Person", name: "陈柯嘉" },
  ]);
});

test("social preview is a 1200 by 630 PNG", async () => {
  const image = await readFile(
    new URL("../public/opengraph-image.png", import.meta.url)
  );

  assert.deepEqual(
    image.subarray(0, 8),
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  );
  assert.equal(image.readUInt32BE(16), 1200);
  assert.equal(image.readUInt32BE(20), 630);
});

test("Next.js app icon is present and is a valid PNG", async () => {
  const icon = await readFile(new URL("../app/icon.png", import.meta.url));

  assert.deepEqual(
    icon.subarray(0, 8),
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  );
  assert.ok(icon.length > 0);
});
