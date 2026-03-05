// ============================================================
//  CERCLES GRAIN — entoure les .hl d'un cercle dessiné à la main
// ============================================================

const svgNS = "http://www.w3.org/2000/svg";

function injectGrainFilter() {
  if (document.getElementById("hl-gf")) return;
  const defs = document.createElementNS(svgNS, "svg");
  defs.setAttribute("width", "0");
  defs.setAttribute("height", "0");
  defs.style.cssText = "position:absolute;overflow:hidden";
  defs.innerHTML = `
    <defs>
      <filter id="hl-gf" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB">
        <feTurbulence type="turbulence" baseFrequency="0.035 0.055" numOctaves="2" result="warp">
          <animate attributeName="seed" values="0;1;2;3;4;0" dur="0.22s" repeatCount="indefinite"/>
        </feTurbulence>
        <feDisplacementMap in="SourceGraphic" in2="warp" scale="3" xChannelSelector="R" yChannelSelector="G" result="warped"/>
        <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="4" stitchTiles="stitch" result="rawGrain">
          <animate attributeName="seed" values="40;50;60;70;80;90;40" dur="0.09s" repeatCount="indefinite"/>
        </feTurbulence>
        <feColorMatrix in="rawGrain" type="matrix"
          values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.8 0 0 0 -1.25" result="grainMask"/>
        <feComposite in="warped" in2="grainMask" operator="in"/>
      </filter>
    </defs>`;
  document.body.appendChild(defs);
}

const f = (v) => v.toFixed(2);

function crPath(pts) {
  const n = pts.length;
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const a = pts[(i - 1 + n) % n],
      b = pts[i],
      c = pts[(i + 1) % n],
      e = pts[(i + 2) % n];
    const cp1x = b[0] + (c[0] - a[0]) / 6,
      cp1y = b[1] + (c[1] - a[1]) / 6;
    const cp2x = c[0] - (e[0] - b[0]) / 6,
      cp2y = c[1] - (e[1] - b[1]) / 6;
    d += ` C${f(cp1x)},${f(cp1y)} ${f(cp2x)},${f(cp2y)} ${f(c[0])},${f(c[1])}`;
  }
  return d + "Z";
}

function wobble(cx, cy, rx, ry, n, j) {
  const rot = (Math.random() - 0.5) * 0.3;
  return Array.from({ length: n }, (_, i) => {
    const angle = (i / n) * Math.PI * 2 + rot;
    const r = 1 + (Math.random() * 2 - 1) * j * (0.6 + Math.random() * 0.8);
    return [cx + Math.cos(angle) * rx * r, cy + Math.sin(angle) * ry * r];
  });
}

function attachCircle(el, delay) {
  // Évite de redessiner si déjà traité
  if (el.querySelector("svg")) return;

  const range = document.createRange();
  range.selectNodeContents(el);
  const tr = range.getBoundingClientRect();
  const er = el.getBoundingClientRect();

  const padX = 14,
    padY = 8;
  const W = tr.width + padX * 2,
    H = tr.height + padY * 2;
  const rx = (W / 2) * (0.95 + Math.random() * 0.05);
  const ry = (H / 2) * (0.88 + Math.random() * 0.1);
  const pts = wobble(W / 2, H / 2, rx, ry, 13 + Math.floor(Math.random() * 3), 0.052);
  const rot = (Math.random() - 0.5) * 10;

  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${f(W)} ${f(H)}`);
  svg.setAttribute("width", W);
  svg.setAttribute("height", H);
  svg.style.cssText = `left:${f(tr.left - er.left - padX)}px;top:${f(tr.top - er.top - padY)}px;width:${f(W)}px;height:${f(H)}px;transform:rotate(${f(rot)}deg);transform-origin:center center;`;

  const sp = document.createElementNS(svgNS, "path");
  sp.setAttribute("d", crPath(pts));
  sp.setAttribute("fill", "none");
  sp.setAttribute("stroke-width", "5.5");
  sp.setAttribute("filter", "url(#hl-gf)");
  sp.classList.add("sp");
  svg.appendChild(sp);
  el.appendChild(svg);

  requestAnimationFrame(() => {
    const len = sp.getTotalLength();
    sp.style.strokeDasharray = len;
    sp.style.strokeDashoffset = len;
    sp.style.animation = `hl-draw 0.8s cubic-bezier(.4,0,.2,1) ${delay}s forwards`;
  });
}

export function initCercles() {
  injectGrainFilter();
  document.fonts.ready.then(() => {
    requestAnimationFrame(() => {
      [...document.querySelectorAll(".hl")].forEach((el, i) =>
        attachCircle(el, 0.1 + i * 0.35)
      );
    });
  });
}
