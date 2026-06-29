// src/components/Dashboard.tsx
import React from 'react';
import { levels } from '../data/lessonsData';
import type { Level } from '../data/lessonsData';

interface DashboardProps {
  onSelectLevel: (levelId: number) => void;
  stars: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectLevel, stars }) => {
  return (
    <div className="dashboard-container">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="banner-content">
          <h1>Chào mừng bé đến với KidsEnglish! 🎒🌟</h1>
          <p>Hãy chọn một cấp độ phù hợp để cùng khám phá 4 kỹ năng Nghe - Nói - Đọc - Viết nhé!</p>
          <div className="banner-stats">
            <div className="stat-badge">
              <span className="stat-emoji">⭐</span>
              <span><strong>{stars}</strong> Ngôi sao tích lũy</span>
            </div>
            <div className="stat-badge">
              <span className="stat-emoji">🏆</span>
              <span>Đã mở khóa tất cả các cấp độ</span>
            </div>
          </div>
        </div>
        <div className="banner-graphic">🌈📚</div>
      </div>

      <h2 className="section-title">🌟 Chọn cấp độ học tập</h2>
      
      {/* Levels Grid */}
      <div className="levels-grid">
        {levels.map((level: Level) => (
          <div 
            key={level.id} 
            className="level-card" 
            style={{ '--card-gradient': level.color } as React.CSSProperties}
            onClick={() => onSelectLevel(level.id)}
          >
            <div className="level-card-header">
              <span className="level-grade">{level.grade}</span>
              <span className="level-emoji">{level.emoji}</span>
            </div>
            <div className="level-card-body">
              <h3>Cấp độ {level.id}: {level.name}</h3>
              <p className="level-desc">{level.description}</p>
              <div className="level-theme">
                <strong>Chủ đề:</strong> {level.theme}
              </div>
            </div>
            <div className="level-card-footer">
              <span className="play-btn-text">Bắt đầu học ngay 🚀</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
