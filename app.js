const viewport = document.getElementById("viewport");
const world = document.getElementById("world");

let camX = -6000;
let camY = -6000;
let scale = 1;

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

const board = document.getElementById("board");
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
