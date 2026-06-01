// Instagram – hide home feed & Reels feed, keep top nav + search

const SITE_KEY = "instagram";

// Instagram uses generated class names, so we target by structure/aria/role
const FEED_SELECTORS = [
  // Main home feed (the scrollable article list)
  "main[role='main'] div[data-pagelet]",
  // Feed posts
  "article[role='presentation']",
  // Reels tab content
  "div[data-pagelet='ReelViewer']",
  // Suggested posts / "You're all caught up" + suggestions below
  "div[style*='flex-direction: column'] > div > div > div > article",
  // Stories tray
  "div[role='menu']",
  // Explore grid
  "main._aano",
  "div._aabd",
];

// More reliable: target the main scrollable feed container by its position
// This selector targets the main content area when on the home page
const HOME_FEED_SELECTORS = [
  // The feed is inside <main>, itself in a <div> after the nav
  // We hide the whole <main> feed section but keep nav
  "main section > div > div > div > div > div > div[role='none'] > div > article",
  // Stories bar (circular avatars at top of feed)
  "div[role='menu']",
];

function isHomePage() {
  return location.pathname === "/" || location.pathname === "";
}

function isSearchPage() {
  return location.pathname.startsWith("/explore") ||
         location.pathname.startsWith("/search") ||
         /^\/[^/]+\/$/.test(location.pathname); // profile pages
}

// Instagram's robust selector: hide <main>'s direct child section children
// except the first (which contains the nav/header of the feed)
function hideFeed() {
  const main = document.querySelector("main[role='main']");
  if (!main) return;

  // Articles = individual posts
  main.querySelectorAll("article").forEach(el => {
    // Don't hide if inside a profile grid (user typed a handle)
    el.classList.add(HIDDEN_CLASS);
  });

  // Stories tray
  const storiesSection = document.querySelector("div[aria-label='Stories']") ||
    document.querySelector("div[style*='overflow'] > div > div > ul");
  if (storiesSection) storiesSection.classList.add(HIDDEN_CLASS);

  // Suggested accounts / "Suggested for you"
  document.querySelectorAll("div[data-pagelet]").forEach(el => {
    el.classList.add(HIDDEN_CLASS);
  });
}

function showFeed() {
  document.querySelectorAll(`.${HIDDEN_CLASS}`).forEach(el => el.classList.remove(HIDDEN_CLASS));
}

let observer = null;

function applyHiding(enabled) {
  if (enabled && isHomePage()) {
    hideFeed();
    if (!observer) {
      observer = new MutationObserver(hideFeed);
      observer.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true,
      });
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
    chrome.storage.sync.get(SITE_KEY, result => {
      applyHiding(result[SITE_KEY] !== false);
    });
  }
}).observe(document, { subtree: true, childList: true });
