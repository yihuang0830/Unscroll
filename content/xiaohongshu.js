// 小红书 – hide explore feed while keeping header + search

const SITE_KEY = "xiaohongshu";

const FEED_SELECTORS = [
  // Homepage discovery/explore feed
  ".feeds-container",
  ".note-list",
  ".explore-feed",
  // Individual note cards in the feed
  "section.note-item",
  ".note-item",
  // Homepage topic/channel tabs that lead to feeds
  ".home-feed-tab",
  // 发现页 waterfall
  ".waterfall-container",
  "#exploreFeeds",
  ".channel-container .feeds-list",
];

function isSearchOrNotePage() {
  return /^\/search/.test(location.pathname) ||
         /^\/explore\//.test(location.pathname) ||
         /^\/user\/profile\//.test(location.pathname);
}

let observer = null;

function applyHiding(enabled) {
  if (enabled && !isSearchOrNotePage()) {
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
    chrome.storage.sync.get(SITE_KEY, result => {
      applyHiding(result[SITE_KEY] !== false);
    });
  }
}).observe(document, { subtree: true, childList: true });
