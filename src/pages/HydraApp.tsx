import React from 'react';
import { useHydra } from '@/context/HydraContext';
import TopNav from '@/components/TopNav';
import HomePage from './HomePage';
import SearchPage from './SearchPage';
import AIPage from './AIPage';
import AuthPage from './AuthPage';
import AccountPage from './AccountPage';
import HydMailPage from './HydMailPage';
import SettingsPage from './SettingsPage';

const HydraApp: React.FC = () => {
  const { currentPage } = useHydra();

  const isHome = currentPage === 'home';

  return (
    <div style={{ background: 'var(--bg-deep)', minHeight: '100vh' }}>
      {!isHome && <TopNav />}

      {currentPage === 'home' && <HomeWithNav />}
      {currentPage === 'search' && <SearchPage />}
      {currentPage === 'ai' && <AIPage />}
      {currentPage === 'auth' && <AuthPage />}
      {currentPage === 'account' && <AccountPage />}
      {currentPage === 'hydmail' && <HydMailPage />}
      {currentPage === 'settings' && <SettingsPage />}
    </div>
  );
};

const HomeWithNav: React.FC = () => {
  const { user, setCurrentPage } = useHydra();

  return (
    <div className="relative">
      {/* Minimal top bar for home page */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14"
        style={{
          background: 'transparent',
        }}
      >
        <div />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage('hydmail')}
            className="p-2 rounded-xl transition-all duration-200"
            style={{ color: 'rgba(255,255,255,0.35)' }}
            title="HydMail"
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
              (e.currentTarget as HTMLElement).style.color = 'white';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m22 7-9.5 6.5L3 7" /><rect x="2" y="5" width="20" height="14" rx="2" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentPage('settings')}
            className="p-2 rounded-xl transition-all duration-200"
            style={{ color: 'rgba(255,255,255,0.35)' }}
            title="Настройки"
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
              (e.currentTarget as HTMLElement).style.color = 'white';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
            </svg>
          </button>

          {user ? (
            <button
              onClick={() => setCurrentPage('account')}
              className="flex items-center gap-2 ml-1 px-3 py-1.5 rounded-xl transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-golos font-semibold"
                style={{ background: '#4a9eff', color: '#0a0a0a' }}
              >
                {user.username[0].toUpperCase()}
              </div>
              <span className="text-sm font-golos text-white/70">{user.username}</span>
            </button>
          ) : (
            <button
              onClick={() => setCurrentPage('auth')}
              className="ml-1 px-4 py-1.5 rounded-xl text-sm font-golos font-medium"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)' }}
            >
              Войти
            </button>
          )}
        </div>
      </nav>
      <HomePage />
    </div>
  );
};

export default HydraApp;
