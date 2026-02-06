// ================== ANIMATION DE TEXTE STANDALONE ==================
// Ce fichier s'occupe UNIQUEMENT de l'animation de texte
// Il ne touche PAS à Barba ou aux autres animations

gsap.registerPlugin(ScrollTrigger);

/**
 * Anime le texte mot par mot avec effet de montée
 * Compatible avec Barba - nettoie automatiquement les animations
 */
function animateTextByWords(selector = "[data-animate-text]", options = {}) {
  const {
    animateOnScroll = true,
    delay = 0,
    duration = 2,
    stagger = 0.03,
    scrollTriggerStart = "top 60%",
    scope = document,
  } = options;

  const elements = scope.querySelectorAll(selector);

  if (!elements.length) {
    console.log("⚠️ Aucun élément avec", selector);
    return;
  }

  console.log(`🎨 Animation de ${elements.length} élément(s) de texte`);

  elements.forEach((element) => {
    // Éviter de réanimer un élément déjà animé
    if (element.hasAttribute("data-text-animated")) {
      console.log("⏭️ Élément déjà animé, skip");
      return;
    }
    element.setAttribute("data-text-animated", "true");

    // Sauvegarder le texte original
    const originalText = element.textContent;

    // Découper en mots (garde les espaces)
    const words = originalText.split(/(\s+)/);

    // Vider l'élément
    element.innerHTML = "";

    // Créer un span wrapper pour chaque mot
    const wordSpans = words
      .map((word) => {
        // Si c'est juste un espace, le garder tel quel
        if (word.trim() === "") {
          element.appendChild(document.createTextNode(word));
          return null;
        }

        // Créer le wrapper avec overflow hidden
        const wrapper = document.createElement("span");
        wrapper.style.display = "inline-block";
        wrapper.style.overflow = "hidden";
        wrapper.style.verticalAlign = "bottom";

        // Créer le span du mot
        const wordSpan = document.createElement("span");
        wordSpan.textContent = word;
        wordSpan.style.display = "inline-block";

        wrapper.appendChild(wordSpan);
        element.appendChild(wrapper);

        return wordSpan;
      })
      .filter(Boolean); // Enlever les null (espaces)

    // Positionner les mots hors écran (en dessous)
    gsap.set(wordSpans, { y: "100%" });

    // Configuration de l'animation
    const animationProps = {
      y: "0%",
      duration: duration,
      stagger: stagger,
      ease: "power4.out",
      delay: delay,
    };

    // Animer au scroll ou immédiatement
    if (animateOnScroll) {
      gsap.to(wordSpans, {
        ...animationProps,
        scrollTrigger: {
          trigger: element,
          start: scrollTriggerStart,
          once: true,
          // markers: true, // Décommenter pour debug
        },
      });
    } else {
      gsap.to(wordSpans, animationProps);
    }
  });
}

// ================== NETTOYAGE POUR BARBA ==================
/**
 * Nettoie les attributs data-text-animated pour permettre la réanimation
 * Appelle cette fonction dans ton hook Barba "beforeLeave" ou "leave"
 */
function cleanupTextAnimations() {
  const animatedElements = document.querySelectorAll("[data-text-animated]");
  animatedElements.forEach((el) => {
    el.removeAttribute("data-text-animated");
  });
  console.log("🧹 Nettoyage des animations de texte");
}

// ================== INITIALISATION ==================
// Animation au chargement initial de la page
document.addEventListener("DOMContentLoaded", () => {
  console.log("🎬 Initialisation des animations de texte");
  animateTextByWords("[data-animate-text]", {
    animateOnScroll: true,
    delay: 0.2,
  });
});
