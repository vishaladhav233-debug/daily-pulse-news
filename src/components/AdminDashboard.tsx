import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Edit3,
  Bot,
  Play,
  Database,
  ExternalLink,
  Layers,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Info
} from 'lucide-react';
import { Article, ArticleStatus, Category, NewsSource, AgentRunSummary } from '../types/news.ts';

interface AdminDashboardProps {
  articles: Article[];
  categories: Category[];
  sources: NewsSource[];
  onClose: () => void;
  onRefresh: () => void;
  onUpdateArticleStatus: (id: string, status: ArticleStatus) => Promise<void>;
  onDeleteArticle: (id: string) => Promise<void>;
  onSaveArticle: (article: Partial<Article>) => Promise<void>;
  onRunAgent: () => Promise<AgentRunSummary | null>;
  onSynthesizeCustom: (payload: {
    sourceName: string;
    sourceUrl?: string;
    category: string;
    rawText: string;
    rawHeadline?: string;
  }) => Promise<void>;
  systemStatus: {
    environment?: {
      supabase?: { configured: boolean; mode: string; url: string | null; schemaFile: string };
      geminiAi?: { configured: boolean; model: string; mode: string };
      netlify?: { ready: boolean; redirectsFile: string; config: string };
    };
  } | null;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  articles,
  categories,
  sources,
  onClose,
  onRefresh,
  onUpdateArticleStatus,
  onDeleteArticle,
  onSaveArticle,
  onRunAgent,
  onSynthesizeCustom,
  systemStatus
}) => {
  const [activeTab, setActiveTab] = useState<'articles' | 'agent' | 'custom_wire' | 'categories' | 'deploy_env'>('articles');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);
  const [isNewArticle, setIsNewArticle] = useState(false);
  const [isRunningAgent, setIsRunningAgent] = useState(false);
  const [agentSummary, setAgentSummary] = useState<AgentRunSummary | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Custom Wire form state
  const [customWireForm, setCustomWireForm] = useState({
    sourceName: 'Press Information Bureau (PIB)',
    sourceUrl: 'https://pib.gov.in',
    category: 'india',
    rawHeadline: '',
    rawText: ''
  });
  const [isSubmittingCustom, setIsSubmittingCustom] = useState(false);

  // Filtered articles
  const filteredArticles = articles.filter(a => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && a.category_id !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q);
    }
    return true;
  });

  const pendingCount = articles.filter(a => a.status === 'pending_review').length;
  const publishedCount = articles.filter(a => a.status === 'published').length;
  const draftCount = articles.filter(a => a.status === 'draft').length;
  const rejectedCount = articles.filter(a => a.status === 'rejected').length;

  const handleStatusChange = async (id: string, newStatus: ArticleStatus) => {
    setActionLoadingId(id);
    try {
      await onUpdateArticleStatus(id, newStatus);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      setActionLoadingId(id);
      try {
        await onDeleteArticle(id);
      } finally {
        setActionLoadingId(null);
      }
    }
  };

  const handleStartEdit = (article: Article) => {
    setEditingArticle({ ...article });
    setIsNewArticle(false);
  };

  const handleStartCreate = () => {
    setEditingArticle({
      title: '',
      slug: '',
      description: '',
      content: '## Main Heading\n\nEnter factual article text here...\n\n### Context & Analysis\n\nAdd verified background.',
      category_id: categories[0]?.id || 'india',
      status: 'draft',
      image_url: '/src/assets/images/news_space_launch_1794111707862.jpg',
      image_caption: 'Official documentation and editorial media photograph.',
      image_credit: 'DailyPulse Editorial Visuals / Authorized Media',
      image_license: 'Editorial License',
      source_name: 'Press Information Bureau (PIB)',
      source_url: 'https://pib.gov.in',
      author_label: 'DailyPulse Editorial Bureau · Staff Reporter',
      is_breaking: false,
      is_featured: false,
      is_trending: false
    });
    setIsNewArticle(true);
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle || !editingArticle.title || !editingArticle.content) {
      alert('Title and content are required.');
      return;
    }

    try {
      await onSaveArticle(editingArticle);
      setEditingArticle(null);
      setIsNewArticle(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save article.');
    }
  };

  const handleTriggerAgent = async () => {
    setIsRunningAgent(true);
    setAgentSummary(null);
    try {
      const summary = await onRunAgent();
      if (summary) {
        setAgentSummary(summary);
      }
    } finally {
      setIsRunningAgent(false);
    }
  };

  const handleSubmitCustomWire = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customWireForm.rawText || !customWireForm.sourceName) {
      alert('Source name and wire text are required.');
      return;
    }
    setIsSubmittingCustom(true);
    try {
      await onSynthesizeCustom(customWireForm);
      setCustomWireForm({
        sourceName: 'Press Information Bureau (PIB)',
        sourceUrl: 'https://pib.gov.in',
        category: 'india',
        rawHeadline: '',
        rawText: ''
      });
      setActiveTab('articles');
      setStatusFilter('pending_review');
    } finally {
      setIsSubmittingCustom(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/90 text-stone-900 pb-20">
      {/* Top Banner & Control */}
      <div className="bg-stone-900 text-stone-100 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-stone-800 rounded text-stone-400 hover:text-white transition-colors"
              title="Return to public portal"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg text-white">DailyPulse News</span>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-400 bg-stone-800 px-2 py-0.5 rounded">
                  Editorial Command
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Editorial Review, Autonomous AI Agent Control & Production Database
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRefresh}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium rounded transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleStartCreate}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>New Article</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-stone-300 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('articles')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-2 ${
                activeTab === 'articles'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-300'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Articles & Review Queue</span>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.2 bg-amber-500 text-stone-950 font-bold text-[10px] rounded-full tabular-nums">
                  {pendingCount} review
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('agent')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-2 ${
                activeTab === 'agent'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-300'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-amber-600" />
              <span>Daily AI News Agent</span>
            </button>

            <button
              onClick={() => setActiveTab('custom_wire')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-2 ${
                activeTab === 'custom_wire'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Wire Ingestion Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-2 ${
                activeTab === 'categories'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-300'
              }`}
            >
              <span>Categories & Wires ({categories.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('deploy_env')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-2 ${
                activeTab === 'deploy_env'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-300'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>Supabase & Netlify Hosting</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Articles & Review Queue */}
        {activeTab === 'articles' && (
          <div>
            {/* KPI metric summary strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div
                onClick={() => setStatusFilter('pending_review')}
                className={`p-4 bg-white border rounded-sm cursor-pointer transition-all ${
                  statusFilter === 'pending_review' ? 'border-amber-600 ring-1 ring-amber-600' : 'border-stone-200 hover:border-stone-400'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                  <span>Pending Approval</span>
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-bold font-serif tabular-nums text-amber-900">
                  {pendingCount}
                </div>
                <span className="text-[11px] text-stone-400">Awaiting editor sign-off</span>
              </div>

              <div
                onClick={() => setStatusFilter('published')}
                className={`p-4 bg-white border rounded-sm cursor-pointer transition-all ${
                  statusFilter === 'published' ? 'border-emerald-600 ring-1 ring-emerald-600' : 'border-stone-200 hover:border-stone-400'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                  <span>Published Live</span>
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold font-serif tabular-nums text-emerald-900">
                  {publishedCount}
                </div>
                <span className="text-[11px] text-stone-400">Live on public portal</span>
              </div>

              <div
                onClick={() => setStatusFilter('draft')}
                className={`p-4 bg-white border rounded-sm cursor-pointer transition-all ${
                  statusFilter === 'draft' ? 'border-stone-800 ring-1 ring-stone-800' : 'border-stone-200 hover:border-stone-400'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                  <span>Drafts</span>
                  <Edit3 className="w-4 h-4 text-stone-500" />
                </div>
                <div className="text-2xl font-bold font-serif tabular-nums text-stone-800">
                  {draftCount}
                </div>
                <span className="text-[11px] text-stone-400">Manual reporter drafts</span>
              </div>

              <div
                onClick={() => setStatusFilter('rejected')}
                className={`p-4 bg-white border rounded-sm cursor-pointer transition-all ${
                  statusFilter === 'rejected' ? 'border-rose-600 ring-1 ring-rose-600' : 'border-stone-200 hover:border-stone-400'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                  <span>Rejected</span>
                  <XCircle className="w-4 h-4 text-rose-600" />
                </div>
                <div className="text-2xl font-bold font-serif tabular-nums text-rose-900">
                  {rejectedCount}
                </div>
                <span className="text-[11px] text-stone-400">Excluded from broadcast</span>
              </div>
            </div>

            {/* Filters and search */}
            <div className="bg-white p-4 border border-stone-200 rounded-sm mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter articles by title or keyword..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-600"
                  />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded focus:outline-none"
                >
                  <option value="all">All Statuses ({articles.length})</option>
                  <option value="pending_review">Pending Review ({pendingCount})</option>
                  <option value="published">Published ({publishedCount})</option>
                  <option value="draft">Draft ({draftCount})</option>
                  <option value="rejected">Rejected ({rejectedCount})</option>
                </select>
              </div>

              <div className="text-xs text-stone-500 tabular-nums">
                Showing {filteredArticles.length} of {articles.length} articles
              </div>
            </div>

            {/* Articles Table */}
            <div className="bg-white border border-stone-200 rounded-sm overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider text-[11px] border-b border-stone-200">
                    <tr>
                      <th className="py-3 px-4">Article & Headline</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Source & License</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Engagement</th>
                      <th className="py-3 px-4 text-right">Editorial Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredArticles.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-stone-500">
                          No articles match the current filter selection.
                        </td>
                      </tr>
                    ) : (
                      filteredArticles.map((art) => {
                        const isLoading = actionLoadingId === art.id;
                        return (
                          <tr key={art.id} className="hover:bg-stone-50/80 transition-colors">
                            {/* Headline & Image preview */}
                            <td className="py-3.5 px-4 min-w-[280px]">
                              <div className="flex items-start gap-3">
                                <div className="w-14 h-11 shrink-0 rounded bg-stone-200 overflow-hidden relative border border-stone-300">
                                  <img
                                    src={art.image_url}
                                    alt=""
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-serif font-bold text-stone-900 leading-snug line-clamp-2">
                                    {art.title}
                                  </h4>
                                  <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-1">
                                    <span>{art.author_label}</span>
                                    {art.is_breaking && (
                                      <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-1 rounded">
                                        Breaking
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className="font-semibold text-stone-800 uppercase text-[11px]">
                                {art.category_name || art.category_id}
                              </span>
                            </td>

                            {/* Source & License */}
                            <td className="py-3.5 px-4 min-w-[180px]">
                              <div className="text-stone-800 font-medium truncate">
                                {art.source_name}
                              </div>
                              <div className="text-[11px] text-stone-500 truncate">
                                {art.image_license}
                              </div>
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              {art.status === 'published' && (
                                <span className="inline-flex items-center gap-1 text-emerald-800 font-semibold text-[11px]">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                  Published
                                </span>
                              )}
                              {art.status === 'pending_review' && (
                                <span className="inline-flex items-center gap-1 text-amber-800 font-semibold text-[11px]">
                                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                                  Needs Review
                                </span>
                              )}
                              {art.status === 'draft' && (
                                <span className="text-stone-600 font-medium text-[11px]">
                                  Draft
                                </span>
                              )}
                              {art.status === 'rejected' && (
                                <span className="inline-flex items-center gap-1 text-rose-800 font-semibold text-[11px]">
                                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                  Rejected
                                </span>
                              )}
                            </td>

                            {/* Views */}
                            <td className="py-3.5 px-4 whitespace-nowrap tabular-nums text-stone-600">
                              {art.views_count.toLocaleString()} reads
                            </td>

                            {/* Action Buttons */}
                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                {art.status !== 'published' && (
                                  <button
                                    onClick={() => handleStatusChange(art.id, 'published')}
                                    disabled={isLoading}
                                    title="Approve & Publish immediately"
                                    className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded text-[11px] transition-colors flex items-center gap-1"
                                  >
                                    <CheckCircle className="w-3 h-3" />
                                    <span>Publish</span>
                                  </button>
                                )}

                                {art.status === 'pending_review' && (
                                  <button
                                    onClick={() => handleStatusChange(art.id, 'rejected')}
                                    disabled={isLoading}
                                    title="Reject article"
                                    className="px-2 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 font-medium rounded text-[11px] transition-colors"
                                  >
                                    Reject
                                  </button>
                                )}

                                <button
                                  onClick={() => handleStartEdit(art)}
                                  title="Edit full article"
                                  className="p-1 hover:bg-stone-200 text-stone-700 rounded transition-colors"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => handleDelete(art.id)}
                                  disabled={isLoading}
                                  title="Delete article"
                                  className="p-1 hover:bg-rose-100 text-rose-700 rounded transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Daily AI News Agent Console */}
        {activeTab === 'agent' && (
          <div className="space-y-6">
            <div className="bg-white p-6 border border-stone-200 rounded-sm shadow-xs">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
                    <Bot className="w-5 h-5 text-amber-700" />
                    Autonomous Daily AI News Agent
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 max-w-2xl">
                    The DailyPulse AI News Agent scans authorized primary wire services, executes semantic de-duplication against existing records, invokes the Gemini API (<code>gemini-3.8-flash</code>) for strictly grounded synthesis, matches certified editorial photos, and creates draft articles in <code>pending_review</code> status.
                  </p>
                </div>

                <button
                  onClick={handleTriggerAgent}
                  disabled={isRunningAgent}
                  className="px-5 py-2.5 bg-amber-700 hover:bg-amber-800 disabled:bg-stone-300 text-white font-semibold text-xs rounded transition-colors flex items-center gap-2 shadow-xs"
                >
                  {isRunningAgent ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Ingesting & Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Execute Daily Agent Pipeline</span>
                    </>
                  )}
                </button>
              </div>

              {/* Agent Charter & Grounding Rules */}
              <div className="bg-stone-50 border border-stone-200 rounded p-4 text-xs space-y-1.5 text-stone-700">
                <div className="font-bold uppercase tracking-wider text-stone-900 text-[11px] flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-700" />
                  Autonomous Ingestion & Fact-Checking Protocol
                </div>
                <p>• <strong>Strict Non-Hallucination:</strong> Never fabricates news, statements, or statistics. Uses verified facts only.</p>
                <p>• <strong>Original Wording:</strong> Synthesizes authoritative prose without infringing on verbatim wire copyright.</p>
                <p>• <strong>Attribution Guarantee:</strong> Retains direct source citations and hyperlinks for complete transparency.</p>
                <p>• <strong>Human-in-the-Loop Governance:</strong> Newly generated articles are automatically set to <code>pending_review</code> for editor approval.</p>
              </div>
            </div>

            {/* Execution Output & Logs */}
            {agentSummary && (
              <div className="bg-white p-6 border border-stone-200 rounded-sm shadow-xs">
                <h4 className="font-serif font-bold text-lg text-stone-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Agent Execution Report (Run: {agentSummary.runId})
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded">
                    <span className="text-[11px] text-stone-500 block">Sources Scanned</span>
                    <span className="text-xl font-bold font-serif tabular-nums text-stone-900">
                      {agentSummary.sourcesScanned}
                    </span>
                  </div>
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded">
                    <span className="text-[11px] text-stone-500 block">Stories Ingested</span>
                    <span className="text-xl font-bold font-serif tabular-nums text-stone-900">
                      {agentSummary.storiesIdentified}
                    </span>
                  </div>
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded">
                    <span className="text-[11px] text-stone-500 block">Duplicates Pruned</span>
                    <span className="text-xl font-bold font-serif tabular-nums text-stone-900">
                      {agentSummary.duplicatesRemoved}
                    </span>
                  </div>
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded">
                    <span className="text-[11px] text-stone-500 block">Queued For Review</span>
                    <span className="text-xl font-bold font-serif tabular-nums text-amber-700">
                      {agentSummary.articlesSynthesized}
                    </span>
                  </div>
                </div>

                {/* Log steps */}
                <div className="bg-stone-900 text-stone-200 p-4 rounded font-mono text-xs max-h-60 overflow-y-auto space-y-1">
                  {agentSummary.logs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-stone-500 shrink-0">[{log.step.toUpperCase()}]</span>
                      <span className={log.step === 'error' ? 'text-rose-400' : log.step === 'save' ? 'text-emerald-400' : 'text-stone-200'}>
                        {log.message}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => {
                      setActiveTab('articles');
                      setStatusFilter('pending_review');
                    }}
                    className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded"
                  >
                    View Queued Articles ({agentSummary.articlesSynthesized}) →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Custom Wire Ingestion Studio */}
        {activeTab === 'custom_wire' && (
          <div className="bg-white p-6 border border-stone-200 rounded-sm shadow-xs max-w-3xl mx-auto">
            <div className="mb-6">
              <h3 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-700" />
                Raw Wire & Press Release Ingestion Studio
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Paste any press release, government gazette bulletin, or licensed news wire. DailyPulse AI Agent will synthesize a factual, balanced news report ready for editorial sign-off.
              </p>
            </div>

            <form onSubmit={handleSubmitCustomWire} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Source Organization Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customWireForm.sourceName}
                    onChange={(e) => setCustomWireForm({ ...customWireForm, sourceName: e.target.value })}
                    placeholder="e.g. Press Information Bureau / Reuters / ISRO"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Source Link / Citation URL
                  </label>
                  <input
                    type="url"
                    value={customWireForm.sourceUrl}
                    onChange={(e) => setCustomWireForm({ ...customWireForm, sourceUrl: e.target.value })}
                    placeholder="https://pib.gov.in/..."
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  News Category
                </label>
                <select
                  value={customWireForm.category}
                  onChange={(e) => setCustomWireForm({ ...customWireForm, category: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Working Wire Headline (Optional)
                </label>
                <input
                  type="text"
                  value={customWireForm.rawHeadline}
                  onChange={(e) => setCustomWireForm({ ...customWireForm, rawHeadline: e.target.value })}
                  placeholder="Optional working title"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Raw Press Release or Wire Text *
                </label>
                <textarea
                  required
                  rows={6}
                  value={customWireForm.rawText}
                  onChange={(e) => setCustomWireForm({ ...customWireForm, rawText: e.target.value })}
                  placeholder="Paste the official announcement, facts, figures, or dispatch copy..."
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-600"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmittingCustom}
                  className="px-5 py-2.5 bg-amber-700 hover:bg-amber-800 disabled:bg-stone-300 text-white font-semibold text-xs rounded transition-colors flex items-center gap-2"
                >
                  {isSubmittingCustom ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Synthesizing Article...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Synthesize & Send to Review Queue</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 4: Categories & Registered Wire Feeds */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="bg-white p-6 border border-stone-200 rounded-sm shadow-xs">
              <h3 className="font-serif text-lg font-bold text-stone-900 mb-3">
                Managed News Categories ({categories.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {categories.map((c) => (
                  <div key={c.id} className="p-3 bg-stone-50 border border-stone-200 rounded flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-stone-900 text-xs block">{c.name}</span>
                      <span className="text-[11px] text-stone-500">{c.description?.slice(0, 50)}...</span>
                    </div>
                    <span className="px-2 py-0.5 bg-stone-200 text-stone-700 font-mono text-[10px] rounded tabular-nums">
                      {articles.filter(a => a.category_id === c.id).length} articles
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 border border-stone-200 rounded-sm shadow-xs">
              <h3 className="font-serif text-lg font-bold text-stone-900 mb-3">
                Configured RSS & Wire Feeds ({sources.length})
              </h3>
              <div className="divide-y divide-stone-100">
                {sources.map((s) => (
                  <div key={s.id} className="py-3 flex flex-wrap justify-between items-center gap-2 text-xs">
                    <div>
                      <div className="font-semibold text-stone-900 flex items-center gap-2">
                        <span>{s.name}</span>
                        <span className="text-[10px] uppercase text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          {s.category_id}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-500 font-mono mt-0.5">
                        {s.rss_url}
                      </div>
                      <div className="text-[10px] text-stone-400 mt-0.5">
                        License: {s.license_notes}
                      </div>
                    </div>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-stone-600 hover:text-stone-900 flex items-center gap-1 text-xs"
                    >
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Supabase & Netlify Hosting Guide */}
        {activeTab === 'deploy_env' && (
          <div className="bg-white p-6 border border-stone-200 rounded-sm shadow-xs space-y-6">
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-600" />
                Database & Deployment Architecture
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Overview of Supabase database setup, Netlify serverless deployment, and required environment variables.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Supabase status card */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs uppercase tracking-wider text-stone-800">
                    Supabase PostgreSQL
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                    systemStatus?.environment?.supabase?.configured ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {systemStatus?.environment?.supabase?.mode || 'Active'}
                  </span>
                </div>
                <p className="text-xs text-stone-600 mb-3 leading-relaxed">
                  Database schema file is generated at <code>/supabase/schema.sql</code> with complete tables for <code>articles</code>, <code>categories</code>, <code>sources</code>, and <code>admin_users</code>.
                </p>
                <div className="text-xs font-mono bg-white p-2.5 rounded border border-stone-300 text-stone-800 space-y-1">
                  <div>SUPABASE_URL="https://your-ref.supabase.co"</div>
                  <div>SUPABASE_SERVICE_ROLE_KEY="eyJh..."</div>
                </div>
              </div>

              {/* Netlify hosting card */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs uppercase tracking-wider text-stone-800">
                    Netlify Hosting Setup
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800">
                    Configured
                  </span>
                </div>
                <p className="text-xs text-stone-600 mb-3 leading-relaxed">
                  Deployment configuration files generated:
                </p>
                <ul className="text-xs text-stone-700 space-y-1">
                  <li>• <code>netlify.toml</code>: Build command <code>npm run build</code>, publish directory <code>dist</code></li>
                  <li>• <code>public/_redirects</code>: SPA single-page routing fallback (<code>/* /index.html 200</code>)</li>
                  <li>• <code>public/sitemap.xml</code> & <code>public/robots.txt</code>: Search indexing ready</li>
                </ul>
              </div>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="border-t border-stone-200 pt-4">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-stone-800 mb-2">
                How to Connect your own Supabase Project
              </h4>
              <ol className="text-xs text-stone-600 space-y-2 list-decimal list-inside leading-relaxed">
                <li>Create a free project at <strong>supabase.com</strong>.</li>
                <li>Go to the <strong>SQL Editor</strong> tab, open <code>/supabase/schema.sql</code> from this project, and click <strong>Run</strong>.</li>
                <li>Go to <strong>Project Settings &gt; API</strong> and copy your Project URL and service_role secret.</li>
                <li>Add <code>SUPABASE_URL</code> and <code>SUPABASE_SERVICE_ROLE_KEY</code> to your environment variables in Netlify or AI Studio Secrets.</li>
              </ol>
            </div>
          </div>
        )}
      </div>

      {/* Article Create / Edit Modal */}
      {editingArticle && (
        <div className="fixed inset-0 bg-stone-950/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-sm border border-stone-300 max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                {isNewArticle ? 'Draft New Article' : 'Edit Article'}
              </h3>
              <button
                onClick={() => setEditingArticle(null)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Original Headline *
                </label>
                <input
                  type="text"
                  required
                  value={editingArticle.title || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Short Description / Lead Deck *
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingArticle.description || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={editingArticle.category_id || 'india'}
                    onChange={(e) => setEditingArticle({ ...editingArticle, category_id: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Editorial Status *
                  </label>
                  <select
                    value={editingArticle.status || 'draft'}
                    onChange={(e) => setEditingArticle({ ...editingArticle, status: e.target.value as ArticleStatus })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded focus:outline-none"
                  >
                    <option value="draft">Draft</option>
                    <option value="pending_review">Pending Review</option>
                    <option value="published">Published</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Image URL & Credit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Featured Image URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingArticle.image_url || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, image_url: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Photo Credit & Attribution *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingArticle.image_credit || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, image_credit: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded focus:outline-none"
                  />
                </div>
              </div>

              {/* Source & Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Original Source Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingArticle.source_name || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, source_name: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Original Source URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={editingArticle.source_url || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, source_url: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Full Article Content (Markdown formatted) *
                </label>
                <textarea
                  rows={8}
                  required
                  value={editingArticle.content || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-mono bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-600"
                />
              </div>

              {/* Checkbox flags */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingArticle.is_breaking)}
                    onChange={(e) => setEditingArticle({ ...editingArticle, is_breaking: e.target.checked })}
                    className="rounded border-stone-300 text-amber-700"
                  />
                  <span>Mark as Breaking News</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingArticle.is_featured)}
                    onChange={(e) => setEditingArticle({ ...editingArticle, is_featured: e.target.checked })}
                    className="rounded border-stone-300 text-amber-700"
                  />
                  <span>Mark as Lead Featured Story</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingArticle.is_trending)}
                    onChange={(e) => setEditingArticle({ ...editingArticle, is_trending: e.target.checked })}
                    className="rounded border-stone-300 text-amber-700"
                  />
                  <span>Mark as Trending</span>
                </label>
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 text-xs font-medium rounded hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded"
                >
                  Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
