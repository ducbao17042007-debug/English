// src/components/MissionsPage.tsx
import React, { useState } from 'react';
import { MissionBoard } from './MissionBoard';
import type { Mission } from '../data/missionsData';

interface MissionsPageProps {
    missions: Mission[];
    onClaimReward: (id: string, stars: number) => void;
    totalStars?: number;
}

export const MissionsPage: React.FC<MissionsPageProps> = ({
    missions,
    onClaimReward,
    totalStars = 0,
}) => {
    const [activeCategory, setActiveCategory] = useState<'daily' | 'weekly' | 'achievement'>('daily');

    const completedCount = missions.filter(m => m.currentProgress >= m.target).length;
    const totalReward = missions
        .filter(m => m.isClaimed)
        .reduce((sum, m) => sum + m.rewardStars, 0);

    return (
        /* 🔥 CẬP NHẬT 1: Đã bỏ thẻ <main> thụt lề, dùng đúng chuẩn wrapper của Dashboard.tsx */
        <div className="w-full space-y-8">

            {/* Hero Banner */}
            {/* 🔥 CẬP NHẬT 2: Đổi từ rounded-3xl -> rounded-2xl, p-10 -> md:p-8 để góc bo và lề banner khớp 100% với Home */}
            <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 shadow-sm text-white bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 min-h-[240px] flex flex-col justify-center">

                {/* Decorative background */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -ml-16 -mb-16"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10 w-full">
                    <div className="text-6xl md:text-8xl animate-bounce drop-shadow-md flex-shrink-0">
                        🎁
                    </div>

                    <div className="flex-1 space-y-3 text-center md:text-left">
                        <h1 className="font-headline-lg md:font-display-lg text-white font-bold text-3xl md:text-4xl">
                            Khu vực săn thưởng!
                        </h1>
                        <p className="font-body-md text-white/90 text-sm md:text-base max-w-3xl">
                            Hoàn thành các thử thách dưới đây để thu thập thật nhiều ngôi sao nhé. Mỗi nhiệm vụ hoàn thành sẽ mở ra những phần thưởng thú vị! 🌟
                        </p>

                        {/* Quick Stats */}
                        <div className="flex flex-wrap gap-6 md:gap-10 justify-center md:justify-start mt-6 pt-6 border-t border-white/20">
                            <div className="space-y-1">
                                <p className="font-label-sm text-white/80">Hoàn thành</p>
                                <p className="font-headline-md text-white font-bold text-xl">{completedCount}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="font-label-sm text-white/80">Đã nhận sao</p>
                                <p className="font-headline-md text-amber-300 font-bold text-xl">{totalReward} ⭐</p>
                            </div>
                            <div className="space-y-1">
                                <p className="font-label-sm text-white/80">Tổng sao hiện tại</p>
                                <p className="font-headline-md text-yellow-300 font-bold text-xl">{totalStars} ⭐</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Daily Missions */}
                <div className="rounded-2xl p-6 bg-white border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-headline-md text-on-surface font-semibold text-base md:text-lg">📅 Hàng ngày</h3>
                        <span className="text-2xl">📋</span>
                    </div>
                    <p className="font-body-md text-on-surface-variant text-sm mb-4 min-h-[40px]">
                        Hoàn thành mỗi ngày để tích lũy ngôi sao
                    </p>
                    <div className="flex items-center justify-between">
                        <span className="font-label-lg text-blue-600 font-bold">
                            {missions.filter(m => m.category === 'daily' && m.currentProgress >= m.target).length} / {missions.filter(m => m.category === 'daily').length}
                        </span>
                        <button
                            onClick={() => setActiveCategory('daily')}
                            className="px-5 py-2 bg-blue-50 text-blue-600 rounded-xl font-medium hover:bg-blue-100 transition-colors text-sm"
                        >
                            Xem
                        </button>
                    </div>
                </div>

                {/* Weekly Missions */}
                <div className="rounded-2xl p-6 bg-white border-l-4 border-purple-500 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-headline-md text-on-surface font-semibold text-base md:text-lg">📆 Hàng tuần</h3>
                        <span className="text-2xl">🎯</span>
                    </div>
                    <p className="font-body-md text-on-surface-variant text-sm mb-4 min-h-[40px]">
                        Những nhiệm vụ khó hơn với phần thưởng lớn hơn
                    </p>
                    <div className="flex items-center justify-between">
                        <span className="font-label-lg text-purple-600 font-bold">
                            {missions.filter(m => m.category === 'weekly' && m.currentProgress >= m.target).length} / {missions.filter(m => m.category === 'weekly').length}
                        </span>
                        <button
                            onClick={() => setActiveCategory('weekly')}
                            className="px-5 py-2 bg-purple-50 text-purple-600 rounded-xl font-medium hover:bg-purple-100 transition-colors text-sm"
                        >
                            Xem
                        </button>
                    </div>
                </div>

                {/* Achievement Missions */}
                <div className="rounded-2xl p-6 bg-white border-l-4 border-amber-500 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-headline-md text-on-surface font-semibold text-base md:text-lg">🏆 Thành tích</h3>
                        <span className="text-2xl">👑</span>
                    </div>
                    <p className="font-body-md text-on-surface-variant text-sm mb-4 min-h-[40px]">
                        Những mục tiêu dài hạn cho những nhà vô địch
                    </p>
                    <div className="flex items-center justify-between">
                        <span className="font-label-lg text-amber-600 font-bold">
                            {missions.filter(m => m.category === 'achievement' && m.currentProgress >= m.target).length} / {missions.filter(m => m.category === 'achievement').length}
                        </span>
                        <button
                            onClick={() => setActiveCategory('achievement')}
                            className="px-5 py-2 bg-amber-50 text-amber-600 rounded-xl font-medium hover:bg-amber-100 transition-colors text-sm"
                        >
                            Xem
                        </button>
                    </div>
                </div>
            </div>

            {/* Mission Board */}
            <div className="mt-8">
                <h2 className="font-headline-md text-on-surface mb-6 flex items-center gap-3 font-bold text-xl">
                    <span className="text-3xl">🎮</span>
                    <span>Chi tiết nhiệm vụ</span>
                </h2>
                <MissionBoard
                    missions={missions}
                    onClaimReward={onClaimReward}
                    activeCategory={activeCategory}
                />
            </div>

        </div>
    );
};