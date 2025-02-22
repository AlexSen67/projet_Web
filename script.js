// ==================== Variables globales et des états =============================
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("Service Worker enregistré avec succès:", registration);
      })
      .catch((error) => {
        console.log("Échec de l'enregistrement du Service Worker:", error);
      });
  });
}

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
let currentTool; // Outil actif par défaut
let isDrawing = false;
let lastX = 0; // Dernière position X
let lastY = 0; // Dernière position Y
let animationFrameId = null; // ID de l'animation en cours
let isDemoRunning = false; // Indique si l'animation est en cours

// Liste des outils possibles
const tools = {
  crayon: "crayon",
  gomme: "gomme",
  rectangle: "rectangle",
  triangle: "triangle",
  cercle: "cercle",
  ligne: "smiley",
  ellipse: "coeur",
};

// Liste des événements pour les écrans tactiles et les souris
const events = {
  start: ["mousedown", "touchstart"],
  move: ["mousemove", "touchmove"],
  end: ["mouseup", "touchend"],
};

// Configuration initiale du contexte de dessin
ctx.lineCap = "round";
ctx.lineJoin = "round";

// Gestion de la sélection des outils
// Ajouter un écouteur d'événement pour chaque outil
outilItems.forEach((item) => {
  item.addEventListener("click", () => {
    // Retirer la classe "selected" de tous les outils
    outilItems.forEach((el) => el.classList.remove("selected"));

    // Ajouter la classe "selected" à l'élément cliqué
    item.classList.add("selected");

    // Définir l'outil actif
    currentTool = item.dataset.figure;

    if (currentTool !== "demo") stopAnimation(); // Arrête l'animation si un outil est sélectionné{

    console.log(`Outil sélectionné : ${currentTool}`); // Vérification dans la console
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
      console.log("Effacer");
      break;
    case "rectangle":
      // Dimensions du rectangle
      const rectWidth = 150; // Largeur du rectangle
      const rectHeight = 100; // Hauteur du rectangle
      // Calcul des coordonnées pour centrer le rectangle au clic
      const startX = x - rectWidth / 2;
      const startY = y - rectHeight / 2;
      // Dessine un rectangle temporaire pour montrer l'aperçu
      stopAnimation(); // Empêche l'interférence avec d'autres animations
      ctx.strokeStyle = colorPicker.value;
      ctx.lineWidth = sizePicker.value;
      // Dessiner le rectangle
      ctx.strokeRect(startX, startY, rectWidth, rectHeight);
      break;
    case "triangle":
      // Dessiner un triangle
      stopAnimation();
      ctx.beginPath();
      ctx.moveTo(x, y - 50); // Sommet supérieur
      ctx.lineTo(x + 50, y + 50); // Coin inférieur droit
      ctx.lineTo(x - 50, y + 50); // Coin inférieur gauche
      ctx.closePath();
      ctx.strokeStyle = colorPicker.value;
      ctx.lineWidth = sizePicker.value;
      ctx.stroke();
      break;
    case "smiley":
      stopAnimation();
      ctx.beginPath();
      ctx.strokeStyle = colorPicker.value;
      ctx.lineWidth = sizePicker.value;
      ctx.arc(x, y, 50, 0, Math.PI * 2, true); // Outer circle
      ctx.moveTo(x + 35, y);
      ctx.arc(x, y, 35, 0, Math.PI, false); // Mouth (clock
      ctx.moveTo(x - 10, y - 10);
      ctx.arc(x - 15, y - 10, 5, 0, Math.PI * 2, true); // Left eye
      ctx.moveTo(x + 20, y - 10);
      ctx.arc(x + 15, y - 10, 5, 0, Math.PI * 2, true); // Right eye
      ctx.stroke();
      break;
    case "coeur":
      stopAnimation();
      ctx.beginPath();
      ctx.strokeStyle = colorPicker.value;
      ctx.lineWidth = sizePicker.value;
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(x + 50, y - 50, x + 90, y + 20, x, y + 70);
      ctx.bezierCurveTo(x - 90, y + 20, x - 50, y - 50, x, y);
      ctx.stroke();
      ctx.fill();
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
// =========================== Demo ====================================

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

// Ajouter les événements tactiles et souris pour le dessin
events.start.forEach((event) => canvas.addEventListener(event, startDrawing));
events.move.forEach((event) => canvas.addEventListener(event, draw));
events.end.forEach((event) => canvas.addEventListener(event, stopDrawing));

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
  // Met à jour la taille du canvas selon les dimensions CSS (et la taille maximale que tu souhaites)
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  // Les autres configurations
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
});
