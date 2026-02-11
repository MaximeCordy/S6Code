// ================== IMPORTS ==================
import barba from "@barba/core";
import { vertexShader, fragmentShader } from "./shaders.js";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

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
      }
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
    }
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
        }
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
    color: "#000000",
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
        hero.offsetHeight
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

  const isAtBottom = scrollTop + windowHeight >= documentHeight - 50;

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

        animateImageBlocks(container);
        initSVGAnimation(container);
        shaderCleanup = initShaderAnimation(container);

        setTimeout(() => {
          window.addEventListener("scroll", handleScroll);
          console.log("✅ Listener attaché");
        }, 1000);
      },
      async leave(data) {
        window.removeEventListener("scroll", handleScroll);

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
          zIndex: -1,
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

        window.scrollTo(0, 0);

        const overlay = document.querySelector(".transition-overlay");
        const container = data.next.container;

        // Prépare le nouveau container
        gsap.set(container, {
          opacity: 0,
          visibility: "visible",
          position: "relative",
          zIndex: 1,
        });

        gsap.set(container.querySelectorAll(".image-block"), {
          y: 50,
          opacity: 0,
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

        animateImageBlocks(container);
        initSVGAnimation(container);
        shaderCleanup = initShaderAnimation(container);

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

gsap.to(".slider-container", {
  x: "-33%",
  scrollTrigger: {
    trigger: ".slider-mask",
    start: "top top ",
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
  y: "-15%",
  scrollTrigger: {
    trigger: ".slider-container",
    start: "bottom center",
    scrub: 1,
    start: "-=600",
    end: "-=150",
  },
});
gsap.to("#item-2", {
  opacity: 1,
  y: "-25%",
  scrollTrigger: {
    trigger: ".slider-container",
    start: "bottom center",
    scrub: 1,
    start: "-=500",
    end: "-=150",
  },
});

gsap.to("#item-3", {
  opacity: 1,
  y: "-20%",
  scrollTrigger: {
    trigger: ".slider-container",
    start: "bottom center",
    scrub: 1,
    start: "-=500",
    end: "-=150",
  },
});

gsap.to("#item-4", {
  opacity: 1,
  y: "-25%",
  scrollTrigger: {
    trigger: ".slider-container",
    start: "bottom center",
    scrub: 1,
    start: "-=500",
    end: "-=150",
  },
});

gsap.to("#item-5", {
  opacity: 1,
  y: "-25%",
  scrollTrigger: {
    trigger: ".slider-container",
    start: "bottom center",
    scrub: 1,
    start: "-=500",
    end: "-=150",
  },
});
