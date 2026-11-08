import React from 'react';
import { Search, ShieldAlert, Newspaper, X } from 'lucide-react';
import { Category } from '../types/news.ts';

interface HeaderProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  onOpenAdmin: () => void;
  onHomeClick: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isSearchOpen: boolean;
  onToggleSearch: () => void;
  dbStatus?: { connected: boolean; mode: string };
}

export const Header: React.FC<HeaderProps> = ({
  categories: _categories,
  selectedCategory,
  onSelectCategory,
  onOpenAdmin,
  onHomeClick,
  searchQuery,
  onSearchChange,
  isSearchOpen,
  onToggleSearch,
  dbStatus
}) => {
  const currentDate = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date());

  return (
    <header className="border-b border-stone-200 bg-[#faf8f5] sticky top-0 z-40">
      {/* Top Edition Bar */}
      <div className="border-b border-stone-200/70 px-4 sm:px-6 lg:px-8 py-1.5 text-xs text-stone-500 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-stone-700">{currentDate}</span>
          <span aria-hidden="true">·</span>
          <span>Morning National Edition</span>
          <span aria-hidden="true">·</span>
          <span>Mumbai · Pune · New Delhi</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${dbStatus?.connected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span>{dbStatus?.connected ? 'Supabase Postgres Live' : 'Built-in Data Engine'}</span>
          </div>
          <span aria-hidden="true" className="text-stone-300">|</span>
          <button
            onClick={onOpenAdmin}
            className="hover:text-stone-900 transition-colors flex items-center gap-1 font-medium text-stone-700"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
            <span>Editorial Desk</span>
          </button>
        </div>
      </div>

      {/* Main Top Bar - Strict 3-zone contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element Brand Wordmark */}
        <button
          onClick={onHomeClick}
          className="text-left group flex items-baseline gap-2.5 whitespace-nowrap shrink-0 focus:outline-none"
        >
          <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 group-hover:text-stone-700 transition-colors">
            DailyPulse
          </span>
          <span className="font-serif italic text-lg sm:text-xl font-normal text-amber-800">
            News
          </span>
        </button>

        {/* Zone 2: 4-5 concise single-line text links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
          <button
            onClick={() => onSelectCategory('all')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 ${
              selectedCategory === 'all' ? 'text-stone-900 font-semibold underline underline-offset-8 decoration-amber-600' : ''
            }`}
          >
            Front Page
          </button>
          <button
            onClick={() => onSelectCategory('india')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 ${
              selectedCategory === 'india' ? 'text-stone-900 font-semibold underline underline-offset-8 decoration-amber-600' : ''
            }`}
          >
            India
          </button>
          <button
            onClick={() => onSelectCategory('maharashtra')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 ${
              selectedCategory === 'maharashtra' ? 'text-stone-900 font-semibold underline underline-offset-8 decoration-amber-600' : ''
            }`}
          >
            Maharashtra
          </button>
          <button
            onClick={() => onSelectCategory('technology')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 ${
              selectedCategory === 'technology' ? 'text-stone-900 font-semibold underline underline-offset-8 decoration-amber-600' : ''
            }`}
          >
            Technology
          </button>
          <button
            onClick={() => onSelectCategory('business')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 ${
              selectedCategory === 'business' ? 'text-stone-900 font-semibold underline underline-offset-8 decoration-amber-600' : ''
            }`}
          >
            Business
          </button>
          <button
            onClick={() => onSelectCategory('agriculture')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 ${
              selectedCategory === 'agriculture' ? 'text-stone-900 font-semibold underline underline-offset-8 decoration-amber-600' : ''
            }`}
          >
            Agriculture
          </button>
        </nav>

        {/* Zone 3: 1 primary action & search trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleSearch}
            aria-label="Toggle search"
            className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
          >
            {isSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
          </button>
          <button
            onClick={onOpenAdmin}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-stone-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-md transition-colors whitespace-nowrap shrink-0"
          >
            <Newspaper className="w-3.5 h-3.5 text-amber-900" />
            <span>Admin Console</span>
          </button>
        </div>
      </div>

      {/* Expandable Search Input */}
      {isSearchOpen && (
        <div className="border-t border-stone-200 bg-stone-50 px-4 sm:px-6 py-3">
          <div className="max-w-3xl mx-auto relative flex items-center">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search news, topics, policy, or regional affairs across India & World..."
              className="w-full pl-10 pr-10 py-2 text-sm bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-600 focus:border-amber-600"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
