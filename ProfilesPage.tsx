import React, { useState } from 'react';

export interface ChildProfile {
  id: string;
  name: string;
  emoji: string;
  stars: number;
  level: number;
}

export interface ParentUser {
  email: string;
  name: string;
}

interface ProfilesPageProps {
  profiles: ChildProfile[];
  activeProfileId: string;
  parentUser: ParentUser | null;
  onSelectProfile: (id: string) => void;
  onCreateProfile: (name: string, emoji: string) => void;
  onDeleteProfile: (id: string) => void;
  onLogin: (email: string, password?: string, isPasswordless?: boolean, name?: string) => { success: boolean; message: string };
  onRegister: (name: string, email: string, password: string) => { success: boolean; message: string };
  onLogout: () => void;
}

const EMOJI_OPTIONS = ['🧒', '👧', '👦', '👶', '🐼', '🐯', '🦁', '🦊', '🐨', '🦄', '🐸', '🦖', '🐝', '🐷'];

export const ProfilesPage: React.FC<ProfilesPageProps> = ({
  profiles,
  activeProfileId,
  parentUser,
  onSelectProfile,
  onCreateProfile,
  onDeleteProfile,
  onLogin,
  onRegister,
  onLogout,
}) => {
  // Parent gate states
  const [isParentMode, setIsParentMode] = useState(false);
  const [gateNum1, setGateNum1] = useState(0);
  const [gateNum2, setGateNum2] = useState(0);
  const [gateAnswer, setGateAnswer] = useState('');
  const [gateError, setGateError] = useState('');
  const [showGateInput, setShowGateInput] = useState(false);

  // Auth states
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [authMessage, setAuthMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // OTP States
  const [useOtp, setUseOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  // Google Login States
  const [showGooglePopup, setShowGooglePopup] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleCustomName, setGoogleCustomName] = useState('');
  const [googleCustomEmail, setGoogleCustomEmail] = useState('');
  const [showGoogleCustomInput, setShowGoogleCustomInput] = useState(false);

  // Create profile states
  const [newProfileName, setNewProfileName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(EMOJI_OPTIONS[0]);

  // Generate math gate question
  const handleStartParentGate = () => {
    const n1 = Math.floor(Math.random() * 8) + 2; // 2-9
    const n2 = Math.floor(Math.random() * 8) + 2; // 2-9
    setGateNum1(n1);
    setGateNum2(n2);
    setGateAnswer('');
    setGateError('');
    setShowGateInput(true);
  };

  const handleVerifyParentGate = (e: React.FormEvent) => {
    e.preventDefault();
    const correct = gateNum1 * gateNum2;
    if (parseInt(gateAnswer, 10) === correct) {
      setIsParentMode(true);
      setShowGateInput(false);
      setGateError('');
    } else {
      setGateError('Oops! Kết quả chưa đúng rồi, phụ huynh tính lại nhé!');
    }
  };

  // Auth operations
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setAuthMessage({ text: 'Vui lòng nhập đầy đủ thông tin!', isError: true });
      return;
    }
    const result = onLogin(loginEmail, loginPassword);
    setAuthMessage({ text: result.message, isError: !result.success });
    if (result.success) {
      setLoginEmail('');
      setLoginPassword('');
    }
  };

  // OTP Verification
  const handleSendOtp = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!loginEmail) {
      setAuthMessage({ text: 'Vui lòng nhập Email để nhận mã OTP!', isError: true });
      return;
    }
    setOtpLoading(true);
    setAuthMessage(null);
    setTimeout(() => {
      setOtpLoading(false);
      setOtpSent(true);
      setAuthMessage({ text: 'Đã gửi mã OTP thử nghiệm (123456) tới email của bạn! ✉️', isError: false });
    }, 1200);
  };

  const handleOtpLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) {
      setAuthMessage({ text: 'Vui lòng nhập mã OTP xác nhận!', isError: true });
      return;
    }
    if (otpCode !== '123456') {
      setAuthMessage({ text: 'Mã OTP không hợp lệ! Hãy thử nhập mã 123456.', isError: true });
      return;
    }

    // Log in passwordless using email OTP
    const result = onLogin(loginEmail, undefined, true, loginEmail.split('@')[0]);
    setAuthMessage({ text: result.message, isError: !result.success });
    if (result.success) {
      setLoginEmail('');
      setOtpCode('');
      setOtpSent(false);
      setUseOtp(false);
    }
  };

  // Google Login account select
  const handleGoogleAccountSelect = (email: string, name: string) => {
    setGoogleLoading(true);
    setAuthMessage(null);
    setTimeout(() => {
      const result = onLogin(email, undefined, true, name);
      setGoogleLoading(false);
      setShowGooglePopup(false);
      setShowGoogleCustomInput(false);
      setGoogleCustomEmail('');
      setGoogleCustomName('');
      setAuthMessage({ text: result.message, isError: !result.success });
    }, 1500);
  };

  const handleGoogleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleCustomEmail || !googleCustomName) return;
    handleGoogleAccountSelect(googleCustomEmail, googleCustomName);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      setAuthMessage({ text: 'Vui lòng điền đầy đủ các ô!', isError: true });
      return;
    }
    const result = onRegister(regName, regEmail, regPassword);
    setAuthMessage({ text: result.message, isError: !result.success });
    if (result.success) {
      setRegName('');
      setRegEmail('');
      setRegPassword('');
      setAuthTab('login');
    }
  };

  // Profile operations
  const handleCreateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;
    onCreateProfile(newProfileName.trim(), selectedEmoji);
    setNewProfileName('');
    // Select a random emoji for next time
    const nextEmoji = EMOJI_OPTIONS[Math.floor(Math.random() * EMOJI_OPTIONS.length)];
    setSelectedEmoji(nextEmoji);
    setAuthMessage({ text: 'Tạo hồ sơ thành công! 🎉', isError: false });
  };

  const activeProfile = profiles.find((p) => p.id === activeProfileId);

  return (
    <div className="w-full space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-4xl text-primary">face</span>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">Hồ sơ học tập</h1>
            <p className="text-xs md:text-sm text-on-surface-variant">Chọn hồ sơ của bé hoặc cài đặt tài khoản phụ huynh</p>
          </div>
        </div>
        {activeProfile && (
          <div className="flex items-center gap-2 bg-primary-container text-on-primary-container px-4 py-2 rounded-full shadow-sm">
            <span className="text-xl">{activeProfile.emoji}</span>
            <span className="font-bold text-xs md:text-sm">Bé: {activeProfile.name}</span>
          </div>
        )}
      </div>

      {/* Main Grid: Kid Mode Profile Selector */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧒✨</span>
          <h2 className="text-xl font-black text-on-surface">Bé hãy chọn hồ sơ của mình nhé!</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {profiles.map((profile) => {
            const isActive = profile.id === activeProfileId;
            return (
              <div
                key={profile.id}
                onClick={() => onSelectProfile(profile.id)}
                className={`bento-card bg-surface-container-lowest rounded-3xl p-5 border-2 transition-all flex flex-col items-center justify-center cursor-pointer text-center relative ${isActive
                    ? 'border-primary ring-4 ring-primary/10 shadow-lg translate-y-[-4px]'
                    : 'border-outline-variant/30 hover:border-primary/50'
                  }`}
              >
                {isActive && (
                  <span className="absolute top-3 right-3 bg-secondary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md animate-bounce">
                    ✓
                  </span>
                )}
                {/* Emoji Circle */}
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4 shadow-inner ${isActive ? 'bg-primary-container' : 'bg-surface-container-low'
                    }`}
                >
                  {profile.emoji}
                </div>
                {/* Profile Name */}
                <span className="font-black text-on-surface text-lg block mb-1">{profile.name}</span>
                {/* Stars Indicator */}
                <div className="flex items-center gap-1 bg-secondary-container px-2.5 py-1 rounded-full text-xs font-bold text-on-secondary-container">
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  <span>{profile.stars} sao</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section: Parent Area & Gate */}
      <section className="bg-surface-container rounded-3xl border border-outline-variant/20 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="bg-surface-container-high px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{isParentMode ? '🔓' : '🔐'}</span>
            <div>
              <h3 className="font-black text-on-surface text-base">Góc Phụ Huynh (Parent Zone)</h3>
              <p className="text-xs text-on-surface-variant">Đăng nhập tài khoản, tạo và xóa hồ sơ của bé</p>
            </div>
          </div>
          {!isParentMode ? (
            !showGateInput ? (
              <button
                onClick={handleStartParentGate}
                className="btn-3d bg-primary text-white font-bold px-5 py-2.5 rounded-xl text-xs md:text-sm"
              >
                Nhấp để mở khóa 🔑
              </button>
            ) : (
              <form onSubmit={handleVerifyParentGate} className="flex items-center gap-2">
                <span className="font-bold text-xs md:text-sm text-primary">
                  Bố mẹ tính nhé: {gateNum1} x {gateNum2} =
                </span>
                <input
                  type="number"
                  value={gateAnswer}
                  onChange={(e) => setGateAnswer(e.target.value)}
                  className="w-16 px-2 py-1.5 border border-primary rounded-xl font-bold text-center text-sm focus:outline-none"
                  autoFocus
                  required
                />
                <button
                  type="submit"
                  className="bg-secondary text-white font-bold px-3 py-1.5 rounded-xl text-xs hover:bg-secondary-hover transition-colors"
                >
                  Xác nhận
                </button>
                <button
                  type="button"
                  onClick={() => setShowGateInput(false)}
                  className="text-on-surface-variant hover:text-danger font-bold text-xs px-2"
                >
                  Hủy
                </button>
              </form>
            )
          ) : (
            <button
              onClick={() => setIsParentMode(false)}
              className="bg-outline-variant text-on-surface font-bold px-4 py-2 rounded-xl text-xs hover:bg-outline-variant/80 transition-colors"
            >
              Khóa lại 🔒
            </button>
          )}
        </div>

        {/* Locked State Warning */}
        {!isParentMode && (
          <div className="w-full flex flex-col items-center justify-center p-8 md:p-12 text-center space-y-5">
            <div className="text-6xl drop-shadow-md">🤫🤖</div>

            <p className="w-full max-w-2xl mx-auto text-lg md:text-xl font-bold text-on-surface-variant leading-relaxed">
              Khu vực này được bảo vệ để các bé không tự ý đổi cài đặt. <br className="hidden md:block" />
              Phụ huynh hãy mở khóa bằng cách làm phép tính ở trên nhé!
            </p>

            {gateError && (
              <p className="text-sm font-bold text-red-600 bg-red-50 px-4 py-2 rounded-xl animate-shake">
                {gateError}
              </p>
            )}
          </div>
        )}

        {/* Unlocked State Content */}
        {isParentMode && (
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-outline-variant/30">
            {/* Column 1: Parent Authentication */}
            <div className="space-y-6 pb-6 md:pb-0">
              <h4 className="font-black text-primary text-base flex items-center gap-2">
                <span className="material-symbols-outlined">supervisor_account</span>
                Tài khoản phụ huynh
              </h4>

              {authMessage && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold ${authMessage.isError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                    }`}
                >
                  {authMessage.text}
                </div>
              )}

              {parentUser ? (
                // Logged In Status
                <div className="space-y-4">
                  <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-5 space-y-3">
                    <p className="text-sm text-on-surface-variant font-medium">Xin chào phụ huynh:</p>
                    <p className="font-black text-on-surface text-lg">{parentUser.name}</p>
                    <p className="text-xs text-on-surface-variant font-mono">{parentUser.email}</p>
                    <div className="flex items-center gap-2 text-xs text-secondary font-bold pt-2">
                      <span className="material-symbols-outlined text-sm">cloud_done</span>
                      Đã đồng bộ hóa tài khoản & sao học tập
                    </div>
                  </div>
                  <button
                    onClick={onLogout}
                    className="w-full btn-3d bg-red-500 text-white font-bold py-3 rounded-xl text-sm"
                  >
                    Đăng xuất tài khoản
                  </button>
                </div>
              ) : (
                // Authentication Tabs
                <div className="space-y-4">
                  <div className="flex border-b border-outline-variant/20">
                    <button
                      onClick={() => {
                        setAuthTab('login');
                        setAuthMessage(null);
                      }}
                      className={`flex-1 pb-3 font-bold text-sm text-center border-b-2 transition-colors ${authTab === 'login' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant'
                        }`}
                    >
                      Đăng nhập
                    </button>
                    <button
                      onClick={() => {
                        setAuthTab('register');
                        setAuthMessage(null);
                      }}
                      className={`flex-1 pb-3 font-bold text-sm text-center border-b-2 transition-colors ${authTab === 'register' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant'
                        }`}
                    >
                      Đăng ký mới
                    </button>
                  </div>

                  {authTab === 'login' ? (
                    useOtp ? (
                      // OTP Login Form
                      <form onSubmit={handleOtpLoginSubmit} className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-on-surface-variant block">Email phụ huynh</label>
                          <input
                            type="email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            placeholder="ba_me@example.com"
                            className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-white text-sm focus:outline-none focus:border-primary text-on-surface"
                            disabled={otpSent}
                            required
                          />
                        </div>

                        {otpSent ? (
                          <>
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-on-surface-variant block">Mã xác minh OTP (6 chữ số)</label>
                              <input
                                type="text"
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="Nhập 123456"
                                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-white text-sm focus:outline-none focus:border-primary text-on-surface font-mono text-center tracking-widest text-lg font-bold"
                                maxLength={6}
                                required
                              />
                            </div>
                            <button
                              type="submit"
                              className="w-full btn-3d bg-primary text-white font-bold py-3 rounded-xl text-sm"
                            >
                              Xác nhận đăng nhập
                            </button>
                            <button
                              type="button"
                              onClick={handleSendOtp}
                              className="w-full text-center text-xs font-bold text-primary hover:underline"
                            >
                              Gửi lại mã OTP
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={otpLoading}
                            className="w-full btn-3d bg-secondary text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2"
                          >
                            {otpLoading ? (
                              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                              <span className="material-symbols-outlined text-sm">send</span>
                            )}
                            <span>{otpLoading ? 'Đang gửi...' : 'Gửi mã OTP qua Email'}</span>
                          </button>
                        )}

                        <div className="flex justify-between items-center pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setUseOtp(false);
                              setAuthMessage(null);
                            }}
                            className="text-xs text-primary font-bold hover:underline"
                          >
                            ← Đăng nhập bằng Mật khẩu
                          </button>
                        </div>
                      </form>
                    ) : (
                      // Password Login Form
                      <form onSubmit={handleLoginSubmit} className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-on-surface-variant block">Email phụ huynh</label>
                          <input
                            type="email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            placeholder="parent@kidsenglish.com"
                            className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-white text-sm focus:outline-none focus:border-primary text-on-surface"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-on-surface-variant block">Mật khẩu</label>
                          <input
                            type="password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-white text-sm focus:outline-none focus:border-primary text-on-surface"
                            required
                          />
                        </div>
                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-xs text-orange-700 font-medium">
                          💡 Thử nghiệm nhanh với: <br />
                          <strong>Email:</strong> parent@kidsenglish.com <br />
                          <strong>Mật khẩu:</strong> password123
                        </div>
                        <button
                          type="submit"
                          className="w-full btn-3d bg-primary text-white font-bold py-3 rounded-xl text-sm"
                        >
                          Đăng nhập ngay
                        </button>

                        <div className="flex justify-between items-center pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setUseOtp(true);
                              setAuthMessage(null);
                            }}
                            className="text-xs text-primary font-bold hover:underline"
                          >
                            Đăng nhập bằng mã OTP qua Email →
                          </button>
                        </div>
                      </form>
                    )
                  ) : (
                    // Register Form
                    <form onSubmit={handleRegisterSubmit} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-on-surface-variant block">Tên phụ huynh</label>
                        <input
                          type="text"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="Nguyễn Văn A"
                          className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-white text-sm focus:outline-none focus:border-primary text-on-surface"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-on-surface-variant block">Email phụ huynh</label>
                        <input
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="bame@example.com"
                          className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-white text-sm focus:outline-none focus:border-primary text-on-surface"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-on-surface-variant block">Mật khẩu</label>
                        <input
                          type="password"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Tối thiểu 6 ký tự"
                          className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-white text-sm focus:outline-none focus:border-primary text-on-surface"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full btn-3d bg-secondary text-white font-bold py-3 rounded-xl text-sm"
                      >
                        Đăng ký tài khoản mới
                      </button>
                    </form>
                  )}

                  {/* Google Login Section */}
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-outline-variant/30"></div>
                    <span className="flex-shrink mx-3 text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Hoặc</span>
                    <div className="flex-grow border-t border-outline-variant/30"></div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowGooglePopup(true)}
                    className="w-full py-2.5 px-4 rounded-xl border-2 border-outline-variant bg-white hover:bg-surface-container-low transition-all flex items-center justify-center gap-3 font-bold text-sm text-on-surface cursor-pointer shadow-xs active:scale-98"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.1.85-2.08 2.18v1.81h3.35c1.96-1.8 3.09-4.46 3.09-7.84z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.88-3.01c-1.08.72-2.45 1.16-4.08 1.16-3.14 0-5.8-2.11-6.75-4.96H1.31v3.11C3.29 22.25 7.37 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.25 14.28c-.24-.72-.38-1.5-.38-2.28s.14-1.56.38-2.28V6.61H1.31C.48 8.28 0 10.09 0 12s.48 3.72 1.31 5.39l3.94-3.11z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.96 1.19 15.24 0 12 0 7.37 0 3.29 1.75 1.31 4.75l3.94 3.11c.95-2.85 3.61-4.96 6.75-4.96z"
                      />
                    </svg>
                    <span>Đăng nhập bằng Google</span>
                  </button>
                </div>
              )}
            </div>

            {/* Column 2: Profiles Management */}
            <div className="space-y-6 pt-6 md:pt-0 md:pl-8">
              <h4 className="font-black text-primary text-base flex items-center gap-2">
                <span className="material-symbols-outlined">manage_accounts</span>
                Quản lý hồ sơ của bé
              </h4>

              {/* Add Profile Form */}
              <form onSubmit={handleCreateProfileSubmit} className="space-y-4 bg-surface-container-lowest border border-outline-variant/40 p-4 rounded-2xl">
                <p className="text-xs font-bold text-on-surface-variant">Tạo thêm hồ sơ học tập mới:</p>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant block uppercase">Tên của bé</label>
                  <input
                    type="text"
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    placeholder="Ví dụ: Bé Na, Bé Bon..."
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-white text-xs focus:outline-none focus:border-primary text-on-surface font-bold"
                    maxLength={15}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant block uppercase">Chọn hình đại diện (Avatar)</label>
                  <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-1.5 border border-outline-variant/30 rounded-xl bg-surface-container-low">
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setSelectedEmoji(emoji)}
                        className={`text-xl w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${selectedEmoji === emoji ? 'bg-primary text-white border-2 border-primary' : 'bg-white'
                          }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!newProfileName.trim()}
                  className="w-full bg-secondary text-white font-bold py-2 rounded-xl text-xs hover:bg-secondary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  + Tạo hồ sơ mới
                </button>
              </form>

              {/* Profiles Deletion List */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-on-surface-variant">Danh sách hồ sơ hiện tại:</p>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {profiles.map((profile) => {
                    const isActive = profile.id === activeProfileId;
                    return (
                      <div
                        key={profile.id}
                        className="flex items-center justify-between bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-2.5"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{profile.emoji}</span>
                          <span className="font-bold text-xs text-on-surface">
                            {profile.name} {isActive && <span className="text-[10px] text-primary">(Đang chọn)</span>}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onDeleteProfile(profile.id)}
                          disabled={isActive || profiles.length <= 1}
                          className="text-danger hover:bg-red-50 p-1.5 rounded-full transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                          title={isActive ? 'Không thể xóa hồ sơ đang hoạt động' : profiles.length <= 1 ? 'Phải giữ lại ít nhất 1 hồ sơ' : 'Xóa hồ sơ'}
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Simulated Google Login Popup */}
      {showGooglePopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-outline-variant/30 flex flex-col p-6 animate-popIn">

            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.1.85-2.08 2.18v1.81h3.35c1.96-1.8 3.09-4.46 3.09-7.84z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.88-3.01c-1.08.72-2.45 1.16-4.08 1.16-3.14 0-5.8-2.11-6.75-4.96H1.31v3.11C3.29 22.25 7.37 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.25 14.28c-.24-.72-.38-1.5-.38-2.28s.14-1.56.38-2.28V6.61H1.31C.48 8.28 0 10.09 0 12s.48 3.72 1.31 5.39l3.94-3.11z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.96 1.19 15.24 0 12 0 7.37 0 3.29 1.75 1.31 4.75l3.94 3.11c.95-2.85 3.61-4.96 6.75-4.96z"
                  />
                </svg>
                <span className="font-bold text-xs text-on-surface-variant font-mono">Sign in with Google</span>
              </div>
              <button
                onClick={() => {
                  setShowGooglePopup(false);
                  setShowGoogleCustomInput(false);
                }}
                className="text-on-surface-variant hover:text-danger text-xl font-bold"
              >
                &times;
              </button>
            </div>

            {googleLoading ? (
              /* Loading Spinner */
              <div className="py-12 flex flex-col items-center justify-center space-y-4">
                <span className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></span>
                <p className="text-xs font-bold text-on-surface-variant animate-pulse">Đang kết nối tài khoản Google...</p>
              </div>
            ) : showGoogleCustomInput ? (
              /* Use custom Google account form */
              <form onSubmit={handleGoogleCustomSubmit} className="py-4 space-y-4">
                <p className="text-xs font-bold text-on-surface-variant">Nhập tài khoản Google mới:</p>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant block uppercase">Họ và tên</label>
                  <input
                    type="text"
                    value={googleCustomName}
                    onChange={(e) => setGoogleCustomName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs focus:outline-none focus:border-primary text-on-surface font-bold"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant block uppercase">Địa chỉ Gmail</label>
                  <input
                    type="email"
                    value={googleCustomEmail}
                    onChange={(e) => setGoogleCustomEmail(e.target.value)}
                    placeholder="tenban@gmail.com"
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-xs focus:outline-none focus:border-primary text-on-surface font-bold"
                    required
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowGoogleCustomInput(false)}
                    className="flex-1 bg-surface-container-high text-on-surface font-bold py-2 rounded-xl text-xs"
                  >
                    Quay lại
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-white font-bold py-2 rounded-xl text-xs"
                  >
                    Tiếp theo
                  </button>
                </div>
              </form>
            ) : (
              /* Choose Account Grid */
              <div className="py-4 space-y-3">
                <div className="text-center pb-2">
                  <h5 className="font-bold text-on-surface text-sm">Chọn tài khoản</h5>
                  <p className="text-[10px] text-on-surface-variant">để tiếp tục đến ứng dụng KidsEnglish</p>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {/* Account 1 */}
                  <button
                    onClick={() => handleGoogleAccountSelect('parent@kidsenglish.com', 'Phụ huynh KidsEnglish')}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low border border-transparent hover:border-outline-variant/30 text-left transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                      K
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface">Phụ huynh KidsEnglish</p>
                      <p className="text-[10px] text-on-surface-variant font-mono">parent@kidsenglish.com</p>
                    </div>
                  </button>

                  {/* Account 2 */}
                  <button
                    onClick={() => handleGoogleAccountSelect('trang.nguyen@gmail.com', 'Nguyễn Thu Trang')}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low border border-transparent hover:border-outline-variant/30 text-left transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">
                      T
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface">Nguyễn Thu Trang</p>
                      <p className="text-[10px] text-on-surface-variant font-mono">trang.nguyen@gmail.com</p>
                    </div>
                  </button>

                  {/* Account 3: Use other */}
                  <button
                    onClick={() => setShowGoogleCustomInput(true)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low border border-transparent hover:border-outline-variant/30 text-left transition-colors cursor-pointer text-primary"
                  >
                    <span className="material-symbols-outlined text-xl">add_circle</span>
                    <span className="text-xs font-bold">Sử dụng tài khoản khác</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
