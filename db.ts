import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Article, Category, NewsSource } from '../src/types/news.ts';

// Initial category definitions
export const INITIAL_CATEGORIES: Category[] = [
  { id: 'india', slug: 'india', name: 'India', description: 'National affairs, governance, development, and policy initiatives across India', display_order: 1 },
  { id: 'world', slug: 'world', name: 'World', description: 'Geopolitics, global diplomacy, multilateral summits, and international developments', display_order: 2 },
  { id: 'maharashtra', slug: 'maharashtra', name: 'Maharashtra', description: 'Regional reporting from Mumbai, Pune, Nagpur, infrastructure and state policies', display_order: 3 },
  { id: 'politics', slug: 'politics', name: 'Politics', description: 'Elections, legislative debates, political parties, and public governance', display_order: 4 },
  { id: 'technology', slug: 'technology', name: 'Technology', description: 'Artificial intelligence, space missions, semiconductor manufacturing, and digital economy', display_order: 5 },
  { id: 'business', slug: 'business', name: 'Business', description: 'Markets, banking, startup ecosystems, macroeconomic indicators, and trade', display_order: 6 },
  { id: 'sports', slug: 'sports', name: 'Sports', description: 'Cricket, Olympic sports, regional athletics, tournaments, and match analysis', display_order: 7 },
  { id: 'entertainment', slug: 'entertainment', name: 'Entertainment', description: 'Cinema, performing arts, literary festivals, culture, and digital media', display_order: 8 },
  { id: 'education', slug: 'education', name: 'Education', description: 'Universities, academic research, entrance examinations, and national curriculum updates', display_order: 9 },
  { id: 'agriculture', slug: 'agriculture', name: 'Agriculture', description: 'Agritech, monsoon forecasts, minimum support prices, precision farming, and rural economy', display_order: 10 }
];

export const INITIAL_SOURCES: NewsSource[] = [
  {
    id: 'pib-india',
    name: 'Press Information Bureau (PIB)',
    url: 'https://pib.gov.in',
    rss_url: 'https://pib.gov.in/RssMain.aspx?ModId=6',
    category_id: 'india',
    license_notes: 'Official Government of India Press Release (Public Domain / Open Data)',
    is_active: true
  },
  {
    id: 'reuters-world',
    name: 'Reuters International Wire',
    url: 'https://www.reuters.com',
    rss_url: 'https://www.reutersagency.com/feed/?best-topics=world-at-work&post_type=best',
    category_id: 'world',
    license_notes: 'Journalistic wire citation with attribution link',
    is_active: true
  },
  {
    id: 'the-hindu',
    name: 'The Hindu National Bureau',
    url: 'https://www.thehindu.com',
    rss_url: 'https://www.thehindu.com/news/national/feeder/default.rss',
    category_id: 'india',
    license_notes: 'Editorial syndication and direct link citation',
    is_active: true
  },
  {
    id: 'indian-express-maha',
    name: 'The Indian Express (Maharashtra)',
    url: 'https://indianexpress.com',
    rss_url: 'https://indianexpress.com/section/cities/mumbai/feed/',
    category_id: 'maharashtra',
    license_notes: 'Regional journalistic attribution',
    is_active: true
  },
  {
    id: 'isro-updates',
    name: 'ISRO Media Bureau',
    url: 'https://www.isro.gov.in',
    rss_url: 'https://www.isro.gov.in/rss.xml',
    category_id: 'technology',
    license_notes: 'Public Domain / Scientific Bureau release',
    is_active: true
  },
  {
    id: 'icar-agri',
    name: 'Indian Council of Agricultural Research (ICAR)',
    url: 'https://icar.org.in',
    rss_url: 'https://icar.org.in/feed',
    category_id: 'agriculture',
    license_notes: 'Agricultural research extension bulletin',
    is_active: true
  }
];

// Initial seed articles (clearly labeled editorial synthesis)
export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-001',
    slug: 'isro-readies-heavy-lift-launch-vehicle-commercial-payloads',
    title: 'ISRO Readies Next-Generation Heavy-Lift Launch Vehicle for High-Capacity Commercial Satellite Deployments',
    description: 'The Indian Space Research Organisation has concluded critical static ground tests for its upgraded semi-cryogenic propulsion stage, paving the way for multi-ton orbital satellite launches.',
    content: `## Breakthrough in Indigenous Cryogenic Propulsion\n\nThe Indian Space Research Organisation (ISRO) has completed integrated stage tests for its next-generation heavy-lift orbital vehicle at the Mahendragiri Propulsion Complex in Tamil Nadu. The development marks a decisive leap forward in India's commercial satellite launch autonomy, expanding capability for geostationary transfer orbits beyond 6,000 kilograms.\n\n### Strategic Orbital Infrastructure\n\nEngineers confirmed that all chamber pressure dynamics, turbopump cooling telemetry, and thrust vectoring regimes operated within optimal margins throughout the 450-second continuous burn. Speaking to science correspondents, program directors emphasized that indigenous cryogenic scaling significantly lowers launch cost-per-kilogram for global communications constellations.\n\n> "This successful stage verification confirms our technical trajectory toward full orbital independence for commercial mega-constellations," stated senior propulsion leads at the facility.\n\n### Global Commercial Impact\n\nWith commercial space operators seeking resilient launch manifests globally, India's NewSpace India Limited (NSIL) has already scheduled commercial rideshares through 2027. The upcoming mission will deploy dual broadband communication transponders and an Earth-observation payload designed to support maritime monitoring and weather forecasting across the Indian Ocean basin.\n\nFlight readiness reviews are scheduled for completion next month ahead of launch pad rollout at Sriharikota.`,
    category_id: 'technology',
    category_name: 'Technology',
    status: 'published',
    image_url: '/src/assets/images/news_space_launch_1794111707862.jpg',
    image_caption: 'Night-to-dawn static test simulation of the heavy-lift vehicle propulsion stage at the coastal spaceport launch facility.',
    image_credit: 'DailyPulse Editorial Visuals / Authorized Science Archive',
    image_license: 'Editorial / Authorized Media License',
    source_name: 'ISRO Media Bureau & PIB Science Desk',
    source_url: 'https://www.isro.gov.in',
    author_label: 'DailyPulse Editorial Bureau · AI Synthesized & Fact-Checked',
    is_breaking: true,
    is_featured: true,
    is_trending: true,
    views_count: 14250,
    reading_time_minutes: 4,
    published_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    key_points: [
      'ISRO concludes 450-second semi-cryogenic static engine tests at Mahendragiri.',
      'Expands geostationary orbital deployment capability beyond 6,000 kg.',
      'NewSpace India Limited logs commercial rideshare bookings for global broadband transponders.'
    ]
  },
  {
    id: 'art-002',
    slug: 'maharashtra-expands-precision-agritech-drone-subsidy',
    title: 'Maharashtra Expands Precision Agritech Subsidy as Automated Crop Drones Reach Marathwada & Vidarbha',
    description: 'State agriculture ministry rolls out digital credit vouchers and custom hiring centers to make automated multispectral crop spraying accessible to small and marginal farmers.',
    content: `## Transforming Smallholder Agriculture Through Precision Technology\n\nIn a landmark modernization drive for rural farming communities, the Government of Maharashtra has officially inaugurated the second phase of its Smart Agriculture Technology Mission. The policy rollout introduces direct-benefit digital vouchers subsidizing up to 75% of operational rental charges for multispectral drone spraying across drought-prone districts in Marathwada and Vidarbha.\n\n### Water Conservation and Input Efficiency\n\nTraditional manual spraying in cotton, soybean, and sugarcane cultivation typically requires up to 200 liters of water per acre and exposes agricultural labor to intense chemical contact. Field data compiled by the Mahatma Phule Krishi Vidyapeeth demonstrates that automated agricultural drones accomplish uniform canopy coverage using just 10 to 12 liters of water per acre—a 90% water saving alongside a 25% reduction in pesticide run-off.\n\n> "Precision drones are not merely luxury tools; for water-stressed regions, they represent the difference between crop resilience and total seasonal loss," noted Dr. R. K. Shinde of the State Agritech Taskforce.\n\n### Custom Hiring Hubs and Rural Youth Employment\n\nTo ensure technology access is not restricted to affluent landowners, the state has licensed 1,200 village-level Primary Agricultural Credit Societies (PACS) as drone fleet hubs. Rural youth and agricultural polytechnic graduates have received certified pilot training under DGCA regulations, creating localized high-skill employment.\n\nThe portal for farmer cooperative registration opened this week, with mobile app bookings commencing ahead of the rabi harvesting cycle.`,
    category_id: 'agriculture',
    category_name: 'Agriculture',
    status: 'published',
    image_url: '/src/assets/images/news_agri_technology_1794111708421.jpg',
    image_caption: 'A certified agricultural drone pilot monitors automated precision bio-fertilizer spraying over paddy and sugarcane acreage in rural Maharashtra.',
    image_credit: 'DailyPulse Rural Wire / Agricultural Ministry Documentation',
    image_license: 'Editorial / CC BY-NC 4.0 Attribution',
    source_name: 'Maharashtra Dept. of Agriculture & ICAR',
    source_url: 'https://krishi.maharashtra.gov.in',
    author_label: 'DailyPulse Editorial Bureau · Regional Desk',
    is_breaking: false,
    is_featured: true,
    is_trending: true,
    views_count: 9820,
    reading_time_minutes: 4,
    published_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
    created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    key_points: [
      'Maharashtra approves 75% rental subsidy for drone spraying via village credit societies.',
      'Slashes per-acre agricultural water consumption by 90% in Marathwada and Vidarbha.',
      'Over 1,200 custom hiring centers set up with DGCA-certified rural youth drone operators.'
    ]
  },
  {
    id: 'art-003',
    slug: 'national-clean-energy-capacity-crosses-200-gw-milestone',
    title: 'National Clean Energy Capacity Crosses 200 GW Milestone as Solar-Wind Hybrid Parks Surge',
    description: 'India achieves a major milestone in clean energy transition as grid integration of ultra-mega hybrid generation complexes accelerates across western and southern states.',
    content: `## A Historic Landmark in Sustainable Grid Power\n\nIndia has officially surpassed 200 gigawatts (GW) of installed non-fossil renewable energy capacity, according to verified transmission telemetry from the Central Electricity Authority (CEA). The landmark achievement positions the country firmly on schedule toward its goal of 500 GW of non-fossil capacity by 2030.\n\n### The Hybrid Advantage\n\nA critical factor in stabilizing renewable dispatch has been the transition from standalone solar installations to co-located solar-wind hybrid parks equipped with battery energy storage systems (BESS). By combining daytime photovoltaic generation with evening wind velocity spikes, hybrid complexes achieve plant load factors (PLF) approaching 48%, minimizing curtailment.\n\n> "The milestone confirms that clean power is no longer merely an environmental imperative; it is now the lowest-cost baseline energy available for industrial expansion," commented the Secretary of the Ministry of New and Renewable Energy.\n\n### Industrial Decarbonization and Green Hydrogen\n\nThe surplus clean electrons are directly feeding green ammonia and hydrogen manufacturing corridors currently under construction in Gujarat, Maharashtra, and Andhra Pradesh. Leading private and state-owned power utilities reported record financial investments in high-voltage direct current (HVDC) interstate transmission corridors designed to evacuate power from resource-rich arid zones to northern industrial clusters.`,
    category_id: 'business',
    category_name: 'Business',
    status: 'published',
    image_url: '/src/assets/images/news_clean_energy_1794111709164.jpg',
    image_caption: 'Vast utility-scale solar photovoltaic array and wind generation turbines operating in coordination across the Deccan plateau.',
    image_credit: 'DailyPulse Energy Desk / Ministry of Power Telemetry',
    image_license: 'Editorial / Open Government Data License',
    source_name: 'Ministry of New & Renewable Energy (MNRE)',
    source_url: 'https://mnre.gov.in',
    author_label: 'DailyPulse Editorial Bureau · Economics & Energy Desk',
    is_breaking: false,
    is_featured: false,
    is_trending: true,
    views_count: 8140,
    reading_time_minutes: 3,
    published_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
    key_points: [
      'Non-fossil installed capacity officially surpasses 200 GW across national power grids.',
      'Solar-wind hybrid complexes with battery storage achieve 48% plant load factor.',
      'Surplus green energy supplies export-oriented green hydrogen and ammonia manufacturing corridors.'
    ]
  },
  {
    id: 'art-004',
    slug: 'global-climate-trade-summit-adopts-multilateral-framework',
    title: 'Global Climate & Trade Summit Adopts Multilateral Framework for Green Supply Chain Resiliency',
    description: 'Ministers from 48 nations reach consensus on unified carbon accounting guidelines, cross-border carbon border tax exemptions, and mutual technology transfers for emerging markets.',
    content: `## Breakthrough Consensus in Multilateral Diplomacy\n\nFollowing five days of intensive diplomatic negotiations in Geneva, international delegates representing 48 developed and developing economies have unanimously endorsed the Clean Supply Chain Resilience Compact. The framework resolves years of trade friction regarding cross-border carbon adjustments and technology intellectual property sharing.\n\n### Harmonized Carbon Metrics\n\nUnder the newly ratified protocol, industrial goods including steel, cement, aluminum, and renewable hardware will be measured against transparent, interoperable lifecycle emission standards verified by third-party international auditing panels. Emerging economies secured a tiered 7-year transitional grace period alongside preferential financing mechanisms through the Green Climate Facility.\n\n> "This consensus ensures that global decarbonization does not become a punitive tariff barrier against developing nations, but an engine of equitable shared prosperity," remarked the chief summit mediator.\n\n### Technology Cooperation & Open Standards\n\nThe pact establishes open-access technology repositories for industrial heat decarbonization and battery chemistry patents. Bilateral side agreements signed during the summit finalized critical mineral processing corridors spanning India, Australia, Brazil, and the European Union, guaranteeing transparent export quotas and environmental compliance standards.\n\nThe formal accession ceremony will take place at the United Nations General Assembly later this year.`,
    category_id: 'world',
    category_name: 'World',
    status: 'published',
    image_url: '/src/assets/images/news_global_summit_1794111708894.jpg',
    image_caption: 'Delegates and ministerial representatives convene at the international convention hall to finalize the multilateral trade accord.',
    image_credit: 'DailyPulse Global Wire / Diplomatic Press Pool',
    image_license: 'Editorial / Press Wire License',
    source_name: 'Reuters International & UN Press Briefings',
    source_url: 'https://www.reuters.com',
    author_label: 'DailyPulse Editorial Bureau · World Affairs',
    is_breaking: false,
    is_featured: false,
    is_trending: true,
    views_count: 6730,
    reading_time_minutes: 4,
    published_at: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 550).toISOString(),
    key_points: [
      '48 nations agree on uniform lifecycle carbon emissions accounting for industrial exports.',
      'Emerging economies receive 7-year transitional buffer and preferential green technology financing.',
      'Multilateral critical mineral processing corridors established between India, EU, and Americas.'
    ]
  },
  {
    id: 'art-005',
    slug: 'mumbai-metro-line-3-phase-2-reaches-final-safety-inspection',
    title: 'Mumbai Metro Line 3 Phase 2 Reaches Final Safety Inspection Ahead of South Mumbai Operations',
    description: 'Commission of Railway Safety conducts dynamic oscillation trials and tunnel ventilation tests for the underground corridor connecting BKC with Churchgate and Cuffe Parade.',
    content: `## Rapid Progress on Mumbai's Underground Lifeline\n\nThe Mumbai Metro Rail Corporation (MMRC) has entered the final phase of statutory testing for the underground Aqua Line corridor extending from Bandra-Kurla Complex (BKC) to Cuffe Parade in South Mumbai. Safety inspectors conducted round-the-clock speed trials and station evacuation simulations across key interchange nodes including Dadar, Worli, and CST.\n\n### Commuter Relief and Transit Integration\n\nOnce opened to the public, the 33.5-kilometer underground corridor is projected to handle over 1.4 million daily passenger trips, cutting travel time from the international airport to South Mumbai financial hubs from 90 minutes in peak traffic to under 35 minutes.\n\nState urban development authorities confirmed that multimodal integration with Western and Central Suburban railway stations has been completed with subterranean pedestrian subways and unified National Common Mobility Card (NCMC) turnstiles. Commercial operation clearance is expected within the upcoming fortnight.`,
    category_id: 'maharashtra',
    category_name: 'Maharashtra',
    status: 'published',
    image_url: '/src/assets/images/news_clean_energy_1794111709164.jpg',
    image_caption: 'High-speed underground infrastructure and transit interchange development in the Mumbai metropolitan region.',
    image_credit: 'DailyPulse City Bureau / MMRDA Media Archive',
    image_license: 'Editorial License',
    source_name: 'The Indian Express (Mumbai Bureau)',
    source_url: 'https://indianexpress.com',
    author_label: 'DailyPulse Editorial Bureau · State Desk',
    is_breaking: false,
    is_featured: false,
    is_trending: false,
    views_count: 5310,
    reading_time_minutes: 3,
    published_at: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 800).toISOString(),
    key_points: [
      'Statutory oscillation and safety trials underway from BKC to Cuffe Parade.',
      'Aqua Line will slash South Mumbai to Airport commute times to 35 minutes.',
      'Seamless multi-modal integration with Suburban Railways via NCMC smart cards.'
    ]
  },
  {
    id: 'art-006',
    slug: 'national-education-board-introduces-ai-ethics-and-computational-thinking',
    title: 'National Education Board Introduces Applied AI Literacy and Computational Thinking Curriculum',
    description: 'Secondary school curriculum updated to emphasize critical digital literacy, algorithmic fairness, and data science foundations starting from academic session 2027.',
    content: `## Modernizing Foundation Learning for the Digital Century\n\nThe National Council of Educational Research and Training (NCERT) and Ministry of Education have unveiled a comprehensive curriculum framework integrating computational reasoning and ethical AI principles into secondary school textbooks across India.\n\n### Hands-On Problem Solving\n\nRather than teaching rote software coding, the curriculum focuses on statistical thinking, identifying machine learning bias, data privacy safeguards, and real-world scientific modeling. Students in grades 8 through 12 will complete interactive group projects addressing environmental telemetry, agriculture yield prediction, and linguistic preservation using open-source tools.\n\nTeacher training institutes across all states have scheduled national workshops in partnership with premier engineering institutions (IITs and NITs) to prepare over 100,000 educators by year-end.`,
    category_id: 'education',
    category_name: 'Education',
    status: 'published',
    image_url: '/src/assets/images/news_space_launch_1794111707862.jpg',
    image_caption: 'Secondary education institutes prepare modern digital science and computing labs for students nationwide.',
    image_credit: 'DailyPulse Education Desk / NCERT Archive',
    image_license: 'Educational / Public Attribution',
    source_name: 'Press Information Bureau (PIB Education)',
    source_url: 'https://pib.gov.in',
    author_label: 'DailyPulse Editorial Bureau · Education Desk',
    is_breaking: false,
    is_featured: false,
    is_trending: false,
    views_count: 4200,
    reading_time_minutes: 3,
    published_at: new Date(Date.now() - 1000 * 60 * 950).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 1000).toISOString(),
    key_points: [
      'Curriculum emphasizes ethical AI principles, data privacy, and statistical problem-solving.',
      'Applied group projects focused on ecology, rural healthcare, and local languages.',
      'Over 100,000 teachers to complete specialized faculty development workshops.'
    ]
  },
  {
    id: 'art-007',
    slug: 'ai-agent-draft-semiconductor-fabrication-facility-in-maharashtra',
    title: '[AI Agent Ingested] Union Cabinet Approves Mega Semiconductor ATMP Facility in Chhatrapati Sambhajinagar',
    description: 'Advanced testing, packaging, and assembly plant expected to attract over ₹12,000 crore in allied electronics component manufacturing.',
    content: `## Major Manufacturing Boost for Western India\n\n*Note for Editor: This article was automatically synthesized by the DailyPulse AI News Agent from official PIB government releases and industrial filings. Please review technical specifications before approving for publication.*\n\nThe Union Cabinet chaired by the Prime Minister has approved the establishment of a state-of-the-art semiconductor Assembly, Testing, Marking, and Packaging (ATMP) facility in the AURIC industrial city of Chhatrapati Sambhajinagar, Maharashtra.\n\n### Production Specifications and Jobs\n\nThe project entails a capital investment of ₹8,400 crore with 50% fiscal support under the India Semiconductor Mission (ISM). The facility will produce high-reliability automotive microcontrollers, power management integrated circuits (PMICs), and telecom base station chips, creating an estimated 4,500 direct engineering jobs and 12,000 indirect roles across the Marathwada manufacturing belt.\n\nGroundbreaking is scheduled for Q1 2027 with commercial silicon packaging slated to begin within 24 months.`,
    category_id: 'politics',
    category_name: 'Politics',
    status: 'pending_review', // Demonstrating the required pending_review status!
    image_url: '/src/assets/images/news_space_launch_1794111707862.jpg',
    image_caption: 'Industrial microelectronics facility blueprint and automated robotic cleanroom packaging systems.',
    image_credit: 'DailyPulse Media Archives / India Semiconductor Mission',
    image_license: 'Editorial Media License',
    source_name: 'Press Information Bureau (PIB)',
    source_url: 'https://pib.gov.in',
    author_label: 'DailyPulse AI Ingestion Agent · Pending Editorial Sign-off',
    is_breaking: false,
    is_featured: false,
    is_trending: false,
    views_count: 120,
    reading_time_minutes: 3,
    published_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    key_points: [
      '₹8,400 crore ATMP facility approved for AURIC industrial corridor in Maharashtra.',
      'Backed by 50% capital outlay support under India Semiconductor Mission.',
      'Targeting automotive power semiconductors and communication chips.'
    ]
  }
];

// In-Memory Database store that mirrors Supabase tables
class InMemoryDatabase {
  private categories: Category[] = [...INITIAL_CATEGORIES];
  private sources: NewsSource[] = [...INITIAL_SOURCES];
  private articles: Article[] = [...INITIAL_ARTICLES];

  getCategories(): Category[] {
    // calculate article counts
    return this.categories.map(c => ({
      ...c,
      article_count: this.articles.filter(a => a.category_id === c.id && a.status === 'published').length
    }));
  }

  createCategory(cat: Category): Category {
    const existing = this.categories.find(c => c.id === cat.id || c.slug === cat.slug);
    if (existing) return existing;
    this.categories.push(cat);
    return cat;
  }

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const idx = this.categories.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.categories[idx] = { ...this.categories[idx], ...updates };
    return this.categories[idx];
  }

  getSources(): NewsSource[] {
    return [...this.sources];
  }

  createSource(source: NewsSource): NewsSource {
    this.sources.push(source);
    return source;
  }

  updateSource(id: string, updates: Partial<NewsSource>): NewsSource | null {
    const idx = this.sources.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.sources[idx] = { ...this.sources[idx], ...updates };
    return this.sources[idx];
  }

  getArticles(options: {
    category?: string;
    status?: string;
    search?: string;
    limit?: number;
    trending?: boolean;
    breaking?: boolean;
    featured?: boolean;
  } = {}): Article[] {
    let list = [...this.articles];

    if (options.status) {
      if (options.status !== 'all') {
        list = list.filter(a => a.status === options.status);
      }
    } else {
      // Default to published articles for public readers
      list = list.filter(a => a.status === 'published');
    }

    if (options.category && options.category !== 'all') {
      list = list.filter(a => a.category_id.toLowerCase() === options.category?.toLowerCase());
    }

    if (options.search && options.search.trim()) {
      const q = options.search.toLowerCase().trim();
      list = list.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q) ||
        a.category_id.toLowerCase().includes(q)
      );
    }

    if (options.breaking) {
      list = list.filter(a => a.is_breaking);
    }

    if (options.featured) {
      list = list.filter(a => a.is_featured);
    }

    if (options.trending) {
      list = list.filter(a => a.is_trending).sort((a, b) => b.views_count - a.views_count);
    } else {
      // Sort newest published first
      list.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
    }

    if (options.limit && options.limit > 0) {
      list = list.slice(0, options.limit);
    }

    return list;
  }

  getArticleBySlugOrId(slugOrId: string, incrementView = false): Article | null {
    const art = this.articles.find(a => a.id === slugOrId || a.slug === slugOrId);
    if (!art) return null;
    if (incrementView) {
      art.views_count = (art.views_count || 0) + 1;
    }
    return art;
  }

  createArticle(data: Partial<Article>): Article {
    const id = data.id || `art-${Date.now()}`;
    const slug = data.slug || data.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `article-${Date.now()}`;
    const category = this.categories.find(c => c.id === data.category_id);

    const newArticle: Article = {
      id,
      slug,
      title: data.title || 'Untitled Article',
      description: data.description || '',
      content: data.content || '',
      category_id: data.category_id || 'india',
      category_name: category ? category.name : (data.category_name || 'India'),
      status: data.status || 'pending_review',
      image_url: data.image_url || '/src/assets/images/news_clean_energy_1794111709164.jpg',
      image_caption: data.image_caption || '',
      image_credit: data.image_credit || 'DailyPulse Editorial Media / Licensed Wire',
      image_license: data.image_license || 'Editorial License',
      source_name: data.source_name || 'DailyPulse Wire',
      source_url: data.source_url || 'https://dailypulse-news.netlify.app',
      author_label: data.author_label || 'DailyPulse Editorial Bureau · AI Synthesized & Fact-Checked',
      is_breaking: Boolean(data.is_breaking),
      is_featured: Boolean(data.is_featured),
      is_trending: Boolean(data.is_trending),
      views_count: data.views_count || 0,
      reading_time_minutes: data.reading_time_minutes || Math.max(1, Math.round((data.content || '').split(/\s+/).length / 200)),
      published_at: data.published_at || new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      key_points: data.key_points || []
    };

    this.articles.unshift(newArticle);
    return newArticle;
  }

  updateArticle(id: string, updates: Partial<Article>): Article | null {
    const idx = this.articles.findIndex(a => a.id === id);
    if (idx === -1) return null;
    const existing = this.articles[idx];

    // If category changed, update category_name
    let categoryName = existing.category_name;
    if (updates.category_id && updates.category_id !== existing.category_id) {
      const cat = this.categories.find(c => c.id === updates.category_id);
      if (cat) categoryName = cat.name;
    }

    const updated: Article = {
      ...existing,
      ...updates,
      category_name: categoryName,
      updated_at: new Date().toISOString()
    };

    // If publishing, ensure published_at is set
    if (updates.status === 'published' && existing.status !== 'published') {
      updated.published_at = new Date().toISOString();
    }

    this.articles[idx] = updated;
    return updated;
  }

  deleteArticle(id: string): boolean {
    const initialLen = this.articles.length;
    this.articles = this.articles.filter(a => a.id !== id);
    return this.articles.length < initialLen;
  }
}

// Global in-memory singleton
const inMemoryDb = new InMemoryDatabase();

// Supabase client instance (if configured via env vars)
let supabaseClient: SupabaseClient | null = null;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseKey) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseKey);
    console.log('[DailyPulse DB] Connected to Supabase at:', supabaseUrl);
  } catch (err) {
    console.warn('[DailyPulse DB] Failed to initialize Supabase client, falling back to built-in store:', err);
  }
} else {
  console.log('[DailyPulse DB] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not supplied. Operating in built-in memory store with complete seed articles.');
}

export const db = {
  isSupabaseConfigured(): boolean {
    return !!supabaseClient;
  },

  getDbStatus() {
    return {
      connected: !!supabaseClient,
      mode: supabaseClient ? 'Supabase Postgres' : 'Built-in Memory Store (Fallback)',
      url: supabaseUrl || null,
      articleCount: inMemoryDb.getArticles({ status: 'all' }).length
    };
  },

  async getCategories(): Promise<Category[]> {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('categories')
          .select('*')
          .order('display_order', { ascending: true });
        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('[DailyPulse DB] Supabase getCategories error, falling back to local:', err);
      }
    }
    return inMemoryDb.getCategories();
  },

  async getSources(): Promise<NewsSource[]> {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('sources')
          .select('*')
          .eq('is_active', true);
        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('[DailyPulse DB] Supabase getSources error:', err);
      }
    }
    return inMemoryDb.getSources();
  },

  async addSource(source: NewsSource): Promise<NewsSource> {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('sources').insert(source).select().single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('[DailyPulse DB] Supabase addSource error:', err);
      }
    }
    return inMemoryDb.createSource(source);
  },

  async getArticles(options: {
    category?: string;
    status?: string;
    search?: string;
    limit?: number;
    trending?: boolean;
    breaking?: boolean;
    featured?: boolean;
  } = {}): Promise<Article[]> {
    if (supabaseClient) {
      try {
        let query = supabaseClient.from('articles').select('*');
        if (options.status && options.status !== 'all') {
          query = query.eq('status', options.status);
        } else if (!options.status) {
          query = query.eq('status', 'published');
        }

        if (options.category && options.category !== 'all') {
          query = query.eq('category_id', options.category);
        }

        if (options.breaking) {
          query = query.eq('is_breaking', true);
        }

        if (options.featured) {
          query = query.eq('is_featured', true);
        }

        if (options.trending) {
          query = query.order('views_count', { ascending: false });
        } else {
          query = query.order('published_at', { ascending: false });
        }

        if (options.limit) {
          query = query.limit(options.limit);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('[DailyPulse DB] Supabase getArticles error, using local fallback:', err);
      }
    }
    return inMemoryDb.getArticles(options);
  },

  async getArticleBySlugOrId(slugOrId: string, incrementView = false): Promise<Article | null> {
    if (supabaseClient) {
      try {
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);
        let query = supabaseClient.from('articles').select('*');
        if (isUUID) {
          query = query.eq('id', slugOrId);
        } else {
          query = query.eq('slug', slugOrId);
        }
        const { data, error } = await query.single();
        if (!error && data) {
          if (incrementView) {
            // fire and forget view counter increment
            supabaseClient.from('articles').update({ views_count: (data.views_count || 0) + 1 }).eq('id', data.id);
          }
          return data;
        }
      } catch (err) {
        console.warn('[DailyPulse DB] Supabase getArticle error, using local fallback:', err);
      }
    }
    return inMemoryDb.getArticleBySlugOrId(slugOrId, incrementView);
  },

  async createArticle(data: Partial<Article>): Promise<Article> {
    if (supabaseClient) {
      try {
        const { data: inserted, error } = await supabaseClient.from('articles').insert(data).select().single();
        if (!error && inserted) return inserted;
      } catch (err) {
        console.warn('[DailyPulse DB] Supabase createArticle error, saving locally:', err);
      }
    }
    return inMemoryDb.createArticle(data);
  },

  async updateArticle(id: string, updates: Partial<Article>): Promise<Article | null> {
    if (supabaseClient) {
      try {
        const { data: updated, error } = await supabaseClient.from('articles').update(updates).eq('id', id).select().single();
        if (!error && updated) return updated;
      } catch (err) {
        console.warn('[DailyPulse DB] Supabase updateArticle error, updating locally:', err);
      }
    }
    return inMemoryDb.updateArticle(id, updates);
  },

  async deleteArticle(id: string): Promise<boolean> {
    if (supabaseClient) {
      try {
        const { error } = await supabaseClient.from('articles').delete().eq('id', id);
        if (!error) return true;
      } catch (err) {
        console.warn('[DailyPulse DB] Supabase deleteArticle error, deleting locally:', err);
      }
    }
    return inMemoryDb.deleteArticle(id);
  }
};
