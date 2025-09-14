
document.addEventListener("mouseup", async () => {
  let selection = window.getSelection().toString().trim();
  if (selection.length === 0) return;

  // Send message to background to fetch synonyms and read
  chrome.runtime.sendMessage({ text: selection });

// content.js
function removeStyle() {
  const style = document.getElementById("font-chooser-style");
  if (style) style.remove();
}

function renderStyle({ font, letterSpacingEm, wordSpacingEm, lineHeightEm }) {
  const safeFont = font && font.toLowerCase() !== "normal" ? font : null;

  // Build CSS with current settings
  const css = `
    body, p, span, div, a, li, td, th, h1, h2, h3, h4, h5, h6 {
      ${safeFont ? `font-family: "${safeFont}" !important;` : ""}
      ${lineHeightEm != null ? `line-height: ${lineHeightEm}em !important;` : ""}
      ${wordSpacingEm != null ? `word-spacing: ${wordSpacingEm}em !important;` : ""}
      ${letterSpacingEm != null ? `letter-spacing: ${letterSpacingEm}em !important;` : ""}
    }

    /* Prevent changing icon fonts */
    [class*="icon"], i {
      font-family: initial !important;
      letter-spacing: initial !important;
      word-spacing: initial !important;
    }
  `;

  let style = document.getElementById("font-chooser-style");
  if (!style) {
    style = document.createElement("style");
    style.id = "font-chooser-style";
    document.head.appendChild(style);
  }
  style.textContent = css;
}

function applyStyle(payload) {
  // Normalize numbers; allow nulls to skip changing that property
  const toNum = (v) => (v === undefined || v === null || v === "" ? null : Number(v));
  const letterSpacingEm = toNum(payload.letterSpacingEm);
  const wordSpacingEm = toNum(payload.wordSpacingEm);
  const lineHeightEm = payload.lineHeightEm != null ? toNum(payload.lineHeightEm) : null;

  renderStyle({
    font: payload.font,
    letterSpacingEm,
    wordSpacingEm,
    lineHeightEm,
  });
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "setStyle") {
    applyStyle(msg);
    if (msg.scroll) window.scrollTo(msg.scroll.x, msg.scroll.y);
  }
  if (msg.action === "removeStyle") {
    removeStyle();
    if (msg.scroll) window.scrollTo(msg.scroll.x, msg.scroll.y);
  }

});

// Fires whenever selection changes (highlight added, removed, or altered)
document.addEventListener("selectionchange", handleSelectionChange);


let lastSelection = "";
let speaking = false;


function stopSpeech() {
 window.speechSynthesis.cancel();
 speaking = false;
}


function speakText(text) {
 stopSpeech();
 const utterance = new SpeechSynthesisUtterance(text);
 utterance.rate = 1.0;
 utterance.pitch = 1.0;
 utterance.onend = () => { speaking = false; };
 window.speechSynthesis.speak(utterance);
 speaking = true;
}


function handleSelectionChange() {
 const selection = window.getSelection().toString().trim();




 if (selection && selection !== lastSelection) {
   // New selection → speak it
   speakText(selection);
   lastSelection = selection;
 } else if (!selection && speaking) {
   // Selection cleared → stop
   stopSpeech();
   lastSelection = "";
 }
}