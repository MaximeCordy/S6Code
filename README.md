# La Galerie des Souvenirs

Musée interactif sur **William Utermohlen** et la maladie d'Alzheimer — projet d'examen S6 (Eikon), par Maxime Cordy.
Site : https://galerie-souvenirs.cordy-maxime.ch/

5 pages (`index`, `dante`, `conversation`, `maladie`, `autoportrait`) + une page `404` personnalisée.
Animations : GSAP (ScrollTrigger, Draggable), Lenis (scroll lissé), Barba (transition entre pages). Responsive téléphone / tablette / desktop.

## Prérequis

Node.js 18+ et npm.

## Commandes

```bash
npm install        # dépendances
npm run dev        # serveur de développement (http://localhost:1234)
npm run build      # build de production -> dist/  (public-url "/", sans source maps)
npm run preview    # sert dist/ en local (http://localhost:4173)
```

> `npm run dev` et `npm run build` écrivent tous les deux dans `dist/` : arrêtez le serveur de dev avant un build.

## Structure

```
src/
  *.html            les 5 pages + 404.html
  js/main.js        point d'entrée unique (GSAP, Lenis, Barba, polices, navigation)
  js/*.js           modules par page (dante, conversation, maladie, autoportrait, info…)
  en/               pages anglaises GÉNÉRÉES (npm run i18n) — ne pas éditer
  i18n/en.json      dictionnaire FR -> EN
  scss/             styles ; _responsive.scss = adaptation ≤1024px (media queries uniquement)
  image/ audio/     médias
public/             copié tel quel dans dist/ au build :
                    .htaccess (Apache) · _headers (Netlify/Cloudflare) · robots.txt · sitemap.xml · og-cover.jpg
ANALYSE.md          analyse des animations, du responsive et audit global
```

## Déploiement

1. `npm run build`
2. Envoyer **tout le contenu de `dist/`** (y compris `.htaccess`, fichier caché) à la racine du domaine.
3. Hébergeur Apache : `.htaccess` active la page 404, HTTPS, les en-têtes de sécurité (CSP, HSTS…), la compression et le cache.
   Netlify / Cloudflare Pages : `_headers` + `404.html` sont pris en charge automatiquement.
4. Vérifier ensuite : une URL inexistante affiche la page 404, et https://securityheaders.com / la console du navigateur ne signalent aucune ressource bloquée.

Le site doit être servi **à la racine du domaine** (URLs absolues `/dante.html`, build avec `--public-url /`).

## Langues (FR / EN)

Le français est la langue source (`src/*.html`). Les pages anglaises sont **générées** dans `src/en/` (ignoré par git) :

```bash
npm run i18n         # génère src/en/ à partir des pages françaises + src/i18n/en.json
npm run i18n:check   # idem, mais échoue si une phrase n'est pas traduite (utilisé par `npm run build`)
```

- Dictionnaire : `src/i18n/en.json` — `{ "texte français": "English text" }`. Il sert aussi au JavaScript (panneau d'infos, `src/js/i18n.js`).
- Modifier un texte français = mettre à jour la clé correspondante dans `en.json`, puis relancer `npm run i18n` (c'est automatique avec `npm run dev` / `npm run build`).
- URLs : français `/dante.html`, anglais `/en/dante.html`. Le bouton « EN / FR » (bas droite) est un lien vers la même page dans l'autre langue et retrouve la même position de scroll.
- Les enregistrements audio (en anglais) sont communs aux deux langues.

## Mettre à jour le contenu

- Textes / œuvres affichées dans le panneau « i » : `src/js/info.js` (objet `DATA`) + traductions dans `src/i18n/en.json`.
- Titres et descriptions SEO : bloc `<head>` de chaque page (title, description, Open Graph, canonical).
- Nouvelle page : créer `src/<page>.html` (elle est détectée automatiquement, y compris sa version anglaise), l'ajouter à `public/sitemap.xml` et à `pageOrder` / `pageUrls` dans `src/js/main.js`.
