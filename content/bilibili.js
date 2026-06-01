// Bilibili – hide homepage recommendation feed while keeping header + search

const SITE_KEY = "bilibili";

// Target only individual card elements, NOT their parent containers.
// Hiding a parent container risks swallowing the header/nav too.
const FEED_SELECTORS = [
  // Individual video recommendation cards (homepage & sidebar)
  ".bili-video-card",
  ".video-card-wrap",
  // Banner/floor cards between feed rows
  ".floor-single-card",
  // Live stream recommendation cards
  ".bili-live-card",
  // "Hot today" / ranking sidebar
  ".rank-list-wrap",
  // Related-video sidebar on watch page
  ".rec-list",
  // Player ending screen suggestions
  ".bpx-player-ending-related",
  // Trending topic chips
  ".palette-button-wrap",
];

// Pages where we should NOT hide (search results, video player main content)
function isSearchOrVideoPage() {
  return location.hostname === "search.bilibili.com" || // search results subdomain
         /^\/search\//.test(location.pathname) ||
         /^\/video\//.test(location.pathname) ||
         /^\/bangumi\//.test(location.pathname) ||
         /^\/read\//.test(location.pathname);
}

let observer = null;

function applyHiding(enabled) {
  if (enabled && !isSearchOrVideoPage()) {
    if (!observer) observer = watchAndHide(FEED_SELECTORS);
    else hideElements(FEED_SELECTORS);
  } else {
    if (observer) { observer.disconnect(); observer = null; }
    showElements(FEED_SELECTORS);
  }
}

chrome.storage.sync.get(SITE_KEY, result => {
  const enabled = result[SITE_KEY] !== false; // default on
  applyHiding(enabled);
});

chrome.runtime.onMessage.addListener(msg => {
  if (msg.type === "TOGGLE" && msg.site === SITE_KEY) {
    applyHiding(msg.enabled);
  }
});

// Re-evaluate on navigation (Bilibili is a SPA)
let lastPath = location.pathname;
new MutationObserver(() => {
  if (location.pathname !== lastPath) {
    lastPath = location.pathname;
    chrome.storage.sync.get(SITE_KEY, result => {
      applyHiding(result[SITE_KEY] !== false);
    });
  }
}).observe(document, { subtree: true, childList: true });
