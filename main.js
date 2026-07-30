import "impress.js/js/impress.js";

const edgeTapRatio = 0.1;
const swipeThreshold = 50;
const longPressDelay = 700;
let startX = 0;
let startY = 0;
let impressApi;
let longPressTimer;
let actionMenu;
let actionMessageTimer;
let longPressOpenedMenu = false;

window.addEventListener("DOMContentLoaded", () => {
  impressApi = impress();
  impressApi.init();
  createActionMenu();
});

window.addEventListener("pointerdown", (event) => {
  if (isInteractiveTarget(event.target)) {
    return;
  }

  startX = event.clientX;
  startY = event.clientY;
  longPressOpenedMenu = false;

  window.clearTimeout(longPressTimer);
  longPressTimer = window.setTimeout(() => {
    longPressOpenedMenu = true;
    openActionMenu();
  }, longPressDelay);
});

window.addEventListener("pointermove", (event) => {
  if (Math.abs(event.clientX - startX) > 8 || Math.abs(event.clientY - startY) > 8) {
    window.clearTimeout(longPressTimer);
  }
});

window.addEventListener("pointerup", (event) => {
  window.clearTimeout(longPressTimer);

  if (!impressApi || longPressOpenedMenu || isInteractiveTarget(event.target)) {
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

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeActionMenu();
  }
});

function createActionMenu() {
  actionMenu = document.createElement("div");
  actionMenu.className = "action-menu";
  actionMenu.hidden = true;
  actionMenu.innerHTML = `
    <div class="action-menu__panel" role="dialog" aria-label="Presentation actions">
      <button type="button" data-action="previous">Previous</button>
      <button type="button" data-action="next">Next</button>
      <button type="button" data-action="first">First slide</button>
      <button type="button" data-action="overview">Overview</button>
      <button type="button" data-action="refresh">Refresh app</button>
      <button type="button" data-action="close">Close</button>
      <p class="action-menu__message" aria-live="polite"></p>
    </div>
  `;

  actionMenu.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");

    if (!button) {
      closeActionMenu();
      return;
    }

    runAction(button.dataset.action);
  });

  document.body.append(actionMenu);
}

function openActionMenu() {
  if (!actionMenu) {
    return;
  }

  actionMenu.hidden = false;
}

function closeActionMenu() {
  if (actionMenu) {
    actionMenu.hidden = true;
  }
}

function runAction(action) {
  closeActionMenu();

  if (action === "previous") {
    impressApi.prev();
  } else if (action === "next") {
    impressApi.next();
  } else if (action === "first") {
    impressApi.goto("slide-01");
  } else if (action === "overview") {
    impressApi.goto("overview");
  } else if (action === "refresh") {
    refreshApp();
  } else if (action === "close") {
    closeApp();
  }
}

function closeApp() {
  window.close();

  window.setTimeout(() => {
    if (document.visibilityState === "visible" && window.history.length > 1) {
      window.history.back();
      return;
    }

    showActionMessage("Close the app from Android's recent apps screen.");
  }, 250);
}

function showActionMessage(message) {
  if (!actionMenu) {
    return;
  }

  actionMenu.hidden = false;
  const messageElement = actionMenu.querySelector(".action-menu__message");
  messageElement.textContent = message;

  window.clearTimeout(actionMessageTimer);
  actionMessageTimer = window.setTimeout(() => {
    messageElement.textContent = "";
  }, 4000);
}

async function refreshApp() {
  if ("caches" in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
  }

  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
  }

  const url = new URL(window.location.href);
  url.searchParams.set("v", Date.now());
  window.location.replace(url);
}

function isInteractiveTarget(target) {
  return target.closest("a, button, input, textarea, select, .action-menu");
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`);
  });
}
