// ==================== Variables globales et des états =============================

const moon = new Image();
const earth = new Image();
const etoilesBackground = new Image();
const ctx = document.getElementById("canvas").getContext("2d");
const outilItems = document.querySelectorAll(".forme-item");
const crayon = document.getElementById("crayon");
const clearButton = document.querySelector(".clear");
const saveButton = document.querySelector(".save");
const colorPicker = document.getElementById("couleur");
const sizePicker = document.getElementById("taille");

// Variables d'état
let currentTool = "crayon"; // Outil actif par défaut
let isDrawing = false;
let lastX = 0; // Dernière position X
let lastY = 0; // Dernière position Y
let animationFrameId = null; // ID de l'animation en cours
let isDemoRunning = false; // Indique si l'animation est en cours

// Liste des outils possibles
const tools = {
  crayon: "crayon",
  gomme: "gomme",
  triangle: "triangle",
  rectangle: "rectangle",
  cercle: "cercle",
  ligne: "ligne",
  ellipse: "ellipse",
};

// Configuration initiale du contexte de dessin
ctx.lineCap = "round";
ctx.lineJoin = "round";

// Gestion de la sélection des outils
outilItems.forEach((item) => {
  item.addEventListener("click", () => {
    outilItems.forEach((el) => el.classList.remove("selected")); // Retirer les sélections
    item.classList.add("selected"); // Ajouter la classe "selected" à l'élément cliqué
    currentTool = item.dataset.figure; // Définir l'outil actif
  });
});

// =====================  Fonctions  ====================================

// Fonction pour obtenir les coordonnées correctes, en prenant en compte les écrans tactiles
function getCoordinates(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.touches ? e.touches[0].clientX : e.clientX;
  const y = e.touches ? e.touches[0].clientY : e.clientY;

  // Ajuste les coordonnées en fonction des dimensions réelles du canvas
  const xPos = x - rect.left;
  const yPos = y - rect.top;

  return { x: xPos, y: yPos };
}

// Gestion des événements de dessin (version mobile et souris)
function startDrawing(e) {
  const { x, y } = getCoordinates(e);

  // On ne commence à dessiner que si l'outil est le "crayon"
  if (currentTool !== "crayon" && currentTool !== "gomme") return;

  isDrawing = true;
  [lastX, lastY] = [x, y]; // Stocke la dernière position X et Y
}

function draw(e) {
  if (!isDrawing) return;
  const { x, y } = getCoordinates(e);

  switch (currentTool) {
    case "crayon":
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = colorPicker.value; // Couleur du crayon
      ctx.lineWidth = sizePicker.value; // Taille du crayon
      ctx.shadowBlur = 2; // Ajout d'un effet d'ombre
      ctx.shadowColor = colorPicker.value; // Couleur de l'ombre égale à la couleur du crayon
      ctx.stroke();
      ctx.shadowBlur = 0; // Désactivation de l'ombre après le trait
      break;

    case "gomme":
      ctx.clearRect(x - 10, y - 10, sizePicker.value, sizePicker.value); // Efface la zone autour du curseur
      break;

    default:
      break;
  }

  [lastX, lastY] = [x, y]; // Mise à jour des coordonnées
}

// =========== fonctions d'arret de dessin et d'animation ==============
function stopDrawing() {
  isDrawing = false;
}

// Fonction pour arrêter l'animation
function stopAnimation() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId); // Arrête l'animation
    animationFrameId = null;
    isDemoRunning = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Nettoie le canvas
  }

  // Réinitialiser les états de dessin
  isDrawing = false;
  lastX = 0;
  lastY = 0;

  // Réinitialiser les styles du contexte si nécessaire
  ctx.lineWidth = sizePicker.value;
  ctx.strokeStyle = colorPicker.value;
}
// ======================================================================

// Met à jour la résolution interne du canvas
// function resizeCanvas() {
//   // Prend la largeur calculée par le CSS
//   const width = canvas.clientWidth;
//   const height = canvas.clientHeight; // Utilise 700px comme défini dans le CSS

//   // Applique ces dimensions internes au canvas pour une meilleure qualité
//   canvas.width = width;
//   canvas.height = height;
// }

// // Appelle la fonction une première fois pour initialiser le canvas
// resizeCanvas();

function init() {
  if (isDemoRunning) stopAnimation();
  etoilesBackground.src = "./assets/stars.png";
  moon.src = "./assets/moon.png";
  earth.src = "./assets/earth.png";
  isDemoRunning = true;

  animationFrameId = window.requestAnimationFrame(demo);
}

function drawSun() {
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2); // Positionne le soleil au centre du canvas

  // Rayons du soleil
  ctx.fillStyle = "rgba(255, 204, 0, 0.6)"; // Couleur des rayons
  for (let i = 0; i < 12; i++) {
    ctx.beginPath();
    ctx.rotate((Math.PI * 2) / 12); // Rotation pour chaque rayon du soleil
    ctx.moveTo(0, 0);
    ctx.lineTo(60, 0);
    ctx.lineTo(50, 15);
    ctx.fill();
  }

  // Cercle principal (Soleil)
  ctx.beginPath();
  ctx.arc(0, 0, 60, 0, Math.PI * 2);
  ctx.fillStyle = "#FFD700"; // Couleur principale du soleil
  ctx.fill();

  ctx.restore();
}

function demo() {
  // Efface le canvas et dessine un fond noir
  ctx.drawImage(etoilesBackground, 0, 0, canvas.width, canvas.height); // Fond noir

  ctx.fillStyle = "rgb(0 0 0 / 40%)";
  ctx.strokeStyle = "rgb(0 153 255 / 40%)";

  // Dessiner le soleil
  drawSun();

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2); // Centre du canvas ajusté

  // Terre
  const time = new Date();
  const earthOrbitRadius = 130; // Rayon d'orbite réduit pour s'adapter au canvas
  ctx.rotate(
    ((2 * Math.PI) / 60) * time.getSeconds() +
      ((2 * Math.PI) / 60000) * time.getMilliseconds()
  );
  ctx.translate(earthOrbitRadius, 0);

  ctx.drawImage(earth, -10, -10, 20, 20); // Taille de la Terre ajustée

  // Lune
  ctx.save();
  const moonOrbitRadius = 20; // Rayon d'orbite réduit
  ctx.rotate(
    ((2 * Math.PI) / 6) * time.getSeconds() +
      ((2 * Math.PI) / 6000) * time.getMilliseconds()
  );
  ctx.translate(0, moonOrbitRadius);
  ctx.drawImage(moon, -5, -5, 10, 10); // Taille de la Lune ajustée
  ctx.restore();

  ctx.restore();
  // Orbite de la Terre
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 130, 0, Math.PI * 2, false); // Orbite

  ctx.lineWidth = 1; // ne pas prendre en compte sizePicker
  ctx.stroke();

  animationFrameId = window.requestAnimationFrame(demo);
}

// =====================  Événements  ====================================

// Ajoute l'événement pour lancer la démo lorsqu'un élément <li> avec data-figure="demo" est cliqué
document
  .querySelector('[data-figure="demo"]')
  .addEventListener("click", function () {
    init();
  });

// Ajouter les événements tactiles et souris
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);

canvas.addEventListener("touchstart", startDrawing);
canvas.addEventListener("touchmove", draw);
canvas.addEventListener("touchend", stopDrawing);
canvas.addEventListener("touchcancel", stopDrawing);

// Gestion des options (couleur et taille)
colorPicker.addEventListener("input", (e) => {
  ctx.strokeStyle = e.target.value;
});

sizePicker.addEventListener("input", (e) => {
  ctx.lineWidth = e.target.value; // Met à jour la taille du crayon
  console.log(`Taille du crayon : ${e.target.value}`);
  // console.log(`Largeur du canvas : ${canvas.width}`);
  // console.log(`Hauteur du canvas : ${canvas.height}`);
});

// Fonctionnalité "Effacer"
clearButton.addEventListener("click", () => {
  stopAnimation();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Fonctionnalité "Enregistrer"
saveButton.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "dessin.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

// =====================  Initialisation et Resize ======================

window.addEventListener("load", () => {
  // Récupère l'élément du crayon
  const crayonItem = document.querySelector('[data-figure="crayon"]');

  // Applique la classe 'selected' au crayon
  crayonItem.classList.add("selected");

  // Met à jour l'outil actif sur 'crayon'
  currentTool = "crayon";
  // Récupère le canvas
  const canvas = document.getElementById("canvas");

  // Met à jour la taille du canvas selon les dimensions CSS (et la taille maximale que tu souhaites)
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  // Les autres configurations
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
});
