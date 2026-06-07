function notifyAllTabs(message) {
  chrome.tabs.query({}, tabs => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, message).catch(() => {});
    });
  });
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "START_TIMER") {
    const endTime = Date.now() + msg.minutes * 60 * 1000;
    chrome.storage.local.set({ timer: { active: true, endTime } }, () => {
      chrome.alarms.create("unscroll-timer", { when: endTime });
      notifyAllTabs({ type: "TEMP_UNBLOCK" });
      sendResponse({ ok: true, endTime });
    });
    return true;
  }

  if (msg.type === "CANCEL_TIMER") {
    chrome.alarms.clear("unscroll-timer", () => {
      chrome.storage.local.set({ timer: { active: false } }, () => {
        notifyAllTabs({ type: "RESTORE_BLOCK" });
        sendResponse({ ok: true });
      });
    });
    return true;
  }
});

chrome.alarms.onAlarm.addListener(async alarm => {
  if (alarm.name !== "unscroll-timer") return;

  chrome.storage.local.set({ timer: { active: false } });
  notifyAllTabs({ type: "RESTORE_BLOCK" });

  chrome.notifications.create("unscroll-timer-done", {
    type: "basic",
    iconUrl: "icons/icon48.png",
    title: "时间到了！",
    message: "Feed 已重新屏蔽，回来专注吧",
    requireInteraction: false,
  });

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.url) return;
  const supported = ["bilibili.com", "xiaohongshu.com", "instagram.com", "youtube.com", "reddit.com"];
  if (supported.some(site => tab.url.includes(site))) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content/timer-overlay.js"],
    }).catch(() => {});
  }
});
