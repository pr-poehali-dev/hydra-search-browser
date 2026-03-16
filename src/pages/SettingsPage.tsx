import React, { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { useHydra, Theme } from '@/context/HydraContext';

const LANGUAGES = [
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
];

const PRESET_THEMES: { name: string; theme: Theme }[] = [
  {
    name: 'Hydra Dark',
    theme: {
      bgDeep: '#0a0a0a', bgPanel: '#121212', bgElement: '#1a1a1a',
      textPrimary: '#ffffff', textSecondary: 'rgba(255,255,255,0.55)',
      accentBlue: '#4a9eff', borderSubtle: 'rgba(255,255,255,0.08)',
    },
  },
  {
    name: 'Midnight Blue',
    theme: {
      bgDeep: '#060b14', bgPanel: '#0d1520', bgElement: '#152030',
      textPrimary: '#e8f4ff', textSecondary: 'rgba(200,225,255,0.55)',
      accentBlue: '#60b0ff', borderSubtle: 'rgba(100,170,255,0.12)',
    },
  },
  {
    name: 'Obsidian',
    theme: {
      bgDeep: '#080808', bgPanel: '#111111', bgElement: '#1c1c1c',
      textPrimary: '#f5f5f5', textSecondary: 'rgba(245,245,245,0.5)',
      accentBlue: '#b0b0ff', borderSubtle: 'rgba(180,180,255,0.1)',
    },
  },
  {
    name: 'Forest',
    theme: {
      bgDeep: '#060d08', bgPanel: '#0d1a0f', bgElement: '#152018',
      textPrimary: '#e8ffe8', textSecondary: 'rgba(200,255,200,0.5)',
      accentBlue: '#50d080', borderSubtle: 'rgba(80,200,100,0.1)',
    },
  },
];

const SettingsPage: React.FC = () => {
  const { user, setUser, theme, setTheme, language, setLanguage, setCurrentPage } = useHydra();
  const [activeSection, setActiveSection] = useState('appearance');
  const [customTheme, setCustomTheme] = useState<Theme>(theme);
  const [holdProgress, setHoldProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const holdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const holdTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (holdRef.current) clearInterval(holdRef.current);
      if (holdTimeout.current) clearTimeout(holdTimeout.current);
    };
  }, []);

  const startHold = () => {
    setHolding(true);
    setHoldProgress(0);
    const start = Date.now();
    holdRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min((elapsed / 10000) * 100, 100);
      setHoldProgress(progress);
      if (progress >= 100) {
        clearInterval(holdRef.current!);
        setUser(null);
        setCurrentPage('home');
      }
    }, 50);
  };

  const endHold = () => {
    setHolding(false);
    setHoldProgress(0);
    if (holdRef.current) clearInterval(holdRef.current);
  };

  const sections = [
    { id: 'appearance', label: 'Внешний вид', icon: 'Palette' },
    { id: 'language', label: 'Язык', icon: 'Globe' },
    { id: 'account', label: 'Аккаунт', icon: 'User' },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12" style={{ background: 'var(--bg-deep)' }}>
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="font-golos text-2xl font-semibold text-white mb-6 animate-fade-up" style={{ opacity: 0 }}>
          Настройки
        </h1>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-44 flex-shrink-0">
            <div className="space-y-1">
              {sections.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-golos transition-all duration-200"
                  style={{
                    background: activeSection === s.id ? 'rgba(74,158,255,0.12)' : 'transparent',
                    color: activeSection === s.id ? '#4a9eff' : 'rgba(255,255,255,0.5)',
                  }}
                  onMouseEnter={e => {
                    if (activeSection !== s.id) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                  }}
                  onMouseLeave={e => {
                    if (activeSection !== s.id) (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }}
                >
                  <Icon name={s.icon} size={15} />
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeSection === 'appearance' && (
              <div className="space-y-6 animate-fade-up" style={{ opacity: 0 }}>
                <SectionTitle title="Темы" />
                <div className="grid grid-cols-2 gap-3">
                  {PRESET_THEMES.map(preset => (
                    <button
                      key={preset.name}
                      onClick={() => { setTheme(preset.theme); setCustomTheme(preset.theme); }}
                      className="p-4 rounded-2xl text-left transition-all duration-200 relative overflow-hidden"
                      style={{
                        background: preset.theme.bgPanel,
                        border: `1px solid ${JSON.stringify(theme) === JSON.stringify(preset.theme) ? '#4a9eff' : preset.theme.borderSubtle}`,
                      }}
                    >
                      {JSON.stringify(theme) === JSON.stringify(preset.theme) && (
                        <div className="absolute top-2 right-2">
                          <Icon name="CheckCircle" size={14} style={{ color: '#4a9eff' }} />
                        </div>
                      )}
                      <div className="flex gap-1.5 mb-3">
                        <div className="w-4 h-4 rounded-full" style={{ background: preset.theme.bgDeep }} />
                        <div className="w-4 h-4 rounded-full" style={{ background: preset.theme.bgElement }} />
                        <div className="w-4 h-4 rounded-full" style={{ background: preset.theme.accentBlue }} />
                      </div>
                      <p className="font-golos text-sm font-medium" style={{ color: preset.theme.textPrimary }}>{preset.name}</p>
                    </button>
                  ))}
                </div>

                <SectionTitle title="Кастомная тема" />
                <div
                  className="p-4 rounded-2xl space-y-3"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  {[
                    { label: 'Фон (глубокий)', key: 'bgDeep' as keyof Theme },
                    { label: 'Фон панелей', key: 'bgPanel' as keyof Theme },
                    { label: 'Элементы', key: 'bgElement' as keyof Theme },
                    { label: 'Цвет акцента', key: 'accentBlue' as keyof Theme },
                    { label: 'Текст', key: 'textPrimary' as keyof Theme },
                  ].map(field => (
                    <div key={field.key} className="flex items-center justify-between">
                      <span className="font-golos text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{field.label}</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={customTheme[field.key] as string}
                          onChange={e => setCustomTheme(prev => ({ ...prev, [field.key]: e.target.value }))}
                          className="w-8 h-8 rounded-lg cursor-pointer border-0 overflow-hidden"
                          style={{ background: 'none' }}
                        />
                        <span className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                          {customTheme[field.key] as string}
                        </span>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => setTheme(customTheme)}
                    className="w-full py-2.5 rounded-xl font-golos font-medium text-sm transition-all duration-200 mt-2"
                    style={{ background: '#4a9eff', color: '#0a0a0a' }}
                  >
                    Применить тему
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'language' && (
              <div className="space-y-3 animate-fade-up" style={{ opacity: 0 }}>
                <SectionTitle title="Язык интерфейса" />
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200"
                      style={{
                        background: language === lang.code ? 'rgba(74,158,255,0.12)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${language === lang.code ? 'rgba(74,158,255,0.3)' : 'rgba(255,255,255,0.06)'}`,
                      }}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span className="font-golos text-sm" style={{ color: language === lang.code ? '#4a9eff' : 'rgba(255,255,255,0.7)' }}>
                        {lang.label}
                      </span>
                      {language === lang.code && (
                        <Icon name="Check" size={14} style={{ color: '#4a9eff', marginLeft: 'auto' }} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'account' && (
              <div className="space-y-4 animate-fade-up" style={{ opacity: 0 }}>
                <SectionTitle title="Аккаунт" />

                {!user ? (
                  <div
                    className="p-4 rounded-2xl"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <p className="font-golos text-sm text-white/40">Вы не авторизованы</p>
                    <button
                      onClick={() => setCurrentPage('auth')}
                      className="mt-3 px-4 py-2 rounded-xl font-golos text-sm"
                      style={{ background: '#4a9eff', color: '#0a0a0a' }}
                    >
                      Войти
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div
                      className="p-4 rounded-2xl"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                      <p className="font-golos text-sm font-medium text-white">{user.username}</p>
                      <p className="font-golos text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{user.email}</p>
                    </div>

                    <div
                      className="p-4 rounded-2xl"
                      style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.12)' }}
                    >
                      <h3 className="font-golos font-medium text-sm mb-1" style={{ color: '#ef4444' }}>Удаление аккаунта</h3>
                      <p className="font-golos text-xs mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
                        Удержите кнопку 10 секунд для удаления. Это действие необратимо.
                      </p>

                      <div className="relative">
                        <button
                          onMouseDown={startHold}
                          onMouseUp={endHold}
                          onMouseLeave={endHold}
                          onTouchStart={startHold}
                          onTouchEnd={endHold}
                          className="relative w-full py-3 rounded-xl font-golos text-sm overflow-hidden transition-all duration-200"
                          style={{
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.25)',
                            color: '#ef4444',
                            cursor: 'pointer',
                          }}
                        >
                          <div
                            className="absolute inset-0 origin-left transition-none"
                            style={{
                              background: 'rgba(239,68,68,0.25)',
                              width: `${holdProgress}%`,
                            }}
                          />
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            <Icon name="Trash2" size={14} />
                            {holding ? `Удерживайте... ${Math.round(holdProgress)}%` : 'Удержать для удаления'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <h2 className="font-golos font-medium text-sm mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
    {title.toUpperCase()}
  </h2>
);

export default SettingsPage;
