import { initInfoPanel } from "./info.js"; // ← ajouter
const DATA = {
  section1: {
    titre: "William Utermohlen",
    oeuvres: [
      {
        titre: "Autoportrait",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1953" },
          { cle: "Technique", valeur: "Huile sur toile" },
          { cle: "Sujet", valeur: "William" },
        ],
      },
    ],
  },

  section2: {
    titre: "Adolessence",
    oeuvres: [
      {
        titre: "Autoportrait",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1955" },
          { cle: "Technique", valeur: "Fusain sur papier" },
          { cle: "Sujet", valeur: "William" },
        ],
      },
      {
        titre: "Autoportrait",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1957" },
          { cle: "Technique", valeur: "Huile sur toile" },
          { cle: "Sujet", valeur: "William" },
        ],
      },
      {
        titre: "Autoportrait",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1955" },
          { cle: "Technique", valeur: "Crayon sur papier" },
          { cle: "Sujet", valeur: "William" },
        ],
      },
      {
        titre: "Autoportrait",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1955" },
          { cle: "Technique", valeur: "Huile sur toile" },
          { cle: "Sujet", valeur: "William" },
        ],
      },
    ],
  },

  section3: {
    titre: "Londre et l'Europe",
    oeuvres: [
      {
        titre: "The artist's mother",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1970" },
          { cle: "Technique", valeur: "oil and photography on canvas" },
          { cle: "Sujet", valeur: "La mère de William" },
        ],
      },
      {
        titre: "The artist's father",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1970" },
          { cle: "Technique", valeur: "oil on canvas" },
          { cle: "Sujet", valeur: "Le père de William" },
        ],
      },
    ],
  },
};

// ─── NE PAS MODIFIER EN DESSOUS ────────────────

export function initInfoPanel() {
  const toggle = document.getElementById("info-toggle");
  const ipTitle = document.getElementById("ip-title");
  const ipBody = document.getElementById("ip-body");
  const fadeEls = [ipTitle.closest(".ip-head"), ipBody];
  const sections = [...document.querySelectorAll("section[data-section]")];
  let currentSection = null;

  // ── Toggle panneau ──
  toggle.addEventListener("click", () => {
    document.body.classList.toggle("panel-open");
    toggle.textContent = document.body.classList.contains("panel-open")
      ? "✕"
      : "i";
  });

  // ── Surligne la carte ──
  function highlightCard(index) {
    ipBody.querySelectorAll(".ip-card").forEach((c, i) => {
      c.classList.toggle("active", i === index);
    });
  }

  // ── Hover : outline + surlignage carte ──
  document.addEventListener("mouseover", (e) => {
    const img = e.target.closest("img[data-artwork]");
    if (!img) return;
    img.style.outline = "3px solid #111";
    highlightCard(parseInt(img.dataset.artwork));
  });

  document.addEventListener("mouseout", (e) => {
    const img = e.target.closest("img[data-artwork]");
    if (!img) return;
    img.style.outline = "";
    highlightCard(-1);
  });

  // ── Mise à jour du contenu ──
  function updatePanel(key) {
    if (key === currentSection) return;
    currentSection = key;
    const d = DATA[key];
    if (!d) return;
    fadeEls.forEach((el) => el.classList.add("fading"));
    setTimeout(() => {
      ipTitle.textContent = d.titre;
      ipBody.innerHTML = d.oeuvres
        .map(
          (o, idx) => `
          <div class="ip-card" data-card="${idx}">
            <div class="ip-card-title">${o.titre}</div>
            <div class="ip-card-artist">${o.artiste}</div>
            ${o.infos
              .map(
                (r) => `
              <div class="ip-row">
                <span class="ip-key">${r.cle}</span>
                <span class="ip-val">${r.valeur}</span>
              </div>`
              )
              .join("")}
          </div>`
        )
        .join("");
      fadeEls.forEach((el) => el.classList.remove("fading"));
    }, 220);
  }

  // ── Détection section active (compatible GSAP pinned) ──
  function getActiveSection() {
    let active = sections[0];
    let closest = Infinity;
    for (const s of sections) {
      const rect = s.getBoundingClientRect();
      const dist = Math.abs(
        rect.top + rect.height / 2 - window.innerHeight / 2
      );
      if (dist < closest) {
        closest = dist;
        active = s;
      }
    }
    return active;
  }

  window.addEventListener(
    "scroll",
    () => {
      const active = getActiveSection();
      if (active) updatePanel(active.dataset.section);
    },
    { passive: true }
  );

  const init = getActiveSection();
  if (init) updatePanel(init.dataset.section);
}
initInfoPanel(); // ← ajouter, juste avant vos autres init
