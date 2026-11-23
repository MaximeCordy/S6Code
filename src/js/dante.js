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
  const landX = () => {
    const vw = window.innerWidth;
    if (vw > 1024) return -320;
    // Mesuré sur desktop : le logo se pose centré sur le bord GAUCHE du texte
    // (centre du logo ≈ bord du texte + 7px). Ici le bord gauche du logo
    // s'aligne sur celui du texte (centre = bord + demi-logo à l'échelle 0.6) :
    // il ne mord pas sur la galerie, qui est juste à gauche.
    const textLeft = vw * 0.34 + 16;
    const half = ((sticker.querySelector("img")?.offsetWidth || 140) * 0.6) / 2;
    return textLeft + half - 10 - vw / 2; // -10 : le dessin n'occupe pas tout le cadre de l'image
  };
  // Desktop : 230px (inchangé). ≤1024px : atterrissage au MILIEU de l'écran,
  // juste au-dessus du texte du bloc vert (dont le haut est à 50svh - 40px, cf.
  // _responsive.scss) : bas du logo (y + ~105px) = haut du texte - 24px.
  const small = () => window.innerWidth <= 1024;
  // attente sous le texte épinglé (la section « 33 chants » est centrée) : le logo
  // monte avec les cartes et tourne SOUS ce texte, puis rejoint le centre quand le
  // bloc vert arrive.
  const WAIT_Y = () => window.innerHeight * 0.64;
  const LAND_Y = () =>
    !small()
      ? 230
      : Math.max(window.innerHeight * 0.06, window.innerHeight * 0.5 - 169);
  const START_Y = () => window.innerHeight + 100;

  gsap.set(sticker, {
    position: "fixed",
    top: 0,
    x: 0,
    y: START_Y(),
    zIndex: 999999,
    transformOrigin: "50% 50%",
  });

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
          end: "bottom top",
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
