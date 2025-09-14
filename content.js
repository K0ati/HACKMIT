// Function to apply dyslexia-friendly spacing to the selected text
function adjustSelectedText() {
  const selection = window.getSelection();// Get the text the user highlighted
  if (!selection.rangeCount) return;  // Stop if nothing is selected

  const range = selection.getRangeAt(0);  // Get the first selected text range
  const selectedText = range.toString();  // Convert it to plain text

  const span = document.createElement("span"); // Wrap text in a span for styling
  span.style.wordSpacing = "0.3em";      // dyslexia-friendly word spacing
  span.style.letterSpacing = "0.05em";   // dyslexia-friendly letter spacing
  span.textContent = selectedText;  // Put the selected text in the span

  range.deleteContents(); // Remove the original text
  range.insertNode(span); // Insert the styled span in its place
}
// Run immediately when the script executes
adjustSelectedText();
