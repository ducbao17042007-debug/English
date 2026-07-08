// src/components/AchievementsPage.tsx
import React, { useState } from 'react';

export interface Achievement {
    id: string;
    emoji: string;
    title: string;
    desc: string;
    isUnlocked: boolean;
    unlockCondition: string;
    dateUnlocked?: string;
}

interface AchievementsPageProps {
    totalStars: number;
}

export const AchievementsPage: React.FC<AchievementsPageProps> = ({ totalStars }) => {
    // Dữ liệu mẫu các thành tựu
    const [achievements] = useState<Achievement[]>([
        {
            id: 'a1',
            emoji: '🌟',
            title: 'Bước chân đầu tiên',
            desc: 'Đăng nhập vào KidsEnglish lần đầu',
            isUnlocked: true,
            unlockCondition: 'Mở khóa ngay khi tham gia',
            dateUnlocked: 'Hôm nay',
        },
        {
            id: 'a2',
            emoji: '🎧',
            title: 'Đôi tai vàng',
            desc: 'Hoàn thành bài tập Nghe với điểm tối đa',
            isUnlocked: true,
            unlockCondition: '100% điểm bài Luyện Nghe',
            dateUnlocked: 'Hôm qua',
        },
        {
            id: 'a3',
            emoji: '🏆',
            title: 'Thợ săn Ngôi sao',
            desc: 'Tích lũy được 50 ngôi sao đầu tiên',
            isUnlocked: totalStars >= 50,
            unlockCondition: 'Cần đạt 50 ngôi sao',
            dateUnlocked: totalStars >= 50 ? 'Vừa xong' : undefined,
        },
        {
            id: 'a4',
            emoji: '🔥',
            title: 'Ngọn lửa chăm chỉ',
            desc: 'Học tiếng Anh liên tục 7 ngày',
            isUnlocked: false,
            unlockCondition: 'Chuỗi 7 ngày học liên tiếp',
        },
        {
            id: 'a5',
            emoji: '👑',
            title: 'Nhà vô địch',
            desc: 'Mở khóa toàn bộ các cấp độ học tập',
            isUnlocked: false,
            unlockCondition: 'Hoàn thành Cấp độ 5',
        },
        {
            id: 'a6',
            emoji: '🗣️',
            title: 'Giọng ca oanh vàng',
            desc: 'Phát âm chuẩn như người bản xứ',
            isUnlocked: false,
            unlockCondition: 'Hoàn thành 10 bài Luyện Nói',
        }
    ]);

    const unlockedCount = achievements.filter(a => a.isUnlocked).length;

    return (
        <div className="w-full space-y-8 animate-fade-in pb-28 md:pb-0">

            {/* 🔥 BANNER ĐÃ ĐƯỢC THU GỌN LẠI VÀ CHUYỂN SANG BỐ CỤC NGANG */}
            <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 shadow-sm text-white bg-gradient-to-br from-amber-400 to-orange-500 flex flex-col justify-center">

                {/* Background trang trí */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-300/20 rounded-full blur-2xl -ml-16 -mb-16"></div>

                {/* Nội dung Banner chia 2 cột trên máy tính (như trang Missions) */}
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10 w-full">

                    {/* Cột trái: Icon */}
                    <div className="text-6xl md:text-8xl animate-bounce drop-shadow-md flex-shrink-0">
                        🥇
                    </div>

                    {/* Cột phải: Chữ và Thống kê */}
                    <div className="flex-1 space-y-3 text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-sm tracking-wide">
                            Phòng Truyền Thống
                        </h1>

                        <p className="text-sm md:text-base text-orange-50 font-medium leading-relaxed max-w-2xl mx-auto md:mx-0">
                            Nơi lưu giữ những huy hiệu và cúp vàng danh giá bé đã đạt được trong hành trình chinh phục tiếng Anh!
                        </p>

                        {/* Thống kê thu nhỏ lại cho thanh lịch */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4 mt-2 border-t border-white/20">
                            <div className="bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-xl border border-white/30 flex items-center gap-2">
                                <span className="text-xl">⭐</span>
                                <span className="font-bold text-sm md:text-base">{totalStars} Sao</span>
                            </div>
                            <div className="bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-xl border border-white/30 flex items-center gap-2">
                                <span className="text-xl">🏅</span>
                                <span className="font-bold text-sm md:text-base">{unlockedCount} / {achievements.length} Huy hiệu</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Tiêu đề danh sách */}
            <div className="flex items-center gap-2 pt-2">
                <span className="material-symbols-outlined text-orange-500 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                <h2 className="text-xl md:text-2xl font-black text-on-surface tracking-tight">Bộ sưu tập Huy hiệu</h2>
            </div>

            {/* Lưới danh sách Thành tựu */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 w-full">
                {achievements.map((item) => (
                    <div
                        key={item.id}
                        className={`relative flex flex-col items-center text-center p-6 md:p-8 rounded-3xl border-2 transition-all duration-300 ${item.isUnlocked
                            ? 'bg-white border-orange-200 shadow-lg shadow-orange-100 hover:-translate-y-2'
                            : 'bg-gray-50 border-gray-200 opacity-75 grayscale hover:grayscale-0 transition-all duration-500'
                            }`}
                    >
                        {/* Icon Huy hiệu */}
                        <div className={`text-7xl md:text-8xl drop-shadow-xl mb-4 transition-transform duration-500 ${item.isUnlocked ? 'scale-110' : 'scale-100 opacity-50'}`}>
                            {item.emoji}
                        </div>

                        <h3 className={`text-xl md:text-2xl font-black mb-2 ${item.isUnlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                            {item.title}
                        </h3>

                        <p className="text-sm md:text-base font-medium text-gray-500 mb-6 flex-1">
                            {item.desc}
                        </p>

                        {/* Trạng thái */}
                        <div className="mt-auto w-full">
                            {item.isUnlocked ? (
                                <div className="bg-green-100 text-green-700 font-bold text-sm md:text-base py-3 px-4 rounded-xl flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                                    <span>✔️ Đã mở khóa</span>
                                    {item.dateUnlocked && <span className="font-normal opacity-80 text-xs md:text-sm">({item.dateUnlocked})</span>}
                                </div>
                            ) : (
                                <div className="bg-gray-200 text-gray-600 font-bold text-sm md:text-base py-3 px-4 rounded-xl flex items-center justify-center gap-2 group relative">
                                    <span>🔒 Khóa</span>
                                    {/* Tooltip hiển thị điều kiện */}
                                    <span className="absolute bottom-full mb-2 bg-gray-800 text-white text-xs md:text-sm py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-max max-w-[250px] z-20">
                                        {item.unlockCondition}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};