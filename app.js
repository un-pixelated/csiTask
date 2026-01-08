const viewport = document.getElementById("viewport");
const world = document.getElementById("world");
const board = document.getElementById("board");

let camX = -6000 + window.innerWidth / 2;
let camY = -6000 + window.innerHeight / 2;
let scale = 1;

const WORLD_CENTER = 6000;

function worldToDisplay(worldX, worldY) {
  return {
    x: worldX - WORLD_CENTER,
    y: worldY - WORLD_CENTER,
  };
}

function displayToWorld(displayX, displayY) {
  return {
    x: displayX + WORLD_CENTER,
    y: displayY + WORLD_CENTER,
  };
}

function updateCamera() {
  world.style.transform = `translate(${camX}px, ${camY}px) scale(${scale})`;
}

updateCamera();

let isPanning = false;
let lastX = 0;
let lastY = 0;

viewport.addEventListener("mousedown", (e) => {
  if (e.button !== 0) return;
  isPanning = true;
  lastX = e.clientX;
  lastY = e.clientY;
});

window.addEventListener("mousemove", (e) => {
  if (!isPanning) return;

  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;

  lastX = e.clientX;
  lastY = e.clientY;

  camX += dx;
  camY += dy;

  updateCamera();
});

window.addEventListener("mouseup", () => {
  isPanning = false;
});

const gridButton = document.getElementById("gridButton");
let gridLocked = false;
let hoverTimer = null;

gridButton.addEventListener("mouseenter", () => {
  if (gridLocked) return;
  hoverTimer = setTimeout(() => {
    board.classList.add("showGrid");
  }, 200);
});

gridButton.addEventListener("mouseleave", () => {
  if (gridLocked) return;
  clearTimeout(hoverTimer);
  hoverTimer = null;
  board.classList.remove("showGrid");
});

gridButton.addEventListener("click", () => {
  gridLocked = !gridLocked;
  clearTimeout(hoverTimer);
  hoverTimer = null;
  board.classList.toggle("showGrid", gridLocked);
  gridButton.classList.toggle("active", gridLocked);
});

function createTestCircle(worldX, worldY) {
  const circle = document.createElement("div");
  circle.style.position = "absolute";
  circle.style.width = "100px";
  circle.style.height = "100px";
  circle.style.background = "red";
  circle.style.borderRadius = "50%";
  circle.style.border = "3px solid white";
  circle.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
  circle.style.transform = "translate(-50%, -50%)";
  circle.style.display = "flex";
  circle.style.alignItems = "center";
  circle.style.justifyContent = "center";
  circle.style.color = "white";
  circle.style.fontWeight = "bold";
  circle.style.fontSize = "11px";
  circle.style.textAlign = "center";
  circle.style.whiteSpace = "pre";
  circle.style.zIndex = "10";

  circle.style.left = worldX + "px";
  circle.style.top = worldY + "px";

  const display = worldToDisplay(worldX, worldY);
  circle.textContent = `(${display.x}, ${display.y})`;
  circle.title = `Display: (${display.x}, ${display.y})\nWorld: (${worldX}, ${worldY})`;

  world.appendChild(circle);
  return circle;
}

createTestCircle(6000, 6000); // Center - shows as (0, 0)
createTestCircle(6200, 6000); // Right - shows as (200, 0)
createTestCircle(5800, 6000); // Left - shows as (-200, 0)
createTestCircle(6000, 6200); // Down - shows as (0, 200)
createTestCircle(6000, 5800); // Up - shows as (0, -200)
createTestCircle(6300, 6300); // Bottom-right - shows as (300, 300)
createTestCircle(5700, 5700); // Top-left - shows as (-300, -300)
