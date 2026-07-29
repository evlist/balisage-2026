import "impress.js/js/impress.js";

window.addEventListener("DOMContentLoaded", () => {
  impress().init();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`);
  });
}
