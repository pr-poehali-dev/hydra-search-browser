import React from 'react';
import HydraLogo from './HydraLogo';
import SearchBar from './SearchBar';
import Icon from '@/components/ui/icon';
import { useHydra } from '@/context/HydraContext';

const TopNav: React.FC = () => {
  const { user, setCurrentPage, currentPage } = useHydra();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center gap-4 px-6 h-16"
      style={{
        background: 'rgba(10,10,10,0.85)',
        backdropFilter: 'blur(40px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <button onClick={() => setCurrentPage('home')} className="flex-shrink-0">
        <HydraLogo size="sm" />
      </button>

      <div className="flex-1 max-w-xl">
        <SearchBar variant="compact" />
      </div>

      <div className="flex items-center gap-1 ml-auto">
        <NavBtn icon="Mail" label="Почта" page="hydmail" current={currentPage} onClick={() => setCurrentPage('hydmail')} />
        <NavBtn icon="Settings" label="Настройки" page="settings" current={currentPage} onClick={() => setCurrentPage('settings')} />

        {user ? (
          <button
            onClick={() => setCurrentPage('account')}
            className="flex items-center gap-2 ml-2 px-3 py-1.5 rounded-xl transition-all duration-200"
            style={{
              background: currentPage === 'account' ? 'rgba(74,158,255,0.15)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${currentPage === 'account' ? 'rgba(74,158,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
            }}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-golos font-semibold"
              style={{ background: '#4a9eff', color: '#0a0a0a' }}
            >
              {user.username[0].toUpperCase()}
            </div>
            <span className="text-sm font-golos text-white/80 hidden sm:block">{user.username}</span>
          </button>
        ) : (
          <button
            onClick={() => setCurrentPage('auth')}
            className="ml-2 px-4 py-1.5 rounded-xl text-sm font-golos font-medium transition-all duration-200"
            style={{
              background: '#4a9eff',
              color: '#0a0a0a',
            }}
          >
            Войти
          </button>
        )}
      </div>
    </nav>
  );
};

const NavBtn: React.FC<{
  icon: string;
  label: string;
  page: string;
  current: string;
  onClick: () => void;
}> = ({ icon, label, page, current, onClick }) => {
  const active = current === page;
  return (
    <button
      onClick={onClick}
      title={label}
      className="p-2 rounded-xl transition-all duration-200"
      style={{
        background: active ? 'rgba(74,158,255,0.12)' : 'transparent',
        color: active ? '#4a9eff' : 'rgba(255,255,255,0.5)',
      }}
      onMouseEnter={e => {
        if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
      }}
      onMouseLeave={e => {
        if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent';
      }}
    >
      <Icon name={icon} size={18} />
    </button>
  );
};

export default TopNav;
