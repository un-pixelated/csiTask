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
  if (pinMode) return;
  if (e.target.closest(".pin")) return;
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

  // Update icon
  const gridIcon = gridButton.querySelector("svg");
  if (gridLocked) {
    gridIcon.innerHTML = `
      <path d="M12 3v17a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1H3"/>
      <path d="m16 19 2 2 4-4"/>
    `;
  } else {
    gridIcon.innerHTML = `
      <path d="M12 3v18"/>
      <path d="M3 12h18"/>
      <rect x="3" y="3" width="18" height="18" rx="2"/>
    `;
  }
});

// PIN FUNCTIONALITY
const pinButton = document.getElementById("pinButton");
let pinMode = false;
let draggedPin = null;
let isDraggingPin = false;
let dragStartX = 0;
let dragStartY = 0;
const DRAG_THRESHOLD = 5;

pinButton.addEventListener("click", () => {
  pinMode = !pinMode;
  pinButton.classList.toggle("active", pinMode);
  viewport.style.cursor = pinMode ? "crosshair" : "default";
});

function createPin(worldX, worldY) {
  const pin = document.createElement("div");
  pin.className = "pin";
  pin.style.left = worldX + "px";
  pin.style.top = worldY + "px";

  const pinIcon = document.createElement("div");
  pinIcon.className = "pinIcon";
  pinIcon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  `;
  pin.appendChild(pinIcon);

  const textBoxContainer = document.createElement("div");
  textBoxContainer.className = "pinTextBoxContainer";
  textBoxContainer.style.display = "none";

  const textBox = document.createElement("div");
  textBox.className = "pinTextBox frostedGlass";

  const textarea = document.createElement("textarea");
  textarea.className = "pinTextarea";
  textarea.placeholder = "Enter text...";
  textBox.appendChild(textarea);

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "pinDeleteBtn frostedGlass";
  deleteBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 6h18"/>
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
      <line x1="10" x2="10" y1="11" y2="17"/>
      <line x1="14" x2="14" y1="11" y2="17"/>
    </svg>
  `;
  deleteBtn.title = "Delete pin";

  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    pin.remove();
  });

  textBoxContainer.appendChild(textBox);
  textBoxContainer.appendChild(deleteBtn);
  pin.appendChild(textBoxContainer);

  // Prevent all interactions with text box and delete button from triggering drag
  textarea.addEventListener("mousedown", (e) => {
    e.stopPropagation();
  });

  textarea.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  deleteBtn.addEventListener("mousedown", (e) => {
    e.stopPropagation();
  });

  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  textBox.addEventListener("mousedown", (e) => {
    e.stopPropagation();
  });

  // Only the pin icon can initiate drag
  pinIcon.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    e.stopPropagation();

    dragStartX = e.clientX;
    dragStartY = e.clientY;
    isDraggingPin = false;
    draggedPin = pin;
    pin.style.zIndex = "1000";
  });

  world.appendChild(pin);
  return pin;
}

viewport.addEventListener("click", (e) => {
  if (!pinMode) return;
  if (e.target.closest(".pin")) return;

  const viewportX = e.clientX;
  const viewportY = e.clientY;
  const worldX = (viewportX - camX) / scale;
  const worldY = (viewportY - camY) / scale;

  createPin(worldX, worldY);

  pinMode = false;
  pinButton.classList.remove("active");
  viewport.style.cursor = "default";
});

window.addEventListener("mousemove", (e) => {
  if (!draggedPin) return;

  const dx = Math.abs(e.clientX - dragStartX);
  const dy = Math.abs(e.clientY - dragStartY);

  if (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD) {
    isDraggingPin = true;
  }

  if (isDraggingPin) {
    const viewportX = e.clientX;
    const viewportY = e.clientY;
    const worldX = (viewportX - camX) / scale;
    const worldY = (viewportY - camY) / scale;

    draggedPin.style.left = worldX + "px";
    draggedPin.style.top = worldY + "px";
  }
});

window.addEventListener("mouseup", (e) => {
  if (draggedPin) {
    if (!isDraggingPin) {
      const textBoxContainer = draggedPin.querySelector(".pinTextBoxContainer");
      const textarea = draggedPin.querySelector(".pinTextarea");
      const isVisible = textBoxContainer.style.display !== "none";

      textBoxContainer.style.display = isVisible ? "none" : "flex";

      if (!isVisible) {
        setTimeout(() => textarea.focus(), 10);
      }
    }

    draggedPin.style.zIndex = "10";
    draggedPin = null;
    isDraggingPin = false;
  }
});
