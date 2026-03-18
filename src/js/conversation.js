// ============================================================
// CONV - IMPORT ET CONST
// ============================================================
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initConversationSlider() {
  const container = document.querySelector(".container-conversation-slider");
  if (!container) return;

  const groups = [...document.querySelectorAll(".copy-group")];
  const NUM_GROUPS = groups.length;
  const GROUP_SEG = 1 / NUM_GROUPS;
  const STAGGER_RATIO = 0.2;

  const CROSSFADE_THRESHOLDS = [0.6, 0.73, 0.86];

  // ============================================================
  // CONV - STOCK DES DELAYEDCALLS POUR ANNULATION
  // ============================================================

  const pendingDelays = new Map();

  function prepareWords(block) {
    const p = block.querySelector("p");
    if (!p || p.dataset.wordsReady) return;
    p.dataset.wordsReady = "true";
    const text = p.textContent;
    const words = text.split(/(\s+)/);
    p.innerHTML = "";
    words.forEach((word) => {
      if (word.trim() === "") {
        p.appendChild(document.createTextNode(word));
        return;
      }
      const wrapper = document.createElement("span");
      wrapper.style.cssText =
        "display:inline-block;overflow:hidden;vertical-align:bottom";
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
    gsap.killTweensOf(spans);
    gsap.fromTo(
      spans,
      { y: "100%" },
      { y: "0%", duration: 1.2, stagger: 0.04, ease: "power4.out" },
    );
  }

  function animateWordsOut(block) {
    const spans = block.querySelectorAll("p span > span");
    if (!spans.length) return;
    gsap.killTweensOf(spans);
    gsap.to(spans, {
      y: "100%",
      duration: 0.8,
      stagger: 0.03,
      ease: "power4.in",
    });
  }
  // ============================================================
  // CONV - KILL DES TEXT ET IMAGE APRES DISSPARITION
  // ============================================================
  function killPendingDelay(block) {
    if (pendingDelays.has(block)) {
      pendingDelays.get(block).kill();
      pendingDelays.delete(block);
    }
  }

  function resetBlock(block) {
    killPendingDelay(block);
    const spans = block.querySelectorAll("p span > span");
    gsap.killTweensOf(spans);
    gsap.set(block, { autoAlpha: 0 });
    gsap.set(spans, { y: "100%" });
  }

  const blockVisible = new WeakMap();
  const blockCrossed = new WeakMap();
  const igFaded = new WeakMap();
  const groupXFired = new Map();

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

  const lenis = window.__lenis;
  if (lenis) {
    ScrollTrigger.create({
      trigger: container,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => {
        lenis.options.wheelMultiplier = 0.03;
      },
      onLeave: () => {
        lenis.options.wheelMultiplier = 1;
      },
      onEnterBack: () => {
        lenis.options.wheelMultiplier = 0.03;
      },
      onLeaveBack: () => {
        lenis.options.wheelMultiplier = 1;
      },
    });
  }
  // ============================================================
  // CONV - SLIDER IMG
  // ============================================================
  ScrollTrigger.create({
    trigger: container,
    start: "top top",
    end: "bottom bottom",
    onUpdate(self) {
      const p = self.progress;

      groups.forEach((group, g) => {
        const groupStart = g * GROUP_SEG;
        const groupP = (p - groupStart) / GROUP_SEG;
        const blocks = [...group.querySelectorAll(".copy-block")];
        const isFirst = g === 0;
        const isLast = g === NUM_GROUPS - 1;
        const isActive =
          (isFirst ? groupP >= 0 : groupP > 0) && (isLast ? true : groupP < 1);

        const exitP = !isLast && groupP > 0.6 ? (groupP - 0.6) / 0.4 : 0;
        const exitX = `${-exitP * 110}vw`;

        const imgs = group.querySelectorAll(".copy-img");
        const ig = imageGroupes[g];

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
              gsap.to(igImgs, {
                autoAlpha: 1,
                duration: 1.5,
                ease: "power2.out",
                stagger: 0.4,
              });
            }
            gsap.set(ig, { x: exitX });
          }
        }

        // ============================================================
        // CONV - RESET DES BLOQUES SI INNACTIF
        // ============================================================
        if (!isActive) {
          blocks.forEach((block) => {
            resetBlock(block);
            blockVisible.set(block, false);
            blockCrossed.set(block, false);
          });
          gsap.set(imgs, { autoAlpha: 0 });
          groupXFired.set(group, [false, false, false]);
          return;
        }

        gsap.set(imgs, { autoAlpha: 1, x: exitX });
        // ============================================================
        // CONV - STAGGER D'APPARITION DES BLOCS
        // ============================================================
        blocks.forEach((block, b) => {
          if (blockCrossed.get(block)) return;

          const blockStart = b * STAGGER_RATIO;
          const localP = (groupP - blockStart) / STAGGER_RATIO;
          let blockOpacity = 0;
          if (localP >= 1) blockOpacity = 1;
          else if (localP > 0) blockOpacity = localP;

          const wasVisible = blockVisible.get(block);
          const isNowVisible = blockOpacity > 0;
          // ============================================================
          // CONV - SLIDER - SCROLL TROP RAPIDE, AFFICHEAGE SANS ANIMATION
          // ============================================================
          if (!wasVisible && isNowVisible) {
            killPendingDelay(block);
            if (localP >= 1) {
              const spans = block.querySelectorAll("p span > span");
              gsap.killTweensOf(spans);
              gsap.set(spans, { y: "0%" });
            } else {
              animateWords(block);
            }
            // ============================================================
            // CONV - SLIDER - SCROLL RETOUR, RESET DES MOTS
            // ============================================================
          } else if (wasVisible && !isNowVisible) {
            const spans = block.querySelectorAll("p span > span");
            gsap.killTweensOf(spans);
            gsap.set(spans, { y: "100%" });
          }
          blockVisible.set(block, isNowVisible);

          gsap.set(block, { autoAlpha: blockOpacity });
        });

        // ============================================================
        // CONV - SLIDER - CROSSFADE DES TEXT
        // ============================================================
        if (!isLast) {
          const nextGroup = groups[g + 1];
          const nextBlocks = [...nextGroup.querySelectorAll(".copy-block")];
          const fired = groupXFired.get(group);

          CROSSFADE_THRESHOLDS.forEach((threshold, b) => {
            if (groupP >= threshold && !fired[b]) {
              fired[b] = true;

              if (blocks[b]) animateWordsOut(blocks[b]);

              if (nextBlocks[b]) {
                killPendingDelay(nextBlocks[b]);
                gsap.set(nextBlocks[b], { autoAlpha: 1 });
                animateWords(nextBlocks[b]);
                blockVisible.set(nextBlocks[b], true);
                blockCrossed.set(nextBlocks[b], true);
              }
            } else if (groupP < threshold && fired[b]) {
              fired[b] = false;

              if (nextBlocks[b]) {
                resetBlock(nextBlocks[b]);
                blockVisible.set(nextBlocks[b], false);
                blockCrossed.set(nextBlocks[b], false);
              }

              if (blocks[b]) {
                gsap.killTweensOf(blocks[b].querySelectorAll("p span > span"));
                gsap.set(blocks[b].querySelectorAll("p span > span"), {
                  y: "0%",
                });
              }
            }
          });
        }
      });
    },
  });
  // ============================================================
  // CONV - SLIDER - REFRESH QUAND PANEL SE FERME
  // ============================================================

  new MutationObserver(() => {
    if (!document.body.classList.contains("panel-open")) {
      ScrollTrigger.refresh();
    }
  }).observe(document.body, { attributes: true, attributeFilter: ["class"] });
}
