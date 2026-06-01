// YouTube – hide homepage recommendation feed, keep header + search

const SITE_KEY = "youtube";

// Individual card/shelf elements — never touch the header (#masthead)
const FEED_SELECTORS = [
  "ytd-rich-item-renderer",        // individual video cards on homepage
  "ytd-rich-section-renderer",     // "Recommended" / topic section headers
  "ytd-reel-shelf-renderer",       // Shorts shelf
  "ytd-rich-shelf-renderer",       // topic/trending shelves
  "ytd-statement-banner-renderer", // promotional banners
];

// Video sidebar (watch page) — related videos
const SIDEBAR_SELECTORS = [
  "ytd-compact-video-renderer",    // individual related video in sidebar
  "ytd-compact-radio-renderer",    // "Mix" playlist suggestions
  "ytd-compact-playlist-renderer", // playlist suggestions
];

function isHomePage() {
  return location.pathname === "/";
}

function isWatchPage() {
  return location.pathname === "/watch";
}

function isSearchPage() {
  return location.pathname === "/results";
}

let observer = null;

function getActiveSelectors() {
  if (isHomePage()) return FEED_SELECTORS;
  if (isWatchPage()) return SIDEBAR_SELECTORS;
  return [];
}

function applyHiding(enabled) {
  const selectors = getActiveSelectors();
  if (enabled && selectors.length) {
    if (!observer) observer = watchAndHide(selectors);
    else hideElements(selectors);
  } else {
    if (observer) { observer.disconnect(); observer = null; }
    showElements([...FEED_SELECTORS, ...SIDEBAR_SELECTORS]);
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

// YouTube is a SPA — re-evaluate on navigation
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
