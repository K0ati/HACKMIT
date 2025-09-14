document.addEventListener("DOMContentLoaded", async () => {

  let selector = document.getElementById("fontSelector");
  let button = document.getElementById("apply");

  // Load last choice
  let { font } = await chrome.storage.local.get("font");
  if (font) selector.value = font;

  button.addEventListener("click", async () => {
    let chosenFont = selector.value;
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Save scroll position before changing
    let [{ result: scroll }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => ({ x: window.scrollX, y: window.scrollY })
    });


    // Inject script & send font choice
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    }, () => {
      chrome.tabs.sendMessage(tab.id, { action: "setFont", font: chosenFont, scroll });
    });

    // Save preference
    chrome.storage.local.set({ font: chosenFont });
  });
});
