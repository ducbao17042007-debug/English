// src/components/Navbar.tsx
import React, { useState } from 'react';
import { SettingsModal } from './SettingsModal';

interface NavbarProps {
  stars: number;
  onGoHome: () => void;
  onToggleChat: () => void;
  isChatOpen: boolean;
  onGoProfiles: () => void;
  activeProfile?: { name: string; emoji: string } | null;
}

export const Navbar: React.FC<NavbarProps> = ({ stars, onGoHome, onToggleChat, isChatOpen, onGoProfiles, activeProfile }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-bright/90 backdrop-blur-md shadow-sm">
      <div className="flex justify-between items-center w-full px-gutter py-sm max-w-container-max mx-auto h-16">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={onGoHome}>
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg">
            <span className="material-symbols-outlined">school</span>
          </div>
          <span className="font-display-lg text-headline-md font-extrabold text-primary">KidsEnglish</span>
        </div>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex gap-lg items-center">
          <button className="font-body-md text-headline-md text-primary border-b-4 border-primary pb-2 transition-colors">
            Lessons
          </button>
          <button className="font-body-md text-body-md text-on-surface-variant pb-2 hover:text-primary transition-colors">
            Games
          </button>
          <button className="font-body-md text-body-md text-on-surface-variant pb-2 hover:text-primary transition-colors">
            Library
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Stars */}
          <div className="flex items-center gap-1.5 bg-secondary-container px-3 py-1.5 rounded-full shadow-sm">
            <span className="material-symbols-outlined text-on-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="font-label-lg text-on-secondary-container">{stars}</span>
          </div>

          {/* Teddy AI / Chat toggle button - LUÔN HIỂN THỊ ĐẸP MẮT TRÊN MỌI MÀN HÌNH */}
          <button
            onClick={onToggleChat}
            aria-pressed={isChatOpen}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-label-lg btn-3d transition-colors ${isChatOpen
                ? 'bg-primary text-white'
                : 'bg-primary-container text-on-primary-container'
              }`}
          >
            <span className="material-symbols-outlined">smart_toy</span>
            <span>Teddy AI</span>
          </button>

          {/* ĐÃ XÓA: Đoạn mã button chat (Mobile/Tablet) thừa ở đây */}

          {/* Settings button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="material-symbols-outlined text-on-surface-variant p-2 rounded-full hover:bg-surface-container transition-colors"
          >
            settings
          </button>

          {/* Avatar - Clickable and dynamic */}
          <button
            onClick={onGoProfiles}
            title={`Hồ sơ của ${activeProfile?.name || 'bé'}`}
            className="flex w-10 h-10 rounded-full bg-primary-container items-center justify-center text-white text-lg font-bold border-2 border-outline-variant overflow-hidden hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm"
          >
            {activeProfile?.emoji || '🧒'}
          </button>
        </div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={() => { }}
      />
    </header>
  );
};