// Exécuté de façon synchrone dans le <head> (avant le premier rendu).
// Si l'on arrive d'une transition Barba (main.js pose "barba-transition" avant de
// changer de page), l'overlay doit déjà couvrir l'écran au premier paint.
try {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
} catch (e) {
  /* ignore */
}
try {
  if (sessionStorage.getItem("barba-transition")) {
    document.documentElement.classList.add("is-arriving");
  }
} catch (e) {
  /* stockage indisponible : pas de transition d'arrivée */
}

// Filet de sécurité : si le JS principal ne démarre jamais, on ne laisse pas
// l'écran recouvert indéfiniment (les styles en ligne de GSAP priment sinon).
setTimeout(function () {
  document.documentElement.classList.remove("is-arriving");
}, 8000);
