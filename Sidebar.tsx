// src/components/Sidebar.tsx
import React from 'react';

interface SidebarProps {
    activeItem: string;
    onGoHome: () => void;
    onGoMissions: () => void;
    onGoAchievements: () => void; // Khai báo prop điều hướng trang Thành tựu
    onGoProfiles: () => void;
    activeProfile: any;
}

export const Sidebar: React.FC<SidebarProps> = ({
    activeItem = 'home',
    onGoHome,
    onGoMissions,
    onGoAchievements,
    onGoProfiles,
    activeProfile,
}) => {
    // Đã cấu trúc lại mảng này để mỗi menu tự nhận đúng hàm onClick riêng của nó
    const navItems: { key: 'home' | 'missions' | 'profiles' | 'achievements'; label: string; icon: string; onClick?: () => void }[] = [
        { key: 'home', label: 'Home', icon: 'home', onClick: onGoHome },
        { key: 'missions', label: 'Missions', icon: 'rocket_launch', onClick: onGoMissions },
        { key: 'profiles', label: 'Profiles', icon: 'face', onClick: onGoProfiles },
        { key: 'achievements', label: 'Achievements', icon: 'military_tech', onClick: onGoAchievements }, // 🔥 Đã sửa: Thêm onClick vào đây
    ];

    return (
        <aside className="hidden lg:flex flex-col h-[calc(100vh-4rem)] fixed left-0 top-16 p-sm border-r border-outline-variant/10 bg-surface-container-low w-64 z-40 overflow-y-auto">
            <div className="p-md mb-md">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                        {activeProfile?.emoji || '🐯'}
                    </div>
                    <div>
                        <h2 className="font-headline-md text-label-lg text-primary">{activeProfile?.name || 'Learning Room'}</h2>
                        <p className="font-label-sm text-on-surface-variant">Level 5 Explorer</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 flex flex-col gap-2">
                {navItems.map(item => (
                    <button
                        key={item.key}
                        onClick={item.onClick} // 🔥 Đã sửa: Giờ chỉ cần gọi item.onClick chung, trình duyệt tự phân phối đúng nút
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all text-left ${activeItem === item.key
                            ? 'bg-secondary-container text-on-secondary-container translate-x-1'
                            : 'text-on-surface-variant hover:bg-surface-container-high'
                            }`}
                    >
                        <span
                            className="material-symbols-outlined"
                            style={activeItem === item.key ? { fontVariationSettings: "'FILL' 1" } : undefined}
                        >
                            {item.icon}
                        </span>
                        <span className="font-label-lg">{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* Phần dưới đáy menu - Đã xóa bỏ hoàn toàn nút Store bọc ngoài */}
            <div className="mt-auto pt-md flex flex-col gap-2">
                <button className="flex items-center gap-3 text-on-surface-variant px-4 py-3 hover:bg-surface-container-high rounded-xl transition-all text-left">
                    <span className="material-symbols-outlined">help</span>
                    <span className="font-label-lg">Help</span>
                </button>
            </div>
        </aside>
    );
};