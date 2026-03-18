// ============================================================
//  SCROLL SECTION — DANTE - GALLERIE
// ============================================================

export function initScrollSection() {
  const section = document.getElementById("scrollLock");
  if (!section) return;

  const stages = document.querySelectorAll(".text-stage");
  const scrollHint = document.getElementById("scrollHint");
  const total = stages.length;
  const galleryTrack = document.getElementById("galleryTrack");

  let currentActive = -1;
  let targetY = 0;
  let currentY = 0;
  const ease = 0.08;

  function activate(index) {
    if (index === currentActive) return;
    stages.forEach((s, i) => {
      if (i === currentActive) {
        s.classList.remove("is-active");
        s.classList.add("is-exiting");
        setTimeout(() => s.classList.remove("is-exiting"), 400);
      } else {
        s.classList.remove("is-active", "is-exiting");
      }
    });
    if (index >= 0 && index < total) stages[index].classList.add("is-active");
    currentActive = index;
  }

  function onScroll() {
    const rect = section.getBoundingClientRect();
    const scrolled = -rect.top;
    const scrollable = section.offsetHeight - window.innerHeight;
    const progress = Math.max(0, Math.min(1, scrolled / scrollable));

    const activeIndex = Math.min(total - 1, Math.floor(progress / (1 / total)));
    activate(activeIndex);

    if (scrollHint) scrollHint.style.opacity = progress > 0.03 ? "0" : "1";

    if (galleryTrack) {
      const maxScroll = galleryTrack.scrollHeight - window.innerHeight;
      targetY = -progress * maxScroll;
    }
  }

  function animateGallery() {
    currentY += (targetY - currentY) * ease;
    if (galleryTrack)
      galleryTrack.style.transform = `translateY(${currentY}px)`;
    requestAnimationFrame(animateGallery);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  animateGallery();
}
