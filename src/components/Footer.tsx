import React from 'react';
import { ShieldCheck, Rss, FileText, ChevronRight } from 'lucide-react';
import { Category } from '../types/news.ts';

interface FooterProps {
  categories: Category[];
  onSelectCategory: (catId: string) => void;
  onOpenAdmin: () => void;
  onHomeClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  categories,
  onSelectCategory,
  onOpenAdmin,
  onHomeClick
}) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 text-xs">
      {/* Editorial Mission Statement Strip */}
      <div className="border-b border-stone-800 bg-stone-950/60 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-stone-800 text-amber-400 rounded shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-stone-100 text-sm mb-1">
                Zero-Fabrication Charter
              </h4>
              <p className="text-stone-400 text-xs leading-relaxed">
                DailyPulse News never generates fake events or hallucinated quotations. Every report is synthesized strictly from verified primary wire releases and gazettes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-stone-800 text-amber-400 rounded shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-stone-100 text-sm mb-1">
                Licensed Photography & Open Data
              </h4>
              <p className="text-stone-400 text-xs leading-relaxed">
                We strictly prohibit unauthorized imagery or fake photo manipulation. Every visual is credited with license provenance and original photojournalism attribution.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-stone-800 text-amber-400 rounded shrink-0">
              <Rss className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-stone-100 text-sm mb-1">
                Human-in-the-Loop Governance
              </h4>
              <p className="text-stone-400 text-xs leading-relaxed">
                AI agents curate and synthesize draft dispatches into a secure editorial review queue before any story is published to the public wire.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Directory Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand & Editorial Masthead */}
          <div className="md:col-span-2">
            <button
              onClick={onHomeClick}
              className="text-left font-serif text-2xl font-bold text-white tracking-tight hover:text-stone-200 transition-colors block mb-2"
            >
              DailyPulse News
            </button>
            <p className="text-stone-400 text-xs leading-relaxed mb-4 max-w-sm">
              Authoritative, balanced, and independent daily reporting covering Indian national affairs, Maharashtra regional developments, science, agriculture, and global affairs.
            </p>
            <div className="text-[11px] text-stone-500 space-y-1">
              <div>Editor-in-Chief & Editorial Bureau: Mumbai / New Delhi</div>
              <div>Syndication: PIB · Reuters · ISRO · ICAR · Regional Wires</div>
            </div>
          </div>

          {/* Categories Grid (2 Columns) */}
          <div className="md:col-span-2">
            <h5 className="font-bold uppercase tracking-wider text-stone-200 text-xs mb-3">
              News Desks & Categories
            </h5>
            <div className="grid grid-cols-2 gap-2 text-stone-400 text-xs">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onSelectCategory(c.id)}
                  className="text-left hover:text-amber-400 transition-colors py-0.5 flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-stone-600" />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links & Netlify Ready */}
          <div>
            <h5 className="font-bold uppercase tracking-wider text-stone-200 text-xs mb-3">
              Editorial & Transparency
            </h5>
            <ul className="space-y-2 text-stone-400 text-xs">
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-white transition-colors"
                >
                  Admin Editorial Dashboard
                </button>
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  XML News Sitemap
                </a>
              </li>
              <li>
                <a
                  href="/robots.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Robots &amp; Crawler Directives
                </a>
              </li>
              <li>
                <span className="text-stone-500">
                  Netlify + Supabase Architecture
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright strip */}
        <div className="mt-12 pt-6 border-t border-stone-800 text-[11px] text-stone-500 flex flex-wrap justify-between items-center gap-4">
          <div>
            © {new Date().getFullYear()} DailyPulse News Media Organization. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span id="ethics">Journalistic Charter: Factual Verification &amp; Attribution</span>
            <span aria-hidden="true">·</span>
            <span>Prepared for Netlify &amp; Supabase</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
