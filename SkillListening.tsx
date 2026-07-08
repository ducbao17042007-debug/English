// src/components/SkillListening.tsx
import React, { useState, useEffect } from 'react';
import type { ListeningQuestion } from '../data/lessonsData';
import { speakEnglish, stopSpeaking } from '../utils/ttsHelper';

interface SkillListeningProps {
  questions: ListeningQuestion[];
  onBack: () => void;
  onAddStars: (stars: number) => void;
  onFinishLesson?: () => void;
}

export const SkillListening: React.FC<SkillListeningProps> = ({ questions, onBack, onAddStars, onFinishLesson }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [writtenAnswer, setWrittenAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const question = questions[currentIdx];

  useEffect(() => {
    // Play automatically when question changes
    if (question) {
      handlePlayAudio(1.0);
    }
    return () => {
      stopSpeaking();
    };
  }, [currentIdx]);

  const handlePlayAudio = (speed: number = 1.0) => {
    if (!question) return;
    setIsPlaying(true);
    speakEnglish({
      text: question.audioText,
      speed: speed,
      pitch: 1.2,
      onEnd: () => setIsPlaying(false),
      onError: () => setIsPlaying(false)
    });
  };

  const handleSubmit = () => {
    if (isAnswered) return;

    let correct = false;
    if (question.type === 'choice') {
      correct = selectedOption === question.correctAnswer;
    } else {
      correct = writtenAnswer.trim().toLowerCase() === question.correctAnswer.toLowerCase();
    }

    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      setEarnedStars(prev => prev + 5);
      onAddStars(5);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setWrittenAnswer('');
    setIsAnswered(false);

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setIsFinished(true);
      onFinishLesson?.();
    }
  };

  if (isFinished) {
    return (
      <div className="skill-completion-screen w-full max-w-3xl mx-auto mt-8 bg-white rounded-3xl p-10 shadow-xl flex flex-col items-center justify-center text-center gap-6 border border-outline-variant/30">
        <span className="congrats-emoji text-6xl drop-shadow-md">🎉🏆🎧</span>
        <h2 className="text-2xl md:text-3xl font-black text-on-surface">Chúc mừng bé đã hoàn thành phần NGHE!</h2>
        <p className="text-on-surface-variant text-base">Bé thật tuyệt vời! Bé đã xuất sắc vượt qua các thử thách nghe.</p>
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

      {/* Header - Đã fix căn chỉnh thẳng hàng & kéo dài thanh tiến trình */}
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
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%`, backgroundColor: '#4A90E2' }}
            ></div>
          </div>
        </div>

        {/* Bên Phải: Text câu hỏi */}
        <div className="progress-text text-sm font-bold text-on-surface whitespace-nowrap flex items-center leading-none mt-0.5">
          Câu hỏi {currentIdx + 1} / {questions.length}
        </div>

      </div>

      <div className="practice-card w-full bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-outline-variant/30 flex flex-col items-center text-center">
        <div className="skill-badge listening inline-block bg-blue-100 text-blue-600 font-bold px-4 py-1 rounded-full mb-6 text-sm">🎧 Luyện Nghe</div>
        <h3 className="text-xl md:text-2xl font-bold text-on-surface mb-8">{question.questionText}</h3>

        {/* Audio Player Buttons */}
        <div className="audio-player-section flex flex-col items-center gap-4 mb-8">
          <div className={`audio-visualizer-circle ${isPlaying ? 'active' : ''} cursor-pointer relative`} onClick={() => handlePlayAudio(1.0)}>
            <span className="speaker-icon text-5xl relative z-10">🔊</span>
            {isPlaying && <div className="pulse-ring absolute inset-0 rounded-full animate-ping bg-blue-400 opacity-30"></div>}
          </div>
          <p className="audio-hint-text text-sm text-on-surface-variant">Bấm vào loa tròn hoặc nút dưới để nghe nhé!</p>
          <div className="audio-controls-row flex flex-wrap justify-center gap-4 mt-2">
            <button className="audio-play-btn fast px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition" onClick={() => handlePlayAudio(1.0)}>
              🔊 Nghe bình thường
            </button>
            <button className="audio-play-btn slow px-4 py-2 bg-green-50 text-green-600 rounded-lg font-semibold hover:bg-green-100 transition" onClick={() => handlePlayAudio(0.6)}>
              🐢 Nghe thật chậm
            </button>
          </div>
        </div>

        {/* Input/Option Sections */}
        <div className="answer-section w-full max-w-2xl mx-auto mb-8">
          {question.type === 'choice' ? (
            <div className="options-list grid grid-cols-1 sm:grid-cols-2 gap-4">
              {question.options?.map((option, idx) => (
                <button
                  key={idx}
                  className={`option-item-btn p-4 rounded-xl border-2 font-semibold transition-all ${selectedOption === option ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50'
                    } ${isAnswered && option === question.correctAnswer ? 'correct !border-green-500 !bg-green-50' : ''
                    } ${isAnswered && selectedOption === option && option !== question.correctAnswer ? 'incorrect !border-red-500 !bg-red-50' : ''}`}
                  onClick={() => !isAnswered && setSelectedOption(option)}
                  disabled={isAnswered}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <div className="writing-input-box w-full">
              <input
                type="text"
                value={writtenAnswer}
                onChange={(e) => !isAnswered && setWrittenAnswer(e.target.value)}
                placeholder="Nhập từ bé nghe thấy vào đây..."
                disabled={isAnswered}
                className="spell-input w-full p-4 text-center text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition disabled:bg-gray-50"
              />
            </div>
          )}
        </div>

        {/* Grading Feedback */}
        {isAnswered && (
          <div className={`feedback-banner w-full max-w-2xl mx-auto p-4 rounded-xl mb-8 flex flex-col items-center gap-2 ${isCorrect ? 'correct bg-green-100 text-green-800' : 'incorrect bg-red-100 text-red-800'}`}>
            <span className="feedback-emoji text-lg font-bold">{isCorrect ? '🌟 Đúng rồi! Excellent!' : '❌ Chưa chính xác rồi! Try again!'}</span>
            <p>
              Đáp án đúng là: <strong className="text-xl">{question.correctAnswer}</strong>
            </p>
          </div>
        )}

        {/* Submit & Next Controls */}
        <div className="action-row mt-auto">
          {!isAnswered ? (
            <button
              className="primary-btn submit-btn px-10 py-4 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={question.type === 'choice' ? !selectedOption : !writtenAnswer.trim()}
            >
              Nộp bài ➔
            </button>
          ) : (
            <button className="primary-btn next-btn px-10 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition shadow-lg animate-bounce" onClick={handleNext}>
              {currentIdx + 1 === questions.length ? 'Hoàn thành 🏆' : 'Câu tiếp theo ➔'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};