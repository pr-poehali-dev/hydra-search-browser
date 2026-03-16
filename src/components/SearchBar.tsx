import React, { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { useHydra } from '@/context/HydraContext';

interface SearchBarProps {
  variant?: 'hero' | 'compact';
  onSearch?: (query: string) => void;
  initialValue?: string;
}

const suggestions = [
  'искусственный интеллект',
  'последние новости',
  'квантовые компьютеры',
  'космические миссии',
  'машинное обучение',
  'как работает интернет',
  'лучшие фильмы 2024',
  'программирование на Python',
];

const SearchBar: React.FC<SearchBarProps> = ({ variant = 'hero', onSearch, initialValue = '' }) => {
  const [value, setValue] = useState(initialValue);
  const [focused, setFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { searchHistory, addSearchHistory, setCurrentPage, setCurrentQuery } = useHydra();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const recentSearches = searchHistory
    .filter(h => h.type === 'search')
    .slice(0, 4)
    .map(h => h.query);

  const filteredSuggestions = value.length > 0
    ? suggestions.filter(s => s.toLowerCase().includes(value.toLowerCase())).slice(0, 4)
    : [];

  const allSuggestions = value.length === 0 ? recentSearches : filteredSuggestions;

  const handleSubmit = (q?: string) => {
    const query = q || value;
    if (!query.trim()) return;
    addSearchHistory({ query, timestamp: new Date().toISOString(), type: 'search' });
    setCurrentQuery(query);
    setCurrentPage('search');
    onSearch?.(query);
    setShowSuggestions(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const isHero = variant === 'hero';

  return (
    <div className={`relative ${isHero ? 'w-full max-w-2xl' : 'w-full max-w-xl'}`}>
      <div
        className="relative flex items-center transition-all duration-300"
        style={{
          background: focused ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${focused ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: showSuggestions && allSuggestions.length > 0 ? '16px 16px 0 0' : '16px',
          boxShadow: focused ? '0 0 0 1px rgba(255,255,255,0.05)' : 'none',
        }}
      >
        <Icon
          name="Search"
          size={isHero ? 20 : 16}
          className="ml-4 flex-shrink-0"
          style={{ color: focused ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)' }}
        />
        <input
          ref={inputRef}
          value={value}
          onChange={e => { setValue(e.target.value); setShowSuggestions(true); }}
          onFocus={() => { setFocused(true); setShowSuggestions(true); }}
          onBlur={() => { setTimeout(() => { setFocused(false); setShowSuggestions(false); }, 150); }}
          onKeyDown={handleKey}
          placeholder={isHero ? 'Поиск по всему интернету...' : 'Поиск...'}
          className="flex-1 bg-transparent outline-none font-golos text-white placeholder:text-white/25"
          style={{ padding: isHero ? '16px 12px' : '10px 10px', fontSize: isHero ? '16px' : '14px' }}
        />
        {value && (
          <button
            onClick={() => { setValue(''); inputRef.current?.focus(); }}
            className="p-2 mr-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <Icon name="X" size={14} className="text-white/40" />
          </button>
        )}
        <button
          onClick={() => handleSubmit()}
          className="mr-2 px-4 py-2 rounded-xl font-golos font-medium text-sm transition-all duration-200 flex-shrink-0"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'rgba(255,255,255,0.85)',
          }}
          onMouseEnter={e => {
            (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.14)';
            (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.3)';
          }}
          onMouseLeave={e => {
            (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
            (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)';
          }}
        >
          Найти
        </button>
      </div>

      {showSuggestions && allSuggestions.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 z-50 overflow-hidden"
          style={{
            background: 'rgba(16,16,16,0.98)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderTop: 'none',
            borderRadius: '0 0 16px 16px',
            backdropFilter: 'blur(40px)',
          }}
        >
          {value.length === 0 && recentSearches.length > 0 && (
            <div className="px-4 pt-3 pb-1">
              <span className="text-xs font-golos" style={{ color: 'rgba(255,255,255,0.3)' }}>Недавние</span>
            </div>
          )}
          {allSuggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => { setValue(s); handleSubmit(s); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
              style={{ color: 'rgba(255,255,255,0.8)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <Icon name={value.length === 0 ? 'Clock' : 'Search'} size={14} className="text-white/30 flex-shrink-0" />
              <span className="font-golos text-sm">{s}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
