// src/components/SkillReading.tsx
import React, { useState, useEffect } from 'react';
import type { ReadingStory } from '../data/lessonsData';
import { speakEnglish, stopSpeaking } from '../utils/ttsHelper';

interface SkillReadingProps {
  story: ReadingStory;
  onBack: () => void;
  onAddStars: (stars: number) => void;
  onFinishLesson?: () => void;
}

export const SkillReading: React.FC<SkillReadingProps> = ({ story, onBack, onAddStars, onFinishLesson }) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [gradedQuestions, setGradedQuestions] = useState<Record<number, boolean>>({});
  const [showTranslation, setShowTranslation] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [highlightedWord, setHighlightedWord] = useState<string | null>(null);

  useEffect(() => {
    return () => { stopSpeaking(); };
  }, []);

  const handleWordClick = (word: string) => {
    const clean = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, '').trim();
    if (!clean) return;
    setHighlightedWord(clean);
    speakEnglish({
      text: clean, speed: 0.85, pitch: 1.2,
      onEnd: () => setHighlightedWord(null),
      onError: () => setHighlightedWord(null),
    });
  };

  const handleSpeakStory = () => {
    speakEnglish({ text: story.text, speed: 0.9, pitch: 1.1 });
  };

  const currentQuestion = story.questions[currentQuestionIdx];
  const selected = selectedAnswers[currentQuestion.id];
  const isGraded = gradedQuestions[currentQuestion.id];
  const isCorrect = selected === currentQuestion.correctAnswer;

  const handleAnswerSelect = (option: string) => {
    if (isGraded) return;
    setSelectedAnswers(prev => ({ ...prev, [currentQuestion.id]: option }));
  };

  const handleCheckAnswer = () => {
    if (!selected || isGraded) return;

    setGradedQuestions(prev => ({ ...prev, [currentQuestion.id]: true }));
    if (selected === currentQuestion.correctAnswer) {
      setEarnedStars(prev => prev + 5);
      onAddStars(5);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx + 1 < story.questions.length) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setIsFinished(true);
      onFinishLesson?.();
    }
  };

  const renderInteractiveText = (text: string) => {
    return text.split('\n').map((para, pIdx) => (
      <p key={pIdx} className="mb-3 leading-loose">
        {para.split(/\s+/).map((word, wIdx) => {
          const clean = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, '').trim();
          const isHl = clean.toLowerCase() === highlightedWord?.toLowerCase();
          return (
            <span
              key={wIdx}
              onClick={() => handleWordClick(word)}
              title="Bấm để nghe phát âm"
              className={`cursor-pointer rounded px-0.5 transition-colors ${isHl
                  ? 'bg-purple-200 text-purple-900 font-bold'
                  : 'hover:bg-purple-100 hover:text-purple-700'
                }`}
            >
              {word}{' '}
            </span>
          );
        })}
      </p>
    ));
  };

  if (isFinished) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-8 bg-white rounded-3xl p-10 shadow-xl flex flex-col items-center justify-center text-center gap-6 border border-outline-variant/30">
        <span className="text-6xl drop-shadow-md mb-4">🎉🏆📖</span>
        <h2 className="text-2xl md:text-3xl font-black text-on-surface mb-2">Chúc mừng bé đã hoàn thành phần ĐỌC!</h2>
        <p className="text-on-surface-variant text-base mb-6">Bé đọc và hiểu bài rất xuất sắc! Bé đã có kỹ năng đọc rất tốt.</p>
        <div className="flex items-center gap-3 bg-yellow-50 px-6 py-4 rounded-2xl border border-yellow-200 mb-8">
          <span className="text-3xl">⭐</span>
          <span className="text-lg text-yellow-800">Bé nhận được <strong className="text-yellow-600 text-xl">+{earnedStars}</strong> Ngôi sao</span>
        </div>
        <button className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition shadow-lg" onClick={onBack}>
          Quay lại chọn kỹ năng khác
        </button>
      </div>
    );
  }

  return (
    <main className="w-full max-w-5xl mx-auto flex flex-col gap-6 pt-6 pb-12 px-4 md:px-0">

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
              style={{ width: `${((currentQuestionIdx + 1) / story.questions.length) * 100}%`, backgroundColor: '#4A90E2' }}
            ></div>
          </div>
        </div>

        {/* Bên Phải: Text câu hỏi */}
        <div className="progress-text text-sm font-bold text-on-surface whitespace-nowrap flex items-center leading-none mt-0.5">
          Câu hỏi {currentQuestionIdx + 1} / {story.questions.length}
        </div>
      </div>

      {/* Reading Layout: 1 col mobile, 2 col desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left: Story */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-outline-variant/30 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
            <h3 className="text-xl font-bold text-gray-800">{story.title}</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleSpeakStory}
                className="bg-blue-50 text-blue-600 font-bold py-2 px-4 rounded-full text-sm hover:bg-blue-100 transition"
              >
                🔊 Đọc toàn bài
              </button>
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className="bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded-full text-sm hover:bg-gray-200 transition"
              >
                {showTranslation ? '🙈 Ẩn dịch' : '👁️ Xem dịch'}
              </button>
            </div>
          </div>

          <div className="text-gray-700 text-lg bg-orange-50/50 rounded-2xl p-5 border border-orange-100">
            {renderInteractiveText(story.text)}
          </div>

          <p className="text-sm text-gray-500 text-center italic">
            💡 Bé hãy nhấp vào <strong>bất kỳ từ nào</strong> để nghe phát âm chuẩn nhé!
          </p>

          {showTranslation && (
            <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100 mt-4">
              <h4 className="text-sm text-purple-800 font-bold mb-2">Dịch nghĩa:</h4>
              <p className="text-purple-900 text-sm">{story.translation}</p>
            </div>
          )}
        </div>

        {/* Right: Comprehension Questions (Paginated) */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-outline-variant/30 flex flex-col">
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full font-bold text-sm">
              📖 Luyện Đọc
            </span>
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Bé hãy trả lời câu hỏi sau:</h3>

          <div className="bg-gray-50 rounded-2xl p-5 space-y-6 flex-1 flex flex-col">
            <p className="text-lg text-gray-800 font-bold text-center">
              {currentQuestion.questionText}
            </p>

            <div className="grid grid-cols-1 gap-3 mt-4">
              {currentQuestion.options.map(option => {
                const isCorrectOption = isGraded && option === currentQuestion.correctAnswer;
                const isWrongSelected = isGraded && selected === option && option !== currentQuestion.correctAnswer;
                const isSelected = selected === option;

                return (
                  <button
                    key={option}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={isGraded}
                    className={`py-4 px-4 rounded-2xl font-bold text-base border-2 transition-all text-left ${isCorrectOption
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : isWrongSelected
                          ? 'bg-red-100 border-red-500 text-red-700'
                          : isSelected
                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'
                      }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            <div className="mt-auto pt-6">
              {!isGraded ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={!selected}
                  className="w-full bg-[#1ab088] text-white font-bold py-4 rounded-2xl text-lg hover:bg-[#159472] transition disabled:opacity-40 shadow-sm"
                >
                  Kiểm tra
                </button>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className={`text-center font-bold text-base py-3 rounded-xl ${isCorrect ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>
                    {isCorrect ? '🌟 Đúng rồi! Bé giỏi quá (+5⭐)' : `❌ Chưa đúng — Đáp án là: ${currentQuestion.correctAnswer}`}
                  </div>
                  <button
                    onClick={handleNextQuestion}
                    className="w-full bg-[#1ab088] text-white font-bold py-4 rounded-2xl text-lg hover:bg-[#159472] transition shadow-sm"
                  >
                    {currentQuestionIdx + 1 === story.questions.length ? 'Hoàn thành 🏆' : 'Câu tiếp theo ➔'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};