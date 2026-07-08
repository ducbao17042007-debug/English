// src/components/MissionBoard.tsx
import React, { useState } from 'react';
import type { Mission } from '../data/missionsData';
import { isMissionCompleted, getMissionStats } from '../data/missionsData';

interface MissionBoardProps {
    missions: Mission[];
    onClaimReward: (id: string, stars: number) => void;
    activeCategory?: 'daily' | 'weekly' | 'achievement';
}

export const MissionBoard: React.FC<MissionBoardProps> = ({
    missions,
    onClaimReward,
    activeCategory = 'daily',
}) => {
    const [selectedCategory, setSelectedCategory] = useState<'daily' | 'weekly' | 'achievement'>(activeCategory);

    // Filter missions by selected category
    const filteredMissions = missions.filter(m => m.category === selectedCategory);
    const stats = getMissionStats(filteredMissions);

    // Get color based on category
    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'daily':
                return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', button: 'bg-blue-500 hover:bg-blue-600' };
            case 'weekly':
                return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', button: 'bg-purple-500 hover:bg-purple-600' };
            case 'achievement':
                return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', button: 'bg-amber-500 hover:bg-amber-600' };
            default:
                return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', button: 'bg-gray-500 hover:bg-gray-600' };
        }
    };

    const colors = getCategoryColor(selectedCategory);

    return (
        <div className="w-full max-w-5xl mx-auto space-y-6">

            {/* Stats Card */}
            <div className={`rounded-2xl p-6 md:p-8 border ${colors.bg} ${colors.border} border-2`}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <p className="font-label-sm text-on-surface-variant">Tổng cộng</p>
                        <p className="font-headline-md text-on-surface">{stats.total}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="font-label-sm text-on-surface-variant">Hoàn thành</p>
                        <p className="font-headline-md text-green-600">{stats.completed}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="font-label-sm text-on-surface-variant">Có thể nhận</p>
                        <p className="font-headline-md text-orange-600">{stats.claimable}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="font-label-sm text-on-surface-variant">Đã nhận</p>
                        <p className="font-headline-md text-primary">{stats.claimed}</p>
                    </div>
                </div>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-3 overflow-x-auto pb-2">
                {(['daily', 'weekly', 'achievement'] as const).map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-6 py-2 rounded-full font-label-lg whitespace-nowrap transition-all ${selectedCategory === category
                                ? `${getCategoryColor(category).button} text-white shadow-md`
                                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                            }`}
                    >
                        {category === 'daily' && '📅 Hàng ngày'}
                        {category === 'weekly' && '📆 Hàng tuần'}
                        {category === 'achievement' && '🏆 Thành tích'}
                    </button>
                ))}
            </div>

            {/* Missions List */}
            <div className="space-y-3">
                {filteredMissions.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 text-center space-y-3 border border-outline-variant/20">
                        <span className="text-4xl">🎯</span>
                        <p className="font-body-md text-on-surface-variant">Không có nhiệm vụ trong danh mục này</p>
                    </div>
                ) : (
                    filteredMissions.map((mission) => {
                        const isCompleted = isMissionCompleted(mission);
                        const progressPercent = Math.min((mission.currentProgress / mission.target) * 100, 100);
                        const canClaim = isCompleted && !mission.isClaimed;

                        return (
                            <div
                                key={mission.id}
                                className={`rounded-2xl p-4 md:p-6 border-2 transition-all ${mission.isClaimed
                                        ? 'bg-gray-50 border-gray-200'
                                        : `border-outline-variant/30 bg-white hover:border-primary/40`
                                    }`}
                            >
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                    {/* Left: Icon + Info */}
                                    <div className="flex items-start gap-4 flex-1">
                                        {/* Emoji */}
                                        <div className="text-4xl flex-shrink-0 mt-1">{mission.emoji}</div>

                                        {/* Title + Description + Progress */}
                                        <div className="flex-1 space-y-2 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <h4 className={`font-headline-md text-base md:text-lg ${mission.isClaimed ? 'text-gray-400 line-through' : 'text-on-surface'
                                                    }`}>
                                                    {mission.title}
                                                </h4>
                                            </div>

                                            <p className="font-body-md text-on-surface-variant text-sm">
                                                {mission.description}
                                            </p>

                                            {/* Progress Bar */}
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-primary'
                                                            }`}
                                                        style={{ width: `${progressPercent}%` }}
                                                    />
                                                </div>
                                                <span className="font-label-sm text-on-surface-variant whitespace-nowrap">
                                                    {mission.currentProgress} / {mission.target}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Button */}
                                    <div className="w-full sm:w-auto flex-shrink-0">
                                        {mission.isClaimed ? (
                                            <button
                                                disabled
                                                className="w-full sm:w-auto px-6 py-2.5 bg-gray-200 text-gray-500 font-bold rounded-xl cursor-not-allowed text-sm md:text-base transition-all"
                                            >
                                                ✅ Đã nhận
                                            </button>
                                        ) : canClaim ? (
                                            <button
                                                onClick={() => onClaimReward(mission.id, mission.rewardStars)}
                                                className="w-full sm:w-auto px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-amber-900 font-bold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 active:scale-95 transition-all text-sm md:text-base btn-3d animate-pulse"
                                            >
                                                Nhận {mission.rewardStars}⭐
                                            </button>
                                        ) : (
                                            <button
                                                disabled
                                                className="w-full sm:w-auto px-6 py-2.5 bg-gray-100 text-gray-400 font-bold rounded-xl border border-gray-200 cursor-not-allowed text-sm md:text-base"
                                            >
                                                Thưởng {mission.rewardStars}⭐
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Empty state message */}
            {filteredMissions.length > 0 && stats.claimable === 0 && (
                <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20 text-center space-y-2">
                    <p className="font-body-md text-on-surface-variant">
                        💪 Bé hãy hoàn thành thêm nhiệm vụ để nhận thêm ngôi sao!
                    </p>
                </div>
            )}
        </div>
    );
};