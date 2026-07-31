import "impress.js/js/impress.js";

const edgeTapRatio = 0.1;
const swipeThreshold = 50;
const longPressDelay = 700;
let startX = 0;
let startY = 0;
let impressApi;
let longPressTimer;
let actionMenu;
let summaryMenu;
let actionMessageTimer;
let longPressOpenedMenu = false;
let wakeLock;

window.addEventListener("DOMContentLoaded", () => {
  impressApi = impress();
  impressApi.init();
  createActionMenu();
  createSummaryMenu();
  requestWakeLock();
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    requestWakeLock();
  }
});

window.addEventListener("contextmenu", (event) => {
  if (!isInteractiveTarget(event.target)) {
    event.preventDefault();
  }
});

window.addEventListener("selectstart", (event) => {
  if (!isInteractiveTarget(event.target)) {
    event.preventDefault();
  }
});

window.addEventListener("pointerdown", (event) => {
  if (isInteractiveTarget(event.target)) {
    return;
  }

  event.preventDefault();
  requestWakeLock();

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
    closeSummaryMenu();
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
      <button type="button" data-action="summary">Summary</button>
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

function createSummaryMenu() {
  summaryMenu = document.createElement("div");
  summaryMenu.className = "summary-menu";
  summaryMenu.hidden = true;
  summaryMenu.innerHTML = `
    <div class="summary-menu__panel" role="dialog" aria-label="Presentation summary">
      <div class="summary-menu__header">
        <h2>Summary</h2>
        <button type="button" data-summary-close>Close</button>
      </div>
      <ol class="summary-menu__list"></ol>
    </div>
  `;

  const list = summaryMenu.querySelector(".summary-menu__list");
  const slides = Array.from(document.querySelectorAll("#impress .step.slide"));

  for (const [index, slide] of slides.entries()) {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.slideId = slide.id;
    button.innerHTML = `<span>${String(index + 1).padStart(2, "0")}</span>${getSlideTitle(slide)}`;
    item.append(button);
    list.append(item);
  }

  summaryMenu.addEventListener("click", (event) => {
    const closeButton = event.target.closest("[data-summary-close]");
    const slideButton = event.target.closest("button[data-slide-id]");

    if (closeButton || !slideButton) {
      closeSummaryMenu();
      return;
    }

    const slide = document.getElementById(slideButton.dataset.slideId);

    if (slide) {
      closeSummaryMenu();
      impressApi.goto(slide);
    }
  });

  document.body.append(summaryMenu);
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

function openSummaryMenu() {
  if (summaryMenu) {
    summaryMenu.hidden = false;
  }
}

function closeSummaryMenu() {
  if (summaryMenu) {
    summaryMenu.hidden = true;
  }
}

function runAction(action) {
  closeActionMenu();

  if (action === "previous") {
    impressApi.prev();
  } else if (action === "next") {
    impressApi.next();
  } else if (action === "first") {
    impressApi.goto(document.querySelector("#impress .step"));
  } else if (action === "summary") {
    openSummaryMenu();
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
  return target.closest("a, button, input, textarea, select, .action-menu, .summary-menu");
}

function getSlideTitle(slide) {
  const directParagraphs = Array.from(slide.children).filter((child) => child.tagName === "P");
  const title = directParagraphs.at(-1)?.textContent || slide.textContent || slide.id;
  return title.replace(/\s+/g, " ").trim();
}

async function requestWakeLock() {
  if (wakeLock || !("wakeLock" in navigator) || document.visibilityState !== "visible") {
    return;
  }

  try {
    wakeLock = await navigator.wakeLock.request("screen");
    wakeLock.addEventListener("release", () => {
      wakeLock = undefined;
    });
  } catch {
    wakeLock = undefined;
  }
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`);
  });
}
