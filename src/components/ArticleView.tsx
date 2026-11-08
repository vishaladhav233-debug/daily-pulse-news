import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Share2,
  Bookmark,
  Check,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Clock,
  Sparkles
} from 'lucide-react';
import { Article } from '../types/news.ts';
import { ArticleCard } from './ArticleCard.tsx';

interface ArticleViewProps {
  article: Article;
  relatedArticles: Article[];
  onBack: () => void;
  onSelectArticle: (article: Article) => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({
  article,
  relatedArticles,
  onBack,
  onSelectArticle
}) => {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [article.id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`${article.title} via @DailyPulseNews`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`*${article.title}*\n\nRead more at DailyPulse News: ${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'noopener,noreferrer');
  };

  // Format date nicely
  const formattedDate = new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short'
  }).format(new Date(article.published_at));

  // Render article content formatted with headings and drop-cap
  const renderFormattedContent = (content: string) => {
    const paragraphs = content.split('\n\n').filter(p => p.trim());

    return paragraphs.map((block, idx) => {
      const trimmed = block.trim();

      // Heading 2
      if (trimmed.startsWith('## ')) {
        return (
          <h2
            key={idx}
            className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-8 mb-4 pt-4 border-t border-stone-200"
          >
            {trimmed.replace(/^##\s+/, '')}
          </h2>
        );
      }

      // Heading 3
      if (trimmed.startsWith('### ')) {
        return (
          <h3
            key={idx}
            className="font-serif text-xl sm:text-2xl font-semibold text-stone-900 mt-6 mb-3"
          >
            {trimmed.replace(/^###\s+/, '')}
          </h3>
        );
      }

      // Blockquote / Pull quote
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote
            key={idx}
            className="my-8 py-4 px-6 border-y border-stone-300 bg-stone-100/60 font-serif italic text-lg sm:text-xl text-stone-800 leading-relaxed text-center"
          >
            {trimmed.replace(/^>\s+/, '')}
          </blockquote>
        );
      }

      // Opening paragraph with drop-cap
      if (idx === 0) {
        return (
          <p key={idx} className="drop-cap text-base sm:text-lg text-stone-800 leading-relaxed mb-6 font-serif">
            {trimmed}
          </p>
        );
      }

      // Regular paragraph
      return (
        <p key={idx} className="text-base sm:text-lg text-stone-800 leading-relaxed mb-6 font-serif">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <article className="min-h-screen pb-16">
      {/* Reading Progress Indicator */}
      <div
        className="fixed top-0 left-0 h-1 bg-amber-800 z-50 transition-all duration-150"
        style={{ width: `${readingProgress}%` }}
      />

      {/* Top Breadcrumb & Navigation */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors uppercase tracking-wider py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Front Page</span>
        </button>
      </div>

      {/* Header Container */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Unboxed Metadata */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 uppercase tracking-wider mb-3">
          <span className="font-bold text-amber-900">{article.category_name || article.category_id}</span>
          <span aria-hidden="true">·</span>
          <span>Verified DailyPulse Report</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            {article.reading_time_minutes} min read
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 leading-[1.15] mb-4 [text-wrap:balance]">
          {article.title}
        </h1>

        {/* Subtitle / Lead Deck */}
        <p className="text-lg sm:text-xl text-stone-700 font-sans leading-relaxed mb-6 pb-6 border-b border-stone-200">
          {article.description}
        </p>

        {/* Author / Editorial Bar & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-b border-stone-200 text-xs text-stone-600 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-stone-200 flex items-center justify-center font-serif font-bold text-stone-700 text-sm">
              DP
            </div>
            <div>
              <div className="font-medium text-stone-900 flex items-center gap-1.5">
                <span>{article.author_label}</span>
                <span title="Editorial Standard Verified">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </span>
              </div>
              <div className="flex items-center gap-2 text-stone-500 text-[11px] mt-0.5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-stone-400" />
                  {formattedDate}
                </span>
              </div>
            </div>
          </div>

          {/* Social Share & Utility Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleShareTwitter}
              aria-label="Share on X"
              className="px-2.5 py-1.5 border border-stone-300 hover:border-stone-900 hover:bg-stone-100 rounded text-stone-700 text-xs font-medium transition-colors"
            >
              X / Twitter
            </button>
            <button
              onClick={handleShareWhatsApp}
              aria-label="Share on WhatsApp"
              className="px-2.5 py-1.5 border border-stone-300 hover:border-stone-900 hover:bg-stone-100 rounded text-stone-700 text-xs font-medium transition-colors"
            >
              WhatsApp
            </button>
            <button
              onClick={handleShareLinkedIn}
              aria-label="Share on LinkedIn"
              className="px-2.5 py-1.5 border border-stone-300 hover:border-stone-900 hover:bg-stone-100 rounded text-stone-700 text-xs font-medium transition-colors hidden sm:inline-block"
            >
              LinkedIn
            </button>
            <button
              onClick={handleCopyLink}
              title="Copy article link"
              className="p-1.5 border border-stone-300 hover:border-stone-900 rounded text-stone-700 transition-colors flex items-center gap-1"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setBookmarked(!bookmarked)}
              title="Bookmark story"
              className="p-1.5 border border-stone-300 hover:border-stone-900 rounded text-stone-700 transition-colors"
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-800 text-amber-800' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Featured Photograph */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-8">
        <figure className="bg-stone-950 rounded-xs overflow-hidden shadow-sm">
          <img
            src={article.image_url}
            alt={article.title}
            referrerPolicy="no-referrer"
            className="w-full max-h-[540px] object-cover object-center"
          />
          <figcaption className="p-3 sm:p-4 bg-stone-900 text-stone-300 text-xs flex flex-wrap justify-between items-center gap-2">
            <span className="italic font-serif">
              {article.image_caption || article.title}
            </span>
            <div className="flex items-center gap-2 text-[11px] text-stone-400 font-sans">
              <span>Photo: {article.image_credit}</span>
              <span aria-hidden="true">·</span>
              <span className="uppercase text-[10px]">{article.image_license}</span>
            </div>
          </figcaption>
        </figure>
      </div>

      {/* Key Takeaways Callout */}
      {article.key_points && article.key_points.length > 0 && (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 mb-8">
          <div className="p-5 bg-stone-100 border-l-2 border-amber-800 rounded-r-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              Executive Takeaways
            </h4>
            <ul className="space-y-2 text-sm text-stone-800">
              {article.key_points.map((point, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-amber-800 font-bold shrink-0">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Article Body - Standard 65-75ch Reading Column */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 article-prose">
        {renderFormattedContent(article.content)}

        {/* Source Citation & Integrity Notice */}
        <section className="mt-12 p-5 bg-stone-100/80 border border-stone-200 rounded-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white rounded border border-stone-200 shrink-0 text-amber-900">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex-1 text-xs">
              <h5 className="font-bold text-stone-900 uppercase tracking-wide mb-1">
                Editorial Transparency & Source Attribution
              </h5>
              <p className="text-stone-600 mb-2 leading-relaxed">
                DailyPulse News synthesizes reporting from verified primary sources, state government gazettes, and authorized news wires. Original reporting and raw dispatch provided by:
              </p>
              <a
                href={article.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-stone-900 font-semibold underline hover:text-amber-900 transition-colors"
              >
                <span>{article.source_name}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <p className="text-[11px] text-stone-500 mt-2">
                Ethical note: In accordance with DailyPulse editorial charter, facts are cross-referenced before publication. No event photographs are artificially generated or misattributed.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Related News Section */}
      {relatedArticles.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-16 pt-10 border-t border-stone-200">
          <div className="flex items-baseline justify-between mb-6">
            <h3 className="font-serif text-2xl font-bold text-stone-900">
              Related Coverage in {article.category_name || article.category_id}
            </h3>
            <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold">
              More Stories
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <ArticleCard
                key={rel.id}
                article={rel}
                variant="standard"
                onSelect={onSelectArticle}
              />
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
