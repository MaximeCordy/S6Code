// ============================================================
// ÉLÉMENTS DOM
// ============================================================

const section     = document.getElementById("scrollLock");
const stages      = document.querySelectorAll(".text-stage");
const scrollHint  = document.getElementById("scrollHint");
const total       = stages.length;

const galleryTrack = document.getElementById("galleryTrack");
const galleryItems = document.querySelectorAll(".gallery-item");

// ============================================================
// SCROLL LOCK — ACTIVATION DES TEXT STAGES
// ============================================================

let currentActive = -1;

function activate(index) {
  if (index === currentActive) return;
  stages.forEach(function (s, i) {
    if (i === currentActive) {
      s.classList.remove("is-active");
      s.classList.add("is-exiting");
      setTimeout(function () {
        s.classList.remove("is-exiting");
      }, 400);
    } else {
      s.classList.remove("is-active", "is-exiting");
    }
  });
  if (index >= 0 && index < total) stages[index].classList.add("is-active");
  currentActive = index;
}

// ============================================================
// GALERIE VERTICALE — DÉFILEMENT
// ============================================================

let targetY = 0;
let currentY = 0;
let ease = 0.08;

function onScroll() {
  if (!section) return;

  var rect      = section.getBoundingClientRect();
  var scrolled  = -rect.top;
  var scrollable = section.offsetHeight - window.innerHeight;
  var progress  = Math.max(0, Math.min(1, scrolled / scrollable));

  var activeIndex = Math.min(total - 1, Math.floor(progress / (1 / total)));
  activate(activeIndex);

  if (scrollHint) scrollHint.style.opacity = progress > 0.03 ? "0" : "1";

  if (galleryTrack) {
    var maxScroll = galleryTrack.scrollHeight - window.innerHeight;
    targetY = -progress * maxScroll;
  }
}

function animateGallery() {
  currentY += (targetY - currentY) * ease;

  if (galleryTrack) {
    galleryTrack.style.transform = `translateY(${currentY}px)`;
  }

  /* Micro parallaxe par item */
  galleryItems.forEach((item, i) => {
    const speed = 1 + i * 0.02;
    item.style.transform = `translateY(${currentY * (1 - speed)}px) scale(${1 + Math.abs(currentY) * 0.00005})`;
  });

  requestAnimationFrame(animateGallery);
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
animateGallery();

// ============================================================
// LOGO STICKER — ANIMATION D'ENTRÉE (depuis la section avant)
// ============================================================

const sticker = document.querySelector(".scroll-lock__sticker");

if (sticker && section && typeof gsap !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  gsap.fromTo(
    sticker,
    { scale: 2.8, rotation: 0, y: -window.innerHeight, opacity: 1 },
    {
      scale: 1,
      rotation: 360,
      y: 0,
      opacity: 1,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "top 20%",
        scrub: 1,
      },
    }
  );
}
