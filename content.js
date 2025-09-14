function applyComicSans() {
  if (!document.getElementById("comic-sans-style")) {
    const style = document.createElement("style");
    style.id = "comic-sans-style";
    style.innerHTML = `
      *:not([class*="icon"]):not(i) {
        font-family: "Comic Sans MS", cursive, sans-serif !important;
        line-height: 1.4em !important;
      }
    `;
    document.head.appendChild(style);
  }
}

function removeComicSans() {
  const style = document.getElementById("comic-sans-style");
  if (style) style.remove();
}

// Listen for popup messages
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "enable") {
    applyComicSans();
    if (msg.scroll) window.scrollTo(msg.scroll.x, msg.scroll.y);
  }
  if (msg.action === "disable") {
    removeComicSans();
    if (msg.scroll) window.scrollTo(msg.scroll.x, msg.scroll.y);
  }
});
