// src/components/LevelDashboard.tsx
import React from 'react';
import type { Level } from '../data/lessonsData';

interface LevelDashboardProps {
  level: Level;
  onSelectSkill: (skill: 'listening' | 'speaking' | 'reading' | 'writing') => void;
  onBack: () => void;
}

export const LevelDashboard: React.FC<LevelDashboardProps> = ({ level, onSelectSkill, onBack }) => {
  const skillCards = [
    {
      id: 'listening' as const,
      title: 'Kỹ năng NGHE',
      vietnamese: 'Nghe phát âm và trả lời',
      emoji: '🎧',
      color: '#4A90E2',
      bgLight: '#EBF3FC',
      desc: 'Bé nghe máy phát âm các từ hoặc câu tiếng Anh và chọn hình ảnh hoặc viết lại từ đúng nhé!'
    },
    {
      id: 'speaking' as const,
      title: 'Kỹ năng NÓI',
      vietnamese: 'Luyện nói cùng Microphone',
      emoji: '🗣️',
      color: '#2ECC71',
      bgLight: '#EAF8EE',
      desc: 'Bé nhìn từ/câu, bấm micro và phát âm thật to. Máy sẽ chấm điểm xem bé nói chuẩn chưa nào!'
    },
    {
      id: 'reading' as const,
      title: 'Kỹ năng ĐỌC',
      vietnamese: 'Đọc truyện và trả lời câu hỏi',
      emoji: '📖',
      color: '#9B59B6',
      bgLight: '#F5EEF8',
      desc: 'Bé đọc những câu chuyện vui, nhấp vào bất kỳ từ nào để nghe máy đọc, rồi trả lời câu hỏi đố vui nhé!'
    },
    {
      id: 'writing' as const,
      title: 'Kỹ năng VIẾT',
      vietnamese: 'Sắp xếp chữ và viết chính tả',
      emoji: '✍️',
      color: '#E67E22',
      bgLight: '#FDF2E9',
      desc: 'Thử tài viết chính tả bằng cách nhìn hình đoán từ và sắp xếp các từ lộn xộn thành câu hoàn chỉnh.'
    }
  ];

  return (
    <div className="level-dashboard-container">
      {/* Header back button */}
      <button className="back-link-btn" onClick={onBack}>
        ⬅️ Quay lại trang chủ
      </button>

      {/* Level Banner */}
      <div className="level-banner" style={{ background: level.color }}>
        <span className="level-banner-emoji">{level.emoji}</span>
        <div className="level-banner-info">
          <h2>Cấp độ {level.id}: {level.name} ({level.grade})</h2>
          <p className="level-theme-text">🎨 <strong>Chủ đề chính:</strong> {level.theme}</p>
        </div>
      </div>

      <h3 className="skills-title">🎯 Hãy chọn kỹ năng bé muốn luyện tập:</h3>

      {/* Skills Grid */}
      <div className="skills-grid">
        {skillCards.map(skill => (
          <div 
            key={skill.id} 
            className="skill-card"
            style={{ 
              borderTop: `6px solid ${skill.color}`,
              backgroundColor: '#fff'
            }}
            onClick={() => onSelectSkill(skill.id)}
          >
            <div className="skill-icon-box" style={{ backgroundColor: skill.bgLight }}>
              <span className="skill-emoji" style={{ color: skill.color }}>{skill.emoji}</span>
            </div>
            <div className="skill-info">
              <h4>{skill.title}</h4>
              <h5>{skill.vietnamese}</h5>
              <p>{skill.desc}</p>
            </div>
            <button className="skill-enter-btn" style={{ backgroundColor: skill.color }}>
              Luyện tập ngay ➔
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
