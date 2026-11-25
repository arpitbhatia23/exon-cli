import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const outputDirectory = resolve("dist");
const serverBundle = resolve("node_modules/.cache/docs-ssr/entry-server.js");
const { pageMetadata, renderPage } = await import(
  pathToFileURL(serverBundle).href
);
const template = await readFile(resolve(outputDirectory, "index.html"), "utf8");
const docsOrigin = "https://exon-cli-docs.vercel.app";

function updateMeta(html, attribute, key, value) {
  const escapedValue = value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
  const pattern = new RegExp(
    `(<meta\\s+${attribute}="${key}"\\s+content=")[^"]*("\\s*\\/?>)`,
  );
  return html.replace(pattern, `$1${escapedValue}$2`);
}

for (const [pageId, metadata] of Object.entries(pageMetadata)) {
  const path = pageId === "home" ? "/" : `/docs/${pageId}/`;
  const canonicalUrl = `${docsOrigin}${path}`;
  const htmlContent = renderPage(pageId);
  let html = template.replace(
    '<div id="root"></div>',
    `<div id="root">${htmlContent}</div>`,
  );
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${metadata.title}</title>`,
  );
  html = updateMeta(html, "name", "title", metadata.title);
  html = updateMeta(html, "name", "description", metadata.description);
  html = updateMeta(html, "property", "og:title", metadata.title);
  html = updateMeta(html, "property", "og:description", metadata.description);
  html = updateMeta(html, "property", "og:url", canonicalUrl);
  html = updateMeta(html, "name", "twitter:title", metadata.title);
  html = updateMeta(html, "name", "twitter:description", metadata.description);
  html = updateMeta(html, "name", "twitter:url", canonicalUrl);
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${canonicalUrl}" />`,
  );

  const pageSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: metadata.title,
    description: metadata.description,
    url: canonicalUrl,
    isPartOf: {
      "@type": "WebSite",
      name: "Exon CLI Documentation",
      url: `${docsOrigin}/`,
    },
    inLanguage: "en",
  });
  html = html.replace(
    "</head>",
    `<script type="application/ld+json">${pageSchema}</script></head>`,
  );

  const outputPath =
    pageId === "home"
      ? resolve(outputDirectory, "index.html")
      : resolve(outputDirectory, "docs", pageId, "index.html");
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html);
}
