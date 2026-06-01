// Shared utility: apply or remove the hidden class on matched elements.
// Retries with MutationObserver because feeds are often injected after DOMContentLoaded.

const HIDDEN_CLASS = "focusfeed-hidden";

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
