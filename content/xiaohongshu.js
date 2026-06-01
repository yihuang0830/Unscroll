const SITE_KEY = "xiaohongshu";

const FEED_SELECTORS = [
  ".feeds-container",
  ".note-list",
  ".explore-feed",
  "section.note-item",
  ".note-item",
  ".home-feed-tab",
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

function applyHiding(siteEnabled, schedule) {
  if (siteEnabled && isWithinSchedule(schedule) && !isSearchOrNotePage()) {
    if (!observer) observer = watchAndHide(FEED_SELECTORS);
    else hideElements(FEED_SELECTORS);
  } else {
    if (observer) { observer.disconnect(); observer = null; }
    showElements(FEED_SELECTORS);
  }
}

function reload() {
  chrome.storage.sync.get([SITE_KEY, "schedule"], r => {
    applyHiding(r[SITE_KEY] !== false, r.schedule);
  });
}

reload();
setInterval(reload, 60000);

chrome.runtime.onMessage.addListener(msg => {
  if (msg.type === "TOGGLE" && msg.site === SITE_KEY) reload();
  if (msg.type === "SCHEDULE_CHANGED") reload();
});

let lastPath = location.pathname;
new MutationObserver(() => {
  if (location.pathname !== lastPath) {
    lastPath = location.pathname;
    if (observer) { observer.disconnect(); observer = null; }
    reload();
  }
}).observe(document, { subtree: true, childList: true });
