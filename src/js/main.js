// ================== IMPORTS ==================
import barba from "@barba/core";
import { vertexShader, fragmentShader } from "./shaders.js";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { initInfoPanel } from "./info.js";

gsap.registerPlugin(ScrollTrigger);

// ================== LENIS (une seule fois) ==================
const lenis = new Lenis();

function raf(time) {
  lenis.raf(time);
  ScrollTrigger.update();
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
lenis.on("scroll", ScrollTrigger.update);

// ================== CONFIG ==================
const pageOrder = ["index", "dante", "conversation", "maladie", "index"];
const pageUrls = {
  index: "/index.html",
  dante: "/dante.html",
  conversation: "/conversation.html",
  maladie: "/maladie.html",
};

let isTransitioning = false;
let currentPageNamespace = null;

// Variables THREE.js globales
let threeScene = null;
let threeRenderer = null;
let threeMaterial = null;

// ================== UTILS ==================
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
// ================== SCROLL SECTION INDEX ==================
// scroll-pin.js
// Import : <script type="module" src="js/scroll-pin.js"></script>
// Placer APRÈS les scripts GSAP + ScrollTrigger dans le HTML

gsap.registerPlugin(ScrollTrigger);

export function initScrollPin() {
  // Kill les anciens ScrollTriggers (important avec Barba)
  ScrollTrigger.getAll().forEach((st) => st.kill());

  const pinnedSection = document.querySelector(".pinned-section");
  if (!pinnedSection) return;

  // ── Pin du wrapper ──
  ScrollTrigger.create({
    trigger: ".pinned-section",
    start: "top top",
    end: "bottom bottom",
    pin: ".pinned-wrapper",
    pinSpacing: false,
  });

  // ── Images qui montent avec parallaxe ──
  const cards = document.querySelectorAll(".img-card");

  cards.forEach((card, i) => {
    const speed = parseFloat(card.dataset.speed) || 2;
    const endRotation = parseFloat(card.dataset.rotation) || 0;
    const startY = window.innerHeight * (0.8 + i * 0.15);
    const endY = -window.innerHeight * (0.3 + i * 0.1);

    gsap.fromTo(
      card,
      {
        y: startY,
        opacity: 1,
        scale: 0.92,
        rotation: i % 2 === 0 ? -5 : 3, // rotation de départ
      },
      {
        y: endY,
        opacity: 1,
        scale: 1,
        rotation: endRotation, // rotation finale depuis le HTML
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

  // ── Fade in du texte ──
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

  // ── Barre de progression ──
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

  // Refresh après chargement des images
  ScrollTrigger.refresh();
}

// ── Auto-init (fonctionne aussi sans Barba) ──
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initScrollPin);
} else {
  initScrollPin();
}

// ================== ANIMATION SECTION PATRICIA ==================
function initPatriciaAnimation() {
  const section = document.querySelector(".patricia");
  if (!section) return;

  const pat = section.querySelector(".PAT");
  const image = section.querySelector("img");
  const h2 = section.querySelector("h2");
  const h3 = section.querySelector("h3");

  gsap.set(pat, { opacity: 0, scale: 1.4, y: -60 });
  gsap.set(image, { opacity: 0, x: 80, clipPath: "inset(0 100% 0 0)" });
  gsap.set(h2, { opacity: 0, x: -60 });
  gsap.set(h3, { opacity: 0, y: 40 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 60%",
      once: true,
    },
  });

  tl.to(pat, { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "expo.out" })
    .to(
      image,
      {
        opacity: 1,
        x: 0,
        clipPath: "inset(0 0% 0 0)",
        duration: 1,
        ease: "power3.out",
      },
      "-=0.4",
    )
    .to(h2, { opacity: 1, x: 0, duration: 1, ease: "power3.out" }, "<0.15")
    .to(h3, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, "-=0.3");
}

// ================== ANIMATIONS ligne ==================
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

  // Valeur cible vers laquelle p1 va lerper
  let target = start;

  function curveString() {
    return `M${p0.x},${p0.y} Q${p1.x},${p1.y} ${p2.x},${p2.y}`;
  }

  function render() {
    // Lerp sur l'axe vertical → même fluidité que l'horizontal
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
        // On met à jour la cible, le lerp dans render() fait le reste
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
      // Anime la cible vers start, le lerp suit naturellement
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

// Appels
document.querySelectorAll(".ligne-h").forEach((el) => initSVGLine(el, "y"));
document
  .querySelectorAll(".vertical-line-svg")
  .forEach((el) => initSVGLine(el, "x"));

// ================== THREE.JS SHADER ==================
function initShaderAnimation(scope = document) {
  const canvas = scope.querySelector(".hero-canvas");
  const hero = scope.querySelector(".hero");

  if (!canvas || !hero) {
    console.log("⚠️ Pas de canvas/hero sur cette page");
    return;
  }

  console.log("🎨 Init shader animation");

  const CONFIG = {
    color: "#ffffff",
    spread: 0.5,
    speed: 2,
  };

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

  // Remplacez votre scrollHandler par :
  const scrollHandler = ({ scroll }) => {
    const heroHeight = hero.offsetHeight;
    const windowHeight = window.innerHeight;
    const maxScroll = heroHeight - windowHeight;
    scrollProgress = Math.min((scroll / maxScroll) * CONFIG.speed, 1.1);
  };

  lenis.on("scroll", scrollHandler);

  threeScene = scene;
  threeRenderer = renderer;
  threeMaterial = material;

  return () => {
    console.log("🧹 Cleanup shader");
    cancelAnimationFrame(animationId);
    window.removeEventListener("resize", resizeHandler);
    lenis.off("scroll", scrollHandler);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
  };
}

// ================== NAVIGATION ==================
function getNextPage(currentNamespace) {
  const currentIndex = pageOrder.indexOf(currentNamespace);

  if (currentIndex !== -1 && currentIndex < pageOrder.length - 1) {
    return pageOrder[currentIndex + 1];
  }

  return null;
}

function handleScroll() {
  if (isTransitioning) return;

  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  const isAtBottom = scrollTop + windowHeight >= documentHeight - 10;

  if (isAtBottom) {
    console.log("⬇️ Bottom atteint sur:", currentPageNamespace);

    const nextPage = getNextPage(currentPageNamespace);

    if (nextPage) {
      console.log("➡️ Navigation vers:", nextPage);

      isTransitioning = true;
      window.removeEventListener("scroll", handleScroll);

      const nextUrl = pageUrls[nextPage];
      barba.go(nextUrl).catch((error) => {
        console.error("❌ Erreur:", error);
        isTransitioning = false;
        window.addEventListener("scroll", handleScroll);
      });
    }
  }
}

// ================== BARBA ==================
let shaderCleanup = null;

barba.init({
  debug: true,
  preventRunning: true,

  transitions: [
    {
      name: "slide-transition",

      async once(data) {
        console.log("🎬 Page initiale:", data.next.namespace);
        currentPageNamespace = data.next.namespace;

        const container = data.next.container;
        gsap.set(container.querySelectorAll(".image-block"), {
          y: 50,
          opacity: 0,
        });

        // Initialiser les animations de la page
        initScrollPin();
        initSliderAnimation();
        initPatriciaAnimation();
        shaderCleanup = initShaderAnimation(container);

        setTimeout(() => {
          window.addEventListener("scroll", handleScroll);
          console.log("✅ Listener attaché");
        }, 1000);
      },
      async leave(data) {
        window.removeEventListener("scroll", handleScroll);

        // Fermer le panneau info et réinitialiser son état
        const toggle = document.getElementById("info-toggle");
        if (toggle) {
          document.body.classList.remove("panel-open");
          toggle.textContent = "i";
        }

        // Nettoyer tous les ScrollTriggers avant de quitter la page
        ScrollTrigger.getAll().forEach((st) => st.kill());

        // Tuer toutes les animations GSAP en cours
        gsap.killTweensOf("*");

        if (shaderCleanup) {
          shaderCleanup();
          shaderCleanup = null;
        }

        const overlay = document.querySelector(".transition-overlay");
        const currentContainer = data.current.container;

        // Fade out du contenu actuel
        await gsapPromise(currentContainer, {
          opacity: 0,
          duration: 0.3,
        });

        // Cache complètement le container
        gsap.set(currentContainer, {
          visibility: "hidden",
          position: "absolute",
        });

        // Monte l'overlay
        await gsapPromise(overlay, {
          y: 0,
          duration: 1.2,
          ease: "power3.inOut",
        });
      },

      async enter(data) {
        console.log("👉 Entre sur:", data.next.namespace);
        currentPageNamespace = data.next.namespace;

        // Reset complet du scroll
        window.scrollTo(0, 0);
        lenis.scrollTo(0, { immediate: true });

        const overlay = document.querySelector(".transition-overlay");
        const container = data.next.container;

        // Réinitialiser le panneau info
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

        // Reset tous les éléments animables
        gsap.set(container.querySelectorAll(".image-block"), {
          y: 50,
          opacity: 0,
        });

        gsap.set(container.querySelectorAll("[data-animate-text]"), {
          opacity: 0,
          y: 20,
        });

        // Descend l'overlay
        await gsapPromise(overlay, {
          y: "100%",
          duration: 1.2,
          ease: "power3.inOut",
          delay: 0.6,
        });

        // Reset l'overlay
        gsap.set(overlay, { y: "100%" });

        // Affiche le nouveau contenu
        await gsapPromise(container, { opacity: 1, duration: 0.5 });

        // Réinitialiser les animations de texte
        gsap.to(container.querySelectorAll("[data-animate-text]"), {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
        });

        // Initialiser les animations de la page
        initScrollPin();
        initSliderAnimation();
        initPatriciaAnimation();
        shaderCleanup = initShaderAnimation(container);

        // Réinitialiser le panneau info pour la nouvelle page
        setTimeout(() => {
          initInfoPanel();
        }, 100);

        isTransitioning = false;

        setTimeout(() => {
          window.addEventListener("scroll", handleScroll);
          console.log("✅ Listener réattaché pour:", currentPageNamespace);
        }, 1000);
      },
    },
  ],
});

// Lors de la création du material
const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: {
    uProgress: { value: 0 },
    uResolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight),
    },
    uColor: { value: new THREE.Color(0x000000) }, // NOIR pour masquer l'image
    uSpread: { value: 0.3 },
  },
  transparent: true,
});

// Animation au chargement de la page
gsap.to(material.uniforms.uProgress, {
  value: 1,
  duration: 5.5,
  ease: "power2.inOut",
  delay: 0.5, // Petit délai pour voir l'image au début
});

// ================== ANNIMATION SCROLL HORIZONTAL ==================
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

  gsap.to("#item-1", {
    opacity: 1,
    x: "-8%",
    scrollTrigger: {
      trigger: ".slider-mask",
      start: "top top",
      end: "+=500%",
      scrub: 1,
    },
  });

  gsap.to("#item-2", {
    opacity: 1,

    x: "-6%",
    scrollTrigger: {
      trigger: ".slider-mask",
      start: "top top",
      end: "+=500%",
      scrub: 1,
    },
  });

  gsap.to("#item-3", {
    opacity: 1,

    x: "-5%",
    scrollTrigger: {
      trigger: ".slider-mask",
      start: "top top",
      end: "+=500%",
      scrub: 1,
    },
  });

  gsap.to("#item-4", {
    opacity: 1,

    x: "-7%",
    scrollTrigger: {
      trigger: ".slider-mask",
      start: "top top",
      end: "+=500%",
      scrub: 1,
    },
  });

  gsap.to("#item-5", {
    opacity: 1,

    x: "-6%",
    scrollTrigger: {
      trigger: ".slider-mask",
      start: "top top",
      end: "+=500%",
      scrub: 1,
    },
  });

  gsap.to("#item-6", {
    opacity: 1,

    x: "-4%",
    scrollTrigger: {
      trigger: ".slider-mask",
      start: "top top",
      end: "+=500%",
      scrub: 1,
    },
  });
}

// Initialiser le slider au chargement
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSliderAnimation);
} else {
  initSliderAnimation();
}

// ================== CURSOR ==================
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// for intro motion
let mouseMoved = false;

const pointer = {
  x: 0.5 * window.innerWidth,
  y: 0.5 * window.innerHeight,
};
const params = {
  pointsNumber: 5,
  widthFactor: 0.5,
  mouseThreshold: 0.6,
  spring: 0.4,
  friction: 0.5,
};

const trail = new Array(params.pointsNumber);
for (let i = 0; i < params.pointsNumber; i++) {
  trail[i] = {
    x: pointer.x,
    y: pointer.y,
    dx: 0,
    dy: 0,
  };
}

window.addEventListener("click", (e) => {
  updateMousePosition(e.clientX, e.clientY);
});
window.addEventListener("mousemove", (e) => {
  mouseMoved = true;
  updateMousePosition(e.clientX, e.clientY);
});
window.addEventListener("touchmove", (e) => {
  mouseMoved = true;
  updateMousePosition(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
});

function updateMousePosition(eX, eY) {
  pointer.x = eX;
  pointer.y = eY;
}

setupCanvas();
update(0);
window.addEventListener("resize", setupCanvas);

function update(t) {
  // for intro motion
  if (!mouseMoved) {
    pointer.x =
      (0.5 + 0.3 * Math.cos(0.002 * t) * Math.sin(0.005 * t)) *
      window.innerWidth;
    pointer.y =
      (0.5 + 0.2 * Math.cos(0.005 * t) + 0.1 * Math.cos(0.01 * t)) *
      window.innerHeight;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  trail.forEach((p, pIdx) => {
    const prev = pIdx === 0 ? pointer : trail[pIdx - 1];
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

  window.requestAnimationFrame(update);
}

function setupCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
