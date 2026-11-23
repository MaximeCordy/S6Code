// Langue de la page (posée par le générateur : <html lang="en"> sur /en/*.html).
// Le dictionnaire est le même que celui qui sert à générer les pages anglaises.
import en from "../i18n/en.json";

export const lang = document.documentElement.lang === "en" ? "en" : "fr";
export const isEN = lang === "en";

const norm = (s) => String(s).replace(/\s+/g, " ").trim();

// traduit une chaîne (français -> langue courante) ; inchangée si absente du dictionnaire
export function t(s) {
  if (!isEN || s == null) return s;
  const k = norm(s);
  return Object.prototype.hasOwnProperty.call(en, k) ? en[k] : s;
}

// préfixe d'URL des pages : "" en français, "/en" en anglais
export const base = isEN ? "/en" : "";
