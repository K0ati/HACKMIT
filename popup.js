// popup.js
document.addEventListener("DOMContentLoaded", async () => {
  const fontEl = document.getElementById("fontSelector");
  const letterEl = document.getElementById("letterSpacing");
  const wordEl = document.getElementById("wordSpacing");
  const lineEl = document.getElementById("lineHeight");
  const letterOut = document.getElementById("letterOut");
  const wordOut = document.getElementById("wordOut");
  const lineOut = document.getElementById("lineOut");
  const applyBtn = document.getElementById("apply");
  const resetBtn = document.getElementById("reset");

  // Defaults (feel free to tweak)
  const DEFAULTS = {
    font: "normal",
    letterSpacingEm: 0.05,
    wordSpacingEm: 0.25,
    lineHeightEm: 1.6,
  };

  // Load last saved settings
  const saved = await chrome.storage.local.get(["font", "letterSpacingEm", "wordSpacingEm", "lineHeightEm"]);
  const settings = {
    font: saved.font ?? DEFAULTS.font,
    letterSpacingEm: (saved.letterSpacingEm ?? DEFAULTS.letterSpacingEm),
    wordSpacingEm: (saved.wordSpacingEm ?? DEFAULTS.wordSpacingEm),
    lineHeightEm: (saved.lineHeightEm ?? DEFAULTS.lineHeightEm),
  };

  // Initialize UI
  fontEl.value = settings.font;
  letterEl.value = settings.letterSpacingEm;
  wordEl.value = settings.wordSpacingEm;
  lineEl.value = settings.lineHeightEm;
  letterOut.value = Number(letterEl.value).toFixed(2);
  wordOut.value = Number(wordEl.value).toFixed(2);
  lineOut.value = Number(lineEl.value).toFixed(2);

  // Update output bubbles on input
  letterEl.addEventListener("input", () => { letterOut.value = Number(letterEl.value).toFixed(2); });
  wordEl.addEventListener("input", () => { wordOut.value = Number(wordEl.value).toFixed(2); });
  lineEl.addEventListener("input", () => { lineOut.value = Number(lineEl.value).toFixed(2); });

  // Helper to get active tab and scroll position
  async function getTabAndScroll() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const [{ result: scroll }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => ({ x: window.scrollX, y: window.scrollY })
    });
    return { tab, scroll };
  }

  // Apply current UI settings to page
  async function applyCurrent() {
    const { tab, scroll } = await getTabAndScroll();

    const payload = {
      action: "setStyle",
      font: fontEl.value,
      letterSpacingEm: Number(letterEl.value),
      wordSpacingEm: Number(wordEl.value),
      lineHeightEm: Number(lineEl.value),
      scroll
    };

    // Ensure content.js is present, then message it
    chrome.scripting.executeScript(
      { target: { tabId: tab.id }, files: ["content.js"] },
      () => chrome.tabs.sendMessage(tab.id, payload)
    );

    // Persist settings
    await chrome.storage.local.set({
      font: payload.font,
      letterSpacingEm: payload.letterSpacingEm,
      wordSpacingEm: payload.wordSpacingEm,
      lineHeightEm: payload.lineHeightEm
    });
  }

  applyBtn.addEventListener("click", applyCurrent);

  resetBtn.addEventListener("click", async () => {
    fontEl.value = DEFAULTS.font;
    letterEl.value = DEFAULTS.letterSpacingEm;
    wordEl.value = DEFAULTS.wordSpacingEm;
    lineEl.value = DEFAULTS.lineHeightEm;
    letterOut.value = Number(letterEl.value).toFixed(2);
    wordOut.value = Number(wordEl.value).toFixed(2);
    lineOut.value = Number(lineEl.value).toFixed(2);
    await applyCurrent();
  });
});

document.getElementById("activate").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "setActiveIcon" }, res => {
    if (res && res.ok) window.close();
  });
});

document.getElementById("reset").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "setDefaultIcon" }, res => {
    if (res && res.ok) window.close();
  });
});
