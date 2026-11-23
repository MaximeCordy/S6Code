import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";

// ============================================================
//  DANTE - STICKER — ENTRE  DEPUIS PINNED-SECTION à MI-SCROLL
// ============================================================

export function initStickerAnimation() {
  const sticker = document.querySelector(".scroll-lock__sticker");
  const pinned = document.querySelector(".pinned-section");
  if (!sticker || !pinned) return;

  // Facteur d'échelle des déplacements du sticker : 1 = desktop (valeurs d'origine
  // inchangées), réduit sur tablette/mobile où l'écran est bien moins large.
  const f = () =>
    window.innerWidth <= 767 ? 0.42 : window.innerWidth <= 1024 ? 0.7 : 1;
  // Desktop : le sticker part vers la gauche (x négatif, valeurs d'origine) et se
  // pose AU-DESSUS du texte. ≤1024px la galerie occupe la gauche et le texte la
  // droite : il se pose de la même façon, au-dessus de la colonne de texte
  // (même formule que le padding-left du texte dans _responsive.scss).
  // Le logo se pose de façon que le côté GAUCHE DU DESSIN s'aligne sur le côté
  // gauche du texte « Dante Cycle ». Le dessin n'occupe que de 27.8 % à 72.6 % de
  // la largeur de l'image (le reste est transparent) : on aligne donc le dessin,
  // pas le cadre de l'image. Valable desktop, tablette et téléphone.
  const DRAW_LEFT = 0.2776; // fraction de la largeur de l'image avant le dessin
  const FINAL_SCALE = 0.6;
  const landX = () => {
    const img = sticker.querySelector("img");
    const wrap = sticker.querySelector(".logo-wrapper");
    const phrase = document.querySelector(
      ".scroll-lock .text-stage .text-stage__phrase",
    );
    const textLeft = phrase ? phrase.getBoundingClientRect().left : window.innerWidth * 0.1;
    const boxW = sticker.offsetWidth;
    const imgLeftInBox = (wrap ? wrap.offsetLeft : 0) + img.offsetLeft;
    const baseLeft = parseFloat(getComputedStyle(sticker).left) || 0;
    // bord gauche visible de l'image pour x = 0 (échelle finale autour du centre du sticker)
    const left0 = baseLeft + boxW / 2 + FINAL_SCALE * (imgLeftInBox - boxW / 2);
    return textLeft - DRAW_LEFT * FINAL_SCALE * img.offsetWidth - left0;
  };
  // Desktop : 230px (inchangé). ≤1024px : atterrissage au MILIEU de l'écran,
  // juste au-dessus du texte du bloc vert (dont le haut est à 50svh - 40px, cf.
  // _responsive.scss) : bas du logo (y + ~105px) = haut du texte - 24px.
  const small = () => window.innerWidth <= 1024;
  // attente sous le texte épinglé (la section « 33 chants » est centrée) : le logo
  // monte avec les cartes et tourne SOUS ce texte, puis rejoint le centre quand le
  // bloc vert arrive.
  const WAIT_Y = () => window.innerHeight * 0.64;
  // Desktop : le texte vert démarre à 50vh (padding-top du .text-stage). L'ancienne
  // valeur fixe (230px) n'était juste que pour une fenêtre de ~960px de haut. On
  // calcule donc y pour que le BAS visible du logo (échelle finale 0.6, autour du
  // centre du sticker) soit 10px au-dessus du haut du texte, à toute hauteur d'écran.
  const LAND_Y = () => {
    if (small())
      return Math.max(window.innerHeight * 0.06, window.innerHeight * 0.5 - 169);
    const img = sticker.querySelector("img");
    const wrap = sticker.querySelector(".logo-wrapper");
    const half = sticker.offsetHeight / 2;
    const imgBottom = (wrap ? wrap.offsetTop : 0) + img.offsetTop + img.offsetHeight;
    const bottomOffset = half + 0.6 * (imgBottom - half);
    return window.innerHeight * 0.5 - 10 - bottomOffset;
  };
  const START_Y = () => window.innerHeight + 100;

  gsap.set(sticker, {
    position: "fixed",
    top: 0,
    x: 0,
    y: START_Y(),
    zIndex: 999999,
    transformOrigin: "50% 50%",
  });

  // ------------------------------------------------------------------
  // TABLETTE / TÉLÉPHONE : le logo se cale EN DIRECT sur le texte
  //  1. il monte avec la section « 33 chants » et reste SOUS son texte (jamais
  //     par-dessus), sans bouger tant que ce texte est épinglé ;
  //  2. quand le bloc vert arrive, il rejoint un emplacement FIXE juste au-dessus
  //     du texte vert, n'en bouge plus, puis sort par le haut à la fin du bloc.
  // Desktop : animation d'origine ci-dessous, inchangée.
  // ------------------------------------------------------------------
  if (small()) {
    const imgEl = sticker.querySelector("img");
    const titleEl = pinned.querySelector(".artiste");
    const bodyEl = pinned.querySelector(".text-layer");
    const allCards = pinned.querySelectorAll(".img-card");
    const cardEl = allCards[allCards.length - 1]; // dernière image
    const GAP = 16;
    const afterEl = document.querySelector(".after-dante");
    const lockEl = document.querySelector(".scroll-lock");

    gsap.set(sticker, { y: START_Y(), scale: 0.9, x: 0 });
    gsap.set(imgEl, { transformOrigin: "50% 50%", rotation: 0 });

    const pinEndS = Math.min(
      0.9,
      Math.max(0.4, 1 - window.innerHeight / pinned.offsetHeight),
    );
    // échelle, décalage latéral et rotation suivent le défilement (comme avant) ;
    // seule la position verticale est calée sur les textes (ticker ci-dessous).
    const tlSmall = gsap.timeline({
      scrollTrigger: {
        trigger: pinned,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });
    tlSmall
      .fromTo(
        sticker,
        { scale: 0.9, x: 0 },
        { scale: 0.8, x: () => landX() * 0.5, ease: "power2.out", duration: pinEndS },
      )
      .to(sticker, {
        scale: 0.6,
        x: landX,
        ease: "power2.in",
        duration: 1 - pinEndS,
      });
    tlSmall.fromTo(imgEl, { rotation: 0 }, { rotation: 360, ease: "none" }, 0.5);

    let waitC = null; // centre du logo en position d'attente (texte épinglé)
    const measureWait = () => {
      if (!titleEl || !bodyEl) return null;
      const a = titleEl.getBoundingClientRect();
      const b = bodyEl.getBoundingClientRect();
      const unionH = Math.max(a.bottom, b.bottom) - Math.min(a.top, b.top);
      // le contenu épinglé est centré dans l'écran
      return (window.innerHeight + unionH) / 2;
    };

    const tick = () => {
      const vh = window.innerHeight;
      const pr = pinned.getBoundingClientRect();
      const box = sticker.getBoundingClientRect();
      const h = box.height;
      const visible = pr.top < vh;
      if (!visible) {
        if (sticker.style.visibility !== "hidden") gsap.set(sticker, { visibility: "hidden" });
        return;
      }
      const textBottom = measureWait();
      const waitBottom = textBottom == null ? vh * 0.7 : textBottom;
      const waitCenter = waitBottom + GAP + h / 2;
      // Bloc vert : le logo se pose à un emplacement FIXE, juste au-dessus du haut
      // du texte (placé à 50svh - 40px par le CSS) et n'en bouge plus, même quand
      // le texte glisse ou repart vers le haut.
      const landCenter = vh * 0.5 - 40 - 8 - h / 2;
      // sortie : une fois le bloc vert fini (la section suivante monte), le logo
      // s'en va par le haut un peu plus vite que le défilement
      const adTop = afterEl ? afterEl.getBoundingClientRect().top : Infinity;
      const exit = adTop < vh ? (vh - adTop) * 1.5 : 0;
      // arrivée : le logo monte AVEC LES IMAGES, il est porté par la dernière carte
      // (même départ de scroll, même easing, même retard de scrub) jusqu'à sa
      // position d'attente ; le texte épinglé n'intervient plus.
      // Il apparaît quand la carte entre à l'écran et finit son trajet un peu plus
      // haut (D) : même défilement mais ~2x plus lent que la carte.
      let liveCenter = waitCenter;
      if (cardEl) {
        const D = vh * 0.35;
        const ct = cardEl.getBoundingClientRect().top;
        const q = Math.max(0, Math.min(1, (ct - (waitCenter - D)) / (vh - (waitCenter - D))));
        liveCenter = waitCenter + (vh + h / 2 - waitCenter) * q;
      }
      // passage de l'attente à l'emplacement final pendant que le bloc vert monte
      const slTop = lockEl ? lockEl.getBoundingClientRect().top : Infinity;
      const p = Math.max(0, Math.min(1, 1 - slTop / vh));
      const held = Math.max(waitCenter, liveCenter);
      const target = held + (landCenter - held) * p - exit;
      // derrière les images (z-index 99998) pendant l'arrivée ; au-dessus du bloc
      // vert quand celui-ci arrive
      const z = p > 0 ? 999999 : 99990;
      if (sticker.style.zIndex !== String(z)) sticker.style.zIndex = z;
      const curY = gsap.getProperty(sticker, "y");
      const curC = box.top + h / 2;
      const nextY = curY + (target - curC);
      gsap.set(sticker, { y: nextY });
      const hide = target < -h;
      const vis = hide ? "hidden" : "visible";
      if (sticker.style.visibility !== vis) gsap.set(sticker, { visibility: vis });
    };
    gsap.ticker.add(tick);
    return;
  }

  // fraction de la timeline (top top -> bottom top) correspondant à la fin de l'épinglage
  const pinEnd = Math.min(
    0.9,
    Math.max(0.4, 1 - window.innerHeight / pinned.offsetHeight),
  );
  const stickerTl = gsap.timeline({
    scrollTrigger: {
      trigger: pinned,
      // Desktop : à 30% de la section. ≤1024px : dès que la section s'épingle
      // ("top top"), c'est-à-dire EN MÊME TEMPS que les cartes (même départ de
      // scroll), comme sur desktop où il monte avec elles.
      start: () => (window.innerWidth > 1024 ? "30% top" : "top top"),
      end: "bottom top",
      scrub: 1,
      invalidateOnRefresh: true,
      onEnter: () => gsap.set(sticker, { visibility: "visible" }),
      onEnterBack: () => gsap.set(sticker, { visibility: "visible" }),
      onLeaveBack: () => gsap.set(sticker, { visibility: "hidden" }),
    },
  });

  const stickerImg = sticker.querySelector("img");
  gsap.set(stickerImg, { transformOrigin: "50% 50%", rotation: 0 });

  stickerTl
    .fromTo(
      sticker,
      { y: START_Y, scale: 1.8, x: 0 },
      {
        // desktop : 60*f (inchangé). ≤1024px : monte (avec les cartes) jusqu'à
        // sa position d'attente sous le texte épinglé.
        y: () => (small() ? WAIT_Y() : 60 * f()),
        scale: 1.1,
        x: () => (small() ? landX() * 0.5 : -160),
        ease: "power2.out",
        // ≤1024px : le logo monte jusqu'à la FIN de l'épinglage (les cartes sont
        // alors parties) puis seulement rejoint le centre : il ne traverse plus le
        // texte épinglé. Desktop : durées par défaut (0.5 / 0.5), inchangé.
        duration: small() ? pinEnd : 0.5,
      },
    )
    .to(sticker, {
      duration: small() ? 1 - pinEnd : 0.5,
      y: LAND_Y,
      scale: 0.6,
      x: landX,
      ease: "power2.in",
    });

  stickerTl.fromTo(
    stickerImg,
    { rotation: 0 },
    { rotation: 360, ease: "none" },
    0.5,
  );

  const afterSection = document.querySelector(".after-dante");
  if (afterSection) {
    gsap.fromTo(
      sticker,
      { y: LAND_Y },
      {
        y: () => -window.innerHeight,
        ease: "none",
        scrollTrigger: {
          trigger: afterSection,
          start: "top bottom",
          // Le texte du bloc vert remonte exactement à la vitesse du scroll : le logo
          // fait de même (1:1, distance de trajet = distance de scroll) et reste donc
          // à écart constant à côté du texte, sans le rattraper ni s'en éloigner.
          end: () =>
            "top+=" + Math.round(LAND_Y() + window.innerHeight) + " bottom",
          scrub: true,
          invalidateOnRefresh: true,
          // une fois sorti par le haut, le sticker ne doit plus rester visible
          onLeave: () => gsap.set(sticker, { visibility: "hidden" }),
          onEnterBack: () => gsap.set(sticker, { visibility: "visible" }),
        },
      },
    );
  }
}

// ============================================================
//  DANTE - STICKER — VISIBLE UNIQUEMENT DANS DANTE (CORRECTION BUG)
// ============================================================

export function updateStickerVisibility(namespace) {
  const sticker = document.querySelector(".scroll-lock__sticker");
  if (!sticker) return;
  sticker.style.display = namespace === "dante" ? "" : "none";
}

// ============================================================
//  DANTE - MUMMERS —   IMAGES DRAGGABLES
// ============================================================

const isCoarse = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

export function initMummersDraggable() {
  const pics = document.querySelectorAll(".Section-mummers .pic");
  if (!pics.length) return;
  // Téléphone : les images sont rangées en grille (CSS), plus de drag libre.
  if (window.matchMedia("(max-width: 767px)").matches) return;
  let zCounter = 10;

  pics.forEach((pic) => {
    let prevX = 0,
      prevY = 0,
      velX = 0,
      velY = 0;

    Draggable.create(pic, {
      // Au doigt, un drag libre x+y avalerait le scroll vertical de la page
      // (les images couvrent presque toute la section) : on garde donc le
      // glissement horizontal seulement, le vertical reste du scroll natif.
      type: isCoarse ? "x" : "x,y",
      allowNativeTouchScrolling: true,
      bounds: ".Section-mummers",
      onPress: function () {
        zCounter++;
        gsap.set(this.target, { zIndex: zCounter });
        gsap.killTweensOf(this.target);
        prevX = this.x;
        prevY = this.y;
        velX = 0;
        velY = 0;
      },
      onDrag: function () {
        velX = this.x - prevX;
        velY = this.y - prevY;
        prevX = this.x;
        prevY = this.y;
      },
      onDragEnd: function () {
        const targetX = Math.max(
          this.minX,
          Math.min(this.maxX, this.x + velX * 6),
        );
        const targetY = Math.max(
          this.minY,
          Math.min(this.maxY, this.y + velY * 6),
        );
        gsap.to(this.target, {
          x: targetX,
          y: targetY,
          ease: "power3.out",
          duration: 0.7,
        });
      },
    });
  });
}

// ============================================================
//  DANTE - MUMMERS — APPARITION DES 3 IMAGES DEPUIS LE BAS
// ============================================================

export function initMummersImages() {
  const imgs = document.querySelectorAll(".container-img-mummers img");
  const section = document.querySelector(".images-Mummers");
  if (!imgs.length || !section) return;

  gsap.set(imgs, { opacity: 0, y: 80 });

  // Un trigger par image : sur desktop elles sont alignées donc déclenchent
  // ensemble (délais 0 / 0.2 / 0.4 comme avant) ; en colonne (mobile) chacune
  // apparaît quand elle entre réellement à l'écran.
  imgs.forEach((img, i) => {
    ScrollTrigger.create({
      trigger: img,
      start: "top bottom",
      once: true,
      onEnter: () => {
        const stacked = window.innerWidth <= 767;
        gsap.to(img, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: stacked ? 0 : i * 0.2,
        });
      },
    });
  });
}
