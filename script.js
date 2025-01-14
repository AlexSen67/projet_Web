const moon = new Image();
const earth = new Image();
const etoilesBackground = new Image();
const ctx = document.getElementById("canvas").getContext("2d");

// Redimensionner le canvas pour s'adapter à la fenêtre
function resizeCanvas() {
  const canvas = document.getElementById("canvas");

  // Définir une taille en fonction de l'écran tout en gardant une limite minimale
  canvas.width = Math.max(430, window.innerWidth * 0.9); // Au moins 430px
  canvas.height = Math.max(300, window.innerHeight * 0.6); // Au moins 300px
}

function init() {
  resizeCanvas(); // Appeler la fonction pour définir les dimensions initiales du canvas
  etoilesBackground.src = "./assets/stars.png";
  moon.src = "./assets/moon.png";
  earth.src = "./assets/earth.png";
  window.requestAnimationFrame(draw);
}

// Met à jour la taille du canvas à chaque redimensionnement de la fenêtre
window.addEventListener("resize", resizeCanvas);

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

function draw() {
  // Efface le canvas et dessine un fond noir
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
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
  ctx.stroke();

  window.requestAnimationFrame(draw);
}

init();
resizeCanvas();
