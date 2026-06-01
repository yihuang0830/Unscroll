// LinkedIn – hide homepage feed, keep top nav + search

const SITE_KEY = "linkedin";

// Individual post/update cards in the feed
const FEED_SELECTORS = [
  ".occludable-update",              // each feed post wrapper
  ".feed-shared-update-v2",          // post content card
  ".scaffold-finite-scroll__content > div > div", // feed items container children
  // Right sidebar
  ".scaffold-layout__aside",         // "People you may know", "News" etc.
  // "Add to your feed" suggestions
  ".follows-recommendation-card",
];

// Only hide on the main feed page
function isFeedPage() {
  return location.pathname === "/feed/" ||
         location.pathname === "/feed" ||
         location.pathname === "/";
}

let observer = null;

function applyHiding(enabled) {
  if (enabled && isFeedPage()) {
    if (!observer) observer = watchAndHide(FEED_SELECTORS);
    else hideElements(FEED_SELECTORS);
  } else {
    if (observer) { observer.disconnect(); observer = null; }
    showElements(FEED_SELECTORS);
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
