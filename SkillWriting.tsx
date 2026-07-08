// src/components/SkillWriting.tsx
import React, { useState, useEffect } from 'react';
import type { WritingTask } from '../data/lessonsData';
import { speakEnglish, stopSpeaking } from '../utils/ttsHelper';

interface SkillWritingProps {
  tasks: WritingTask[];
  onBack: () => void;
  onAddStars: (stars: number) => void;
  onFinishLesson?: () => void;
}

export const SkillWriting: React.FC<SkillWritingProps> = ({ tasks, onBack, onAddStars, onFinishLesson }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);

  const task = tasks[currentIdx];

  useEffect(() => {
    // Setup for unscramble task
    if (task && task.type === 'unscramble' && task.scrambledWords) {
      // Create a shallow copy of scrambled words
      setAvailableWords([...task.scrambledWords]);
      setSelectedWords([]);
    } else {
      setTypedAnswer('');
    }
    return () => {
      stopSpeaking();
    };
  }, [currentIdx, task]);

  // Click on a word chip to add to selectedWords
  const handleWordChipClick = (word: string, index: number) => {
    if (isAnswered) return;

    setSelectedWords(prev => [...prev, word]);

    // Remove from availableWords
    const newAvail = [...availableWords];
    newAvail.splice(index, 1);
    setAvailableWords(newAvail);
  };

  // Click on a selected word to remove and return to availableWords
  const handleRemoveSelectedWord = (word: string, index: number) => {
    if (isAnswered) return;

    // Remove from selected
    const newSel = [...selectedWords];
    newSel.splice(index, 1);
    setSelectedWords(newSel);

    // Return to available
    setAvailableWords(prev => [...prev, word]);
  };

  const handleClearSelected = () => {
    if (isAnswered || !task.scrambledWords) return;
    setAvailableWords([...task.scrambledWords]);
    setSelectedWords([]);
  };

  const handleSpeakCorrect = () => {
    speakEnglish({
      text: task.correctSentence,
      speed: 0.9,
      pitch: 1.2
    });
  };

  const handleSubmit = () => {
    if (isAnswered) return;

    let correct = false;
    let finalAnswer = '';

    if (task.type === 'unscramble') {
      finalAnswer = selectedWords.join(' ').trim();
      correct = finalAnswer.toLowerCase() === task.correctSentence.toLowerCase();
    } else {
      finalAnswer = typedAnswer.trim();
      correct = finalAnswer.toLowerCase() === task.correctSentence.toLowerCase();
    }

    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      setEarnedStars(prev => prev + 5);
      onAddStars(5);
      // Speak the correct answer to reinforce learning!
      speakEnglish({ text: task.correctSentence, speed: 0.9 });
    }
  };

  const handleNext = () => {
    setIsAnswered(false);
    setSelectedWords([]);
    setAvailableWords([]);
    setTypedAnswer('');

    if (currentIdx + 1 < tasks.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setIsFinished(true);
      onFinishLesson?.();
    }
  };

  if (isFinished) {
    return (
      <div className="skill-completion-screen w-full max-w-3xl mx-auto mt-8 bg-white rounded-3xl p-10 shadow-xl flex flex-col items-center justify-center text-center gap-6 border border-outline-variant/30">
        <span className="congrats-emoji text-6xl drop-shadow-md">🎉🏆✍️</span>
        <h2 className="text-2xl md:text-3xl font-black text-on-surface">Chúc mừng bé đã hoàn thành phần VIẾT!</h2>
        <p className="text-on-surface-variant text-base">Bé viết tiếng Anh rất chuẩn xác! Cố gắng luyện tập đều đặn nhé.</p>
        <div className="earned-stars-box flex items-center gap-3 bg-yellow-50 px-6 py-4 rounded-2xl border border-yellow-200">
          <span className="star-big text-3xl">⭐</span>
          <span className="text-lg text-yellow-800">Bé nhận được <strong className="text-yellow-600 text-xl">+{earnedStars}</strong> Ngôi sao</span>
        </div>
        <button className="primary-btn large-btn mt-4 px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition shadow-lg" onClick={onBack}>
          Quay lại chọn kỹ năng khác
        </button>
      </div>
    );
  }

  return (
    <div className="skill-practice-container w-full max-w-4xl mx-auto flex flex-col gap-6">

      {/* Header - Đã đồng bộ căn chỉnh thẳng hàng & kéo dài thanh tiến trình giống Listening */}
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
              style={{ width: `${((currentIdx + 1) / tasks.length) * 100}%`, backgroundColor: '#E67E22' }}
            ></div>
          </div>
        </div>

        {/* Bên Phải: Text câu hỏi */}
        <div className="progress-text text-sm font-bold text-on-surface whitespace-nowrap flex items-center leading-none mt-0.5">
          Câu hỏi {currentIdx + 1} / {tasks.length}
        </div>

      </div>

      <div className="practice-card w-full bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-outline-variant/30 flex flex-col items-center text-center">
        <div className="skill-badge writing inline-block bg-orange-100 text-orange-600 font-bold px-4 py-1 rounded-full mb-6 text-sm">✍️ Luyện Viết</div>

        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">{task.prompt}</h3>

        {/* Visual Cue */}
        <div className="writing-visual-box text-6xl mb-8 drop-shadow-sm">
          <span className="writing-emoji-hint">{task.visual}</span>
        </div>

        {/* Task Area */}
        <div className="writing-workspace w-full max-w-2xl mx-auto mb-8">
          {task.type === 'unscramble' ? (
            <div className="unscramble-workspace flex flex-col gap-6">
              {/* Box showing current sentence built */}
              <div className="unscramble-result-box min-h-[80px] p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 flex flex-wrap items-center justify-center gap-3">
                {selectedWords.length === 0 ? (
                  <span className="placeholder-text text-gray-400 font-medium">Nhấp các từ bên dưới để ghép thành câu...</span>
                ) : (
                  selectedWords.map((word, idx) => (
                    <span
                      key={idx}
                      className="word-chip selected px-4 py-2 bg-orange-500 text-white font-bold rounded-xl shadow-sm cursor-pointer hover:bg-orange-600 hover:scale-105 transition-transform"
                      onClick={() => handleRemoveSelectedWord(word, idx)}
                      title="Nhấp để xóa"
                    >
                      {word}
                    </span>
                  ))
                )}
              </div>

              {selectedWords.length > 0 && !isAnswered && (
                <button className="clear-all-chips-btn text-sm font-bold text-gray-500 hover:text-red-500 self-center transition-colors" onClick={handleClearSelected}>
                  🧹 Xóa tất cả
                </button>
              )}

              {/* Box showing available words */}
              {!isAnswered && (
                <div className="unscramble-available-box flex flex-wrap justify-center gap-3 mt-4">
                  {availableWords.map((word, idx) => (
                    <button
                      key={idx}
                      className="word-chip available px-4 py-2 bg-white text-gray-800 font-bold border-2 border-gray-200 rounded-xl shadow-sm hover:border-orange-400 hover:bg-orange-50 hover:-translate-y-1 transition-all"
                      onClick={() => handleWordChipClick(word, idx)}
                    >
                      {word}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="spelling-workspace w-full">
              <input
                type="text"
                value={typedAnswer}
                onChange={(e) => !isAnswered && setTypedAnswer(e.target.value)}
                placeholder="Nhập từ bé viết được vào đây..."
                disabled={isAnswered}
                className="spell-input w-full p-4 text-center text-xl font-bold rounded-2xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition disabled:bg-gray-50"
              />
            </div>
          )}
        </div>

        {/* Grading Feedback */}
        {isAnswered && (
          <div className={`feedback-banner w-full max-w-2xl mx-auto p-5 rounded-2xl mb-8 flex flex-col items-center gap-3 ${isCorrect ? 'correct bg-green-100 text-green-800' : 'incorrect bg-red-100 text-red-800'}`}>
            <div className="feedback-banner-header flex items-center gap-3">
              <span className="feedback-emoji text-lg font-bold">{isCorrect ? '🌟 Bé giỏi lắm! Hoàn hảo!' : '❌ Chưa chính xác rồi! Bé hãy sửa lại nhé.'}</span>
              <button className="speaker-icon-btn p-2 bg-white/50 rounded-full hover:bg-white transition" onClick={handleSpeakCorrect} title="Nghe câu trả lời">
                🔊
              </button>
            </div>
            <p className="text-lg">
              Đáp án đúng là: <strong className="text-xl">{task.correctSentence}</strong>
            </p>
          </div>
        )}

        {/* Action Controls */}
        <div className="action-row mt-auto">
          {!isAnswered ? (
            <button
              className="primary-btn submit-btn px-10 py-4 text-white font-bold rounded-xl hover:opacity-90 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              style={{ backgroundColor: '#E67E22' }}
              disabled={task.type === 'unscramble' ? selectedWords.length === 0 : !typedAnswer.trim()}
            >
              Kiểm tra đáp án ➔
            </button>
          ) : (
            <button
              className="primary-btn next-btn px-10 py-4 text-white font-bold rounded-xl hover:opacity-90 transition shadow-lg animate-bounce"
              onClick={handleNext}
              style={{ backgroundColor: '#E67E22' }}
            >
              {currentIdx + 1 === tasks.length ? 'Hoàn thành 🏆' : 'Câu tiếp theo ➔'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};