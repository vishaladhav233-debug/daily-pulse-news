import React from 'react';
import { Category } from '../types/news.ts';

interface CategoryNavProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <div className="border-b border-stone-200 bg-[#faf8f5] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 scrollbar-none no-scrollbar">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors rounded-sm ${
              selectedCategory === 'all'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            All Stories
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.id.toLowerCase();
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors rounded-sm flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <span>{cat.name}</span>
                {typeof cat.article_count === 'number' && cat.article_count > 0 && (
                  <span className={`text-[10px] tabular-nums ${isSelected ? 'text-stone-300' : 'text-stone-400'}`}>
                    {cat.article_count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
