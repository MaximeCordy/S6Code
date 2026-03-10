function initConversationSlider() {
  gsap.registerPlugin(ScrollTrigger);

  const container = document.querySelector(".container-conversation-slider");
  if (!container) return;

  const groups = [...document.querySelectorAll(".copy-group")];
  const NUM_GROUPS = groups.length;
  const GROUP_SEG = 1 / NUM_GROUPS;
  const STAGGER_RATIO = 0.2;

  // Seuils dans le segment de groupe où chaque bloc fait le crossfade vers le groupe suivant
  const CROSSFADE_THRESHOLDS = [0.6, 0.73, 0.86];

  // Prépare les mots de chaque bloc (split + y:100%)
  function prepareWords(block) {
    const p = block.querySelector("p");
    if (!p || p.dataset.wordsReady) return;
    p.dataset.wordsReady = "true";
    const text = p.textContent;
    const words = text.split(/(\s+)/);
    p.innerHTML = "";
    words.forEach((word) => {
      if (word.trim() === "") { p.appendChild(document.createTextNode(word)); return; }
      const wrapper = document.createElement("span");
      wrapper.style.cssText = "display:inline-block;overflow:hidden;vertical-align:bottom";
      const span = document.createElement("span");
      span.textContent = word;
      span.style.display = "inline-block";
      wrapper.appendChild(span);
      p.appendChild(wrapper);
    });
    gsap.set(p.querySelectorAll("span > span"), { y: "100%" });
  }

  function animateWords(block) {
    const spans = block.querySelectorAll("p span > span");
    if (!spans.length) return;
    gsap.fromTo(spans, { y: "100%" }, { y: "0%", duration: 1.2, stagger: 0.04, ease: "power4.out" });
  }

  function animateWordsOut(block) {
    const spans = block.querySelectorAll("p span > span");
    if (!spans.length) return;
    gsap.to(spans, { y: "100%", duration: 0.8, stagger: 0.03, ease: "power4.in" });
  }

  const blockVisible   = new WeakMap(); // bloc déjà apparu dans son groupe
  const blockCrossed   = new WeakMap(); // bloc entré via crossfade du groupe précédent
  const igFaded        = new WeakMap();
  const groupXFired    = new Map();     // group → [bool, bool, bool] crossfades déclenchés

  const imageGroupes = [...document.querySelectorAll(".image-groupe")];
  imageGroupes.forEach((ig, i) => {
    gsap.set(ig.querySelectorAll("img"), { x: 0 });
    if (i === 0) {
      gsap.set(ig, { autoAlpha: 1, display: "flex" });
      igFaded.set(ig, true);
    } else {
      gsap.set(ig, { autoAlpha: 0 });
      igFaded.set(ig, false);
    }
  });

  groups.forEach((group) => {
    group.querySelectorAll(".copy-block").forEach((block) => {
      prepareWords(block);
      blockVisible.set(block, false);
      blockCrossed.set(block, false);
    });
    gsap.set(group.querySelectorAll(".copy-block"), { autoAlpha: 0 });
    gsap.set(group.querySelectorAll(".copy-img"), { autoAlpha: 0 });
    groupXFired.set(group, [false, false, false]);
  });

  document.addEventListener("DOMContentLoaded", () => {
    const lenis = window.__lenis;
    if (!lenis) return;
    ScrollTrigger.create({
      trigger: container,
      start: "top bottom",
      end: "bottom top",
      onEnter:     () => { lenis.options.wheelMultiplier = 0.03; },
      onLeave:     () => { lenis.options.wheelMultiplier = 1; },
      onEnterBack: () => { lenis.options.wheelMultiplier = 0.03; },
      onLeaveBack: () => { lenis.options.wheelMultiplier = 1; },
    });
  });

  ScrollTrigger.create({
    trigger: container,
    start: "top top",
    end: "bottom bottom",
    onUpdate(self) {
      const p = self.progress;

      groups.forEach((group, g) => {
        const groupStart = g * GROUP_SEG;
        const groupP     = (p - groupStart) / GROUP_SEG;
        const blocks     = [...group.querySelectorAll(".copy-block")];
        const isFirst    = g === 0;
        const isLast     = g === NUM_GROUPS - 1;
        const isActive   = (isFirst ? groupP >= 0 : groupP > 0) && (isLast ? true : groupP < 1);

        // Images : slide-left à la sortie
        const exitP = (!isLast && groupP > 0.6) ? (groupP - 0.6) / 0.4 : 0;
        const exitX = `${-exitP * 110}vw`;

        const imgs = group.querySelectorAll(".copy-img");
        const ig   = imageGroupes[g];

        if (ig) {
          if (!isActive) {
            gsap.killTweensOf(ig);
            gsap.killTweensOf(ig.querySelectorAll("img"));
            gsap.set(ig, { autoAlpha: 0, display: "none" });
            igFaded.set(ig, false);
          } else {
            if (!igFaded.get(ig)) {
              igFaded.set(ig, true);
              gsap.set(ig, { display: "flex", autoAlpha: 1 });
              const igImgs = ig.querySelectorAll("img");
              gsap.set(igImgs, { autoAlpha: 0 });
              gsap.to(igImgs, { autoAlpha: 1, duration: 1.5, ease: "power2.out", stagger: 0.4 });
            }
            gsap.set(ig, { x: exitX });
          }
        }

        // ── Reset complet si groupe inactif ──────────────────
        if (!isActive) {
          gsap.killTweensOf(blocks);
          blocks.forEach((block) => {
            // Ne reset que les blocs qui n'ont pas été crossfadés par ce groupe
            if (!blockCrossed.get(block)) {
              gsap.set(block, { autoAlpha: 0 });
              gsap.set(block.querySelectorAll("p span > span"), { y: "100%" });
            }
            blockVisible.set(block, false);
          });
          gsap.set(imgs, { autoAlpha: 0 });
          groupXFired.set(group, [false, false, false]);
          return;
        }

        gsap.set(imgs, { autoAlpha: 1, x: exitX });

        // ── Stagger d'apparition des blocs (texte statique, pas de exitX) ──
        blocks.forEach((block, b) => {
          // Bloc pré-chargé par un crossfade du groupe précédent → ne pas toucher
          if (blockCrossed.get(block)) return;

          const blockStart   = b * STAGGER_RATIO;
          const localP       = (groupP - blockStart) / STAGGER_RATIO;
          let blockOpacity   = 0;
          if (localP >= 1) blockOpacity = 1;
          else if (localP > 0) blockOpacity = localP;

          const wasVisible   = blockVisible.get(block);
          const isNowVisible = blockOpacity > 0;

          if (!wasVisible && isNowVisible) animateWords(block);
          blockVisible.set(block, isNowVisible);

          gsap.set(block, { autoAlpha: blockOpacity });
        });

        // ── Crossfade vers le groupe suivant ─────────────────
        if (!isLast) {
          const nextGroup  = groups[g + 1];
          const nextBlocks = [...nextGroup.querySelectorAll(".copy-block")];
          const fired      = groupXFired.get(group);

          CROSSFADE_THRESHOLDS.forEach((threshold, b) => {
            if (groupP >= threshold && !fired[b]) {
              fired[b] = true;

              // Sortie du bloc b du groupe courant
              if (blocks[b]) animateWordsOut(blocks[b]);

              // Entrée du bloc b du groupe suivant (avec délai)
              if (nextBlocks[b]) {
                gsap.set(nextBlocks[b], { autoAlpha: 1 });
                gsap.delayedCall(0.5, () => animateWords(nextBlocks[b]));
                blockVisible.set(nextBlocks[b], true);
                blockCrossed.set(nextBlocks[b], true);
              }

            } else if (groupP < threshold && fired[b]) {
              // Scroll arrière : reset instantané
              fired[b] = false;

              if (nextBlocks[b]) {
                gsap.killTweensOf(nextBlocks[b].querySelectorAll("p span > span"));
                gsap.set(nextBlocks[b], { autoAlpha: 0 });
                gsap.set(nextBlocks[b].querySelectorAll("p span > span"), { y: "100%" });
                blockVisible.set(nextBlocks[b], false);
                blockCrossed.set(nextBlocks[b], false);
              }

              if (blocks[b]) {
                gsap.killTweensOf(blocks[b].querySelectorAll("p span > span"));
                gsap.set(blocks[b].querySelectorAll("p span > span"), { y: "0%" });
              }
            }
          });
        }
      });
    },
  });
}

initConversationSlider();

// Refresh ScrollTrigger quand le panel info se ferme
new MutationObserver(() => {
  if (!document.body.classList.contains("panel-open")) {
    ScrollTrigger.refresh();
  }
}).observe(document.body, { attributes: true, attributeFilter: ["class"] });
