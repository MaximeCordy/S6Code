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

// ================== ANIMATIONS ==================
function animateImageBlocks(scope = document) {
  const blocks = scope.querySelectorAll(".image-block");
  if (!blocks.length) return;

  gsap.to(blocks, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power2.out",
  });
}

function initSVGAnimation(scope = document) {
  const svg = scope.querySelector("svg");
  const path = scope.querySelector("#path");
  const hit = scope.querySelector("#hit");

  if (!svg || !path || !hit) return;

  let connected = false;
  const startY = 200;

  let p0 = { x: 0, y: startY };
  let p1 = { x: 400, y: startY };
  let p2 = { x: 800, y: startY };

  function curveString() {
    return `M${p0.x},${p0.y} Q${p1.x},${p1.y} ${p2.x},${p2.y}`;
  }

  function render() {
    path.setAttribute("d", curveString());
  }

  gsap.ticker.add(render);

  svg.addEventListener("pointermove", (e) => {
    const rect = svg.getBoundingClientRect();
    const y = (e.clientY - rect.top) * (400 / rect.height);
    const overPath = e.target === hit;

    if (!connected && overPath) {
      connected = true;
      gsap.killTweensOf(p1);
    }

    if (connected) {
      p1.y = (y * 2 - (p0.y + p2.y) / 2) * 0.15 + startY * 0.85;
    }
  });

  svg.addEventListener("pointerleave", () => {
    connected = false;
    gsap.to(p1, {
      duration: 0.9,
      y: startY,
      ease: "elastic.out(1,0.3)",
    });
  });

  render();
}

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

  animate();

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
        console.log("👋 Quitte:", data.current.namespace);

        window.removeEventListener("scroll", handleScroll);

        if (shaderCleanup) {
          shaderCleanup();
          shaderCleanup = null;
        }

        const overlayLeft = document.querySelector(".overlay-left");
        const overlayRight = document.querySelector(".overlay-right");

        await gsapPromise(data.current.container, {
          opacity: 0,
          duration: 0.3,
        });
        await gsapPromise([overlayLeft, overlayRight], {
          x: 0,
          duration: 1.2,
          ease: "power3.inOut",
        });
      },

      async enter(data) {
        console.log("👉 Entre sur:", data.next.namespace);

        currentPageNamespace = data.next.namespace;
        console.log("✅ Namespace mis à jour:", currentPageNamespace);

        window.scrollTo(0, 0);

        const overlayLeft = document.querySelector(".overlay-left");
        const overlayRight = document.querySelector(".overlay-right");
        const container = data.next.container;

        gsap.set(container, { opacity: 0 });
        gsap.set(container.querySelectorAll(".image-block"), {
          y: 50,
          opacity: 0,
        });

        await gsapPromise([overlayLeft, overlayRight], {
          x: (index) => (index === 0 ? "-100%" : "100%"),
          duration: 1.2,
          ease: "power3.inOut",
        });

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

// ================== HOOKS POUR ANIMATIONS DE TEXTE ==================
barba.hooks.beforeLeave(() => {
  if (typeof cleanupTextAnimations === "function") {
    cleanupTextAnimations();
  }
});

barba.hooks.after((data) => {
  if (typeof animateTextByWords === "function") {
    animateTextByWords("[data-animate-text]", {
      animateOnScroll: true,
      delay: 0.2,
      scope: data.next.container,
    });
  }
});
