import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Share2, 
  Code2, 
  Settings2, 
  Upload, 
  Monitor, 
  Smartphone, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  RefreshCw, 
  HelpCircle,
  BarChart3,
  Layers,
  ArrowRight,
  ShieldCheck,
  Tag,
  Eye
} from 'lucide-react';
import { SiteSEOConfig, PageSEOItem, Product, Category } from '../../types';

interface AdminSEOTabProps {
  seoConfig: SiteSEOConfig;
  onUpdateSEOConfig: (newConfig: SiteSEOConfig) => void;
  products: Product[];
  onUpdateProduct: (product: Product) => void;
  categories: Category[];
}

export const AdminSEOTab: React.FC<AdminSEOTabProps> = ({
  seoConfig,
  onUpdateSEOConfig,
  products,
  onUpdateProduct,
  categories
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'pages' | 'products' | 'sitemap' | 'webmaster'>('pages');
  const [selectedPageId, setSelectedPageId] = useState<string>('home');
  const [serpDevice, setSerpDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [productFilter, setProductFilter] = useState<'all' | 'needs-seo' | 'optimized'>('all');
  const [productSearch, setProductSearch] = useState('');

  // Local draft state for site SEO config
  const [draftConfig, setDraftConfig] = useState<SiteSEOConfig>(seoConfig);

  const selectedPage: PageSEOItem = draftConfig.pages[selectedPageId] || {
    pageId: selectedPageId,
    pageName: 'Page',
    urlPath: '/',
    metaTitle: draftConfig.siteTitle,
    metaDescription: draftConfig.defaultMetaDescription,
    focusKeywords: draftConfig.defaultKeywords,
    canonicalUrl: `${draftConfig.canonicalDomain}/${selectedPageId === 'home' ? '' : selectedPageId}`,
    robotsDirective: 'index, follow'
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleCopy = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Save all changes
  const handleSaveAll = () => {
    onUpdateSEOConfig(draftConfig);
    showToast('SEO settings and metadata successfully saved!');
  };

  // Page SEO update handler
  const handleUpdateCurrentPage = (updates: Partial<PageSEOItem>) => {
    setDraftConfig(prev => ({
      ...prev,
      pages: {
        ...prev.pages,
        [selectedPageId]: {
          ...prev.pages[selectedPageId],
          ...updates,
          lastUpdated: new Date().toISOString().split('T')[0]
        }
      }
    }));
  };

  // 1-Click Page SEO Generator
  const handleAutoGeneratePageSEO = () => {
    let title = '';
    let desc = '';
    let keywords = '';

    switch (selectedPageId) {
      case 'home':
        title = 'Ofixbaze Nigeria | Genuine HP Toner, Office Printers & Luxury Furniture Lagos';
        desc = 'Shop authorized commercial office technology in Nigeria. Factory-sealed HP toner cartridges, high-capacity shredders, currency counters, and ergonomic seating.';
        keywords = 'HP toner Lagos, office furniture Nigeria, currency counting machines, Comix paper shredders, genuine office supplies';
        break;
      case 'shop':
        title = 'Buy Commercial Office Equipment & Genuine Supplies | Ofixbaze Nigeria';
        desc = 'Explore our complete catalog of certified office machines, printer cartridges, cash counters, and executive desk sets with official warranties and fast delivery.';
        keywords = 'buy office supplies Nigeria, genuine toners, office desks Lagos, money counters Ikeja, wholesale stationery';
        break;
      case 'rfq':
        title = 'Request Corporate Proforma Invoice & RFQ Tenders | Ofixbaze Nigeria';
        desc = 'Submit corporate procurement tenders and get guaranteed proforma invoices with verified OEM certificates within 2 business hours across Nigeria.';
        keywords = 'corporate procurement Lagos, RFQ Nigeria, office supplies tender, proforma invoice, bulk toner supply';
        break;
      case 'about':
        title = 'About Ofixbaze Nigeria Limited | Official Corporate Procurement Partners';
        desc = 'Learn about Ofixbaze Nigeria Limited, headquartered in Lagos, supplying commercial banks, multinational enterprises, and government agencies since 2018.';
        keywords = 'about Ofixbaze, office technology company Lagos, OEM distributor Nigeria, commercial office supplies';
        break;
      case 'contact':
        title = 'Contact Ofixbaze Lagos Showroom & Technical Service Center';
        desc = 'Reach our corporate sales team at 14 Broad Street Marina Lagos Island and Ikeja Service Hub. Call +234 803 555 9821 for express delivery.';
        keywords = 'Ofixbaze contact, Lagos office showroom, Marina Lagos Island office supplies, toner repair Lagos';
        break;
      case 'track-order':
        title = 'Track Nationwide Corporate Order Delivery Status | Ofixbaze Nigeria';
        desc = 'Real-time consignment tracking for all corporate orders and dispatch vans operating across Lagos, Abuja, Port Harcourt, and all 36 states.';
        keywords = 'track Ofixbaze order, delivery tracking Nigeria, logistics dispatch status, corporate invoice tracker';
        break;
      default:
        title = `${selectedPage.pageName} | Ofixbaze Nigeria Limited`;
        desc = `Official ${selectedPage.pageName} information from Ofixbaze Nigeria. Genuine office equipment, toners, and executive furniture.`;
        keywords = `${selectedPage.pageName.toLowerCase()}, office equipment nigeria, lagos corporate procurement`;
    }

    handleUpdateCurrentPage({
      metaTitle: title,
      metaDescription: desc,
      focusKeywords: keywords,
      canonicalUrl: `${draftConfig.canonicalDomain}${selectedPage.urlPath}`
    });

    showToast(`Generated optimal SEO tags for ${selectedPage.pageName}`);
  };

  // Bulk Auto-Optimize All Products
  const handleAutoOptimizeAllProducts = () => {
    let count = 0;
    products.forEach(p => {
      const generatedSlug = (p.name || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      let titleCandidate = `${p.name} | Original ${p.brand} Nigeria`;
      if (titleCandidate.length > 60) {
        titleCandidate = `${p.name.slice(0, 48)} | Ofixbaze`;
      }

      const descCandidate = `Buy authentic ${p.name} from Ofixbaze Nigeria. 100% genuine ${p.brand} certified origin with 2-year warranty & rapid nationwide delivery in Lagos.`;
      const keywordsCandidate = `${p.name.toLowerCase()}, buy ${p.name.toLowerCase()} Lagos, genuine ${p.brand.toLowerCase()} Nigeria, corporate office supply Lagos`;

      const updatedProd: Product = {
        ...p,
        metaTitle: p.metaTitle || titleCandidate,
        metaDescription: p.metaDescription || descCandidate.slice(0, 160),
        focusKeywords: p.focusKeywords || keywordsCandidate,
        slug: p.slug || generatedSlug,
        canonicalUrl: p.canonicalUrl || `https://ofixbaze.com/product/${generatedSlug}`,
        robotsDirective: p.robotsDirective || 'index, follow'
      };

      onUpdateProduct(updatedProd);
      count++;
    });

    showToast(`Successfully optimized SEO metadata for all ${count} catalog products!`);
  };

  // Generate XML Sitemap
  const generateXmlSitemap = () => {
    const today = new Date().toISOString().split('T')[0];
    const pageUrls = Object.values(draftConfig.pages).map(p => `  <url>
    <loc>${draftConfig.canonicalDomain}${p.urlPath}</loc>
    <lastmod>${p.lastUpdated || today}</lastmod>
    <changefreq>${p.pageId === 'home' || p.pageId === 'shop' ? 'daily' : 'weekly'}</changefreq>
    <priority>${p.pageId === 'home' ? '1.0' : p.pageId === 'shop' ? '0.9' : '0.8'}</priority>
  </url>`).join('\n');

    const prodUrls = products.map(p => {
      const slug = p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return `  <url>
    <loc>${draftConfig.canonicalDomain}/product/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pageUrls}
${prodUrls}
</urlset>`;
  };

  const xmlSitemapContent = generateXmlSitemap();

  // Organization Schema (JSON-LD)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "OfficeEquipmentStore",
    "name": "Ofixbaze Nigeria Limited",
    "url": draftConfig.canonicalDomain,
    "logo": "https://ofixbaze.com/wp-content/uploads/2026/04/ofixbaze-logo.png",
    "description": draftConfig.defaultMetaDescription,
    "telephone": "+2348035559821",
    "email": "sales@ofixbaze.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "14 Broad Street, Marina",
      "addressLocality": "Lagos Island",
      "addressRegion": "Lagos State",
      "postalCode": "100221",
      "addressCountry": "NG"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "6.4531",
      "longitude": "3.3958"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "17:30"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "14:00"
      }
    ],
    "sameAs": [
      "https://facebook.com/ofixbaze",
      "https://twitter.com/OfixbazeNG",
      "https://linkedin.com/company/ofixbaze-nigeria"
    ]
  };

  // Compute Overall SEO Health Score
  const computeOverallScore = () => {
    let total = 0;
    const pages = Object.values(draftConfig.pages);
    
    // Pages health (40 pts)
    const validPages = pages.filter(p => p.metaTitle?.length >= 35 && p.metaDescription?.length >= 80);
    total += Math.round((validPages.length / (pages.length || 1)) * 40);

    // Products health (30 pts)
    const validProducts = products.filter(p => p.metaTitle || p.metaDescription);
    total += Math.round((validProducts.length / (products.length || 1)) * 30);

    // Verification tags (15 pts)
    if (draftConfig.googleSiteVerification) total += 8;
    if (draftConfig.ga4MeasurementId) total += 7;

    // Sitemap & Robots (15 pts)
    if (draftConfig.sitemapEnabled) total += 8;
    if (draftConfig.robotsTxtContent) total += 7;

    return Math.min(total, 100);
  };

  const overallScore = computeOverallScore();

  // Filter products for the Bulk Optimizer
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                          p.sku.toLowerCase().includes(productSearch.toLowerCase());
    if (!matchesSearch) return false;

    const isOptimized = Boolean(p.metaTitle && p.metaDescription && p.focusKeywords);
    if (productFilter === 'needs-seo') return !isOptimized;
    if (productFilter === 'optimized') return isOptimized;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2.5 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold">{notification}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Globe className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                SEO & Content Search Optimization Suite
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  Google & Bing
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Optimize meta tags, search engine ranking signals, Google Rich Snippets, XML sitemaps, and robots.txt.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* SEO Health Badge */}
          <div className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${
              overallScore >= 80 ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
            }`} />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block leading-none">SEO Health</span>
              <span className="text-xs font-black text-slate-800">{overallScore}% Score</span>
            </div>
          </div>

          <button
            onClick={handleSaveAll}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>Save All SEO Changes</span>
          </button>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('pages')}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition cursor-pointer ${
            activeSubTab === 'pages'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Content & Pages SEO</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
            {Object.keys(draftConfig.pages).length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('products')}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition cursor-pointer ${
            activeSubTab === 'products'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Product SEO Manager</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
            {products.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('sitemap')}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition cursor-pointer ${
            activeSubTab === 'sitemap'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>XML Sitemap & Robots.txt</span>
        </button>

        <button
          onClick={() => setActiveSubTab('webmaster')}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition cursor-pointer ${
            activeSubTab === 'webmaster'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>Global SEO & Webmaster</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: CONTENT & PAGES SEO */}
      {/* ========================================================================= */}
      {activeSubTab === 'pages' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Pages List */}
          <div className="lg:col-span-4 space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">
              Select Site Page to Optimize
            </h3>

            <div className="space-y-1.5">
              {Object.values(draftConfig.pages).map((p) => {
                const isSelected = p.pageId === selectedPageId;
                const isHealthy = (p.metaTitle?.length || 0) >= 35 && (p.metaDescription?.length || 0) >= 80;

                return (
                  <button
                    key={p.pageId}
                    type="button"
                    onClick={() => setSelectedPageId(p.pageId)}
                    className={`w-full text-left p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-500 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900">{p.pageName}</span>
                        <span className="text-[10px] font-mono text-slate-400">{p.urlPath}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate max-w-[220px] mt-0.5">
                        {p.metaTitle || 'No title set'}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isHealthy ? (
                        <span className="w-2 h-2 rounded-full bg-emerald-500" title="Good SEO Score" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-amber-500" title="Needs SEO tags" />
                      )}
                      <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-600' : 'text-slate-300'}`} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Tip Box */}
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-800 space-y-1 mt-4">
              <div className="flex items-center gap-1.5 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>SEO Pro Tip for Nigeria:</span>
              </div>
              <p className="leading-relaxed">
                Include target geo-keywords like "Lagos", "Ikeja", and "Nigeria" along with brand names ("HP", "Ofixbaze") to attract high-intent corporate procurement queries.
              </p>
            </div>
          </div>

          {/* Right Column: Active Page SEO Editor */}
          <div className="lg:col-span-8 space-y-5">
            {/* Action Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-3 flex-wrap shadow-xs">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>Editing: {selectedPage.pageName}</span>
                  <span className="text-[11px] font-mono font-normal text-slate-500">({selectedPage.urlPath})</span>
                </h3>
                <p className="text-[11px] text-slate-500">Live search engine result preview and ranking meta configuration.</p>
              </div>

              <button
                type="button"
                onClick={handleAutoGeneratePageSEO}
                className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 flex items-center gap-1.5 transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-Generate for This Page</span>
              </button>
            </div>

            {/* Live Google Search Preview */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-blue-600" />
                  Google Search Snippet Preview
                </span>

                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setSerpDevice('desktop')}
                    className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition cursor-pointer ${
                      serpDevice === 'desktop' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    <Monitor className="w-3 h-3" />
                    Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setSerpDevice('mobile')}
                    className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition cursor-pointer ${
                      serpDevice === 'mobile' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    <Smartphone className="w-3 h-3" />
                    Mobile
                  </button>
                </div>
              </div>

              {/* SERP Card */}
              <div className={`p-4 rounded-xl border border-slate-200 bg-white font-sans ${
                serpDevice === 'mobile' ? 'max-w-md mx-auto shadow-sm' : 'w-full'
              }`}>
                <div className="flex items-center gap-2 mb-1 text-[11px] text-[#202124]">
                  <div className="w-4 h-4 rounded-full bg-orange-600 text-white flex items-center justify-center text-[9px] font-black">
                    O
                  </div>
                  <div className="flex items-center gap-1 text-[#202124] text-[12px] truncate">
                    <span className="font-medium">Ofixbaze Nigeria</span>
                    <span className="text-slate-400">› {selectedPage.pageId}</span>
                  </div>
                </div>

                <h3 className="text-[#1a0dab] hover:underline text-[16px] leading-snug font-medium cursor-pointer break-words">
                  {selectedPage.metaTitle || 'Page Meta Title'}
                </h3>

                <p className="text-[#4d5156] text-[13px] leading-relaxed break-words mt-1">
                  {selectedPage.metaDescription || 'Page meta description paragraph displayed by Google to searchers.'}
                </p>
              </div>
            </div>

            {/* Page Meta Input Fields */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs">
              {/* Meta Title */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-800">
                    SEO Meta Title (Title Tag)
                  </label>
                  <span className={`text-[10px] font-bold ${
                    (selectedPage.metaTitle?.length || 0) > 60 ? 'text-rose-600' : 'text-slate-400'
                  }`}>
                    {selectedPage.metaTitle?.length || 0} / 60 recommended
                  </span>
                </div>
                <input
                  type="text"
                  value={selectedPage.metaTitle || ''}
                  onChange={(e) => handleUpdateCurrentPage({ metaTitle: e.target.value })}
                  placeholder="e.g. Ofixbaze Nigeria | Genuine HP Toner & Office Equipment Lagos"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-medium"
                />
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      (selectedPage.metaTitle?.length || 0) > 60
                        ? 'bg-rose-500'
                        : (selectedPage.metaTitle?.length || 0) >= 40
                        ? 'bg-emerald-500'
                        : 'bg-amber-400'
                    }`}
                    style={{ width: `${Math.min(((selectedPage.metaTitle?.length || 0) / 60) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Meta Description */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-800">
                    SEO Meta Description
                  </label>
                  <span className={`text-[10px] font-bold ${
                    (selectedPage.metaDescription?.length || 0) > 160 ? 'text-rose-600' : 'text-slate-400'
                  }`}>
                    {selectedPage.metaDescription?.length || 0} / 160 recommended
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={selectedPage.metaDescription || ''}
                  onChange={(e) => handleUpdateCurrentPage({ metaDescription: e.target.value })}
                  placeholder="Provide a compelling 140-160 character description including genuine guarantee, Lagos delivery, and corporate warranty..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs"
                />
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      (selectedPage.metaDescription?.length || 0) > 160
                        ? 'bg-rose-500'
                        : (selectedPage.metaDescription?.length || 0) >= 120
                        ? 'bg-emerald-500'
                        : 'bg-amber-400'
                    }`}
                    style={{ width: `${Math.min(((selectedPage.metaDescription?.length || 0) / 160) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Focus Keywords */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Target Search Keywords (Comma-separated)
                </label>
                <input
                  type="text"
                  value={selectedPage.focusKeywords || ''}
                  onChange={(e) => handleUpdateCurrentPage({ focusKeywords: e.target.value })}
                  placeholder="e.g. HP toner Lagos, paper shredder Nigeria, money counting machine"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-mono"
                />
              </div>

              {/* Canonical URL & Robots Directive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Canonical URL Tag
                  </label>
                  <input
                    type="text"
                    value={selectedPage.canonicalUrl || ''}
                    onChange={(e) => handleUpdateCurrentPage({ canonicalUrl: e.target.value })}
                    placeholder="https://ofixbaze.com/..."
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Search Engine Indexing Directive
                  </label>
                  <select
                    value={selectedPage.robotsDirective || 'index, follow'}
                    onChange={(e) => handleUpdateCurrentPage({ 
                      robotsDirective: e.target.value as 'index, follow' | 'noindex, nofollow' 
                    })}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs bg-white"
                  >
                    <option value="index, follow">index, follow (Allow Google indexing - Recommended)</option>
                    <option value="noindex, nofollow">noindex, nofollow (Block search engines)</option>
                  </select>
                </div>
              </div>

              {/* Social OG Share Image */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                  <label className="font-bold text-slate-800">
                    Social Media Share Preview Image (og:image)
                  </label>
                  <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 text-[11px] font-bold border border-orange-200 cursor-pointer transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload from Computer</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (loadEvt) => {
                            const result = loadEvt.target?.result as string;
                            if (result) {
                              handleUpdateCurrentPage({ ogImage: result });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl border border-slate-200 bg-slate-50 p-1 shrink-0 overflow-hidden flex items-center justify-center">
                    <img
                      src={selectedPage.ogImage || draftConfig.defaultOgImage}
                      alt="OG Preview"
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => { e.currentTarget.src = draftConfig.defaultOgImage; }}
                    />
                  </div>
                  <input
                    type="text"
                    value={selectedPage.ogImage || ''}
                    onChange={(e) => handleUpdateCurrentPage({ ogImage: e.target.value })}
                    placeholder="https://... or upload from computer"
                    className="flex-1 px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: PRODUCT SEO CATALOG (BULK OPTIMIZER) */}
      {/* ========================================================================= */}
      {activeSubTab === 'products' && (
        <div className="space-y-4">
          {/* Top bulk actions toolbar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Product SEO Catalog & Bulk Optimizer</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {products.length} Products
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Audit and optimize meta titles, meta descriptions, and search slugs across your entire inventory.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAutoOptimizeAllProducts}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition cursor-pointer active:scale-95 shrink-0"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>1-Click Auto-Optimize All Products</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setProductFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  productFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({products.length})
              </button>

              <button
                type="button"
                onClick={() => setProductFilter('needs-seo')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  productFilter === 'needs-seo'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                Needs SEO ({products.filter(p => !p.metaTitle || !p.metaDescription).length})
              </button>

              <button
                type="button"
                onClick={() => setProductFilter('optimized')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  productFilter === 'optimized'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                Optimized ({products.filter(p => p.metaTitle && p.metaDescription).length})
              </button>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search products by title or SKU..."
                className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg w-full sm:w-64 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">SEO Score</th>
                    <th className="py-3 px-4">Google Meta Title</th>
                    <th className="py-3 px-4">Meta Description Snippet</th>
                    <th className="py-3 px-4">URL Slug</th>
                    <th className="py-3 px-4 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map(p => {
                    const isOptimized = Boolean(p.metaTitle && p.metaDescription);
                    const titleLen = p.metaTitle?.length || 0;
                    const descLen = p.metaDescription?.length || 0;

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg border border-slate-200 bg-white p-0.5 overflow-hidden shrink-0 flex items-center justify-center">
                              <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                            </div>
                            <div className="max-w-[200px]">
                              <span className="font-bold text-slate-900 block truncate">{p.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{p.sku} · {p.brand}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          {isOptimized ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3" />
                              Optimized
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                              <AlertTriangle className="w-3 h-3" />
                              Needs Work
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <div className="max-w-[240px]">
                            <p className="font-medium text-slate-800 truncate" title={p.metaTitle || p.name}>
                              {p.metaTitle || p.name}
                            </p>
                            <span className={`text-[10px] font-semibold ${
                              titleLen >= 40 && titleLen <= 60 ? 'text-emerald-600' : 'text-slate-400'
                            }`}>
                              {titleLen}/60 chars
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="max-w-[260px]">
                            <p className="text-slate-500 truncate" title={p.metaDescription || p.shortDescription}>
                              {p.metaDescription || p.shortDescription || 'No description set'}
                            </p>
                            <span className={`text-[10px] font-semibold ${
                              descLen >= 120 && descLen <= 160 ? 'text-emerald-600' : 'text-slate-400'
                            }`}>
                              {descLen}/160 chars
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 18)}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              // Auto optimize single product
                              const name = p.name;
                              const brand = p.brand || 'Ofixbaze';
                              const cleanSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                              let titleCandidate = `${name} | Original ${brand} Nigeria`;
                              if (titleCandidate.length > 60) titleCandidate = `${name.slice(0, 48)} | Ofixbaze`;
                              const descCandidate = `Buy authentic ${name} from Ofixbaze Nigeria. 100% genuine ${brand} certified origin with official warranty & Lagos delivery.`;
                              
                              onUpdateProduct({
                                ...p,
                                metaTitle: titleCandidate,
                                metaDescription: descCandidate.slice(0, 160),
                                focusKeywords: `${name.toLowerCase()}, buy ${name.toLowerCase()} Lagos, genuine ${brand.toLowerCase()} Nigeria`,
                                slug: cleanSlug,
                                canonicalUrl: `https://ofixbaze.com/product/${cleanSlug}`
                              });
                              showToast(`Optimized SEO for ${p.name}`);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] border border-blue-200 transition cursor-pointer"
                          >
                            Auto-Fix
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: XML SITEMAP & ROBOTS.TXT */}
      {/* ========================================================================= */}
      {activeSubTab === 'sitemap' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: XML Sitemap */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-blue-600" />
                  XML Sitemap Generator (sitemap.xml)
                </h3>
                <p className="text-[11px] text-slate-500">Live dynamic XML index submitted to Google Search Console & Bing.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(xmlSitemapContent, 'sitemap')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  {copiedField === 'sitemap' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'sitemap' ? 'Copied' : 'Copy XML'}</span>
                </button>

                <a
                  href={`data:text/xml;charset=utf-8,${encodeURIComponent(xmlSitemapContent)}`}
                  download="sitemap.xml"
                  className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 transition shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .xml</span>
                </a>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] flex items-center justify-between text-slate-600">
              <span>Sitemap URL: <strong className="font-mono text-slate-900">https://ofixbaze.com/sitemap.xml</strong></span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {Object.keys(draftConfig.pages).length + products.length} URLs indexed
              </span>
            </div>

            <div className="relative">
              <pre className="p-3.5 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[11px] h-72 overflow-y-auto leading-relaxed border border-slate-800">
                {xmlSitemapContent}
              </pre>
            </div>
          </div>

          {/* Right: Robots.txt Editor */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-orange-600" />
                  Robots.txt Configuration
                </h3>
                <p className="text-[11px] text-slate-500">Guides search engine crawlers on which areas to scan or ignore.</p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setDraftConfig(prev => ({
                      ...prev,
                      robotsTxtContent: `# Recommended E-Commerce Robots.txt\nUser-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /checkout\nDisallow: /api/\n\nSitemap: https://ofixbaze.com/sitemap.xml\n`
                    }));
                    showToast('Applied recommended E-Commerce robots.txt preset');
                  }}
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition cursor-pointer"
                >
                  Standard Preset
                </button>
              </div>
            </div>

            <textarea
              rows={11}
              value={draftConfig.robotsTxtContent}
              onChange={(e) => setDraftConfig({ ...draftConfig, robotsTxtContent: e.target.value })}
              className="w-full p-3.5 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed border border-slate-800 focus:ring-2 focus:ring-blue-500/30"
            />

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
              <span>Status: <strong className="text-emerald-700">Crawler Permitted</strong></span>
              <span className="text-slate-400">Public file location: /robots.txt</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: GLOBAL SEO & WEBMASTER */}
      {/* ========================================================================= */}
      {activeSubTab === 'webmaster' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Search Console & Analytics Verification */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-blue-600" />
              Webmaster Verification & Tracking Codes
            </h3>
            <p className="text-slate-500 text-[11px]">
              Verify ownership in Google Search Console and Bing Webmaster Tools to track impressions and click-through rates.
            </p>

            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Google Search Console Verification Tag
              </label>
              <input
                type="text"
                value={draftConfig.googleSiteVerification}
                onChange={(e) => setDraftConfig({ ...draftConfig, googleSiteVerification: e.target.value })}
                placeholder="google-site-verification=XXXXXXXXXXXXXXXXX"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-xs"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Outputs &lt;meta name="google-site-verification" content="..." /&gt; on all pages.
              </p>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Bing Webmaster Verification Code
              </label>
              <input
                type="text"
                value={draftConfig.bingVerification}
                onChange={(e) => setDraftConfig({ ...draftConfig, bingVerification: e.target.value })}
                placeholder="e.g. 74B819E72810..."
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Google Analytics 4 (GA4) Measurement ID
              </label>
              <input
                type="text"
                value={draftConfig.ga4MeasurementId}
                onChange={(e) => setDraftConfig({ ...draftConfig, ga4MeasurementId: e.target.value })}
                placeholder="G-OFX889124NG"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Meta / Facebook Pixel ID
              </label>
              <input
                type="text"
                value={draftConfig.facebookPixelId}
                onChange={(e) => setDraftConfig({ ...draftConfig, facebookPixelId: e.target.value })}
                placeholder="e.g. 782910482910"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-xs"
              />
            </div>
          </div>

          {/* Structured Data (Schema.org) LocalBusiness Generator */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-emerald-600" />
                  LocalBusiness JSON-LD Schema
                </h3>
                <p className="text-[11px] text-slate-500">Google Knowledge Graph markup for Lagos office equipment showroom.</p>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(JSON.stringify(organizationSchema, null, 2), 'schema')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
              >
                {copiedField === 'schema' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedField === 'schema' ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>

            <pre className="p-3.5 rounded-xl bg-slate-950 text-blue-400 font-mono text-[11px] h-80 overflow-y-auto leading-relaxed border border-slate-800">
              {JSON.stringify(organizationSchema, null, 2)}
            </pre>

            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Valid Schema.org compliant structured data with Marina Lagos geo-coordinates.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
