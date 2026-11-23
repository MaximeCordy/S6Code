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

  // La largeur d'un item change avec le breakpoint (200px desktop, plus petit
  // sur mobile) : on (re)construit donc le tween au resize en conservant la
  // progression, pour que la boucle reste parfaitement continue.
  let marqueeTween = null;
  function buildMarquee() {
    const progress = marqueeTween ? marqueeTween.progress() : 0;
    if (marqueeTween) marqueeTween.kill();
    gsap.set(track, { x: 0 });
    const itemWidth = items[0].offsetWidth + 15;
    const totalWidth = itemWidth * (items.length / 2);
    marqueeTween = gsap.to(track, {
      x: -totalWidth,
      duration: 20,
      ease: "none",
      repeat: -1,
    });
    marqueeTween.progress(progress);
  }
  buildMarquee();
  let marqueeResizeTimer;
  let marqueeLastW = window.innerWidth;
  window.addEventListener("resize", () => {
    // seul un changement de LARGEUR compte (la barre d'URL mobile ne change que la hauteur)
    if (window.innerWidth === marqueeLastW) return;
    marqueeLastW = window.innerWidth;
    clearTimeout(marqueeResizeTimer);
    marqueeResizeTimer = setTimeout(buildMarquee, 200);
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
      // espace normale (et non &nbsp;) en pre-wrap : visible, mais sécable —
      // sinon une phrase longue ne peut plus passer à la ligne sur petit écran.
      span.textContent = " ";
      span.style.whiteSpace = "pre-wrap";
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

      if (!window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
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
    }
    el.appendChild(span);
  });

  // ---- Tactile : le doigt qui glisse sur le texte "efface" les lettres
  // comme le survol à la souris, puis elles se reforment.
  const touched = new Set();
  let touchRestoreTimer;
  const fadeLetter = (span) => {
    span._state.targetOpacity = 0;
    span._state.targetBlur = 10;
    span._state.targetBrightness = 2;
    touched.add(span);
  };
  const touchHandler = (e) => {
    clearTimeout(touchRestoreTimer);
    const t = e.touches[0];
    const hit = document.elementFromPoint(t.clientX, t.clientY);
    if (hit && hit._state) fadeLetter(hit);
  };
  el.addEventListener("touchstart", touchHandler, { passive: true });
  el.addEventListener("touchmove", touchHandler, { passive: true });
  el.addEventListener(
    "touchend",
    () => {
      touchRestoreTimer = setTimeout(() => {
        touched.forEach((span) => {
          span._state.targetOpacity = 1;
          span._state.targetBlur = 0;
          span._state.targetBrightness = 1;
        });
        touched.clear();
      }, 1200);
    },
    { passive: true },
  );

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }
  function animate() {
    letters.forEach((span) => {
      const s = span._state;
      // Au repos on n'écrit plus de style : sur des centaines de lettres, ça
      // évitait des centaines de recalculs de style (filter) par frame.
      const settled =
        Math.abs(s.targetOpacity - s.opacity) < 0.002 &&
        Math.abs(s.targetBlur - s.blur) < 0.02 &&
        Math.abs(s.targetBrightness - s.brightness) < 0.002;
      if (settled) {
        if (!s.rest) {
          s.opacity = s.targetOpacity;
          s.blur = s.targetBlur;
          s.brightness = s.targetBrightness;
          span.style.opacity = s.opacity;
          span.style.filter = `blur(${s.blur}px) brightness(${s.brightness})`;
          s.rest = true;
        }
        return;
      }
      s.rest = false;
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
