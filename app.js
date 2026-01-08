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

// PIN FUNCTIONALITY
const pinButton = document.getElementById("pinButton");
let pinMode = false;
let draggedPin = null;

pinButton.addEventListener("click", () => {
  pinMode = !pinMode;
  pinButton.classList.toggle("active", pinMode);
  viewport.style.cursor = pinMode ? "crosshair" : "default";
});

// Create a pin element
function createPin(worldX, worldY) {
  const pin = document.createElement("div");
  pin.className = "pin";
  pin.style.left = worldX + "px";
  pin.style.top = worldY + "px";

  // Pin icon (map pin SVG)
  const pinIcon = document.createElement("div");
  pinIcon.className = "pinIcon";
  pinIcon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  `;
  pin.appendChild(pinIcon);

  // Text box
  const textBox = document.createElement("div");
  textBox.className = "pinTextBox frostedGlass";
  textBox.style.display = "none";

  const textarea = document.createElement("textarea");
  textarea.className = "pinTextarea";
  textarea.placeholder = "Enter text...";
  textBox.appendChild(textarea);

  pin.appendChild(textBox);

  // Click to toggle text box
  pinIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    const isVisible = textBox.style.display !== "none";
    textBox.style.display = isVisible ? "none" : "block";
    if (!isVisible) {
      textarea.focus();
    }
  });

  // Drag functionality
  pinIcon.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    draggedPin = pin;
    pin.style.zIndex = "1000";
  });

  world.appendChild(pin);
  return pin;
}

// Click to place pin
viewport.addEventListener("click", (e) => {
  if (!pinMode) return;

  // Convert viewport click to world coordinates
  const viewportX = e.clientX;
  const viewportY = e.clientY;
  const worldX = (viewportX - camX) / scale;
  const worldY = (viewportY - camY) / scale;

  createPin(worldX, worldY);

  // Exit pin mode after placing
  pinMode = false;
  pinButton.classList.remove("active");
  viewport.style.cursor = "default";
});

// Drag pin
window.addEventListener("mousemove", (e) => {
  if (!draggedPin) return;

  const viewportX = e.clientX;
  const viewportY = e.clientY;
  const worldX = (viewportX - camX) / scale;
  const worldY = (viewportY - camY) / scale;

  draggedPin.style.left = worldX + "px";
  draggedPin.style.top = worldY + "px";
});

window.addEventListener("mouseup", () => {
  if (draggedPin) {
    draggedPin.style.zIndex = "10";
    draggedPin = null;
  }
});
