const SITE_KEY = "bilibili";

const FEED_SELECTORS = [
  ".bili-video-card",
  ".video-card-wrap",
  ".floor-single-card",
  ".bili-live-card",
  ".rank-list-wrap",
  ".rec-list",
  ".bpx-player-ending-related",
  ".palette-button-wrap",
];

function isSearchOrVideoPage() {
  return location.hostname === "search.bilibili.com" ||
         /^\/search\//.test(location.pathname) ||
         /^\/video\//.test(location.pathname) ||
         /^\/bangumi\//.test(location.pathname) ||
         /^\/read\//.test(location.pathname);
}

let observer = null;

function applyHiding(siteEnabled, schedule) {
  if (tempUnblocked) {
    if (observer) { observer.disconnect(); observer = null; }
    showElements(FEED_SELECTORS);
    return;
  }
  if (siteEnabled && isWithinSchedule(schedule) && !isSearchOrVideoPage()) {
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
