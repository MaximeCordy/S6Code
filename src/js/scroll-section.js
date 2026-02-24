/* ── Éléments DOM ── */
const section = document.getElementById("scrollLock");
const stages = document.querySelectorAll(".text-stage");
const scrollHint = document.getElementById("scrollHint");
const total = stages.length;

const galleryTrack = document.getElementById("galleryTrack");
const galleryItems = document.querySelectorAll(".gallery-item");

/* ── Scroll lock ── */
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

/* ── Galerie horizontale ── */
let targetX = 0;
let currentX = 0;
let ease = 0.08;

function onScroll() {
  if (!section) return;

  var rect = section.getBoundingClientRect();
  var scrolled = -rect.top;
  var scrollable = section.offsetHeight - window.innerHeight;
  var progress = Math.max(0, Math.min(1, scrolled / scrollable));

  var activeIndex = Math.min(total - 1, Math.floor(progress / (1 / total)));
  activate(activeIndex);

  if (scrollHint) scrollHint.style.opacity = progress > 0.03 ? "0" : "1";

  /* ── Défilement horizontal ── */
  if (galleryTrack) {
    var maxScroll = galleryTrack.scrollWidth - window.innerWidth;
    targetX = -progress * maxScroll;
  }
}

function animateGallery() {
  currentX += (targetX - currentX) * ease;

  if (galleryTrack) {
    galleryTrack.style.transform = `translateX(${currentX}px)`;
  }

  /* ── Micro parallaxe + scale dynamique ── */
  galleryItems.forEach((item, i) => {
    const speed = 1 + i * 0.02;
    item.style.transform = `translateX(${currentX * (1 - speed)}px) scale(${1 + Math.abs(currentX) * 0.00005})`;
  });

  requestAnimationFrame(animateGallery);
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
animateGallery();
