// src/App.tsx
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase'; // Firebase auth
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { LevelDashboard } from './components/LevelDashboard';
import { SkillListening } from './components/SkillListening';
import { SkillSpeaking } from './components/SkillSpeaking';
import { SkillReading } from './components/SkillReading';
import { SkillWriting } from './components/SkillWriting';
import { Chatbot } from './components/Chatbot';
import { MissionsPage } from './components/MissionsPage';
import { AchievementsPage } from './components/AchievementsPage';
import { ProfilesPage, type ChildProfile, type ParentUser } from './components/ProfilesPage';
import { levels, lessonsData } from './data/lessonsData';
import { type Mission } from './data/missionsData';
import {
  loadMissionsForProfile,
  saveMissionsForProfile,
  bumpMissionProgress,
  syncStarMissions,
  markSkillDoneForLevel,
} from './utils/missionsHelper';
import './App.css';

type ScreenType = 'dashboard' | 'level-dashboard' | 'listening' | 'speaking' | 'reading' | 'writing' | 'missions' | 'profiles' | 'achievements';

function App() {
  const [screen, setScreen] = useState<ScreenType>('dashboard');
  const [activeLevelId, setActiveLevelId] = useState<number | null>(null);
  const [stars, setStars] = useState<number>(0);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [missions, setMissions] = useState<Mission[]>([]);

  // ✨ Firebase Auth State
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Profile states
  const [profiles, setProfiles] = useState<ChildProfile[]>(() => {
    const saved = localStorage.getItem('kids_english_profiles');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      { id: '1', name: 'Bé Bin', emoji: '🧒', stars: 120, level: 1 },
      { id: '2', name: 'Bé Vy', emoji: '👧', stars: 85, level: 2 },
    ];
  });

  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    const saved = localStorage.getItem('kids_english_active_profile_id');
    return saved || '1';
  });

  // Auth state (for legacy compatibility)
  const [parentUser, setParentUser] = useState<ParentUser | null>(() => {
    const saved = localStorage.getItem('kids_english_parent_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) { }
    }
    return null;
  });

  // ✨ Firebase Authentication State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('✅ Firebase User logged in:', user.email);
        setFirebaseUser(user);
        // Sync with parentUser state
        const parentUser: ParentUser = {
          email: user.email || '',
          name: user.displayName || user.email?.split('@')[0] || 'User'
        };
        setParentUser(parentUser);
        localStorage.setItem('kids_english_parent_user', JSON.stringify(parentUser));
      } else {
        console.log('❌ No Firebase user logged in');
        setFirebaseUser(null);
      }
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  // Setup default parent account for testing
  useEffect(() => {
    const savedAccounts = localStorage.getItem('kids_english_parent_accounts');
    if (!savedAccounts) {
      const initialAccounts = [
        { email: 'parent@kidsenglish.com', password: 'password123', name: 'Phụ huynh KidsEnglish' }
      ];
      localStorage.setItem('kids_english_parent_accounts', JSON.stringify(initialAccounts));
    }
  }, []);

  // Sync stars state with active profile stars on mount and profile switch
  useEffect(() => {
    const active = profiles.find(p => p.id === activeProfileId);
    if (active) {
      setStars(active.stars);
      localStorage.setItem('kids_english_stars', active.stars.toString());
    }
  }, [activeProfileId]);

  // Load missions for active profile
  useEffect(() => {
    if (!activeProfileId) return;
    const loaded = loadMissionsForProfile(activeProfileId);
    const active = profiles.find(p => p.id === activeProfileId);
    const synced = syncStarMissions(loaded, active ? active.stars : 0);
    setMissions(synced);
  }, [activeProfileId]);

  // Sync missions with stars changes
  useEffect(() => {
    if (!activeProfileId || missions.length === 0) return;
    setMissions(prev => {
      const updated = syncStarMissions(prev, stars);
      saveMissionsForProfile(activeProfileId, updated);
      return updated;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stars]);

  const handleAddStars = (amount: number) => {
    setProfiles(prevProfiles => {
      const updated = prevProfiles.map(p => {
        if (p.id === activeProfileId) {
          const newStars = p.stars + amount;
          setStars(newStars);
          localStorage.setItem('kids_english_stars', newStars.toString());
          return { ...p, stars: newStars };
        }
        return p;
      });
      localStorage.setItem('kids_english_profiles', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSelectProfile = (id: string) => {
    setActiveProfileId(id);
    localStorage.setItem('kids_english_active_profile_id', id);
  };

  const handleCreateProfile = (name: string, emoji: string) => {
    const newProfile: ChildProfile = {
      id: Date.now().toString(),
      name,
      emoji,
      stars: 0,
      level: 1,
    };
    setProfiles(prev => {
      const updated = [...prev, newProfile];
      localStorage.setItem('kids_english_profiles', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteProfile = (id: string) => {
    if (id === activeProfileId) return;
    setProfiles(prev => {
      const updated = prev.filter(p => p.id !== id);
      localStorage.setItem('kids_english_profiles', JSON.stringify(updated));
      return updated;
    });
  };

  const handleLogin = (email: string, password?: string, isPasswordless?: boolean, name?: string) => {
    const savedAccountsStr = localStorage.getItem('kids_english_parent_accounts') || '[]';
    try {
      const accounts = JSON.parse(savedAccountsStr);
      if (isPasswordless) {
        let found = accounts.find((acc: any) => acc.email.toLowerCase() === email.toLowerCase());
        if (!found) {
          found = { email, password: '', name: name || email.split('@')[0] };
          accounts.push(found);
          localStorage.setItem('kids_english_parent_accounts', JSON.stringify(accounts));
        }
        const user: ParentUser = { email: found.email, name: found.name };
        setParentUser(user);
        localStorage.setItem('kids_english_parent_user', JSON.stringify(user));
        return { success: true, message: `Đăng nhập thành công! Chào mừng ${found.name}. 🎉` };
      }

      const found = accounts.find((acc: any) => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password);
      if (found) {
        const user: ParentUser = { email: found.email, name: found.name };
        setParentUser(user);
        localStorage.setItem('kids_english_parent_user', JSON.stringify(user));
        return { success: true, message: 'Đăng nhập thành công! Chào mừng phụ huynh. 🎉' };
      }
    } catch (e) { }
    return { success: false, message: 'Email hoặc mật khẩu không chính xác!' };
  };

  const handleRegister = (name: string, email: string, password: string) => {
    const savedAccountsStr = localStorage.getItem('kids_english_parent_accounts') || '[]';
    try {
      const accounts = JSON.parse(savedAccountsStr);
      const exists = accounts.some((acc: any) => acc.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        return { success: false, message: 'Email này đã được sử dụng!' };
      }
      const newAccount = { name, email, password };
      accounts.push(newAccount);
      localStorage.setItem('kids_english_parent_accounts', JSON.stringify(accounts));
      return { success: true, message: 'Đăng ký tài khoản thành công! Phụ huynh có thể đăng nhập. 🎉' };
    } catch (e) { }
    return { success: false, message: 'Đã xảy ra lỗi đăng ký!' };
  };

  const handleLogout = () => {
    setParentUser(null);
    localStorage.removeItem('kids_english_parent_user');
    // ✨ TODO: Firebase logout (Phase 2)
  };

  const handleSelectLevel = (levelId: number) => {
    setActiveLevelId(levelId);
    setScreen('level-dashboard');
  };

  const handleSelectSkill = (skill: 'listening' | 'speaking' | 'reading' | 'writing') => {
    setScreen(skill);
  };

  const handleGoHome = () => {
    setScreen('dashboard');
    setActiveLevelId(null);
  };

  const handleGoMissions = () => {
    setScreen('missions');
  };

  const handleGoAchievements = () => {
    setScreen('achievements');
  };

  const handleClaimReward = (id: string, rewardStars: number) => {
    setMissions(prev => {
      const updated = prev.map(m => (m.id === id ? { ...m, isClaimed: true } : m));
      saveMissionsForProfile(activeProfileId, updated);
      return updated;
    });
    handleAddStars(rewardStars);
  };

  const handleSkillAttempt = (skill: 'listening' | 'speaking' | 'reading' | 'writing') => {
    setMissions(prev => {
      const updated = bumpMissionProgress(prev, skill);
      saveMissionsForProfile(activeProfileId, updated);
      return updated;
    });
  };

  const handleLessonFinished = (skill: 'listening' | 'speaking' | 'reading' | 'writing') => {
    setMissions(prev => {
      let updated = bumpMissionProgress(prev, 'any-lesson');
      if (skill !== 'speaking') {
        updated = bumpMissionProgress(updated, skill);
      }

      if (activeLevelId != null) {
        const levelDone = markSkillDoneForLevel(activeProfileId, activeLevelId, skill);
        if (levelDone) {
          updated = updated.map(m =>
            m.trigger === 'level-complete' ? { ...m, currentProgress: m.target } : m
          );
        }
      }

      saveMissionsForProfile(activeProfileId, updated);
      return updated;
    });
  };

  const handleBackToLevel = () => {
    setScreen('level-dashboard');
  };

  const activeLevel = levels.find(l => l.id === activeLevelId);
  const activeLessons = activeLevelId ? lessonsData[activeLevelId] : null;
  const currentProfile = profiles.find(p => p.id === activeProfileId) || null;

  // ✨ Show loading while checking Firebase auth
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-on-surface">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-surface min-h-screen">
      {/* ✨ Firebase Status Indicator (Dev Only) */}
      {import.meta.env.MODE === 'development' && (
        <div className="fixed top-2 right-2 text-xs z-50">
          {firebaseUser ? (
            <span className="bg-green-500 text-white px-2 py-1 rounded">
              🔥 Firebase: {firebaseUser.email}
            </span>
          ) : (
            <span className="bg-gray-500 text-white px-2 py-1 rounded">
              🔥 Firebase: Not connected
            </span>
          )}
        </div>
      )}

      {/* Sidebar - Desktop Only */}
      <Sidebar
        activeItem={screen === 'profiles' ? 'profiles' : screen === 'missions' ? 'missions' : screen === 'achievements' ? 'achievements' : 'home'}
        onGoHome={handleGoHome}
        onGoMissions={handleGoMissions}
        onGoAchievements={handleGoAchievements}
        onGoProfiles={() => setScreen('profiles')}
        activeProfile={currentProfile}
      />

      {/* Navbar */}
      <Navbar
        stars={stars}
        onGoHome={handleGoHome}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
        onGoProfiles={() => setScreen('profiles')}
        activeProfile={currentProfile}
      />

      {/* Main Layout */}
      <div className="flex w-full relative pt-16 min-h-[calc(100vh-64px)] lg:pl-64">

        {/* Content Area */}
        <main className="flex-1 w-full overflow-y-auto px-8 py-6">

          <div className="w-full h-full space-y-6">
            {screen === 'dashboard' && (
              <Dashboard onSelectLevel={handleSelectLevel} stars={stars} />
            )}

            {screen === 'level-dashboard' && activeLevel && (
              <LevelDashboard
                level={activeLevel}
                onSelectSkill={handleSelectSkill}
                onBack={handleGoHome}
              />
            )}

            {screen === 'listening' && activeLessons && (
              <SkillListening
                questions={activeLessons.listening}
                onBack={handleBackToLevel}
                onAddStars={handleAddStars}
                onFinishLesson={() => handleLessonFinished('listening')}
              />
            )}

            {screen === 'speaking' && activeLessons && (
              <SkillSpeaking
                phrases={activeLessons.speaking}
                onBack={handleBackToLevel}
                onAddStars={handleAddStars}
                onPhraseAttempt={() => handleSkillAttempt('speaking')}
                onFinishLesson={() => handleLessonFinished('speaking')}
              />
            )}

            {screen === 'reading' && activeLessons && (
              <SkillReading
                story={activeLessons.reading}
                onBack={handleBackToLevel}
                onAddStars={handleAddStars}
                onFinishLesson={() => handleLessonFinished('reading')}
              />
            )}

            {screen === 'writing' && activeLessons && (
              <SkillWriting
                tasks={activeLessons.writing}
                onBack={handleBackToLevel}
                onAddStars={handleAddStars}
                onFinishLesson={() => handleLessonFinished('writing')}
              />
            )}

            {screen === 'missions' && (
              <MissionsPage
                missions={missions}
                onClaimReward={handleClaimReward}
                totalStars={stars}
              />
            )}

            {screen === 'achievements' && (
              <AchievementsPage totalStars={stars} />
            )}

            {screen === 'profiles' && (
              <ProfilesPage
                profiles={profiles}
                activeProfileId={activeProfileId}
                parentUser={parentUser}
                onSelectProfile={handleSelectProfile}
                onCreateProfile={handleCreateProfile}
                onDeleteProfile={handleDeleteProfile}
                onLogin={handleLogin}
                onRegister={handleRegister}
                onLogout={handleLogout}
              />
            )}
          </div>
        </main>

        {/* Chatbot Sidebar */}
        {isChatOpen && (
          <aside className="hidden lg:flex w-80 bg-white border-l border-outline-variant shadow-2xl p-4 flex-col fixed right-0 top-16 h-[calc(100vh-64px)] z-40">
            <Chatbot />
          </aside>
        )}
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <BottomNav
        stars={stars}
        onGoHome={handleGoHome}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        onGoMissions={handleGoMissions}
        onGoAchievements={handleGoAchievements}
        onGoProfiles={() => setScreen('profiles')}
        activeItem={screen === 'profiles' ? 'profiles' : screen === 'missions' ? 'missions' : screen === 'achievements' ? 'achievements' : 'home'}
      />
    </div>
  );
}

export default App;