const SITE_KEY = "youtube";

const FEED_SELECTORS = [
  "ytd-rich-item-renderer",
  "ytd-rich-section-renderer",
  "ytd-reel-shelf-renderer",
  "ytd-rich-shelf-renderer",
  "ytd-statement-banner-renderer",
];

const SIDEBAR_SELECTORS = [
  "ytd-compact-video-renderer",
  "ytd-compact-radio-renderer",
  "ytd-compact-playlist-renderer",
];

function isHomePage()   { return location.pathname === "/"; }
function isWatchPage()  { return location.pathname === "/watch"; }
function isSearchPage() { return location.pathname === "/results"; }

let observer = null;

function applyHiding(siteEnabled, schedule) {
  const active = siteEnabled && isWithinSchedule(schedule);
  const selectors = active && isHomePage()  ? FEED_SELECTORS
                  : active && isWatchPage() ? SIDEBAR_SELECTORS
                  : [];

  if (selectors.length) {
    if (!observer) observer = watchAndHide(selectors);
    else hideElements(selectors);
  } else {
    if (observer) { observer.disconnect(); observer = null; }
    showElements([...FEED_SELECTORS, ...SIDEBAR_SELECTORS]);
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
