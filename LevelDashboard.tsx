import React from 'react';
import type { Level } from '../data/lessonsData';

// Mở rộng interface Level trực tiếp tại đây để ép kiểu không bị lỗi TS
interface LevelDashboardProps {
  level: Level & {
    color?: string;
    emoji?: string;
    theme?: string;
    grade?: string;
  };
  onSelectSkill: (skill: 'listening' | 'speaking' | 'reading' | 'writing') => void;
  onBack: () => void;
}

export const LevelDashboard: React.FC<LevelDashboardProps> = ({
  level,
  onSelectSkill,
  onBack
}) => {
  const skillCards = [
    {
      id: 'listening' as const,
      title: 'Kỹ năng NGHE',
      vietnamese: 'Nghe phát âm và trả lời',
      emoji: '🎧',
      color: 'bg-blue-500 hover:bg-blue-600',
      bgLight: 'bg-blue-50',
      borderColor: 'border-t-blue-500',
      desc: 'Bé nghe máy phát âm các từ hoặc câu tiếng Anh và chọn hình ảnh hoặc viết lại từ đúng nhé!'
    },
    {
      id: 'speaking' as const,
      title: 'Kỹ năng NÓI',
      vietnamese: 'Luyện nói cùng Microphone',
      emoji: '🗣️',
      color: 'bg-green-500 hover:bg-green-600',
      bgLight: 'bg-green-50',
      borderColor: 'border-t-green-500',
      desc: 'Bé nhìn từ/câu, bấm micro và phát âm thật to. Máy sẽ chấm điểm xem bé nói chuẩn chưa nào!'
    },
    {
      id: 'reading' as const,
      title: 'Kỹ năng ĐỌC',
      vietnamese: 'Đọc truyện và trả lời câu hỏi',
      emoji: '📖',
      color: 'bg-purple-500 hover:bg-purple-600',
      bgLight: 'bg-purple-50',
      borderColor: 'border-t-purple-500',
      desc: 'Bé đọc những câu chuyện vui, nhấp vào bất kỳ từ nào để nghe máy đọc, rồi trả lời câu hỏi đố vui nhé!'
    },
    {
      id: 'writing' as const,
      title: 'Kỹ năng VIẾT',
      vietnamese: 'Sắp xếp chữ và viết chính tả',
      emoji: '✍️',
      color: 'bg-orange-500 hover:bg-orange-600',
      bgLight: 'bg-orange-50',
      borderColor: 'border-t-orange-500',
      desc: 'Thử tài viết chính tả bằng cách nhìn hình đoán từ và sắp xếp các từ lộn xộn thành câu hoàn chỉnh.'
    }
  ];

  return (
    // ĐÃ FIX: Thay pt-20 bằng pt-6 để loại bỏ khoảng trống phía trên
    <main className="pt-6 pb-28 md:pb-0 px-gutter min-h-screen bg-background">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">

        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-primary hover:text-primary-container font-label-lg transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span>Quay lại trang chủ</span>
        </button>

        {/* Level Banner */}
        <div
          className="relative overflow-hidden rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 shadow-lg text-white"
          style={{
            background: level.color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        >
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -ml-16 -mb-16"></div>

          {/* Content */}
          <div className="relative z-10 flex items-center gap-4 md:gap-6">
            {/* Emoji */}
            <div className="text-5xl md:text-6xl lg:text-7xl drop-shadow-md flex-shrink-0">
              {level.emoji}
            </div>

            {/* Text */}
            <div className="flex-1 space-y-2">
              <h2 className="font-headline-lg md:font-display-lg text-white font-bold">
                Cấp độ {level.id}: {level.name}
              </h2>
              <p className="font-body-md text-white/90 text-sm md:text-base">
                <span className="font-bold">🎨 Chủ đề:</span> {level.theme} ({level.grade})
              </p>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-2xl text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
            target
          </span>
          <h3 className="font-headline-md text-on-surface">
            Hãy chọn kỹ năng bé muốn luyện tập:
          </h3>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full">
          {skillCards.map(skill => (
            <button
              key={skill.id}
              onClick={() => onSelectSkill(skill.id)}
              className={`bg-white rounded-2xl p-5 md:p-6 space-y-4 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:scale-95 border border-outline-variant/20 group flex flex-col border-t-[6px] ${skill.borderColor}`}
            >
              {/* Emoji Box */}
              <div className={`w-12 h-12 ${skill.bgLight} rounded-xl flex items-center justify-center shadow-sm flex-shrink-0`}>
                <span className="text-2xl">{skill.emoji}</span>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-2">
                {/* Title */}
                <h4 className="font-headline-md text-on-surface text-sm md:text-base font-bold">
                  {skill.title}
                </h4>

                {/* Subtitle */}
                <h5 className="font-label-sm text-primary text-xs md:text-sm">
                  {skill.vietnamese}
                </h5>

                {/* Description */}
                <p className="font-body-md text-on-surface-variant text-xs md:text-sm leading-relaxed line-clamp-3">
                  {skill.desc}
                </p>
              </div>

              {/* Button */}
              <div className={`w-full ${skill.color} text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all`}>
                <span className="text-sm md:text-base">Luyện tập ngay</span>
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
};