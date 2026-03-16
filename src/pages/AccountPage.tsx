import React, { useState } from 'react';
import Icon from '@/components/ui/icon';
import { useHydra } from '@/context/HydraContext';

type Section = 'overview' | 'history';

const AccountPage: React.FC = () => {
  const { user, setUser, searchHistory, clearHistory, setCurrentPage } = useHydra();
  const [section, setSection] = useState<Section>('overview');

  if (!user) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center" style={{ background: 'var(--bg-deep)' }}>
        <div className="text-center">
          <Icon name="User" size={48} className="mx-auto mb-4 opacity-20" />
          <p className="font-golos text-white/40 mb-4">Вы не авторизованы</p>
          <button
            onClick={() => setCurrentPage('auth')}
            className="px-6 py-2.5 rounded-xl font-golos font-medium text-sm"
            style={{ background: '#4a9eff', color: '#0a0a0a' }}
          >
            Войти
          </button>
        </div>
      </div>
    );
  }

  const joinDate = new Date(user.createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const searches = searchHistory.filter(h => h.type === 'search');
  const visits = searchHistory.filter(h => h.type === 'visit');

  return (
    <div className="min-h-screen pt-20 pb-12" style={{ background: 'var(--bg-deep)' }}>
      <div className="max-w-3xl mx-auto px-4">
        {/* Profile header */}
        <div
          className="rounded-3xl p-6 mb-6 animate-fade-up"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            opacity: 0,
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-golos font-bold flex-shrink-0"
              style={{ background: 'rgba(74,158,255,0.15)', border: '1px solid rgba(74,158,255,0.25)', color: '#4a9eff' }}
            >
              {user.username[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="font-golos text-xl font-semibold text-white">{user.username}</h1>
              <p className="font-golos text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{user.email}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <Icon name="Calendar" size={12} style={{ color: 'rgba(255,255,255,0.3)' }} />
                <span className="font-golos text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>С нами с {joinDate}</span>
              </div>
            </div>
            <button
              onClick={() => { setUser(null); setCurrentPage('home'); }}
              className="px-4 py-2 rounded-xl font-golos text-sm transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.5)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(239,68,68,0.2)';
                (e.currentTarget as HTMLElement).style.color = '#ef4444';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)';
              }}
            >
              Выйти
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { label: 'Запросов', value: searches.length, icon: 'Search' },
              { label: 'Сайтов', value: visits.length, icon: 'Globe' },
              { label: 'AI-сессий', value: Math.floor(searches.length / 3), icon: 'Sparkles' },
            ].map((stat, i) => (
              <div
                key={i}
                className="rounded-2xl p-3 text-center"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <Icon name={stat.icon} size={16} className="mx-auto mb-1" style={{ color: '#4a9eff' }} />
                <div className="font-golos text-xl font-semibold text-white">{stat.value}</div>
                <div className="font-golos text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div
          className="flex p-1 rounded-xl mb-4 w-fit animate-fade-up"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', opacity: 0, animationDelay: '100ms' }}
        >
          {([
            { id: 'overview', label: 'Обзор', icon: 'LayoutGrid' },
            { id: 'history', label: 'История', icon: 'Clock' },
          ] as { id: Section; label: string; icon: string }[]).map(tab => (
            <button
              key={tab.id}
              onClick={() => setSection(tab.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-golos transition-all duration-200"
              style={{
                background: section === tab.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: section === tab.id ? 'white' : 'rgba(255,255,255,0.4)',
              }}
            >
              <Icon name={tab.icon} size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {section === 'overview' && (
          <div className="space-y-3 animate-fade-up" style={{ opacity: 0, animationDelay: '150ms' }}>
            <InfoCard icon="Mail" title="HydMail" value={user.email} accent />
            <InfoCard icon="User" title="Никнейм" value={`@${user.username}`} />
            <InfoCard icon="Shield" title="Статус" value="Активен" />
            <InfoCard icon="Globe" title="Последний поиск" value={searches[0]?.query || 'Пока нет'} />
          </div>
        )}

        {section === 'history' && (
          <div className="animate-fade-up" style={{ opacity: 0, animationDelay: '150ms' }}>
            <div className="flex items-center justify-between mb-4">
              <span className="font-golos text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {searchHistory.length} записей
              </span>
              {searchHistory.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-golos text-xs transition-all duration-200"
                  style={{
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.15)',
                    color: '#ef4444',
                  }}
                >
                  <Icon name="Trash2" size={12} />
                  Очистить
                </button>
              )}
            </div>

            {searchHistory.length === 0 ? (
              <div className="text-center py-16">
                <Icon name="Clock" size={40} className="mx-auto mb-3 opacity-15" />
                <p className="font-golos text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>История пуста</p>
              </div>
            ) : (
              <div className="space-y-1">
                {searchHistory.map((item, i) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
                  >
                    <Icon
                      name={item.type === 'search' ? 'Search' : 'ExternalLink'}
                      size={14}
                      style={{ color: item.type === 'search' ? 'rgba(255,255,255,0.3)' : '#4a9eff', flexShrink: 0 }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-golos text-sm text-white/80 truncate">
                        {item.type === 'visit' ? item.title || item.url : item.query}
                      </p>
                      {item.type === 'visit' && item.url && (
                        <p className="font-golos text-xs truncate mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{item.url}</p>
                      )}
                    </div>
                    <span className="font-mono text-xs flex-shrink-0" style={{ color: 'rgba(255,255,255,0.2)' }}>
                      {new Date(item.timestamp).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const InfoCard: React.FC<{ icon: string; title: string; value: string; accent?: boolean }> = ({ icon, title, value, accent }) => (
  <div
    className="flex items-center gap-4 px-4 py-3.5 rounded-2xl"
    style={{
      background: accent ? 'rgba(74,158,255,0.06)' : 'rgba(255,255,255,0.03)',
      border: `1px solid ${accent ? 'rgba(74,158,255,0.15)' : 'rgba(255,255,255,0.06)'}`,
    }}
  >
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: accent ? 'rgba(74,158,255,0.12)' : 'rgba(255,255,255,0.05)' }}
    >
      <Icon name={icon} size={16} style={{ color: accent ? '#4a9eff' : 'rgba(255,255,255,0.4)' }} />
    </div>
    <div>
      <p className="font-golos text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{title}</p>
      <p className="font-golos text-sm text-white/85 mt-0.5">{value}</p>
    </div>
  </div>
);

export default AccountPage;
