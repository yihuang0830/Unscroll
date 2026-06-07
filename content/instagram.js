const SITE_KEY = "instagram";

function hideFeed() {
  const main = document.querySelector("main[role='main']");
  if (!main) return;
  main.querySelectorAll("article").forEach(el => el.classList.add(HIDDEN_CLASS));
  const stories = document.querySelector("div[aria-label='Stories']") ||
    document.querySelector("div[style*='overflow'] > div > div > ul");
  if (stories) stories.classList.add(HIDDEN_CLASS);
  document.querySelectorAll("div[data-pagelet]").forEach(el => el.classList.add(HIDDEN_CLASS));
}

function showFeed() {
  document.querySelectorAll(`.${HIDDEN_CLASS}`).forEach(el => el.classList.remove(HIDDEN_CLASS));
}

function isHomePage() {
  return location.pathname === "/" || location.pathname === "";
}

let observer = null;

function applyHiding(siteEnabled, schedule) {
  if (tempUnblocked) {
    if (observer) { observer.disconnect(); observer = null; }
    showFeed();
    return;
  }
  if (siteEnabled && isWithinSchedule(schedule) && isHomePage()) {
    hideFeed();
    if (!observer) {
      observer = new MutationObserver(hideFeed);
      observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
    }
  } else {
    if (observer) { observer.disconnect(); observer = null; }
    showFeed();
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
