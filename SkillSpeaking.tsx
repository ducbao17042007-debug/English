// src/components/SkillSpeaking.tsx
import React, { useState, useEffect, useRef } from 'react';
import type { SpeakingPhrase } from '../data/lessonsData';
import { speakEnglish } from '../utils/ttsHelper';
import { getSpeechRecognition, evaluatePronunciation } from '../utils/speechRecHelper';
import type { WordStatus } from '../utils/speechRecHelper';

interface SkillSpeakingProps {
  phrases: SpeakingPhrase[];
  onBack: () => void;
  onAddStars: (stars: number) => void;
  onPhraseAttempt?: () => void;
  onFinishLesson?: () => void;
}

export const SkillSpeaking: React.FC<SkillSpeakingProps> = ({ phrases, onBack, onAddStars, onPhraseAttempt, onFinishLesson }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [wordStatuses, setWordStatuses] = useState<WordStatus[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);
  const [isTtsPlaying, setIsTtsPlaying] = useState(false);
  const [recognitionError, setRecognitionError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const phrase = phrases[currentIdx];

  // Initialize Speech Recognition
  useEffect(() => {
    const rec = getSpeechRecognition();
    if (!rec) {
      setRecognitionError(
        "Trình duyệt của bé không hỗ trợ Ghi âm giọng nói. Hãy dùng trình duyệt Chrome/Edge để luyện Nói nhé!"
      );
    } else {
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsRecording(true);
        setTranscript('');
        setScore(null);
        setWordStatuses([]);
      };

      rec.onresult = (event: any) => {
        const resultText = event.results[0][0].transcript;
        setTranscript(resultText);

        const evaluation = evaluatePronunciation(phrase.text, resultText);
        setScore(evaluation.score);
        setWordStatuses(evaluation.wordStatuses);

        let starsAwarded = 0;
        if (evaluation.score >= 80) {
          starsAwarded = 5;
        } else if (evaluation.score >= 50) {
          starsAwarded = 3;
        }
        if (starsAwarded > 0) {
          setEarnedStars(prev => prev + starsAwarded);
          onAddStars(starsAwarded);
        }
        // Mỗi lần bé nói và được chấm điểm đều tính là 1 lần luyện nói (cho mission daily)
        onPhraseAttempt?.();
      };

      rec.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          setRecognitionError("Bé chưa cho phép máy sử dụng Microphone. Hãy đồng ý cho Chrome dùng mic ở thanh địa chỉ nhé!");
        } else {
          setRecognitionError("Không nghe thấy bé nói... Bé hãy nói lại to rõ hơn nhé!");
        }
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [currentIdx, phrase]);

  const handleListenGuide = () => {
    setIsTtsPlaying(true);
    speakEnglish({
      text: phrase.text,
      speed: 0.9,
      pitch: 1.2,
      onEnd: () => setIsTtsPlaying(false),
      onError: () => setIsTtsPlaying(false)
    });
  };

  const handleStartRecording = () => {
    setRecognitionError(null);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        recognitionRef.current.stop();
      }
    }
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleNext = () => {
    setTranscript('');
    setScore(null);
    setWordStatuses([]);
    setRecognitionError(null);

    if (currentIdx + 1 < phrases.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setIsFinished(true);
      onFinishLesson?.();
    }
  };

  if (isFinished) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-8 bg-white rounded-3xl p-10 shadow-xl flex flex-col items-center justify-center text-center gap-6 border border-outline-variant/30">
        <span className="text-6xl drop-shadow-md">🎉🏆🗣️</span>
        <h2 className="text-2xl md:text-3xl font-black text-on-surface">Chúc mừng bé đã hoàn thành phần NÓI!</h2>
        <p className="text-on-surface-variant text-base">Bé nói tiếng Anh rất siêu! Hãy tiếp tục phát huy nhé.</p>
        <div className="flex items-center gap-3 bg-yellow-50 px-6 py-4 rounded-2xl border border-yellow-200">
          <span className="text-3xl">⭐</span>
          <span className="text-lg text-yellow-800">Bé nhận được <strong className="text-yellow-600 text-xl">+{earnedStars}</strong> Ngôi sao</span>
        </div>
        <button className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition shadow-lg mt-4" onClick={onBack}>
          Quay lại chọn kỹ năng khác
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 pt-6 pb-12 px-4 md:px-0">

      {/* Header - Đã fix căn chỉnh thẳng hàng & kéo dài thanh tiến trình giống Listening */}
      <div className="practice-header flex justify-between items-center bg-white p-4 md:px-6 rounded-2xl shadow-sm w-full border border-outline-variant/30">
        {/* Bên Trái: Nút thoát */}
        <button className="back-link-btn text-primary font-bold flex items-center gap-2 hover:opacity-80 transition" onClick={onBack}>
          <span className="flex items-center text-lg leading-none">⬅️</span>
          <span className="leading-none mt-0.5">Thoát luyện tập</span>
        </button>

        {/* Ở Giữa: Thanh tiến trình */}
        <div className="hidden sm:flex flex-1 max-w-2xl mx-8 items-center">
          <div className="progress-bar w-full h-2.5 bg-surface-variant rounded-full overflow-hidden">
            <div
              className="progress-fill h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / phrases.length) * 100}%`, backgroundColor: '#4A90E2' }}
            ></div>
          </div>
        </div>

        {/* Bên Phải: Text câu hỏi */}
        <div className="progress-text text-sm font-bold text-on-surface whitespace-nowrap flex items-center leading-none mt-0.5">
          Câu nói {currentIdx + 1} / {phrases.length}
        </div>
      </div>

      <div className="w-full bg-white rounded-3xl shadow-md p-6 md:p-10 border border-outline-variant/30 flex flex-col items-center text-center">

        {/* Badge Giống thiết kế Nghe */}
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full font-bold text-sm">
            🗣️ Luyện Nói
          </span>
        </div>

        {/* Visual Cue */}
        <div className="text-7xl mb-6 drop-shadow-sm">
          {phrase.visual}
        </div>

        {/* Target Phrase */}
        <div className="mb-6 w-full max-w-2xl">
          {wordStatuses.length > 0 ? (
            <div className="text-3xl font-black mb-2 flex flex-wrap justify-center gap-2">
              {wordStatuses.map((ws, idx) => (
                <span
                  key={idx}
                  className={`${ws.isCorrect ? 'text-green-500' : 'text-red-500 underline decoration-red-300 decoration-wavy'}`}
                >
                  {ws.word}{' '}
                </span>
              ))}
            </div>
          ) : (
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-3">{phrase.text}</h2>
          )}
          <p className="text-lg text-gray-500">{phrase.translation}</p>
        </div>

        {/* Speaker Guide Button */}
        <button
          onClick={handleListenGuide}
          className={`mb-8 px-6 py-3 rounded-full font-bold transition-all flex items-center gap-2 ${isTtsPlaying ? 'bg-blue-100 text-blue-700 scale-95' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          🔊 Nghe Teddy đọc mẫu
        </button>

        {/* Recorder Mic Section */}
        <div className="w-full flex flex-col items-center gap-4 mb-8">
          {recognitionError && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg border border-red-200 text-sm max-w-lg">
              ⚠️ {recognitionError}
            </div>
          )}

          <div className="relative">
            {!isRecording ? (
              <button
                onClick={handleStartRecording}
                className="px-10 py-5 bg-[#1ab088] text-white text-xl font-black rounded-full shadow-lg hover:bg-[#159472] hover:scale-105 transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!!recognitionError && recognitionError.includes('hỗ trợ')}
              >
                🎙️ Bấm để Nói
              </button>
            ) : (
              <button onClick={handleStopRecording} className="px-10 py-5 bg-red-500 text-white text-xl font-black rounded-full shadow-lg animate-pulse flex items-center gap-3 relative">
                <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-50"></span>
                <span className="relative z-10">⏹️ Đang nghe bé nói...</span>
              </button>
            )}
          </div>
        </div>

        {/* Evaluation Output */}
        {score !== null && (
          <div className="w-full max-w-xl mx-auto bg-gray-50 rounded-2xl p-6 border border-gray-200 flex flex-col items-center gap-4 mb-8">
            <div className="flex flex-col items-center">
              <div className="text-5xl font-black" style={{ color: score >= 80 ? '#2ECC71' : score >= 50 ? '#F39C12' : '#E74C3C' }}>
                {score}%
              </div>
              <p className="text-sm text-gray-500 font-bold uppercase mt-1">Độ chính xác</p>
            </div>

            <div className="w-full bg-white p-4 rounded-xl border border-gray-100 text-center">
              <p className="text-xs text-gray-400 uppercase font-bold mb-1">Máy nghe được:</p>
              <p className="text-lg text-gray-700 italic">"{transcript || '...'}"</p>
            </div>

            <div className="text-center font-bold">
              {score >= 80 ? (
                <span className="text-green-600">⭐ Tuyệt vời! Bé phát âm chuẩn như người bản xứ! (+5⭐)</span>
              ) : score >= 50 ? (
                <span className="text-yellow-600">⭐ Khá tốt! Bé cố gắng phát âm rõ các từ chưa đúng nhé! (+3⭐)</span>
              ) : (
                <span className="text-red-500">Bé nói gần được rồi! Hãy nghe Teddy phát âm mẫu và thử lại nhé!</span>
              )}
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-auto w-full max-w-sm">
          {score !== null && (
            <button
              className="w-full px-8 py-4 bg-[#1ab088] text-white text-lg font-bold rounded-2xl hover:bg-[#159472] transition shadow-md"
              onClick={handleNext}
            >
              {currentIdx + 1 === phrases.length ? 'Hoàn thành 🏆' : 'Câu tiếp theo ➔'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};