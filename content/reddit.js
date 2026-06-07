const SITE_KEY = "reddit";

const FEED_SELECTORS = [
  "shreddit-post",
  "shreddit-ad-post",
  "reddit-feed-item",
  ".thing.link",
  ".promotedlink",
];

function isFeedPage() {
  return location.pathname === "/" ||
         /^\/r\/[^/]+\/?$/.test(location.pathname) ||
         location.pathname.startsWith("/r/popular") ||
         location.pathname.startsWith("/r/all");
}

function isSearchPage() {
  return location.pathname.startsWith("/search") ||
         location.pathname.includes("/search/");
}

let observer = null;

function applyHiding(siteEnabled, schedule) {
  if (tempUnblocked) {
    if (observer) { observer.disconnect(); observer = null; }
    showElements(FEED_SELECTORS);
    return;
  }
  if (siteEnabled && isWithinSchedule(schedule) && isFeedPage() && !isSearchPage()) {
    if (!observer) observer = watchAndHide(FEED_SELECTORS);
    else hideElements(FEED_SELECTORS);
  } else {
    if (observer) { observer.disconnect(); observer = null; }
    showElements(FEED_SELECTORS);
  }
}

function reload() {
  reloadWithTimer(SITE_KEY, applyHiding);
}

reload();
setInterval(reload, 60000);

chrome.runtime.onMessage.addListener(msg => {
  if (msg.type === "TOGGLE" && msg.site === SITE_KEY) reload();
  if (msg.type === "SCHEDULE_CHANGED") reload();
  handleTimerMessage(msg, reload);
});

let lastPath = location.pathname;
new MutationObserver(() => {
  if (location.pathname !== lastPath) {
    lastPath = location.pathname;
    if (observer) { observer.disconnect(); observer = null; }
    reload();
  }
}).observe(document, { subtree: true, childList: true });
