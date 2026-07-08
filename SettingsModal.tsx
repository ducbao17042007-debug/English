// src/components/SettingsModal.tsx
import React, { useState, useEffect } from 'react';
import { getAvailableVoices } from '../utils/ttsHelper';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave }) => {
  const [aiProvider, setAiProvider] = useState<string>('gemini');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');

  useEffect(() => {
    // Check environment variables
    const envGeminiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const envOpenAIKey = import.meta.env.VITE_OPENAI_API_KEY;
    const hasEnvGemini = envGeminiKey && envGeminiKey !== 'your_gemini_api_key_here';
    const hasEnvOpenAI = envOpenAIKey && envOpenAIKey !== 'your_openai_api_key_here';

    // Load saved settings
    const savedProvider = localStorage.getItem('ai_provider') || 
                          (hasEnvOpenAI && !hasEnvGemini ? 'openai' : 'gemini');
    setAiProvider(savedProvider);

    const savedVoice = localStorage.getItem('tts_voice_name') || '';
    setSelectedVoice(savedVoice);

    // Fetch voices
    const loadVoices = () => {
      const allVoices = getAvailableVoices();
      const englishVoices = allVoices.filter(v => v.lang.startsWith('en'));
      setVoices(englishVoices);
    };

    loadVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem('ai_provider', aiProvider);
    localStorage.setItem('tts_voice_name', selectedVoice);
    onSave();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>⚙️ Cài đặt học tập</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {/* Section AI Selection */}
          <div className="setting-section">
            <h3>🤖 Chọn nhà cung cấp Trí tuệ nhân tạo (AI Provider)</h3>
            <p className="setting-desc">
              Chọn công nghệ AI bạn muốn sử dụng cho Gấu Teddy.
            </p>
            <select
              value={aiProvider}
              onChange={(e) => setAiProvider(e.target.value)}
              className="setting-select"
              style={{ marginBottom: '16px' }}
            >
              <option value="gemini">Google Gemini (Khuyên dùng - model: gemini-1.5-flash)</option>
              <option value="openai">OpenAI ChatGPT (model: gpt-4o-mini)</option>
            </select>
            <p className="hint-text" style={{ marginTop: '8px', color: '#27ae60', fontWeight: 'bold' }}>
              🔑 API Key được tự động cấu hình bảo mật qua file <code>.env</code>.
            </p>
          </div>

          {/* Section TTS Voice Selection */}
          <div className="setting-section">
            <h3>🗣️ Giọng đọc tiếng Anh (Google TTS)</h3>
            <p className="setting-desc">
              Chọn giọng nói tiếng Anh ưa thích của bạn cho trình phát âm.
            </p>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="setting-select"
            >
              <option value="">-- Giọng nói mặc định hệ thống --</option>
              {voices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="secondary-btn" onClick={onClose}>Hủy bỏ</button>
          <button className="primary-btn" onClick={handleSave}>Lưu cài đặt</button>
        </div>
      </div>
    </div>
  );
};
