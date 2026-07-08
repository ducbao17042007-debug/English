// src/components/BottomNav.tsx
import React from 'react';

interface BottomNavProps {
  stars: number;
  onGoHome?: () => void;
  onToggleChat?: () => void;
  onGoMissions?: () => void;
  onGoAchievements?: () => void; // 🔥 Đã thêm khai báo
  onGoProfiles?: () => void;
  activeItem?: 'home' | 'missions' | 'profiles' | 'achievements'; // 🔥 Đã bổ sung achievements
}

export const BottomNav: React.FC<BottomNavProps> = ({
  stars: _stars,
  onGoHome,
  onToggleChat,
  onGoMissions,
  onGoAchievements, // 🔥 Nhận prop ở đây
  onGoProfiles,
  activeItem = 'home'
}) => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-3xl border-none h-20 px-6 flex items-center justify-between z-50">
      <button onClick={onGoHome} className="flex flex-col items-center gap-1 group">
        <div className={`w-12 h-10 flex items-center justify-center transition-all group-active:scale-90 ${activeItem === 'home' ? 'bg-primary-container text-on-primary-container rounded-xl' : 'text-on-surface-variant'
          }`}>
          <span className="material-symbols-outlined" style={activeItem === 'home' ? { fontVariationSettings: "'FILL' 1" } : undefined}>home</span>
        </div>
        <span className={`font-label-sm ${activeItem === 'home' ? 'text-primary' : 'text-on-surface-variant'}`}>Home</span>
      </button>

      <button onClick={onGoMissions} className="flex flex-col items-center gap-1 group">
        <div className={`w-12 h-10 flex items-center justify-center transition-all ${activeItem === 'missions' ? 'bg-primary-container text-on-primary-container rounded-xl' : 'text-on-surface-variant group-hover:text-primary'
          }`}>
          <span className="material-symbols-outlined" style={activeItem === 'missions' ? { fontVariationSettings: "'FILL' 1" } : undefined}>rocket_launch</span>
        </div>
        <span className={`font-label-sm ${activeItem === 'missions' ? 'text-primary' : 'text-on-surface-variant'}`}>Missions</span>
      </button>

      {/* Center FAB */}
      <div className="relative -top-8">
        <button
          onClick={onToggleChat}
          className="w-14 h-14 bg-secondary-container rounded-full shadow-lg border-4 border-white flex items-center justify-center text-on-secondary-container transition-transform active:scale-90 active:rotate-12"
        >
          <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
        </button>
      </div>

      {/* 🔥 Đã fix: Gắn sự kiện onClick và style cho nút Awards */}
      <button onClick={onGoAchievements} className="flex flex-col items-center gap-1 group">
        <div className={`w-12 h-10 flex items-center justify-center transition-all ${activeItem === 'achievements' ? 'bg-primary-container text-on-primary-container rounded-xl' : 'text-on-surface-variant group-hover:text-primary'
          }`}>
          <span className="material-symbols-outlined" style={activeItem === 'achievements' ? { fontVariationSettings: "'FILL' 1" } : undefined}>military_tech</span>
        </div>
        <span className={`font-label-sm ${activeItem === 'achievements' ? 'text-primary' : 'text-on-surface-variant'}`}>Awards</span>
      </button>

      <button onClick={onGoProfiles} className="flex flex-col items-center gap-1 group">
        <div className={`w-12 h-10 flex items-center justify-center transition-all ${activeItem === 'profiles' ? 'bg-primary-container text-on-primary-container rounded-xl' : 'text-on-surface-variant group-hover:text-primary'
          }`}>
          <span className="material-symbols-outlined" style={activeItem === 'profiles' ? { fontVariationSettings: "'FILL' 1" } : undefined}>face</span>
        </div>
        <span className={`font-label-sm ${activeItem === 'profiles' ? 'text-primary' : 'text-on-surface-variant'}`}>Profiles</span>
      </button>
    </nav>
  );
};