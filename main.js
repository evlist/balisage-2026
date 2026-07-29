import "impress.js/js/impress.js";

const edgeTapRatio = 0.1;
const swipeThreshold = 50;
let startX = 0;
let startY = 0;
let impressApi;

window.addEventListener("DOMContentLoaded", () => {
  impressApi = impress();
  impressApi.init();
});

window.addEventListener("pointerdown", (event) => {
  startX = event.clientX;
  startY = event.clientY;
});

window.addEventListener("pointerup", (event) => {
  if (!impressApi || event.target.closest("a, button, input, textarea, select")) {
    return;
  }

  const deltaX = event.clientX - startX;
  const deltaY = event.clientY - startY;

  if (Math.abs(deltaX) > swipeThreshold && Math.abs(deltaX) > Math.abs(deltaY)) {
    deltaX < 0 ? impressApi.next() : impressApi.prev();
    return;
  }

  if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
    return;
  }

  const edgeWidth = window.innerWidth * edgeTapRatio;

  if (event.clientX <= edgeWidth) {
    impressApi.prev();
  } else if (event.clientX >= window.innerWidth - edgeWidth) {
    impressApi.next();
  }
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`);
  });
}
