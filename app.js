const board = document.getElementById("board");
const gridButton = document.getElementById("gridButton");

let gridLocked = false;
let hoverTimer = null;

gridButton.addEventListener("mouseenter", () => {
  if (gridLocked) return;

  hoverTimer = setTimeout(() => {
    board.classList.add("showGrid");
  }, 500);
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
