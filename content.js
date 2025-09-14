// content.js


document.addEventListener('mouseup', () => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        // Use the Web Speech API for text-to-speech
        const utterance = new SpeechSynthesisUtterance(selectedText);
        speechSynthesis.speak(utterance);
    }
});
