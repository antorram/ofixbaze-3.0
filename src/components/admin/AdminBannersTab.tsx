import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown, 
  Edit3, 
  Check, 
  Plus, 
  Trash2, 
  Sparkles, 
  ExternalLink,
  Upload,
  Copy,
  AlertTriangle,
  X,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { SlideConfig } from '../../data/adminData';

interface AdminBannersTabProps {
  slides: SlideConfig[];
  onUpdateSlides: (newSlides: SlideConfig[]) => void;
}

const PRESET_BANNER_IMAGES = [
  { name: 'Executive Tables', url: '/executive-tables-banner.jpg', preview: '/executive-tables-banner.jpg' },
  { name: 'CEO Chairs', url: '/ceo-chairs-banner.jpg', preview: '/ceo-chairs-banner.jpg' },
  { name: 'Visitor Chairs', url: '/visitor-chairs-banner.jpg', preview: '/visitor-chairs-banner.jpg' },
  { name: 'Modern Office Space', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', preview: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=300&q=80' },
  { name: 'Boardroom Conference', url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80', preview: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=300&q=80' },
  { name: 'Original Toners OEM', url: 'https://ofixbaze.com/wp-content/uploads/2020/04/05a.jpg', preview: 'https://ofixbaze.com/wp-content/uploads/2020/04/05a.jpg' },
  { name: 'HP LaserJet Printers', url: 'https://ofixbaze.com/wp-content/uploads/2020/04/85a.jpg', preview: 'https://ofixbaze.com/wp-content/uploads/2020/04/85a.jpg' },
  { name: 'Heavy Duty Machines', url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=80', preview: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=300&q=80' }
];

export const AdminBannersTab: React.FC<AdminBannersTabProps> = ({
  slides,
  onUpdateSlides
}) => {
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<SlideConfig>>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New slide form state
  const [newSlide, setNewSlide] = useState<Omit<SlideConfig, 'id'>>({
    enabled: true,
    highlightTitle: 'NEW ARRIVAL',
    mainTitle: 'EXECUTIVE OFFICE SOLUTIONS',
    subtitle: 'PREMIUM QUALITY & RELIABLE SUPPLY FOR NIGERIAN BUSINESSES',
    tagline: 'GENUINE PRODUCTS WITH FULL WARRANTY AND WHITE-GLOVE DELIVERY.',
    primaryBtnText: 'REQUEST CORPORATE QUOTE',
    secondaryBtnText: 'EXPLORE CATALOG',
    deliveryText: 'Same-Day Lagos White-Glove Assembled Delivery Available',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleEnable = (id: string) => {
    const updated = slides.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s);
    onUpdateSlides(updated);
    showToast('Slider visibility updated');
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIndex];
    newSlides[targetIndex] = temp;
    onUpdateSlides(newSlides);
    showToast('Slider order updated');
  };

  const handleStartEdit = (slide: SlideConfig) => {
    setEditingSlideId(slide.id);
    setFormData(slide);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlideId) return;

    const updated = slides.map(s => s.id === editingSlideId ? { ...s, ...formData } : s);
    onUpdateSlides(updated);
    setEditingSlideId(null);
    showToast('Slider changes saved successfully');
  };

  const handleDeleteSlide = (id: string) => {
    if (slides.length <= 1) {
      alert('You must keep at least 1 hero slider for storefront display.');
      setDeleteConfirmId(null);
      return;
    }
    const updated = slides.filter(s => s.id !== id);
    onUpdateSlides(updated);
    setDeleteConfirmId(null);
    if (editingSlideId === id) setEditingSlideId(null);
    showToast('Slider deleted');
  };

  const handleDuplicateSlide = (slide: SlideConfig) => {
    const duplicated: SlideConfig = {
      ...slide,
      id: `slide-${Date.now()}`,
      mainTitle: `${slide.mainTitle} (COPY)`,
      highlightTitle: slide.highlightTitle || 'PROMO'
    };
    onUpdateSlides([...slides, duplicated]);
    showToast('Slider duplicated! You can now customize it.');
  };

  const handleCreateSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlide.mainTitle.trim()) {
      alert('Please provide a Main Heading for the new slider.');
      return;
    }

    const created: SlideConfig = {
      ...newSlide,
      id: `slide-${Date.now()}`
    };

    onUpdateSlides([...slides, created]);
    setIsAddModalOpen(false);
    // Reset form
    setNewSlide({
      enabled: true,
      highlightTitle: 'NEW ARRIVAL',
      mainTitle: '',
      subtitle: '',
      tagline: '',
      primaryBtnText: 'REQUEST QUOTE',
      secondaryBtnText: 'VIEW PRODUCTS',
      deliveryText: 'Nationwide Delivery in Nigeria',
      image: PRESET_BANNER_IMAGES[0].url
    });
    showToast('New slider created successfully!');
  };

  const handleFileChange = (file: File, target: 'edit' | 'new') => {
    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const result = loadEvt.target?.result as string;
      if (result) {
        if (target === 'edit') {
          setFormData(prev => ({ ...prev, image: result }));
        } else {
          setNewSlide(prev => ({ ...prev, image: result }));
        }
        showToast('Image loaded successfully');
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Banner Intro Box & Actions */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-orange-600 text-white text-[11px] font-bold px-2 py-0.5 rounded">
              Hero Carousel
            </span>
            <h3 className="text-base font-bold text-slate-900">Homepage Hero Slider Management</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Individually edit, add, reorder, or delete sliders. Upload custom promotional banners, change titles, badges, and CTA action buttons.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            {slides.filter(s => s.enabled).length} of {slides.length} Live on Homepage
          </span>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Slider</span>
          </button>
        </div>
      </div>

      {/* List of Slides */}
      <div className="space-y-4">
        {slides.map((slide, index) => {
          const isEditing = editingSlideId === slide.id;

          return (
            <div 
              key={slide.id}
              className={`bg-white rounded-2xl border transition shadow-xs overflow-hidden ${
                isEditing ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
                <div className="flex items-center gap-3.5">
                  <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center font-mono shrink-0">
                    #{index + 1}
                  </span>
                  {slide.image && (
                    <div className="w-16 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative group">
                      <img src={slide.image} alt={slide.mainTitle} className="w-full h-full object-cover" />
                      <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition">
                        <Upload className="w-3.5 h-3.5" />
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
                                  const updated = slides.map(s => s.id === slide.id ? { ...s, image: result } : s);
                                  onUpdateSlides(updated);
                                  showToast('Slider photo updated!');
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {slide.highlightTitle && (
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 border border-orange-200">
                          {slide.highlightTitle}
                        </span>
                      )}
                      <h4 className="text-sm font-black text-slate-900">{slide.mainTitle}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        slide.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {slide.enabled ? 'Live' : 'Hidden'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{slide.subtitle || slide.tagline}</p>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-1.5 self-end md:self-auto flex-wrap">
                  <button
                    onClick={() => handleToggleEnable(slide.id)}
                    className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                      slide.enabled ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                    title={slide.enabled ? 'Hide from storefront' : 'Show on storefront'}
                  >
                    {slide.enabled ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    <span className="text-[11px]">{slide.enabled ? 'Disable' : 'Enable'}</span>
                  </button>

                  <button
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                    title="Move slide up in order"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === slides.length - 1}
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                    title="Move slide down in order"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDuplicateSlide(slide)}
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                    title="Duplicate this slider"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => isEditing ? setEditingSlideId(null) : handleStartEdit(slide)}
                    className="p-2 rounded-xl border border-slate-200 hover:border-orange-300 hover:bg-orange-50 text-slate-700 hover:text-orange-600 text-xs font-bold transition cursor-pointer flex items-center gap-1"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>{isEditing ? 'Close' : 'Edit'}</span>
                  </button>

                  {/* Delete Button */}
                  {deleteConfirmId === slide.id ? (
                    <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 p-1 rounded-xl animate-in fade-in duration-150">
                      <span className="text-[10px] font-bold text-rose-700 px-1">Delete?</span>
                      <button
                        onClick={() => handleDeleteSlide(slide.id)}
                        className="p-1 bg-rose-600 text-white rounded text-[10px] font-bold hover:bg-rose-700 cursor-pointer"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="p-1 text-slate-600 text-[10px] hover:text-slate-900 cursor-pointer"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(slide.id)}
                      className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 transition cursor-pointer"
                      title="Delete this slider"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Edit Form Drawer */}
              {isEditing ? (
                <form onSubmit={handleSaveEdit} className="p-5 bg-slate-50/70 border-t border-slate-100 space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Highlight Badge Text</label>
                      <input
                        type="text"
                        value={formData.highlightTitle || ''}
                        onChange={(e) => setFormData({ ...formData, highlightTitle: e.target.value })}
                        placeholder="e.g. PREMIUM, FLAGSHIP, SALE"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Main Heading *</label>
                      <input
                        type="text"
                        required
                        value={formData.mainTitle || ''}
                        onChange={(e) => setFormData({ ...formData, mainTitle: e.target.value })}
                        placeholder="e.g. EXECUTIVE CEO CHAIRS"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-bold"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 font-semibold mb-1">Subtitle Heading</label>
                      <input
                        type="text"
                        value={formData.subtitle || ''}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 font-semibold mb-1">Tagline Pitch</label>
                      <input
                        type="text"
                        value={formData.tagline || ''}
                        onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Primary Button Label</label>
                      <input
                        type="text"
                        value={formData.primaryBtnText || ''}
                        onChange={(e) => setFormData({ ...formData, primaryBtnText: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Secondary Button Label</label>
                      <input
                        type="text"
                        value={formData.secondaryBtnText || ''}
                        onChange={(e) => setFormData({ ...formData, secondaryBtnText: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 font-semibold mb-1">Delivery Badge Text</label>
                      <input
                        type="text"
                        value={formData.deliveryText || ''}
                        onChange={(e) => setFormData({ ...formData, deliveryText: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-xs"
                      />
                    </div>

                    {/* Banner Image & File Upload */}
                    <div className="sm:col-span-2 pt-3 border-t border-slate-200">
                      <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                        <label className="block text-slate-800 font-bold">Slider Picture / Image *</label>
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold cursor-pointer transition shadow-xs">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Picture from Computer / Mobile</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileChange(file, 'edit');
                            }}
                          />
                        </label>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div className="w-28 h-20 rounded-xl border border-slate-300 bg-white overflow-hidden shrink-0 flex items-center justify-center p-1 shadow-xs">
                          {formData.image ? (
                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-slate-400" />
                          )}
                        </div>
                        <div className="flex-1 w-full space-y-2">
                          <input
                            type="text"
                            value={formData.image || ''}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            placeholder="Paste image URL (e.g. /executive-tables-banner.jpg or https://...)"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-xs font-mono"
                          />
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] text-slate-500 font-bold">Or Pick Preset:</span>
                            {PRESET_BANNER_IMAGES.map((preset, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setFormData({ ...formData, image: preset.url })}
                                className="text-[10px] px-2 py-0.5 rounded-md bg-slate-200/80 hover:bg-orange-100 hover:text-orange-700 text-slate-700 transition cursor-pointer"
                              >
                                {preset.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setEditingSlideId(null)}
                      className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save Slide Changes</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-4 bg-slate-50/50 flex flex-wrap gap-4 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 font-medium">Tagline:</span> <strong>{slide.tagline}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Primary CTA:</span> <strong>{slide.primaryBtnText}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Delivery:</span> <strong>{slide.deliveryText}</strong>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add New Slide Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Add New Homepage Hero Slider</h3>
                  <p className="text-xs text-slate-500">Create a promotional banner with custom picture and CTA buttons</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSlide} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Highlight Badge Text</label>
                  <input
                    type="text"
                    value={newSlide.highlightTitle}
                    onChange={(e) => setNewSlide({ ...newSlide, highlightTitle: e.target.value })}
                    placeholder="e.g. SPECIAL OFFER, NEW ARRIVAL"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Main Heading *</label>
                  <input
                    type="text"
                    required
                    value={newSlide.mainTitle}
                    onChange={(e) => setNewSlide({ ...newSlide, mainTitle: e.target.value })}
                    placeholder="e.g. HEAVY DUTY PAPER SHREDDERS"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={newSlide.subtitle}
                    onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
                    placeholder="e.g. HIGH-SECURITY CROSS-CUT FOR BANKS & OFFICES"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">Tagline Pitch</label>
                  <input
                    type="text"
                    value={newSlide.tagline}
                    onChange={(e) => setNewSlide({ ...newSlide, tagline: e.target.value })}
                    placeholder="e.g. Ensure strict document destruction compliance with German engineering"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Primary CTA Button</label>
                  <input
                    type="text"
                    value={newSlide.primaryBtnText}
                    onChange={(e) => setNewSlide({ ...newSlide, primaryBtnText: e.target.value })}
                    placeholder="e.g. REQUEST CORPORATE QUOTE"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Secondary CTA Button</label>
                  <input
                    type="text"
                    value={newSlide.secondaryBtnText}
                    onChange={(e) => setNewSlide({ ...newSlide, secondaryBtnText: e.target.value })}
                    placeholder="e.g. EXPLORE SHREDDERS"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">Delivery Badge Text</label>
                  <input
                    type="text"
                    value={newSlide.deliveryText}
                    onChange={(e) => setNewSlide({ ...newSlide, deliveryText: e.target.value })}
                    placeholder="e.g. Same-Day Lagos Delivery & Next-Day Abuja Available"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>

                {/* Picture Upload & Presets */}
                <div className="sm:col-span-2 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                    <label className="block text-slate-800 font-bold">Slider Picture / Image *</label>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold cursor-pointer transition shadow-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Picture from Computer / Mobile</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileChange(file, 'new');
                        }}
                      />
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="w-28 h-20 rounded-xl border border-slate-300 bg-white overflow-hidden shrink-0 flex items-center justify-center p-1 shadow-xs">
                      {newSlide.image ? (
                        <img src={newSlide.image} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 w-full space-y-2">
                      <input
                        type="text"
                        value={newSlide.image}
                        onChange={(e) => setNewSlide({ ...newSlide, image: e.target.value })}
                        placeholder="Image URL or upload a file"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs"
                      />
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-slate-500 font-bold">Presets:</span>
                        {PRESET_BANNER_IMAGES.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setNewSlide({ ...newSlide, image: preset.url })}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-orange-100 hover:text-orange-700 text-slate-700 transition cursor-pointer"
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newSlide.enabled}
                      onChange={(e) => setNewSlide({ ...newSlide, enabled: e.target.checked })}
                      className="w-4 h-4 text-orange-600 rounded"
                    />
                    <span className="font-bold text-slate-800">Immediately show this slider on the storefront</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Slider</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
