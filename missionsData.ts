// src/data/missionsData.ts

// Loại sự kiện dùng để biết mission này tăng tiến độ khi nào
export type MissionTrigger =
    | 'listening'      // hoàn thành 1 bài Nghe
    | 'speaking'       // hoàn thành 1 câu Nói (mỗi lần chấm điểm)
    | 'reading'        // hoàn thành 1 bài Đọc
    | 'writing'        // hoàn thành 1 bài Viết
    | 'any-lesson'     // hoàn thành bất kỳ bài học nào (1 trong 4 kỹ năng)
    | 'level-complete' // hoàn thành trọn 1 cấp độ (đủ 4 kỹ năng)
    | 'total-stars'    // tự tính theo tổng số sao hiện có (không cộng dồn thủ công)
    | 'login';         // đăng nhập / ghé thăm app trong ngày

export interface Mission {
    id: string;
    title: string;
    description: string;
    emoji: string;
    category: 'daily' | 'weekly' | 'achievement';
    currentProgress: number;
    target: number;
    rewardStars: number;
    isClaimed: boolean;
    trigger: MissionTrigger;
}

// Kiểm tra xem một nhiệm vụ đã hoàn thành hay chưa
export const isMissionCompleted = (mission: Mission): boolean => {
    return mission.currentProgress >= mission.target;
};

// Tính toán thống kê cho một danh sách nhiệm vụ (dùng cho MissionBoard)
export const getMissionStats = (missions: Mission[]) => {
    const total = missions.length;
    const completed = missions.filter(isMissionCompleted).length;
    const claimed = missions.filter(m => m.isClaimed).length;
    const claimable = missions.filter(m => isMissionCompleted(m) && !m.isClaimed).length;

    return { total, completed, claimed, claimable };
};

// Dữ liệu nhiệm vụ mẫu
export const missionsData: Mission[] = [
    // Daily
    {
        id: 'daily-1',
        title: 'Học 1 bài Nghe',
        description: 'Hoàn thành 1 bài luyện nghe bất kỳ trong hôm nay',
        emoji: '🎧',
        category: 'daily',
        currentProgress: 0,
        target: 1,
        rewardStars: 5,
        isClaimed: false,
        trigger: 'listening',
    },
    {
        id: 'daily-2',
        title: 'Luyện nói 3 câu',
        description: 'Hoàn thành 3 câu luyện nói trong ngày',
        emoji: '🗣️',
        category: 'daily',
        currentProgress: 0,
        target: 3,
        rewardStars: 10,
        isClaimed: false,
        trigger: 'speaking',
    },
    {
        id: 'daily-3',
        title: 'Đăng nhập mỗi ngày',
        description: 'Ghé thăm ứng dụng hôm nay',
        emoji: '📅',
        category: 'daily',
        currentProgress: 1,
        target: 1,
        rewardStars: 3,
        isClaimed: false,
        trigger: 'login',
    },

    // Weekly
    {
        id: 'weekly-1',
        title: 'Hoàn thành 5 bài học',
        description: 'Hoàn thành 5 bài học bất kỳ trong tuần này',
        emoji: '📚',
        category: 'weekly',
        currentProgress: 0,
        target: 5,
        rewardStars: 20,
        isClaimed: false,
        trigger: 'any-lesson',
    },
    {
        id: 'weekly-2',
        title: 'Luyện viết 3 bài',
        description: 'Hoàn thành 3 bài luyện viết trong tuần',
        emoji: '✍️',
        category: 'weekly',
        currentProgress: 0,
        target: 3,
        rewardStars: 15,
        isClaimed: false,
        trigger: 'writing',
    },

    // Achievement
    {
        id: 'achievement-1',
        title: 'Nhà vô địch cấp độ 1',
        description: 'Hoàn thành toàn bộ Cấp độ 1',
        emoji: '🏆',
        category: 'achievement',
        currentProgress: 0,
        target: 1,
        rewardStars: 50,
        isClaimed: false,
        trigger: 'level-complete',
    },
    {
        id: 'achievement-2',
        title: 'Bộ sưu tập 100 sao',
        description: 'Tích lũy tổng cộng 100 ngôi sao',
        emoji: '⭐',
        category: 'achievement',
        currentProgress: 0,
        target: 100,
        rewardStars: 30,
        isClaimed: false,
        trigger: 'total-stars',
    },
];