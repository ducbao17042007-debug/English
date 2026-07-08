// src/components/Chatbot.tsx
import React, { useState, useRef, useEffect } from 'react';
import { speakEnglish, stopSpeaking } from '../utils/ttsHelper';
import { AIServiceFactory } from '../services/ai/AIServiceFactory';

interface Message {
  sender: 'user' | 'teddy';
  text: string;
  timestamp: Date;
}

export const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'teddy',
      text: "Hello! I am Teddy, your English buddy! 🧸 Let's talk in English! You can ask me questions or just say hi. (Xin chào! Tớ là Teddy, bạn học tiếng Anh của cậu! Hãy cùng trò chuyện nhé!)",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Clean speaking status when chat unmounts
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const handleSpeak = (text: string, index: number) => {
    if (speakingIndex === index) {
      stopSpeaking();
      setSpeakingIndex(null);
    } else {
      setSpeakingIndex(index);
      // Remove Vietnamese parentheses translation from text before speaking so TTS reads pure English
      const englishOnlyText = text.replace(/\([^)]*\)/g, '').trim();
      speakEnglish({
        text: englishOnlyText,
        speed: 0.95,
        onEnd: () => setSpeakingIndex(null),
        onError: () => setSpeakingIndex(null)
      });
    }
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    // Check if an API key is available in environment variables (.env)
    const envGeminiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const envOpenAIKey = import.meta.env.VITE_OPENAI_API_KEY;
    const hasEnvGemini = envGeminiKey && envGeminiKey !== 'your_gemini_api_key_here';
    const hasEnvOpenAI = envOpenAIKey && envOpenAIKey !== 'your_openai_api_key_here';

    const aiProvider = localStorage.getItem('ai_provider') || 
                       (hasEnvOpenAI && !hasEnvGemini ? 'openai' : 'gemini');

    const apiKey = localStorage.getItem('ai_api_key') || 
                   localStorage.getItem('gemini_api_key') || 
                   (aiProvider === 'gemini' 
                     ? (hasEnvGemini ? envGeminiKey : '') 
                     : (hasEnvOpenAI ? envOpenAIKey : ''));

    try {
      const aiService = AIServiceFactory.getAIService(aiProvider, apiKey);

      if (aiService) {
        // Prepare chat history to feed to the AI Service
        const formattedHistory = messages.slice(-6).map(m => ({
          sender: m.sender,
          text: m.text
        }));

        const replyText = await aiService.sendMessage(textToSend, formattedHistory);
        
        setMessages(prev => [...prev, {
          sender: 'teddy',
          text: replyText,
          timestamp: new Date()
        }]);
      } else {
        // Warning that API key needs to be configured
        setTimeout(() => {
          const providerName = aiProvider === 'gemini' ? 'Google Gemini' : 'OpenAI ChatGPT';
          const envVarName = aiProvider === 'gemini' ? 'VITE_GEMINI_API_KEY' : 'VITE_OPENAI_API_KEY';
          setMessages(prev => [...prev, {
            sender: 'teddy',
            text: `Vui lòng thiết lập API Key trong file .env để sử dụng AI thực nhé! 🧸 (Cậu cần cấu hình biến ${envVarName} trong file .env ở thư mục gốc của dự án để trò chuyện với Teddy bằng AI thực của ${providerName}).`,
            timestamp: new Date()
          }]);
        }, 800);
      }
    } catch (err: any) {
      console.error(err);
      setTimeout(() => {
        const errorDetail = err?.message || 'Connection error';
        setMessages(prev => [...prev, {
          sender: 'teddy',
          text: `Oh! Kết nối của tớ tới ${aiProvider === 'gemini' ? 'Gemini' : 'ChatGPT'} gặp lỗi mất rồi (${errorDetail}). Cậu vui lòng kiểm tra lại mạng hoặc API Key nhé! 🧸`,
          timestamp: new Date()
        }]);
      }, 500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = (phrase: string) => {
    handleSend(phrase);
  };

  return (
    <div className="chatbot-panel">
      <div className="chatbot-header">
        <div className="avatar-container">
          <div className="teddy-avatar">🧸</div>
          <div className="online-badge"></div>
        </div>
        <div className="header-info">
          <h4>Gấu Teddy AI</h4>
          <span>Gia sư tiếng Anh đáng yêu 🌟</span>
        </div>
      </div>

      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message-bubble-wrapper ${msg.sender}`}>
            {msg.sender === 'teddy' && <span className="message-icon">🧸</span>}
            <div className="message-bubble">
              <p className="message-text">{msg.text}</p>
              {msg.sender === 'teddy' && (
                <button 
                  onClick={() => handleSpeak(msg.text, index)}
                  className={`message-tts-btn ${speakingIndex === index ? 'speaking' : ''}`}
                  title="Nghe phát âm"
                >
                  {speakingIndex === index ? '⏹️' : '🔊'}
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message-bubble-wrapper teddy">
            <span className="message-icon">🧸</span>
            <div className="message-bubble loading-bubble">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick replies */}
      <div className="quick-replies">
        <button onClick={() => handleQuickReply("Hello Teddy!")} className="chip">Hello! 👋</button>
        <button onClick={() => handleQuickReply("How do you say con voi in English?")} className="chip">Con voi? 🐘</button>
        <button onClick={() => handleQuickReply("Tell me a riddle!")} className="chip">Đố vui 🦓</button>
        <button onClick={() => handleQuickReply("Let's play a game!")} className="chip">Chơi game 🎮</button>
      </div>

      <div className="chatbot-input-area">
        <input
          type="text"
          placeholder="Trò chuyện với Teddy bằng tiếng Anh..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend(inputText)}
          className="chat-input"
        />
        <button onClick={() => handleSend(inputText)} className="send-btn">
          🚀
        </button>
      </div>
    </div>
  );
};
