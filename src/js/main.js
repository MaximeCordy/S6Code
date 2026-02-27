// ============================================================
//  1. IMPORTS
// ============================================================
import barba from "@barba/core";
import { vertexShader, fragmentShader } from "./shaders.js";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { initInfoPanel } from "./info.js";

gsap.registerPlugin(ScrollTrigger);

// ============================================================
//  2. CONFIG & VARIABLES GLOBALES
// ============================================================
const pageOrder = ["index", "dante", "conversation", "maladie", "index"];
const pageUrls = {
  index: "/index.html",
  dante: "/dante.html",
  conversation: "/conversation.html",
  maladie: "/maladie.html",
};

let isTransitioning = false;
let isGoingBack = false;
let currentPageNamespace = null;
let shaderCleanup = null;

// ============================================================
//  3. LENIS (smooth scroll)
// ============================================================
const lenis = new Lenis();

function raf(time) {
  lenis.raf(time);
  ScrollTrigger.update();
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
lenis.on("scroll", ScrollTrigger.update);

// ============================================================
//  4. UTILITAIRES
// ============================================================
function gsapPromise(target, vars) {
  return new Promise((resolve) => {
    gsap.to(target, { ...vars, onComplete: resolve });
  });
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : { r: 0.89, g: 0.89, b: 0.89 };
}

// ============================================================
//  5. SCROLL PIN (section pinned avec images parallaxe)
// ============================================================
export function initScrollPin() {
  ScrollTrigger.getAll().forEach((st) => st.kill());

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
  const cards = document.querySelectorAll(".img-card");
  cards.forEach((card, i) => {
    const speed = parseFloat(card.dataset.speed) || 2;
    const endRotation = parseFloat(card.dataset.rotation) || 0;
    const startY = window.innerHeight * (0.8 + i * 0.15);
    const endY = -window.innerHeight * (0.3 + i * 0.1);

    gsap.fromTo(
      card,
      { y: startY, opacity: 1, scale: 0.92, rotation: i % 2 === 0 ? -5 : 3 },
      {
        y: endY,
        opacity: 1,
        scale: 1,
        rotation: endRotation,
        ease: "none",
        scrollTrigger: {
          trigger: ".pinned-section",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8 * speed,
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
      markers: true,
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

  const itemOffsets = ["-8%", "-6%", "-5%", "-7%", "-6%", "-4%"];
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
//  9. THREE.JS SHADER
// ============================================================
function initShaderAnimation(scope = document) {
  const canvas = scope.querySelector(".hero-canvas");
  const hero = scope.querySelector(".hero");

  if (!canvas || !hero) return;

  const CONFIG = { color: "#ffffff", spread: 0.5, speed: 2 };

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
  });

  function resize() {
    const width = hero.offsetWidth;
    const height = hero.offsetHeight;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  resize();

  const resizeHandler = () => {
    resize();
    if (material) {
      material.uniforms.uResolution.value.set(
        hero.offsetWidth,
        hero.offsetHeight,
      );
    }
  };
  window.addEventListener("resize", resizeHandler);

  const rgb = hexToRgb(CONFIG.color);
  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uProgress: { value: 0 },
      uResolution: {
        value: new THREE.Vector2(hero.offsetWidth, hero.offsetHeight),
      },
      uColor: { value: new THREE.Vector3(rgb.r, rgb.g, rgb.b) },
      uSpread: { value: CONFIG.spread },
    },
    transparent: true,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  let scrollProgress = 0;
  let animationId;

  function animate() {
    material.uniforms.uProgress.value = scrollProgress;
    renderer.render(scene, camera);
    animationId = requestAnimationFrame(animate);
  }

  const scrollHandler = ({ scroll }) => {
    const heroHeight = hero.offsetHeight;
    const windowHeight = window.innerHeight;
    const maxScroll = heroHeight - windowHeight;
    scrollProgress = Math.min((scroll / maxScroll) * CONFIG.speed, 1.1);
  };

  lenis.on("scroll", scrollHandler);

  return () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener("resize", resizeHandler);
    lenis.off("scroll", scrollHandler);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
  };
}

// Shader material pour l'animation au chargement
const loadMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: {
    uProgress: { value: 0 },
    uResolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight),
    },
    uColor: { value: new THREE.Color(0x000000) },
    uSpread: { value: 0.3 },
  },
  transparent: true,
});

gsap.to(loadMaterial.uniforms.uProgress, {
  value: 1,
  duration: 5.5,
  ease: "power2.inOut",
  delay: 0.5,
});

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
    strokeStyle: "rgb(255, 255, 255)",
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

function handleScroll() {
  if (isTransitioning) return;

  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  // Navigation vers la page suivante (scroll en bas)
  if (scrollTop + windowHeight >= documentHeight - 10) {
    const nextPage = getNextPage(currentPageNamespace);
    if (nextPage) {
      isTransitioning = true;
      window.removeEventListener("scroll", handleScroll);
      barba.go(pageUrls[nextPage]).catch(() => {
        isTransitioning = false;
        window.addEventListener("scroll", handleScroll);
      });
    }
  }

  // Navigation vers la page précédente (scroll en haut)
  if (scrollTop <= 0) {
    const prevPage = getPreviousPage(currentPageNamespace);
    if (prevPage) {
      isTransitioning = true;
      isGoingBack = true;
      window.removeEventListener("scroll", handleScroll);
      barba.go(pageUrls[prevPage]).catch(() => {
        isTransitioning = false;
        isGoingBack = false;
        window.addEventListener("scroll", handleScroll);
      });
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
        initPatriciaHangingImage();
        initSliderAnimation();
        shaderCleanup = initShaderAnimation(container);
        initCursor(data.next.namespace);

        setTimeout(() => {
          window.addEventListener("scroll", handleScroll);
        }, 1000);
      },

      // --- Quitter la page ---
      async leave(data) {
        window.removeEventListener("scroll", handleScroll);

        // Fermer le panneau info
        const toggle = document.getElementById("info-toggle");
        if (toggle) {
          document.body.classList.remove("panel-open");
          toggle.textContent = "i";
        }

        // Nettoyer les animations
        ScrollTrigger.getAll().forEach((st) => st.kill());
        gsap.killTweensOf("*");

        if (shaderCleanup) {
          shaderCleanup();
          shaderCleanup = null;
        }

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
        initPatriciaHangingImage();
        initSliderAnimation();
        shaderCleanup = initShaderAnimation(container);
        initCursor(data.next.namespace);

        setTimeout(() => initInfoPanel(), 100);

        isTransitioning = false;

        setTimeout(() => {
          window.addEventListener("scroll", handleScroll);
        }, 1000);
      },
    },
  ],
});

// ============================================================
//  13. INIT AU CHARGEMENT
// ============================================================
document.querySelectorAll(".ligne-h").forEach((el) => initSVGLine(el, "y"));
document
  .querySelectorAll(".vertical-line-svg")
  .forEach((el) => initSVGLine(el, "x"));

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initScrollPin();
    initPatriciaHangingImage();
    initSliderAnimation();
  });
} else {
  initScrollPin();
  initPatriciaHangingImage();
  initSliderAnimation();
}
