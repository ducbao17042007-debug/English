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

  const getOfflineResponse = (query: string): string => {
    const q = query.toLowerCase();
    
    if (q.includes('hello') || q.includes('hi') || q.includes('chào')) {
      return "Hello there! 🧸 I hope you are having a wonderful day! What English topic do you like? (Chào bạn! Tớ hy vọng cậu đang có một ngày tuyệt vời! Cậu thích chủ đề tiếng Anh nào?)";
    }
    if (q.includes('how are you') || q.includes('khỏe không') || q.includes('khoe khong')) {
      return "I am feeling super happy to learn English with you! 🌟 How are you today? (Tớ đang cảm thấy cực kỳ hạnh phúc khi được học tiếng Anh cùng cậu! Hôm nay cậu thế nào?)";
    }
    if (q.includes('name') || q.includes('tên là gì') || q.includes('ten la gi')) {
      return "My name is Teddy! I am a cuddly bear who speaks English. 🧸 (Tớ tên là Teddy! Tớ là một chú gấu bông biết nói tiếng Anh đó.)";
    }
    if (q.includes('thank') || q.includes('cảm ơn') || q.includes('cam on')) {
      return "You are very welcome! Earning stars is fun, right? Keep up the good work! ⭐ (Không có gì đâu! Nhận được sao rất vui đúng không? Cố gắng học tốt nhé!)";
    }
    if (q.includes('con voi') || q.includes('elephant')) {
      return "An elephant is a giant animal with a long trunk! E-L-E-P-H-A-N-T. 🐘 (Con voi tiếng Anh là 'Elephant'! Nó có cái vòi rất dài.)";
    }
    if (q.includes('con mèo') || q.includes('con meo') || q.includes('cat')) {
      return "A cat is a small animal that says meow! C-A-T. 🐱 (Con mèo tiếng Anh là 'Cat'! Kêu meo meo!)";
    }
    if (q.includes('con chó') || q.includes('con cho') || q.includes('dog')) {
      return "A dog is a friendly pet that says woof! D-O-G. 🐶 (Con chó tiếng Anh là 'Dog'! Kêu gâu gâu!)";
    }
    if (q.includes('game') || q.includes('trò chơi') || q.includes('tro choi') || q.includes('play')) {
      return "Let's play a riddle! What color is a red apple? 🍎 Red, green or yellow? (Hãy cùng chơi giải đố nhé! Quả táo màu đỏ thì có màu gì? Đỏ, xanh hay vàng?)";
    }
    if (q.includes('red') || q.includes('màu đỏ') || q.includes('mau do')) {
      if (messages[messages.length - 2]?.text.includes('apple')) {
        return "Correct! 🌟 You are so smart! Apples are red and delicious! (Chính xác! Cậu giỏi quá! Táo màu đỏ và rất ngon!)";
      }
    }
    if (q.includes('joke') || q.includes('riddle') || q.includes('đố') || q.includes('do vui')) {
      return "Here is a riddle: What is white and black, and has letters? It is a zebra! 🦓 (Đây là một câu đố: Cái gì màu đen trắng và có chữ? Đó là con ngựa vằn! - Chữ ở đây là các vằn sọc 'letters' hoặc sọc ngựa)";
    }
    if (q.includes('apple')) {
      return "Apple is a sweet fruit! 🍎 I love red apples! (Táo là một loại quả ngọt! Tớ rất thích những quả táo màu đỏ!)";
    }
    if (q.includes('banana')) {
      return "Banana is a yellow fruit, monkeys love them! 🍌 (Chuối là quả màu vàng, khỉ rất thích chuối!)";
    }

    return "I can only help you learn English! 🧸 Let's learn some English words! Ask me: 'How do you say con voi in English?' (Tớ chỉ có thể giúp cậu học tiếng Anh thôi! Hãy cùng học từ vựng nhé! Cậu có thể hỏi tớ: 'How do you say con voi in English?') ";
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

    const aiProvider = localStorage.getItem('ai_provider') || 'gemini';
    const apiKey = localStorage.getItem('ai_api_key') || localStorage.getItem('gemini_api_key') || '';

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
        // Offline simulator fallback
        setTimeout(() => {
          const reply = getOfflineResponse(textToSend);
          setMessages(prev => [...prev, {
            sender: 'teddy',
            text: reply,
            timestamp: new Date()
          }]);
        }, 800);
      }
    } catch (err: any) {
      console.error(err);
      // Fallback if API fails
      setTimeout(() => {
        const errorDetail = err?.message || 'Connection error';
        const reply = `Oh! My connection to ${aiProvider === 'gemini' ? 'Gemini' : 'ChatGPT'} had a small issue (${errorDetail}). Let me reply offline: ` + getOfflineResponse(textToSend);
        setMessages(prev => [...prev, {
          sender: 'teddy',
          text: reply,
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
