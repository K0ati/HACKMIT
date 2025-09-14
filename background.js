const DATAMUSE_API = "https://api.datamuse.com/words?rel_syn=";

chrome.runtime.onMessage.addListener(async (message) => {
  const text = message.text;
  const words = text.split(/\s+/);

  if (words.length > 1) {
    // Multiple words selected, read as-is
    chrome.tts.speak(text, { rate: 1.0 });
    return;
  }

  const word = words[0].toLowerCase();

  try {
    const response = await fetch(DATAMUSE_API + encodeURIComponent(word));
    const data = await response.json();

    if (data.length > 0) {
      const synonyms = data.map(item => item.word);
      const speechText = `Synonyms for ${word} are: ${synonyms.join(", ")}`;
      chrome.tts.speak(speechText, { rate: 1.0 });
    } else {
      chrome.tts.speak(`No synonyms found for ${word}`, { rate: 1.0 });
    }
  } catch (err) {
    console.error(err);
    chrome.tts.speak(`Error fetching synonyms for ${word}`, { rate: 1.0 });
  }
});
