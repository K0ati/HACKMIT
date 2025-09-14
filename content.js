function applyFont(font) {
  removeFont(); // clear old style first

  if (font === "normal") return;

  const style = document.createElement("style");
  style.id = "font-chooser-style";
  style.innerHTML = `
    *:not([class*="icon"]):not(i) {
      font-family: "${font}" !important;
      line-height: 1.4em !important;
    }
  `;
  document.head.appendChild(style);
}

function removeFont() {
  const style = document.getElementById("font-chooser-style");
  if (style) style.remove();
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "setFont") {
    applyFont(msg.font);
    if (msg.scroll) window.scrollTo(msg.scroll.x, msg.scroll.y);
  }
});
