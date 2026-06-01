const SITES = ["bilibili", "xiaohongshu", "instagram"];

function getDefaultState() {
  return Object.fromEntries(SITES.map(s => [s, true]));
}

async function loadState() {
  return new Promise(resolve => {
    chrome.storage.sync.get(SITES, stored => {
      const defaults = getDefaultState();
      resolve({ ...defaults, ...stored });
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const state = await loadState();

  for (const site of SITES) {
    const checkbox = document.getElementById(`toggle-${site}`);
    checkbox.checked = state[site];

    checkbox.addEventListener("change", () => {
      const update = { [site]: checkbox.checked };
      chrome.storage.sync.set(update);

      // Tell the active tab's content script to re-evaluate immediately
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, { type: "TOGGLE", site, enabled: checkbox.checked })
            .catch(() => {}); // ignore if content script not present on this tab
        }
      });
    });
  }
});
