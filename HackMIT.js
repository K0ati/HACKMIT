chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "adjust-spacing", // Unique ID for this menu item
    title: "Adjust Dyslexic Spacing", // Text that appears in the right-click menu
    contexts: ["selection"] // Only show when some text is selected
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "adjust-spacing") {// Check if the clicked menu item is our "Adjust Dyslexic Spacing"
    chrome.scripting.executeScript({
      target: { tabId: tab.id },// Specify the tab where the click happened
      files: ["content.js"] // The script that changes word/letter spacing
    });
  }
});
