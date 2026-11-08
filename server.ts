import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db } from './server/db.ts';
import { newsAgent } from './server/agent.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// API Routes

// 1. System Status & Environment Check
app.get('/api/status', async (_req: Request, res: Response) => {
  const dbStatus = db.getDbStatus();
  const hasGemini = Boolean(process.env.GEMINI_API_KEY);
  const hasSupabase = Boolean(process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY));

  res.json({
    appName: 'DailyPulse News',
    version: '1.0.0',
    time: new Date().toISOString(),
    environment: {
      supabase: {
        configured: hasSupabase,
        mode: dbStatus.mode,
        url: dbStatus.url ? `${dbStatus.url.slice(0, 18)}...` : null,
        schemaFile: '/supabase/schema.sql'
      },
      geminiAi: {
        configured: hasGemini,
        model: 'gemini-3.8-flash',
        mode: hasGemini ? 'Live Gemini 3.8 Flash' : 'Simulated / Heuristic Fallback'
      },
      netlify: {
        ready: true,
        redirectsFile: '/public/_redirects',
        config: '/netlify.toml'
      }
    }
  });
});

// 2. Categories
app.get('/api/categories', async (_req: Request, res: Response) => {
  try {
    const categories = await db.getCategories();
    res.json(categories);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: errorMsg });
  }
});

// 3. Articles List
app.get('/api/articles', async (req: Request, res: Response) => {
  try {
    const {
      category,
      status,
      search,
      limit,
      trending,
      breaking,
      featured
    } = req.query;

    const articles = await db.getArticles({
      category: category as string,
      status: status as string,
      search: search as string,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      trending: trending === 'true',
      breaking: breaking === 'true',
      featured: featured === 'true'
    });

    res.json(articles);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: errorMsg });
  }
});

// 4. Single Article
app.get('/api/articles/:slugOrId', async (req: Request, res: Response) => {
  try {
    const slugOrId = req.params.slugOrId;
    const article = await db.getArticleBySlugOrId(slugOrId, true);

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Also fetch related articles in the same category
    const related = await db.getArticles({
      category: article.category_id,
      status: 'published',
      limit: 4
    });

    res.json({
      article,
      related: related.filter(a => a.id !== article.id).slice(0, 3)
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: errorMsg });
  }
});

// 5. Create Article
app.post('/api/articles', async (req: Request, res: Response) => {
  try {
    const articleData = req.body;
    if (!articleData.title || !articleData.content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const created = await db.createArticle(articleData);
    res.status(201).json(created);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: errorMsg });
  }
});

// 6. Update Article
app.patch('/api/articles/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const updated = await db.updateArticle(id, updates);
    if (!updated) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(updated);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: errorMsg });
  }
});

// 7. Update Article Status (approve, reject, publish, draft)
app.post('/api/articles/:id/status', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    if (!['draft', 'pending_review', 'published', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updated = await db.updateArticle(id, { status });
    if (!updated) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(updated);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: errorMsg });
  }
});

// 8. Delete Article
app.delete('/api/articles/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const deleted = await db.deleteArticle(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json({ success: true, id });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: errorMsg });
  }
});

// 9. Sources
app.get('/api/sources', async (_req: Request, res: Response) => {
  try {
    const sources = await db.getSources();
    res.json(sources);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: errorMsg });
  }
});

app.post('/api/sources', async (req: Request, res: Response) => {
  try {
    const sourceData = req.body;
    if (!sourceData.name || !sourceData.url) {
      return res.status(400).json({ error: 'Source name and URL are required' });
    }
    const created = await db.addSource({
      id: sourceData.id || `source-${Date.now()}`,
      name: sourceData.name,
      url: sourceData.url,
      rss_url: sourceData.rss_url || sourceData.url,
      category_id: sourceData.category_id || 'india',
      license_notes: sourceData.license_notes || 'Verified media partner',
      is_active: true
    });
    res.status(201).json(created);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: errorMsg });
  }
});

// 10. AI News Agent Run Trigger
app.post('/api/agent/run', async (_req: Request, res: Response) => {
  try {
    console.log('[AI News Agent API] Admin requested daily ingestion pipeline run.');
    const summary = await newsAgent.runDailyPipeline();
    res.json(summary);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: errorMsg });
  }
});

// 11. Custom Text Wire Ingestion via Gemini
app.post('/api/agent/synthesize-custom', async (req: Request, res: Response) => {
  try {
    const { sourceName, sourceUrl, category, rawText, rawHeadline } = req.body;
    if (!rawText || !sourceName) {
      return res.status(400).json({ error: 'sourceName and rawText are required' });
    }

    const synthesized = await newsAgent.synthesizeArticle({
      sourceName,
      sourceUrl: sourceUrl || 'https://pib.gov.in',
      rawCategory: category || 'india',
      rawHeadline: rawHeadline || rawText.slice(0, 80),
      rawFacts: rawText
    });

    const imageMatch = newsAgent.selectPermittedImage(category || 'india');

    const created = await db.createArticle({
      title: synthesized.headline,
      description: synthesized.description,
      content: synthesized.content,
      category_id: category || 'india',
      status: 'pending_review',
      image_url: imageMatch.url,
      image_caption: synthesized.headline + ' — ' + imageMatch.caption,
      image_credit: imageMatch.credit,
      image_license: imageMatch.license,
      source_name: sourceName,
      source_url: sourceUrl || 'https://dailypulse-news.netlify.app',
      author_label: 'DailyPulse AI Agent · Verified by Editor',
      key_points: synthesized.keyPoints,
      reading_time_minutes: synthesized.readingTimeMinutes || 3
    });

    res.status(201).json(created);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: errorMsg });
  }
});

// Start server and mount Vite in development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[DailyPulse Server] Running at http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[DailyPulse Server] Fatal startup error:', err);
  process.exit(1);
});
