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

function updateScheduleUI(enabled, start, end) {
  const timesEl = document.getElementById("schedule-times");
  const hintEl  = document.getElementById("schedule-hint");

  timesEl.classList.toggle("visible", enabled);

  if (enabled) {
    const now = new Date();
    const cur = now.getHours() * 60 + now.getMinutes();
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    const s = sh * 60 + sm;
    const e = eh * 60 + em;
    const inside = s <= e ? cur >= s && cur < e : cur >= s || cur < e;
    hintEl.textContent = inside ? `现在屏蔽中（至 ${end}）` : `现在未屏蔽（将在 ${start} 开启）`;
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
      chrome.storage.sync.set({ [site]: checkbox.checked });
      notifyAllTabs({ type: "TOGGLE", site, enabled: checkbox.checked });
    });
  }

  // Schedule
  const schedule = state.schedule || { enabled: false, start: "09:00", end: "18:00" };
  const scheduleEnabledEl = document.getElementById("schedule-enabled");
  const startEl           = document.getElementById("schedule-start");
  const endEl             = document.getElementById("schedule-end");

  scheduleEnabledEl.checked = schedule.enabled;
  startEl.value = schedule.start || "09:00";
  endEl.value   = schedule.end   || "18:00";
  updateScheduleUI(schedule.enabled, startEl.value, endEl.value);

  function saveSchedule() {
    const updated = {
      enabled: scheduleEnabledEl.checked,
      start: startEl.value,
      end:   endEl.value,
    };
    chrome.storage.sync.set({ schedule: updated });
    notifyAllTabs({ type: "SCHEDULE_CHANGED" });
    updateScheduleUI(updated.enabled, updated.start, updated.end);
  }

  scheduleEnabledEl.addEventListener("change", saveSchedule);
  startEl.addEventListener("change", saveSchedule);
  endEl.addEventListener("change",   saveSchedule);
});
