import React, { useState } from 'react';
import { ExternalLink, Clock, Eye, Sparkles } from 'lucide-react';
import { Article } from '../types/news.ts';

interface ArticleCardProps {
  article: Article;
  variant?: 'lead' | 'standard' | 'compact' | 'trending-item';
  rank?: number;
  onSelect: (article: Article) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = 'standard',
  rank,
  onSelect
}) => {
  const [imgError, setImgError] = useState(false);

  // Time format helper
  const timeAgo = (dateStr: string) => {
    try {
      const diff = Date.now() - new Date(dateStr).getTime();
      const minutes = Math.floor(diff / (1000 * 60));
      if (minutes < 1) return 'Just now';
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    } catch {
      return 'Recently';
    }
  };

  // 1. Trending Item Variant (Numbered List)
  if (variant === 'trending-item') {
    return (
      <article
        onClick={() => onSelect(article)}
        className="group cursor-pointer py-3.5 border-b border-stone-200/80 last:border-b-0 flex items-start gap-3.5 hover:bg-stone-100/50 -mx-2 px-2 rounded-sm transition-colors"
      >
        <span className="font-serif text-2xl font-bold text-stone-300 group-hover:text-amber-800 transition-colors tabular-nums shrink-0 w-7">
          {rank ? String(rank).padStart(2, '0') : '•'}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-[11px] text-stone-500 uppercase tracking-wider mb-1">
            <span className="font-semibold text-amber-900">{article.category_name || article.category_id}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums flex items-center gap-1">
              <Eye className="w-3 h-3 text-stone-400" />
              {article.views_count.toLocaleString()} reads
            </span>
          </div>
          <h3 className="text-sm font-semibold text-stone-900 group-hover:text-amber-900 leading-snug transition-colors line-clamp-2">
            {article.title}
          </h3>
        </div>
      </article>
    );
  }

  // 2. Compact Horizontal Variant (for Latest Stream)
  if (variant === 'compact') {
    return (
      <article
        onClick={() => onSelect(article)}
        className="group cursor-pointer py-3.5 border-b border-stone-200 flex gap-4 items-center hover:bg-stone-100/40 -mx-2 px-2 rounded-sm transition-colors"
      >
        <div className="w-24 sm:w-28 h-20 shrink-0 bg-stone-200 rounded-xs overflow-hidden relative">
          {!imgError ? (
            <img
              src={article.image_url}
              alt={article.title}
              onError={() => setImgError(true)}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-400 text-xs">
              DailyPulse
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span className="font-semibold text-stone-800 uppercase tracking-wider text-[11px]">
              {article.category_name || article.category_id}
            </span>
            <span aria-hidden="true">·</span>
            <span>{timeAgo(article.published_at)}</span>
            <span aria-hidden="true">·</span>
            <span>{article.reading_time_minutes} min read</span>
          </div>
          <h3 className="text-sm sm:text-base font-serif font-bold text-stone-900 group-hover:text-amber-900 leading-snug line-clamp-2 transition-colors">
            {article.title}
          </h3>
          <p className="text-xs text-stone-600 line-clamp-1 mt-1 hidden sm:block">
            {article.description}
          </p>
        </div>
      </article>
    );
  }

  // 3. Lead Featured Variant (Hero Focal Story)
  if (variant === 'lead') {
    return (
      <article
        onClick={() => onSelect(article)}
        className="group cursor-pointer bg-white border border-stone-200/90 rounded-sm overflow-hidden shadow-xs hover:border-stone-400 transition-all duration-200"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-7 relative bg-stone-950 overflow-hidden min-h-[300px] lg:min-h-[420px]">
            {!imgError ? (
              <img
                src={article.image_url}
                alt={article.title}
                onError={() => setImgError(true)}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-stone-800 text-stone-400">
                Editorial Visual
              </div>
            )}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-stone-200 text-xs flex justify-between items-end">
              <span className="text-[11px] text-stone-300 font-sans tracking-wide">
                Photo: {article.image_credit}
              </span>
              <span className="text-[10px] text-stone-400">
                {article.image_license}
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col justify-between">
            <div>
              {/* Clean unboxed metadata with separators */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mb-3">
                <span className="font-bold text-amber-900 uppercase tracking-wider">
                  {article.category_name || article.category_id}
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 font-medium text-stone-700">
                  <Sparkles className="w-3 h-3 text-amber-700" />
                  Lead Report
                </span>
                <span aria-hidden="true">·</span>
                <span>{timeAgo(article.published_at)}</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl lg:text-3xl font-bold text-stone-900 leading-tight group-hover:text-amber-900 transition-colors mb-4 [text-wrap:balance]">
                {article.title}
              </h2>

              <p className="text-sm sm:text-base text-stone-600 font-sans leading-relaxed mb-5">
                {article.description}
              </p>

              {article.key_points && article.key_points.length > 0 && (
                <div className="border-t border-stone-200/80 pt-4 mb-5">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-400 block mb-2">
                    Key Takeaways
                  </span>
                  <ul className="space-y-1.5 text-xs text-stone-700">
                    {article.key_points.slice(0, 3).map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-700 font-bold">›</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <div className="flex items-center gap-2">
                <span>{article.author_label}</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-800 font-medium">
                <span>Full Story</span>
                <span>→</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // 4. Standard Card Variant
  return (
    <article
      onClick={() => onSelect(article)}
      className="group cursor-pointer bg-white border border-stone-200/80 rounded-sm overflow-hidden flex flex-col justify-between hover:border-stone-400 hover:shadow-xs transition-all duration-200"
    >
      <div>
        <div className="aspect-16/10 bg-stone-100 overflow-hidden relative">
          {!imgError ? (
            <img
              src={article.image_url}
              alt={article.title}
              onError={() => setImgError(true)}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-400"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-400 text-xs">
              DailyPulse News
            </div>
          )}
          {article.is_breaking && (
            <div className="absolute top-2 left-2 px-2 py-0.5 bg-amber-900 text-white text-[10px] font-bold uppercase tracking-wider rounded-xs">
              Breaking
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5">
          {/* Metadata */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
            <span className="font-bold text-amber-900 uppercase tracking-wider text-[11px]">
              {article.category_name || article.category_id}
            </span>
            <span aria-hidden="true">·</span>
            <span>{timeAgo(article.published_at)}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-400" />
              {article.reading_time_minutes}m
            </span>
          </div>

          <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 group-hover:text-amber-900 leading-snug mb-2 line-clamp-2 transition-colors [text-wrap:balance]">
            {article.title}
          </h3>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-3">
            {article.description}
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-5 pb-4 pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
        <span className="truncate max-w-[180px] text-[11px] text-stone-500">
          Source: {article.source_name}
        </span>
        <span className="text-stone-700 font-medium group-hover:text-amber-900 transition-colors flex items-center gap-1">
          Read <ExternalLink className="w-3 h-3" />
        </span>
      </div>
    </article>
  );
};
