import React, { useState } from 'react';
import Icon from '@/components/ui/icon';
import { useHydra, Mail } from '@/context/HydraContext';

type MailFolder = 'inbox' | 'sent' | 'compose';

const HydMailPage: React.FC = () => {
  const { user, mails, setMails, setCurrentPage } = useHydra();
  const [folder, setFolder] = useState<MailFolder>('inbox');
  const [selected, setSelected] = useState<Mail | null>(null);
  const [compose, setCompose] = useState({ to: '', subject: '', body: '' });
  const [sent, setSent] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center" style={{ background: 'var(--bg-deep)' }}>
        <div className="text-center">
          <Icon name="Mail" size={48} className="mx-auto mb-4 opacity-20" />
          <p className="font-golos text-white/40 mb-4">Войдите, чтобы использовать HydMail</p>
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

  const inbox = mails.filter(m => m.to === user.email || m.to === `${user.username}@hydmail.com`);
  const sentMails = mails.filter(m => m.from === user.email);
  const unreadCount = inbox.filter(m => !m.read).length;

  const markRead = (mail: Mail) => {
    setMails(prev => prev.map(m => m.id === mail.id ? { ...m, read: true } : m));
    setSelected({ ...mail, read: true });
  };

  const sendMail = () => {
    if (!compose.to || !compose.subject || !compose.body) return;
    const newMail: Mail = {
      id: Date.now().toString(),
      from: user.email,
      fromName: user.username,
      to: compose.to,
      subject: compose.subject,
      body: compose.body,
      timestamp: new Date().toISOString(),
      read: true,
    };
    setMails(prev => [newMail, ...prev]);
    setSent(true);
    setTimeout(() => { setSent(false); setCompose({ to: '', subject: '', body: '' }); setFolder('inbox'); }, 2000);
  };

  const currentMails = folder === 'inbox' ? inbox : sentMails;

  const folders = [
    { id: 'inbox' as MailFolder, label: 'Входящие', icon: 'Inbox', count: unreadCount },
    { id: 'sent' as MailFolder, label: 'Отправленные', icon: 'Send' },
    { id: 'compose' as MailFolder, label: 'Написать', icon: 'Edit3' },
  ];

  return (
    <div className="min-h-screen pt-16" style={{ background: 'var(--bg-deep)' }}>
      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <div
          className="w-56 flex-shrink-0 flex flex-col py-4 px-3"
          style={{ borderRight: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}
        >
          <div className="mb-4 px-2">
            <div className="flex items-center gap-2 mb-1">
              <Icon name="Mail" size={16} style={{ color: '#4a9eff' }} />
              <span className="font-golos font-semibold text-sm text-white">HydMail</span>
            </div>
            <p className="font-golos text-xs truncate" style={{ color: 'rgba(255,255,255,0.3)' }}>{user.email}</p>
          </div>

          <div className="space-y-1">
            {folders.map(f => (
              <button
                key={f.id}
                onClick={() => { setFolder(f.id); setSelected(null); }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-golos transition-all duration-200"
                style={{
                  background: folder === f.id ? 'rgba(74,158,255,0.12)' : 'transparent',
                  color: folder === f.id ? '#4a9eff' : 'rgba(255,255,255,0.5)',
                }}
                onMouseEnter={e => {
                  if (folder !== f.id) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                }}
                onMouseLeave={e => {
                  if (folder !== f.id) (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                <div className="flex items-center gap-2">
                  <Icon name={f.icon} size={15} />
                  {f.label}
                </div>
                {f.count ? (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full font-mono"
                    style={{ background: '#4a9eff', color: '#0a0a0a', fontSize: '10px' }}
                  >
                    {f.count}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>

        {/* Mail list */}
        {folder !== 'compose' && (
          <div
            className="w-72 flex-shrink-0 overflow-y-auto"
            style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <h2 className="font-golos font-medium text-sm text-white">
                {folder === 'inbox' ? 'Входящие' : 'Отправленные'}
              </h2>
              <p className="font-golos text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {currentMails.length} писем
              </p>
            </div>

            {currentMails.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48">
                <Icon name="MailOpen" size={32} className="opacity-15 mb-2" />
                <p className="font-golos text-sm" style={{ color: 'rgba(255,255,255,0.2)' }}>Пусто</p>
              </div>
            ) : (
              currentMails.map(mail => (
                <button
                  key={mail.id}
                  onClick={() => markRead(mail)}
                  className="w-full text-left p-4 transition-all duration-200"
                  style={{
                    background: selected?.id === mail.id ? 'rgba(74,158,255,0.08)' : 'transparent',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                  }}
                  onMouseEnter={e => {
                    if (selected?.id !== mail.id) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                  }}
                  onMouseLeave={e => {
                    if (selected?.id !== mail.id) (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {!mail.read && (
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#4a9eff' }} />
                    )}
                    <span
                      className="font-golos text-sm truncate"
                      style={{
                        color: mail.read ? 'rgba(255,255,255,0.6)' : 'white',
                        fontWeight: mail.read ? 400 : 500,
                      }}
                    >
                      {folder === 'inbox' ? mail.fromName : mail.to}
                    </span>
                    <span className="font-mono text-xs ml-auto flex-shrink-0" style={{ color: 'rgba(255,255,255,0.2)' }}>
                      {new Date(mail.timestamp).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <p className="font-golos text-xs truncate font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    {mail.subject}
                  </p>
                  <p className="font-golos text-xs truncate mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    {mail.body.substring(0, 60)}...
                  </p>
                </button>
              ))
            )}
          </div>
        )}

        {/* Mail detail / Compose */}
        <div className="flex-1 overflow-y-auto">
          {folder === 'compose' ? (
            <div className="p-6 max-w-2xl mx-auto">
              <h2 className="font-golos font-semibold text-lg text-white mb-6">Новое письмо</h2>

              {sent ? (
                <div
                  className="flex items-center gap-3 p-4 rounded-2xl animate-scale-in"
                  style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}
                >
                  <Icon name="CheckCircle" size={20} style={{ color: '#22c55e' }} />
                  <span className="font-golos text-sm" style={{ color: '#22c55e' }}>Письмо отправлено!</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <ComposeField label="Кому" placeholder="username@hydmail.com" value={compose.to} onChange={v => setCompose(p => ({ ...p, to: v }))} />
                  <ComposeField label="Тема" placeholder="Введите тему письма" value={compose.subject} onChange={v => setCompose(p => ({ ...p, subject: v }))} />
                  <div>
                    <p className="font-golos text-xs mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Сообщение</p>
                    <textarea
                      value={compose.body}
                      onChange={e => setCompose(p => ({ ...p, body: e.target.value }))}
                      placeholder="Напишите ваше сообщение..."
                      rows={10}
                      className="w-full bg-transparent outline-none font-golos text-sm text-white placeholder:text-white/25 resize-none p-3 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    />
                  </div>
                  <button
                    onClick={sendMail}
                    disabled={!compose.to || !compose.subject || !compose.body}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-golos font-medium text-sm transition-all duration-200"
                    style={{
                      background: compose.to && compose.subject && compose.body ? '#4a9eff' : 'rgba(255,255,255,0.06)',
                      color: compose.to && compose.subject && compose.body ? '#0a0a0a' : 'rgba(255,255,255,0.3)',
                    }}
                  >
                    <Icon name="Send" size={14} />
                    Отправить
                  </button>
                </div>
              )}
            </div>
          ) : selected ? (
            <div className="p-6 max-w-2xl mx-auto animate-fade-up" style={{ opacity: 0 }}>
              <button
                onClick={() => setSelected(null)}
                className="flex items-center gap-2 mb-6 font-golos text-sm transition-colors"
                style={{ color: 'rgba(255,255,255,0.35)' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'white'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)'}
              >
                <Icon name="ArrowLeft" size={16} />
                Назад
              </button>

              <h1 className="font-golos text-xl font-semibold text-white mb-4">{selected.subject}</h1>

              <div
                className="flex items-center gap-3 p-3 rounded-xl mb-6"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-golos font-semibold"
                  style={{ background: 'rgba(74,158,255,0.15)', color: '#4a9eff' }}
                >
                  {selected.fromName[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-golos text-sm text-white">{selected.fromName}</p>
                  <p className="font-golos text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{selected.from} → {selected.to}</p>
                </div>
                <span className="ml-auto font-mono text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  {new Date(selected.timestamp).toLocaleString('ru-RU')}
                </span>
              </div>

              <div
                className="p-4 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <p className="font-golos text-sm leading-relaxed whitespace-pre-line" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  {selected.body}
                </p>
              </div>

              <button
                onClick={() => { setFolder('compose'); setCompose({ to: selected.from, subject: `Re: ${selected.subject}`, body: '' }); }}
                className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl font-golos text-sm transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.6)',
                }}
              >
                <Icon name="Reply" size={14} />
                Ответить
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full" style={{ color: 'rgba(255,255,255,0.15)' }}>
              <Icon name="MailOpen" size={48} className="mb-3" />
              <p className="font-golos text-sm">Выберите письмо</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ComposeField: React.FC<{
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}> = ({ label, placeholder, value, onChange }) => (
  <div>
    <p className="font-golos text-xs mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</p>
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-transparent outline-none font-golos text-sm text-white placeholder:text-white/25 px-3 py-2.5 rounded-xl"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
    />
  </div>
);

export default HydMailPage;
