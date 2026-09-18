import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  ExternalLink, 
  FolderPlus, 
  Layers, 
  RotateCcw, 
  AlertTriangle,
  Sparkles,
  Tag,
  ShoppingBag,
  Grid,
  Image as ImageIcon,
  Upload
} from 'lucide-react';
import { Category, Product, ActivePage } from '../../types';
import { isProductInCategory } from '../../utils/categoryMatcher';

interface AdminCategoriesTabProps {
  categories: Category[];
  products: Product[];
  onAddCategory: (category: Category) => void;
  onUpdateCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
  onResetDefaultCategories: () => void;
  setActivePage: (page: ActivePage) => void;
  onSelectCategory: (slug: string) => void;
}

const PRESET_CATEGORY_IMAGES = [
  { name: 'Executive Chair', url: 'https://ofixbaze.com/wp-content/uploads/2026/04/ergoonomic-chair.png' },
  { name: 'Toners & Inks', url: 'https://ofixbaze.com/wp-content/uploads/2020/04/05a.jpg' },
  { name: 'Office Machines', url: 'https://ofixbaze.com/wp-content/uploads/2020/04/baze-920-money-counting-machine.jpg' },
  { name: 'Printers & Copiers', url: 'https://ofixbaze.com/wp-content/uploads/2020/04/hp-4103fdw.jpg' },
  { name: 'Ergonomic Desk', url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80' },
  { name: 'Corporate Safe', url: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80' },
  { name: 'Paper & Stationery', url: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80' },
  { name: 'Electronics & Audio', url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80' }
];

const PRESET_CATEGORY_BANNERS = [
  { name: 'Printers & MFP Banner', url: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=1920&q=80' },
  { name: 'Toners & Inks Banner', url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=1920&q=80' },
  { name: 'Modern Tech Workspace', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80' },
  { name: 'Executive Chairs & Seating', url: 'https://images.unsplash.com/photo-1580481077195-c328ad0c4600?auto=format&fit=crop&w=1920&q=80' },
  { name: 'Paper & Office Stationery', url: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=1920&q=80' },
  { name: 'Power & Office Hardware', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1920&q=80' }
];

export const AdminCategoriesTab: React.FC<AdminCategoriesTabProps> = ({
  categories,
  products,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onResetDefaultCategories,
  setActivePage,
  onSelectCategory
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(PRESET_CATEGORY_IMAGES[0].url);
  const [iconName, setIconName] = useState('LayoutGrid');
  const [subcategoriesInput, setSubcategoriesInput] = useState('');

  // Category Header Banner states
  const [bannerImage, setBannerImage] = useState('');
  const [showBannerImageOnly, setShowBannerImageOnly] = useState(false);
  const [bannerHeight, setBannerHeight] = useState<'compact' | 'medium' | 'large'>('medium');
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');

  const openAddModal = () => {
    setCategoryToEdit(null);
    setName('');
    setSlug('');
    setDescription('');
    setImage(PRESET_CATEGORY_IMAGES[0].url);
    setIconName('LayoutGrid');
    setSubcategoriesInput('');
    setBannerImage('');
    setShowBannerImageOnly(false);
    setBannerHeight('medium');
    setBannerTitle('');
    setBannerSubtitle('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setCategoryToEdit(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setImage(cat.image);
    setIconName(cat.iconName || 'LayoutGrid');
    setSubcategoriesInput(cat.subcategories ? cat.subcategories.join(', ') : '');
    setBannerImage(cat.bannerImage || '');
    setShowBannerImageOnly(cat.showBannerImageOnly || false);
    setBannerHeight(cat.bannerHeight || 'medium');
    setBannerTitle(cat.bannerTitle || '');
    setBannerSubtitle(cat.bannerSubtitle || '');
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!categoryToEdit) {
      // Auto generate slug
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generatedSlug);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;

    const parsedSubcategories = subcategoriesInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (categoryToEdit) {
      const updated: Category = {
        ...categoryToEdit,
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        image: image.trim(),
        iconName: iconName.trim(),
        subcategories: parsedSubcategories,
        bannerImage: bannerImage.trim() || undefined,
        showBannerImageOnly: showBannerImageOnly,
        bannerHeight: bannerHeight,
        bannerTitle: bannerTitle.trim() || undefined,
        bannerSubtitle: bannerSubtitle.trim() || undefined
      };
      onUpdateCategory(updated);
    } else {
      const newCategory: Category = {
        id: `cat-${Date.now()}`,
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        image: image.trim(),
        iconName: iconName.trim(),
        itemCount: 0,
        subcategories: parsedSubcategories,
        bannerImage: bannerImage.trim() || undefined,
        showBannerImageOnly: showBannerImageOnly,
        bannerHeight: bannerHeight,
        bannerTitle: bannerTitle.trim() || undefined,
        bannerSubtitle: bannerSubtitle.trim() || undefined
      };
      onAddCategory(newCategory);
    }

    setIsModalOpen(false);
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Banner & Action Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-orange-600 text-white text-[11px] font-bold px-2 py-0.5 rounded">
              Catalog Management
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Product Categories ({categories.length})
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Create, modify, or reorganize product departments. Changes update the storefront mega-menu, header links, and shop filters automatically.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onResetDefaultCategories}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
            title="Reset to default category catalog"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={openAddModal}
            className="px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Category</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories by name, slug or description..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </div>
        <div className="text-xs text-slate-500">
          Showing <span className="font-bold text-slate-800">{filteredCategories.length}</span> of {categories.length} categories
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCategories.map((cat) => {
          const productCount = products.filter(p => isProductInCategory(p, cat.slug)).length;

          return (
            <div 
              key={cat.id} 
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg bg-slate-50 border border-slate-100 p-1 shrink-0 overflow-hidden flex items-center justify-center">
                      <img 
                        src={cat.image} 
                        alt={cat.name} 
                        className="w-full h-full object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = PRESET_CATEGORY_IMAGES[0].url;
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">
                        {cat.name}
                      </h3>
                      <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                        slug: <span className="text-orange-600 bg-orange-50 px-1 py-0.5 rounded font-semibold">{cat.slug}</span>
                      </p>
                    </div>
                  </div>

                  <span className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0">
                    {productCount} {productCount === 1 ? 'Product' : 'Products'}
                  </span>
                </div>

                {cat.description && (
                  <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                    {cat.description}
                  </p>
                )}

                {/* Banner Status Badge & Preview */}
                <div className="mb-3">
                  {cat.bannerImage ? (
                    <div className="relative rounded-lg overflow-hidden border border-slate-200 h-14 bg-slate-900 group">
                      <img 
                        src={cat.bannerImage} 
                        alt="Banner" 
                        className="w-full h-full object-cover opacity-85"
                        onError={(e) => { e.currentTarget.src = PRESET_CATEGORY_BANNERS[0].url; }}
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-between px-2.5">
                        <span className="text-[10px] font-bold text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded border border-white/20">
                          {cat.showBannerImageOnly ? '🖼️ Image Banner Only' : '🖼️ Banner + Text'}
                        </span>
                        <button
                          type="button"
                          onClick={() => openEditModal(cat)}
                          className="text-[10px] text-white hover:text-orange-300 font-bold underline cursor-pointer"
                        >
                          Edit Banner
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-50 border border-slate-200/80 rounded-lg px-2.5 py-1.5">
                      <span>No custom banner (Text header)</span>
                      <button
                        type="button"
                        onClick={() => openEditModal(cat)}
                        className="text-orange-600 hover:text-orange-700 font-semibold cursor-pointer"
                      >
                        + Add Banner
                      </button>
                    </div>
                  )}
                </div>

                {/* Subcategories tags */}
                {cat.subcategories && cat.subcategories.length > 0 && (
                  <div className="mb-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Sub-Departments ({cat.subcategories.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.subcategories.map((sub, i) => (
                        <span key={i} className="text-[10px] bg-slate-50 border border-slate-200 text-slate-700 px-2 py-0.5 rounded">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                <button
                  onClick={() => {
                    onSelectCategory(cat.slug);
                    setActivePage('shop');
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
                  title="Preview in Store"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View in Store</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                    title="Edit Category Details"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(cat.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {categoryToEdit ? 'Edit Product Category' : 'Add New Category'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {categoryToEdit ? `Updating department: ${categoryToEdit.name}` : 'Create a new corporate product classification'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Conference & Boardroom Tables"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category Slug * (URL identifier)
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. conference-tables"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-slate-50"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Used in filters and URLs. Alphanumeric characters and hyphens only.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Department Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary of items in this department (shown on shop page & SEO tags)..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                  <label className="block text-xs font-bold text-slate-700">
                    Category Image
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
                              setImage(result);
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
                      src={image}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => { e.currentTarget.src = PRESET_CATEGORY_IMAGES[0].url; }}
                    />
                  </div>
                  <input
                    type="text"
                    required
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://... or upload from computer"
                    className="flex-1 px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>

                {/* Preset quick picks */}
                <div className="mt-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Quick Preset Images:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_CATEGORY_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setImage(preset.url)}
                        className={`text-[10px] px-2 py-1 rounded border transition cursor-pointer ${
                          image === preset.url 
                            ? 'bg-orange-50 border-orange-500 text-orange-700 font-bold' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sub-Departments (comma separated)
                </label>
                <input
                  type="text"
                  value={subcategoriesInput}
                  onChange={(e) => setSubcategoriesInput(e.target.value)}
                  placeholder="e.g. Executive Desks, Meeting Tables, Reception Counters"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Separate each sub-department name with a comma.
                </p>
              </div>

              {/* Category Page Header Image Banner */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🖼️</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Category Page Image Banner / ব্যানার
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Add an image banner to shop category page or replace the category title
                      </p>
                    </div>
                  </div>
                  <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 text-[11px] font-bold border border-orange-200 cursor-pointer transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Banner Image</span>
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
                              setBannerImage(result);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Primary Requirement: Replace Category Name with Image Banner */}
                <div className="p-3 bg-white rounded-lg border border-orange-300 shadow-2xs">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showBannerImageOnly}
                      onChange={(e) => setShowBannerImageOnly(e.target.checked)}
                      className="w-4 h-4 mt-0.5 text-orange-600 rounded border-slate-300 focus:ring-orange-500 cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Replace Category Name with Image Banner (ক্যাটাগরি নামের পরিবর্তে ইমেজ ব্যানার প্রদর্শন করুন)
                      </span>
                      <span className="text-[11px] text-slate-500 block mt-0.5 leading-relaxed">
                        সচল করলে শপ পেজে কালো টেক্সট হেডারের পরিবর্তে সরাসরি আপনার আপলোড করা ইমেজ ব্যানারটি প্রদর্শিত হবে।
                      </span>
                    </div>
                  </label>
                </div>

                {/* Banner Image Input */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Banner Image URL
                  </label>
                  <input
                    type="text"
                    value={bannerImage}
                    onChange={(e) => setBannerImage(e.target.value)}
                    placeholder="https://... (Leave empty to use default dark text header)"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white"
                  />
                </div>

                {/* Quick Presets */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Quick Preset Banners:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_CATEGORY_BANNERS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setBannerImage(preset.url)}
                        className={`text-[10px] px-2 py-1 rounded border transition cursor-pointer ${
                          bannerImage === preset.url 
                            ? 'bg-orange-50 border-orange-500 text-orange-700 font-bold' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                    {bannerImage && (
                      <button
                        type="button"
                        onClick={() => setBannerImage('')}
                        className="text-[10px] px-2 py-1 rounded border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 transition cursor-pointer"
                      >
                        Remove Banner
                      </button>
                    )}
                  </div>
                </div>

                {/* Banner Height & Options */}
                {bannerImage && (
                  <div className="space-y-3 pt-2 border-t border-slate-200">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Banner Height (ব্যানার সাইজ)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'compact', label: 'Compact (160px)' },
                          { id: 'medium', label: 'Standard (220px)' },
                          { id: 'large', label: 'Large (320px)' }
                        ].map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setBannerHeight(item.id as any)}
                            className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition cursor-pointer text-center ${
                              bannerHeight === item.id
                                ? 'bg-orange-600 text-white border-orange-600 font-bold'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {!showBannerImageOnly && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Overlay Custom Title (Optional)
                          </label>
                          <input
                            type="text"
                            value={bannerTitle}
                            onChange={(e) => setBannerTitle(e.target.value)}
                            placeholder={name || 'Category Name'}
                            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Overlay Subtitle (Optional)
                          </label>
                          <input
                            type="text"
                            value={bannerSubtitle}
                            onChange={(e) => setBannerSubtitle(e.target.value)}
                            placeholder="Subtitle on banner..."
                            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                          />
                        </div>
                      </div>
                    )}

                    {/* Live Preview */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Preview on Category Page:
                      </span>
                      <div className="relative rounded-xl overflow-hidden border border-slate-300 h-28 bg-slate-900 flex items-center p-4">
                        <img
                          src={bannerImage}
                          alt="Banner Preview"
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.src = PRESET_CATEGORY_BANNERS[0].url; }}
                        />
                        {showBannerImageOnly ? (
                          <div className="absolute top-2 right-2 bg-black/60 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase border border-white/20">
                            Image-Only Mode (No Text)
                          </div>
                        ) : (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />
                            <div className="relative z-1 text-white">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-blue-300 bg-blue-950 px-1.5 py-0.5 rounded">
                                Ofixbaze Catalog
                              </span>
                              <h5 className="font-bold text-sm text-white mt-1">
                                {bannerTitle || name || 'Category Title'}
                              </h5>
                              <p className="text-[10px] text-slate-200 line-clamp-1 max-w-xs mt-0.5">
                                {bannerSubtitle || description || 'Explore verified original products'}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{categoryToEdit ? 'Save Changes' : 'Create Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Confirm Category Deletion
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Are you sure you want to remove this category? Products assigned to this category will not be deleted, but may need recategorization.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteCategory(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition"
              >
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
