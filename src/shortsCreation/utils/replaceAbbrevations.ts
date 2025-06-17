export function replaceRedditAbbreviations(text: string) {
  const replacements = {
    "\\bOP\\b": "Original Poster",
    "\\bTL;DR\\b": "Too Long; Didn’t Read",
    "\\bIMO\\b": "In My Opinion",
    "\\bIMHO\\b": "In My Humble Opinion",
    "\\bAITA\\b": "Am I The Asshole",
    "\\bNSFW\\b": "Not Safe For Work",
    "\\bTIL\\b": "Today I Learned",
    "\\bELI5\\b": "Explain Like I’m 5",
    "\\bAMA\\b": "Ask Me Anything",
    "\\bFTFY\\b": "Fixed That For You",
    "\\bIIRC\\b": "If I Recall Correctly",
    "\\bEDIT\\b": "Edit",
    "\\bETA\\b": "Edited To Add",
    "\\bLOL\\b": "Laughing Out Loud",
    "\\bSMH\\b": "Shaking My Head",
    "\\bYOLO\\b": "You Only Live Once",
    "\\bNTA\\b": "Not the asshole",
    "\\bWTF\\b": "What the frick",
    "\\bTIFU\\b": "Today I fricked up",
    "\\bLMAO\\b": "Laughing my arse off",
    "\\bLPT\\b": "Life pro tips",
  };

  for (const abbr in replacements) {
    const regex = new RegExp(abbr, "gi");
    text = text.replace(regex, replacements[abbr]);
  }

  return text;
}
