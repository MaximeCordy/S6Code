// ============================================================
//  1. IMPORTS
// ============================================================
import barba from "@barba/core";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/draggable";
import Lenis from "lenis";
import { initInfoPanel } from "./info.js";
import {
  initMaladieSlider,
  initMaladieTitle,
  initBlueSkiesScroll,
} from "./maladie.js";
import { initAutoportrait } from "./autoportrait.js";
import { showTimelineNav } from "./timeline.js";

gsap.registerPlugin(ScrollTrigger, Draggable);

// ============================================================
//  2. CONFIG & VARIABLES GLOBALES
// ============================================================
const pageOrder = [
  "index",
  "dante",
  "conversation",
  "maladie",
  "autoportrait",
  "index",
];
const pageUrls = {
  index: "/index.html",
  dante: "/dante.html",
  conversation: "/conversation.html",
  maladie: "/maladie.html",
  autoportrait: "/autoportrait.html",
};

let isTransitioning = false;
let isGoingBack = false;
let currentPageNamespace = null;
let footerReady = false;
let footerScrollAccum = 0;
const FOOTER_SCROLL_THRESHOLD = 400;
let headerReady = false;
let headerScrollAccum = 0;
const HEADER_SCROLL_THRESHOLD = 400;
let headerProgressEl = null;
let headerProgressBarEl = null;
const layerBg = document.getElementById("layerBg");
const layerFg = document.getElementById("layerFg");

const SPEED_BG = 10,
  SPEED_FG = 22,
  LERP = 0.07;
let tBgX = 0,
  tBgY = 0,
  tFgX = 0,
  tFgY = 0;
let cBgX = 0,
  cBgY = 0,
  cFgX = 0,
  cFgY = 0;

function lerp(a, b, t) {
  return a + (b - a) * t;
}

if (layerBg && layerFg) {
  (function animate() {
    cBgX = lerp(cBgX, tBgX, LERP);
    cBgY = lerp(cBgY, tBgY, LERP);
    cFgX = lerp(cFgX, tFgX, LERP);
    cFgY = lerp(cFgY, tFgY, LERP);
    layerBg.style.transform = `translate(${cBgX}px,${cBgY}px)`;
    layerFg.style.transform = `translate(${cFgX}px,${cFgY}px)`;
    requestAnimationFrame(animate);
  })();
}

document.addEventListener("mousemove", (e) => {
  const nx = (e.clientX / window.innerWidth - 0.5) * 2;
  const ny = (e.clientY / window.innerHeight - 0.5) * 2;
  tBgX = -nx * SPEED_BG;
  tBgY = -ny * SPEED_BG;
  tFgX = -nx * SPEED_FG;
  tFgY = -ny * SPEED_FG;
});

document.addEventListener("mouseleave", () => {
  tBgX = 0;
  tBgY = 0;
  tFgX = 0;
  tFgY = 0;
});
// ============================================================
//  3. LENIS (smooth scroll)
// ============================================================
const lenis = new Lenis();
window.__lenis = lenis;

function raf(time) {
  lenis.raf(time);
  ScrollTrigger.update();
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
lenis.on("scroll", ScrollTrigger.update);

// Progress bar
const progressBar = document.getElementById("scroll-progress-bar");
lenis.on("scroll", ({ scroll, limit }) => {
  if (progressBar) progressBar.style.height = `${(scroll / limit) * 100}%`;
});

// ============================================================
//  4. UTILITAIRES
// ============================================================
function gsapPromise(target, vars) {
  return new Promise((resolve) => {
    gsap.to(target, { ...vars, onComplete: resolve });
  });
}

// ============================================================
//  5. SCROLL PIN (section pinned avec images parallaxe)
// ============================================================
export function initScrollPin() {
  ScrollTrigger.getAll()
    .filter((st) => st.vars?.id !== "text-anim")
    .forEach((st) => st.kill());

  const pinnedSection = document.querySelector(".pinned-section");
  if (!pinnedSection) return;

  // Pin du wrapper
  ScrollTrigger.create({
    trigger: ".pinned-section",
    start: "top top",
    end: "bottom bottom",
    pin: ".pinned-wrapper",
    pinSpacing: false,
  });

  // Images parallaxe
  const isDante = !!pinnedSection.querySelector(".image-track--dante");
  const cards = pinnedSection.querySelectorAll(".img-card");
  cards.forEach((card, i) => {
    const speed = parseFloat(card.dataset.speed) || 2;
    const endRotation = parseFloat(card.dataset.rotation) || 0;

    const startY = isDante
      ? window.innerHeight * (1.2 + i * 0.2)
      : window.innerHeight * (0.8 + i * 0.15);
    const endY = isDante
      ? -window.innerHeight * (0.15 + i * 0.08)
      : -window.innerHeight * (0.3 + i * 0.1);

    gsap.fromTo(
      card,
      {
        y: startY,
        opacity: 1,
        scale: isDante ? 1 : 0.92,
        rotation: i % 2 === 0 ? -5 : 3,
      },
      {
        y: endY,
        opacity: 1,
        scale: 1,
        rotation: endRotation,
        ease: isDante ? "power2.out" : "none",
        scrollTrigger: {
          trigger: ".pinned-section",
          start: "top top",
          end: "bottom bottom",
          scrub: isDante ? 1.8 * speed : 0.8 * speed,
        },
      },
    );
  });

  // Fade in du texte
  gsap.fromTo(
    ".text-layer",
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      scrollTrigger: {
        trigger: ".pinned-section",
        start: "top 80%",
        end: "top 20%",
        scrub: true,
      },
    },
  );

  // Barre de progression
  const progressBar = document.getElementById("progressBar");
  if (progressBar) {
    ScrollTrigger.create({
      trigger: ".pinned-section",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        progressBar.style.width = Math.round(self.progress * 100) + "%";
      },
    });
  }

  ScrollTrigger.refresh();
}

// ============================================================
//  6a. SCROLL TEXT REVEAL (autoportrait)
// ============================================================
function initScrollTextReveal() {}

// ============================================================
//  6b. ZOOM SCROLL IMAGES MOTHER & FATHER
// ============================================================
function initAfterSectionZoom() {
  const imgs = document.querySelectorAll(".mother img, .father img");
  if (!imgs.length) return;

  imgs.forEach((img) => {
    gsap.fromTo(
      img,
      { scale: 1 },
      {
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: img,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      },
    );
  });
}

// ============================================================
//  6. ANIMATION IMAGE PATRICIA (accrochée + chute)
// ============================================================
function initPatriciaHangingImage() {
  const section = document.querySelector(".patricia");
  const wrapper = document.getElementById("hanging-pat-wrapper");
  if (!section || !wrapper) return;

  // Reset de l'état du wrapper
  wrapper.classList.remove("falling", "fallen", "no-string");
  wrapper.classList.add("swinging");
  wrapper.style.transform = "";

  let fell = false;

  function triggerFall() {
    if (fell) return;
    fell = true;

    const sectionRect = section.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();
    const wrapperTopInSection = wrapperRect.top - sectionRect.top;
    const fallY =
      section.offsetHeight - wrapperTopInSection - wrapper.offsetHeight - 10;

    wrapper.style.setProperty("--fall-y", fallY + "px");
    wrapper.classList.remove("swinging");
    wrapper.classList.add("no-string");
    wrapper.style.transform = "rotate(0deg)";

    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        wrapper.style.transform = "";
        wrapper.classList.add("falling");
        wrapper.addEventListener(
          "animationend",
          () => {
            wrapper.classList.remove("falling");
            wrapper.classList.add("fallen");
            wrapper.style.transform = `translateY(${fallY}px) rotate(-2deg)`;
          },
          { once: true },
        );
      }),
    );
  }

  ScrollTrigger.create({
    trigger: section,
    start: "center 80%",
    once: true,
    onEnter: triggerFall,
  });
}

// ============================================================
//  7. LIGNES SVG INTERACTIVES
// ============================================================
function initSVGLine(scope, axis = "y", strength = 0.5) {
  const svg = scope.querySelector("svg");
  const path = scope.querySelector(".line-path");
  const hit = scope.querySelector(".line-hit");
  if (!svg || !path || !hit) return;

  let connected = false;
  const start = axis === "y" ? 200 : 50;
  const mid = axis === "y" ? 400 : 400;
  const end = axis === "y" ? 800 : 800;
  const viewMid = axis === "y" ? 400 : 100;

  let p0 = axis === "y" ? { x: 0, y: start } : { x: start, y: 0 };
  let p1 = axis === "y" ? { x: mid, y: start } : { x: start, y: mid };
  let p2 = axis === "y" ? { x: end, y: start } : { x: start, y: end };
  let target = start;

  function curveString() {
    return `M${p0.x},${p0.y} Q${p1.x},${p1.y} ${p2.x},${p2.y}`;
  }

  function render() {
    if (axis === "y") {
      p1.y += (target - p1.y) * strength;
    }
    const d = curveString();
    path.setAttribute("d", d);
    hit.setAttribute("d", d);
  }

  gsap.ticker.add(render);

  svg.addEventListener("pointermove", (e) => {
    const rect = svg.getBoundingClientRect();
    const overPath = e.target === hit;

    if (!connected && overPath) {
      connected = true;
      gsap.killTweensOf(p1);
    }

    if (connected) {
      if (axis === "y") {
        const y = (e.clientY - rect.top) * (400 / rect.height);
        target = (y * 2 - (p0.y + p2.y) / 2) * 0.15 + start * 0.85;
      } else {
        const x = (e.clientX - rect.left) * (viewMid / rect.width);
        p1.x = (x * 2 - (p0.x + p2.x) / 2) * 0.15 + start * 0.85;
      }
    }
  });

  svg.addEventListener("pointerleave", () => {
    connected = false;
    if (axis === "y") {
      gsap.to(
        { v: target },
        {
          v: start,
          duration: 0.9,
          ease: "elastic.out(1,0.3)",
          onUpdate: function () {
            target = this.targets()[0].v;
          },
        },
      );
    } else {
      gsap.to(p1, { duration: 0.9, x: start, ease: "elastic.out(1,0.3)" });
    }
  });

  render();
}

// ============================================================
//  8. SLIDER HORIZONTAL
// ============================================================
function initSliderAnimation() {
  const sliderMask = document.querySelector(".slider-mask");
  if (!sliderMask) return;

  gsap.to(".slider-container", {
    x: "-33%",
    scrollTrigger: {
      trigger: ".slider-mask",
      start: "top top",
      end: "500%",
      scrub: true,
      pin: true,
    },
  });

  gsap.to(".slider-item", {
    opacity: 1,
    scrollTrigger: {
      trigger: ".slider-item",
      scrub: true,
      start: "left 100%",
    },
  });

  const itemOffsets = ["-8%", "-6%", "-5%", "-7%", "-6%", "-4%", "-5%"];
  itemOffsets.forEach((x, i) => {
    gsap.to(`#item-${i + 1}`, {
      opacity: 1,
      x,
      scrollTrigger: {
        trigger: ".slider-mask",
        start: "top top",
        end: "+=500%",
        scrub: 1,
      },
    });
  });
}

// ============================================================
//  10. CURSOR (trail animé)
// ============================================================
const cursorConfigs = {
  index: {
    pointsNumber: 5,
    widthFactor: 0.5,
    spring: 0.4,
    friction: 0.5,
    strokeStyle: "rgba(0, 0, 0, 0.85)",
  },
  dante: {
    pointsNumber: 5,
    widthFactor: 0.5,
    spring: 0.4,
    friction: 0.5,
    strokeStyle: "rgb(255, 0, 0)",
  },
  conversation: {
    pointsNumber: 5,
    widthFactor: 0.5,
    spring: 0.4,
    friction: 0.3,
    strokeStyle: "rgb(255, 250, 103)",
  },
  maladie: {
    pointsNumber: 5,
    widthFactor: 0.5,
    spring: 0.4,
    friction: 0.15,
    strokeStyle: "#555555",
  },
  autoportrait: {
    pointsNumber: 5,
    widthFactor: 0.5,
    spring: 0.3,
    friction: 0.14,
    strokeStyle: "#272727",
  },
};

let cursorAnimationId = null;
let cursorMouseMoved = false;
let cursorIdleTimer = null;
const CURSOR_IDLE_DELAY = 6000;
const cursorPointer = {
  x: 0.5 * window.innerWidth,
  y: 0.5 * window.innerHeight,
};

function resetCursorIdleTimer() {
  clearTimeout(cursorIdleTimer);
  cursorIdleTimer = setTimeout(() => {
    cursorMouseMoved = false;
  }, CURSOR_IDLE_DELAY);
}

function onCursorClick(e) {
  cursorPointer.x = e.clientX;
  cursorPointer.y = e.clientY;
}

function onCursorMouseMove(e) {
  cursorMouseMoved = true;
  cursorPointer.x = e.clientX;
  cursorPointer.y = e.clientY;
  resetCursorIdleTimer();
}

function onCursorTouchMove(e) {
  cursorMouseMoved = true;
  cursorPointer.x = e.targetTouches[0].clientX;
  cursorPointer.y = e.targetTouches[0].clientY;
  resetCursorIdleTimer();
}

window.addEventListener("click", onCursorClick);
window.addEventListener("mousemove", onCursorMouseMove);
window.addEventListener("touchmove", onCursorTouchMove);

function initCursor(namespace) {
  if (cursorAnimationId) {
    cancelAnimationFrame(cursorAnimationId);
    cursorAnimationId = null;
  }

  const canvas = document.querySelector("canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const params = cursorConfigs[namespace] || cursorConfigs.index;

  const trail = new Array(params.pointsNumber);
  for (let i = 0; i < params.pointsNumber; i++) {
    trail[i] = { x: cursorPointer.x, y: cursorPointer.y, dx: 0, dy: 0 };
  }

  function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  setupCanvas();
  window.removeEventListener("resize", setupCanvas);
  window.addEventListener("resize", setupCanvas);

  function update(t) {
    // Animation auto quand la souris est inactive
    if (!cursorMouseMoved) {
      cursorPointer.x =
        (0.5 + 0.3 * Math.cos(0.0008 * t) * Math.sin(0.002 * t)) *
        window.innerWidth;
      cursorPointer.y =
        (0.5 + 0.2 * Math.cos(0.002 * t) + 0.1 * Math.cos(0.004 * t)) *
        window.innerHeight;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = params.strokeStyle;

    trail.forEach((p, pIdx) => {
      const prev = pIdx === 0 ? cursorPointer : trail[pIdx - 1];
      const spring = pIdx === 0 ? 0.4 * params.spring : params.spring;
      p.dx += (prev.x - p.x) * spring;
      p.dy += (prev.y - p.y) * spring;
      p.dx *= params.friction;
      p.dy *= params.friction;
      p.x += p.dx;
      p.y += p.dy;
    });

    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(trail[0].x, trail[0].y);

    for (let i = 1; i < trail.length - 1; i++) {
      const xc = 0.5 * (trail[i].x + trail[i + 1].x);
      const yc = 0.5 * (trail[i].y + trail[i + 1].y);
      ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
      ctx.lineWidth = params.widthFactor * (params.pointsNumber - i);
      ctx.stroke();
    }
    ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
    ctx.stroke();

    cursorAnimationId = window.requestAnimationFrame(update);
  }

  cursorAnimationId = window.requestAnimationFrame(update);
}

// ============================================================
//  11. NAVIGATION (changement de page au scroll)
// ============================================================
function getNextPage(currentNamespace) {
  const currentIndex = pageOrder.indexOf(currentNamespace);
  if (currentIndex !== -1 && currentIndex < pageOrder.length - 1) {
    return pageOrder[currentIndex + 1];
  }
  return null;
}

function getPreviousPage(currentNamespace) {
  const currentIndex = pageOrder.indexOf(currentNamespace);
  if (currentIndex > 0) {
    return pageOrder[currentIndex - 1];
  }
  return null;
}

let progressEl = null;
let progressBarEl = null;

function getOrCreateProgressBar() {
  if (!progressEl) {
    progressEl = document.createElement("div");
    progressEl.className = "footer-progress";
    progressBarEl = document.createElement("div");
    progressBarEl.className = "footer-progress__bar";
    progressEl.appendChild(progressBarEl);
    document.body.appendChild(progressEl);
  }
  return { progressEl, progressBarEl };
}

function resetFooterProgress() {
  footerScrollAccum = 0;
  footerReady = false;
  window.removeEventListener("wheel", onFooterWheel);
  const { progressEl, progressBarEl } = getOrCreateProgressBar();
  progressEl.classList.remove("visible");
  progressBarEl.style.width = "0%";
}

function getOrCreateHeaderProgressBar() {
  if (!headerProgressEl) {
    headerProgressEl = document.createElement("div");
    headerProgressEl.className = "header-progress";
    headerProgressBarEl = document.createElement("div");
    headerProgressBarEl.className = "header-progress__bar";
    headerProgressEl.appendChild(headerProgressBarEl);
    document.body.appendChild(headerProgressEl);
  }
  return { progressEl: headerProgressEl, progressBarEl: headerProgressBarEl };
}

function resetHeaderProgress() {
  headerScrollAccum = 0;
  headerReady = false;
  window.removeEventListener("wheel", onHeaderWheel);
  const { progressEl, progressBarEl } = getOrCreateHeaderProgressBar();
  progressEl.classList.remove("visible");
  progressBarEl.style.width = "0%";
}

function triggerPrevPage() {
  const prevPage = getPreviousPage(currentPageNamespace);
  if (!prevPage) return;
  isTransitioning = true;
  isGoingBack = true;
  resetHeaderProgress();
  window.removeEventListener("scroll", handleScroll);
  barba.go(pageUrls[prevPage]).catch(() => {
    isTransitioning = false;
    isGoingBack = false;
    window.addEventListener("scroll", handleScroll);
  });
}

function onHeaderWheel(e) {
  if (!headerReady || isTransitioning) return;
  const { progressBarEl } = getOrCreateHeaderProgressBar();

  if (e.deltaY < 0) {
    headerScrollAccum = Math.min(
      headerScrollAccum + Math.abs(e.deltaY),
      HEADER_SCROLL_THRESHOLD,
    );
  } else {
    headerScrollAccum = Math.max(headerScrollAccum - e.deltaY, 0);
  }

  const pct = (headerScrollAccum / HEADER_SCROLL_THRESHOLD) * 100;
  progressBarEl.style.width = pct + "%";

  if (headerScrollAccum >= HEADER_SCROLL_THRESHOLD) {
    triggerPrevPage();
  }
}

function triggerNextPage() {
  const nextPage = getNextPage(currentPageNamespace);
  if (!nextPage) return;
  isTransitioning = true;
  resetFooterProgress();
  window.removeEventListener("scroll", handleScroll);
  barba.go(pageUrls[nextPage]).catch(() => {
    isTransitioning = false;
    window.addEventListener("scroll", handleScroll);
  });
}

function onFooterWheel(e) {
  if (!footerReady || isTransitioning) return;
  const { progressBarEl } = getOrCreateProgressBar();

  if (e.deltaY > 0) {
    footerScrollAccum = Math.min(
      footerScrollAccum + e.deltaY,
      FOOTER_SCROLL_THRESHOLD,
    );
  } else {
    footerScrollAccum = Math.max(footerScrollAccum + e.deltaY, 0);
  }

  const pct = (footerScrollAccum / FOOTER_SCROLL_THRESHOLD) * 100;
  progressBarEl.style.width = pct + "%";

  if (footerScrollAccum >= FOOTER_SCROLL_THRESHOLD) {
    triggerNextPage();
  }
}

function handleScroll() {
  if (isTransitioning) return;

  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  // Navigation vers la page suivante (scroll en bas)
  if (scrollTop + windowHeight >= documentHeight - 10) {
    const nextPage = getNextPage(currentPageNamespace);
    if (nextPage && !footerReady) {
      footerReady = true;
      footerScrollAccum = 0;
      const { progressEl } = getOrCreateProgressBar();
      progressEl.classList.add("visible");
      window.addEventListener("wheel", onFooterWheel, { passive: true });
    }
  } else {
    if (footerReady) {
      resetFooterProgress();
    }
  }
  if (scrollTop <= 0) {
    const prevPage = getPreviousPage(currentPageNamespace);
    if (prevPage && !headerReady) {
      headerReady = true;
      headerScrollAccum = 0;
      const { progressEl } = getOrCreateHeaderProgressBar();
      progressEl.classList.add("visible");
      window.addEventListener("wheel", onHeaderWheel, { passive: true });
    }
  } else {
    if (headerReady) {
      resetHeaderProgress();
    }
  }
}

// ============================================================
//  12. BARBA (transitions entre pages)
// ============================================================
barba.init({
  debug: true,
  preventRunning: true,

  transitions: [
    {
      name: "slide-transition",

      // --- Premier chargement ---
      async once(data) {
        currentPageNamespace = data.next.namespace;
        const container = data.next.container;

        gsap.set(container.querySelectorAll(".image-block"), {
          y: 50,
          opacity: 0,
        });

        initScrollPin();
        initStickerAnimation();

        initPatriciaHangingImage();
        initAfterSectionZoom();
        initSliderAnimation();

        initCursor(data.next.namespace);
        initFooterSlowScroll();
        initMummersImages();
        updateStickerVisibility(data.next.namespace);
        setScrollSpeed(data.next.namespace);
        initS3Overlay();
        initMaladieSlider();
        initMaladieTitle();
        initBlueSkiesScroll();

        initAutoportrait();
        initScrollTextReveal();

        setTimeout(() => {
          window.addEventListener("scroll", handleScroll);
        }, 1000);

        // Si on arrive depuis une transition, faire partir l'overlay
        const transitionDir = sessionStorage.getItem("barba-transition");
        if (transitionDir) {
          sessionStorage.removeItem("barba-transition");
          const overlay = document.querySelector(".transition-overlay");
          gsap.set(overlay, { y: 0 });
          await gsapPromise(overlay, {
            y: transitionDir === "back" ? "100%" : "-100%",
            duration: 1.2,
            ease: "power3.inOut",
            delay: 0.4,
          });
          gsap.set(overlay, { y: "100%" });
        }

        showTimelineNav();
        initInfoPanel();

        const infoToggle = document.getElementById("info-toggle");
        if (infoToggle) infoToggle.classList.remove("hidden");
      },

      // --- Quitter la page ---

      async leave(data) {
        window.removeEventListener("scroll", handleScroll);

        const tlNav = document.getElementById("tl-nav");
        if (tlNav) tlNav.classList.add("hidden");

        const infoToggle = document.getElementById("info-toggle");
        if (infoToggle) infoToggle.classList.add("hidden");
        const audioToggle = document.getElementById("audio-toggle");
        if (audioToggle) audioToggle.classList.add("hidden");

        updateStickerVisibility(null);

        // Fermer le panneau info
        const toggle = document.getElementById("info-toggle");
        if (toggle) {
          document.body.classList.remove("panel-open");
          toggle.textContent = "i";
        }

        // Nettoyer les animations
        ScrollTrigger.getAll().forEach((st) => st.kill());
        gsap.killTweensOf("*");

        const overlay = document.querySelector(".transition-overlay");
        const currentContainer = data.current.container;

        // Fade out du contenu
        await gsapPromise(currentContainer, { opacity: 0, duration: 0.3 });

        gsap.set(currentContainer, {
          visibility: "hidden",
          position: "absolute",
        });

        // L'overlay arrive : du bas (avant) ou du haut (arrière)
        if (isGoingBack) {
          gsap.set(overlay, { y: "-100%" });
        }

        await gsapPromise(overlay, {
          y: 0,
          duration: 1.2,
          ease: "power3.inOut",
        });

        // Rechargement complet de la page suivante
        sessionStorage.setItem(
          "barba-transition",
          isGoingBack ? "back" : "forward",
        );
        window.location.href = data.next.url.href;
        await new Promise(() => {}); // suspend Barba indéfiniment
      },

      // --- Entrer sur la nouvelle page ---
      async enter(data) {
        currentPageNamespace = data.next.namespace;

        // Reset du scroll
        window.scrollTo(0, 0);
        lenis.scrollTo(0, { immediate: true });

        const overlay = document.querySelector(".transition-overlay");
        const container = data.next.container;

        // Reset panneau info
        const toggle = document.getElementById("info-toggle");
        if (toggle) {
          document.body.classList.remove("panel-open");
          toggle.textContent = "i";
        }

        // Prépare le nouveau container
        gsap.set(container, {
          opacity: 0,
          visibility: "visible",
          position: "relative",
        });

        gsap.set(container.querySelectorAll(".image-block"), {
          y: 50,
          opacity: 0,
        });

        gsap.set(container.querySelectorAll("[data-animate-text]"), {
          opacity: 0,
          y: 20,
        });

        // L'overlay repart : vers le haut (avant) ou vers le bas (arrière)
        await gsapPromise(overlay, {
          y: isGoingBack ? "100%" : "-100%",
          duration: 1.2,
          ease: "power3.inOut",
          delay: 0.6,
        });

        gsap.set(overlay, { y: "100%" });
        isGoingBack = false;

        // Affiche le nouveau contenu
        await gsapPromise(container, { opacity: 1, duration: 0.5 });

        gsap.to(container.querySelectorAll("[data-animate-text]"), {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
        });

        // Init animations de la nouvelle page
        initScrollPin();
        initStickerAnimation();

        initPatriciaHangingImage();
        initAfterSectionZoom();
        initSliderAnimation();

        initCursor(data.next.namespace);

        setTimeout(() => initInfoPanel(), 100);
        initLogoWiggle();
        initFooterSlowScroll();
        initMummersImages();
        updateStickerVisibility(data.next.namespace);
        setScrollSpeed(data.next.namespace);
        initS3Overlay();
        initMaladieSlider();
        initMaladieTitle();
        initBlueSkiesScroll();

        initAutoportrait();
        initScrollTextReveal();

        isTransitioning = false;

        setTimeout(() => {
          window.addEventListener("scroll", handleScroll);
        }, 1000);
      },
    },
  ],
});

// ============================================================
//  13. BOUTONS MAGNÉTIQUES
// ============================================================
function initMagneticButtons() {
  const buttons = document.querySelectorAll("#info-toggle, #audio-toggle");
  const radius = 80;
  const maxIconMove = 7;

  buttons.forEach((btn) => {
    if (!btn.querySelector("span")) {
      btn.innerHTML = `<span style="display:inline-flex;pointer-events:none">${btn.innerHTML}</span>`;
    }
    const icon = btn.querySelector("span");

    document.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius) {
        const factor = 1 - dist / radius;
        const tx = Math.max(
          -maxIconMove,
          Math.min(maxIconMove, dx * 0.35 * factor),
        );
        const ty = Math.max(
          -maxIconMove,
          Math.min(maxIconMove, dy * 0.35 * factor),
        );
        gsap.to(icon, { x: tx, y: ty, duration: 0.3, ease: "power2.out" });
        gsap.to(btn, { scale: 1.08, duration: 0.3, ease: "power2.out" });
      } else {
        gsap.to(icon, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.4)",
        });
        gsap.to(btn, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.4)" });
      }
    });
  });
}

initMagneticButtons();

// ============================================================
//  14. INIT AU CHARGEMENT
// ============================================================
document.querySelectorAll(".ligne-h").forEach((el) => initSVGLine(el, "y"));
document
  .querySelectorAll(".vertical-line-svg")
  .forEach((el) => initSVGLine(el, "x"));

function initMummersDraggable() {
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

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initScrollPin();
    initStickerAnimation();
    initPatriciaHangingImage();
    initAfterSectionZoom();
    initSliderAnimation();
    initMummersDraggable();
    initLogoWiggle();
    initFooterSlowScroll();
    initMummersImages();
    initScrollTextReveal();
  });
} else {
  initScrollPin();
  initStickerAnimation();
  initPatriciaHangingImage();
  initAfterSectionZoom();
  initSliderAnimation();
  initMummersDraggable();
  initLogoWiggle();
  initFooterSlowScroll();
  initMummersImages();
  initIndexLogoFall();
  initScrollTextReveal();
}

// ============================================================
//  15. STICKER DANTE — entre depuis pinned-section à mi-scroll
// ============================================================

function initStickerAnimation() {
  const sticker = document.querySelector(".scroll-lock__sticker");
  const pinned = document.querySelector(".pinned-section");
  if (!sticker || !pinned) return;

  const LAND_Y = 230; // px from top of viewport where sticker lands
  const START_Y = window.innerHeight + 100; // just below the viewport

  // Start: fixed, off-screen bottom
  gsap.set(sticker, {
    position: "fixed",
    top: 0,
    x: 0,
    y: START_Y,
    zIndex: 999999,
    transformOrigin: "50% 50%",
  });

  // Rise from bottom, overshoot up, then settle — scrubbed during pinned-section
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
  // Trajectory on wrapper, rotation on img — both scrubbed in the same timeline
  const stickerImg = sticker.querySelector("img");
  gsap.set(stickerImg, { transformOrigin: "50% 50%", rotation: 0 });

  stickerTl
    .fromTo(
      sticker,
      { y: START_Y, scale: 1.8, x: 0 },
      { y: 60, scale: 1.1, x: -160, ease: "power2.out" },
    )
    .to(sticker, { y: LAND_Y, scale: 0.6, x: -320, ease: "power2.in" });

  // Rotation scrubbed on img during descent phase (second half of timeline)
  stickerTl.fromTo(
    stickerImg,
    { rotation: 0 },
    { rotation: 360, ease: "none" },
    0.5,
  );

  // Exit: sticker scrolls up with the slider as after-dante enters
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
//  16. STICKER CLICK — wiggle CSS au clic
// ============================================================

function initLogoWiggle() {
  const logo = document.getElementById("logo");
  if (!logo) return;

  logo.addEventListener("click", () => {
    if (logo.classList.contains("shaking")) return;
    logo.classList.add("shaking");
    logo.addEventListener(
      "animationend",
      () => logo.classList.remove("shaking"),
      { once: true },
    );
  });
}

// ============================================================
//  17. SECTION 8 — images apparaissent une par une depuis le bas
// ============================================================

function initMummersImages() {
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

// ============================================================
//  20. STICKER — visible uniquement sur la page dante
// ============================================================

function updateStickerVisibility(namespace) {
  const sticker = document.querySelector(".scroll-lock__sticker");
  if (!sticker) return;
  sticker.style.display = namespace === "dante" ? "" : "none";
}

function setScrollSpeed(namespace) {
  const speeds = {
    maladie: 0.45,
    autoportrait: 0.3,
  };
  lenis.options.wheelMultiplier = speeds[namespace] ?? 1;
}

// ============================================================
//  18. FOOTER — ralentit le scroll quand le footer est visible
// ============================================================

function initFooterSlowScroll() {
  const footer = document.querySelector(".footer");
  if (!footer) return;

  ScrollTrigger.create({
    trigger: footer,
    start: "top bottom",
    end: "bottom bottom",
    onEnter: () => {
      lenis.options.wheelMultiplier = 0.3;
    },
    onLeaveBack: () => {
      lenis.options.wheelMultiplier = 1;
    },
  });

  const footerImg = footer.querySelector(".footerimg img");
  if (!footerImg) return;

  gsap.fromTo(
    footerImg,
    { y: 60 },
    {
      y: 0,
      ease: "none",
      scrollTrigger: {
        trigger: footer,
        start: "top bottom",
        end: "top 30%",
        scrub: 1.5,
      },
    },
  );
}

/* ── Section 3 : slide par-dessus section 2 ── */

function initS3Overlay() {
  const s3 = document.querySelector("#s3");
  if (!s3) return;
  gsap.fromTo(
    s3,
    { y: "40vh" },
    {
      y: 0,
      ease: "none",
      scrollTrigger: {
        trigger: s3,
        start: "top bottom",
        end: "top top",
        scrub: true,
      },
    },
  );
}
