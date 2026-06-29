// src/App.tsx
import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { LevelDashboard } from './components/LevelDashboard';
import { SkillListening } from './components/SkillListening';
import { SkillSpeaking } from './components/SkillSpeaking';
import { SkillReading } from './components/SkillReading';
import { SkillWriting } from './components/SkillWriting';
import { Chatbot } from './components/Chatbot';
import { levels, lessonsData } from './data/lessonsData';
import './App.css';

type ScreenType = 'dashboard' | 'level-dashboard' | 'listening' | 'speaking' | 'reading' | 'writing';

function App() {
  const [screen, setScreen] = useState<ScreenType>('dashboard');
  const [activeLevelId, setActiveLevelId] = useState<number | null>(null);
  const [stars, setStars] = useState<number>(0);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  // Load stars from LocalStorage
  useEffect(() => {
    const savedStars = localStorage.getItem('kids_english_stars');
    if (savedStars) {
      setStars(parseInt(savedStars, 10));
    }
  }, []);

  const handleAddStars = (amount: number) => {
    setStars(prev => {
      const newStars = prev + amount;
      localStorage.setItem('kids_english_stars', newStars.toString());
      return newStars;
    });
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

  const handleBackToLevel = () => {
    setScreen('level-dashboard');
  };

  const activeLevel = levels.find(l => l.id === activeLevelId);
  const activeLessons = activeLevelId ? lessonsData[activeLevelId] : null;

  return (
    <div className="app-root-layout">
      {/* Top Navbar */}
      <Navbar 
        stars={stars} 
        onGoHome={handleGoHome} 
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
      />

      {/* Main Body with potential chatbot sidebar */}
      <div className="app-body-layout">
        <main className="main-content-area">
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
            />
          )}

          {screen === 'speaking' && activeLessons && (
            <SkillSpeaking 
              phrases={activeLessons.speaking}
              onBack={handleBackToLevel}
              onAddStars={handleAddStars}
            />
          )}

          {screen === 'reading' && activeLessons && (
            <SkillReading 
              story={activeLessons.reading}
              onBack={handleBackToLevel}
              onAddStars={handleAddStars}
            />
          )}

          {screen === 'writing' && activeLessons && (
            <SkillWriting 
              tasks={activeLessons.writing}
              onBack={handleBackToLevel}
              onAddStars={handleAddStars}
            />
          )}
        </main>

        {/* Sidebar Chatbot */}
        {isChatOpen && (
          <aside className="chatbot-sidebar">
            <Chatbot />
          </aside>
        )}
      </div>
    </div>
  );
}

export default App;