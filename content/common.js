// Shared utilities loaded before every site-specific content script.

const HIDDEN_CLASS = "unscroll-hidden";

function hideElements(selectors) {
  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => el.classList.add(HIDDEN_CLASS));
  });
}

function showElements(selectors) {
  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => el.classList.remove(HIDDEN_CLASS));
  });
}

function watchAndHide(selectors) {
  hideElements(selectors);
  const observer = new MutationObserver(() => hideElements(selectors));
  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true,
  });
  return observer;
}

// Returns true when the current time and day of week fall inside the user's schedule,
// or when no schedule is configured (always active).
function isWithinSchedule(schedule) {
  if (!schedule || !schedule.enabled) return true;

  const now = new Date();

  const activeDays = schedule.days && schedule.days.length > 0
    ? schedule.days
    : [0, 1, 2, 3, 4, 5, 6];
  if (!activeDays.includes(now.getDay())) return false;

  const cur = now.getHours() * 60 + now.getMinutes();
  const [sh, sm] = (schedule.start || "00:00").split(":").map(Number);
  const [eh, em] = (schedule.end   || "23:59").split(":").map(Number);
  const start = sh * 60 + sm;
  const end   = eh * 60 + em;

  // Handle overnight ranges e.g. 22:00 – 06:00
  return start <= end
    ? cur >= start && cur < end
    : cur >= start || cur < end;
}
