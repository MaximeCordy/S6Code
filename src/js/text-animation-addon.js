// ============================================================
//  ANIMATION DE TEXTE — IMPORT - MOT PAR MOT
// ============================================================

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// ============================================================
// ANIMATION DE TEXTE — FONCTION PRINCIPALE
// ============================================================

function animateTextByWords(selector = "[data-animate-text]", options = {}) {
  const {
    animateOnScroll = true,
    delay = 0,
    duration = 2,
    stagger = 0.03,
    scrollTriggerStart = "top 80%",
    scope = document,
  } = options;

  const elements = scope.querySelectorAll(selector);

  if (!elements.length) return;

  elements.forEach((element) => {
    if (element.hasAttribute("data-text-animated")) return;
    element.setAttribute("data-text-animated", "true");

    const originalText = element.textContent;
    const words = originalText.split(/(\s+)/);
    element.innerHTML = "";

    const wordSpans = words
      .map((word) => {
        if (word.trim() === "") {
          element.appendChild(document.createTextNode(word));
          return null;
        }

        const wrapper = document.createElement("span");
        wrapper.style.display = "inline-block";
        wrapper.style.overflow = "hidden";
        wrapper.style.verticalAlign = "bottom";

        const wordSpan = document.createElement("span");
        wordSpan.textContent = word;
        wordSpan.style.display = "inline-block";

        wrapper.appendChild(wordSpan);
        element.appendChild(wrapper);

        return wordSpan;
      })
      .filter(Boolean);

    gsap.set(wordSpans, { y: "100%" });

    const animationProps = {
      y: "0%",
      duration: duration,
      stagger: stagger,
      ease: "power4.out",
      delay: delay,
    };

    if (animateOnScroll) {
      gsap.to(wordSpans, {
        ...animationProps,
        scrollTrigger: {
          trigger: element,
          start: scrollTriggerStart,
          once: true,
          id: "text-anim",
        },
      });
    } else {
      gsap.to(wordSpans, animationProps);
    }
  });
}

// ============================================================
// ANIMATION DE TEXTE — INITIALISATION AU CHARGEMENT
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  animateTextByWords("[data-animate-text]", {
    animateOnScroll: true,
    delay: 0.2,
    scrollTriggerStart: "top 95%",
  });
});
