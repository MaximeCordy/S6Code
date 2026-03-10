import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initMaladieSlider() {
  const track = document.querySelector(".maladie-slider-track");
  if (!track) return;

  const items = track.querySelectorAll(".maladie-slide-item");
  if (!items.length) return;

  // Calculer la largeur d'un seul set (la moitié du track, car images dupliquées)
  const itemWidth = items[0].offsetWidth + 15; // largeur + gap
  const totalWidth = itemWidth * (items.length / 2);

  gsap.to(track, {
    x: -totalWidth,
    duration: 20,
    ease: "none",
    repeat: -1,
  });

  // Animation fumée au hover — disparaît, réapparaît après 3s
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

    img.addEventListener("mouseleave", () => {
      // Ne rien faire — on laisse le timer gérer la réapparition
    });
  });
}

export function initMaladieTitle() {
  const h1 = document.getElementById("titre");
  if (!h1) return;

  const texte = "Alzheimer";
  const letters = [];

  texte.split("").forEach((char) => {
    const span = document.createElement("span");
    if (char === " ") {
      span.classList.add("space");
      span.innerHTML = "&nbsp;";
    } else {
      span.textContent = char;
      letters.push(span);

      const state = {
        opacity: 1, blur: 0, brightness: 1, tx: 0, ty: 0, scale: 1,
        targetOpacity: 1, targetBlur: 0, targetBrightness: 1,
        targetTx: 0, targetTy: 0, targetScale: 1, hovered: false,
      };
      span._state = state;

      span.addEventListener("mousemove", () => {
        state.hovered = true;
        state.targetOpacity = 0;
        state.targetBlur = 10;
        state.targetBrightness = 2;
        state.targetTx = 0;
        state.targetTy = 0;
        state.targetScale = 1;
      });

      span.addEventListener("mouseleave", () => {
        state.hovered = false;
        state.targetOpacity = 1;
        state.targetBlur = 0;
        state.targetBrightness = 1;
        state.targetTx = 0;
        state.targetTy = 0;
        state.targetScale = 1;
      });
    }
    h1.appendChild(span);
  });

  const ease = 0.05;
  function lerp(a, b, t) { return a + (b - a) * t; }

  function animate() {
    letters.forEach((span) => {
      const s = span._state;
      s.opacity = lerp(s.opacity, s.targetOpacity, ease);
      s.blur = lerp(s.blur, s.targetBlur, ease);
      s.brightness = lerp(s.brightness, s.targetBrightness, ease);
      s.tx = lerp(s.tx, s.targetTx, ease);
      s.ty = lerp(s.ty, s.targetTy, ease);
      s.scale = lerp(s.scale, s.targetScale, ease);
      span.style.opacity = s.opacity;
      span.style.filter = `blur(${s.blur}px) brightness(${s.brightness})`;
      span.style.transform = `translate(${s.tx}px, ${s.ty}px) scale(${s.scale})`;
    });
    requestAnimationFrame(animate);
  }

  animate();
}

