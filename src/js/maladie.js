import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
export function initMaladieSlider() {
  const track = document.querySelector(".maladie-slider-track");
  if (!track) return;

  const items = track.querySelectorAll(".maladie-slide-item");
  if (!items.length) return;

  // ============================================================
  // MALADIE - CALCUL MOITIE TRACK (images dupliquées)
  // ============================================================

  const itemWidth = items[0].offsetWidth + 15;
  const totalWidth = itemWidth * (items.length / 2);

  gsap.to(track, {
    x: -totalWidth,
    duration: 20,
    ease: "none",
    repeat: -1,
  });

  // ============================================================
  // MALADIE - IMG - ANIMATION FUMEE HOVER DISPPAITION 3S
  // ============================================================

  const imgs = track.querySelectorAll("img[data-artwork]");
  imgs.forEach((img) => {
    let reappearTimer = null;

    img.addEventListener("mouseenter", () => {
      clearTimeout(reappearTimer);
      gsap.to(img, {
        opacity: 0,
        filter: "blur(22px) brightness(1.4)",
        duration: 0.7,
        ease: "power2.out",
        overwrite: "auto",
        onComplete: () => {
          reappearTimer = setTimeout(() => {
            gsap.to(img, {
              opacity: 1,
              filter: "blur(0px) brightness(1)",
              duration: 1.2,
              ease: "power3.out",
            });
          }, 2000);
        },
      });
    });
  });
}
// ============================================================
// MALADIE - TEXT - ANIMATION FUMEE HOVER DISPPAITION
// ============================================================

export function initLetterHover(el, texte) {
  if (!el) return;
  el.innerHTML = "";
  const letters = [];
  const easeVal = 0.05;

  texte.split("").forEach((char) => {
    const span = document.createElement("span");
    if (char === " ") {
      span.classList.add("space");
      span.innerHTML = "&nbsp;";
    } else {
      span.textContent = char;
      letters.push(span);

      const state = {
        opacity: 1,
        blur: 0,
        brightness: 1,
        targetOpacity: 1,
        targetBlur: 0,
        targetBrightness: 1,
      };
      span._state = state;

      span.addEventListener("mousemove", () => {
        state.targetOpacity = 0;
        state.targetBlur = 10;
        state.targetBrightness = 2;
      });
      span.addEventListener("mouseleave", () => {
        state.targetOpacity = 1;
        state.targetBlur = 0;
        state.targetBrightness = 1;
      });
    }
    el.appendChild(span);
  });

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }
  function animate() {
    letters.forEach((span) => {
      const s = span._state;
      s.opacity = lerp(s.opacity, s.targetOpacity, easeVal);
      s.blur = lerp(s.blur, s.targetBlur, easeVal);
      s.brightness = lerp(s.brightness, s.targetBrightness, easeVal);
      span.style.opacity = s.opacity;
      span.style.filter = `blur(${s.blur}px) brightness(${s.brightness})`;
    });
    requestAnimationFrame(animate);
  }
  animate();
}

export function initMaladieTitle() {
  initLetterHover(document.getElementById("titre"), "Alzheimer");

  const patriciaH1 = document.querySelector(".text-pat-maladie h1");
  if (patriciaH1) initLetterHover(patriciaH1, "Patricia");

  const textSelectors = [
    "#maladie-hero-text",
    ".hero_maladie p",
    ".maladie-text-container p",
    ".maladie-text-container h2",
    ".Before-image-Sky h1",
    ".text-pat-maladie p",
    ".After-Patricia-Maladie h1",
  ];
  textSelectors.forEach((sel) => {
    const el = document.querySelector(sel);
    if (el) initLetterHover(el, el.textContent.trim().replace(/\s+/g, " "));
  });
}
