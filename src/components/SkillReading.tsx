// src/components/SkillReading.tsx
import React, { useState, useEffect } from 'react';
import type { ReadingStory } from '../data/lessonsData';
import { speakEnglish, stopSpeaking } from '../utils/ttsHelper';

interface SkillReadingProps {
  story: ReadingStory;
  onBack: () => void;
  onAddStars: (stars: number) => void;
}

export const SkillReading: React.FC<SkillReadingProps> = ({ story, onBack, onAddStars }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [gradedQuestions, setGradedQuestions] = useState<Record<number, boolean>>({});
  const [showTranslation, setShowTranslation] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [highlightedWord, setHighlightedWord] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const handleWordClick = (word: string) => {
    // Clean word from punctuation
    const clean = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, '').trim();
    if (!clean) return;

    setHighlightedWord(clean);
    speakEnglish({
      text: clean,
      speed: 0.85,
      pitch: 1.2,
      onEnd: () => setHighlightedWord(null),
      onError: () => setHighlightedWord(null)
    });
  };

  const handleSpeakStory = () => {
    speakEnglish({
      text: story.text,
      speed: 0.9,
      pitch: 1.1
    });
  };

  const handleAnswerSelect = (questionId: number, option: string) => {
    if (gradedQuestions[questionId]) return; // Already graded

    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handleCheckAnswer = (questionId: number) => {
    const selected = selectedAnswers[questionId];
    if (!selected || gradedQuestions[questionId]) return;

    const question = story.questions.find(q => q.id === questionId);
    if (!question) return;

    const isCorrect = selected === question.correctAnswer;
    setGradedQuestions(prev => ({
      ...prev,
      [questionId]: true
    }));

    if (isCorrect) {
      setEarnedStars(prev => prev + 5);
      onAddStars(5);
    }
  };

  const handleFinish = () => {
    setIsFinished(true);
  };

  // Helper to split text into words for interactive reading
  const renderInteractiveText = (text: string) => {
    const paragraphs = text.split('\n');
    return paragraphs.map((para, pIdx) => {
      const words = para.split(/\s+/);
      return (
        <p key={pIdx} className="reading-paragraph">
          {words.map((word, wIdx) => {
            const clean = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, '').trim();
            const isWordHighlighted = clean.toLowerCase() === highlightedWord?.toLowerCase();
            return (
              <span
                key={wIdx}
                className={`interactive-word ${isWordHighlighted ? 'highlighted' : ''}`}
                onClick={() => handleWordClick(word)}
                title="Bấm để nghe phát âm"
              >
                {word}{' '}
              </span>
            );
          })}
        </p>
      );
    });
  };

  const allQuestionsAnswered = story.questions.every(q => gradedQuestions[q.id]);

  if (isFinished) {
    return (
      <div className="skill-completion-screen">
        <span className="congrats-emoji">🎉🏆📖</span>
        <h2>Chúc mừng bé đã hoàn thành phần ĐỌC!</h2>
        <p>Bé đọc và hiểu bài rất xuất sắc! Bé đã có kỹ năng đọc rất tốt.</p>
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
        <div className="reading-title-badge">📖 Luyện Đọc hiểu</div>
      </div>

      <div className="reading-layout">
        {/* Left Side: Story Text */}
        <div className="story-container-card">
          <div className="story-header">
            <h3>{story.title}</h3>
            <div className="story-header-actions">
              <button className="audio-play-btn fast" onClick={handleSpeakStory} style={{ margin: 0, padding: '8px 16px' }}>
                🔊 Đọc toàn bài
              </button>
              <button 
                className="secondary-btn" 
                onClick={() => setShowTranslation(!showTranslation)}
                style={{ margin: 0, padding: '8px 16px' }}
              >
                {showTranslation ? '🙈 Ẩn dịch nghĩa' : '👁️ Xem dịch nghĩa'}
              </button>
            </div>
          </div>

          <div className="story-body">
            <div className="interactive-story-text">
              {renderInteractiveText(story.text)}
            </div>
            <p className="reading-hint-msg">💡 Bé hãy nhấp vào <strong>bất kỳ từ nào</strong> ở trên để nghe phát âm chuẩn nhé!</p>

            {showTranslation && (
              <div className="story-translation-box">
                <h4>Dịch nghĩa:</h4>
                <p>{story.translation}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Reading Quizzes */}
        <div className="reading-quizzes-card">
          <h3>✍️ Trả lời câu hỏi Đọc hiểu:</h3>
          
          <div className="quizzes-list">
            {story.questions.map((q, idx) => {
              const selected = selectedAnswers[q.id];
              const isGraded = gradedQuestions[q.id];
              const isCorrect = selected === q.correctAnswer;

              return (
                <div key={q.id} className="reading-quiz-item">
                  <div className="quiz-question-header">
                    <span className="quiz-num">Câu {idx + 1}:</span>
                    <span className="quiz-question-text">{q.questionText}</span>
                  </div>
                  
                  <div className="quiz-options">
                    {q.options.map(option => (
                      <button
                        key={option}
                        onClick={() => handleAnswerSelect(q.id, option)}
                        className={`quiz-option-btn ${selected === option ? 'selected' : ''} ${
                          isGraded && option === q.correctAnswer ? 'correct' : ''
                        } ${isGraded && selected === option && option !== q.correctAnswer ? 'incorrect' : ''}`}
                        disabled={isGraded}
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  <div className="quiz-actions-row">
                    {!isGraded ? (
                      <button
                        onClick={() => handleCheckAnswer(q.id)}
                        className="check-btn"
                        disabled={!selected}
                      >
                        Kiểm tra câu này
                      </button>
                    ) : (
                      <div className={`quiz-feedback-tag ${isCorrect ? 'correct' : 'incorrect'}`}>
                        {isCorrect ? '🌟 Đúng (+5⭐)' : '❌ Chưa đúng'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* End Button */}
          {allQuestionsAnswered && (
            <button className="primary-btn finish-reading-btn" onClick={handleFinish}>
              Hoàn thành Luyện Đọc 🏆
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
