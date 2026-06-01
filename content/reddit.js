// Reddit – hide homepage/subreddit feed, keep header + search

const SITE_KEY = "reddit";

// New Reddit (shreddit) — web components
const FEED_SELECTORS_NEW = [
  "shreddit-post",                   // individual post card (new Reddit)
  "shreddit-ad-post",                // promoted posts
  "reddit-feed-item",                // feed item wrapper
];

// Old Reddit / fallback
const FEED_SELECTORS_OLD = [
  ".thing.link",                     // individual post (old Reddit)
  ".promotedlink",                   // promoted post
];

const FEED_SELECTORS = [...FEED_SELECTORS_NEW, ...FEED_SELECTORS_OLD];

// Hide on homepage and popular/all feeds, not on search or individual post pages
function isFeedPage() {
  return location.pathname === "/" ||
         /^\/r\/[^/]+\/?$/.test(location.pathname) || // subreddit listing
         location.pathname.startsWith("/r/popular") ||
         location.pathname.startsWith("/r/all");
}

function isSearchPage() {
  return location.pathname.startsWith("/search") ||
         location.pathname.includes("/search/");
}

let observer = null;

function applyHiding(enabled) {
  if (enabled && isFeedPage() && !isSearchPage()) {
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
