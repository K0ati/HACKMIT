// Listen for messages from popup or elsewhere
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "setActiveIcon") {
    chrome.action.setIcon({
      path: {
        "16": "icon-active-16.png",
        "48": "icon-active-48.png",
        "128": "icon-active-128.png"
      }
    });
    sendResponse({ok: true});
  } else if (msg.action === "setDefaultIcon") {
    chrome.action.setIcon({
      path: {
        "16": "icon-default-16.png",
        "48": "icon-default-48.png",
        "128": "icon-default-128.png"
      }
    });
    sendResponse({ok: true});
  }
});
