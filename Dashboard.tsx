// src/components/Dashboard.tsx
import React from 'react';
import { levels } from '../data/lessonsData';
import type { Level } from '../data/lessonsData';

interface DashboardProps {
  onSelectLevel: (levelId: number) => void;
  stars: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectLevel, stars }) => {
  // Color mapping for level cards
  const levelColors = {
    1: {
      border: 'border-tertiary-fixed',
      bg: 'bg-orange-50',
      badge: 'bg-orange-100 text-orange-700',
      button: 'bg-tertiary-fixed text-tertiary hover:bg-tertiary-container hover:text-white',
    },
    2: {
      border: 'border-secondary-container',
      bg: 'bg-teal-50',
      badge: 'bg-teal-100 text-teal-700',
      button: 'bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-white',
    },
    3: {
      border: 'border-primary-container',
      bg: 'bg-primary-fixed',
      badge: 'bg-primary-fixed text-primary',
      button: 'bg-primary-container text-white hover:bg-primary',
    },
  };

  const getCardColor = (levelId: number) => levelColors[levelId as keyof typeof levelColors] || levelColors[1];

  return (
    <div className="w-full space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary-container to-primary text-white rounded-2xl p-6 md:p-8 shadow-xl shadow-primary/10">
        {/* Background Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/20 rounded-full blur-2xl -ml-24 -mb-24"></div>

        <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-12 md:items-center md:justify-between">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Chào mừng bé đến với KidsEnglish! 🎒✨
            </h1>
            <p className="text-sm md:text-lg text-white/90 leading-relaxed max-w-2xl">
              Hãy chọn một cấp độ phù hợp để cùng khám phá 4 kỹ năng Nghe - Nói - Đọc - Viết nhé!
            </p>
            <div className="flex flex-wrap gap-3 pt-2 justify-center md:justify-start">
              <div className="glass-effect bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 flex items-center gap-2 shadow-sm">
                <span className="material-symbols-outlined text-yellow-300 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                <span className="text-xs md:text-sm font-bold text-white">{stars} Ngôi sao tích lũy</span>
              </div>
              <div className="glass-effect bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 flex items-center gap-2 shadow-sm">
                <span className="material-symbols-outlined text-orange-300 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>lock_open</span>
                <span className="text-xs md:text-sm font-bold text-white">Đã mở khóa tất cả cấp độ</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="hidden md:flex w-48 h-40 items-center justify-center flex-shrink-0">
            <div className="text-7xl drop-shadow-md animate-bounce">🌈📚</div>
          </div>
        </div>
      </section>

      {/* Section Title */}
      <div className="flex items-center gap-2 pt-2">
        <span className="material-symbols-outlined text-yellow-500 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>wb_sunny</span>
        <h2 className="text-xl md:text-2xl font-black text-on-surface tracking-tight">Chọn cấp độ học tập</h2>
      </div>

      {/* Level Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {levels.map((level: Level) => {
          const colors = getCardColor(level.id);
          return (
            <div
              key={level.id}
              className={`bento-card bg-surface-container-lowest rounded-2xl border-t-8 ${colors.border} relative group cursor-pointer transition-all hover:shadow-xl flex flex-col hover:-translate-y-1 duration-300 shadow-sm`}
              onClick={() => onSelectLevel(level.id)}
            >
              <div className="p-6 flex-1 flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${colors.badge}`}>
                    {level.grade}
                  </span>
                  <div className="flex gap-1 text-3xl drop-shadow-sm">{level.emoji}</div>
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-black text-on-surface mb-2">Cấp độ {level.id}: {level.name}</h3>

                {/* Description */}
                <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed mb-4 flex-1">{level.description}</p>

                {/* Theme Box */}
                <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 mt-auto">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Chủ đề</span>
                  <span className="text-xs md:text-sm font-black text-on-surface">{level.theme}</span>
                </div>
              </div>

              {/* Button */}
              <div className="px-6 pb-6">
                <button className={`w-full btn-3d ${colors.button} font-black py-3.5 rounded-xl flex items-center justify-center gap-2 group-active:scale-95 transition-all shadow-md`}>
                  <span>Bắt đầu học ngay</span>
                  <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">rocket_launch</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly Progress - Desktop only */}
      <div className="hidden md:block bg-surface-container-high rounded-2xl p-6 shadow-sm border border-outline-variant/20">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-black text-on-surface">Hành trình tuần này</h3>
          <span className="text-primary font-black text-sm">75%</span>
        </div>
        <div className="w-full bg-surface-container-low h-3 rounded-full overflow-hidden">
          <div className="progress-fill bg-primary h-full w-3/4 rounded-full"></div>
        </div>
        <p className="text-xs text-on-surface-variant text-center mt-3 font-medium">Bé chỉ còn 2 bài học nữa là hoàn thành mục tiêu tuần!</p>
      </div>

      {/* Footer - Desktop only */}
      <footer className="hidden md:flex py-6 border-t border-outline-variant/20 flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <div className="text-center md:text-left space-y-1">
          <p className="font-black text-primary text-sm">KidsEnglish</p>
          <p className="text-on-surface-variant font-medium">© 2026 KidsEnglish Magic Learning</p>
        </div>
        <div className="flex gap-6 font-bold text-on-surface-variant">
          <a className="hover:text-primary hover:underline transition-colors" href="#">Privacy Policy</a>
          <a className="hover:text-primary hover:underline transition-colors" href="#">Parents Guide</a>
          <a className="hover:text-primary hover:underline transition-colors" href="#">Support</a>
        </div>
      </footer>
    </div>
  );
};