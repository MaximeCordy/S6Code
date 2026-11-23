import { t } from "./i18n.js";

// ============================================================
// INFO — ŒUVRES PAR SECTION
// ============================================================

const DATA = {
  section1: {
    titre: "William Utermohlen",
    audio: { src: "audio/Interview_part_1.mp3", label: "William, 1953" },
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
  section6: {
    titre: "1964-1966",
    audio: { src: "audio/section6.mp3", label: "DANTE, 1964-1966" },
    oeuvres: [
      {
        titre: "Canto XXI - An Elder of Santa Zita",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1965" },
          { cle: "Technique", valeur: "Huile sur toile" },
          { cle: "Sujet", valeur: "homme et cadavre mécanique" },
        ],
      },
      {
        titre: "Canto XXIV - The Dust Again",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1965" },
          { cle: "Technique", valeur: "Huile sur toile" },
          { cle: "Sujet", valeur: "homme et serpent" },
        ],
      },
      {
        titre: "Canto XXVII - Guido da Montefeltro",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1965" },
          { cle: "Technique", valeur: "Huile sur toile" },
          { cle: "Sujet", valeur: "flamme et visages" },
        ],
      },
      {
        titre: "Canto XXII - Sometimes With Trumpets Sometimes With Bells",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1966" },
          { cle: "Technique", valeur: "Huile sur toile" },
          { cle: "Sujet", valeur: "compisition humaine et musical" },
        ],
      },
      {
        titre: "Canto XIV - Sterile Bed",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1966" },
          { cle: "Technique", valeur: "Huile sur toile" },
          { cle: "Sujet", valeur: "un homme est femme nues sur lit" },
        ],
      },
      {
        titre:
          "Canto XXVIII - The Schizmatics (An Eye for An Eye for All Eternity)",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1966" },
          { cle: "Technique", valeur: "Huile sur toile" },
          { cle: "Sujet", valeur: "4 corps" },
        ],
      },
    ],
  },
  section8: {
    titre: "Mummers Cycle — Œuvres",
    audio: { src: "audio/section7.mp3", label: "Mummers, 1969–1970" },
    oeuvres: [
      {
        titre: "Rainbow Around My Shoulder",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1969" },
          { cle: "Technique", valeur: "Huile sur toile" },
          { cle: "Sujet", valeur: "Mummer au chapeau" },
        ],
      },
      {
        titre: "Red Tears",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1969" },
          { cle: "Technique", valeur: "Huile sur toile" },
          { cle: "Sujet", valeur: "Clown aux larmes rouges" },
        ],
      },
      {
        titre: "An Old Man",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1970" },
          { cle: "Technique", valeur: "Huile sur toile" },
          { cle: "Sujet", valeur: "Portrait d'un vieil homme" },
        ],
      },
    ],
  },
  section7: {
    titre: "Mummers Cycle",
    audio: { src: "audio/section7.mp3", label: "Mummers, 1969–1970" },
    oeuvres: [
      {
        titre: "Happy New Year",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1969" },
          { cle: "Technique", valeur: "Huile sur toile" },
          { cle: "Sujet", valeur: "Fête du Nouvel An" },
        ],
      },
      {
        titre: "Uncle Sam's Clowns",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1969" },
          { cle: "Technique", valeur: "Huile sur toile" },
          { cle: "Sujet", valeur: "Clowns américains" },
        ],
      },
      {
        titre: "New Year's Day Morning",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1970" },
          { cle: "Technique", valeur: "Huile sur toile" },
          { cle: "Sujet", valeur: "Matin du Jour de l'An" },
        ],
      },
      {
        titre: "Double Portrait",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1969" },
          { cle: "Technique", valeur: "Huile sur toile" },
          { cle: "Sujet", valeur: "Double portrait" },
        ],
      },
      {
        titre: "Three Clowns",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1969" },
          { cle: "Technique", valeur: "Huile sur toile" },
          { cle: "Sujet", valeur: "Trois clowns" },
        ],
      },
      {
        titre: "Silver",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1970" },
          { cle: "Technique", valeur: "Huile sur toile" },
          { cle: "Sujet", valeur: "Composition argentée" },
        ],
      },
    ],
  },
  section9: {
    titre: "Conversation",
    audio: { src: "audio/section7.mp3", label: "Conversation, 1989–1991" },
    oeuvres: [
      {
        titre: "Bed",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1991" },
          { cle: "Technique", valeur: "Huile sur toile" },
          { cle: "Sujet", valeur: "William et Patricia dans le lit." },
        ],
      },
      {
        titre: "Conversation",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1991" },
          { cle: "Technique", valeur: "Huile sur toile" },
          { cle: "Sujet", valeur: "Un ami et Patricia" },
        ],
      },
      {
        titre: "Maida Vale",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1990" },
          { cle: "Technique", valeur: "Huile sur toile" },
          { cle: "Sujet", valeur: "Patricia et une amie" },
        ],
      },
      {
        titre: "Night",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1990-1991" },
          { cle: "Technique", valeur: "Huile sur toile" },
          { cle: "Sujet", valeur: "The de nuit entre amis" },
        ],
      },
      {
        titre: "Snow",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1990" },
          { cle: "Technique", valeur: "Huile sur toile" },
          { cle: "Sujet", valeur: "Repas dans une maison enneigée" },
        ],
      },
      {
        titre: "W9",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1991" },
          { cle: "Technique", valeur: "Huile sur toile" },
          { cle: "Sujet", valeur: "Patricia et une amie" },
        ],
      },
    ],
  },
  section10: {
    titre: "Conversation",
    audio: { src: "audio/section10.mp3", label: "Conversation, 1989–1991" },
    oeuvres: [
      {
        titre: "Maida Vale",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1990" },
          { cle: "Technique", valeur: "Huile sur toile" },
          { cle: "Sujet", valeur: "Patricia et une amie" },
        ],
      },
      {
        titre: "Night",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1990-1991" },
          { cle: "Technique", valeur: "Huile sur toile" },
          { cle: "Sujet", valeur: "The de nuit entre amis" },
        ],
      },
      {
        titre: "W9",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1991" },
          { cle: "Technique", valeur: "Huile sur toile" },
          { cle: "Sujet", valeur: "Patricia et une amie" },
        ],
      },
      {
        titre: "Conversation",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1991" },
          { cle: "Technique", valeur: "Huile sur toile" },
          { cle: "Sujet", valeur: "Un ami et Patricia" },
        ],
      },

      {
        titre: "Snow",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1990" },
          { cle: "Technique", valeur: "Huile sur toile" },
          { cle: "Sujet", valeur: "Repas dans une maison enneigée" },
        ],
      },
      {
        titre: "Bed",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1991" },
          { cle: "Technique", valeur: "Huile sur toile" },
          { cle: "Sujet", valeur: "William et Patricia dans le lit." },
        ],
      },
    ],
  },
  section11: {
    titre: "Maladie",
    audio: { src: "audio/section11.mp3", label: "Maladie, 1994–1996" },
    oeuvres: [
      {
        titre: "Mask (black marks)",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1996" },
          { cle: "Technique", valeur: "Aquarel sur papier" },
          { cle: "Sujet", valeur: "Masque de Mummuers" },
        ],
      },
      {
        titre: "NightImaginary Portrait of Francis Bacon",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1994" },
          { cle: "Technique", valeur: "Aquarel sur papier" },
          { cle: "Sujet", valeur: "Francis Bacon" },
        ],
      },
      {
        titre: "Mask (red spots) ",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1996" },
          { cle: "Technique", valeur: "Aquarel sur papier" },
          { cle: "Sujet", valeur: "Masque de Mummuers" },
        ],
      },
      {
        titre: "Mask (with necklace)",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1996" },
          { cle: "Technique", valeur: "Aquarel sur papier" },
          { cle: "Sujet", valeur: "Masque de Mummers" },
        ],
      },

      {
        titre: "Untitled (mask)",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1992" },
          { cle: "Technique", valeur: "Aquarel sur papier" },
          { cle: "Sujet", valeur: "Masque de Mummers" },
        ],
      },
      {
        titre: "Black Stripes (Pat)",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1994" },
          { cle: "Technique", valeur: "Aquarel sur papier" },
          { cle: "Sujet", valeur: "Patricia" },
        ],
      },
    ],
  },

  section12: {
    titre: "Alzheimer",
    audio: { src: "audio/section12.mp3", label: "Diagnostic, 1995" },
    oeuvres: [],
  },

  section13: {
    titre: "Blue Skies",
    audio: { src: "audio/section13.mp3", label: "Blue Skies, 1995" },
    oeuvres: [],
  },

  section14: {
    titre: "Blue Skies",
    audio: { src: "audio/section14.mp3", label: "Blue Skies, 1995" },
    oeuvres: [
      {
        titre: "Blue Skies",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1995" },
          { cle: "Technique", valeur: "Huile sur toile" },
          { cle: "Sujet", valeur: "William agrippée à une table" },
        ],
      },
    ],
  },

  section15: {
    titre: "Patricia",
    audio: { src: "audio/section15.mp3", label: "Patricia, 1994" },
    oeuvres: [
      {
        titre: "Pat (portrait)",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1994" },
          { cle: "Technique", valeur: "Huile sur toile" },
          { cle: "Sujet", valeur: "Patricia Utermohlen" },
        ],
      },
    ],
  },

  section16: {
    titre: "Autoportraits",
    audio: null,
    oeuvres: [
      {
        titre: "Self portrait",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1995" },
          { cle: "Technique", valeur: "crayon sur papier" },
        ],
      },
      {
        titre: "Desperate figure",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1995" },
          { cle: "Technique", valeur: "crayon sur papier" },
        ],
      },
      {
        titre: "Self Portrait (scowling)",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1996" },
          { cle: "Technique", valeur: "crayon sur papier" },
        ],
      },
      {
        titre: "Self Portrait with Red Shirt,",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1996" },
          { cle: "Technique", valeur: "mixed media on paper" },
        ],
      },
      {
        titre: "Self Portrait (Red)",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1996" },
          { cle: "Technique", valeur: "mixed media on paper" },
        ],
      },
      {
        titre: "Self Portrait (Sad)",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1996" },
          { cle: "Technique", valeur: "crayon sur papier" },
        ],
      },
      {
        titre: "Self Portrait (with Easel Yellow and Green)",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1996" },
          { cle: "Technique", valeur: "Huile et crayon sur papier" },
        ],
      },
      {
        titre: "Self Portrait (three-quarter)",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1996" },
          { cle: "Technique", valeur: "crayon sur papier" },
        ],
      },
      {
        titre: "Self Portrait",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1996" },
          { cle: "Technique", valeur: "crayon sur papier" },
        ],
      },
      {
        titre: "Double Self Portrait",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1996" },
          { cle: "Technique", valeur: "crayon sur papier" },
        ],
      },
      {
        titre: "Self Portrait (in the Studio)",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1996" },
          { cle: "Technique", valeur: "mixed techniques" },
        ],
      },
      {
        titre: "Self Portrait (yellow)",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1997" },
          { cle: "Technique", valeur: "Huile sur toile" },
        ],
      },
      {
        titre: "Self Portrait (Green)",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1997" },
          { cle: "Technique", valeur: "Huile sur toile" },
        ],
      },
      {
        titre: "Self Portrait (with Saw)",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1997" },
          { cle: "Technique", valeur: "Huile sur toile" },
        ],
      },
      {
        titre: "Self Portrait (2 Skulls)",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1998" },
          { cle: "Technique", valeur: "charbon sur papier" },
        ],
      },
      {
        titre: "Self Portrait (shut eye)",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1998" },
          { cle: "Technique", valeur: "crayon sur papier" },
        ],
      },
      {
        titre: "Self Portrait (with Easel)",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1998" },
          { cle: "Technique", valeur: "Huile sur toile" },
        ],
      },
      {
        titre: "Erased Self Portrait",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "1999" },
          { cle: "Technique", valeur: "Huile sur toile" },
        ],
      },
      {
        titre: "Head I ",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "2001" },
          { cle: "Technique", valeur: "crayon sur papier" },
        ],
      },
      {
        titre: "Head",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "2001" },
          { cle: "Technique", valeur: "crayon sur papier" },
        ],
      },
      {
        titre: "Head (with coffee stain)",
        artiste: "William Utermohlen",
        infos: [
          { cle: "Date", valeur: "2001" },
          { cle: "Technique", valeur: "crayon sur papier" },
        ],
      },
    ],
  },

  section17: {
    titre: "William Utermohlen",
    audio: null,
    oeuvres: [],
  },
};

// ============================================================
// INFO - AUDIO - AUDIO PAR SECTIONS
// ============================================================

const PAGE_AUDIO = {
  index: {
    src: new URL("../audio/Interview_part_1.mp3", import.meta.url).href,
    label: "William, 1933–2007",
  },
  dante: {
    src: new URL("../audio/Interview_part_2_dante.mp3", import.meta.url).href,
    label: "Dante, 1964–1966",
  },
  conversation: {
    src: new URL("../audio/Interview_part_4_conversation.mp3", import.meta.url)
      .href,
    label: "Conversation, 1989–1991",
  },
  maladie: {
    src: new URL("../audio/Interview_part_7_maladie_end.mp3", import.meta.url)
      .href,
    label: "Maladie, 1994–1996",
  },
  autoportrait: {
    src: new URL("../audio/Interview_part_9_autoportrait.mp3", import.meta.url)
      .href,
    label: "Autoportrait",
  },
};

// ============================================================
// INFO - HELPERS INFO ET AUDIO
// ============================================================

function setBtnText(btn, text) {
  const span = btn.querySelector("span");
  if (span) span.textContent = text;
  else btn.textContent = text;
}

function fmtTime(s) {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

// ============================================================
// INFO - VARIABLES GLOBALES
// ============================================================

let infoPanelListeners = [];
let scrollListener = null;
let audioEl = null;
let audioPopup = null;
let audioRAF = null;
let currentAudioLabel = "";

// ============================================================
// INFO - POPUP AUDIO
// ============================================================

function getOrCreatePopup() {
  if (audioPopup) return audioPopup;

  const popup = document.createElement("div");
  popup.id = "audio-popup";
  popup.className = "audio-popup";
  popup.innerHTML = `
    <div class="ap-drag" id="ap-drag">
      <span class="ap-label" id="ap-label">—</span>
      <button class="ap-close" id="ap-close">✕</button>
    </div>
    <div class="ap-controls">
      <button class="ap-play" id="ap-play">▶</button>
      <div class="ap-progress" id="ap-progress">
        <div class="ap-fill" id="ap-fill"></div>
      </div>
      <span class="ap-time" id="ap-time">0:00 / 0:00</span>
    </div>
  `;
  document.body.appendChild(popup);
  audioPopup = popup;

  // ============================================================
  // INFO - POPUP AUDIO - DRAG
  // ============================================================
  const drag = popup.querySelector("#ap-drag");
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  function startDrag(clientX, clientY) {
    isDragging = true;
    const rect = popup.getBoundingClientRect();
    offsetX = clientX - rect.left;
    offsetY = clientY - rect.top;
    popup.style.transition = "none";
    popup.style.bottom = "auto";
    popup.style.right = "auto";
    popup.style.left = rect.left + "px";
    popup.style.top = rect.top + "px";
    popup.classList.add("dragged");
  }

  function moveDrag(clientX, clientY) {
    if (!isDragging) return;
    let x = clientX - offsetX;
    let y = clientY - offsetY;
    x = Math.max(0, Math.min(x, window.innerWidth - popup.offsetWidth));
    y = Math.max(0, Math.min(y, window.innerHeight - popup.offsetHeight));
    popup.style.left = x + "px";
    popup.style.top = y + "px";
  }

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    popup.style.transition = "";
  }

  drag.addEventListener("mousedown", (e) => startDrag(e.clientX, e.clientY));
  document.addEventListener("mousemove", (e) => moveDrag(e.clientX, e.clientY));
  document.addEventListener("mouseup", endDrag);

  drag.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    startDrag(t.clientX, t.clientY);
  });
  document.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    moveDrag(t.clientX, t.clientY);
  });
  document.addEventListener("touchend", endDrag);

  // ============================================================
  // INFO - POPUP AUDIO - PLAY/PAUSE
  // ============================================================
  popup.querySelector("#ap-play").addEventListener("click", () => {
    if (!audioEl) return;
    if (audioEl.paused) audioEl.play();
    else audioEl.pause();
  });

  // ============================================================
  // INFO - POPUP AUDIO - RECHERCHE DE L'AUDIO
  // ============================================================
  popup.querySelector("#ap-progress").addEventListener("click", (e) => {
    if (!audioEl || !audioEl.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audioEl.currentTime = pct * audioEl.duration;
  });

  // ============================================================
  // INFO - POPUP AUDIO - OUVRIR/FERMER
  // ============================================================
  popup.querySelector("#ap-close").addEventListener("click", () => {
    if (audioEl) {
      audioEl.pause();
    }
    hidePopup();
  });

  return popup;
}

function showPopup() {
  const popup = getOrCreatePopup();
  popup.classList.add("visible");
}

function hidePopup() {
  if (audioPopup) {
    audioPopup.classList.remove("visible");
    audioPopup.classList.remove("dragged");
    audioPopup.style.top = "";
    audioPopup.style.left = "";
    audioPopup.style.right = "";
    audioPopup.style.bottom = "";
    audioPopup.style.transition = "";
  }
  if (audioRAF) {
    cancelAnimationFrame(audioRAF);
    audioRAF = null;
  }
  const btn = document.getElementById("audio-toggle");
  if (btn) {
    btn.classList.remove("playing");
    setBtnText(btn, "♪");
  }
}

// ============================================================
// INFO - POPUP AUDIO — PROGRESSION & ÉTAT PLAY
// ============================================================

function updatePopupProgress() {
  if (!audioEl || !audioPopup) return;
  const fill = audioPopup.querySelector("#ap-fill");
  const time = audioPopup.querySelector("#ap-time");
  if (audioEl.duration && !isNaN(audioEl.duration)) {
    const pct = (audioEl.currentTime / audioEl.duration) * 100;
    if (fill) fill.style.width = pct + "%";
    if (time)
      time.textContent = `${fmtTime(audioEl.currentTime)} / ${fmtTime(audioEl.duration)}`;
  }
  audioRAF = requestAnimationFrame(updatePopupProgress);
}

function syncPopupPlayState(playing) {
  if (!audioPopup) return;
  const playBtn = audioPopup.querySelector("#ap-play");
  if (playBtn) playBtn.textContent = playing ? "⏸" : "▶";
  const btn = document.getElementById("audio-toggle");
  if (btn) {
    btn.classList.toggle("playing", playing);
    setBtnText(btn, playing ? "⏸" : "♪");
  }
}

// ============================================================
// BOUTON AUDIO EXTERNE — SETUP
// ============================================================

function setupAudioButton(audioData) {
  const btn = document.getElementById("audio-toggle");
  if (!btn) return;

  if (audioRAF) {
    cancelAnimationFrame(audioRAF);
    audioRAF = null;
  }

  if (audioEl) {
    audioEl.pause();
    audioEl.src = "";
    audioEl = null;
  }

  if (!audioData) {
    btn.classList.add("hidden");
    btn.classList.remove("playing");
    hidePopup();
    return;
  }

  currentAudioLabel = t(audioData.label || "Audio");
  audioEl = new Audio(audioData.src);
  audioEl.preload = "metadata";
  btn.classList.remove("hidden");
  btn.classList.remove("playing");
  setBtnText(btn, "♪");

  if (audioPopup) {
    const label = audioPopup.querySelector("#ap-label");
    if (label) label.textContent = currentAudioLabel;
    const fill = audioPopup.querySelector("#ap-fill");
    if (fill) fill.style.width = "0%";
    const time = audioPopup.querySelector("#ap-time");
    if (time) time.textContent = "0:00 / 0:00";
  }

  audioEl.addEventListener("play", () => {
    syncPopupPlayState(true);
    updatePopupProgress();
  });

  audioEl.addEventListener("pause", () => {
    syncPopupPlayState(false);
    if (audioRAF) {
      cancelAnimationFrame(audioRAF);
      audioRAF = null;
    }
  });

  audioEl.addEventListener("ended", () => {
    syncPopupPlayState(false);
    if (audioPopup) {
      const fill = audioPopup.querySelector("#ap-fill");
      if (fill) fill.style.width = "0%";
    }
    if (audioRAF) {
      cancelAnimationFrame(audioRAF);
      audioRAF = null;
    }
  });
}

// ============================================================
// INFO - POPUP AUDIO — CLEANUP — RESET COMPLET DU PANNEAU
// ============================================================

function cleanupInfoPanel() {
  infoPanelListeners.forEach(({ element, event, handler }) => {
    element.removeEventListener(event, handler);
  });
  infoPanelListeners = [];

  if (scrollListener) {
    window.removeEventListener("scroll", scrollListener);
    scrollListener = null;
  }

  if (audioRAF) {
    cancelAnimationFrame(audioRAF);
    audioRAF = null;
  }
  if (audioEl) {
    audioEl.pause();
    audioEl.src = "";
    audioEl = null;
  }

  hidePopup();

  document.body.classList.remove("panel-open");
  const toggle = document.getElementById("info-toggle");
  if (toggle) setBtnText(toggle, "i");

  const audioBtn = document.getElementById("audio-toggle");
  if (audioBtn) {
    audioBtn.classList.add("hidden");
    audioBtn.classList.remove("playing");
    setBtnText(audioBtn, "♪");
  }
}

// ============================================================
// INFO - INIT PANNEAU INFO (export principal)
// ============================================================

export function initInfoPanel() {
  cleanupInfoPanel();

  const toggle = document.getElementById("info-toggle");
  const ipTitle = document.getElementById("ip-title");
  const ipBody = document.getElementById("ip-body");

  if (!toggle || !ipTitle || !ipBody) return;

  ipBody.setAttribute("data-lenis-prevent", "");

  const fadeEls = [ipTitle.closest(".ip-head"), ipBody];
  const sections = [...document.querySelectorAll("section[data-section]")];
  let currentSection = null;

  const namespace =
    document.querySelector("[data-barba-namespace]")?.dataset.barbaNamespace ||
    "";
  setupAudioButton(PAGE_AUDIO[namespace] || null);

  // ============================================================
  // INFO - POPUP AUDIO — TOGGLE
  // ============================================================

  const audioBtn = document.getElementById("audio-toggle");
  if (audioBtn) {
    const audioHandler = () => {
      if (!audioEl) return;
      const popup = getOrCreatePopup();
      const label = popup.querySelector("#ap-label");
      if (label) label.textContent = currentAudioLabel;

      if (popup.classList.contains("visible")) {
        audioEl.pause();
        hidePopup();
      } else {
        showPopup();
        audioEl.play().catch(() => {});
      }
    };
    audioBtn.addEventListener("click", audioHandler);
    infoPanelListeners.push({
      element: audioBtn,
      event: "click",
      handler: audioHandler,
    });
  }

  // ============================================================
  // INFO — TOGGLE
  // ============================================================

  const toggleHandler = () => {
    document.body.classList.toggle("panel-open");
    if (!document.body.classList.contains("panel-open")) {
      selectedIndex = -1;
      document.querySelectorAll(".ip-card.active").forEach((c) => c.classList.remove("active"));
    }
    setBtnText(
      toggle,
      document.body.classList.contains("panel-open") ? "✕" : "i",
    );
  };
  toggle.addEventListener("click", toggleHandler);
  infoPanelListeners.push({
    element: toggle,
    event: "click",
    handler: toggleHandler,
  });

  // ============================================================
  // INFO - BACKDROP = FERMER
  // ============================================================

  const backdrop = document.querySelector(".panel-backdrop");
  if (backdrop) {
    const backdropHandler = () => {
      selectedIndex = -1;
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
  // ============================================================
  // INFO - TÉLÉPHONE : GLISSER LE VOLET VERS LE BAS POUR LE FERMER
  // Actif quand le contenu est tout en haut (scrollTop 0) ou depuis l'en-tête ;
  // sinon le doigt fait défiler la liste normalement.
  // ============================================================
  const sheet = document.getElementById("info-panel");
  const ipHead = sheet && sheet.querySelector(".ip-head");
  if (sheet) {
    let startY = 0;
    let dy = 0;
    let tracking = false;
    let dragging = false;
    const CLOSE_DISTANCE = 90;

    const sheetStart = (e) => {
      if (window.innerWidth > 767 || !document.body.classList.contains("panel-open")) return;
      const t = e.touches[0];
      startY = t.clientY;
      dy = 0;
      dragging = false;
      // on ne suit le doigt que si la liste est tout en haut (ou si on part de l'en-tête)
      tracking = ipBody.scrollTop <= 0 || (ipHead && ipHead.contains(e.target));
    };
    const sheetMove = (e) => {
      if (!tracking) return;
      dy = e.touches[0].clientY - startY;
      if (dy <= 0) {
        // le doigt remonte : on rend la main au défilement natif de la liste
        if (!dragging) return;
        dy = 0;
      }
      if (!dragging) {
        // s'est-on déplacé assez, et la liste est-elle toujours en haut ?
        if (dy < 2 || ipBody.scrollTop > 0) return;
        dragging = true;
        sheet.style.transition = "none";
      }
      // dès le premier mouvement vers le bas : on garde la main (sinon Chrome Android
      // démarre son propre défilement/pull-to-refresh et envoie un touchcancel)
      if (e.cancelable) e.preventDefault();
      sheet.style.transform = `translateY(${dy}px)`;
    };
    const sheetEnd = () => {
      if (!dragging) {
        tracking = false;
        return;
      }
      const close = dy > CLOSE_DISTANCE;
      sheet.style.transition = "";
      void sheet.offsetHeight; // fige l'état courant avant de relancer la transition CSS
      sheet.style.transform = "";
      if (close) {
        selectedIndex = -1;
        document.body.classList.remove("panel-open");
        setBtnText(toggle, "i");
      }
      tracking = false;
      dragging = false;
      dy = 0;
    };

    [
      ["touchstart", sheetStart, { passive: true }],
      ["touchmove", sheetMove, { passive: false }],
      ["touchend", sheetEnd, { passive: true }],
      ["touchcancel", sheetEnd, { passive: true }],
    ].forEach(([event, handler, opts]) => {
      sheet.addEventListener(event, handler, opts);
      infoPanelListeners.push({ element: sheet, event, handler });
    });
  }

  // ============================================================
  // INFO - SURLIGNAGE DE LA CARD SELECTIONNEE
  // ============================================================

  // Carte « sélectionnée » par un clic sur une image : elle reste en état actif
  // (comme au survol) tant que le panneau est ouvert sur cette section.
  let selectedIndex = -1;
  let pendingHighlight = null;

  function highlightCard(index) {
    ipBody.querySelectorAll(".ip-card").forEach((c, i) => {
      c.classList.toggle("active", i === index);
    });
  }

  // active la carte et la fait apparaître dans la liste du panneau
  function activateCard(index) {
    selectedIndex = index;
    highlightCard(index);
    const card = ipBody.querySelector(`.ip-card[data-card="${index}"]`);
    if (card) {
      const delta =
        card.getBoundingClientRect().top - ipBody.getBoundingClientRect().top - 8;
      ipBody.scrollTo({ top: ipBody.scrollTop + delta, behavior: "smooth" });
    }
  }
  // ============================================================
  // INFO - REPERAGE DES IMAGES DANS LA SECTION ACTIVE
  // ============================================================

  function getImgInActiveSection(index) {
    const activeSection = document.querySelector(
      `section[data-section="${currentSection}"]`,
    );
    if (!activeSection) return null;
    return activeSection.querySelector(`img[data-artwork="${index}"]`);
  }
  // ============================================================
  // INFO - HOVER IMG ET SURLIGNAGE DES CARTES
  // ============================================================

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
    highlightCard(selectedIndex);
  };
  document.addEventListener("mouseout", mouseoutHandler);
  infoPanelListeners.push({
    element: document,
    event: "mouseout",
    handler: mouseoutHandler,
  });

  // ============================================================
  // INFO - HOVER CARTE (effet lien)
  // ============================================================

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
    highlightCard(selectedIndex);
  };
  ipBody.addEventListener("mouseout", cardMouseoutHandler);
  infoPanelListeners.push({
    element: ipBody,
    event: "mouseout",
    handler: cardMouseoutHandler,
  });

  // ============================================================
  // INFO - CLIC IMAGE --> OUVRE PANNEAU
  // ============================================================

  const clickHandler = (e) => {
    const img = e.target.closest("img[data-artwork]");
    if (!img) return;
    const index = parseInt(img.dataset.artwork);
    document.body.classList.add("panel-open");
    setBtnText(toggle, "✕");

    const parentSection = img.closest("section[data-section]");
    if (parentSection) {
      if (
        parentSection.dataset.section === currentSection &&
        ipBody.querySelector(".ip-card")
      ) {
        // panneau déjà sur cette section : on active la carte tout de suite
        activateCard(index);
      } else {
        // le contenu va être (re)construit : la carte sera activée juste après
        pendingHighlight = index;
        currentSection = null;
        updatePanel(parentSection.dataset.section);
      }
    }
  };
  document.addEventListener("click", clickHandler);
  infoPanelListeners.push({
    element: document,
    event: "click",
    handler: clickHandler,
  });
  // ============================================================
  // INFO - MISE A JOUR PAR SECTIONS
  // ============================================================

  function updatePanel(key) {
    if (key === currentSection) return;
    currentSection = key;
    const d = DATA[key];
    if (!d) return;
    fadeEls.forEach((el) => el.classList.add("fading"));
    setTimeout(() => {
      ipTitle.textContent = t(d.titre);
      ipBody.innerHTML = d.oeuvres
        .map(
          (o, idx) => `
          <div class="ip-card" data-card="${idx}">
            <div class="ip-card-title">${t(o.titre)}</div>
            <div class="ip-card-artist">${t(o.artiste)}</div>
            ${o.infos
              .map(
                (r) => `
              <div class="ip-row">
                <span class="ip-key">${t(r.cle)}</span>
                <span class="ip-val">${t(r.valeur)}</span>
              </div>`,
              )
              .join("")}
          </div>`,
        )
        .join("");
      fadeEls.forEach((el) => el.classList.remove("fading"));
      if (pendingHighlight !== null) {
        const idx = pendingHighlight;
        pendingHighlight = null;
        activateCard(idx);
      } else {
        selectedIndex = -1; // autre section : plus de sélection
      }
    }, 220);
  }

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
