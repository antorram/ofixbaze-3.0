import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Upload, 
  Image as ImageIcon, 
  ShieldCheck, 
  Sparkles, 
  Star, 
  Flame,
  Globe,
  Search,
  Monitor,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  Tag,
  FileText
} from 'lucide-react';
import { Product } from '../../types';
import { CATEGORIES } from '../../data/categories';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
  onSave: (product: Product) => void;
}

const PRESET_IMAGES = [
  { name: 'Ergonomic Swivel Chair', url: 'https://ofixbaze.com/wp-content/uploads/2026/04/ergoonomic-chair.png' },
  { name: 'HP 05A Toner', url: 'https://ofixbaze.com/wp-content/uploads/2020/04/05a.jpg' },
  { name: 'HP 85A Toner', url: 'https://ofixbaze.com/wp-content/uploads/2020/04/85a.jpg' },
  { name: 'HP LaserJet 4103fdw', url: 'https://ofixbaze.com/wp-content/uploads/2020/04/hp-4103fdw.jpg' },
  { name: 'Baze 920 Money Counter', url: 'https://ofixbaze.com/wp-content/uploads/2020/04/baze-920-money-counting-machine.jpg' },
  { name: 'Executive Visitor Chair', url: 'https://ofixbaze.com/wp-content/uploads/2026/04/ergonomic-chair.jpg' }
];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'media' | 'specs' | 'seo'>('details');
  const [serpPreviewMode, setSerpPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    brand: 'Ofixbaze',
    category: 'furniture-safes',
    subCategory: '',
    priceNGN: 150000,
    originalPriceNGN: 180000,
    rating: 4.8,
    reviewsCount: 12,
    inStock: true,
    stockCount: 15,
    isOriginalOEM: true,
    isFeatured: true,
    isHotDeal: false,
    image: PRESET_IMAGES[0].url,
    gallery: [PRESET_IMAGES[0].url],
    shortDescription: '',
    description: '',
    features: ['High durability commercial grade construction', '100% Genuine Certified Origin', 'Direct Manufacturer Warranty'],
    specs: {
      'Brand': 'Ofixbaze',
      'Condition': '100% Brand New',
      'Warranty': '2 Years Warranty'
    },
    sku: `OFX-${Math.floor(1000 + Math.random() * 9000)}`,
    warranty: '2 Years Corporate Warranty',
    // SEO fields
    metaTitle: '',
    metaDescription: '',
    focusKeywords: '',
    slug: '',
    canonicalUrl: '',
    robotsDirective: 'index, follow'
  });

  const [featuresText, setFeaturesText] = useState('');

  useEffect(() => {
    if (productToEdit) {
      const generatedSlug = (productToEdit.name || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      setFormData({
        ...productToEdit,
        metaTitle: productToEdit.metaTitle || `${productToEdit.name} | Original ${productToEdit.brand} Nigeria`,
        metaDescription: productToEdit.metaDescription || productToEdit.shortDescription || `Buy authentic ${productToEdit.name} in Lagos Nigeria from Ofixbaze. 100% genuine with official warranty.`,
        focusKeywords: productToEdit.focusKeywords || `${productToEdit.name.toLowerCase()}, buy ${productToEdit.brand.toLowerCase()} Lagos, genuine toner Nigeria`,
        slug: productToEdit.slug || generatedSlug,
        canonicalUrl: productToEdit.canonicalUrl || `https://ofixbaze.com/product/${generatedSlug}`,
        robotsDirective: productToEdit.robotsDirective || 'index, follow'
      });
      setFeaturesText(productToEdit.features ? productToEdit.features.join('\n') : '');
    } else {
      const newSku = `OFX-${Math.floor(1000 + Math.random() * 9000)}`;
      setFormData({
        id: `custom-prod-${Date.now()}`,
        name: '',
        brand: 'Ofixbaze',
        category: 'furniture-safes',
        subCategory: 'Executive Seating',
        priceNGN: 125000,
        originalPriceNGN: 145000,
        rating: 4.9,
        reviewsCount: 8,
        inStock: true,
        stockCount: 10,
        isOriginalOEM: true,
        isFeatured: true,
        isHotDeal: false,
        image: PRESET_IMAGES[0].url,
        gallery: [PRESET_IMAGES[0].url],
        shortDescription: 'High quality genuine product from Ofixbaze Nigeria Limited with corporate warranty.',
        description: 'Premium quality office equipment and executive supplies built for commercial durability, certified genuine and backed by full technical support across Nigeria.',
        features: [
          'High durability commercial grade construction',
          'Certified genuine with verification seal',
          'Direct nationwide delivery support'
        ],
        specs: {
          'Brand': 'Ofixbaze',
          'Condition': '100% Brand New Factory Sealed',
          'Warranty': '2 Years Replacement Guarantee'
        },
        sku: newSku,
        warranty: '2 Years Warranty',
        metaTitle: '',
        metaDescription: '',
        focusKeywords: '',
        slug: '',
        canonicalUrl: '',
        robotsDirective: 'index, follow'
      });
      setFeaturesText('High durability commercial grade construction\nCertified genuine with verification seal\nDirect nationwide delivery support');
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  // Auto-Generate Product SEO
  const handleAutoGenerateSEO = () => {
    const name = formData.name?.trim() || 'Genuine Commercial Office Product';
    const brand = formData.brand?.trim() || 'Ofixbaze';
    const cat = CATEGORIES.find(c => c.slug === formData.category)?.name || 'Office Supplies';
    
    // Slug
    const cleanSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Optimal 50-60 character title
    let titleCandidate = `${name} | Original ${brand} Nigeria`;
    if (titleCandidate.length > 60) {
      titleCandidate = `${name.slice(0, 48)} | Ofixbaze`;
    }

    // Optimal 140-160 character description
    const descCandidate = `Buy authentic ${name} from Ofixbaze Nigeria. 100% genuine ${brand} certified origin with 2-year warranty & rapid nationwide delivery in Lagos.`;

    const keywordsCandidate = `${name.toLowerCase()}, buy ${name.toLowerCase()} Lagos, genuine ${brand.toLowerCase()} Nigeria, ${cat.toLowerCase()} procurement, corporate office supply Lagos`;

    setFormData(prev => ({
      ...prev,
      metaTitle: titleCandidate,
      metaDescription: descCandidate.slice(0, 160),
      focusKeywords: keywordsCandidate,
      slug: cleanSlug,
      canonicalUrl: `https://ofixbaze.com/product/${cleanSlug}`,
      robotsDirective: 'index, follow'
    }));
  };

  // Compute Live SEO Score (0 - 100)
  const computeSeoScore = () => {
    let score = 0;
    const title = formData.metaTitle || '';
    const desc = formData.metaDescription || '';
    const kw = (formData.focusKeywords || '').toLowerCase();
    const primaryKw = kw.split(',')[0]?.trim().toLowerCase();
    const slug = (formData.slug || '').toLowerCase();

    // 1. Meta Title length (25 pts)
    if (title.length >= 40 && title.length <= 60) score += 25;
    else if (title.length > 20 && title.length <= 75) score += 15;

    // 2. Meta Description length (25 pts)
    if (desc.length >= 120 && desc.length <= 160) score += 25;
    else if (desc.length >= 60 && desc.length <= 200) score += 15;

    // 3. Focus keyword presence (15 pts)
    if (kw.length > 3) score += 15;

    // 4. Keyword in title (15 pts)
    if (primaryKw && title.toLowerCase().includes(primaryKw)) score += 15;

    // 5. Keyword in slug or clean slug (10 pts)
    if (slug.length >= 3 && !slug.includes(' ')) score += 10;

    // 6. Image set (10 pts)
    if (formData.image) score += 10;

    return Math.min(score, 100);
  };

  const seoScore = computeSeoScore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    const parsedFeatures = featuresText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const generatedSlug = (formData.name || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const finalizedProduct: Product = {
      id: productToEdit ? productToEdit.id : (formData.id || `custom-prod-${Date.now()}`),
      name: formData.name || 'Untitled Product',
      brand: formData.brand || 'Ofixbaze',
      category: formData.category || 'furniture-safes',
      subCategory: formData.subCategory || '',
      priceNGN: Number(formData.priceNGN) || 50000,
      originalPriceNGN: formData.originalPriceNGN ? Number(formData.originalPriceNGN) : undefined,
      rating: formData.rating || 4.8,
      reviewsCount: formData.reviewsCount || 10,
      inStock: Boolean(formData.inStock),
      stockCount: Number(formData.stockCount) || 0,
      isOriginalOEM: Boolean(formData.isOriginalOEM),
      isFeatured: Boolean(formData.isFeatured),
      isHotDeal: Boolean(formData.isHotDeal),
      badge: formData.isFeatured ? 'Featured' : undefined,
      image: formData.image || PRESET_IMAGES[0].url,
      gallery: formData.gallery && formData.gallery.length > 0 ? formData.gallery : [formData.image || PRESET_IMAGES[0].url],
      shortDescription: formData.shortDescription || 'Authentic certified office equipment from Ofixbaze Nigeria Limited.',
      description: formData.description || 'Premium commercial grade office supply with full warranty.',
      features: parsedFeatures.length > 0 ? parsedFeatures : ['Genuine OEM build', 'Corporate warranty'],
      specs: formData.specs || { 'Brand': formData.brand || 'Ofixbaze' },
      sku: formData.sku || `SKU-${Date.now()}`,
      warranty: formData.warranty || '2 Years Warranty',
      // SEO
      metaTitle: formData.metaTitle || `${formData.name} | Original ${formData.brand} Nigeria`,
      metaDescription: formData.metaDescription || formData.shortDescription || `Buy authentic ${formData.name} from Ofixbaze Nigeria with official warranty.`,
      focusKeywords: formData.focusKeywords || `${formData.name?.toLowerCase()}, buy in Lagos, original warranty`,
      slug: formData.slug || generatedSlug,
      canonicalUrl: formData.canonicalUrl || `https://ofixbaze.com/product/${formData.slug || generatedSlug}`,
      robotsDirective: formData.robotsDirective || 'index, follow',
      ogImage: formData.image
    };

    onSave(finalizedProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900">
                {productToEdit ? 'Edit Product Details' : 'Add New Product to Catalog'}
              </h3>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                seoScore >= 80 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                  : seoScore >= 50 
                  ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}>
                <Search className="w-3 h-3" />
                SEO: {seoScore}%
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {productToEdit ? `Updating ${productToEdit.sku}` : 'Fill in product info, media, and search engine optimization'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-6 border-b border-slate-200 bg-white gap-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'details'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>General & Pricing</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('media')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'media'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Images & Media</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'specs'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Descriptions & Specs</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('seo')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'seo'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>Search Engine Optimization (SEO)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-blue-100 text-blue-700">
              {seoScore}%
            </span>
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* TAB 1: GENERAL & PRICING */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Product Identification</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => {
                      const newName = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        name: newName,
                        // auto populate slug if empty
                        slug: prev.slug || newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                      }));
                    }}
                    placeholder="e.g. Ergonomics Soft Leather Swivel Chair"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Sub-Category / Type</label>
                  <input
                    type="text"
                    value={formData.subCategory || ''}
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                    placeholder="e.g. Executive CEO Chairs, Laser Toners"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.brand || ''}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. Ofixbaze, HP, Canon, Comix"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Stock Keeping Unit (SKU) *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku || ''}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="e.g. OFX-7821"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-mono"
                  />
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Pricing & Inventory</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Price in NGN (₦) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.priceNGN || ''}
                      onChange={(e) => setFormData({ ...formData, priceNGN: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Original / Strike Price (₦)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.originalPriceNGN || ''}
                      onChange={(e) => setFormData({ ...formData, originalPriceNGN: e.target.value ? Number(e.target.value) : undefined })}
                      placeholder="Optional discount anchor"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Stock Quantity *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.stockCount || 0}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        stockCount: Number(e.target.value),
                        inStock: Number(e.target.value) > 0 
                      })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-mono"
                    />
                  </div>
                </div>

                {/* Badges & Toggles */}
                <div className="flex flex-wrap gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.inStock)}
                      onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                      className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                    />
                    <span className="font-semibold text-slate-800">In Stock Available</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.isOriginalOEM)}
                      onChange={(e) => setFormData({ ...formData, isOriginalOEM: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      100% Genuine OEM Certified
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.isFeatured)}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                    />
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500" />
                      Featured Product
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.isHotDeal)}
                      onChange={(e) => setFormData({ ...formData, isHotDeal: e.target.checked })}
                      className="w-4 h-4 rounded text-rose-500 focus:ring-rose-400"
                    />
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-rose-500" />
                      Hot Deal
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: IMAGES & MEDIA */}
          {activeTab === 'media' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Product Visuals & Media</h4>
                  <p className="text-[11px] text-slate-500">Upload high resolution product imagery for crisp customer viewing and Google Image SEO.</p>
                </div>
                
                <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold border border-orange-200 cursor-pointer transition shadow-xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload from Computer / Device</span>
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
                            setFormData(prev => ({
                              ...prev,
                              image: result,
                              gallery: [result, ...(prev.gallery || []).filter(img => img !== result)]
                            }));
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="w-24 h-24 rounded-xl border border-slate-200 bg-white p-1 shrink-0 overflow-hidden flex items-center justify-center shadow-xs">
                  <img
                    src={formData.image || PRESET_IMAGES[0].url}
                    alt={formData.name || 'Product preview'}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = PRESET_IMAGES[0].url;
                    }}
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <label className="block text-slate-700 font-semibold">Primary Image URL / Uploaded Data</label>
                  <input
                    type="text"
                    value={formData.image || ''}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value, gallery: [e.target.value] })}
                    placeholder="https://... or choose image file above"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-xs font-mono"
                  />

                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    <span className="text-[11px] text-slate-400">Quick presets:</span>
                    {PRESET_IMAGES.map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setFormData({ ...formData, image: preset.url, gallery: [preset.url] })}
                        className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-medium transition cursor-pointer"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DESCRIPTIONS & SPECS */}
          {activeTab === 'specs' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Descriptions & Bullet Points</h4>
              
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Short Description (Catalog Summary)</label>
                <textarea
                  rows={2}
                  value={formData.shortDescription || ''}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Brief 1-2 sentence highlight for search results and previews..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Detailed Overview</label>
                <textarea
                  rows={4}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Comprehensive technical details, manufacturing certifications, application guidelines..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Key Features (One per line)</label>
                <textarea
                  rows={3}
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  placeholder="High durability commercial grade construction&#10;Genuine certified origin&#10;2 Years Warranty"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Corporate Warranty Duration</label>
                <input
                  type="text"
                  value={formData.warranty || '2 Years Warranty'}
                  onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
            </div>
          )}

          {/* TAB 4: SEARCH ENGINE OPTIMIZATION (SEO) */}
          {activeTab === 'seo' && (
            <div className="space-y-5">
              {/* Header with 1-click Auto-Generator */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <h4 className="text-xs font-bold text-slate-900">Search Engine Optimization (SEO) Tool</h4>
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-md">
                      Smart Assistant
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Customize how this product ranks and displays in Google Search results and social media shares.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAutoGenerateSEO}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>1-Click Auto-Generate SEO</span>
                </button>
              </div>

              {/* Google SERP Live Preview */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-blue-600" />
                    Google Search Result Preview
                  </span>
                  
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setSerpPreviewMode('desktop')}
                      className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition cursor-pointer ${
                        serpPreviewMode === 'desktop' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
                      }`}
                    >
                      <Monitor className="w-3 h-3" />
                      Desktop
                    </button>
                    <button
                      type="button"
                      onClick={() => setSerpPreviewMode('mobile')}
                      className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition cursor-pointer ${
                        serpPreviewMode === 'mobile' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
                      }`}
                    >
                      <Smartphone className="w-3 h-3" />
                      Mobile
                    </button>
                  </div>
                </div>

                {/* Google Card Simulation */}
                <div className={`p-4 rounded-xl border border-slate-200 bg-white font-sans ${
                  serpPreviewMode === 'mobile' ? 'max-w-md mx-auto shadow-sm' : 'w-full'
                }`}>
                  <div className="flex items-center gap-2 mb-1 text-[11px] text-[#202124]">
                    <div className="w-4 h-4 rounded-full bg-orange-600 text-white flex items-center justify-center text-[9px] font-black">
                      O
                    </div>
                    <div className="flex items-center gap-1 text-[#202124] text-[12px] truncate">
                      <span className="font-medium">Ofixbaze Nigeria</span>
                      <span className="text-slate-400">› product › {formData.slug || 'product-slug'}</span>
                    </div>
                  </div>

                  <h3 className="text-[#1a0dab] hover:underline text-[16px] leading-snug font-medium cursor-pointer break-words">
                    {formData.metaTitle || `${formData.name || 'Product Title'} | Original ${formData.brand || 'Ofixbaze'} Nigeria`}
                  </h3>

                  {/* Rich Snippets / Stars & Price */}
                  <div className="flex items-center gap-2 text-[12px] text-[#4d5156] my-1 flex-wrap">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    <span>Rating: 4.9 · 12 reviews</span>
                    <span>·</span>
                    <span className="font-semibold text-orange-600">
                      Price on Request
                    </span>
                    <span>·</span>
                    <span className="text-emerald-700 font-medium">In stock</span>
                  </div>

                  <p className="text-[#4d5156] text-[13px] leading-relaxed break-words">
                    {formData.metaDescription || formData.shortDescription || 'Shop certified authentic office supplies and technology from Ofixbaze Nigeria. Official corporate warranty and express nationwide delivery.'}
                  </p>
                </div>
              </div>

              {/* SEO Score & Health Audit Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    SEO Health Checklist
                  </span>
                  
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Meta Title Length (50-60 chars):</span>
                      <span className={`font-bold ${
                        (formData.metaTitle?.length || 0) >= 40 && (formData.metaTitle?.length || 0) <= 60
                          ? 'text-emerald-600'
                          : 'text-amber-600'
                      }`}>
                        {formData.metaTitle?.length || 0}/60 chars
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Meta Description (120-160 chars):</span>
                      <span className={`font-bold ${
                        (formData.metaDescription?.length || 0) >= 120 && (formData.metaDescription?.length || 0) <= 160
                          ? 'text-emerald-600'
                          : 'text-amber-600'
                      }`}>
                        {formData.metaDescription?.length || 0}/160 chars
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Focus Keyword Specified:</span>
                      <span className={`font-bold ${formData.focusKeywords ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {formData.focusKeywords ? 'Configured' : 'Missing'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Search Engine Index Directive:</span>
                      <span className="font-bold text-emerald-600">index, follow</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    Structured Data (Schema.org)
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Automatically outputs Google Rich Results <code className="text-blue-700 bg-blue-50 px-1 py-0.2 rounded font-mono">Product</code> JSON-LD schema with SKU, inStock, and currency (NGN).
                  </p>
                  <div className="bg-slate-900 text-slate-300 p-2 rounded-lg font-mono text-[10px] overflow-x-auto">
                    {`{"@type": "Product", "name": "${(formData.name || 'Product').slice(0, 25)}...", "offers": {"price": ${formData.priceNGN || 0}, "priceCurrency": "NGN"}}`}
                  </div>
                </div>
              </div>

              {/* SEO Inputs */}
              <div className="space-y-3 pt-2">
                {/* Meta Title */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 font-semibold">
                      SEO Meta Title (Shown in Google Header)
                    </label>
                    <span className={`text-[10px] font-bold ${
                      (formData.metaTitle?.length || 0) > 60 ? 'text-rose-600' : 'text-slate-400'
                    }`}>
                      {formData.metaTitle?.length || 0} / 60 recommended
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formData.metaTitle || ''}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    placeholder="e.g. Original HP 05A Black Toner Cartridge | Ofixbaze Lagos Nigeria"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  />
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        (formData.metaTitle?.length || 0) > 60 
                          ? 'bg-rose-500' 
                          : (formData.metaTitle?.length || 0) >= 40 
                          ? 'bg-emerald-500' 
                          : 'bg-amber-400'
                      }`}
                      style={{ width: `${Math.min(((formData.metaTitle?.length || 0) / 60) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Meta Description */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 font-semibold">
                      SEO Meta Description (Google Snippet Paragraph)
                    </label>
                    <span className={`text-[10px] font-bold ${
                      (formData.metaDescription?.length || 0) > 160 ? 'text-rose-600' : 'text-slate-400'
                    }`}>
                      {formData.metaDescription?.length || 0} / 160 recommended
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={formData.metaDescription || ''}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    placeholder="Provide a compelling 140-160 character description including genuine guarantee, Lagos delivery, and corporate warranty..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs"
                  />
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        (formData.metaDescription?.length || 0) > 160 
                          ? 'bg-rose-500' 
                          : (formData.metaDescription?.length || 0) >= 120 
                          ? 'bg-emerald-500' 
                          : 'bg-amber-400'
                      }`}
                      style={{ width: `${Math.min(((formData.metaDescription?.length || 0) / 160) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Focus Keywords */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Focus Target Keywords (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.focusKeywords || ''}
                    onChange={(e) => setFormData({ ...formData, focusKeywords: e.target.value })}
                    placeholder="e.g. hp 05a toner lagos, original ce505a, buy laserjet cartridge nigeria"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-xs"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Used to rank on high-intent search queries and e-commerce product search bars.
                  </p>
                </div>

                {/* URL Slug & Canonical URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      URL Slug (Permalinks)
                    </label>
                    <div className="flex items-center">
                      <span className="px-2.5 py-2 bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl text-slate-500 text-[11px] font-mono">
                        /product/
                      </span>
                      <input
                        type="text"
                        value={formData.slug || ''}
                        onChange={(e) => {
                          const clean = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-');
                          setFormData({ 
                            ...formData, 
                            slug: clean,
                            canonicalUrl: `https://ofixbaze.com/product/${clean}` 
                          });
                        }}
                        placeholder="hp-05a-laserjet-toner"
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-r-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Robots Directives (Indexing)
                    </label>
                    <select
                      value={formData.robotsDirective || 'index, follow'}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        robotsDirective: e.target.value as 'index, follow' | 'noindex, nofollow' 
                      })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                    >
                      <option value="index, follow">index, follow (Default - Allow Google to index)</option>
                      <option value="noindex, nofollow">noindex, nofollow (Hide from Search Engines)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-[11px] text-slate-500">
              {activeTab === 'seo' ? (
                <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  SEO tags will automatically be updated in catalog
                </span>
              ) : (
                <span>All tabs are saved simultaneously on save</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold flex items-center gap-1.5 shadow-md shadow-orange-600/20 transition cursor-pointer active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>{productToEdit ? 'Save Changes' : 'Publish Product'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
