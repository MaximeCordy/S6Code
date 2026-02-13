const DATA = {
  section1: {
    titre: "William Utermohlen",
    audio: { src: "audio/section1.mp3", label: "William, 1953" },
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
    audio: { src: "audio/section2.mp3", label: "Adolescence, 1955–57" },
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
    audio: { src: "audio/section3.mp3", label: "Londres, 1962" },
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
    audio: { src: "audio/section4.mp3", label: "Patricia, 1965" },
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
    audio: { src: "audio/section5.mp3", label: "Œuvres, 1950–70" },
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
let audioEl = null;

// Fonction de cleanup
function cleanupInfoPanel() {
  infoPanelListeners.forEach(({ element, event, handler }) => {
    element.removeEventListener(event, handler);
  });
  infoPanelListeners = [];

  if (scrollListener) {
    window.removeEventListener("scroll", scrollListener);
    scrollListener = null;
  }

  // Stop l'audio en cours
  if (audioEl) {
    audioEl.pause();
    audioEl.src = "";
    audioEl = null;
  }

  document.body.classList.remove("panel-open");
  const toggle = document.getElementById("info-toggle");
  if (toggle) toggle.textContent = "i";
}

// ── Player audio ──
function buildPlayer(audioData) {
  const player = document.getElementById("ip-player");
  if (!player) return;

  if (audioEl) {
    audioEl.pause();
    audioEl.src = "";
    audioEl = null;
  }

  if (!audioData) {
    player.innerHTML = "";
    return;
  }

  audioEl = new Audio(audioData.src);
  audioEl.preload = "metadata";

  const fmt = (t) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  player.innerHTML = `
    <div class="ip-player-label">${audioData.label}</div>
    <div class="ip-player-controls">
      <button class="ip-play-btn" aria-label="Play">▶</button>
      <div class="ip-progress-wrap">
        <div class="ip-progress-bar"><div class="ip-progress-fill"></div></div>
        <div class="ip-time"><span class="ip-current">0:00</span> / <span class="ip-duration">—</span></div>
      </div>
    </div>
  `;

  const playBtn = player.querySelector(".ip-play-btn");
  const fill = player.querySelector(".ip-progress-fill");
  const current = player.querySelector(".ip-current");
  const duration = player.querySelector(".ip-duration");
  const bar = player.querySelector(".ip-progress-bar");

  audioEl.addEventListener("loadedmetadata", () => {
    duration.textContent = fmt(audioEl.duration);
  });

  audioEl.addEventListener("timeupdate", () => {
    const pct = (audioEl.currentTime / audioEl.duration) * 100 || 0;
    fill.style.width = pct + "%";
    current.textContent = fmt(audioEl.currentTime);
  });

  audioEl.addEventListener("ended", () => {
    playBtn.textContent = "▶";
    fill.style.width = "0%";
  });

  playBtn.addEventListener("click", () => {
    if (audioEl.paused) {
      audioEl.play();
      playBtn.textContent = "⏸";
    } else {
      audioEl.pause();
      playBtn.textContent = "▶";
    }
  });

  bar.addEventListener("click", (e) => {
    const rect = bar.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audioEl.currentTime = pct * audioEl.duration;
  });
}

export function initInfoPanel() {
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
  infoPanelListeners.push({
    element: toggle,
    event: "click",
    handler: toggleHandler,
  });

  // ── Clic sur le backdrop = fermer ──
  const backdrop = document.querySelector(".panel-backdrop");
  if (backdrop) {
    const backdropHandler = () => {
      document.body.classList.remove("panel-open");
      toggle.textContent = "i";
    };
    backdrop.addEventListener("click", backdropHandler);
    infoPanelListeners.push({
      element: backdrop,
      event: "click",
      handler: backdropHandler,
    });
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
  infoPanelListeners.push({
    element: document,
    event: "mouseover",
    handler: mouseoverHandler,
  });

  const mouseoutHandler = (e) => {
    const img = e.target.closest("img[data-artwork]");
    if (!img) return;
    img.style.outline = "";
    highlightCard(-1);
  };
  document.addEventListener("mouseout", mouseoutHandler);
  infoPanelListeners.push({
    element: document,
    event: "mouseout",
    handler: mouseoutHandler,
  });

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
  infoPanelListeners.push({
    element: ipBody,
    event: "mouseover",
    handler: cardMouseoverHandler,
  });

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
  infoPanelListeners.push({
    element: ipBody,
    event: "mouseout",
    handler: cardMouseoutHandler,
  });

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
  infoPanelListeners.push({
    element: document,
    event: "click",
    handler: clickHandler,
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
              </div>`,
              )
              .join("")}
          </div>`,
        )
        .join("");
      buildPlayer(d.audio || null);
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
