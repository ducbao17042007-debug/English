// src/components/SkillListening.tsx
import React, { useState, useEffect } from 'react';
import type { ListeningQuestion } from '../data/lessonsData';
import { speakEnglish, stopSpeaking } from '../utils/ttsHelper';

interface SkillListeningProps {
  questions: ListeningQuestion[];
  onBack: () => void;
  onAddStars: (stars: number) => void;
}

export const SkillListening: React.FC<SkillListeningProps> = ({ questions, onBack, onAddStars }) => {
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
    }
  };

  if (isFinished) {
    return (
      <div className="skill-completion-screen">
        <span className="congrats-emoji">🎉🏆🎧</span>
        <h2>Chúc mừng bé đã hoàn thành phần NGHE!</h2>
        <p>Bé thật tuyệt vời! Bé đã xuất sắc vượt qua các thử thách nghe.</p>
        <div className="earned-stars-box">
          <span className="star-big">⭐</span>
          <span>Bé nhận được <strong>+{earnedStars}</strong> Ngôi sao</span>
        </div>
        <button className="primary-btn large-btn" onClick={onBack}>
          Quay lại chọn kỹ năng khác
        </button>
      </div>
    );
  }

  return (
    <div className="skill-practice-container">
      {/* Header */}
      <div className="practice-header">
        <button className="back-link-btn" onClick={onBack}>
          ⬅️ Thoát luyện tập
        </button>
        <div className="progress-bar-container">
          <div className="progress-text">Câu hỏi {currentIdx + 1} / {questions.length}</div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%`, backgroundColor: '#4A90E2' }}
            ></div>
          </div>
        </div>
      </div>

      <div className="practice-card">
        <div className="skill-badge listening">🎧 Luyện Nghe</div>
        <h3>{question.questionText}</h3>

        {/* Audio Player Buttons */}
        <div className="audio-player-section">
          <div className={`audio-visualizer-circle ${isPlaying ? 'active' : ''}`} onClick={() => handlePlayAudio(1.0)}>
            <span className="speaker-icon">🔊</span>
            {isPlaying && <div className="pulse-ring"></div>}
          </div>
          <p className="audio-hint-text">Bấm vào loa tròn hoặc nút dưới để nghe nhé!</p>
          <div className="audio-controls-row">
            <button className="audio-play-btn fast" onClick={() => handlePlayAudio(1.0)}>
              🔊 Nghe bình thường
            </button>
            <button className="audio-play-btn slow" onClick={() => handlePlayAudio(0.6)}>
              🐢 Nghe thật chậm (Giọng rùa)
            </button>
          </div>
        </div>

        {/* Input/Option Sections */}
        <div className="answer-section">
          {question.type === 'choice' ? (
            <div className="options-list">
              {question.options?.map((option, idx) => (
                <button
                  key={idx}
                  className={`option-item-btn ${selectedOption === option ? 'selected' : ''} ${
                    isAnswered && option === question.correctAnswer ? 'correct' : ''
                  } ${isAnswered && selectedOption === option && option !== question.correctAnswer ? 'incorrect' : ''}`}
                  onClick={() => !isAnswered && setSelectedOption(option)}
                  disabled={isAnswered}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <div className="writing-input-box">
              <input
                type="text"
                value={writtenAnswer}
                onChange={(e) => !isAnswered && setWrittenAnswer(e.target.value)}
                placeholder="Nhập từ bé nghe thấy vào đây..."
                disabled={isAnswered}
                className="spell-input"
              />
            </div>
          )}
        </div>

        {/* Grading Feedback */}
        {isAnswered && (
          <div className={`feedback-banner ${isCorrect ? 'correct' : 'incorrect'}`}>
            <span className="feedback-emoji">{isCorrect ? '🌟 Đúng rồi! Excellent!' : '❌ Chưa chính xác rồi! Try again!'}</span>
            <p>
              Đáp án đúng là: <strong>{question.correctAnswer}</strong>
            </p>
          </div>
        )}

        {/* Submit & Next Controls */}
        <div className="action-row">
          {!isAnswered ? (
            <button 
              className="primary-btn submit-btn" 
              onClick={handleSubmit} 
              disabled={question.type === 'choice' ? !selectedOption : !writtenAnswer.trim()}
            >
              Nộp bài ➔
            </button>
          ) : (
            <button className="primary-btn next-btn" onClick={handleNext}>
              {currentIdx + 1 === questions.length ? 'Hoàn thành 🏆' : 'Câu tiếp theo ➔'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
