// src/utils/speechRecHelper.ts

export interface WordStatus {
  word: string;
  isCorrect: boolean;
}

export interface SpeechRecognitionResult {
  transcript: string;
  score: number;
  wordStatuses: WordStatus[];
}

export const getSpeechRecognition = () => {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognition) {
    return null;
  }
  return new SpeechRecognition();
};

export const evaluatePronunciation = (
  targetText: string,
  transcript: string
): { score: number; wordStatuses: WordStatus[] } => {
  const cleanWord = (w: string) =>
    w.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();

  const targetWords = targetText.split(/\s+/);
  const targetClean = targetWords.map(cleanWord).filter(Boolean);
  const transcriptClean = transcript.split(/\s+/).map(cleanWord).filter(Boolean);

  let matchCount = 0;
  // We keep track of checked indices in the transcript to avoid matching the same word multiple times
  const usedIndices = new Set<number>();

  const wordStatuses = targetWords.map((word) => {
    const cleaned = cleanWord(word);
    if (!cleaned) {
      return { word, isCorrect: true }; // spaces or empty punctuation
    }

    // Find the first matching word in transcript that hasn't been used yet
    const foundIndex = transcriptClean.findIndex(
      (tw, index) => tw === cleaned && !usedIndices.has(index)
    );

    if (foundIndex !== -1) {
      usedIndices.add(foundIndex);
      matchCount++;
      return { word, isCorrect: true };
    } else {
      return { word, isCorrect: false };
    }
  });

  const score = targetClean.length > 0 ? Math.round((matchCount / targetClean.length) * 100) : 0;

  return {
    score,
    wordStatuses
  };
};
