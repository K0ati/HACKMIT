function applyFont(font) {
  removeFont(); // clear old style first

  if (font === "normal") return;

  const style = document.createElement("style");
  style.id = "font-chooser-style";
    style.innerHTML = `
      body, p, span, div, a, li, td, th, h1, h2, h3, h4, h5, h6 {
        font-family: "${font}" !important;
        line-height: 2.4em !important;
        word-spacing: 0.25em !important;
        letter-spacing: 0.2em !important;
      }

      /* Prevent changing icon fonts */
      [class*="icon"], i {
        font-family: initial !important;
        letter-spacing: initial !important;
        word-spacing: initial !important;
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
