/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header.tsx';
import { BreakingTicker } from './components/BreakingTicker.tsx';
import { CategoryNav } from './components/CategoryNav.tsx';
import { ArticleCard } from './components/ArticleCard.tsx';
import { ArticleView } from './components/ArticleView.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { Footer } from './components/Footer.tsx';
import { SEOHead } from './components/SEOHead.tsx';
import { Article, ArticleStatus, Category, NewsSource, AgentRunSummary } from './types/news.ts';
import { TrendingUp, Sparkles, Newspaper, RefreshCw, MapPin, Cpu, Wheat } from 'lucide-react';

export default function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [allArticlesAdmin, setAllArticlesAdmin] = useState<Article[]>([]);
  const [sources, setSources] = useState<NewsSource[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState<any>(null);

  // Fetch initial data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [catsRes, artsRes, allArtsRes, sourcesRes, statusRes] = await Promise.all([
        fetch('/api/categories').then(r => r.json()).catch(() => []),
        fetch('/api/articles?status=published').then(r => r.json()).catch(() => []),
        fetch('/api/articles?status=all').then(r => r.json()).catch(() => []),
        fetch('/api/sources').then(r => r.json()).catch(() => []),
        fetch('/api/status').then(r => r.json()).catch(() => null)
      ]);

      if (Array.isArray(catsRes)) setCategories(catsRes);
      if (Array.isArray(artsRes)) setArticles(artsRes);
      if (Array.isArray(allArtsRes)) setAllArticlesAdmin(allArtsRes);
      if (Array.isArray(sourcesRes)) setSources(sourcesRes);
      if (statusRes) setSystemStatus(statusRes);
    } catch (err) {
      console.error('Error fetching news data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Check URL hash for direct article link e.g. #/article/slug
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/article/')) {
        const slug = hash.replace('#/article/', '');
        fetch(`/api/articles/${slug}`)
          .then(r => r.json())
          .then(data => {
            if (data?.article) {
              setSelectedArticle(data.article);
            }
          })
          .catch(err => console.error(err));
      } else if (hash === '#/admin') {
        setIsAdminOpen(true);
      } else {
        setSelectedArticle(null);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when selecting an article
  const handleSelectArticle = (article: Article) => {
    setSelectedArticle(article);
    window.location.hash = `#/article/${article.slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setSelectedArticle(null);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdmin = () => {
    setIsAdminOpen(true);
    window.location.hash = '#/admin';
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    window.location.hash = '';
    fetchData();
  };

  // Article Admin Handlers
  const handleUpdateArticleStatus = async (id: string, status: ArticleStatus) => {
    await fetch(`/api/articles/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    await fetchData();
  };

  const handleDeleteArticle = async (id: string) => {
    await fetch(`/api/articles/${id}`, { method: 'DELETE' });
    await fetchData();
  };

  const handleSaveArticle = async (articleData: Partial<Article>) => {
    if (articleData.id) {
      await fetch(`/api/articles/${articleData.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleData)
      });
    } else {
      await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleData)
      });
    }
    await fetchData();
  };

  const handleRunAgent = async (): Promise<AgentRunSummary | null> => {
    try {
      const res = await fetch('/api/agent/run', { method: 'POST' });
      const summary: AgentRunSummary = await res.json();
      await fetchData();
      return summary;
    } catch (err) {
      console.error('Agent run failed:', err);
      return null;
    }
  };

  const handleSynthesizeCustom = async (payload: {
    sourceName: string;
    sourceUrl?: string;
    category: string;
    rawText: string;
    rawHeadline?: string;
  }) => {
    await fetch('/api/agent/synthesize-custom', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    await fetchData();
  };

  // Derived sections
  const breakingArticles = useMemo(() => {
    return articles.filter(a => a.is_breaking);
  }, [articles]);

  const leadArticle = useMemo(() => {
    const featured = articles.find(a => a.is_featured);
    return featured || articles[0] || null;
  }, [articles]);

  const trendingArticles = useMemo(() => {
    return articles
      .filter(a => a.id !== leadArticle?.id)
      .sort((a, b) => b.views_count - a.views_count)
      .slice(0, 5);
  }, [articles, leadArticle]);

  const latestArticles = useMemo(() => {
    return articles
      .filter(a => a.id !== leadArticle?.id)
      .slice(0, 6);
  }, [articles, leadArticle]);

  // Regional Maharashtra Stories
  const maharashtraStories = useMemo(() => {
    return articles.filter(a => a.category_id === 'maharashtra');
  }, [articles]);

  // Technology & Science Stories
  const technologyStories = useMemo(() => {
    return articles.filter(a => a.category_id === 'technology');
  }, [articles]);

  // Agriculture Stories
  const agricultureStories = useMemo(() => {
    return articles.filter(a => a.category_id === 'agriculture');
  }, [articles]);

  // Filtered stories when category or search is active
  const filteredDisplayArticles = useMemo(() => {
    let list = articles;
    if (selectedCategory !== 'all') {
      list = list.filter(a => a.category_id.toLowerCase() === selectedCategory.toLowerCase());
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q)
      );
    }
    return list;
  }, [articles, selectedCategory, searchQuery]);

  // Related articles for single article view
  const relatedArticles = useMemo(() => {
    if (!selectedArticle) return [];
    return articles
      .filter(a => a.id !== selectedArticle.id && a.category_id === selectedArticle.category_id)
      .slice(0, 3);
  }, [articles, selectedArticle]);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-stone-900">
      {/* Dynamic SEO Tags & Schema.org JSON-LD */}
      <SEOHead
        article={selectedArticle}
        category={selectedCategory !== 'all' ? selectedCategory : null}
      />

      {/* Admin Dashboard Overlay */}
      {isAdminOpen ? (
        <AdminDashboard
          articles={allArticlesAdmin}
          categories={categories}
          sources={sources}
          onClose={handleCloseAdmin}
          onRefresh={fetchData}
          onUpdateArticleStatus={handleUpdateArticleStatus}
          onDeleteArticle={handleDeleteArticle}
          onSaveArticle={handleSaveArticle}
          onRunAgent={handleRunAgent}
          onSynthesizeCustom={handleSynthesizeCustom}
          systemStatus={systemStatus}
        />
      ) : (
        <>
          {/* Main Top Header */}
          <Header
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={(catId) => {
              setSelectedCategory(catId);
              setSelectedArticle(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAdmin={handleOpenAdmin}
            onHomeClick={handleBackToHome}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isSearchOpen={isSearchOpen}
            onToggleSearch={() => setIsSearchOpen(!isSearchOpen)}
            dbStatus={systemStatus?.environment?.supabase}
          />

          {/* Breaking News Ticker */}
          <BreakingTicker
            breakingArticles={breakingArticles}
            onSelectArticle={handleSelectArticle}
          />

          {/* Category Navigation Strip */}
          <CategoryNav
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={(catId) => {
              setSelectedCategory(catId);
              setSelectedArticle(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />

          {/* Main Content Area */}
          <main className="flex-1">
            {isLoading ? (
              <div className="py-24 flex flex-col items-center justify-center text-stone-500">
                <RefreshCw className="w-8 h-8 animate-spin text-amber-700 mb-3" />
                <span className="font-serif text-lg text-stone-700">Loading DailyPulse News wire...</span>
              </div>
            ) : selectedArticle ? (
              /* Single Article View */
              <ArticleView
                article={selectedArticle}
                relatedArticles={relatedArticles}
                onBack={handleBackToHome}
                onSelectArticle={handleSelectArticle}
              />
            ) : selectedCategory !== 'all' || searchQuery.trim() !== '' ? (
              /* Filtered Category or Search Results View */
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8 pb-4 border-b border-stone-200 flex flex-wrap justify-between items-baseline gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block mb-1">
                      {searchQuery ? 'Search Query Results' : 'Category Dispatch'}
                    </span>
                    <h2 className="font-serif text-3xl font-bold text-stone-900 capitalize">
                      {searchQuery ? `"${searchQuery}"` : selectedCategory} News
                    </h2>
                  </div>
                  <span className="text-xs text-stone-500 tabular-nums">
                    {filteredDisplayArticles.length} verified reports
                  </span>
                </div>

                {filteredDisplayArticles.length === 0 ? (
                  <div className="py-16 text-center text-stone-500 bg-white border border-stone-200 rounded p-8">
                    <Newspaper className="w-10 h-10 mx-auto text-stone-300 mb-3" />
                    <p className="font-serif text-lg text-stone-700">No articles found matching this topic.</p>
                    <p className="text-xs text-stone-500 mt-1">Try another keyword or select All Stories.</p>
                    <button
                      onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                      className="mt-4 px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded hover:bg-stone-800"
                    >
                      Return to Front Page
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDisplayArticles.map((art) => (
                      <ArticleCard
                        key={art.id}
                        article={art}
                        variant="standard"
                        onSelect={handleSelectArticle}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Front Page Editorial Grid (3-Tier Salience) */
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
                {/* Tier 1 & 2: Lead Story + Trending News Split */}
                <section>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left: Lead Story (Visual Anchor) */}
                    <div className="lg:col-span-8">
                      {leadArticle && (
                        <ArticleCard
                          article={leadArticle}
                          variant="lead"
                          onSelect={handleSelectArticle}
                        />
                      )}
                    </div>

                    {/* Right: Trending News List */}
                    <div className="lg:col-span-4 bg-white p-5 border border-stone-200 rounded-sm shadow-xs">
                      <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-2">
                        <div className="flex items-center gap-1.5 font-serif font-bold text-lg text-stone-900">
                          <TrendingUp className="w-4 h-4 text-amber-800" />
                          <span>Trending Top Stories</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-50 px-2 py-0.5 rounded">
                          National
                        </span>
                      </div>

                      <div className="divide-y divide-stone-100">
                        {trendingArticles.map((art, idx) => (
                          <ArticleCard
                            key={art.id}
                            article={art}
                            variant="trending-item"
                            rank={idx + 1}
                            onSelect={handleSelectArticle}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section: Secondary Editorial Features */}
                <section className="pt-6 border-t border-stone-200">
                  <div className="flex items-baseline justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-800" />
                      <h3 className="font-serif text-2xl font-bold text-stone-900">
                        Featured Reports & In-Depth Analyses
                      </h3>
                    </div>
                    <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold">
                      Curated Daily
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {articles.slice(1, 4).map((art) => (
                      <ArticleCard
                        key={art.id}
                        article={art}
                        variant="standard"
                        onSelect={handleSelectArticle}
                      />
                    ))}
                  </div>
                </section>

                {/* Section: Maharashtra Regional Desk */}
                {maharashtraStories.length > 0 && (
                  <section className="pt-6 border-t border-stone-200">
                    <div className="flex items-baseline justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-amber-800" />
                        <h3 className="font-serif text-2xl font-bold text-stone-900">
                          Maharashtra & Regional Affairs
                        </h3>
                      </div>
                      <button
                        onClick={() => setSelectedCategory('maharashtra')}
                        className="text-xs uppercase tracking-wider text-amber-900 hover:text-stone-900 font-bold"
                      >
                        View Desk →
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {maharashtraStories.slice(0, 3).map((art) => (
                        <ArticleCard
                          key={art.id}
                          article={art}
                          variant="standard"
                          onSelect={handleSelectArticle}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* 2-Column Split: Technology & Agriculture */}
                <section className="pt-6 border-t border-stone-200 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Technology Column */}
                  <div>
                    <div className="flex items-baseline justify-between pb-3 border-b border-stone-200 mb-4">
                      <div className="flex items-center gap-2 font-serif text-xl font-bold text-stone-900">
                        <Cpu className="w-4 h-4 text-amber-800" />
                        <span>Technology & Frontier Science</span>
                      </div>
                      <button
                        onClick={() => setSelectedCategory('technology')}
                        className="text-xs text-amber-900 font-bold hover:underline"
                      >
                        All Tech →
                      </button>
                    </div>
                    <div className="space-y-2">
                      {technologyStories.slice(0, 2).map((art) => (
                        <ArticleCard
                          key={art.id}
                          article={art}
                          variant="compact"
                          onSelect={handleSelectArticle}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Agriculture Column */}
                  <div>
                    <div className="flex items-baseline justify-between pb-3 border-b border-stone-200 mb-4">
                      <div className="flex items-center gap-2 font-serif text-xl font-bold text-stone-900">
                        <Wheat className="w-4 h-4 text-amber-800" />
                        <span>Agriculture & Rural Development</span>
                      </div>
                      <button
                        onClick={() => setSelectedCategory('agriculture')}
                        className="text-xs text-amber-900 font-bold hover:underline"
                      >
                        All Agri →
                      </button>
                    </div>
                    <div className="space-y-2">
                      {agricultureStories.slice(0, 2).map((art) => (
                        <ArticleCard
                          key={art.id}
                          article={art}
                          variant="compact"
                          onSelect={handleSelectArticle}
                        />
                      ))}
                    </div>
                  </div>
                </section>

                {/* Section: Latest News Stream */}
                <section className="pt-6 border-t border-stone-200">
                  <div className="flex items-baseline justify-between mb-6">
                    <h3 className="font-serif text-2xl font-bold text-stone-900">
                      Latest News Stream
                    </h3>
                    <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold">
                      Chronological Wire
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-1">
                    {latestArticles.map((art) => (
                      <ArticleCard
                        key={art.id}
                        article={art}
                        variant="compact"
                        onSelect={handleSelectArticle}
                      />
                    ))}
                  </div>
                </section>
              </div>
            )}
          </main>

          {/* Footer */}
          <Footer
            categories={categories}
            onSelectCategory={(catId) => {
              setSelectedCategory(catId);
              setSelectedArticle(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAdmin={handleOpenAdmin}
            onHomeClick={handleBackToHome}
          />
        </>
      )}
    </div>
  );
}
