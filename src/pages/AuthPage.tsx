import React, { useState } from 'react';
import HydraLogo from '@/components/HydraLogo';
import Icon from '@/components/ui/icon';
import { useHydra } from '@/context/HydraContext';

type Mode = 'login' | 'register';

const DEMO_USERS_KEY = 'hydra_users';

interface StoredUser {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
}

const getUsers = (): StoredUser[] => {
  const saved = localStorage.getItem(DEMO_USERS_KEY);
  return saved ? JSON.parse(saved) : [];
};

const saveUsers = (users: StoredUser[]) => {
  localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
};

const AuthPage: React.FC = () => {
  const { setUser, setCurrentPage } = useHydra();
  const [mode, setMode] = useState<Mode>('login');
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const set = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleLogin = async () => {
    if (!form.username || !form.password) { setError('Заполните все поля'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const users = getUsers();
    const user = users.find(
      u => (u.username === form.username || u.email === form.username) && u.password === form.password
    );
    if (!user) { setError('Неверный логин или пароль'); setLoading(false); return; }
    setUser({ id: user.id, username: user.username, email: user.email, createdAt: user.createdAt });
    setCurrentPage('home');
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!form.username || !form.email || !form.password) { setError('Заполните все поля'); return; }
    if (form.password !== form.confirmPassword) { setError('Пароли не совпадают'); return; }
    if (form.password.length < 6) { setError('Пароль должен быть не менее 6 символов'); return; }
    if (!/^[a-zA-Z0-9_]+$/.test(form.username)) { setError('Ник: только латиница, цифры и _'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const users = getUsers();
    if (users.find(u => u.username === form.username)) { setError('Этот никнейм уже занят'); setLoading(false); return; }
    const email = form.email.includes('@') ? form.email : `${form.username}@hydmail.com`;
    if (users.find(u => u.email === email)) { setError('Этот email уже зарегистрирован'); setLoading(false); return; }
    const newUser: StoredUser = {
      id: Date.now().toString(),
      username: form.username,
      email,
      password: form.password,
      createdAt: new Date().toISOString(),
    };
    saveUsers([...users, newUser]);
    setUser({ id: newUser.id, username: newUser.username, email: newUser.email, createdAt: newUser.createdAt });
    setCurrentPage('home');
    setLoading(false);
  };

  const hydMailPreview = form.username
    ? `${form.username.toLowerCase().replace(/[^a-z0-9_]/g, '')}@hydmail.com`
    : 'username@hydmail.com';

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-20"
      style={{ background: 'var(--bg-deep)' }}
    >
      <div className="fixed inset-0 pointer-events-none">
        <div style={{
          position: 'absolute', width: '500px', height: '500px',
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(74,158,255,0.05) 0%, transparent 70%)',
        }} />
      </div>

      <div
        className="w-full max-w-md rounded-3xl p-8 animate-scale-in"
        style={{
          background: 'rgba(18,18,18,0.9)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(40px)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        }}
      >
        <div className="flex justify-center mb-8">
          <HydraLogo size="md" />
        </div>

        {/* Tabs */}
        <div
          className="flex p-1 rounded-xl mb-6"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {(['login', 'register'] as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); }}
              className="flex-1 py-2 rounded-lg text-sm font-golos font-medium transition-all duration-200"
              style={{
                background: mode === m ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: mode === m ? 'white' : 'rgba(255,255,255,0.4)',
              }}
            >
              {m === 'login' ? 'Войти' : 'Регистрация'}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {mode === 'register' && (
            <div>
              <p className="font-golos text-xs mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Никнейм</p>
              <AuthInput
                icon="AtSign"
                placeholder="username"
                value={form.username}
                onChange={v => set('username', v)}
              />
              {form.username && (
                <div className="mt-1.5 flex items-center gap-1.5">
                  <Icon name="Mail" size={12} style={{ color: 'rgba(74,158,255,0.6)' }} />
                  <span className="font-mono text-xs" style={{ color: 'rgba(74,158,255,0.7)' }}>{hydMailPreview}</span>
                </div>
              )}
            </div>
          )}

          <div>
            <p className="font-golos text-xs mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {mode === 'login' ? 'Никнейм или почта' : 'Email (опционально)'}
            </p>
            <AuthInput
              icon="User"
              placeholder={mode === 'login' ? 'username или email' : 'your@email.com'}
              value={mode === 'login' ? form.username : form.email}
              onChange={v => set(mode === 'login' ? 'username' : 'email', v)}
            />
          </div>

          <div>
            <p className="font-golos text-xs mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Пароль</p>
            <div className="relative">
              <AuthInput
                icon="Lock"
                placeholder="••••••••"
                value={form.password}
                onChange={v => set('password', v)}
                type={showPass ? 'text' : 'password'}
              />
              <button
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: 'rgba(255,255,255,0.3)' }}
              >
                <Icon name={showPass ? 'EyeOff' : 'Eye'} size={16} />
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <p className="font-golos text-xs mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Подтверждение пароля</p>
              <AuthInput
                icon="Lock"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={v => set('confirmPassword', v)}
                type="password"
              />
            </div>
          )}

          {error && (
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl animate-fade-in"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              <Icon name="AlertCircle" size={14} style={{ color: '#ef4444' }} />
              <span className="font-golos text-sm" style={{ color: '#ef4444' }}>{error}</span>
            </div>
          )}

          <button
            onClick={mode === 'login' ? handleLogin : handleRegister}
            disabled={loading}
            className="w-full py-3 rounded-xl font-golos font-medium text-sm transition-all duration-200 mt-2"
            style={{
              background: loading ? 'rgba(74,158,255,0.3)' : '#4a9eff',
              color: '#0a0a0a',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border-2 border-transparent animate-spin"
                  style={{ borderTopColor: '#0a0a0a' }}
                />
                {mode === 'login' ? 'Входим...' : 'Создаём...'}
              </div>
            ) : (
              mode === 'login' ? 'Войти в Hydra' : 'Создать аккаунт'
            )}
          </button>

          {mode === 'register' && (
            <div
              className="mt-3 p-3 rounded-xl"
              style={{ background: 'rgba(74,158,255,0.06)', border: '1px solid rgba(74,158,255,0.12)' }}
            >
              <div className="flex items-start gap-2">
                <Icon name="Info" size={14} style={{ color: '#4a9eff', marginTop: '2px' }} />
                <p className="font-golos text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  После регистрации вы получите персональную почту{' '}
                  <span style={{ color: '#4a9eff' }}>{hydMailPreview}</span> в системе HydMail.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AuthInput: React.FC<{
  icon: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}> = ({ icon, placeholder, value, onChange, type = 'text' }) => {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className="flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${focused ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)'}`,
      }}
    >
      <Icon name={icon} size={16} style={{ color: focused ? '#4a9eff' : 'rgba(255,255,255,0.3)' }} />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="flex-1 bg-transparent outline-none font-golos text-sm text-white placeholder:text-white/25"
        autoComplete={type === 'password' ? 'current-password' : 'off'}
      />
    </div>
  );
};

export default AuthPage;
