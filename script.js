document.addEventListener("DOMContentLoaded", () => {
  const btnFigure = document.getElementById("btn-figure");
  const popupFigure = document.getElementById("popup-figure");

  // Afficher/masquer le popup des figures
  btnFigure.addEventListener("click", () => {
    popupFigure.classList.toggle("active");
  });

  // Éviter que le popup disparaisse en cliquant dessus
  popupFigure.addEventListener("click", (e) => e.stopPropagation());

  // Cacher le popup si on clique ailleurs
  document.addEventListener("click", (e) => {
    if (!popupFigure.contains(e.target) && e.target !== btnFigure) {
      popupFigure.classList.remove("active");
    }
  });

  // Gestion des options dans le popup
  const options = document.querySelectorAll(".popup-option");
  options.forEach((option) => {
    option.addEventListener("click", (e) => {
      const figure = e.target.getAttribute("data-figure");
      console.log(`Figure sélectionnée : ${figure}`);
      popupFigure.classList.remove("active");
      // Ajoute ici la logique pour dessiner la figure sélectionnée
    });
  });
});
