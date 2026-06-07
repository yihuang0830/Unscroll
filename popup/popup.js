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

  // Timer
  const timerToggleEl    = document.getElementById("timer-toggle");
  const timerSectionEl   = document.getElementById("timer-section");
  const timerStartView   = document.getElementById("timer-start-view");
  const timerActiveView  = document.getElementById("timer-active-view");
  const timerMinutesEl   = document.getElementById("timer-minutes");
  const timerStartBtn    = document.getElementById("timer-start-btn");
  const timerCancelBtn   = document.getElementById("timer-cancel-btn");
  const timerRemainingEl = document.getElementById("timer-remaining");

  let countdownInterval = null;

  function formatTime(ms) {
    const s = Math.max(0, Math.round(ms / 1000));
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  }

  function showTimerActive(endTime) {
    timerStartView.style.display  = "none";
    timerActiveView.style.display = "block";
    timerRemainingEl.textContent  = formatTime(endTime - Date.now());
    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
      const left = endTime - Date.now();
      if (left <= 0) {
        clearInterval(countdownInterval);
        showTimerIdle();
      } else {
        timerRemainingEl.textContent = formatTime(left);
      }
    }, 1000);
  }

  function showTimerIdle() {
    timerStartView.style.display  = "block";
    timerActiveView.style.display = "none";
  }

  chrome.storage.local.get("timer", ({ timer }) => {
    const active = timer && timer.active && timer.endTime > Date.now();
    if (active) {
      timerToggleEl.checked = true;
      timerSectionEl.classList.add("visible");
      showTimerActive(timer.endTime);
    } else {
      showTimerIdle();
    }
  });

  timerToggleEl.addEventListener("change", () => {
    timerSectionEl.classList.toggle("visible", timerToggleEl.checked);
  });

  timerStartBtn.addEventListener("click", () => {
    const minutes = parseInt(timerMinutesEl.value, 10);
    if (!minutes || minutes < 1 || minutes > 180) return;
    chrome.runtime.sendMessage({ type: "START_TIMER", minutes }, resp => {
      showTimerActive(resp.endTime);
    });
  });

  timerCancelBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "CANCEL_TIMER" }, () => {
      clearInterval(countdownInterval);
      showTimerIdle();
    });
  });
});
