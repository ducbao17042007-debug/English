// src/components/SkillWriting.tsx
import React, { useState, useEffect } from 'react';
import type { WritingTask } from '../data/lessonsData';
import { speakEnglish, stopSpeaking } from '../utils/ttsHelper';

interface SkillWritingProps {
  tasks: WritingTask[];
  onBack: () => void;
  onAddStars: (stars: number) => void;
}

export const SkillWriting: React.FC<SkillWritingProps> = ({ tasks, onBack, onAddStars }) => {
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
    }
  };

  if (isFinished) {
    return (
      <div className="skill-completion-screen">
        <span className="congrats-emoji">🎉🏆✍️</span>
        <h2>Chúc mừng bé đã hoàn thành phần VIẾT!</h2>
        <p>Bé viết tiếng Anh rất chuẩn xác! Cố gắng luyện tập đều đặn nhé.</p>
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
          <div className="progress-text">Thử thách {currentIdx + 1} / {tasks.length}</div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentIdx + 1) / tasks.length) * 100}%`, backgroundColor: '#E67E22' }}
            ></div>
          </div>
        </div>
      </div>

      <div className="practice-card">
        <div className="skill-badge writing">✍️ Luyện Viết</div>

        <h3>{task.prompt}</h3>

        {/* Visual Cue */}
        <div className="writing-visual-box">
          <span className="writing-emoji-hint">{task.visual}</span>
        </div>

        {/* Task Area */}
        <div className="writing-workspace">
          {task.type === 'unscramble' ? (
            <div className="unscramble-workspace">
              {/* Box showing current sentence built */}
              <div className="unscramble-result-box">
                {selectedWords.length === 0 ? (
                  <span className="placeholder-text">Nhấp các từ bên dưới để ghép thành câu...</span>
                ) : (
                  selectedWords.map((word, idx) => (
                    <span 
                      key={idx} 
                      className="word-chip selected"
                      onClick={() => handleRemoveSelectedWord(word, idx)}
                      title="Nhấp để xóa"
                    >
                      {word}
                    </span>
                  ))
                )}
              </div>

              {selectedWords.length > 0 && !isAnswered && (
                <button className="clear-all-chips-btn" onClick={handleClearSelected}>
                  🧹 Xóa tất cả
                </button>
              )}

              {/* Box showing available words */}
              {!isAnswered && (
                <div className="unscramble-available-box">
                  {availableWords.map((word, idx) => (
                    <button
                      key={idx}
                      className="word-chip available"
                      onClick={() => handleWordChipClick(word, idx)}
                    >
                      {word}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="spelling-workspace">
              <input
                type="text"
                value={typedAnswer}
                onChange={(e) => !isAnswered && setTypedAnswer(e.target.value)}
                placeholder="Nhập từ bé viết được vào đây..."
                disabled={isAnswered}
                className="spell-input"
              />
            </div>
          )}
        </div>

        {/* Grading Feedback */}
        {isAnswered && (
          <div className={`feedback-banner ${isCorrect ? 'correct' : 'incorrect'}`}>
            <div className="feedback-banner-header">
              <span className="feedback-emoji">{isCorrect ? '🌟 Bé giỏi lắm! Hoàn hảo!' : '❌ Chưa chính xác rồi! Bé hãy sửa lại nhé.'}</span>
              <button className="speaker-icon-btn" onClick={handleSpeakCorrect} title="Nghe câu trả lời">
                🔊 Nghe phát âm
              </button>
            </div>
            <p>
              Đáp án đúng là: <strong>{task.correctSentence}</strong>
            </p>
          </div>
        )}

        {/* Action Controls */}
        <div className="action-row">
          {!isAnswered ? (
            <button 
              className="primary-btn submit-btn" 
              onClick={handleSubmit}
              style={{ backgroundColor: '#E67E22' }}
              disabled={task.type === 'unscramble' ? selectedWords.length === 0 : !typedAnswer.trim()}
            >
              Kiểm tra đáp án ➔
            </button>
          ) : (
            <button 
              className="primary-btn next-btn" 
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
