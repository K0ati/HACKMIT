document.addEventListener("DOMContentLoaded", async () => {
  let button = document.getElementById("toggle");

  // Get saved state
  let { enabled } = await chrome.storage.local.get("enabled");
  if (enabled) button.textContent = "Turn Off";

  button.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Capture scroll position
    let [{ result: scroll }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => ({ x: window.scrollX, y: window.scrollY })
    });

    if (button.textContent === "Turn On") {
      // Enable Comic Sans
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
      }, () => {
        chrome.tabs.sendMessage(tab.id, { action: "enable", scroll });
      });

      button.textContent = "Turn Off";
      chrome.storage.local.set({ enabled: true });
    } else {
      // Disable Comic Sans
      chrome.tabs.sendMessage(tab.id, { action: "disable", scroll });
      button.textContent = "Turn On";
      chrome.storage.local.set({ enabled: false });
    }
  });
})
