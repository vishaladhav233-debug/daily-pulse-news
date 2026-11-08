import React, { useState, useEffect } from 'react';
import { AlertCircle, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Article } from '../types/news.ts';

interface BreakingTickerProps {
  breakingArticles: Article[];
  onSelectArticle: (article: Article) => void;
}

export const BreakingTicker: React.FC<BreakingTickerProps> = ({
  breakingArticles,
  onSelectArticle
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Fallback item if no breaking articles exist
  const items = breakingArticles.length > 0
    ? breakingArticles
    : [
        {
          id: 'default-bulletin',
          slug: 'isro-readies-heavy-lift-launch-vehicle-commercial-payloads',
          title: 'ISRO concludes static ground test series for heavy-lift semi-cryogenic launch stage at Mahendragiri',
          category_name: 'Technology',
          category_id: 'technology',
          published_at: new Date().toISOString()
        } as Article
      ];

  useEffect(() => {
    if (isPaused || items.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, items.length]);

  const current = items[currentIndex];

  return (
    <div className="bg-amber-900 text-stone-100 border-b border-amber-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center gap-1.5 shrink-0 px-2.5 py-0.5 bg-amber-800 text-amber-200 text-xs font-bold uppercase tracking-wider rounded-xs">
            <AlertCircle className="w-3.5 h-3.5 text-amber-300" />
            <span>Breaking</span>
          </div>

          <div className="truncate text-xs sm:text-sm font-medium">
            <button
              onClick={() => onSelectArticle(current)}
              className="hover:underline text-left text-stone-100 hover:text-white transition-colors truncate block"
            >
              <span className="font-semibold text-amber-300 mr-2 uppercase text-[11px] tracking-wide">
                [{current.category_name || current.category_id}]
              </span>
              <span>{current.title}</span>
            </button>
          </div>
        </div>

        {items.length > 1 && (
          <div className="flex items-center gap-1 shrink-0 text-stone-300">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1 hover:text-white hover:bg-amber-800 rounded transition-colors"
              title={isPaused ? 'Resume auto-scroll' : 'Pause ticker'}
              aria-label={isPaused ? 'Resume auto-scroll' : 'Pause ticker'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)}
              className="p-1 hover:text-white hover:bg-amber-800 rounded transition-colors"
              title="Previous breaking news"
              aria-label="Previous breaking news"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] tabular-nums px-1">
              {currentIndex + 1}/{items.length}
            </span>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % items.length)}
              className="p-1 hover:text-white hover:bg-amber-800 rounded transition-colors"
              title="Next breaking news"
              aria-label="Next breaking news"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
