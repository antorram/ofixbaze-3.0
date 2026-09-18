import React, { useState } from 'react';
import { 
  Palette, 
  Layers, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  Eye, 
  Save, 
  RotateCcw, 
  Type, 
  Sliders, 
  Sparkles, 
  ExternalLink, 
  HelpCircle, 
  Layout, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Edit3,
  X,
  Upload,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Film
} from 'lucide-react';
import { 
  SiteCustomizerConfig, 
  HomepageSectionItem, 
  ThemeColorScheme, 
  CustomSectionData,
  ActivePage,
  BannerSlideItem
} from '../../types';
import { SlideConfig } from '../../data/adminData';

const PRESET_BANNER_IMAGES = [
  { name: 'Printers & Commercial MFP Banner', url: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=1920&q=80' },
  { name: 'Toners & Original Supplies Banner', url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=1920&q=80' },
  { name: 'Modern Tech Workspace', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80' },
  { name: 'Executive Chairs & Seating', url: 'https://images.unsplash.com/photo-1580481077195-c328ad0c4600?auto=format&fit=crop&w=1920&q=80' },
  { name: 'Heavy Office Equipment & Power', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1920&q=80' }
];

interface AdminCustomizerTabProps {
  config: SiteCustomizerConfig;
  onUpdateConfig: (newConfig: SiteCustomizerConfig) => void;
  onResetDefaults: () => void;
  setActivePage: (page: ActivePage) => void;
  slides?: SlideConfig[];
  onUpdateSlides?: (newSlides: SlideConfig[]) => void;
  onSwitchToBannersTab?: () => void;
}

const THEME_PRESETS: { name: string; colors: Partial<ThemeColorScheme> }[] = [
  {
    name: 'Original Ofixbaze (Energy Orange & Blue)',
    colors: {
      primaryColor: '#ea580c',
      secondaryColor: '#2563eb',
      headerBg: '#ffffff',
      topBarBg: '#0f172a',
      topBarTextColor: '#ffffff',
      footerBg: '#020617',
      borderRadius: 'rounded-xl'
    }
  },
  {
    name: 'Corporate Royal (Navy Blue & Amber)',
    colors: {
      primaryColor: '#1d4ed8',
      secondaryColor: '#d97706',
      headerBg: '#ffffff',
      topBarBg: '#1e3a8a',
      topBarTextColor: '#ffffff',
      footerBg: '#0f172a',
      borderRadius: 'rounded-xl'
    }
  },
  {
    name: 'Enterprise Emerald (Sustainable Green & Slate)',
    colors: {
      primaryColor: '#059669',
      secondaryColor: '#0284c7',
      headerBg: '#ffffff',
      topBarBg: '#064e3b',
      topBarTextColor: '#ffffff',
      footerBg: '#022c22',
      borderRadius: 'rounded-xl'
    }
  },
  {
    name: 'Executive Crimson (Prestige Red & Charcoal)',
    colors: {
      primaryColor: '#dc2626',
      secondaryColor: '#4f46e5',
      headerBg: '#ffffff',
      topBarBg: '#18181b',
      topBarTextColor: '#ffffff',
      footerBg: '#09090b',
      borderRadius: 'rounded-md'
    }
  },
  {
    name: 'Modern Tech (Deep Indigo & Violet)',
    colors: {
      primaryColor: '#6366f1',
      secondaryColor: '#ec4899',
      headerBg: '#ffffff',
      topBarBg: '#312e81',
      topBarTextColor: '#ffffff',
      footerBg: '#1e1b4b',
      borderRadius: 'rounded-2xl'
    }
  }
];

export const AdminCustomizerTab: React.FC<AdminCustomizerTabProps> = ({
  config,
  onUpdateConfig,
  onResetDefaults,
  setActivePage,
  slides,
  onUpdateSlides,
  onSwitchToBannersTab
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'sections' | 'colors' | 'header_footer'>('sections');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New section modal state
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('Promotional Image Banner');
  const [newSectionSubtitle, setNewSectionSubtitle] = useState('');
  const [newSectionContent, setNewSectionContent] = useState('');
  const [newSectionType, setNewSectionType] = useState<'image_banner' | 'image_slider' | 'banner' | 'features' | 'cta' | 'announcement'>('image_banner');
  const [newSectionBg, setNewSectionBg] = useState('#1e293b');
  const [newSectionTextColor, setNewSectionTextColor] = useState('#ffffff');
  const [newSectionBtnText, setNewSectionBtnText] = useState('Explore Catalog');
  const [newSectionBtnLink, setNewSectionBtnLink] = useState('shop');
  const [newSectionBadge, setNewSectionBadge] = useState('Corporate Special');
  const [newSectionImg, setNewSectionImg] = useState(PRESET_BANNER_IMAGES[0].url);

  // Placement states for adding new section relative to other sections
  const [placementPosition, setPlacementPosition] = useState<'bottom' | 'top' | 'above' | 'below'>('bottom');
  const [placementTargetSectionId, setPlacementTargetSectionId] = useState<string>('');

  // Banner & Slider specific states
  const [newBannerHeight, setNewBannerHeight] = useState<'compact' | 'medium' | 'large' | 'auto'>('medium');
  const [newShowOverlayText, setNewShowOverlayText] = useState(false);
  const [newSliderSlides, setNewSliderSlides] = useState<BannerSlideItem[]>([
    {
      id: 'slide_1',
      imageUrl: PRESET_BANNER_IMAGES[0].url,
      title: 'Original Office LaserJet & MFP Printers',
      subtitle: 'Official warranty with doorstep delivery nationwide.',
      buttonText: 'Shop Printers',
      buttonLink: 'shop'
    },
    {
      id: 'slide_2',
      imageUrl: PRESET_BANNER_IMAGES[1].url,
      title: '100% Genuine OEM Toners & Laser Supplies',
      subtitle: 'Anti-counterfeit hologram security seals.',
      buttonText: 'Order Toners',
      buttonLink: 'shop'
    }
  ]);
  const [newSliderInterval, setNewSliderInterval] = useState(5);

  // Edit Section Modal State (For ALL homepage sections)
  const [isEditSectionModalOpen, setIsEditSectionModalOpen] = useState(false);
  const [sectionToEdit, setSectionToEdit] = useState<HomepageSectionItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editBadge, setEditBadge] = useState('');
  const [editButtonText, setEditButtonText] = useState('');
  const [editButtonLink, setEditButtonLink] = useState('shop');
  const [editBgColor, setEditBgColor] = useState('#ffffff');
  const [editTextColor, setEditTextColor] = useState('#0f172a');
  const [editContent, setEditContent] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editSectionType, setEditSectionType] = useState<'image_banner' | 'image_slider' | 'banner' | 'features' | 'cta' | 'announcement'>('banner');
  const [editBannerHeight, setEditBannerHeight] = useState<'compact' | 'medium' | 'large' | 'auto'>('medium');
  const [editShowOverlayText, setEditShowOverlayText] = useState(false);
  const [editSliderSlides, setEditSliderSlides] = useState<BannerSlideItem[]>([]);
  const [editSliderInterval, setEditSliderInterval] = useState(5);

  const openAddSection = (
    type: 'image_banner' | 'image_slider' | 'banner' | 'features' | 'cta' = 'image_banner',
    position: 'bottom' | 'top' | 'above' | 'below' = 'bottom',
    targetId: string = ''
  ) => {
    setNewSectionType(type);
    setPlacementPosition(position);
    setPlacementTargetSectionId(targetId || (config.sections[0]?.id || ''));
    setNewSectionTitle(
      type === 'image_banner' ? 'Promotional Image Banner' :
      type === 'image_slider' ? 'Multi-Image Slider Carousel' :
      'Special Promotional Section'
    );
    setNewSectionSubtitle(
      type === 'image_banner' ? 'Exclusive discounts on verified hardware' :
      type === 'image_slider' ? 'Explore our featured collections' : ''
    );
    setNewSectionContent('');
    setNewBannerHeight('medium');
    setNewShowOverlayText(false);
    setNewSectionImg(PRESET_BANNER_IMAGES[0].url);
    setNewSliderSlides([
      {
        id: `slide_${Date.now()}_1`,
        imageUrl: PRESET_BANNER_IMAGES[0].url,
        title: 'Original Office LaserJet & MFP Printers',
        subtitle: 'Official warranty with nationwide delivery.',
        buttonText: 'Shop Printers',
        buttonLink: 'shop'
      },
      {
        id: `slide_${Date.now()}_2`,
        imageUrl: PRESET_BANNER_IMAGES[1].url,
        title: '100% Genuine OEM Toners & Laser Supplies',
        subtitle: 'Anti-counterfeit hologram security seals.',
        buttonText: 'Order Toners',
        buttonLink: 'shop'
      }
    ]);
    setNewSliderInterval(5);
    setIsAddSectionModalOpen(true);
  };

  const handleAddNewSlide = () => {
    setNewSliderSlides(prev => [
      ...prev,
      {
        id: `slide_${Date.now()}`,
        imageUrl: PRESET_BANNER_IMAGES[prev.length % PRESET_BANNER_IMAGES.length].url,
        title: 'Special Promotion Offer',
        subtitle: 'Genuine OEM supplies with fast dispatch.',
        buttonText: 'Shop Now',
        buttonLink: 'shop'
      }
    ]);
  };

  const handleRemoveNewSlide = (slideId: string) => {
    if (newSliderSlides.length <= 1) return;
    setNewSliderSlides(prev => prev.filter(s => s.id !== slideId));
  };

  const handleUpdateNewSlide = (slideId: string, field: keyof BannerSlideItem, value: string) => {
    setNewSliderSlides(prev => prev.map(s => s.id === slideId ? { ...s, [field]: value } : s));
  };

  const handleAddEditSlide = () => {
    setEditSliderSlides(prev => [
      ...prev,
      {
        id: `slide_${Date.now()}`,
        imageUrl: PRESET_BANNER_IMAGES[prev.length % PRESET_BANNER_IMAGES.length].url,
        title: 'Special Promotion Offer',
        subtitle: 'Genuine OEM supplies with fast dispatch.',
        buttonText: 'Shop Now',
        buttonLink: 'shop'
      }
    ]);
  };

  const handleRemoveEditSlide = (slideId: string) => {
    if (editSliderSlides.length <= 1) return;
    setEditSliderSlides(prev => prev.filter(s => s.id !== slideId));
  };

  const handleUpdateEditSlide = (slideId: string, field: keyof BannerSlideItem, value: string) => {
    setEditSliderSlides(prev => prev.map(s => s.id === slideId ? { ...s, [field]: value } : s));
  };

  const openEditSectionModal = (section: HomepageSectionItem) => {
    setSectionToEdit(section);
    setEditTitle(section.sectionTitle || section.customData?.title || section.name);
    setEditSubtitle(section.sectionSubtitle || section.customData?.subtitle || section.description || '');
    setEditBadge(section.sectionBadge || section.customData?.badge || '');
    setEditButtonText(section.buttonText || section.customData?.buttonText || '');
    setEditButtonLink(section.buttonLink || section.customData?.buttonLink || 'shop');
    setEditBgColor(section.bgColor || section.customData?.bgColor || '#ffffff');
    setEditTextColor(section.textColor || section.customData?.textColor || '#0f172a');
    setEditContent(section.customData?.content || '');
    setEditImageUrl(section.customData?.imageUrl || '');
    setEditSectionType(section.customData?.type || (section.isCustom ? 'banner' : 'banner'));
    setEditBannerHeight(section.customData?.bannerHeight || 'medium');
    setEditShowOverlayText(section.customData?.showOverlayText ?? false);
    setEditSliderSlides(section.customData?.slides || []);
    setEditSliderInterval(section.customData?.intervalSeconds || 5);
    setIsEditSectionModalOpen(true);
  };

  const handleSaveSectionEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionToEdit) return;

    const updatedSections = config.sections.map(s => {
      if (s.id === sectionToEdit.id) {
        if (s.isCustom) {
          return {
            ...s,
            name: editTitle.trim() || s.name,
            description: editSubtitle.trim() || s.description,
            sectionTitle: editTitle.trim(),
            sectionSubtitle: editSubtitle.trim(),
            sectionBadge: editBadge.trim(),
            buttonText: editButtonText.trim(),
            buttonLink: editButtonLink.trim(),
            bgColor: editBgColor,
            textColor: editTextColor,
            customData: {
              ...(s.customData || {}),
              title: editTitle.trim(),
              subtitle: editSubtitle.trim(),
              badge: editBadge.trim(),
              content: editContent.trim(),
              buttonText: editButtonText.trim(),
              buttonLink: editButtonLink.trim(),
              bgColor: editBgColor,
              textColor: editTextColor,
              imageUrl: editImageUrl.trim(),
              type: editSectionType,
              bannerHeight: editBannerHeight,
              showOverlayText: editShowOverlayText,
              slides: editSectionType === 'image_slider' ? editSliderSlides : s.customData?.slides,
              intervalSeconds: editSliderInterval,
              autoplay: true
            }
          };
        } else {
          return {
            ...s,
            sectionTitle: editTitle.trim(),
            sectionSubtitle: editSubtitle.trim(),
            sectionBadge: editBadge.trim(),
            buttonText: editButtonText.trim(),
            buttonLink: editButtonLink.trim(),
            bgColor: editBgColor,
            textColor: editTextColor
          };
        }
      }
      return s;
    });

    onUpdateConfig({ ...config, sections: updatedSections });
    setIsEditSectionModalOpen(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Handle saving and triggering notification
  const handleSave = () => {
    onUpdateConfig(config);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Section management functions
  const toggleSection = (id: string) => {
    const updated = config.sections.map(s => 
      s.id === id ? { ...s, enabled: !s.enabled } : s
    );
    onUpdateConfig({ ...config, sections: updated });
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= config.sections.length) return;

    const items = [...config.sections];
    const temp = items[index];
    items[index] = items[newIndex];
    items[newIndex] = temp;

    // Recalculate order index
    const reordered = items.map((item, idx) => ({ ...item, order: idx + 1 }));
    onUpdateConfig({ ...config, sections: reordered });
  };

  const deleteCustomSection = (id: string) => {
    if (confirm('Are you sure you want to remove this custom section from the website?')) {
      const updated = config.sections.filter(s => s.id !== id);
      onUpdateConfig({ ...config, sections: updated });
    }
  };

  const handleAddCustomSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionTitle.trim()) return;

    const customId = `custom_${Date.now()}`;
    const newSection: HomepageSectionItem = {
      id: customId,
      name: newSectionTitle,
      description: newSectionSubtitle || 'Custom admin created section',
      enabled: true,
      order: 999, // Calculated below
      isCustom: true,
      customData: {
        title: newSectionTitle,
        subtitle: newSectionSubtitle,
        content: newSectionContent,
        type: newSectionType,
        bgColor: newSectionBg,
        textColor: newSectionTextColor,
        buttonText: newSectionBtnText,
        buttonLink: newSectionBtnLink,
        imageUrl: newSectionImg,
        badge: newSectionBadge,
        bannerHeight: newBannerHeight,
        showOverlayText: newShowOverlayText,
        slides: newSectionType === 'image_slider' ? newSliderSlides : undefined,
        intervalSeconds: newSliderInterval,
        autoplay: true
      }
    };

    let insertIdx = config.sections.length;
    if (placementPosition === 'top') {
      insertIdx = 0;
    } else if (placementPosition === 'above' && placementTargetSectionId) {
      const idx = config.sections.findIndex(s => s.id === placementTargetSectionId);
      insertIdx = idx !== -1 ? idx : 0;
    } else if (placementPosition === 'below' && placementTargetSectionId) {
      const idx = config.sections.findIndex(s => s.id === placementTargetSectionId);
      insertIdx = idx !== -1 ? idx + 1 : config.sections.length;
    }

    const items = [...config.sections];
    items.splice(insertIdx, 0, newSection);
    const reordered = items.map((item, idx) => ({ ...item, order: idx + 1 }));

    onUpdateConfig({
      ...config,
      sections: reordered
    });

    setIsAddSectionModalOpen(false);
    // Reset form
    setNewSectionTitle('Promotional Image Banner');
    setNewSectionSubtitle('');
    setNewSectionContent('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Color scheme updates
  const updateTheme = (updates: Partial<ThemeColorScheme>) => {
    onUpdateConfig({
      ...config,
      theme: { ...config.theme, ...updates }
    });
  };

  const applyPreset = (preset: typeof THEME_PRESETS[0]) => {
    onUpdateConfig({
      ...config,
      theme: { ...config.theme, ...preset.colors }
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Theme & Layout Customizer Style Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#2271b1] text-white text-[11px] font-bold px-2 py-0.5 rounded">
              Site Layout Editor
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Live Theme & Layout Customizer
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Reorder or remove any homepage section, create brand-new custom sections, switch full color schemes, and control header/footer details in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 font-medium animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Published Live!</span>
            </span>
          )}

          <button
            onClick={onResetDefaults}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
            title="Revert back to original layout and colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={() => setActivePage('home')}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Live Site</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-3 gap-2">
        <button
          onClick={() => setActiveSubTab('sections')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer transition ${
            activeSubTab === 'sections'
              ? 'border-[#2271b1] text-[#2271b1]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Homepage Sections Builder ({config.sections.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('colors')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer transition ${
            activeSubTab === 'colors'
              ? 'border-[#2271b1] text-[#2271b1]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Color Scheme & Typography</span>
        </button>

        <button
          onClick={() => setActiveSubTab('header_footer')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer transition ${
            activeSubTab === 'header_footer'
              ? 'border-[#2271b1] text-[#2271b1]'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layout className="w-4 h-4" />
          <span>Header, Top Bar & Footer</span>
        </button>
      </div>

      {/* TAB 1: HOMEPAGE SECTIONS BUILDER */}
      {activeSubTab === 'sections' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Homepage Section Ordering & Visibility
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Turn sections on/off, change their display order, or add custom promotional sections to the storefront.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
                <button
                  onClick={() => openAddSection('image_banner', 'bottom')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                  title="Add an image promotional banner to the homepage"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>+ Add Image Banner</span>
                </button>
                <button
                  onClick={() => openAddSection('image_slider', 'bottom')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                  title="Add an image slider / carousel section to the homepage"
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>+ Add Image Slider</span>
                </button>
                <button
                  onClick={() => openAddSection('banner', 'bottom')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Custom Section</span>
                </button>
              </div>
            </div>

            {/* Sections List */}
            <div className="space-y-2.5">
              {config.sections.map((section, idx) => (
                <div
                  key={section.id}
                  className={`p-3.5 rounded-lg border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    section.enabled
                      ? 'bg-white border-slate-200 hover:border-blue-300 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900">
                          {section.name}
                        </span>
                        {section.customData?.type === 'image_banner' ? (
                          <span className="text-[10px] font-bold bg-orange-100 text-orange-800 px-2 py-0.5 rounded flex items-center gap-1">
                            <ImageIcon className="w-3 h-3" /> Image Banner
                          </span>
                        ) : section.customData?.type === 'image_slider' ? (
                          <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded flex items-center gap-1">
                            <Film className="w-3 h-3" /> Image Slider
                          </span>
                        ) : section.isCustom ? (
                          <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                            Custom Section
                          </span>
                        ) : null}
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            section.enabled
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {section.enabled ? 'Visible' : 'Hidden'}
                        </span>
                        {section.sectionBadge && (
                          <span className="text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded">
                            {section.sectionBadge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {section.description}
                      </p>
                      {(section.sectionTitle || section.customData?.title) && (
                        <p className="text-[11px] text-blue-700 font-medium mt-1 flex items-center gap-1.5">
                          <span className="text-[9px] bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded border border-blue-200 uppercase tracking-wider font-bold">Headline</span>
                          <span>"{section.sectionTitle || section.customData?.title}"</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto flex-wrap">
                    {/* Add Banner/Slider Relative Dropdown */}
                    <div className="relative group/insert">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-xs font-semibold cursor-pointer transition"
                        title="Add image banner or slider above or below this section"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Insert Banner / Slider</span>
                        <ChevronDown className="w-3 h-3 text-orange-500" />
                      </button>
                      <div className="hidden group-hover/insert:block absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30">
                        <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Insert Relative to "{section.name.slice(0, 18)}...":
                        </div>
                        <button
                          type="button"
                          onClick={() => openAddSection('image_banner', 'above', section.id)}
                          className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-orange-50 hover:text-orange-700 font-medium flex items-center gap-2 cursor-pointer transition"
                        >
                          <span className="text-sm">⬆️</span>
                          <span><strong>Banner Above</strong> this section</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => openAddSection('image_banner', 'below', section.id)}
                          className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-orange-50 hover:text-orange-700 font-medium flex items-center gap-2 cursor-pointer transition"
                        >
                          <span className="text-sm">⬇️</span>
                          <span><strong>Banner Below</strong> this section</span>
                        </button>
                        <div className="my-1 border-t border-slate-100" />
                        <button
                          type="button"
                          onClick={() => openAddSection('image_slider', 'above', section.id)}
                          className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-medium flex items-center gap-2 cursor-pointer transition"
                        >
                          <span className="text-sm">⬆️</span>
                          <span><strong>Slider Above</strong> this section</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => openAddSection('image_slider', 'below', section.id)}
                          className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-medium flex items-center gap-2 cursor-pointer transition"
                        >
                          <span className="text-sm">⬇️</span>
                          <span><strong>Slider Below</strong> this section</span>
                        </button>
                      </div>
                    </div>

                    {/* Edit Section Content Button */}
                    <button
                      onClick={() => openEditSectionModal(section)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold cursor-pointer transition"
                      title="Customize section title, subtitle, badge, and layout"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    {/* Move Up */}
                    <button
                      onClick={() => moveSection(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 rounded hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                      title="Move section up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>

                    {/* Move Down */}
                    <button
                      onClick={() => moveSection(idx, 'down')}
                      disabled={idx === config.sections.length - 1}
                      className="p-1.5 rounded hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                      title="Move section down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    <div className="w-px h-5 bg-slate-200 mx-1" />

                    {/* Toggle Visibility */}
                    <button
                      onClick={() => toggleSection(section.id)}
                      className={`px-3 py-1 rounded text-xs font-bold cursor-pointer transition ${
                        section.enabled
                          ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      {section.enabled ? 'Hide' : 'Enable'}
                    </button>

                    {/* Delete if custom */}
                    {section.isCustom && (
                      <button
                        onClick={() => deleteCustomSection(section.id)}
                        className="p-1.5 rounded text-red-600 hover:bg-red-50 cursor-pointer"
                        title="Delete custom section"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COLOR SCHEME & TYPOGRAPHY */}
      {activeSubTab === 'colors' && (
        <div className="space-y-6">
          {/* Preset Palettes */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              One-Click Color Scheme Presets
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Select a professionally curated palette to instantly change the vibe of your store.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {THEME_PRESETS.map((preset, i) => (
                <div
                  key={i}
                  onClick={() => applyPreset(preset)}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-[#2271b1] hover:shadow-xs transition cursor-pointer group bg-slate-50/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800 group-hover:text-[#2271b1]">
                      {preset.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 h-6 rounded-md overflow-hidden p-0.5 bg-slate-200">
                    <div className="h-full flex-1 rounded-xs" style={{ backgroundColor: preset.colors.primaryColor }} />
                    <div className="h-full flex-1 rounded-xs" style={{ backgroundColor: preset.colors.secondaryColor }} />
                    <div className="h-full flex-1 rounded-xs" style={{ backgroundColor: preset.colors.topBarBg }} />
                    <div className="h-full flex-1 rounded-xs" style={{ backgroundColor: preset.colors.footerBg }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Color Controls */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Custom Color Palette Customizer
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Primary Color */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Primary Brand Accent</span>
                  <span className="text-[11px] font-mono text-slate-400">{config.theme.primaryColor}</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.theme.primaryColor}
                    onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                    className="w-10 h-10 rounded border border-slate-300 p-0.5 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.theme.primaryColor}
                    onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-400">Buttons, active badges, highlights, price tags.</p>
              </div>

              {/* Secondary Color */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Secondary Color</span>
                  <span className="text-[11px] font-mono text-slate-400">{config.theme.secondaryColor}</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.theme.secondaryColor}
                    onChange={(e) => updateTheme({ secondaryColor: e.target.value })}
                    className="w-10 h-10 rounded border border-slate-300 p-0.5 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.theme.secondaryColor}
                    onChange={(e) => updateTheme({ secondaryColor: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-400">Borders, category tags, badges, secondary links.</p>
              </div>

              {/* Top Announcement Bar Background */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Top Announcement Bar Bg</span>
                  <span className="text-[11px] font-mono text-slate-400">{config.theme.topBarBg}</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.theme.topBarBg}
                    onChange={(e) => updateTheme({ topBarBg: e.target.value })}
                    className="w-10 h-10 rounded border border-slate-300 p-0.5 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.theme.topBarBg}
                    onChange={(e) => updateTheme({ topBarBg: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-400">Header top banner bar background.</p>
              </div>

              {/* Top Bar Text Color */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Top Announcement Text</span>
                  <span className="text-[11px] font-mono text-slate-400">{config.theme.topBarTextColor}</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.theme.topBarTextColor}
                    onChange={(e) => updateTheme({ topBarTextColor: e.target.value })}
                    className="w-10 h-10 rounded border border-slate-300 p-0.5 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.theme.topBarTextColor}
                    onChange={(e) => updateTheme({ topBarTextColor: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-400">Color of top headline announcement text.</p>
              </div>

              {/* Footer Background */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Footer Background</span>
                  <span className="text-[11px] font-mono text-slate-400">{config.theme.footerBg}</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.theme.footerBg}
                    onChange={(e) => updateTheme({ footerBg: e.target.value })}
                    className="w-10 h-10 rounded border border-slate-300 p-0.5 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.theme.footerBg}
                    onChange={(e) => updateTheme({ footerBg: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-400">Deep background of website footer section.</p>
              </div>

              {/* Border Radius */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Corner Roundness (Border Radius)
                </label>
                <select
                  value={config.theme.borderRadius}
                  onChange={(e) => updateTheme({ borderRadius: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-white"
                >
                  <option value="rounded-none">Square / Sharp (0px)</option>
                  <option value="rounded-md">Subtle Rounded (6px)</option>
                  <option value="rounded-xl">Classic Modern (12px)</option>
                  <option value="rounded-2xl">Soft Curve (16px)</option>
                  <option value="rounded-full">Pill / Ultra Rounded</option>
                </select>
                <p className="text-[11px] text-slate-400">Applies across all product cards, buttons, and inputs.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HEADER, TOP BAR & FOOTER */}
      {activeSubTab === 'header_footer' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Top Announcement Ticker
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Ticker Announcement Message
                </label>
                <input
                  type="text"
                  value={config.announcement.text}
                  onChange={(e) => onUpdateConfig({
                    ...config,
                    announcement: { ...config.announcement, text: e.target.value }
                  })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-slate-700">
                  Enable Announcement Bar
                </label>
                <button
                  type="button"
                  onClick={() => onUpdateConfig({
                    ...config,
                    announcement: { ...config.announcement, enabled: !config.announcement.enabled }
                  })}
                  className={`px-3 py-1 rounded text-xs font-bold ${
                    config.announcement.enabled
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {config.announcement.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          </div>

          {/* Header Controls */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Header Contact & Branding
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Header Hotline Phone
                </label>
                <input
                  type="text"
                  value={config.header.hotlineText}
                  onChange={(e) => onUpdateConfig({
                    ...config,
                    header: { ...config.header, hotlineText: e.target.value }
                  })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Store Title / Brand Name
                </label>
                <input
                  type="text"
                  value={config.header.siteTitle}
                  onChange={(e) => onUpdateConfig({
                    ...config,
                    header: { ...config.header, siteTitle: e.target.value }
                  })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Footer Content & Legal Notice
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Footer Copyright Text
              </label>
              <input
                type="text"
                value={config.footer.copyrightText}
                onChange={(e) => onUpdateConfig({
                  ...config,
                  footer: { ...config.footer, copyrightText: e.target.value }
                })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Footer About Us Summary
              </label>
              <textarea
                rows={3}
                value={config.footer.aboutText}
                onChange={(e) => onUpdateConfig({
                  ...config,
                  footer: { ...config.footer, aboutText: e.target.value }
                })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded"
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW CUSTOM SECTION */}
      {isAddSectionModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-600" />
                  <span>Add Homepage Section / Banner / Slider</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Insert a high-impact image banner, rotating slider, or promotional block anywhere on the homepage.
                </p>
              </div>
              <button
                onClick={() => setIsAddSectionModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomSection} className="space-y-5 text-xs">
              {/* 1. RELATIVE PLACEMENT CONTROL */}
              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-blue-950 text-xs flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <span>Position on Homepage (Placement)</span>
                  </label>
                  <span className="text-[11px] font-semibold text-blue-700">
                    {placementPosition === 'top' && 'At the very top of the page'}
                    {placementPosition === 'bottom' && 'At the bottom of the page'}
                    {placementPosition === 'above' && `Placed ABOVE: ${config.sections.find(s => s.id === placementTargetSectionId)?.name || 'Selected section'}`}
                    {placementPosition === 'below' && `Placed BELOW: ${config.sections.find(s => s.id === placementTargetSectionId)?.name || 'Selected section'}`}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPlacementPosition('top')}
                    className={`py-2 px-2.5 rounded-lg font-bold text-[11px] border transition cursor-pointer text-center ${
                      placementPosition === 'top'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    ⬆️ Very Top
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPlacementPosition('above');
                      if (!placementTargetSectionId && config.sections.length > 0) {
                        setPlacementTargetSectionId(config.sections[0].id);
                      }
                    }}
                    className={`py-2 px-2.5 rounded-lg font-bold text-[11px] border transition cursor-pointer text-center ${
                      placementPosition === 'above'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    ⬆️ Above Section...
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPlacementPosition('below');
                      if (!placementTargetSectionId && config.sections.length > 0) {
                        setPlacementTargetSectionId(config.sections[0].id);
                      }
                    }}
                    className={`py-2 px-2.5 rounded-lg font-bold text-[11px] border transition cursor-pointer text-center ${
                      placementPosition === 'below'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    ⬇️ Below Section...
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlacementPosition('bottom')}
                    className={`py-2 px-2.5 rounded-lg font-bold text-[11px] border transition cursor-pointer text-center ${
                      placementPosition === 'bottom'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    ⬇️ Very Bottom
                  </button>
                </div>

                {(placementPosition === 'above' || placementPosition === 'below') && (
                  <div className="pt-2 border-t border-blue-200/60 flex items-center gap-2">
                    <label className="text-slate-700 font-bold shrink-0">
                      {placementPosition === 'above' ? 'Insert above this section:' : 'Insert below this section:'}
                    </label>
                    <select
                      value={placementTargetSectionId}
                      onChange={(e) => setPlacementTargetSectionId(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-blue-300 rounded-lg text-xs font-semibold text-slate-800"
                    >
                      {config.sections.map((sec, idx) => (
                        <option key={sec.id} value={sec.id}>
                          #{idx + 1}: {sec.name} {sec.isCustom ? '★ Custom' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* 2. SECTION TYPE SELECTOR */}
              <div>
                <label className="font-bold text-slate-800 block mb-2">
                  Choose Section Style / Format
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNewSectionType('image_banner');
                      if (!newSectionTitle || newSectionTitle === 'Special Promotional Section') {
                        setNewSectionTitle('Promotional Image Banner');
                      }
                    }}
                    className={`p-2.5 rounded-xl border text-left flex flex-col items-center text-center transition cursor-pointer ${
                      newSectionType === 'image_banner'
                        ? 'bg-orange-50 border-orange-500 text-orange-950 ring-2 ring-orange-400/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <ImageIcon className="w-5 h-5 text-orange-600 mb-1" />
                    <span className="font-bold text-xs">Image Banner</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Single graphic banner</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNewSectionType('image_slider');
                      if (!newSectionTitle || newSectionTitle === 'Special Promotional Section') {
                        setNewSectionTitle('Multi-Image Slider Carousel');
                      }
                    }}
                    className={`p-2.5 rounded-xl border text-left flex flex-col items-center text-center transition cursor-pointer ${
                      newSectionType === 'image_slider'
                        ? 'bg-blue-50 border-blue-500 text-blue-950 ring-2 ring-blue-400/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Film className="w-5 h-5 text-blue-600 mb-1" />
                    <span className="font-bold text-xs">Image Slider</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Auto-sliding carousel</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewSectionType('banner')}
                    className={`p-2.5 rounded-xl border text-left flex flex-col items-center text-center transition cursor-pointer ${
                      newSectionType === 'banner'
                        ? 'bg-purple-50 border-purple-500 text-purple-950 ring-2 ring-purple-400/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Layout className="w-5 h-5 text-purple-600 mb-1" />
                    <span className="font-bold text-xs">Promo Card</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Color card with copy</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewSectionType('features')}
                    className={`p-2.5 rounded-xl border text-left flex flex-col items-center text-center transition cursor-pointer ${
                      newSectionType === 'features'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-400/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Sparkles className="w-5 h-5 text-emerald-600 mb-1" />
                    <span className="font-bold text-xs">Highlights Box</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Trust & guarantees</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewSectionType('cta')}
                    className={`p-2.5 rounded-xl border text-left flex flex-col items-center text-center transition cursor-pointer ${
                      newSectionType === 'cta'
                        ? 'bg-amber-50 border-amber-500 text-amber-950 ring-2 ring-amber-400/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <ExternalLink className="w-5 h-5 text-amber-600 mb-1" />
                    <span className="font-bold text-xs">Call to Action</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">RFQ / Quote strip</span>
                  </button>
                </div>
              </div>

              {/* 3. SECTION NAME / TITLE */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Section Title / Administrative Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mid-Season Office Supplies Clearance Banner"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              {/* 4. CONTROLS SPECIFIC TO IMAGE_BANNER */}
              {newSectionType === 'image_banner' && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-orange-600" />
                      <span>Banner Image Configuration</span>
                    </span>
                    <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-[11px] font-bold cursor-pointer transition shadow-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Banner from Computer</span>
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
                              if (result) setNewSectionImg(result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Banner Image URL
                    </label>
                    <input
                      type="text"
                      value={newSectionImg}
                      onChange={(e) => setNewSectionImg(e.target.value)}
                      placeholder="https://... or click upload above"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-600 block mb-1.5 text-[11px]">
                      Or Choose from High-Definition Preset Banners:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_BANNER_IMAGES.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setNewSectionImg(preset.url)}
                          className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition cursor-pointer ${
                            newSectionImg === preset.url
                              ? 'bg-orange-500 text-white border-orange-500 font-bold'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Banner Display Height
                      </label>
                      <select
                        value={newBannerHeight}
                        onChange={(e) => setNewBannerHeight(e.target.value as any)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                      >
                        <option value="compact">Compact (approx. 180px)</option>
                        <option value="medium">Standard / Balanced (approx. 260px)</option>
                        <option value="large">Large / Hero-Style (approx. 360px)</option>
                        <option value="auto">Natural Image Aspect Ratio</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Banner Click Target Page
                      </label>
                      <select
                        value={newSectionBtnLink}
                        onChange={(e) => setNewSectionBtnLink(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                      >
                        <option value="shop">Shop All Products</option>
                        <option value="rfq">Corporate RFQ Quote Page</option>
                        <option value="contact">Contact Us</option>
                        <option value="about">About Company</option>
                      </select>
                    </div>
                  </div>

                  {/* Overlay Toggle */}
                  <div className="pt-2 border-t border-slate-200">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={newShowOverlayText}
                        onChange={(e) => setNewShowOverlayText(e.target.checked)}
                        className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                      />
                      <span className="font-bold text-slate-800">
                        Show Text Headline & CTA Button Overlay on Top of Banner
                      </span>
                    </label>
                    <p className="text-[11px] text-slate-400 ml-6.5 mt-0.5">
                      If unchecked, the pure image will be displayed and clicking anywhere on it will open the target page.
                    </p>
                  </div>

                  {newShowOverlayText && (
                    <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">Badge Tag</label>
                          <input
                            type="text"
                            value={newSectionBadge}
                            onChange={(e) => setNewSectionBadge(e.target.value)}
                            placeholder="e.g. Special Offer"
                            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">CTA Button Text</label>
                          <input
                            type="text"
                            value={newSectionBtnText}
                            onChange={(e) => setNewSectionBtnText(e.target.value)}
                            placeholder="e.g. Shop Now"
                            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Overlay Subtitle</label>
                        <input
                          type="text"
                          value={newSectionSubtitle}
                          onChange={(e) => setNewSectionSubtitle(e.target.value)}
                          placeholder="e.g. 100% Genuine Supplies with Official Warranty"
                          className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {/* Live Real-time Banner Preview */}
                  <div className="pt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Live Banner Preview:
                    </span>
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm max-h-48">
                      {newSectionImg ? (
                        <img src={newSectionImg} alt="Preview" className="w-full h-44 object-cover" />
                      ) : (
                        <div className="w-full h-32 flex items-center justify-center text-slate-400 bg-slate-100">
                          No banner image provided
                        </div>
                      )}
                      {newShowOverlayText && (
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/50 to-transparent p-4 flex flex-col justify-center text-white">
                          {newSectionBadge && (
                            <span className="inline-block bg-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded w-fit mb-1">
                              {newSectionBadge}
                            </span>
                          )}
                          <div className="font-black text-sm">{newSectionTitle}</div>
                          {newSectionSubtitle && (
                            <div className="text-[11px] text-slate-300 mt-0.5">{newSectionSubtitle}</div>
                          )}
                          {newSectionBtnText && (
                            <div className="mt-2">
                              <span className="inline-block bg-white text-slate-900 font-bold text-[10px] px-2.5 py-1 rounded">
                                {newSectionBtnText} →
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 5. CONTROLS SPECIFIC TO IMAGE_SLIDER */}
              {newSectionType === 'image_slider' && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <Film className="w-4 h-4 text-blue-600" />
                      <span>Slider Configuration & Slides Manager</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleAddNewSlide}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add Slide</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Slider Height
                      </label>
                      <select
                        value={newBannerHeight}
                        onChange={(e) => setNewBannerHeight(e.target.value as any)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                      >
                        <option value="compact">Compact (approx. 200px)</option>
                        <option value="medium">Standard / Balanced (approx. 300px)</option>
                        <option value="large">Large / Hero-Style (approx. 420px)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Autoplay Transition Speed
                      </label>
                      <select
                        value={newSliderInterval}
                        onChange={(e) => setNewSliderInterval(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                      >
                        <option value={3}>3 Seconds (Fast)</option>
                        <option value={5}>5 Seconds (Recommended)</option>
                        <option value={7}>7 Seconds (Relaxed)</option>
                      </select>
                    </div>
                  </div>

                  {/* Slides List */}
                  <div className="space-y-3">
                    <label className="font-bold text-slate-800 block text-xs">
                      Carousel Slides ({newSliderSlides.length} slides):
                    </label>

                    {newSliderSlides.map((slide, sIdx) => (
                      <div key={slide.id} className="p-3 bg-white border border-slate-200 rounded-xl space-y-2.5 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-blue-900 flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black flex items-center justify-center">
                              {sIdx + 1}
                            </span>
                            <span>Slide #{sIdx + 1}</span>
                          </span>
                          {newSliderSlides.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveNewSlide(slide.id)}
                              className="text-rose-500 hover:text-rose-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove Slide</span>
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                          <div className="sm:col-span-3">
                            <div className="w-full h-20 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 relative group">
                              <img src={slide.imageUrl} alt="Slide preview" className="w-full h-full object-cover" />
                              <label className="absolute inset-0 bg-black/50 text-white text-[10px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                                <span>Change Image</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onload = (loadEvt) => {
                                        const res = loadEvt.target?.result as string;
                                        if (res) handleUpdateNewSlide(slide.id, 'imageUrl', res);
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </div>

                          <div className="sm:col-span-9 space-y-2">
                            <div>
                              <input
                                type="text"
                                value={slide.imageUrl}
                                onChange={(e) => handleUpdateNewSlide(slide.id, 'imageUrl', e.target.value)}
                                placeholder="Slide Image URL (https://...)"
                                className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-mono"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={slide.title}
                                onChange={(e) => handleUpdateNewSlide(slide.id, 'title', e.target.value)}
                                placeholder="Slide Headline"
                                className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-semibold"
                              />
                              <input
                                type="text"
                                value={slide.subtitle || ''}
                                onChange={(e) => handleUpdateNewSlide(slide.id, 'subtitle', e.target.value)}
                                placeholder="Slide Subtitle"
                                className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={slide.buttonText || ''}
                                onChange={(e) => handleUpdateNewSlide(slide.id, 'buttonText', e.target.value)}
                                placeholder="Button Label (e.g. Shop Now)"
                                className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs"
                              />
                              <select
                                value={slide.buttonLink || 'shop'}
                                onChange={(e) => handleUpdateNewSlide(slide.id, 'buttonLink', e.target.value)}
                                className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white"
                              >
                                <option value="shop">Shop Catalog</option>
                                <option value="rfq">Request RFQ Quote</option>
                                <option value="contact">Contact Us</option>
                                <option value="about">About Company</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. STANDARD CUSTOM PROMO SECTION FIELDS (banner, features, cta) */}
              {(newSectionType === 'banner' || newSectionType === 'features' || newSectionType === 'cta') && (
                <div className="space-y-4">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      Section Subtitle / Eyebrow
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Special Bulk Discounts on Certified Printers & Toners"
                      value={newSectionSubtitle}
                      onChange={(e) => setNewSectionSubtitle(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      Detailed Content / Description
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Write promotional copy, terms, or highlights..."
                      value={newSectionContent}
                      onChange={(e) => setNewSectionContent(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Badge Label</label>
                      <input
                        type="text"
                        value={newSectionBadge}
                        onChange={(e) => setNewSectionBadge(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-800 block mb-1">CTA Button Label</label>
                      <input
                        type="text"
                        value={newSectionBtnText}
                        onChange={(e) => setNewSectionBtnText(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Background Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={newSectionBg}
                          onChange={(e) => setNewSectionBg(e.target.value)}
                          className="w-8 h-8 rounded border border-slate-300 p-0.5 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={newSectionBg}
                          onChange={(e) => setNewSectionBg(e.target.value)}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Text Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={newSectionTextColor}
                          onChange={(e) => setNewSectionTextColor(e.target.value)}
                          className="w-8 h-8 rounded border border-slate-300 p-0.5 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={newSectionTextColor}
                          onChange={(e) => setNewSectionTextColor(e.target.value)}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Target Page</label>
                    <select
                      value={newSectionBtnLink}
                      onChange={(e) => setNewSectionBtnLink(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                    >
                      <option value="shop">Shop Catalog</option>
                      <option value="rfq">Corporate RFQ Quote</option>
                      <option value="contact">Contact Us</option>
                      <option value="about">About Company</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddSectionModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#2271b1] hover:bg-[#135e96] rounded-lg shadow-sm cursor-pointer"
                >
                  Create & Place on Homepage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT HOMEPAGE SECTION CONTENT & CUSTOMIZE */}
      {isEditSectionModalOpen && sectionToEdit && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {sectionToEdit.isCustom ? 'Custom Section' : 'Homepage Section'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    ID: {sectionToEdit.id}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Edit Section: {sectionToEdit.name}
                </h3>
              </div>
              <button
                onClick={() => setIsEditSectionModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Special Hero Slider Studio Notice & Quick Link */}
            {sectionToEdit.id === 'hero' && (
              <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-orange-950 flex items-center gap-1.5">
                      <SlidersHorizontal className="w-4 h-4 text-orange-600" />
                      <span>Homepage Hero Sliders ({slides?.length || 0} Slides Configured)</span>
                    </h4>
                    <p className="text-[11px] text-orange-800 mt-0.5">
                      To add new slides, delete slides, reorder, or upload new pictures, use the full Hero Slider Studio.
                    </p>
                  </div>
                  {onSwitchToBannersTab && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditSectionModalOpen(false);
                        onSwitchToBannersTab();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition"
                    >
                      <span>Open Full Slider Studio</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {slides && slides.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    {slides.map((s, idx) => (
                      <div 
                        key={s.id} 
                        onClick={() => {
                          if (onSwitchToBannersTab) {
                            setIsEditSectionModalOpen(false);
                            onSwitchToBannersTab();
                          }
                        }}
                        className="p-2 bg-white rounded-lg border border-orange-200 shadow-2xs hover:border-orange-500 cursor-pointer group transition"
                        title="Click to edit this slide in Slider Studio"
                      >
                        <div className="h-16 rounded overflow-hidden mb-1.5 bg-slate-100">
                          <img src={s.image} alt={s.mainTitle} className="w-full h-full object-cover group-hover:scale-105 transition" />
                        </div>
                        <div className="truncate font-bold text-[11px] text-slate-800">{s.mainTitle}</div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-0.5">
                          <span>Slide #{idx + 1}</span>
                          <span className={s.enabled ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                            {s.enabled ? 'Active' : 'Disabled'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Real-time Preview Preview Box */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Live Section Heading Preview
              </span>
              <div 
                className="p-4 rounded-lg border border-slate-200 transition-colors"
                style={{ backgroundColor: editBgColor, color: editTextColor }}
              >
                {editBadge && (
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wide bg-amber-500/20 text-amber-800 px-2 py-0.5 rounded mb-2 border border-amber-500/30">
                    {editBadge}
                  </span>
                )}
                <h4 className="text-lg font-bold">
                  {editTitle || sectionToEdit.name}
                </h4>
                {editSubtitle && (
                  <p className="text-xs opacity-80 mt-1">
                    {editSubtitle}
                  </p>
                )}
                {editButtonText && (
                  <div className="mt-3">
                    <span className="inline-block px-3 py-1 bg-[#ea580c] text-white text-xs font-semibold rounded">
                      {editButtonText} →
                    </span>
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handleSaveSectionEdit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Section Main Headline / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shop by Department / Flash Sales / Wholesale Supplies"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:border-blue-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  This custom title replaces the default heading on the homepage.
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Section Subtitle / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Official OEM supplies with full manufacturer warranty & fast dispatch"
                  value={editSubtitle}
                  onChange={(e) => setEditSubtitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Badge / Tagline (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Limited Corporate Stock"
                    value={editBadge}
                    onChange={(e) => setEditBadge(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Action Button Text
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. View All Products"
                    value={editButtonText}
                    onChange={(e) => setEditButtonText(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Button Target Page
                  </label>
                  <select
                    value={editButtonLink}
                    onChange={(e) => setEditButtonLink(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="shop">Shop Catalog</option>
                    <option value="rfq">Corporate RFQ Quote</option>
                    <option value="contact">Contact Us</option>
                    <option value="about">About Company</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Background Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={editBgColor}
                      onChange={(e) => setEditBgColor(e.target.value)}
                      className="w-8 h-8 rounded border border-slate-300 p-0.5 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={editBgColor}
                      onChange={(e) => setEditBgColor(e.target.value)}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* If Custom Section: allow editing content & illustration */}
              {sectionToEdit.isCustom && (
                <>
                  {editSectionType === 'image_banner' && (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-orange-600" />
                          <span>Image Banner Settings</span>
                        </span>
                        <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-[11px] font-bold cursor-pointer transition shadow-xs">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Image</span>
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
                                  if (result) setEditImageUrl(result);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Banner Image URL</label>
                        <input
                          type="text"
                          value={editImageUrl}
                          onChange={(e) => setEditImageUrl(e.target.value)}
                          placeholder="https://... or upload from computer"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-600 block mb-1.5 text-[11px]">
                          Or select a Preset Banner:
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {PRESET_BANNER_IMAGES.map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setEditImageUrl(preset.url)}
                              className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition cursor-pointer ${
                                editImageUrl === preset.url
                                  ? 'bg-orange-500 text-white border-orange-500 font-bold'
                                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                              }`}
                            >
                              {preset.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">Banner Height</label>
                          <select
                            value={editBannerHeight}
                            onChange={(e) => setEditBannerHeight(e.target.value as any)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                          >
                            <option value="compact">Compact (approx. 180px)</option>
                            <option value="medium">Standard / Balanced (approx. 260px)</option>
                            <option value="large">Large / Hero-Style (approx. 360px)</option>
                            <option value="auto">Natural Image Ratio</option>
                          </select>
                        </div>
                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">Click Target Page</label>
                          <select
                            value={editButtonLink}
                            onChange={(e) => setEditButtonLink(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                          >
                            <option value="shop">Shop Catalog</option>
                            <option value="rfq">Corporate RFQ Quote</option>
                            <option value="contact">Contact Us</option>
                            <option value="about">About Company</option>
                          </select>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200">
                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={editShowOverlayText}
                            onChange={(e) => setEditShowOverlayText(e.target.checked)}
                            className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                          />
                          <span className="font-bold text-slate-800">
                            Show Text Headline & CTA Button Overlay on Banner
                          </span>
                        </label>
                      </div>

                      {/* Live preview */}
                      <div className="pt-1">
                        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm max-h-40">
                          {editImageUrl ? (
                            <img src={editImageUrl} alt="Preview" className="w-full h-36 object-cover" />
                          ) : (
                            <div className="w-full h-28 flex items-center justify-center text-slate-400 bg-slate-100">
                              No image provided
                            </div>
                          )}
                          {editShowOverlayText && (
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/40 to-transparent p-3 flex flex-col justify-center text-white">
                              {editBadge && (
                                <span className="inline-block bg-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded w-fit mb-0.5">
                                  {editBadge}
                                </span>
                              )}
                              <div className="font-black text-xs">{editTitle}</div>
                              {editSubtitle && <div className="text-[10px] text-slate-300 mt-0.5">{editSubtitle}</div>}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {editSectionType === 'image_slider' && (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                          <Film className="w-4 h-4 text-blue-600" />
                          <span>Slider Settings & Slides Manager</span>
                        </span>
                        <button
                          type="button"
                          onClick={handleAddEditSlide}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add Slide</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">Slider Height</label>
                          <select
                            value={editBannerHeight}
                            onChange={(e) => setEditBannerHeight(e.target.value as any)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                          >
                            <option value="compact">Compact (approx. 200px)</option>
                            <option value="medium">Standard / Balanced (approx. 300px)</option>
                            <option value="large">Large / Hero-Style (approx. 420px)</option>
                          </select>
                        </div>
                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">Autoplay Speed</label>
                          <select
                            value={editSliderInterval}
                            onChange={(e) => setEditSliderInterval(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                          >
                            <option value={3}>3 Seconds</option>
                            <option value={5}>5 Seconds</option>
                            <option value={7}>7 Seconds</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="font-bold text-slate-800 block text-xs">
                          Slides ({editSliderSlides.length}):
                        </label>
                        {editSliderSlides.map((slide, sIdx) => (
                          <div key={slide.id} className="p-3 bg-white border border-slate-200 rounded-xl space-y-2.5 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-blue-900">Slide #{sIdx + 1}</span>
                              {editSliderSlides.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveEditSlide(slide.id)}
                                  className="text-rose-500 hover:text-rose-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Remove</span>
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                              <div className="sm:col-span-3">
                                <div className="w-full h-16 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 relative group">
                                  <img src={slide.imageUrl} alt="Slide preview" className="w-full h-full object-cover" />
                                  <label className="absolute inset-0 bg-black/50 text-white text-[10px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                                    <span>Change</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          const reader = new FileReader();
                                          reader.onload = (loadEvt) => {
                                            const res = loadEvt.target?.result as string;
                                            if (res) handleUpdateEditSlide(slide.id, 'imageUrl', res);
                                          };
                                          reader.readAsDataURL(file);
                                        }
                                      }}
                                    />
                                  </label>
                                </div>
                              </div>

                              <div className="sm:col-span-9 space-y-1.5">
                                <input
                                  type="text"
                                  value={slide.imageUrl}
                                  onChange={(e) => handleUpdateEditSlide(slide.id, 'imageUrl', e.target.value)}
                                  placeholder="Slide Image URL (https://...)"
                                  className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-mono"
                                />
                                <div className="grid grid-cols-2 gap-2">
                                  <input
                                    type="text"
                                    value={slide.title}
                                    onChange={(e) => handleUpdateEditSlide(slide.id, 'title', e.target.value)}
                                    placeholder="Slide Title"
                                    className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-semibold"
                                  />
                                  <input
                                    type="text"
                                    value={slide.subtitle || ''}
                                    onChange={(e) => handleUpdateEditSlide(slide.id, 'subtitle', e.target.value)}
                                    placeholder="Slide Subtitle"
                                    className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {editSectionType !== 'image_banner' && editSectionType !== 'image_slider' && (
                    <>
                      <div>
                        <label className="font-bold text-slate-800 block mb-1">
                          Custom Body Content / Paragraph
                        </label>
                        <textarea
                          rows={3}
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                          placeholder="Enter the body text for this custom promotional block..."
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                          <label className="font-bold text-slate-800 block text-xs">
                            Illustration / Banner Image
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
                                      setEditImageUrl(result);
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
                            {editImageUrl ? (
                              <img src={editImageUrl} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <ImageIcon className="w-6 h-6 text-slate-300" />
                            )}
                          </div>
                          <input
                            type="text"
                            value={editImageUrl}
                            onChange={(e) => setEditImageUrl(e.target.value)}
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                            placeholder="https://... or upload from computer"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditTitle(sectionToEdit.name);
                    setEditSubtitle('');
                    setEditBadge('');
                    setEditButtonText('');
                    setEditBgColor('#ffffff');
                    setEditTextColor('#0f172a');
                  }}
                  className="text-slate-500 hover:text-slate-800 text-xs font-medium cursor-pointer"
                >
                  Reset to Defaults
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditSectionModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-[#2271b1] hover:bg-[#135e96] rounded-lg shadow-sm cursor-pointer"
                  >
                    Save & Update Section
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
