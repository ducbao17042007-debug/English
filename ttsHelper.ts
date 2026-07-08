// src/utils/ttsHelper.ts

export interface TTSOptions {
  text: string;
  speed?: number;
  pitch?: number;
  voiceName?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

export const getAvailableVoices = (): SpeechSynthesisVoice[] => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return window.speechSynthesis.getVoices();
  }
  return [];
};

export const speakEnglish = ({
  text,
  speed = 1.0,
  pitch = 1.1, // slightly higher pitch sounds friendlier for kids
  voiceName,
  onStart,
  onEnd,
  onError
}: TTSOptions): void => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = speed;
    utterance.pitch = pitch;

    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;
    if (onError) utterance.onerror = onError;

    const voices = window.speechSynthesis.getVoices();
    
    if (voiceName) {
      const selectedVoice = voices.find(v => v.name === voiceName);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    } else {
      // Default fallback logic to select high quality English voices (Google or Apple)
      const preferredVoice = voices.find(
        v => (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Zira')) &&
        (v.lang.startsWith('en-') || v.lang === 'en')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      } else {
        // Any English voice
        const englishVoice = voices.find(v => v.lang.startsWith('en'));
        if (englishVoice) utterance.voice = englishVoice;
      }
    }

    window.speechSynthesis.speak(utterance);
  } else {
    if (onError) {
      onError(new Error("Trình duyệt không hỗ trợ Text-to-Speech!"));
    } else {
      alert("Trình duyệt không hỗ trợ đọc văn bản!");
    }
  }
};

export const stopSpeaking = (): void => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};