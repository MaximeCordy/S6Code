// ============================================================
// Génère les pages ANGLAISES (src/en/*.html) à partir des pages françaises.
//
//   node scripts/build-i18n.mjs            -> génère src/en/
//   node scripts/build-i18n.mjs --strict   -> échoue si une phrase n'est pas traduite
//
// Dictionnaire : src/i18n/en.json  { "texte français normalisé": "English text" }
// - une clé = le texte d'un élément (espaces normalisés) ou, pour un élément mêlant
//   texte et balises en ligne (<em>, <br>…), son innerHTML normalisé ;
// - les attributs alt / aria-label / data-label / title et les <meta> SEO sont traduits ;
// - une chaîne absente du dictionnaire reste en français (et est signalée).
// Le même dictionnaire sert au JavaScript (panneau d'infos) : src/js/i18n.js.
// ============================================================
import { parse } from "node-html-parser";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const SRC = path.join(ROOT, "src");
const OUT = path.join(SRC, "en");
const BASE = "https://galerie-souvenirs.cordy-maxime.ch";
const STRICT = process.argv.includes("--strict");

const dict = JSON.parse(fs.readFileSync(path.join(SRC, "i18n", "en.json"), "utf8"));
const norm = (s) => s.replace(/\s+/g, " ").trim();
const INLINE = new Set(["em", "strong", "b", "i", "u", "br", "mark", "small"]);
const SKIP_TAGS = new Set(["script", "style", "svg", "path"]);
const ATTRS = ["alt", "aria-label", "data-label", "title"];
const SEO_META = /description|og:title|twitter:title|og:image:alt/;

const missing = new Map();
function tr(key, where) {
  if (Object.prototype.hasOwnProperty.call(dict, key)) return dict[key];
  // pas de traduction : on ne signale que les vraies phrases (pas les noms propres / symboles)
  if (key.split(" ").length >= 3 && /[a-zà-ÿ]/.test(key)) missing.set(key, where);
  return null;
}

function translateTree(node, where) {
  for (const el of node.childNodes) {
    if (el.nodeType === 3) {
      const raw = el.rawText;
      const t = norm(raw);
      if (!t) continue;
      const en = tr(t, where);
      if (en != null) {
        const lead = raw.match(/^\s*/)[0];
        const trail = raw.match(/\s*$/)[0];
        el.rawText = lead + en + trail;
      }
      continue;
    }
    if (el.nodeType !== 1) continue;
    const tag = el.tagName?.toLowerCase();
    if (SKIP_TAGS.has(tag) || el.hasAttribute("data-no-i18n")) continue;
    for (const a of ATTRS) {
      const v = el.getAttribute(a);
      if (v) {
        const en = tr(norm(v), where + "@" + a);
        if (en != null) el.setAttribute(a, en);
      }
    }
    const kids = el.childNodes.filter((c) => c.nodeType === 1);
    const hasText = el.childNodes.some((c) => c.nodeType === 3 && norm(c.rawText));
    if (hasText && kids.length && kids.every((k) => INLINE.has(k.tagName.toLowerCase()))) {
      const en = tr(norm(el.innerHTML), where);
      if (en != null) {
        el.set_content(en);
        continue;
      }
    }
    translateTree(el, where);
  }
}

// chemins relatifs d'une page de src/ -> page de src/en/ : on remonte d'un niveau
function fixUrl(v) {
  if (!v || /^(https?:|mailto:|tel:|#|\/|data:)/.test(v)) return v;
  return "../" + v;
}
function rewritePaths(root) {
  for (const el of root.querySelectorAll("*")) {
    const tag = el.tagName?.toLowerCase();
    for (const a of ["src", "href", "srcset"]) {
      const v = el.getAttribute(a);
      if (v == null) continue;
      // liens vers les AUTRES PAGES : restent relatifs (elles sont dans le même dossier /en/)
      if (tag === "a" && /\.html$/.test(v)) continue;
      el.setAttribute(a, a === "srcset" ? v.split(",").map((p) => fixUrl(p.trim().split(" ")[0]) + (p.trim().includes(" ") ? " " + p.trim().split(" ").slice(1).join(" ") : "")).join(", ") : fixUrl(v));
    }
  }
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const pages = fs.readdirSync(SRC).filter((f) => f.endsWith(".html") && f !== "404.html");
for (const file of pages) {
  const html = fs.readFileSync(path.join(SRC, file), "utf8");
  const root = parse(html, { comment: true, blockTextElements: { script: true, style: true, pre: true } });

  root.querySelector("html").setAttribute("lang", "en");

  // --- <head> : titre + meta SEO
  const head = root.querySelector("head");
  const title = head.querySelector("title");
  const tTitle = tr(norm(title.text), file + "@title");
  if (tTitle != null) title.set_content(tTitle);
  for (const m of head.querySelectorAll("meta")) {
    const name = m.getAttribute("name") || m.getAttribute("property") || "";
    const c = m.getAttribute("content");
    if (c && SEO_META.test(name)) {
      const en = tr(norm(c), file + "@meta");
      if (en != null) m.setAttribute("content", en);
    }
  }
  const pageUrl = file === "index.html" ? "/en/" : `/en/${file}`;
  head.querySelector('link[rel="canonical"]')?.setAttribute("href", BASE + pageUrl);
  head.querySelector('meta[property="og:url"]')?.setAttribute("content", BASE + pageUrl);
  head.querySelector('meta[property="og:locale"]')?.setAttribute("content", "en_GB");

  // --- <body>
  translateTree(root.querySelector("body"), file);

  // --- bouton de langue : sur la page anglaise il ramène au français
  const toggle = root.querySelector("#lang-toggle");
  if (toggle) {
    toggle.setAttribute("href", `../${file}`);
    toggle.setAttribute("hreflang", "fr");
    toggle.setAttribute("lang", "fr");
    toggle.setAttribute("aria-label", "Passer en français");
    toggle.set_content("FR");
  }

  rewritePaths(root);
  fs.writeFileSync(path.join(OUT, file), root.toString());
}

console.log(`i18n : ${pages.length} pages anglaises générées dans src/en/`);
if (missing.size) {
  console.warn(`\n⚠  ${missing.size} phrase(s) sans traduction (restent en français) :`);
  for (const [k, w] of missing) console.warn(`   [${w}] ${k.slice(0, 90)}`);
  if (STRICT) process.exit(1);
}
