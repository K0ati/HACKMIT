document.addEventListener("mouseup", async () => {
  let selection = window.getSelection().toString().trim();
  if (selection.length === 0) return;

  // Send message to background to fetch synonyms and read
  chrome.runtime.sendMessage({ text: selection });
});
