function applyComicSans() {
  if (!document.getElementById("comic-sans-style")) {
    const style = document.createElement("style");
    style.id = "comic-sans-style";
    style.innerHTML = `
      body, p, span, div, a, li, td, th, h1, h2, h3, h4, h5, h6 {
        font-family: "Comic Sans MS", cursive, sans-serif !important;
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
