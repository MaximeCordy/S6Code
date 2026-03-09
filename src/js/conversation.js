function initConversationSlider() {
  gsap.registerPlugin(ScrollTrigger);

  const container = document.querySelector(".container-conversation-slider");
  if (!container) return;

  const groups = [...document.querySelectorAll(".copy-group")];
  const NUM_GROUPS = groups.length; // 6
  const GROUP_SEG = 1 / NUM_GROUPS;
  // Dans chaque groupe : 3 blocs apparaissent en stagger sur 60% du segment, puis tout disparaît sur 20%
  const STAGGER_RATIO = 0.2; // chaque bloc se décale de 20% du segment groupe

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

  // Anime les mots d'un bloc
  function animateWords(block, delay = 0) {
    const spans = block.querySelectorAll("p span > span");
    if (!spans.length) return;
    gsap.fromTo(spans, { y: "100%" }, { y: "0%", duration: 1.2, stagger: 0.04, ease: "power4.out", delay });
  }

  const blockVisible = new WeakMap(); // track état précédent

  const imageGroupes = [...document.querySelectorAll(".image-groupe")];
  imageGroupes.forEach((ig) => {
    gsap.set(ig, { autoAlpha: 0 });
    gsap.set(ig.querySelectorAll("img"), { x: "110vw" });
  });

  groups.forEach((group) => {
    group.querySelectorAll(".copy-block").forEach((block) => {
      prepareWords(block);
      blockVisible.set(block, false);
    });
    gsap.set(group.querySelectorAll(".copy-block"), { autoAlpha: 0 });
    gsap.set(group.querySelectorAll(".copy-img"), { autoAlpha: 0 });
  });

  // Ralentir le scroll dans cette section
  const lenis = window.__lenis;
  if (lenis) {
    ScrollTrigger.create({
      trigger: container,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => { lenis.options.wheelMultiplier = 0.06; },
      onLeave: () => { lenis.options.wheelMultiplier = 1; },
      onEnterBack: () => { lenis.options.wheelMultiplier = 0.06; },
      onLeaveBack: () => { lenis.options.wheelMultiplier = 1; },
    });
  }

  ScrollTrigger.create({
    trigger: container,
    start: "top top",
    end: "bottom bottom",
    onUpdate(self) {
      const p = self.progress;

      groups.forEach((group, g) => {
        const groupStart = g * GROUP_SEG;
        const groupP = (p - groupStart) / GROUP_SEG; // 0→1 dans ce groupe
        const blocks = group.querySelectorAll(".copy-block");

        // Phase d'entrée (0→0.8) et de sortie vers la gauche (0.8→1)
        const isLast = g === NUM_GROUPS - 1;
        const isActive = groupP > 0 && (isLast ? true : groupP < 1);
        const exitP = (!isLast && groupP > 0.8) ? (groupP - 0.8) / 0.2 : 0;
        const exitX = `${-exitP * 110}vw`;

        const imgs = group.querySelectorAll(".copy-img");
        const ig = imageGroupes[g];
        if (ig) {
          if (!isActive) {
            gsap.set(ig, { autoAlpha: 0, display: "none" });
          } else {
            gsap.set(ig, { autoAlpha: 1, display: "flex", x: exitX });
            [...ig.querySelectorAll("img")].forEach((img, i) => {
              const imgStart = i * 0.15;
              const imgP = Math.max(0, Math.min(1, (groupP - imgStart) / 0.35));
              gsap.set(img, { x: `${(1 - imgP) * 110}vw` });
            });
          }
        }
        if (!isActive) {
          gsap.set(blocks, { autoAlpha: 0, x: 0 });
          gsap.set(imgs, { autoAlpha: 0 });
          return;
        }
        gsap.set(imgs, { autoAlpha: 1, x: exitX });

        // Chaque bloc apparaît à son tour (stagger de STAGGER_RATIO)
        blocks.forEach((block, b) => {
          const blockStart = b * STAGGER_RATIO;
          const localP = (groupP - blockStart) / STAGGER_RATIO;
          let blockOpacity = 0;
          if (localP >= 1) blockOpacity = 1;
          else if (localP > 0) blockOpacity = localP;

          const wasVisible = blockVisible.get(block);
          const isNowVisible = blockOpacity > 0;
          if (!wasVisible && isNowVisible) {
            animateWords(block);
          }
          blockVisible.set(block, isNowVisible);

          gsap.set(block, { autoAlpha: blockOpacity, x: exitX });
        });
      });
    },
  });
}

initConversationSlider();
