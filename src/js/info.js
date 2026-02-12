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
          { cle: "Technique", valeur: "Huile et photographie sur toile" },
          { cle: "Sujet", valeur: "La mère de William" },
        ],
      },
      {
        titre: "The artist's father",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1970" },
          { cle: "Technique", valeur: "Huile sur toile" },
          { cle: "Sujet", valeur: "Le père de William" },
        ],
      },
    ],
  },
  section4: {
    titre: "Patricia Redmond",
    oeuvres: [
      {
        titre: "Patricia",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1962" },
          { cle: "Technique", valeur: "Huile sur toile" },
          { cle: "Sujet", valeur: "Patricia Redmond" },
        ],
      },
    ],
  },
  section5: {
    titre: "1950-1970",
    oeuvres: [
      {
        titre: "Demeter",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1969" },
          { cle: "Technique", valeur: "Huile sur toile" },
          { cle: "Sujet", valeur: "Femme sur canapé" },
        ],
      },
      {
        titre: "Monstera Dekiciosa",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1967" },
          { cle: "Technique", valeur: "Huile sur toile" },
          { cle: "Sujet", valeur: "trois hommes" },
        ],
      },
      {
        titre: "Rosamund",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1982" },
          { cle: "Technique", valeur: "Huile sur toile" },
          { cle: "Sujet", valeur: "Rosamund" },
        ],
      },
      {
        titre: "Staghorn Fern",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1967" },
          { cle: "Technique", valeur: "Huile sur toile" },
          { cle: "Sujet", valeur: "un homme est une femme" },
        ],
      },
      {
        titre: "The Green Chair",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1968" },
          { cle: "Technique", valeur: "Huile sur toile" },
          { cle: "Sujet", valeur: "un homme est une chaise" },
        ],
      },
      {
        titre: "Woman at piano",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1971" },
          { cle: "Technique", valeur: "Huile sur toile" },
          { cle: "Sujet", valeur: "une femme assise à un piano" },
        ],
      },
    ],
  },
};

// ─── NE PAS MODIFIER EN DESSOUS ────────────────

// Variables globales pour le cleanup
let infoPanelListeners = [];
let scrollListener = null;

// Fonction de cleanup
function cleanupInfoPanel() {
  // Retirer tous les listeners stockés
  infoPanelListeners.forEach(({ element, event, handler }) => {
    element.removeEventListener(event, handler);
  });
  infoPanelListeners = [];

  // Retirer le scroll listener
  if (scrollListener) {
    window.removeEventListener("scroll", scrollListener);
    scrollListener = null;
  }

  // Reset des classes
  document.body.classList.remove("panel-open");
  const toggle = document.getElementById("info-toggle");
  if (toggle) toggle.textContent = "i";
}

export function initInfoPanel() {
  // Cleanup avant de réinitialiser
  cleanupInfoPanel();

  const toggle = document.getElementById("info-toggle");
  const ipTitle = document.getElementById("ip-title");
  const ipBody = document.getElementById("ip-body");

  if (!toggle || !ipTitle || !ipBody) return;

  const fadeEls = [ipTitle.closest(".ip-head"), ipBody];
  const sections = [...document.querySelectorAll("section[data-section]")];
  let currentSection = null;

  // ── Toggle panneau ──
  const toggleHandler = () => {
    document.body.classList.toggle("panel-open");
    toggle.textContent = document.body.classList.contains("panel-open")
      ? "✕"
      : "i";
  };
  toggle.addEventListener("click", toggleHandler);
  infoPanelListeners.push({ element: toggle, event: "click", handler: toggleHandler });

  // ── Clic sur le backdrop = fermer ──
  const backdrop = document.querySelector(".panel-backdrop");
  if (backdrop) {
    const backdropHandler = () => {
      document.body.classList.remove("panel-open");
      toggle.textContent = "i";
    };
    backdrop.addEventListener("click", backdropHandler);
    infoPanelListeners.push({ element: backdrop, event: "click", handler: backdropHandler });
  }

  // ── Surligne la carte ──
  function highlightCard(index) {
    ipBody.querySelectorAll(".ip-card").forEach((c, i) => {
      c.classList.toggle("active", i === index);
    });
  }

  // ── Helper : image dans la section active ──
  function getImgInActiveSection(index) {
    const activeSection = document.querySelector(
      `section[data-section="${currentSection}"]`,
    );
    if (!activeSection) return null;
    return activeSection.querySelector(`img[data-artwork="${index}"]`);
  }

  // ── Hover sur image = outline + surlignage carte ──
  const mouseoverHandler = (e) => {
    const img = e.target.closest("img[data-artwork]");
    if (!img) return;
    img.style.outline = "3px solid #111";
    highlightCard(parseInt(img.dataset.artwork));
  };
  document.addEventListener("mouseover", mouseoverHandler);
  infoPanelListeners.push({ element: document, event: "mouseover", handler: mouseoverHandler });

  const mouseoutHandler = (e) => {
    const img = e.target.closest("img[data-artwork]");
    if (!img) return;
    img.style.outline = "";
    highlightCard(-1);
  };
  document.addEventListener("mouseout", mouseoutHandler);
  infoPanelListeners.push({ element: document, event: "mouseout", handler: mouseoutHandler });

  // ── Hover sur carte = effet sur l'image liée dans la section active ──
  const cardMouseoverHandler = (e) => {
    const card = e.target.closest(".ip-card");
    if (!card) return;
    const index = parseInt(card.dataset.card);
    const img = getImgInActiveSection(index);
    if (img) {
      img.style.outline = "3px solid #111";
      img.style.transform = "scale(1.08)";
    }
    highlightCard(index);
  };
  ipBody.addEventListener("mouseover", cardMouseoverHandler);
  infoPanelListeners.push({ element: ipBody, event: "mouseover", handler: cardMouseoverHandler });

  const cardMouseoutHandler = (e) => {
    const card = e.target.closest(".ip-card");
    if (!card) return;
    const index = parseInt(card.dataset.card);
    const img = getImgInActiveSection(index);
    if (img) {
      img.style.outline = "";
      img.style.transform = "";
    }
    highlightCard(-1);
  };
  ipBody.addEventListener("mouseout", cardMouseoutHandler);
  infoPanelListeners.push({ element: ipBody, event: "mouseout", handler: cardMouseoutHandler });

  // ── Clic sur image = ouvre le panneau ──
  const clickHandler = (e) => {
    const img = e.target.closest("img[data-artwork]");
    if (!img) return;
    document.body.classList.add("panel-open");
    toggle.textContent = "✕";
    setTimeout(() => {
      highlightCard(parseInt(img.dataset.artwork));
    }, 100);
  };
  document.addEventListener("click", clickHandler);
  infoPanelListeners.push({ element: document, event: "click", handler: clickHandler });

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
              </div>`,
              )
              .join("")}
          </div>`,
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
        rect.top + rect.height / 2 - window.innerHeight / 2,
      );
      if (dist < closest) {
        closest = dist;
        active = s;
      }
    }
    return active;
  }

  scrollListener = () => {
    const active = getActiveSection();
    if (active) updatePanel(active.dataset.section);
  };
  window.addEventListener("scroll", scrollListener, { passive: true });

  const init = getActiveSection();
  if (init) updatePanel(init.dataset.section);
}

// Auto-init au premier chargement
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initInfoPanel);
} else {
  initInfoPanel();
}
