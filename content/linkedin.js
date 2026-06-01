// LinkedIn – hide homepage feed, keep top nav + search

const SITE_KEY = "linkedin";

function hideFeed() {
  const main = document.querySelector("main");
  if (!main) return;

  // Method 1: each post is an <article> inside main
  main.querySelectorAll("article").forEach(el => el.classList.add(HIDDEN_CLASS));

  // Method 2: data-urn on post wrappers (stable LinkedIn identifier)
  main.querySelectorAll("[data-urn]").forEach(el => {
    const urn = el.getAttribute("data-urn") || "";
    if (urn.includes(":activity:") || urn.includes(":aggregate:") || urn.includes(":sponsored:") || urn.includes(":ugcPost:")) {
      el.classList.add(HIDDEN_CLASS);
    }
  });

  // Method 3: class-based fallback (may change after LinkedIn redesigns)
  [
    ".occludable-update",
    ".feed-shared-update-v2",
  ].forEach(sel => main.querySelectorAll(sel).forEach(el => el.classList.add(HIDDEN_CLASS)));

  // Right sidebar: LinkedIn News, Puzzles, Premium upsells
  document.querySelectorAll(".scaffold-layout__aside").forEach(el => el.classList.add(HIDDEN_CLASS));
}

function showFeed() {
  document.querySelectorAll(`.${HIDDEN_CLASS}`).forEach(el => el.classList.remove(HIDDEN_CLASS));
}

function isFeedPage() {
  return location.pathname === "/feed/" ||
         location.pathname === "/feed" ||
         location.pathname === "/";
}

let observer = null;

function applyHiding(enabled) {
  if (enabled && isFeedPage()) {
    hideFeed();
    if (!observer) {
      observer = new MutationObserver(hideFeed);
      observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
    }
  } else {
    if (observer) { observer.disconnect(); observer = null; }
    showFeed();
  }
}

chrome.storage.sync.get(SITE_KEY, result => {
  applyHiding(result[SITE_KEY] !== false);
});

chrome.runtime.onMessage.addListener(msg => {
  if (msg.type === "TOGGLE" && msg.site === SITE_KEY) {
    applyHiding(msg.enabled);
  }
});

let lastPath = location.pathname;
new MutationObserver(() => {
  if (location.pathname !== lastPath) {
    lastPath = location.pathname;
    if (observer) { observer.disconnect(); observer = null; }
    chrome.storage.sync.get(SITE_KEY, result => {
      applyHiding(result[SITE_KEY] !== false);
    });
  }
}).observe(document, { subtree: true, childList: true });
