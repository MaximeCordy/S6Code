import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/draggable";

// ============================================================
//  DANTE - STICKER — ENTRE  DEPUIS PINNED-SECTION à MI-SCROLL
// ============================================================

export function initStickerAnimation() {
  const sticker = document.querySelector(".scroll-lock__sticker");
  const pinned = document.querySelector(".pinned-section");
  if (!sticker || !pinned) return;

  const LAND_Y = 230;
  const START_Y = window.innerHeight + 100;

  gsap.set(sticker, {
    position: "fixed",
    top: 0,
    x: 0,
    y: START_Y,
    zIndex: 999999,
    transformOrigin: "50% 50%",
  });

  const stickerTl = gsap.timeline({
    scrollTrigger: {
      trigger: pinned,
      start: "30% top",
      end: "bottom top",
      scrub: 1,
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
      { y: 60, scale: 1.1, x: -160, ease: "power2.out" },
    )
    .to(sticker, { y: LAND_Y, scale: 0.6, x: -320, ease: "power2.in" });

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
        y: -window.innerHeight,
        ease: "none",
        scrollTrigger: {
          trigger: afterSection,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
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

export function initMummersDraggable() {
  const pics = document.querySelectorAll(".Section-mummers .pic");
  if (!pics.length) return;
  let zCounter = 10;

  pics.forEach((pic) => {
    let prevX = 0,
      prevY = 0,
      velX = 0,
      velY = 0;

    Draggable.create(pic, {
      type: "x,y",
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

  ScrollTrigger.create({
    trigger: section,
    start: "top bottom",
    once: true,
    onEnter: () => {
      imgs.forEach((img, i) => {
        gsap.to(img, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: i * 0.2,
        });
      });
    },
  });
}
