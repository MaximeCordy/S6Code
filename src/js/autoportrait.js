// ============================================================
// AUTO - IMPORT ET CONST
// ============================================================
import { initLetterHover } from "./maladie.js";

export function initAutoportraitTitles() {
  document
    .querySelectorAll(".hero_conversation h1 .hero-text-part")
    .forEach((el) => {
      initLetterHover(el, el.textContent.trim().replace(/\s+/g, " "));
    });

  const selectors = [
    ".hero_conversation h2",
    ".info-avant-footer h1",
    ".info-avant-footer > p",
    ".info-avant-footer h2",
  ];
  selectors.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => {
      initLetterHover(el, el.textContent.trim().replace(/\s+/g, " "));
    });
  });
}
// ============================================================
// AUTO - GALLERIE
// ============================================================

export function initAutoportrait() {
  const trackEl = document.getElementById("gallery-track");
  if (!trackEl) return;
  const DATA = [...trackEl.querySelectorAll("#gallery-images img")].map(
    (img) => ({
      year: parseInt(img.dataset.year),
      src: img.getAttribute("src"),
      x: parseFloat(img.dataset.x),
      y: parseFloat(img.dataset.y),
      w: parseFloat(img.dataset.w),
      h: parseFloat(img.dataset.h),
    }),
  );

  if (!DATA.length) return;

  const sceneEl = document.getElementById("scene");
  const cvsEl = document.getElementById("canvas");
  const countEl = document.getElementById("gCount");
  const progEl = document.getElementById("gProg");
  const tlEl = document.getElementById("gTimeline");
  const zoomEl = document.getElementById("gZoom");

  const VW = window.innerWidth,
    VH = window.innerHeight,
    CY = VH / 2;
  const LERP = 0.08,
    FRIC = 0.88,
    MAX_Y = 260,
    DEF_ZOOM = 0.9;
  const first = DATA[0],
    last = DATA[DATA.length - 1];

  let zoom = DEF_ZOOM,
    camX = 0,
    camY = 0,
    tgtX = 0,
    tgtY = 0;
  let velY = 0,
    idx = 0,
    pDist = 0;
  let drag = false,
    dSY = 0,
    dCY = 0,
    dLY = 0,
    dVY = 0;

  const xForP = (p, z) => {
    const s = VW / 2 - (first.x + first.w / 2) * z,
      e = VW / 2 - (last.x + last.w / 2) * z;
    return s + p * (e - s);
  };
  const trackH = (z) =>
    Math.round(((last.x + last.w / 2 - first.x - first.w / 2) * z) / 1.6) + VH;
  const scrollP = () => {
    const s = trackEl.offsetHeight - VH;
    return s > 0
      ? Math.max(0, Math.min(1, (window.scrollY - trackEl.offsetTop) / s))
      : 0;
  };

  trackEl.style.height = trackH(zoom) + "px";
  // ============================================================
  // AUTO - GALLERIE - CARTES
  // ============================================================
  DATA.forEach((d, i) => {
    const t = i / (DATA.length - 1);
    const brightness = 1 - t * 0.75;
    const el = document.createElement("div");
    el.className = "g-card";
    el.style.cssText = `left:${d.x}px;top:${CY + d.y - d.h / 2}px;width:${d.w}px;height:${d.h}px;filter:brightness(${brightness})`;
    el.innerHTML = `<img src="${d.src}" loading="lazy" data-artwork="${i}">`;
    cvsEl.appendChild(el);
  });

  // ============================================================
  // AUTO - GALLERIE - TIMELINE
  // ============================================================
  const years = [...new Set(DATA.map((d) => d.year))].sort((a, b) => a - b);
  const tlMap = {};
  years.forEach((yr, i) => {
    if (i > 0) {
      const r = document.createElement("div");
      r.className = "g-tl-rule";
      tlEl.appendChild(r);
    }
    const w = document.createElement("div");
    w.className = "g-tl-item";
    w.innerHTML = `<div class="g-tl-dot"></div><div class="g-tl-yr">${yr}</div>`;
    w.onclick = () => scrollToCard(DATA.findIndex((d) => d.year === yr));
    tlEl.appendChild(w);
    tlMap[yr] = w;
  });

  function updateUI() {
    countEl.textContent =
      String(idx + 1).padStart(2, "0") +
      " / " +
      String(DATA.length).padStart(2, "0");
    document.getElementById("gPrev").disabled = idx === 0;
    document.getElementById("gNext").disabled = idx === DATA.length - 1;
    years.forEach((yr) =>
      tlMap[yr].classList.toggle("active", yr === DATA[idx].year),
    );
    progEl.style.width = (idx / (DATA.length - 1)) * 100 + "%";
  }

  function updateIdx() {
    const cx = (-camX + VW / 2) / zoom;
    let best = 0,
      bestD = Infinity;
    DATA.forEach((d, i) => {
      const dist = Math.abs(d.x + d.w / 2 - cx);
      if (dist < bestD) {
        bestD = dist;
        best = i;
      }
    });
    idx = best;
  }
  // ============================================================
  // AUTO - GALLERIE - ZOOM & Dragg
  // ============================================================

  function scrollToCard(i) {
    idx = Math.max(0, Math.min(DATA.length - 1, i));
    const d = DATA[idx],
      s = VW / 2 - (first.x + first.w / 2) * zoom,
      e = VW / 2 - (last.x + last.w / 2) * zoom;
    const p = (VW / 2 - (d.x + d.w / 2) * zoom - s) / (e - s);
    window.scrollTo({
      top: trackEl.offsetTop + p * (trackEl.offsetHeight - VH),
      behavior: "smooth",
    });
    updateUI();
  }

  window.addEventListener(
    "scroll",
    () => {
      const p = scrollP();
      tgtX = xForP(p, zoom);
      if (window.__lenis) {
        window.__lenis.options.wheelMultiplier = 0.3 - p * 0.23;
      }
      updateIdx();
      updateUI();
    },
    { passive: true },
  );

  let zoomTimer;
  function applyZoom(z) {
    zoom = Math.max(0.25, Math.min(2.5, z));
    tgtX = xForP(scrollP(), zoom);
    tgtY = Math.max(-MAX_Y * zoom, Math.min(MAX_Y * zoom, tgtY));
    trackEl.style.height = trackH(zoom) + "px";
    zoomEl.textContent = Math.round(zoom * 100) + "%";
    zoomEl.classList.add("show");
    clearTimeout(zoomTimer);
    zoomTimer = setTimeout(() => zoomEl.classList.remove("show"), 1200);
  }

  sceneEl.addEventListener(
    "wheel",
    (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        applyZoom(zoom * (1 - e.deltaY * 0.003));
      }
    },
    { passive: false },
  );

  window.addEventListener("mousemove", (e) => {
    if (!drag) return;
    dVY = e.clientY - dLY;
    dLY = e.clientY;
    tgtY = Math.max(
      -MAX_Y * zoom,
      Math.min(MAX_Y * zoom, dCY + (e.clientY - dSY)),
    );
  });
  window.addEventListener("mouseup", () => {
    if (!drag) return;
    drag = false;
    velY = dVY * 1.2;
    sceneEl.classList.remove("dragging");
  });
  sceneEl.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches.length === 2) {
        pDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        );
        return;
      }
      const t = e.touches[0];
      drag = true;
      dSY = dLY = t.clientY;
      dCY = tgtY;
      dVY = velY = 0;
    },
    { passive: true },
  );
  window.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches.length === 2) {
        const d = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        );
        if (pDist > 0) applyZoom(zoom * (d / pDist));
        pDist = d;
        return;
      }
      if (!drag) return;
      const t = e.touches[0];
      dVY = t.clientY - dLY;
      dLY = t.clientY;
      tgtY = Math.max(
        -MAX_Y * zoom,
        Math.min(MAX_Y * zoom, dCY + (t.clientY - dSY)),
      );
    },
    { passive: true },
  );
  window.addEventListener("touchend", () => {
    if (drag) {
      drag = false;
      velY = dVY * 1.2;
    }
  });

  (function loop() {
    if (!drag) {
      tgtY += velY;
      velY *= FRIC;
      if (Math.abs(velY) < 0.05) velY = 0;
    }
    camX += (tgtX - camX) * LERP;
    camY += (tgtY - camY) * LERP;
    cvsEl.style.transform = `translate3d(${camX}px,${camY}px,0) scale(${zoom})`;
    requestAnimationFrame(loop);
  })();

  tgtX = camX = xForP(scrollP(), zoom);
  updateUI();
}
