// src/utils/missionsHelper.ts
// Quản lý mission RIÊNG cho từng profile (localStorage), có reset theo ngày/tuần
// và cập nhật tiến độ tự động khi học sinh học bài.

import { missionsData, type Mission, type MissionTrigger } from '../data/missionsData';

const MISSIONS_KEY_PREFIX = 'kids_english_missions_';
const RESET_KEY_PREFIX = 'kids_english_missions_reset_';

type SkillType = 'listening' | 'speaking' | 'reading' | 'writing';

function todayStr(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

// Thứ Hai của tuần hiện tại, dùng làm mốc reset weekly
function weekStartStr(): string {
  const d = new Date();
  const day = d.getDay(); // 0 = CN
  const diff = (day === 0 ? -6 : 1) - day; // đưa về thứ 2
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

interface ResetInfo {
  lastDailyReset: string;
  lastWeeklyReset: string;
}

function loadResetInfo(profileId: string): ResetInfo {
  const raw = localStorage.getItem(RESET_KEY_PREFIX + profileId);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      /* ignore */
    }
  }
  return { lastDailyReset: '', lastWeeklyReset: '' };
}

function saveResetInfo(profileId: string, info: ResetInfo) {
  localStorage.setItem(RESET_KEY_PREFIX + profileId, JSON.stringify(info));
}

function cloneDefaultMissions(): Mission[] {
  return missionsData.map(m => ({ ...m }));
}

// Tải mission của 1 profile, tự động reset daily/weekly nếu đã sang ngày/tuần mới
export function loadMissionsForProfile(profileId: string): Mission[] {
  const raw = localStorage.getItem(MISSIONS_KEY_PREFIX + profileId);
  let missions: Mission[] = raw ? JSON.parse(raw) : cloneDefaultMissions();

  // Nếu mission cũ thiếu field mới (trigger) do lưu từ bản trước -> map lại theo default
  missions = missions.map(m => {
    const defaults = missionsData.find(d => d.id === m.id);
    return defaults ? { ...defaults, ...m, trigger: defaults.trigger } : m;
  });

  const reset = loadResetInfo(profileId);
  const today = todayStr();
  const thisWeek = weekStartStr();
  let changed = false;

  if (reset.lastDailyReset !== today) {
    missions = missions.map(m =>
      m.category === 'daily'
        ? { ...m, currentProgress: m.trigger === 'login' ? 1 : 0, isClaimed: false }
        : m
    );
    reset.lastDailyReset = today;
    changed = true;
  }

  if (reset.lastWeeklyReset !== thisWeek) {
    missions = missions.map(m =>
      m.category === 'weekly' ? { ...m, currentProgress: 0, isClaimed: false } : m
    );
    reset.lastWeeklyReset = thisWeek;
    changed = true;
  }

  if (changed) {
    saveResetInfo(profileId, reset);
    saveMissionsForProfile(profileId, missions);
  }

  return missions;
}

export function saveMissionsForProfile(profileId: string, missions: Mission[]) {
  localStorage.setItem(MISSIONS_KEY_PREFIX + profileId, JSON.stringify(missions));
}

// Tăng tiến độ các mission khớp với 1 "trigger" (vd hoàn thành 1 bài Nghe)
// Mission 'any-lesson' luôn được tăng kèm theo, vì bất kỳ bài học nào cũng tính.
export function bumpMissionProgress(missions: Mission[], trigger: MissionTrigger): Mission[] {
  return missions.map(m => {
    if (m.isClaimed) return m; // đã nhận thưởng thì không tăng nữa
    const matches =
      m.trigger === trigger || (m.trigger === 'any-lesson' && trigger !== 'login' && trigger !== 'total-stars' && trigger !== 'level-complete');
    if (!matches) return m;
    const newProgress = Math.min(m.currentProgress + 1, m.target);
    return { ...m, currentProgress: newProgress };
  });
}

// Cập nhật mission loại 'total-stars' để luôn phản ánh đúng tổng số sao hiện có
export function syncStarMissions(missions: Mission[], totalStars: number): Mission[] {
  return missions.map(m => {
    if (m.trigger !== 'total-stars' || m.isClaimed) return m;
    return { ...m, currentProgress: Math.min(totalStars, m.target) };
  });
}

// Đánh dấu 1 kỹ năng trong 1 cấp độ đã hoàn thành, dùng cho mission 'level-complete'
const LEVEL_PROGRESS_KEY_PREFIX = 'kids_english_level_progress_';
const ALL_SKILLS: SkillType[] = ['listening', 'speaking', 'reading', 'writing'];

export function markSkillDoneForLevel(
  profileId: string,
  levelId: number,
  skill: SkillType
): boolean {
  const key = LEVEL_PROGRESS_KEY_PREFIX + profileId;
  const raw = localStorage.getItem(key);
  const data: Record<string, SkillType[]> = raw ? JSON.parse(raw) : {};
  const levelKey = String(levelId);
  const done = new Set(data[levelKey] || []);
  done.add(skill);
  data[levelKey] = Array.from(done);
  localStorage.setItem(key, JSON.stringify(data));
  return ALL_SKILLS.every(s => done.has(s));
}