import React, { useState, useEffect } from 'react';
import HydraLogo from '@/components/HydraLogo';
import SearchBar from '@/components/SearchBar';
import Icon from '@/components/ui/icon';
import { useHydra } from '@/context/HydraContext';

const features = [
  { icon: 'Zap', label: 'Быстрый поиск', desc: 'Результаты за миллисекунды' },
  { icon: 'Brain', label: 'AI-ответы', desc: 'Умные ответы на любой вопрос' },
  { icon: 'Shield', label: 'Приватность', desc: 'Без слежки и рекламы' },
  { icon: 'Mail', label: 'HydMail', desc: 'Встроенная почта' },
];

const trendingSearches = [
  'что такое черная дыра',
  'AI технологии 2024',
  'квантовые компьютеры',
  'космический телескоп',
  'нейронные сети',
  'Mars миссия',
];

const HomePage: React.FC = () => {
  const { user, setCurrentPage } = useHydra();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeStr = time.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const dateStr = time.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-20"
      style={{ background: 'var(--bg-deep)' }}
    >
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            width: '600px',
            height: '600px',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'radial-gradient(circle, rgba(74,158,255,0.04) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: '300px',
            height: '300px',
            bottom: '20%',
            right: '10%',
            background: 'radial-gradient(circle, rgba(74,158,255,0.03) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Clock */}
      <div className="text-center mb-12 animate-fade-up" style={{ animationDelay: '0ms', opacity: 0 }}>
        <div className="font-mono text-5xl font-light text-white/90 tabular-nums">{timeStr}</div>
        <div className="font-golos text-sm mt-1 capitalize" style={{ color: 'rgba(255,255,255,0.35)' }}>{dateStr}</div>
      </div>

      {/* Logo */}
      <div className="mb-10 animate-fade-up" style={{ animationDelay: '100ms', opacity: 0 }}>
        <HydraLogo size="xl" showText />
      </div>

      {/* Tagline */}
      <p
        className="font-golos text-center mb-10 max-w-md animate-fade-up"
        style={{ color: 'rgba(255,255,255,0.4)', animationDelay: '200ms', opacity: 0, fontSize: '15px', lineHeight: '1.6' }}
      >
        Умная поисковая система нового поколения.<br />Поиск, AI, почта — всё в одном месте.
      </p>

      {/* Search */}
      <div className="w-full max-w-2xl animate-fade-up" style={{ animationDelay: '300ms', opacity: 0 }}>
        <SearchBar variant="hero" />
      </div>

      {/* Trending */}
      <div className="mt-8 animate-fade-up" style={{ animationDelay: '400ms', opacity: 0 }}>
        <div className="flex items-center gap-2 mb-3 justify-center">
          <Icon name="TrendingUp" size={14} style={{ color: 'rgba(255,255,255,0.25)' }} />
          <span className="font-golos text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>В тренде</span>
        </div>
        <div className="flex flex-wrap gap-2 justify-center max-w-xl">
          {trendingSearches.map((s, i) => (
            <TrendingTag key={i} text={s} />
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl w-full animate-fade-up" style={{ animationDelay: '500ms', opacity: 0 }}>
        {features.map((f, i) => (
          <FeatureCard key={i} {...f} />
        ))}
      </div>

      {/* Auth nudge */}
      {!user && (
        <div className="mt-12 flex items-center gap-4 animate-fade-up" style={{ animationDelay: '600ms', opacity: 0 }}>
          <button
            onClick={() => setCurrentPage('auth')}
            className="px-6 py-2.5 rounded-xl font-golos font-medium text-sm transition-all duration-200"
            style={{ background: '#4a9eff', color: '#0a0a0a' }}
          >
            Создать аккаунт
          </button>
          <button
            onClick={() => setCurrentPage('auth')}
            className="px-6 py-2.5 rounded-xl font-golos text-sm transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            Войти
          </button>
        </div>
      )}
    </div>
  );
};

const TrendingTag: React.FC<{ text: string }> = ({ text }) => {
  const { setCurrentQuery, setCurrentPage, addSearchHistory } = useHydra();
  return (
    <button
      onClick={() => {
        setCurrentQuery(text);
        addSearchHistory({ query: text, timestamp: new Date().toISOString(), type: 'search' });
        setCurrentPage('search');
      }}
      className="px-3 py-1.5 rounded-full font-golos text-xs transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        color: 'rgba(255,255,255,0.55)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.background = 'rgba(74,158,255,0.1)';
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(74,158,255,0.3)';
        (e.currentTarget as HTMLElement).style.color = '#4a9eff';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
        (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)';
      }}
    >
      {text}
    </button>
  );
};

const FeatureCard: React.FC<{ icon: string; label: string; desc: string }> = ({ icon, label, desc }) => (
  <div
    className="p-4 rounded-2xl flex flex-col gap-2 transition-all duration-300"
    style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)';
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)';
    }}
  >
    <Icon name={icon} size={20} style={{ color: '#4a9eff' }} />
    <div>
      <div className="font-golos font-medium text-sm text-white">{label}</div>
      <div className="font-golos text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{desc}</div>
    </div>
  </div>
);

export default HomePage;
