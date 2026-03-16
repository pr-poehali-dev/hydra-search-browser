import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { useHydra } from '@/context/HydraContext';

type Tab = 'all' | 'images' | 'ai' | 'videos' | 'news';

interface SearchResult {
  title: string;
  url: string;
  description: string;
  favicon: string;
  domain: string;
}

const generateResults = (query: string): SearchResult[] => {
  const domains = [
    { domain: 'wikipedia.org', title: `${query} — Википедия`, desc: `${query} — это понятие, которое охватывает широкий спектр тем. Согласно исследованиям, данная область включает множество аспектов и направлений развития.` },
    { domain: 'habr.com', title: `Всё о ${query}: полный обзор`, desc: `Подробный технический разбор темы "${query}". Рассматриваем ключевые концепции, примеры применения и перспективы развития.` },
    { domain: 'vc.ru', title: `${query}: что нужно знать в 2024`, desc: `Актуальный анализ ${query} для профессионалов и любителей. Тренды, новости, мнения экспертов и прогнозы на будущее.` },
    { domain: 'rbc.ru', title: `${query} в современном мире`, desc: `Последние новости и события, связанные с темой ${query}. Экспертные комментарии и аналитика от ведущих специалистов отрасли.` },
    { domain: 'tinkoff.ru', title: `Руководство по ${query}`, desc: `Пошаговое руководство и лучшие практики. Узнайте всё о ${query} из первых уст и применяйте знания на практике.` },
    { domain: 'rambler.ru', title: `${query} — последние события`, desc: `Свежие материалы, статьи и обзоры на тему ${query}. Следите за обновлениями и будьте в курсе всех событий.` },
    { domain: 'yandex.ru', title: `Исследование: ${query}`, desc: `Научный взгляд на проблему ${query}. Факты, данные, исследования и выводы ведущих учёных и аналитиков мира.` },
    { domain: 'mail.ru', title: `Топ-10 фактов о ${query}`, desc: `Самые интересные и неожиданные факты о ${query}, которые вы могли не знать. Полезная информация для широкой аудитории.` },
  ];
  return domains.map(d => ({
    title: d.title,
    url: `https://${d.domain}/wiki/${encodeURIComponent(query)}`,
    description: d.desc,
    favicon: `https://www.google.com/s2/favicons?domain=${d.domain}&sz=32`,
    domain: d.domain,
  }));
};

const imageKeywords = [
  'nature', 'technology', 'space', 'city', 'abstract', 'science', 'ocean', 'mountain',
  'forest', 'architecture', 'people', 'animals', 'art', 'food', 'travel', 'sports',
];

const generateImages = (query: string) => {
  return Array.from({ length: 20 }, (_, i) => ({
    id: i,
    url: `https://picsum.photos/seed/${encodeURIComponent(query)}-${i}/400/300`,
    thumb: `https://picsum.photos/seed/${encodeURIComponent(query)}-${i}/200/150`,
    source: `example${i}.com`,
    title: `${query} — изображение ${i + 1}`,
  }));
};

const SearchPage: React.FC = () => {
  const { currentQuery, addSearchHistory, setCurrentPage } = useHydra();
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [images, setImages] = useState<ReturnType<typeof generateImages>>([]);
  const [selectedImage, setSelectedImage] = useState<null | { url: string; title: string; source: string }>(null);
  const [loading, setLoading] = useState(true);
  const [resultCount] = useState(() => Math.floor(Math.random() * 500000000) + 100000000);
  const [searchTime] = useState(() => (Math.random() * 0.5 + 0.1).toFixed(2));

  useEffect(() => {
    if (!currentQuery) return;
    setLoading(true);
    setResults([]);
    const timer = setTimeout(() => {
      setResults(generateResults(currentQuery));
      setImages(generateImages(currentQuery));
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [currentQuery]);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'all', label: 'Все', icon: 'Globe' },
    { id: 'images', label: 'Картинки', icon: 'Image' },
    { id: 'ai', label: 'AI', icon: 'Sparkles' },
    { id: 'videos', label: 'Видео', icon: 'Play' },
    { id: 'news', label: 'Новости', icon: 'Newspaper' },
  ];

  if (!currentQuery) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ color: 'rgba(255,255,255,0.3)' }}>
        <div className="text-center">
          <Icon name="Search" size={40} className="mx-auto mb-4 opacity-30" />
          <p className="font-golos">Введите запрос для поиска</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16" style={{ background: 'var(--bg-deep)' }}>
      <div className="max-w-4xl mx-auto px-4">
        {/* Stats */}
        <div className="mb-4 animate-fade-up" style={{ opacity: 0, animationDelay: '0ms' }}>
          <span className="font-golos text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Найдено ~{resultCount.toLocaleString('ru-RU')} результатов ({searchTime} сек.)
          </span>
        </div>

        {/* Tabs */}
        <div
          className="flex items-center gap-1 mb-6 p-1 rounded-xl w-fit animate-fade-up"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', opacity: 0, animationDelay: '50ms' }}
        >
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'ai') setCurrentPage('ai');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-golos transition-all duration-200"
              style={{
                background: activeTab === tab.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'rgba(255,255,255,0.45)',
              }}
            >
              <Icon name={tab.icon} size={14} />
              {tab.label}
              {tab.id === 'ai' && (
                <span className="text-xs px-1 rounded font-mono" style={{ background: 'rgba(74,158,255,0.2)', color: '#4a9eff', fontSize: '9px' }}>AI</span>
              )}
            </button>
          ))}
        </div>

        {/* Results */}
        {activeTab === 'all' && (
          <div className="space-y-1">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4 rounded-2xl" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="skeleton-shimmer h-3 w-32 rounded mb-2" />
                  <div className="skeleton-shimmer h-5 w-3/4 rounded mb-2" />
                  <div className="skeleton-shimmer h-3 w-full rounded mb-1" />
                  <div className="skeleton-shimmer h-3 w-2/3 rounded" />
                </div>
              ))
            ) : (
              results.map((r, i) => (
                <ResultCard
                  key={i}
                  result={r}
                  delay={i * 40}
                  onVisit={() => addSearchHistory({
                    query: currentQuery,
                    timestamp: new Date().toISOString(),
                    type: 'visit',
                    url: r.url,
                    title: r.title,
                  })}
                />
              ))
            )}
          </div>
        )}

        {activeTab === 'images' && (
          <div>
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="skeleton-shimmer rounded-xl aspect-video" />
                ))}
              </div>
            ) : (
              <div className="columns-2 sm:columns-3 md:columns-4 gap-3 space-y-3">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className="break-inside-avoid rounded-xl overflow-hidden cursor-pointer transition-all duration-200 animate-fade-up"
                    style={{ opacity: 0, animationDelay: `${i * 30}ms`, border: '1px solid rgba(255,255,255,0.06)' }}
                    onClick={() => setSelectedImage(img)}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
                  >
                    <img src={img.url} alt={img.title} className="w-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            )}

            {selectedImage && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-6"
                style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)' }}
                onClick={() => setSelectedImage(null)}
              >
                <div
                  className="max-w-3xl w-full rounded-2xl overflow-hidden"
                  style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                  onClick={e => e.stopPropagation()}
                >
                  <img src={selectedImage.url} alt={selectedImage.title} className="w-full" />
                  <div className="p-4" style={{ background: 'rgba(18,18,18,0.95)' }}>
                    <p className="font-golos text-sm text-white/70 mb-2">{selectedImage.title}</p>
                    <a
                      href={`https://${selectedImage.source}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-golos text-xs"
                      style={{ color: '#4a9eff' }}
                    >
                      {selectedImage.source}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'videos' && <ComingSoon label="Видео" icon="Play" />}
        {activeTab === 'news' && <ComingSoon label="Новости" icon="Newspaper" />}
      </div>
    </div>
  );
};

const ResultCard: React.FC<{ result: SearchResult; delay: number; onVisit: () => void }> = ({ result, delay, onVisit }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="p-4 rounded-2xl cursor-pointer transition-all duration-200 animate-fade-up"
      style={{
        opacity: 0,
        animationDelay: `${delay}ms`,
        background: hovered ? 'rgba(255,255,255,0.04)' : 'transparent',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.08)' : 'transparent'}`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <img
          src={result.favicon}
          alt=""
          className="w-4 h-4 rounded-sm"
          onError={e => (e.currentTarget.style.display = 'none')}
        />
        <span className="font-golos text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{result.domain}</span>
        <span className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>›</span>
        <span className="font-golos text-xs truncate" style={{ color: 'rgba(255,255,255,0.25)' }}>{result.url.replace('https://', '')}</span>
      </div>
      <a
        href={result.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block font-golos font-medium text-base mb-1 hover:underline transition-colors"
        style={{ color: '#4a9eff', lineHeight: '1.4' }}
        onClick={onVisit}
      >
        {result.title}
      </a>
      <p className="font-golos text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
        {result.description}
      </p>
    </div>
  );
};

const ComingSoon: React.FC<{ label: string; icon: string }> = ({ label, icon }) => (
  <div className="flex flex-col items-center justify-center py-24" style={{ color: 'rgba(255,255,255,0.2)' }}>
    <Icon name={icon} size={40} className="mb-4 opacity-30" />
    <p className="font-golos text-lg">{label} — скоро</p>
    <p className="font-golos text-sm mt-1 opacity-70">Раздел в разработке</p>
  </div>
);

export default SearchPage;
