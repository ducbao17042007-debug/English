// src/components/Navbar.tsx
import React, { useState } from 'react';
import { SettingsModal } from './SettingsModal';

interface NavbarProps {
  stars: number;
  onGoHome: () => void;
  onToggleChat: () => void;
  isChatOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ stars, onGoHome, onToggleChat, isChatOpen }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSettingsSave = () => {
    // Notify or reload state if needed
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <header className="app-navbar">
      <div className="navbar-logo" onClick={onGoHome} style={{ cursor: 'pointer' }}>
        <span className="logo-emoji">🎒</span>
        <span className="logo-text">Kids<span className="logo-accent">English</span></span>
      </div>

      <div className="navbar-actions">
        {/* Star Counter */}
        <div className="star-counter">
          <span className="star-emoji">⭐</span>
          <span className="star-count">{stars}</span>
        </div>

        {/* Chat Bot Button */}
        <button 
          onClick={onToggleChat} 
          className={`nav-btn chat-toggle-btn ${isChatOpen ? 'active' : ''}`}
          title="Trò chuyện với Gấu Teddy"
        >
          🧸 {isChatOpen ? 'Đóng Chat' : 'Gấu Teddy AI'}
        </button>

        {/* Settings button */}
        <button 
          onClick={() => setIsSettingsOpen(true)} 
          className="nav-btn settings-btn"
          title="Cài đặt"
        >
          ⚙️ Cài đặt
        </button>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        onSave={handleSettingsSave}
      />
    </header>
  );
};
