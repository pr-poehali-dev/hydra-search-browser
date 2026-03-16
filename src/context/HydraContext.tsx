import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: string;
  type: 'search' | 'visit';
  url?: string;
  title?: string;
}

export interface Mail {
  id: string;
  from: string;
  fromName: string;
  to: string;
  subject: string;
  body: string;
  timestamp: string;
  read: boolean;
}

export interface Theme {
  bgDeep: string;
  bgPanel: string;
  bgElement: string;
  textPrimary: string;
  textSecondary: string;
  accentBlue: string;
  borderSubtle: string;
}

interface HydraContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  searchHistory: SearchHistoryItem[];
  addSearchHistory: (item: Omit<SearchHistoryItem, 'id'>) => void;
  clearHistory: () => void;
  mails: Mail[];
  setMails: React.Dispatch<React.SetStateAction<Mail[]>>;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  currentQuery: string;
  setCurrentQuery: (q: string) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  language: string;
  setLanguage: (l: string) => void;
}

const defaultTheme: Theme = {
  bgDeep: '#0a0a0a',
  bgPanel: '#121212',
  bgElement: '#1a1a1a',
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255,255,255,0.55)',
  accentBlue: '#4a9eff',
  borderSubtle: 'rgba(255,255,255,0.08)',
};

const HydraContext = createContext<HydraContextType>({
  user: null,
  setUser: () => {},
  searchHistory: [],
  addSearchHistory: () => {},
  clearHistory: () => {},
  mails: [],
  setMails: () => {},
  currentPage: 'home',
  setCurrentPage: () => {},
  currentQuery: '',
  setCurrentQuery: () => {},
  theme: defaultTheme,
  setTheme: () => {},
  language: 'ru',
  setLanguage: () => {},
});

const DEMO_MAILS: Mail[] = [
  {
    id: '1',
    from: 'noreply@hydmail.com',
    fromName: 'Hydra Team',
    to: 'user@hydmail.com',
    subject: 'Добро пожаловать в Hydra!',
    body: 'Привет! Твой аккаунт успешно создан. Теперь ты можешь пользоваться AI-поиском, браузером и почтой HydMail. Добро пожаловать на борт!',
    timestamp: new Date().toISOString(),
    read: false,
  },
  {
    id: '2',
    from: 'alex@hydmail.com',
    fromName: 'Alex K.',
    to: 'user@hydmail.com',
    subject: 'Тест почты Hydra',
    body: 'Привет! Проверяю работу встроенной почты. Это тестовое сообщение от другого пользователя Hydra.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: true,
  },
];

export const HydraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('hydra_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>(() => {
    const saved = localStorage.getItem('hydra_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [mails, setMails] = useState<Mail[]>(DEMO_MAILS);
  const [currentPage, setCurrentPage] = useState('home');
  const [currentQuery, setCurrentQuery] = useState('');
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('hydra_theme');
    return saved ? JSON.parse(saved) : defaultTheme;
  });
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('hydra_lang') || 'ru';
  });

  useEffect(() => {
    if (user) localStorage.setItem('hydra_user', JSON.stringify(user));
    else localStorage.removeItem('hydra_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('hydra_history', JSON.stringify(searchHistory));
  }, [searchHistory]);

  useEffect(() => {
    localStorage.setItem('hydra_theme', JSON.stringify(theme));
    const root = document.documentElement;
    root.style.setProperty('--bg-deep', theme.bgDeep);
    root.style.setProperty('--bg-panel', theme.bgPanel);
    root.style.setProperty('--bg-element', theme.bgElement);
    root.style.setProperty('--text-primary', theme.textPrimary);
    root.style.setProperty('--text-secondary', theme.textSecondary);
    root.style.setProperty('--accent-blue', theme.accentBlue);
    root.style.setProperty('--border-subtle', theme.borderSubtle);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('hydra_lang', language);
  }, [language]);

  const addSearchHistory = (item: Omit<SearchHistoryItem, 'id'>) => {
    const newItem: SearchHistoryItem = { ...item, id: Date.now().toString() };
    setSearchHistory(prev => [newItem, ...prev.slice(0, 49)]);
  };

  const clearHistory = () => setSearchHistory([]);

  return (
    <HydraContext.Provider value={{
      user, setUser,
      searchHistory, addSearchHistory, clearHistory,
      mails, setMails,
      currentPage, setCurrentPage,
      currentQuery, setCurrentQuery,
      theme, setTheme,
      language, setLanguage,
    }}>
      {children}
    </HydraContext.Provider>
  );
};

export const useHydra = () => useContext(HydraContext);
export default HydraContext;
