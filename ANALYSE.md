# Analyse du site « La Galerie des Souvenirs » + passage au responsive

## 1. Architecture

| Élément | Rôle |
|---|---|
| Parcel + Sass | Build. 5 entrées HTML (`index`, `dante`, `conversation`, `maladie`, `autoportrait`), un seul bundle JS/CSS partagé. |
| `main.js` | Orchestrateur : Lenis (scroll lissé), ScrollTrigger, Barba, curseur canvas, navigation entre pages, parallaxe souris. |
| Barba | Utilisé **uniquement pour l'overlay de transition** : `leave` finit par `window.location.href` → chaque page est un vrai rechargement. Pas de SPA, donc pas d'état à nettoyer entre pages. |
| Pages | Une ligne de temps : index → dante → conversation → maladie → autoportrait (+ boucle vers index). |
| `info.js` | Panneau « i » (données des œuvres par section `data-section`) + lecteur audio (draggable). |

## 2. Inventaire des animations

### Globales (toutes les pages)
| Animation | Technique | Dépendances écran |
|---|---|---|
| Texte mot par mot `[data-animate-text]` | `text-animation-addon.js` : wrap `overflow:hidden`, `gsap.to y:100%→0`, ScrollTrigger `once` à 95 % | Aucune |
| Lignes SVG élastiques `.ligne-h` / `.vertical-line-svg` | `initSVGLine` : courbe de Bézier pilotée au `pointermove` + `elastic.out` au `pointerleave` | Souris uniquement (inerte au doigt, sans danger) |
| Cadres SVG des héros | `initCadre` : path arrondi redessiné par `ResizeObserver` | Déjà adaptatif |
| Curseur « fil » canvas | rAF + ressorts/friction, une config de couleur par page | Souris → désactivé au tactile |
| Parallaxe de la bulle (`#layerBg/#layerFg`) | lerp sur `mousemove` | Souris → désactivé au tactile |
| Bulle cliquable | timeline `scale 1.25` + `elastic` | Aucune |
| Barres de progression footer/header + changement de page | cumul du `wheel` (seuil 400) → `barba.go` | **Molette uniquement** → ajout du tactile (voir §4) |
| Boutons magnétiques `i` / `♪` | `mousemove` + `gsap.to` | Souris |
| Overlay de transition | `y: 100% → 0 → -100%`, 1,2 s `power3.inOut` | Aucune |
| Ralentissement du scroll | `lenis.options.wheelMultiplier` modifié par section (0.03 conversation, 0.3 footer/auto…) | **Molette uniquement** : n'agit pas sur le scroll tactile natif |

### Index
| Animation | Détail | Point sensible |
|---|---|---|
| S2 section épinglée | `pin` (sticky) + 4 cartes en `fromTo` scrubé : `y` basé sur `innerHeight`, rotation, ease | Valeurs calculées **une seule fois** → corrigé (fonctions + `invalidateOnRefresh`) |
| S3 recouvrement | `#s3` `y:40vh→0` scrub, zoom 1→1.08 des portraits | RAS |
| S4 Patricia | Balancement CSS puis **chute** (`--fall-y` mesuré = hauteur de section − position) au `center 80%` | Il faut un « sol » libre sous le texte en mobile |
| S5 slider horizontal | `pin` + `x:-33%` du conteneur (150 % de large) + `x` parallaxe par item | Conteneur 300 % en portrait → `x:-66 %` |
| Footer | parallaxe image + ralentissement | RAS |

### Dante
| Animation | Détail | Point sensible |
|---|---|---|
| Section épinglée à 6 cartes | Même `initScrollPin` (variante `--dante`, scrub plus lent) | idem |
| Sticker | `position:fixed`, timeline scrubée (y, scale, rotation 360°) puis sortie, **x = -160/-320 px en dur** | Sortait de l'écran sur mobile → déplacements × facteur |
| Scroll-lock 500vh | `scroll-section.js` : 4 textes (classes CSS `is-active/is-exiting`) + galerie verticale lerpée | Largeurs en px |
| Mummers | 6 images `Draggable` (inertie) dans `.Section-mummers` (1500 px, `left` en px) | Débordait de 775 px ; drag libre bloquait le scroll au doigt |
| 3 portraits | Apparition `y:80→0` au scroll | Un trigger par image |

### Conversation
Slider **1200vh** (`conversation.js`) : 6 groupes d'images + 6 groupes de 3 textes, tout piloté par la progression d'un seul ScrollTrigger (`onUpdate`) : apparition mot par mot, fondu enchaîné aux seuils 0.6/0.73/0.86, sortie en `-110vw`. Images dimensionnées en px par `#imgX-Y`.

### Maladie
Marquee infini de 12 images (tween `x` en boucle, largeur d'item mesurée une fois) ; effet « fumée » : survol d'image (flou + opacité) et **lettre par lettre** (`initLetterHover`, un rAF par bloc de texte).

### Autoportrait
Galerie canvas : 21 cartes sur ~10 000 px, la progression de scroll translate la « caméra » (lerp), zoom 0.9, pilule d'années cliquable. `VW/VH` figés au chargement.

## 3. Pourquoi ce n'était pas responsive

1. Tailles en **px absolus** (titres 120 px, blocs 600–982 px, images en `left: 900px`).
2. Compositions en **marges négatives en %** de la largeur (les lignes SVG, `margin-top:-65vh`…) calées pour ~1440 px.
3. Dimensions JS **lues une seule fois** (`innerHeight`, `offsetWidth`) et jamais recalculées.
4. Interactions **souris** : molette (changement de page, ralentissements), survol (panneau, lettres, bulle), curseur canvas.
5. Un écran « Desktop uniquement » masquait tout sous 1024 px.

## 4. Ce qui a été fait

### Principe : le desktop n'est pas touché
Tout le CSS ajouté est dans `src/scss/_responsive.scss`, **entièrement dans des media queries `max-width ≤ 1024px`** (+ `hover:none`/`pointer:coarse` pour le tactile). Vérifié à 1440 px : mêmes valeurs calculées qu'avant (h1 120 px, bulle 209×92, gap 400 px, nav à 72 %, panneau 280 px, slider 150 %…). Aucune classe/id GSAP n'a été renommé.

### Breakpoints
- **≤ 1024 px** (tablette) : titres fluides, mises en page en colonne, nav verticale compacte.
- **≤ 767 px** (téléphone) : barre de navigation horizontale en bas, panneau info en *bottom-sheet*, cartes/slider/galeries recomposés.
- **≤ 500 px de haut** (paysage) : nav réduite.

### Ajouts JS (comportement desktop identique)
- `main.js` : `ScrollTrigger.config({ ignoreMobileResize })` ; valeurs de `initScrollPin` et du slider en **fonctions + `invalidateOnRefresh`** (suivent resize/rotation) ; curseur et parallaxe désactivés au tactile ; **navigation tactile** (glissement au-delà de la fin/début de page = même jauge que la molette, seuil 260 ; tap/Entrée sur « Découvrir la suite ») ; suppression d'un appel à `initIndexLogoFall()` (fonction inexistante qui levait une `ReferenceError` à chaque chargement).
- `dante.js` : déplacements du sticker × facteur d'écran ; Mummers en `x` seul au doigt (le scroll vertical reste natif) ; apparition par image.
- `maladie.js` : espaces **sécables** dans l'effet lettre-par-lettre (une phrase longue ne pouvait pas passer à la ligne), effacement au doigt, plus d'écriture de style au repos (centaines de lettres × 60 fps), marquee recalculé au resize.
- `autoportrait.js` : dimensions de scène mesurées + recalculées au resize, zoom par défaut adaptatif (≤ 1024 px).

### Accessibilité / confort
`prefers-reduced-motion` (bruit, pulsations, balancement), zones tactiles 44 px, `safe-area` (encoche), `viewport-fit=cover`, `100svh` pour les héros.

### 4 bis. Deuxième passage (retours sur iPhone SE 375×667, comparés au desktop réel)

| Constat | Cause réelle | Correction |
|---|---|---|
| Grand vide au-dessus des titres de héros | (1) Héros à `100svh` : un téléphone est 2× plus haut que large, le titre flottait au centre. (2) `svg { margin: 40px 0 }` est **fixe** alors que toutes les marges négatives des lignes sont en % de la largeur : 40 px pèsent ~6× plus à 375 px qu'à 1440 px. | Héros qui épouse son contenu (cadre SVG inclus) ; marge de `svg` rendue proportionnelle (`2.78vw` = 40/1440) |
| Panneau « i » : voile gris, aucun volet | À l'ouverture, `.slider-mask` passe en `overflow: visible` : le slider (300 %) élargissait la page à 1159 px ; le navigateur mobile **dézoomait toute la page** et le volet (fixed) sortait de l'écran | `overflow-x: clip` sur `html/body` (ne casse pas sticky/Lenis) + masque du slider toujours rogné ≤1024 px |
| Dante : tableaux ouverts par erreur en scrollant | Galerie à droite sous le pouce, images cliquables | Galerie à gauche, texte en haut à droite, vignettes `pointer-events: none` |
| Conversation : texte par-dessus les images, 22 avertissements GSAP | Hauteurs d'images sommées en `svh` (faux sur écran court) ; `gsap.set()` sur une liste vide (`.copy-img` n'existe pas) | Budget vertical explicite (images = espace restant au-dessus du bloc de texte) ; gardes `if (length)` |

### 4 ter. Troisième passage (régressions que j'avais introduites + valeurs sans unité)

| Constat | Cause réelle | Correction |
|---|---|---|
| Dante : texte absent, images/espaces cassés | Mon `overflow-x: clip` sur `html/body` (ajouté au passage précédent) **cassait `position: sticky`** : le bloc vert et la section épinglée défilaient au lieu de rester fixes | Règle supprimée. Sécurité anti-dézoom à la place : `minimum-scale=1` dans le `<meta viewport>` + masque du slider toujours rogné |
| Section rouge : photos de la mère/du père hors écran, éléments « sortis de la grille » | Le CSS d'origine a des valeurs **sans unité** (`right: 300`, `top: 200`, `left: 30`…) que Parcel convertit en px : sur desktop elles décalent volontairement des éléments `position: relative`, sur mobile elles les envoient hors de la page | Remise à `auto` de ces décalages en ≤1024 px. Liste complète des occurrences : `grep -nE ":\s*-?[0-9]+;" src/scss/_*.scss` |
| Tablette (768–1024) : slider Conversation encore en px desktop | Mise en page ajoutée seulement pour ≤767 px | Appliquée à tout ≤1024 px |

### 4 quater. Quatrième passage

- **Nav timeline** : barre horizontale en bas pour tout ≤1024 px (verticale, elle recouvrait le texte sur tablette).
- **Sticker de Dante** : atterrit à droite en ≤1024 px (galerie à gauche), reste à gauche sur desktop ; masqué une fois sorti.
- **Mummers (téléphone)** : grille 2 colonnes, images entières, plus de drag.
- **Slider de fin de l'index (téléphone)** : 7 éléments sur 2 rangées, chaque image bornée à 40svh (jamais rognée).
- **Conversation** : `object-fit: contain` (images entières) ; texte de fin remis dans les lignes.
- **Maladie** : `.page-maladie { gap: 100px }` fixe (compensé sur desktop par des marges négatives en %) → rendu proportionnel ; Patricia centrée ; effet lettres : écouteurs souris retirés au tactile (le faux `mousemove` d'un tap laissait des lettres effacées, d'où « PATRI IA »).
- **Index S2** : plus de remontée de 35vh sous la grille S1, hauteur 230vh.

### 4 quinquies. Cinquième passage

- **Ligne du cadre de héros qui disparaît** : un `<svg>` n'est pas étiré par `top`+`bottom` ; sa hauteur vient du ratio de son viewBox (celui du héros). À 92 % de large il mesurait 92 % de la hauteur, décalé de ~8 % + marges il dépassait du héros (`overflow: hidden`) → ligne du bas rognée. Cadre maintenant centré (4 % / 92 % / 4 %) sur les 5 pages.
- **Dante** : texte plus bas, sous le logo (`padding-top: 32svh`).
- **Bloc William (index S1)** : image et grille centrées sur tablette/téléphone (centres mesurés identiques : 410/410 à 820 px).

- **Grand vide sous le héros** : `.page { min-height: 100vh }` forçait la page à un écran alors que le héros n'en fait plus un → ~140 px de vide avant la ligne. Désactivé ≤1024 px. Écart cadre → portrait de William à 375 px : 231 px → ~65 px (desktop : 170 px sur 1440, soit 12 % de la largeur).

- **Héros à 80 % de la hauteur d'écran** (≤1024 px, `min-height: 28rem` pour le paysage).
- **Section épinglée (index, Dante)** : titre et texte forment un seul groupe centré (ils étaient à ~250 px l'un de l'autre) ; hauteur 190vh pour réduire le vide après les cartes.

Contrôle automatique ajouté à ma procédure de test : balayage de chaque page par pas de 70 % de l'écran, en listant les éléments visibles qui dépassent à gauche/droite. Résultat à 375 px : aucun sur index, dante, maladie.

## 5. Points d'attention restants (non traités volontairement)

1. **Bruit de fond** : `.bg` charge `http://assets.iceable.com/img/noise-transparent.png` (HTTP + domaine tiers) → bloqué en HTTPS (contenu mixte) et fragile. À télécharger dans `src/image/`.
2. **Vitesse de la section Conversation au doigt** : le `wheelMultiplier 0.03` ne s'applique pas au scroll tactile natif ; la piste a été rallongée (1800vh) pour compenser, à ajuster selon ton ressenti sur téléphone réel.
3. **Poids des images** (AVIF/PNG plein format partout) : prévoir `srcset` / versions réduites pour la 4G.
4. `scroll-section.scss` est un doublon de `_dante.scss` (chargé en plus sur Dante, après `main.css`, d'où des sélecteurs plus spécifiques dans `_responsive.scss`).
5. `footer.scss` / `layout` contiennent des valeurs invalides ignorées (`gap: 5`, `top: 20`, `right: 350`…, sans unité) : sans effet, à nettoyer.
6. **Non testé sur vrais appareils** : vérifié dans un navigateur émulé (390×844, 820×1180, 844×390, 1440×900). Les gestes tactiles (inertie Draggable, overscroll de changement de page, pinch) et Safari iOS restent à valider sur un téléphone.

---

## 6. Audit global (mise en production)

### Constats et corrections

| Domaine | Constat | Action |
|---|---|---|
| **SEO / meta** | Les 5 pages avaient le même `<title>`, la même description et `og:url` = accueil ; pas de canonical, d'image Open Graph ni de Twitter Card | `<head>` réécrit : title/description/canonical/OG/Twitter **uniques par page**, `og:image` 1200x630 (`public/og-cover.jpg`), `theme-color`, `robots`, `sitemap.xml`, `robots.txt` |
| **Page 404** | Absente | `src/404.html` (+ `page-404.scss`, `404.js`) : même univers (fond crème, grain, cadre, logo qui s'agite), lien accueil + 4 salles, `noindex`, sans GSAP/Barba. `.htaccess` : `ErrorDocument 404 /404.html` |
| **Sécurité** | Aucun en-tête de sécurité ; 2 ressources tierces (Google Fonts, CDN jsDelivr sans SRI) ; image de fond en **http://** (bloquée en HTTPS) ; liens `_blank` sans `rel` | Polices **auto-hébergées** (Poppins latin, 8 graisses), CDN Barba supprimé (déjà dans le bundle), bruit de fond local (`image/noise.png`), `rel="noopener noreferrer"`. `.htaccess` / `_headers` : CSP stricte (`default-src 'self'`), HSTS, nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy, COOP, redirection HTTPS. **Plus aucune requête vers un domaine tiers.** |
| **Dépendances** | `three` installé mais jamais utilisé ; `npm audit` : 18 alertes | `three` retiré. Alertes **uniquement dans les outils de dev** (Parcel…) : `npm audit --omit=dev` = **0 vulnérabilité** en production |
| **Portabilité** | `import "gsap/draggable"` : casse sensible, fonctionne sur macOS mais **échoue sur un serveur Linux / CI** | `gsap/Draggable` |
| **Performance JS** | 3 `<script>` séparés (info, texte, main) = GSAP embarqué plusieurs fois ; source maps publiées | Un seul point d'entrée : **1 bundle de 254 Ko (85 Ko gzip)**, pas de source maps en production |
| **Performance polices** | 18 variantes Google Fonts demandées (dont 9 jamais utilisées) | 8 fichiers latin woff2 (~8 Ko chacun), `font-display: swap` |
| **Performance images** | PNG surdimensionnés (logo 1 Mo+, bulles 1920px pour 210px affichés, fusain 2480px) | Redimensionnés (−4,8 Mo, sans changer de nom ni d'usage) ; `decoding="async"` partout ; `loading="lazy"` sur les images hors-champ du flux (pied de page, Mummers, Blue Skies) |
| **Cache** | Aucun | Fichiers hachés : 1 an `immutable` ; HTML : `no-cache` ; polices/audio (noms non hachés) : 30 jours ; compression gzip |
| **Accessibilité** | Boutons sans nom accessible, `#tl-nav` en `div` avec liens sans texte, `<script>` hors `<body>` | `aria-label` sur « i » / audio / chaque point de navigation, `<nav>`, script dans le body, `type="button"` |
| **Build** | `--public-url '.'` (chemins relatifs : une 404 servie dans un sous-dossier perdrait son CSS), starter générique | `--public-url /`, `package.json` renommé, `public/` copié dans `dist/` (`postbuild`), README réécrit |

Résultat du build final : `dist/` 24 Mo (dont 13 Mo d'audio), aucun lien/ressource cassé, 0 erreur console, polices et animations vérifiées sur le build servi en local.

### À savoir / à faire de ton côté

1. **Hébergeur** : j'ai supposé Apache (`.htaccess`) ; `_headers` couvre Netlify/Cloudflare. Après mise en ligne, vérifier la 404 (une URL inexistante) et les en-têtes (securityheaders.com).
2. **HSTS** : `max-age` 180 jours sans `includeSubDomains`, volontairement prudent. À augmenter (1 an) une fois le HTTPS confirmé partout.
3. **CSP** : `style-src 'unsafe-inline'` est nécessaire (attributs `style=""` dans le HTML). Les scripts, eux, n'ont aucune exception (pas de script inline, pas d'`eval`).
4. **Audio** (13 Mo) : chargé uniquement au clic sur le bouton ; si l'hébergeur le permet, activer les requêtes `Range` (par défaut sous Apache).
5. **Images non utilisées** dans le dépôt (ne sont pas publiées) : `ChatGPT Image 14 mars 2026….png` (880 Ko), `maison_site.png`, `MAISON_LOGO.png`, `painting.avif`, `Self-Portrait1960.avif`. `export-text-animation.html` (racine) est une démo isolée chargeant Google Fonts + cdnjs : non publiée, à supprimer ou garder hors du dépôt.
6. **Droits d'auteur** : les œuvres de William Utermohlen et les enregistrements audio sont affichés/diffusés tels quels ; vérifier l'autorisation si le site devient public durablement.
7. **Contraste** : les pages Maladie/Autoportrait utilisent volontairement des gris sur fond sombre (effet de disparition) ; certains textes sont sous le ratio WCAG AA (4,5:1). Choix artistique, à assumer ou à éclaircir légèrement.
8. **Test réel** : l'ensemble a été testé dans un navigateur émulé ; une passe sur un vrai iPhone/Android (gestes, Safari iOS) reste à faire.

### 6 bis. Derniers réglages (retours terminaux)

- **Dante, 1re section après le héros (téléphone/tablette)** : 6 cartes larges se superposaient et cachaient tout le texte → départs échelonnés (0,55 écran d'écart au lieu de 0,2), sortie complète par le haut, section de 260vh : les cartes défilent l'une après l'autre.
- **Logo-maison de Dante** : entre dès que la section atteint 55 % de l'écran (≤1024 px) au lieu de « 30 % top », trop tardif sur une section raccourcie. Desktop inchangé.
- **Image de William au-dessus de la transition Barba** : les images d'œuvres ont `z-index: 99998 !important` alors que l'overlay était à 1000 → overlay à 1000001 (au-dessus de tout, desktop compris).
- **Patricia (index)** : image réduite (44vw max 250px au lieu de 62vw max 340px) sur tablette/téléphone, « sol » d'atterrissage recalculé.
- **Transition Barba qui « se coupe et se relance »** : la page suivante démarrait avec l'overlay hors écran (`translateY(100%)`), on voyait donc la page se charger, puis l'overlay sautait à 0 et repartait. `js/arrive.js` (script synchrone dans le `<head>`, compatible CSP) pose `is-arriving` sur `<html>` avant le premier rendu quand une transition est en cours : l'overlay couvre l'écran dès le premier paint et glisse ensuite sans coupure. Le logo de l'overlay est préchargé. Filet de sécurité à 8 s si le JS ne démarre pas.
- **Dev/Build** : `npm run dev` écrit désormais dans `.dev-dist` (avant, il écrasait `dist/` et mélangeait fichiers de dev et de production). Relancer le serveur de dev pour en profiter.
- **Dante (≤1024 px), logo et texte du bloc vert** : le logo démarre avec les cartes (`start: "top top"`) et monte jusqu'à son point d'atterrissage sans monter puis redescendre ; le texte est ancré en bas d'écran (au-dessus de la barre de navigation) et le logo se pose ~400 px au-dessus du bas. Mesuré à 412×924 : logo à 50-76 px au-dessus du libellé selon la longueur du texte. Desktop inchangé.
- **Héros** : `scroll` remonté (3,6 rem du bas) pour ne plus toucher le bas du cadre (28 px d'écart mesurés).
- **Dante (≤1024 px), parcours du logo** : il monte avec les cartes jusqu'à une position d'attente SOUS le texte épinglé (80 % de la hauteur), tourne pendant que 2 à 6 cartes sont encore à l'écran (rotation raccourcie : 0,05 → 0,40 de la timeline), puis rejoint le centre de l'écran quand le bloc vert arrive. Atterrissage mesuré à 412×924 : logo 315-395 px, texte à partir de 422 px (≈ 27 px d'écart), groupe centré. Avant, le logo s'arrêtait au milieu du texte épinglé.
- **Dante (≤1024 px), correction du parcours** : vitesse et position de la rotation **remises comme à l'origine** (0,5 de la timeline, durée par défaut). Ce sont les cartes qui restent plus longtemps à l'écran : section épinglée à 380vh, départs échelonnés de 0,8 écran, sortie moins brutale. Mesuré à 412×924 : 3 cartes au début de la rotation (+1800 px), 2 à +2400, 1 à +2700. Le logo attend 64 % de la hauteur (juste sous le texte épinglé) jusqu'à la fin de l'épinglage, puis rejoint le centre.
- **Panneau « i » : carte activée dès le clic sur une œuvre (toutes pages, desktop compris)** : l'activation partait 100 ms après le clic, avant que la liste soit reconstruite (220 ms) et était donc perdue. Désormais la carte correspondante passe en état actif (celui du survol) dès que la liste est prête, et la liste défile pour la montrer. La sélection est conservée quand la souris quitte l'image, et oubliée à la fermeture du panneau ou au changement de section. Testé sur Dante (clic sur 2 œuvres Mummers : cartes 3 puis 5 actives, aucune après fermeture).
- **Dante, galerie verticale du bloc vert** : en sortant vite de la section, ses images (déplacées par `translateY` avec un retard de lerp sur le scroll) dépassaient du fond vert et remontaient en vitesse sur le fond crème. La galerie est maintenant rognée en haut/bas à la hauteur de la zone verte (`clip-path: inset(0 -50vw)`, l'horizontale reste libre pour le survol agrandi). Toutes tailles d'écran.

---

## 7. Version anglaise (FR / EN)

**Architecture** : le français reste la source ; `scripts/build-i18n.mjs` génère `src/en/*.html` à partir des pages françaises et du dictionnaire `src/i18n/en.json` (193 phrases HTML + ~60 chaînes du panneau d'infos). Choix d'URLs distinctes (`/en/…`) plutôt que d'un remplacement de texte à l'exécution : pas de flash de français, pages indexables, partage de liens dans la bonne langue, et la mise en page/les animations (mots découpés, lettres au survol…) s'initialisent sur le bon texte dès le départ.

**Ce qui est traduit** : tout le contenu des 5 pages, titres/descriptions SEO et Open Graph, `alt`, `aria-label`, étiquettes de navigation, infobulles des boutons (CSS), panneau « Œuvres de la section » (titres, techniques, sujets), étiquettes du lecteur audio (les enregistrements sont déjà en anglais, communs aux deux versions), page 404 (bilingue).

**Bouton de langue** : `#lang-toggle` (« EN » / « FR »), même gabarit que les boutons « i » et audio (rond noir, ombre, infobulle, effet magnétique), empilé au-dessus du bouton audio sur desktop, tablette et téléphone (y compris panneau ouvert). C'est un vrai lien : accessible au clavier, clic-molette possible. Au changement de langue on revient **au même endroit de la page** (position de scroll en %) avec un fondu rapide de l'overlay.

**SEO** : `hreflang` fr / en / x-default sur chaque page, canonical par langue, `og:locale` fr_CH / en_GB, sitemap avec alternates.

**Points d'attention**
1. Les enregistrements audio sont **déjà en anglais** : ils servent tels quels aux deux versions (aucune mention de langue ajoutée).
2. Titres d'œuvres déjà en anglais dans les données (Canto…, Self Portrait…) inchangés. « Maladie » devient « Illness ».
3. Coquille dans la source française : « PATRICA REDMOND » (sans I) — corrigée seulement dans la version anglaise.
4. Le titre du héros anglais (« The Gallery / of Memories ») passe sur 3 lignes comme en français, mais la bulle se place sur la 2e ligne (« The Gallery » est plus large que « La Galerie »).
5. `src/en/` est généré (ignoré par git) : `npm run dev` / `build` le régénèrent ; si tu modifies un texte français, mets à jour `en.json` (`npm run i18n:check` liste ce qui manque).
