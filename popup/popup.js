const SITES = ["bilibili", "xiaohongshu", "instagram", "youtube", "reddit"];

function getDefaultState() {
  return Object.fromEntries(SITES.map(s => [s, true]));
}

async function loadAll() {
  return new Promise(resolve => {
    chrome.storage.sync.get([...SITES, "schedule"], stored => {
      const defaults = getDefaultState();
      resolve({ ...defaults, ...stored });
    });
  });
}

function notifyAllTabs(message) {
  chrome.tabs.query({}, tabs => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, message).catch(() => {});
    });
  });
}

const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];

function updateDayPickerUI(days) {
  const activeDays = new Set(days);
  document.querySelectorAll(".day-btn").forEach(btn => {
    btn.classList.toggle("active", activeDays.has(Number(btn.dataset.day)));
  });
}

function updateScheduleUI(enabled, start, end, days) {
  const timesEl = document.getElementById("schedule-times");
  const hintEl  = document.getElementById("schedule-hint");

  timesEl.classList.toggle("visible", enabled);
  updateDayPickerUI(days ?? ALL_DAYS);

  if (enabled) {
    const now = new Date();
    const cur = now.getHours() * 60 + now.getMinutes();
    const today = now.getDay();
    const activeDays = days ?? ALL_DAYS;

    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    const s = sh * 60 + sm;
    const e = eh * 60 + em;
    const inTimeRange = s <= e ? cur >= s && cur < e : cur >= s || cur < e;
    const inDays = activeDays.includes(today);

    hintEl.textContent = (inTimeRange && inDays)
      ? `现在屏蔽中（至 ${end}）`
      : `现在未屏蔽`;
    hintEl.classList.add("visible");
  } else {
    hintEl.classList.remove("visible");
    hintEl.textContent = "";
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const state = await loadAll();

  // Site toggles
  for (const site of SITES) {
    const checkbox = document.getElementById(`toggle-${site}`);
    checkbox.checked = state[site];
    checkbox.addEventListener("change", () => {
      chrome.storage.sync.set({ [site]: checkbox.checked }, () => {
        notifyAllTabs({ type: "TOGGLE", site, enabled: checkbox.checked });
      });
    });
  }

  // Schedule
  const schedule = state.schedule || { enabled: false, start: "09:00", end: "18:00", days: ALL_DAYS };
  const scheduleEnabledEl = document.getElementById("schedule-enabled");
  const startEl           = document.getElementById("schedule-start");
  const endEl             = document.getElementById("schedule-end");

  let selectedDays = schedule.days ?? ALL_DAYS;

  scheduleEnabledEl.checked = schedule.enabled;
  startEl.value = schedule.start || "09:00";
  endEl.value   = schedule.end   || "18:00";
  updateScheduleUI(schedule.enabled, startEl.value, endEl.value, selectedDays);

  function saveSchedule() {
    const updated = {
      enabled: scheduleEnabledEl.checked,
      start:   startEl.value,
      end:     endEl.value,
      days:    selectedDays,
    };
    chrome.storage.sync.set({ schedule: updated }, () => {
      notifyAllTabs({ type: "SCHEDULE_CHANGED" });
    });
    updateScheduleUI(updated.enabled, updated.start, updated.end, updated.days);
  }

  document.querySelectorAll(".day-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const day = Number(btn.dataset.day);
      if (selectedDays.includes(day)) {
        selectedDays = selectedDays.filter(d => d !== day);
      } else {
        selectedDays = [...selectedDays, day];
      }
      saveSchedule();
    });
  });

  scheduleEnabledEl.addEventListener("change", saveSchedule);
  startEl.addEventListener("change", saveSchedule);
  endEl.addEventListener("change",   saveSchedule);
});
