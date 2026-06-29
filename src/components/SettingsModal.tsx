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
  const [apiKey, setApiKey] = useState<string>('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');

  useEffect(() => {
    // Load saved settings
    const savedProvider = localStorage.getItem('ai_provider') || 'gemini';
    setAiProvider(savedProvider);

    // Backward compatibility check
    const savedKey = localStorage.getItem('ai_api_key') || localStorage.getItem('gemini_api_key') || '';
    setApiKey(savedKey);

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
    localStorage.setItem('ai_api_key', apiKey.trim());
    
    // Also save as gemini_api_key for backwards compatibility
    if (aiProvider === 'gemini') {
      localStorage.setItem('gemini_api_key', apiKey.trim());
    } else {
      localStorage.removeItem('gemini_api_key');
    }

    localStorage.setItem('tts_voice_name', selectedVoice);
    onSave();
    onClose();
  };

  const handleClear = () => {
    localStorage.removeItem('ai_api_key');
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    alert('Đã xóa API Key. Chatbot sẽ chạy ở chế độ Offline!');
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
              onChange={(e) => {
                setAiProvider(e.target.value);
                // Clear input key if switching and previous key was saved for the other
                setApiKey('');
              }}
              className="setting-select"
              style={{ marginBottom: '16px' }}
            >
              <option value="gemini">Google Gemini (Khuyên dùng - model: gemini-1.5-flash)</option>
              <option value="openai">OpenAI ChatGPT (model: gpt-4o-mini)</option>
            </select>

            <h3>🔑 Nhập API Key của {aiProvider === 'gemini' ? 'Google Gemini' : 'OpenAI ChatGPT'}</h3>
            <p className="setting-desc">
              Nhập mã khóa API tương ứng. Nếu để trống, Gấu Teddy sẽ chạy ở chế độ giả lập (Offline).
            </p>
            <div className="input-group">
              <input
                type="password"
                placeholder={aiProvider === 'gemini' ? 'Nhập Gemini API Key của bạn...' : 'Nhập OpenAI API Key (sk-...) của bạn...'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="setting-input"
              />
              {apiKey && (
                <button className="clear-btn" onClick={handleClear}>
                  Xóa Key
                </button>
              )}
            </div>
            <p className="hint-text">
              {aiProvider === 'gemini' ? (
                <span>🔑 Bạn có thể lấy API Key miễn phí từ <strong>Google AI Studio</strong>.</span>
              ) : (
                <span>🔑 Bạn có thể lấy API Key từ trang quản lý nhà phát triển của <strong>OpenAI Platform</strong>.</span>
              )}
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
