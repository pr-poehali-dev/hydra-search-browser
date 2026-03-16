import React, { useState } from 'react';
import Icon from '@/components/ui/icon';
import { useHydra } from '@/context/HydraContext';

interface Message {
  role: 'user' | 'ai';
  content: string;
  sources?: string[];
  timestamp: Date;
}

const aiExamples = [
  'Что такое чёрная дыра?',
  'Как работает квантовый компьютер?',
  'Объясни нейронные сети простыми словами',
  'Что произошло в 2024 году в технологиях?',
  'Как научиться программировать с нуля?',
];

const fakeAIAnswer = (query: string): string => {
  const answers: Record<string, string> = {
    'чёрная дыра': 'Чёрная дыра — область пространства-времени, в которой гравитационное притяжение настолько велико, что ни вещество, ни электромагнитное излучение (в том числе свет) не могут её покинуть. Чёрные дыры образуются после смерти массивных звёзд, когда ядро схлопывается под действием гравитации. Ближайшая к Земле чёрная дыра — Gaia BH1, находится на расстоянии около 1500 световых лет.',
    'квантовый': 'Квантовый компьютер — вычислительное устройство, которое использует квантово-механические явления (суперпозицию и запутанность) для обработки информации. В отличие от классических битов (0 или 1), квантовые биты (кубиты) могут существовать в обоих состояниях одновременно. Это даёт квантовым компьютерам экспоненциальное преимущество при решении определённых задач.',
    'нейронные': 'Нейронная сеть — это система, вдохновлённая биологическим мозгом. Она состоит из множества простых элементов (нейронов), соединённых между собой. Каждый нейрон принимает входные сигналы, обрабатывает их и передаёт дальше. В процессе обучения веса связей настраиваются так, чтобы сеть давала правильные ответы.',
  };

  const lowerQuery = query.toLowerCase();
  for (const [key, answer] of Object.entries(answers)) {
    if (lowerQuery.includes(key)) return answer;
  }

  return `По запросу "${query}" Hydra AI нашёл следующую информацию:\n\nЭто сложная и многогранная тема, которая охватывает множество аспектов. Ключевые моменты, которые стоит знать:\n\n1. Данная область активно развивается в последние годы и привлекает внимание как учёных, так и практиков.\n\n2. Существуют различные подходы и школы мысли, каждая со своими преимуществами и ограничениями.\n\n3. Практическое применение охватывает самые разные сферы: от науки и технологий до повседневной жизни.\n\nДля более глубокого изучения рекомендуем обратиться к специализированным источникам ниже.`;
};

const fakeSources = [
  'wikipedia.org',
  'habr.com',
  'arxiv.org',
  'nature.com',
  'scientificamerican.com',
];

const AIPage: React.FC = () => {
  const { currentQuery, addSearchHistory } = useHydra();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState(currentQuery || '');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text?: string) => {
    const query = text || input;
    if (!query.trim() || loading) return;
    setInput('');
    addSearchHistory({ query, timestamp: new Date().toISOString(), type: 'search' });

    const userMsg: Message = { role: 'user', content: query, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));

    const aiMsg: Message = {
      role: 'ai',
      content: fakeAIAnswer(query),
      sources: fakeSources.slice(0, 3 + Math.floor(Math.random() * 3)),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-20 pb-6" style={{ background: 'var(--bg-deep)' }}>
      <div className="max-w-3xl mx-auto px-4 flex flex-col h-[calc(100vh-80px)]">
        {/* Header */}
        <div className="py-4 mb-2 flex items-center gap-3 animate-fade-up" style={{ opacity: 0 }}>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(74,158,255,0.15)', border: '1px solid rgba(74,158,255,0.3)' }}
          >
            <Icon name="Sparkles" size={18} style={{ color: '#4a9eff' }} />
          </div>
          <div>
            <h1 className="font-golos font-semibold text-white">Hydra AI</h1>
            <p className="font-golos text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Умные ответы на любой вопрос</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {messages.length === 0 && (
            <div className="text-center py-12 animate-fade-up" style={{ opacity: 0 }}>
              <div
                className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center"
                style={{ background: 'rgba(74,158,255,0.08)', border: '1px solid rgba(74,158,255,0.15)' }}
              >
                <Icon name="Brain" size={36} style={{ color: 'rgba(74,158,255,0.6)' }} />
              </div>
              <h2 className="font-golos text-xl font-medium text-white mb-2">Спроси что угодно</h2>
              <p className="font-golos text-sm mb-8" style={{ color: 'rgba(255,255,255,0.35)' }}>
                AI проанализирует вопрос и найдёт лучший ответ из интернета
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {aiExamples.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(ex)}
                    className="px-4 py-2 rounded-xl font-golos text-sm transition-all duration-200"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'rgba(255,255,255,0.6)',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(74,158,255,0.1)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(74,158,255,0.3)';
                      (e.currentTarget as HTMLElement).style.color = '#4a9eff';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                      (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)';
                    }}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-up`}
              style={{ opacity: 0 }}
            >
              {msg.role === 'ai' && (
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mr-3 mt-1"
                  style={{ background: 'rgba(74,158,255,0.15)', border: '1px solid rgba(74,158,255,0.25)' }}
                >
                  <Icon name="Sparkles" size={14} style={{ color: '#4a9eff' }} />
                </div>
              )}
              <div style={{ maxWidth: '85%' }}>
                <div
                  className="rounded-2xl px-4 py-3"
                  style={{
                    background: msg.role === 'user'
                      ? 'rgba(74,158,255,0.12)'
                      : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${msg.role === 'user' ? 'rgba(74,158,255,0.25)' : 'rgba(255,255,255,0.08)'}`,
                  }}
                >
                  <p
                    className="font-golos text-sm leading-relaxed whitespace-pre-line"
                    style={{ color: msg.role === 'user' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.8)' }}
                  >
                    {msg.content}
                  </p>
                </div>
                {msg.role === 'ai' && msg.sources && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {msg.sources.map((s, j) => (
                      <div
                        key={j}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.07)',
                        }}
                      >
                        <img
                          src={`https://www.google.com/s2/favicons?domain=${s}&sz=16`}
                          alt=""
                          className="w-3 h-3"
                          onError={e => (e.currentTarget.style.display = 'none')}
                        />
                        <span className="font-golos text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{s}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-1 px-1">
                  <span className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
                    {msg.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start animate-fade-in">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mr-3 mt-1"
                style={{ background: 'rgba(74,158,255,0.15)', border: '1px solid rgba(74,158,255,0.25)' }}
              >
                <Icon name="Sparkles" size={14} style={{ color: '#4a9eff' }} />
              </div>
              <div
                className="rounded-2xl px-4 py-3"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="flex gap-1.5 items-center h-5">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: '#4a9eff',
                        animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div
          className="flex items-center gap-3 p-3 rounded-2xl"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Задай вопрос Hydra AI..."
            className="flex-1 bg-transparent outline-none font-golos text-sm text-white placeholder:text-white/25"
            disabled={loading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200"
            style={{
              background: input.trim() && !loading ? '#4a9eff' : 'rgba(255,255,255,0.06)',
              color: input.trim() && !loading ? '#0a0a0a' : 'rgba(255,255,255,0.2)',
            }}
          >
            <Icon name="Send" size={14} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.85); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default AIPage;
