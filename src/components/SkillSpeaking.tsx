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
}

export const SkillSpeaking: React.FC<SkillSpeakingProps> = ({ phrases, onBack, onAddStars }) => {
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

        // Grade pronunciation
        const evaluation = evaluatePronunciation(phrase.text, resultText);
        setScore(evaluation.score);
        setWordStatuses(evaluation.wordStatuses);

        // Award stars based on score
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
      };

      rec.onerror = (event: any) => {
        console.error(event.error);
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
        // Recognition already started or other issue
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
    }
  };

  if (isFinished) {
    return (
      <div className="skill-completion-screen">
        <span className="congrats-emoji">🎉🏆🗣️</span>
        <h2>Chúc mừng bé đã hoàn thành phần NÓI!</h2>
        <p>Bé nói tiếng Anh rất siêu! Hãy tiếp tục phát huy nhé.</p>
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
          <div className="progress-text">Câu nói {currentIdx + 1} / {phrases.length}</div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentIdx + 1) / phrases.length) * 100}%`, backgroundColor: '#2ECC71' }}
            ></div>
          </div>
        </div>
      </div>

      <div className="practice-card">
        <div className="skill-badge speaking">🗣️ Luyện Nói</div>

        {/* Visual Cue */}
        <div className="speaking-visual-cue">
          <span className="phrase-visual-emoji">{phrase.visual}</span>
        </div>

        {/* Target Phrase */}
        <div className="speaking-phrase-box">
          {wordStatuses.length > 0 ? (
            <div className="colored-phrase">
              {wordStatuses.map((ws, idx) => (
                <span 
                  key={idx} 
                  className={`speak-word ${ws.isCorrect ? 'correct' : 'incorrect'}`}
                >
                  {ws.word}{' '}
                </span>
              ))}
            </div>
          ) : (
            <h2 className="target-phrase-text">{phrase.text}</h2>
          )}
          <p className="phrase-translation-text">{phrase.translation}</p>
        </div>

        {/* Speaker Guide Button */}
        <button 
          onClick={handleListenGuide} 
          className={`speak-guide-btn ${isTtsPlaying ? 'active' : ''}`}
        >
          🔊 Nghe Teddy đọc mẫu
        </button>

        {/* Recorder Mic Section */}
        <div className="speaking-recorder-section">
          {recognitionError && (
            <div className="mic-error-message">
              ⚠️ {recognitionError}
            </div>
          )}

          <div className="mic-control-wrapper">
            {!isRecording ? (
              <button 
                onClick={handleStartRecording} 
                className="mic-record-btn start"
                disabled={!!recognitionError && recognitionError.includes('hỗ trợ')}
              >
                🎙️ Bấm để Nói
              </button>
            ) : (
              <button onClick={handleStopRecording} className="mic-record-btn active-recording">
                <span className="mic-pulse-ring"></span>
                ⏹️ Đang nghe bé nói...
              </button>
            )}
          </div>
        </div>

        {/* Evaluation Output */}
        {score !== null && (
          <div className="speaking-results-box">
            <div className="score-ring-wrapper">
              <div className="score-ring-value" style={{ color: score >= 80 ? '#2ECC71' : score >= 50 ? '#F39C12' : '#E74C3C' }}>
                {score}%
              </div>
              <p className="score-label">Độ chính xác</p>
            </div>
            
            <div className="transcript-box">
              <p className="transcript-label">Máy nghe được:</p>
              <p className="transcript-text">"{transcript || '...'}"</p>
            </div>

            <div className="evaluation-message">
              {score >= 80 ? (
                <span className="eval-text success">⭐ Tuyệt vời! Bé phát âm chuẩn như người bản xứ! (+5⭐)</span>
              ) : score >= 50 ? (
                <span className="eval-text warm">⭐ Khá tốt! Bé cố gắng phát âm rõ các từ chưa đúng nhé! (+3⭐)</span>
              ) : (
                <span className="eval-text alert">Bé nói gần được rồi! Hãy nghe Teddy phát âm mẫu và thử lại nhé!</span>
              )}
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="action-row">
          <button 
            className="primary-btn next-btn" 
            onClick={handleNext}
            style={{ backgroundColor: '#2ECC71' }}
          >
            {currentIdx + 1 === phrases.length ? 'Hoàn thành 🏆' : 'Câu tiếp theo ➔'}
          </button>
        </div>
      </div>
    </div>
  );
};
