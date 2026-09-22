import React, { useState, useEffect, useRef } from 'react';
import { 
  Wand2, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Undo2, 
  Redo2, 
  Save, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  Copy, 
  ArrowUp, 
  ArrowDown, 
  Layers, 
  Settings, 
  Palette, 
  Type, 
  Image as ImageIcon, 
  Grid, 
  Square, 
  Columns, 
  Sliders, 
  MessageSquare, 
  HelpCircle, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  ChevronRight, 
  ChevronDown,
  Sparkles, 
  ExternalLink,
  RotateCcw,
  Clock,
  Layout,
  Maximize2,
  Minimize2,
  FolderOpen,
  Search,
  Check,
  X,
  Link as LinkIcon,
  Unlink,
  Box,
  Move,
  ShoppingBag,
  Star,
  Flame,
  Globe,
  SlidersHorizontal,
  Video,
  List,
  Tag,
  PhoneCall,
  Menu,
  Footprints,
  Code2,
  FileCheck,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify
} from 'lucide-react';
import { 
  CMSPage, 
  CMSSection, 
  CMSSectionSettings,
  CMSWidget, 
  CMSWidgetType, 
  DeviceMode, 
  CMSMediaItem, 
  CMSTemplate,
  Product,
  Category,
  Currency,
  ActivePage,
  CMSPageRevision
} from '../../types';
import { MediaPickerModal } from './MediaPickerModal';
import { INITIAL_CMS_TEMPLATES } from '../../data/cmsInitialData';
import { CMSSectionRenderer } from '../CMSSectionRenderer';
import { isProductInCategory } from '../../utils/categoryMatcher';
import { SlideConfig, INITIAL_SLIDES_CONFIG } from '../../data/adminData';

interface AdminPageBuilderTabProps {
  pages: CMSPage[];
  initialPageId?: string;
  onSavePage: (page: CMSPage) => void;
  products: Product[];
  categories: Category[];
  currency: Currency;
  mediaItems: CMSMediaItem[];
  onUploadMedia: (item: CMSMediaItem) => void;
  onAddCategory?: (category: Category) => void;
  setActivePage: (page: ActivePage) => void;
  onExitBuilder: () => void;
  slides?: SlideConfig[];
}

// Widget definition for Left Sidebar
interface WidgetPaletteItem {
  type: CMSWidgetType;
  label: string;
  category: 'content' | 'layout' | 'ecommerce' | 'corporate' | 'media' | 'advanced';
  description: string;
  icon: any;
  keywords?: string[];
}

const WIDGET_PALETTE: WidgetPaletteItem[] = [
  // 1. CONTENT
  { type: 'heading', label: 'Heading', category: 'content', description: 'H1-H6 titles with badges and subtexts', icon: Type },
  { type: 'text', label: 'Text Block', category: 'content', description: 'Paragraphs, body copy, and specifications', icon: FileText },
  { type: 'banner_slider', label: 'Hero Slider / Carousel', category: 'content', description: 'Homepage rotating hero banner carousel with CTA buttons & guarantee badges', icon: Layout, keywords: ['slider', 'hero', 'banner', 'carousel', 'slideshow', 'homepage', 'slides'] },
  { type: 'rich_text', label: 'Rich Text', category: 'content', description: 'Formatted descriptive prose and articles', icon: FileText },
  { type: 'button', label: 'Call to Action Button', category: 'content', description: 'Buttons with links, styling, and icons', icon: Square },
  { type: 'icon_box', label: 'Icon Feature Box', category: 'content', description: 'Feature icons with titles and explanations', icon: Sparkles },
  { type: 'quote', label: 'Editorial Quote', category: 'content', description: 'Editorial and executive testimonials', icon: MessageSquare },
  { type: 'divider', label: 'Divider Line', category: 'content', description: 'Clean horizontal spacing divider', icon: SlidersHorizontal },
  { type: 'spacer', label: 'Spacer Gap', category: 'content', description: 'Custom vertical height gap', icon: Box },

  // 2. LAYOUT
  { type: 'section', label: 'New Section', category: 'layout', description: 'Empty section with customizable background', icon: Layout },
  { type: 'container', label: 'Container Box', category: 'layout', description: 'Boxed or full-width layout wrapper', icon: Box },
  { type: 'columns', label: 'Columns Row', category: 'layout', description: 'Multi-column grid (2, 3, 4, 30/70, 70/30)', icon: Columns },
  { type: 'grid', label: 'Content Grid', category: 'layout', description: 'Responsive CSS grid container', icon: Grid },
  { type: 'flex', label: 'Flex Container', category: 'layout', description: 'Custom flex row with alignment controls', icon: Sliders },

  // 3. ECOMMERCE
  { type: 'product_grid', label: 'Product Grid', category: 'ecommerce', description: 'Dynamic catalog filtered by category or brand', icon: ShoppingBag },
  { type: 'product_carousel', label: 'Product Slider / Carousel', category: 'ecommerce', description: 'Interactive rotating product carousel with categories, arrows & autoplay', icon: ShoppingBag, keywords: ['product slider', 'product carousel', 'product', 'slider', 'carousel', 'products', 'deals', 'featured slider'] },
  { type: 'featured_products', label: 'Featured Products', category: 'ecommerce', description: 'Handpicked VIP and flagship equipment', icon: Star },
  { type: 'latest_products', label: 'New Arrivals', category: 'ecommerce', description: 'Latest toner batches and fresh imports', icon: Flame },
  { type: 'bestseller_products', label: 'Bestsellers', category: 'ecommerce', description: 'Top volume corporate toner cartridges', icon: Tag },
  { type: 'category_grid', label: 'Category Grid', category: 'ecommerce', description: 'Direct links to major corporate collections', icon: Grid },
  { type: 'product_search', label: 'Product Search Bar', category: 'ecommerce', description: 'Live cartridge model and furniture search', icon: Search },

  // 4. CORPORATE
  { type: 'rfq_form', label: 'Interactive RFQ Form', category: 'corporate', description: 'Embedded form that saves to corporate RFQ inbox', icon: FileCheck },
  { type: 'trust_badges', label: 'Trust Badges', category: 'corporate', description: 'OEM Authenticity, Fast Dispatch, RFQ & Support', icon: ShieldCheck },
  { type: 'testimonials', label: 'Corporate Reviews', category: 'corporate', description: 'Verified feedback from Nigerian enterprise clients', icon: Star },
  { type: 'faq', label: 'Corporate FAQ', category: 'corporate', description: 'Collapsible answers to corporate buyer questions', icon: HelpCircle },
  { type: 'cta_banner', label: 'Corporate RFQ Banner', category: 'corporate', description: 'Bulk tender pricing & proforma invoice prompt', icon: PhoneCall },
  { type: 'announcement_bar', label: 'Announcement Bar', category: 'corporate', description: 'Top promo notice strip with urgency tag', icon: Sparkles },

  // 5. MEDIA
  { type: 'banner_slider', label: 'Hero / Banner Slider', category: 'media', description: 'Multi-slide rotating promotional showcase with buttons & badges', icon: Layout, keywords: ['slider', 'hero', 'banner', 'carousel', 'slideshow', 'homepage', 'slides'] },
  { type: 'image_slider', label: 'Image Slider / Carousel', category: 'media', description: 'Multi-photo rotating slideshow with navigation chevrons, dots & auto-rotation', icon: ImageIcon, keywords: ['image slider', 'photo slider', 'carousel', 'slideshow', 'gallery slider', 'image carousel', 'slider', 'image', 'photos'] },
  { type: 'brand_logos', label: 'Logo Slider / Brand Marquee', category: 'media', description: 'Smooth continuous marquee ticker or interactive carousel of partner logos', icon: Globe, keywords: ['logo slider', 'brand slider', 'logo', 'brands', 'brand carousel', 'marquee', 'ticker', 'slider', 'partner logos', 'client logos'] },
  { type: 'image', label: 'Single Image', category: 'media', description: 'Full width, responsive aspect ratio image', icon: ImageIcon },
  { type: 'image_gallery', label: 'Image Gallery', category: 'media', description: 'Multi-image grid showroom showcase', icon: Grid },
  { type: 'video', label: 'Video Player', category: 'media', description: 'Product and corporate showroom videos', icon: Video },
  { type: 'hero_banner', label: 'Hero Banner', category: 'media', description: 'Headline, subtext, dual CTAs & image overlay', icon: Wand2 },

  // 6. ADVANCED
  { type: 'html_custom', label: 'Custom HTML / Embed', category: 'advanced', description: 'Raw HTML, iframe, or custom tracking code', icon: Code2 },
  { type: 'breadcrumb', label: 'Dynamic Breadcrumbs', category: 'advanced', description: 'Hierarchical navigation breadcrumbs', icon: ChevronRight },
  { type: 'menu_widget', label: 'Menu Widget', category: 'advanced', description: 'Corporate navigation link list', icon: Menu }
];

export const AdminPageBuilderTab: React.FC<AdminPageBuilderTabProps> = ({
  pages,
  initialPageId = 'page-home',
  onSavePage,
  products,
  categories,
  currency,
  mediaItems,
  onUploadMedia,
  onAddCategory,
  setActivePage,
  onExitBuilder,
  slides = INITIAL_SLIDES_CONFIG
}) => {
  const [selectedPageId, setSelectedPageId] = useState<string>(initialPageId);
  const activePage = pages.find(p => p.id === selectedPageId) || pages[0];

  // Working state of current page sections
  const [sections, setSections] = useState<CMSSection[]>(activePage ? activePage.sections : []);
  const [history, setHistory] = useState<CMSSection[][]>([activePage ? activePage.sections : []]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Responsive device preview mode
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

  // Selected element tracking
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);

  // Category Grid inspector local states
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [isAddingNewCatInline, setIsAddingNewCatInline] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatImage, setNewCatImage] = useState('');

  // Left sidebar tabs & state
  const [leftTab, setLeftTab] = useState<'widgets' | 'navigator' | 'templates'>('widgets');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [widgetSearch, setWidgetSearch] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    content: true,
    layout: true,
    ecommerce: true,
    corporate: true,
    media: true,
    advanced: true
  });

  // Right sidebar inspector tab
  const [inspectorTab, setInspectorTab] = useState<'content' | 'style' | 'spacing' | 'device' | 'advanced'>('content');

  // Spacing link state
  const [isPaddingLinked, setIsPaddingLinked] = useState<boolean>(true);
  const [isMarginLinked, setIsMarginLinked] = useState<boolean>(true);
  const [isBorderRadiusLinked, setIsBorderRadiusLinked] = useState<boolean>(true);

  // Canvas Viewport Enhancements
  const [canvasZoom, setCanvasZoom] = useState<number>(100);
  const [customViewportWidth, setCustomViewportWidth] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showStructureOutline, setShowStructureOutline] = useState<boolean>(false);

  // Media Picker Modal
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaTargetField, setMediaTargetField] = useState<'widget-image' | 'section-bg' | 'widget-slide-image'>('widget-image');
  const [selectedSlideIndexForMedia, setSelectedSlideIndexForMedia] = useState<number | null>(null);

  // Revisions Modal
  const [isRevisionsOpen, setIsRevisionsOpen] = useState(false);
  const [revisions, setRevisions] = useState<CMSPageRevision[]>(() => {
    return activePage?.revisions || [
      {
        id: 'rev-init',
        timestamp: activePage?.updatedAt || '07 Sep 2026, 10:00 AM',
        author: 'Super Admin',
        summary: 'Baseline Initial Corporate State',
        sections: activePage ? activePage.sections : []
      }
    ];
  });

  // Autosave & status state
  const [autosaveStatus, setAutosaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [copiedWidget, setCopiedWidget] = useState<CMSWidget | null>(null);
  const [copiedStyle, setCopiedStyle] = useState<any | null>(null);
  const [copiedSection, setCopiedSection] = useState<CMSSection | null>(null);
  const [copiedSectionStyle, setCopiedSectionStyle] = useState<CMSSectionSettings | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Templates in localStorage
  const [templates, setTemplates] = useState<CMSTemplate[]>(() => {
    try {
      const saved = localStorage.getItem('ofixbaze_cms_templates');
      return saved ? JSON.parse(saved) : INITIAL_CMS_TEMPLATES;
    } catch {
      return INITIAL_CMS_TEMPLATES;
    }
  });

  // Drop target state for drag-and-drop
  const [dropTargetSectionId, setDropTargetSectionId] = useState<string | null>(null);

  const showBuilderToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Sync state when selected page changes
  useEffect(() => {
    const page = pages.find(p => p.id === selectedPageId) || pages[0];
    if (page) {
      setSections(page.sections);
      setHistory([page.sections]);
      setHistoryIndex(0);
      setSelectedSectionId(page.sections[0]?.id || null);
      setSelectedWidgetId(page.sections[0]?.widgets[0]?.id || null);
      setRevisions(page.revisions || [
        {
          id: `rev-${Date.now()}`,
          timestamp: page.updatedAt || 'Initial Version',
          author: 'Super Admin',
          summary: 'Published Release',
          sections: page.sections
        }
      ]);
      setHasUnsavedChanges(false);
      setAutosaveStatus('saved');
    }
  }, [selectedPageId]);

  // Helper to commit state with undo/redo history
  const updateSectionsWithHistory = (newSections: CMSSection[]) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(newSections);
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
    setSections(newSections);
    setHasUnsavedChanges(true);
    setAutosaveStatus('unsaved');
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setSections(history[historyIndex - 1]);
      setHasUnsavedChanges(true);
      showBuilderToast('Undo applied');
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setSections(history[historyIndex + 1]);
      setHasUnsavedChanges(true);
      showBuilderToast('Redo applied');
    }
  };

  // Find currently selected section & widget
  const currentSection = sections.find(s => s.id === selectedSectionId) || null;
  const currentWidget = currentSection?.widgets.find(w => w.id === selectedWidgetId) || null;

  // Keyboard shortcuts (Ctrl+Z, Ctrl+Y, Ctrl+S, Ctrl+D, Ctrl+C, Ctrl+V, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName);

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveDraft();
      } else if (!isInput && (e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        if (selectedSectionId && currentWidget) {
          handleDuplicateWidget(selectedSectionId, currentWidget);
        }
      } else if (!isInput && (e.ctrlKey || e.metaKey) && e.key === 'c') {
        if (currentWidget) {
          setCopiedWidget(currentWidget);
          showBuilderToast(`Copied widget "${currentWidget.title || currentWidget.type}"`);
        }
      } else if (!isInput && (e.ctrlKey || e.metaKey) && e.key === 'v') {
        if (copiedWidget && selectedSectionId) {
          const newW: CMSWidget = {
            ...copiedWidget,
            id: `w-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
          };
          const updated = sections.map(s => {
            if (s.id === selectedSectionId) {
              return { ...s, widgets: [...s.widgets, newW] };
            }
            return s;
          });
          updateSectionsWithHistory(updated);
          setSelectedWidgetId(newW.id);
          showBuilderToast('Pasted widget into active section');
        }
      } else if (e.key === 'Escape') {
        setSelectedWidgetId(null);
        setSelectedSectionId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history, sections, selectedWidgetId, selectedSectionId, currentWidget, copiedWidget]);

  // Autosave timer every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      if (hasUnsavedChanges && activePage) {
        setAutosaveStatus('saving');
        const updatedPage: CMSPage = {
          ...activePage,
          updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sections
        };
        onSavePage(updatedPage);
        setTimeout(() => {
          setAutosaveStatus('saved');
          setHasUnsavedChanges(false);
        }, 600);
      }
    }, 30000);
    return () => clearInterval(timer);
  }, [hasUnsavedChanges, sections, activePage]);

  // Add Section Handler
  const handleAddSection = (preset?: '1-col' | '2-col-equal' | '3-col-equal' | '4-col-equal' | '30-70' | '70-30') => {
    const newSecId = `sec-${Date.now()}`;
    const newSec: CMSSection = {
      id: newSecId,
      name: `Section ${sections.length + 1}`,
      enabled: true,
      settings: {
        layout: 'full-width',
        contentMaxWidth: '100%',
        paddingTop: 48,
        paddingBottom: 48,
        columnsPreset: preset || '1-col',
        bgColor: '#ffffff'
      },
      widgets: [
        {
          id: `w-${Date.now()}-heading`,
          type: 'heading',
          title: 'Section Heading',
          content: {
            badge: 'EXECUTIVE SHOWCASE',
            text: 'Transforming Corporate Workspaces',
            subtext: 'High-performance office equipment, ergonomic boardroom chairs, and certified OEM supplies.'
          },
          settings: {
            textAlign: 'center',
            fontSize: '28px',
            fontWeight: '800'
          }
        }
      ]
    };

    updateSectionsWithHistory([...sections, newSec]);
    setSelectedSectionId(newSecId);
    setSelectedWidgetId(newSec.widgets[0].id);
    showBuilderToast('Section added to canvas');
  };

  // Add Widget to Current Section
  const handleAddWidget = (widgetType: CMSWidgetType, targetSectionId?: string) => {
    const targetSec = targetSectionId 
      ? sections.find(s => s.id === targetSectionId)
      : (currentSection || sections[0]);

    if (!targetSec) {
      handleAddSection();
      return;
    }

    const newWidgetId = `w-${Date.now()}`;
    let newWidget: CMSWidget;

    switch (widgetType) {
      case 'heading':
        newWidget = {
          id: newWidgetId,
          type: 'heading',
          title: 'Heading',
          content: {
            badge: 'NEW ARRIVAL',
            text: 'Enter Your Eye-Catching Headline Here',
            subtext: 'Add supporting specifications and corporate guidelines.'
          },
          settings: { textAlign: 'left', fontSize: '28px', fontWeight: '800' }
        };
        break;

      case 'text':
      case 'rich_text':
        newWidget = {
          id: newWidgetId,
          type: widgetType,
          title: 'Text Block',
          content: {
            text: 'Ofixbaze Nigeria Limited delivers certified genuine HP laser toner cartridges, heavy-duty paper shredders, and executive boardroom furniture with stamped VAT proforma invoices across Lagos and nationwide.'
          },
          settings: { fontSize: '15px', lineHeight: '1.6', textColor: '#475569' }
        };
        break;

      case 'button':
        newWidget = {
          id: newWidgetId,
          type: 'button',
          title: 'Action Button',
          content: {
            buttonText: 'Request Stamped RFQ Quote',
            buttonUrl: '/rfq'
          },
          settings: {
            bgColor: '#ea580c',
            textColor: '#ffffff',
            paddingTop: 12,
            paddingBottom: 12,
            paddingLeft: 24,
            paddingRight: 24,
            borderRadius: 8,
            fontWeight: '700'
          }
        };
        break;

      case 'image':
        newWidget = {
          id: newWidgetId,
          type: 'image',
          title: 'Image Showcase',
          content: {
            imageUrl: '/public/executive-tables-banner.jpg',
            altText: 'Executive Tables and Desks Showcase'
          },
          settings: { borderRadius: 12, objectFit: 'cover', imageHeightMode: 'auto' }
        };
        break;

      case 'hero_banner':
        newWidget = {
          id: newWidgetId,
          type: 'hero_banner',
          title: 'Hero Showcase Banner',
          content: {
            badge: 'NIGERIA\'S CORPORATE LEADER',
            text: 'EXECUTIVE OFFICE FURNITURE & GENUINE HP TONERS',
            subtext: 'Lagos authorized distributor for certified OEM HP cartridges, luxury boardroom tables & high-security paper shredders.',
            buttonText: 'REQUEST RFQ PROFORMA',
            buttonUrl: '/rfq',
            secondaryBtnText: 'EXPLORE CATALOG',
            secondaryBtnUrl: '/shop',
            imageUrl: '/public/executive-tables-banner.jpg'
          },
          settings: {
            bgColor: '#0f172a',
            textColor: '#ffffff',
            borderRadius: 16,
            overlayColor: '#000000',
            overlayOpacity: 0.65
          }
        };
        break;

      case 'banner_slider':
      case 'hero_slider':
        newWidget = {
          id: newWidgetId,
          type: 'banner_slider',
          title: 'Hero Slider & Banners',
          content: {
            badge: "NIGERIA'S TRUSTED CORPORATE PROCUREMENT PARTNER",
            text: 'PREMIUM OFFICE EQUIPMENT. BUILT FOR BUSINESS.',
            subtext: 'Supply your workplace with genuine OEM toners, executive furniture, printers, and document machines with official warranty and fast Lagos delivery.',
            buttonText: 'REQUEST CORPORATE QUOTE',
            buttonUrl: '/rfq',
            secondaryBtnText: 'EXPLORE CATALOGUE',
            secondaryBtnUrl: '/shop',
            imageUrl: '/executive-tables-banner.jpg',
            items: [
              {
                id: 'slide-1',
                title: 'EXECUTIVE TABLES',
                badge: 'PREMIUM',
                description: 'SUPERIOR CRAFTSMANSHIP. UNCOMPROMISED ELEGANCE.',
                subtext: 'THE ULTIMATE WORKSPACE FOR LEADERS & VISIONARIES.',
                buttonText: 'REQUEST EXECUTIVE QUOTE',
                buttonUrl: '/rfq',
                secondaryBtnText: 'EXPLORE ALL DESKS & TABLES',
                secondaryBtnUrl: '/shop',
                image: '/executive-tables-banner.jpg',
                deliveryText: 'Same-Day Lagos White-Glove Assembled Delivery Available'
              },
              {
                id: 'slide-2',
                title: 'EXECUTIVE CEO CHAIRS',
                badge: 'PREMIUM',
                description: 'LUXURY ERGONOMIC LEATHER. UNCOMPROMISED COMFORT.',
                subtext: 'DESIGNED FOR BOARDROOM LEADERS & TIRELESS EXECUTIVES.',
                buttonText: 'REQUEST CORPORATE QUOTE',
                buttonUrl: '/rfq',
                secondaryBtnText: 'EXPLORE EXECUTIVE SEATING',
                secondaryBtnUrl: '/shop',
                image: '/ceo-chairs-banner.jpg',
                deliveryText: 'Ready for Immediate Dispatch — Stamped OEM Certificate Included'
              },
              {
                id: 'slide-3',
                title: 'VISITOR & CONFERENCE CHAIRS',
                badge: 'PREMIUM',
                description: 'PRESTIGE GUEST COMFORT FOR BOARDROOMS & RECEPTIONS.',
                subtext: 'COMMAND RESPECT FROM THE FIRST MOMENT CLIENTS ENTER.',
                buttonText: 'REQUEST BULK QUOTE',
                buttonUrl: '/rfq',
                secondaryBtnText: 'BROWSE VISITOR COLLECTION',
                secondaryBtnUrl: '/shop',
                image: '/visitor-chairs-banner.jpg',
                deliveryText: 'Bulk Quantity In Stock — Guaranteed Next-Day Lagos Setup'
              }
            ]
          },
          settings: {
            sliderSource: 'homepage-hero',
            sliderAutoplay: true,
            sliderInterval: 6000,
            sliderShowArrows: true,
            sliderShowDots: true,
            sliderHeight: '520px',
            sliderTheme: 'modern-dark'
          }
        };
        break;

      case 'product_grid':
      case 'featured_products':
      case 'latest_products':
      case 'bestseller_products':
        newWidget = {
          id: newWidgetId,
          type: widgetType,
          title: 'Product Catalog Grid',
          content: {
            badge: 'CERTIFIED OEM INVENTORY',
            text: 'Featured Executive Supplies',
            subtext: 'Instant same-day delivery across Lagos corporate zones.'
          },
          settings: {
            productCategory: 'all',
            productsLimit: 8,
            columnsCount: 4,
            onlyFeatured: widgetType === 'featured_products'
          }
        };
        break;

      case 'product_carousel':
      case 'product_slider':
        newWidget = {
          id: newWidgetId,
          type: 'product_carousel',
          title: 'Product Slider Carousel',
          content: {
            badge: 'FEATURED EXECUTIVE SELECTIONS',
            text: 'Trending Corporate Supplies & Equipment',
            subtext: 'Official manufacturer warranty and fast Lagos delivery.'
          },
          settings: {
            productCategory: 'all',
            productsLimit: 12,
            productSliderItemsToShow: 4,
            productSliderAutoplay: true,
            productSliderInterval: 5000,
            productSliderShowArrows: true,
            productSliderShowDots: true,
            onlyFeatured: false,
            onlySale: false
          }
        };
        break;

      case 'image_slider':
        newWidget = {
          id: newWidgetId,
          type: 'image_slider',
          title: 'Image Slider & Carousel',
          content: {
            badge: 'SHOWROOM SHOWCASE',
            text: 'Modern Workplace Environments',
            subtext: 'Explore premium installations and executive furniture arrangements.',
            items: [
              {
                id: 'img-1',
                title: 'Executive Boardroom Desks',
                description: 'Precision Italian veneer and integrated wire management for visionary executives.',
                badge: 'FLAGSHIP SERIES',
                image: '/executive-tables-banner.jpg',
                buttonText: 'EXPLORE TABLES',
                buttonUrl: '/shop?category=executive-tables'
              },
              {
                id: 'img-2',
                title: 'Ergonomic CEO Leather Chairs',
                description: 'High-back lumbar support engineered for 12+ hour corporate focus.',
                badge: 'OFFICIAL OEM',
                image: '/ceo-chairs-banner.jpg',
                buttonText: 'DISCOVER SEATING',
                buttonUrl: '/shop?category=executive-chairs'
              },
              {
                id: 'img-3',
                title: 'Prestige Visitor Seating',
                description: 'Commanding client comfort for Lagos corporate reception & executive guest lobbies.',
                badge: 'BESTSELLER',
                image: '/visitor-chairs-banner.jpg',
                buttonText: 'VIEW COLLECTION',
                buttonUrl: '/shop?category=visitor-conference-chairs'
              }
            ]
          },
          settings: {
            imageSliderAutoplay: true,
            imageSliderInterval: 6000,
            imageSliderHeight: '440px',
            imageSliderBorderRadius: 16,
            imageSliderShowArrows: true,
            imageSliderShowDots: true,
            imageSliderObjectFit: 'cover'
          }
        };
        break;

      case 'category_grid':
        newWidget = {
          id: newWidgetId,
          type: 'category_grid',
          title: 'Category Explorer Grid',
          content: {
            badge: 'EXPLORE BY DEPARTMENT',
            text: 'Corporate Supply Collections',
            subtext: 'Select a department to view authentic stock.'
          },
          settings: { columnsCount: 6 }
        };
        break;

      case 'trust_badges':
        newWidget = {
          id: newWidgetId,
          type: 'trust_badges',
          title: 'Corporate Guarantee Badges',
          content: {
            text: 'Why 500+ Nigerian Companies Partner with Ofixbaze'
          },
          settings: {}
        };
        break;

      case 'cta_banner':
        newWidget = {
          id: newWidgetId,
          type: 'cta_banner',
          title: 'Corporate Tender Call to Action',
          content: {
            badge: 'CORPORATE TENDERS & ANNUAL CONTRACTS',
            text: 'Need Bulk Pricing with Stamped Proforma Invoices?',
            subtext: 'Submit your departmental requirement bill of quantities. Our corporate desk delivers official proformas within 2 hours.',
            buttonText: 'SUBMIT CORPORATE RFQ NOW',
            buttonUrl: '/rfq',
            secondaryBtnText: 'CALL DIRECT: 0906-942-5822',
            secondaryBtnUrl: 'tel:09069425822'
          },
          settings: {
            bgColor: '#1e293b',
            textColor: '#ffffff',
            borderRadius: 16
          }
        };
        break;

      case 'rfq_form':
      case 'contact_form':
        newWidget = {
          id: newWidgetId,
          type: widgetType,
          title: 'Interactive RFQ Form',
          content: {
            text: 'Request Instant Stamped Proforma Quotation',
            subtext: 'Fill out your corporate details. A formal PDF proforma with TIN & VAT breakdown will be generated.'
          },
          settings: {}
        };
        break;

      case 'brand_logos':
      case 'client_logos':
      case 'logo_slider':
        newWidget = {
          id: newWidgetId,
          type: 'brand_logos',
          title: 'OEM Brand Partners & Logo Slider',
          content: {
            badge: 'AUTHORIZED OEM PARTNERS',
            text: 'OFFICIAL CORPORATE DEALERSHIP PARTNERS',
            subtext: 'Direct manufacturer procurement with verified authenticity and manufacturer warranty.',
            items: [
              { id: 'logo-1', title: 'HP Authorized Partner', image: 'https://ofixbaze.com/wp-content/uploads/2020/04/HP-LOGO.jpg', link: '/shop?brand=hp' },
              { id: 'logo-2', title: 'Sharp Enterprise Copiers', image: 'https://ofixbaze.com/wp-content/uploads/2020/04/SHARP-LOGO-IN-LAGOS-1.jpg', link: '/shop?brand=sharp' },
              { id: 'logo-3', title: 'Canon Imaging Solutions', image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=300&auto=format&fit=crop&q=80', link: '/shop?brand=canon' },
              { id: 'logo-4', title: 'Epson Precision Core', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop&q=80', link: '/shop?brand=epson' },
              { id: 'logo-5', title: 'Comix Stationery & Shredders', image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=300&auto=format&fit=crop&q=80', link: '/shop?brand=comix' },
              { id: 'logo-6', title: 'APC Schneider Electric UPS', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300&auto=format&fit=crop&q=80', link: '/shop?brand=apc' },
              { id: 'logo-7', title: 'Nigerian Gas Company', image: 'https://ofixbaze.com/wp-content/uploads/2020/05/NIGERIAN-GAS-COMPANY-LOGO.jpg', link: '#' }
            ]
          },
          settings: {
            logoSliderMode: 'marquee',
            logoSliderSpeed: 30,
            logoSliderGrayscale: true,
            logoSliderPauseOnHover: true,
            logoSliderItemsToShow: 5,
            logoSliderShowArrows: true,
            logoSliderShowDots: false,
            logoSliderBorderRadius: 10,
            logoSliderBgColor: '#ffffff'
          }
        };
        break;

      case 'testimonials':
        newWidget = {
          id: newWidgetId,
          type: 'testimonials',
          title: 'Client Reviews Carousel',
          content: {
            badge: 'TRUSTED BY LEADERS',
            text: 'What Procurement Directors Say About Ofixbaze'
          },
          settings: { columnsCount: 3 }
        };
        break;

      case 'faq':
        newWidget = {
          id: newWidgetId,
          type: 'faq',
          title: 'Corporate FAQ',
          content: {},
          settings: {}
        };
        break;

      case 'quote':
        newWidget = {
          id: newWidgetId,
          type: 'quote',
          title: 'Editorial Quote',
          content: {
            text: 'We equip Nigeria’s top enterprises with certified office equipment and authentic toner supplies.',
            authorName: 'Engr. Taiwo Adebayo',
            authorRole: 'Facilities Director'
          },
          settings: {}
        };
        break;

      case 'divider':
        newWidget = {
          id: newWidgetId,
          type: 'divider',
          title: 'Divider Line',
          content: {},
          settings: {}
        };
        break;

      case 'spacer':
        newWidget = {
          id: newWidgetId,
          type: 'spacer',
          title: 'Spacer',
          content: {},
          settings: { minHeight: '32px' }
        };
        break;

      default:
        newWidget = {
          id: newWidgetId,
          type: widgetType,
          title: widgetType.replace('_', ' '),
          content: { text: `New ${widgetType} widget` },
          settings: {}
        };
    }

    const updated = sections.map(sec => {
      if (sec.id === targetSec.id) {
        return { ...sec, widgets: [...sec.widgets, newWidget] };
      }
      return sec;
    });

    updateSectionsWithHistory(updated);
    setSelectedSectionId(targetSec.id);
    setSelectedWidgetId(newWidget.id);
    showBuilderToast(`Added ${newWidget.title}`);
  };

  // Move Section Up/Down
  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= sections.length) return;
    const reordered = [...sections];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(newIdx, 0, moved);
    updateSectionsWithHistory(reordered);
  };

  // Duplicate Section
  const handleDuplicateSection = (sec: CMSSection) => {
    const dup: CMSSection = {
      ...sec,
      id: `sec-${Date.now()}`,
      name: `${sec.name} (Copy)`,
      widgets: sec.widgets.map(w => ({
        ...w,
        id: `w-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
      }))
    };
    updateSectionsWithHistory([...sections, dup]);
    showBuilderToast('Section duplicated');
  };

  // Delete Section
  const handleDeleteSection = (secId: string) => {
    const remaining = sections.filter(s => s.id !== secId);
    updateSectionsWithHistory(remaining);
    if (selectedSectionId === secId) {
      setSelectedSectionId(remaining[0]?.id || null);
      setSelectedWidgetId(remaining[0]?.widgets[0]?.id || null);
    }
    showBuilderToast('Section deleted');
  };

  // Duplicate Widget
  const handleDuplicateWidget = (secId: string, widget: CMSWidget) => {
    const dupWidget: CMSWidget = {
      ...widget,
      id: `w-${Date.now()}`,
      title: `${widget.title} (Copy)`
    };
    const updated = sections.map(sec => {
      if (sec.id === secId) {
        return { ...sec, widgets: [...sec.widgets, dupWidget] };
      }
      return sec;
    });
    updateSectionsWithHistory(updated);
    setSelectedWidgetId(dupWidget.id);
    showBuilderToast('Element duplicated');
  };

  // Delete Widget
  const handleDeleteWidget = (secId: string, widgetId: string) => {
    const updated = sections.map(sec => {
      if (sec.id === secId) {
        return { ...sec, widgets: sec.widgets.filter(w => w.id !== widgetId) };
      }
      return sec;
    });
    updateSectionsWithHistory(updated);
    if (selectedWidgetId === widgetId) {
      setSelectedWidgetId(null);
    }
    showBuilderToast('Element deleted');
  };

  // Copy / Paste Element
  const handleCopyWidget = (widget: CMSWidget) => {
    setCopiedWidget(widget);
    showBuilderToast(`Copied ${widget.title}`);
  };

  const handlePasteWidget = (targetSecId?: string) => {
    if (!copiedWidget) return;
    const targetSec = targetSecId ? sections.find(s => s.id === targetSecId) : currentSection;
    if (!targetSec) return;

    const pasted: CMSWidget = {
      ...copiedWidget,
      id: `w-${Date.now()}`,
      title: `${copiedWidget.title} (Pasted)`
    };

    const updated = sections.map(sec => {
      if (sec.id === targetSec.id) {
        return { ...sec, widgets: [...sec.widgets, pasted] };
      }
      return sec;
    });

    updateSectionsWithHistory(updated);
    setSelectedWidgetId(pasted.id);
    showBuilderToast('Element pasted');
  };

  // Copy / Paste Style
  const handleCopyStyle = (widget: CMSWidget) => {
    setCopiedStyle(widget.settings);
    showBuilderToast('Style copied to clipboard');
  };

  const handlePasteStyle = (widgetId: string) => {
    if (!copiedStyle || !currentSection) return;
    const updated = sections.map(sec => {
      if (sec.id === currentSection.id) {
        return {
          ...sec,
          widgets: sec.widgets.map(w => {
            if (w.id === widgetId) {
              return { ...w, settings: { ...w.settings, ...copiedStyle } };
            }
            return w;
          })
        };
      }
      return sec;
    });
    updateSectionsWithHistory(updated);
    showBuilderToast('Style pasted to element');
  };

  // Section Copy / Paste Style & Operations
  const handleCopySection = (sec: CMSSection) => {
    setCopiedSection(sec);
    showBuilderToast(`Section "${sec.name}" copied`);
  };

  const handleCopySectionStyle = (settings: any) => {
    setCopiedSectionStyle(settings);
    showBuilderToast('Section style copied to clipboard');
  };

  const handlePasteSectionStyle = (secId: string) => {
    if (!copiedSectionStyle) {
      showBuilderToast('No section style in clipboard');
      return;
    }
    const updated = sections.map(sec => {
      if (sec.id === secId) {
        return {
          ...sec,
          settings: { ...sec.settings, ...copiedSectionStyle }
        };
      }
      return sec;
    });
    updateSectionsWithHistory(updated);
    showBuilderToast('Section style applied');
  };

  // Move Widget Reordering
  const handleMoveWidget = (secId: string, widgetId: string, direction: 'up' | 'down') => {
    const updated = sections.map(sec => {
      if (sec.id === secId) {
        const idx = sec.widgets.findIndex(w => w.id === widgetId);
        if (idx === -1) return sec;
        const newIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (newIdx < 0 || newIdx >= sec.widgets.length) return sec;
        const reordered = [...sec.widgets];
        const [moved] = reordered.splice(idx, 1);
        reordered.splice(newIdx, 0, moved);
        return { ...sec, widgets: reordered };
      }
      return sec;
    });
    updateSectionsWithHistory(updated);
    showBuilderToast(`Element moved ${direction}`);
  };

  // Update Widget Content & Settings
  const handleUpdateCurrentWidget = (updates: Partial<CMSWidget>) => {
    if (!currentSection || !currentWidget) return;
    const updated = sections.map(sec => {
      if (sec.id === currentSection.id) {
        return {
          ...sec,
          widgets: sec.widgets.map(w => {
            if (w.id === currentWidget.id) {
              return { ...w, ...updates };
            }
            return w;
          })
        };
      }
      return sec;
    });
    setSections(updated);
    setHasUnsavedChanges(true);
    setAutosaveStatus('unsaved');
  };

  // Update Section Settings
  const handleUpdateCurrentSection = (updates: Partial<CMSSection>) => {
    if (!currentSection) return;
    const updated = sections.map(sec => {
      if (sec.id === currentSection.id) {
        return { ...sec, ...updates };
      }
      return sec;
    });
    setSections(updated);
    setHasUnsavedChanges(true);
    setAutosaveStatus('unsaved');
  };

  // Save as Template
  const handleSaveSectionAsTemplate = (sec: CMSSection) => {
    const newTemplate: CMSTemplate = {
      id: `tmpl-${Date.now()}`,
      title: `${sec.name} Template`,
      description: `Reusable section with ${sec.widgets.length} elements`,
      category: 'Saved Sections',
      thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&auto=format&fit=crop&q=80',
      sectionData: sec
    };
    const updated = [newTemplate, ...templates];
    setTemplates(updated);
    try {
      localStorage.setItem('ofixbaze_cms_templates', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    showBuilderToast('Saved section to Template Library');
  };

  // Insert Template into Page
  const handleInsertTemplate = (template: CMSTemplate) => {
    if (template.sectionData) {
      const newSec: CMSSection = {
        ...template.sectionData,
        id: `sec-${Date.now()}`,
        name: `${template.title}`,
        widgets: template.sectionData.widgets.map(w => ({
          ...w,
          id: `w-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
        }))
      };
      updateSectionsWithHistory([...sections, newSec]);
      setSelectedSectionId(newSec.id);
      showBuilderToast(`Inserted ${template.title}`);
    } else if (template.pageData) {
      updateSectionsWithHistory(template.pageData.sections);
      showBuilderToast(`Loaded page template: ${template.title}`);
    }
  };

  // Save Draft
  const handleSaveDraft = () => {
    if (!activePage) return;
    const updatedPage: CMSPage = {
      ...activePage,
      status: 'draft',
      updatedAt: 'Just now',
      revisions,
      sections
    };
    onSavePage(updatedPage);
    setHasUnsavedChanges(false);
    setAutosaveStatus('saved');
    showBuilderToast('Page draft saved successfully');
  };

  // Publish Page
  const handlePublish = () => {
    if (!activePage) return;
    if (sections.length === 0) {
      showBuilderToast('Cannot publish an empty page. Add at least one section.');
      return;
    }
    const totalWidgets = sections.reduce((acc, s) => acc + s.widgets.length, 0);
    if (totalWidgets === 0) {
      showBuilderToast('Sections cannot be empty. Please add widgets before publishing.');
      return;
    }

    const newRevision: CMSPageRevision = {
      id: `rev-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
      author: 'Super Admin',
      summary: `Published revision (${sections.length} sections, ${totalWidgets} elements)`,
      sections
    };
    const updatedRevisions = [newRevision, ...revisions];
    setRevisions(updatedRevisions);

    const updatedPage: CMSPage = {
      ...activePage,
      status: 'published',
      updatedAt: 'Just now',
      lastPublishedAt: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
      revisions: updatedRevisions,
      sections
    };
    onSavePage(updatedPage);
    setHasUnsavedChanges(false);
    setAutosaveStatus('saved');
    showBuilderToast('Page published live to storefront!');
  };

  // Restore revision
  const handleRestoreRevision = (rev: CMSPageRevision) => {
    updateSectionsWithHistory(rev.sections);
    setIsRevisionsOpen(false);
    showBuilderToast(`Restored version from ${rev.timestamp}`);
  };

  // HTML5 Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, type: CMSWidgetType) => {
    e.dataTransfer.setData('application/cms-widget-type', type);
  };

  const handleDragOver = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    setDropTargetSectionId(sectionId);
  };

  const handleDrop = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    const widgetType = e.dataTransfer.getData('application/cms-widget-type') as CMSWidgetType;
    if (widgetType) {
      handleAddWidget(widgetType, sectionId);
    }
    setDropTargetSectionId(null);
  };

  // Filtered widgets for Left Panel search & category filter
  const filteredWidgets = WIDGET_PALETTE.filter(w => {
    if (activeCategoryFilter !== 'all' && w.category !== activeCategoryFilter) {
      return false;
    }
    if (!widgetSearch) return true;
    const q = widgetSearch.toLowerCase();
    return w.label.toLowerCase().includes(q) || 
           w.description.toLowerCase().includes(q) || 
           w.category.toLowerCase().includes(q) ||
           Boolean(w.keywords && w.keywords.some(k => k.toLowerCase().includes(q)));
  });

  const getDeviceWidthClass = () => {
    switch (deviceMode) {
      case 'mobile':
        return 'w-[375px] max-w-full shadow-2xl rounded-2xl border-4 border-slate-700 my-4';
      case 'tablet':
        return 'w-[768px] max-w-full shadow-2xl rounded-xl border-4 border-slate-700 my-4';
      default:
        return 'w-full';
    }
  };

  return (
    <div className={`flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : 'h-[calc(100vh-64px)]'} bg-[#101418] text-slate-100 overflow-hidden select-none font-sans`}>
      {/* ----------------------------------------------------
          1. TOP APP BAR (WordPress / Elementor Header)
      ---------------------------------------------------- */}
      <header className="h-14 bg-[#191e23] border-b border-[#2c3338] px-4 flex items-center justify-between z-30 shrink-0">
        {/* Left: Brand & Page Switcher */}
        <div className="flex items-center gap-3">
          <button
            onClick={onExitBuilder}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2c3338] hover:bg-[#384148] text-slate-200 rounded-lg text-xs font-bold transition cursor-pointer"
          >
            <span>Exit to Dashboard</span>
          </button>

          <div className="h-4 w-px bg-slate-700" />

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">Page:</span>
            <select
              value={selectedPageId}
              onChange={(e) => setSelectedPageId(e.target.value)}
              className="bg-[#101418] border border-[#2c3338] rounded-lg px-2.5 py-1 text-xs font-bold text-white focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              {pages.map(page => (
                <option key={page.id} value={page.id}>
                  {page.title} ({page.status === 'published' ? 'Live' : 'Draft'})
                </option>
              ))}
            </select>
          </div>

          {/* Status Badge */}
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
            activePage.status === 'published' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${activePage.status === 'published' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span>{activePage.status === 'published' ? 'Published' : 'Draft'}</span>
          </span>

          {/* Autosave indicator */}
          <span className="text-[11px] text-slate-400 hidden lg:flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>{autosaveStatus === 'saving' ? 'Autosaving...' : autosaveStatus === 'unsaved' ? 'Unsaved edits' : 'All saved'}</span>
          </span>
        </div>

        {/* Center: Device Viewport Switcher, Width Presets, Zoom & History */}
        <div className="flex items-center gap-1 bg-[#101418] border border-[#2c3338] p-1 rounded-xl">
          <button
            onClick={() => { setDeviceMode('desktop'); setCustomViewportWidth(null); }}
            title="Desktop View (100% Full Width)"
            className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
              deviceMode === 'desktop' ? 'bg-orange-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span className="hidden sm:inline text-[11px]">Desktop</span>
          </button>
          <button
            onClick={() => { setDeviceMode('tablet'); setCustomViewportWidth('768px'); }}
            title="Tablet View (768px)"
            className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
              deviceMode === 'tablet' ? 'bg-orange-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tablet className="w-4 h-4" />
            <span className="hidden sm:inline text-[11px]">768px</span>
          </button>
          <button
            onClick={() => { setDeviceMode('mobile'); setCustomViewportWidth('375px'); }}
            title="Mobile View (375px)"
            className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
              deviceMode === 'mobile' ? 'bg-orange-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden sm:inline text-[11px]">375px</span>
          </button>

          {/* Viewport Width Preset Selector */}
          <select
            value={customViewportWidth || (deviceMode === 'desktop' ? '100%' : deviceMode === 'tablet' ? '768px' : '375px')}
            onChange={(e) => {
              const val = e.target.value;
              setCustomViewportWidth(val === '100%' ? null : val);
              if (val.includes('px')) {
                const pxVal = parseInt(val, 10);
                if (pxVal <= 480 && deviceMode !== 'mobile') setDeviceMode('mobile');
                else if (pxVal > 480 && pxVal <= 1024 && deviceMode !== 'tablet') setDeviceMode('tablet');
                else if (pxVal > 1024 && deviceMode !== 'desktop') setDeviceMode('desktop');
              } else if (val === '100%') {
                setDeviceMode('desktop');
              }
            }}
            title="Responsive Viewport Width"
            className="bg-[#191e23] border border-[#2c3338] text-slate-300 text-[11px] font-semibold px-2 py-1 rounded-lg cursor-pointer focus:outline-none focus:border-orange-500"
          >
            {deviceMode === 'desktop' && (
              <>
                <option value="100%">Desktop: 100% (Fluid)</option>
                <option value="1920px">Desktop: 1920px (Full HD)</option>
                <option value="1440px">Desktop: 1440px (Wide)</option>
                <option value="1280px">Desktop: 1280px (Standard)</option>
              </>
            )}
            {deviceMode === 'tablet' && (
              <>
                <option value="1024px">Tablet: 1024px (iPad Pro)</option>
                <option value="768px">Tablet: 768px (iPad Standard)</option>
              </>
            )}
            {deviceMode === 'mobile' && (
              <>
                <option value="414px">Mobile: 414px (iPhone Plus/Max)</option>
                <option value="390px">Mobile: 390px (iPhone 14/15)</option>
                <option value="375px">Mobile: 375px (iPhone SE / Standard)</option>
                <option value="360px">Mobile: 360px (Android Common)</option>
                <option value="320px">Mobile: 320px (Small)</option>
              </>
            )}
          </select>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          {/* Zoom Selector */}
          <select
            value={canvasZoom}
            onChange={(e) => setCanvasZoom(Number(e.target.value))}
            title="Canvas Zoom Level"
            className="bg-[#191e23] border border-[#2c3338] text-slate-300 text-[10px] font-bold px-1.5 py-0.5 rounded cursor-pointer focus:outline-none focus:border-orange-500"
          >
            <option value={50}>50%</option>
            <option value={75}>75%</option>
            <option value={90}>90%</option>
            <option value={100}>100%</option>
            <option value={110}>110%</option>
            <option value={125}>125%</option>
          </select>

          {/* Structure Outlines Toggle */}
          <button
            onClick={() => setShowStructureOutline(!showStructureOutline)}
            title={showStructureOutline ? 'Hide Structure Outlines' : 'Show Section & Widget Structure Outlines'}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              showStructureOutline ? 'bg-orange-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layout className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen Builder' : 'Fullscreen Builder'}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              isFullscreen ? 'bg-orange-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          {/* Undo / Redo */}
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            title="Undo (Ctrl+Z)"
            className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 rounded cursor-pointer"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            title="Redo (Ctrl+Y)"
            className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 rounded cursor-pointer"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Preview, Revisions & Publish Controls */}
        <div className="flex items-center gap-2">
          {/* Revisions History Modal Button */}
          <button
            onClick={() => setIsRevisionsOpen(true)}
            title="Revision History"
            className="px-2.5 py-1.5 bg-[#2c3338] hover:bg-[#384148] text-slate-300 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Revisions ({revisions.length})</span>
          </button>

          {/* Preview Clean Mode Toggle */}
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            title={isPreviewMode ? 'Exit Preview Mode' : 'Preview Live Website Layout'}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              isPreviewMode
                ? 'bg-blue-600 text-white shadow'
                : 'bg-[#2c3338] hover:bg-[#384148] text-slate-300'
            }`}
          >
            {isPreviewMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isPreviewMode ? 'Editing Mode' : 'Preview'}</span>
          </button>

          {/* Save Draft Button */}
          <button
            onClick={handleSaveDraft}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          {/* Publish Button */}
          <button
            onClick={handlePublish}
            className="px-4 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-extrabold uppercase tracking-wider transition flex items-center gap-1.5 shadow-md hover:shadow-orange-600/30 cursor-pointer active:scale-98"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Publish Page</span>
          </button>
        </div>
      </header>

      {/* ----------------------------------------------------
          2. MAIN WORKSPACE (Left Panel + Live Canvas + Right Inspector)
      ---------------------------------------------------- */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* ----------------------------------------------------
            LEFT SIDEBAR: WIDGET LIBRARY & NAVIGATOR
        ---------------------------------------------------- */}
        {!isPreviewMode && (
          <aside className="w-80 bg-[#191e23] border-r border-[#2c3338] flex flex-col shrink-0 z-20 text-xs select-none">
            {/* Left Tabs Bar */}
            <div className="flex border-b border-[#2c3338] bg-[#1d2327]">
              <button
                onClick={() => setLeftTab('widgets')}
                className={`flex-1 py-2.5 font-bold text-center cursor-pointer transition border-b-2 flex items-center justify-center gap-1.5 ${
                  leftTab === 'widgets'
                    ? 'border-orange-500 text-orange-400 bg-[#191e23]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Widgets</span>
              </button>

              <button
                onClick={() => setLeftTab('navigator')}
                className={`flex-1 py-2.5 font-bold text-center cursor-pointer transition border-b-2 flex items-center justify-center gap-1.5 ${
                  leftTab === 'navigator'
                    ? 'border-orange-500 text-orange-400 bg-[#191e23]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Tree ({sections.length})</span>
              </button>

              <button
                onClick={() => setLeftTab('templates')}
                className={`flex-1 py-2.5 font-bold text-center cursor-pointer transition border-b-2 flex items-center justify-center gap-1.5 ${
                  leftTab === 'templates'
                    ? 'border-orange-500 text-orange-400 bg-[#191e23]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Templates</span>
              </button>
            </div>

            {/* TAB 1: SEARCHABLE WIDGET PALETTE */}
            {leftTab === 'widgets' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Search Box & Category Filter Chips */}
                <div className="p-3 border-b border-[#2c3338] bg-[#13171a] space-y-2.5">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={widgetSearch}
                      onChange={(e) => setWidgetSearch(e.target.value)}
                      placeholder="Search widgets (heading, toner, rfq)..."
                      className="w-full pl-8 pr-3 py-1.5 bg-[#191e23] border border-[#2c3338] rounded-lg text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-orange-500"
                    />
                    {widgetSearch && (
                      <button
                        onClick={() => setWidgetSearch('')}
                        className="absolute right-2.5 top-2 text-slate-400 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar">
                    {(['all', 'content', 'layout', 'ecommerce', 'corporate', 'media', 'advanced'] as const).map(catKey => (
                      <button
                        key={catKey}
                        onClick={() => setActiveCategoryFilter(catKey)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize transition whitespace-nowrap cursor-pointer ${
                          activeCategoryFilter === catKey
                            ? 'bg-orange-600 text-white'
                            : 'bg-[#191e23] text-slate-400 hover:text-slate-200 border border-[#2c3338]'
                        }`}
                      >
                        {catKey}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Categories & Widget Cards */}
                <div className="flex-1 overflow-y-auto p-3 space-y-4">
                  {(['content', 'layout', 'ecommerce', 'corporate', 'media', 'advanced'] as const).map(catKey => {
                    const catWidgets = filteredWidgets.filter(w => w.category === catKey);
                    if (catWidgets.length === 0) return null;

                    const isExpanded = widgetSearch || activeCategoryFilter !== 'all' ? true : expandedCategories[catKey] ?? true;

                    return (
                      <div key={catKey} className="space-y-2">
                        <button
                          onClick={() => {
                            if (!widgetSearch) {
                              setExpandedCategories(prev => ({ ...prev, [catKey]: !prev[catKey] }));
                            }
                          }}
                          className="w-full flex items-center justify-between text-slate-400 hover:text-white font-bold text-[11px] uppercase tracking-wider py-1 border-b border-[#2c3338] cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5">
                            <span>{catKey}</span>
                            <span className="text-[10px] text-slate-500 font-normal">({catWidgets.length})</span>
                          </span>
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>

                        {isExpanded && (
                          <div className="grid grid-cols-2 gap-2">
                            {catWidgets.map(widget => {
                              const Icon = widget.icon;
                              return (
                                <div
                                  key={widget.type}
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, widget.type)}
                                  onClick={() => handleAddWidget(widget.type)}
                                  title={`${widget.description} (Drag onto canvas or click to add)`}
                                  className="p-2.5 bg-[#1d2327] hover:bg-[#252c32] hover:border-orange-500/50 border border-[#2c3338] rounded-xl flex flex-col items-center text-center gap-1.5 transition cursor-grab active:cursor-grabbing group shadow-xs"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-[#13171a] text-slate-300 group-hover:text-orange-400 group-hover:bg-orange-500/10 flex items-center justify-center transition">
                                    <Icon className="w-4 h-4" />
                                  </div>
                                  <span className="font-bold text-slate-200 group-hover:text-white text-[11px] leading-tight line-clamp-1">
                                    {widget.label}
                                  </span>
                                  <span className="text-[9px] text-slate-400 leading-none line-clamp-1">
                                    {widget.description}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: NAVIGATOR HIERARCHY TREE */}
            {leftTab === 'navigator' && (
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-[#2c3338]">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">DOM Tree Structure</span>
                  <button
                    onClick={() => handleAddSection()}
                    className="text-orange-400 hover:text-orange-300 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Section</span>
                  </button>
                </div>

                {sections.map((section, sIdx) => (
                  <div key={section.id} className="space-y-1">
                    <div
                      onClick={() => {
                        setSelectedSectionId(section.id);
                        setSelectedWidgetId(null);
                      }}
                      className={`p-2 rounded-lg border flex items-center justify-between cursor-pointer transition ${
                        selectedSectionId === section.id
                          ? 'bg-orange-500/15 border-orange-500 text-orange-400'
                          : 'bg-[#1d2327] border-[#2c3338] text-slate-300 hover:bg-[#252c32]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <Layers className="w-3.5 h-3.5 shrink-0" />
                        <span className="font-bold truncate">{section.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveSection(sIdx, 'up');
                          }}
                          disabled={sIdx === 0}
                          className="hover:text-white disabled:opacity-20 p-0.5"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveSection(sIdx, 'down');
                          }}
                          disabled={sIdx === sections.length - 1}
                          className="hover:text-white disabled:opacity-20 p-0.5"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSection(section.id);
                          }}
                          className="hover:text-rose-400 p-0.5 text-slate-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Section widgets */}
                    <div className="pl-4 space-y-1">
                      {section.widgets.map((w) => (
                        <div
                          key={w.id}
                          onClick={() => {
                            setSelectedSectionId(section.id);
                            setSelectedWidgetId(w.id);
                          }}
                          className={`p-1.5 rounded border text-[11px] flex items-center justify-between cursor-pointer transition ${
                            selectedWidgetId === w.id
                              ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                              : 'bg-[#13171a] border-[#2c3338] text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <span className="truncate">{w.title || w.type}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteWidget(section.id, w.id);
                            }}
                            className="hover:text-rose-400 p-0.5 text-slate-500"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: STARTER TEMPLATES */}
            {leftTab === 'templates' && (
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                <p className="text-[11px] text-slate-400 leading-snug">
                  1-Click Insert pre-built corporate blocks designed specifically for Ofixbaze enterprise requirements:
                </p>

                {templates.map(tmpl => (
                  <div
                    key={tmpl.id}
                    className="p-3 bg-[#1d2327] border border-[#2c3338] rounded-xl hover:border-orange-500/50 transition space-y-2"
                  >
                    <div className="aspect-video w-full rounded-lg bg-[#13171a] overflow-hidden">
                      <img src={tmpl.thumbnail} alt={tmpl.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs">{tmpl.title}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{tmpl.description}</p>
                    </div>
                    <button
                      onClick={() => handleInsertTemplate(tmpl)}
                      className="w-full py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-bold text-[11px] transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Insert Section</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </aside>
        )}

        {/* ----------------------------------------------------
            CENTER: LIVE WEBSITE CANVAS
        ---------------------------------------------------- */}
        <main className={`flex-1 bg-[#0b0e11] overflow-y-auto flex flex-col items-center select-text ${deviceMode === 'desktop' ? 'p-0' : 'p-4 sm:p-6'}`}>
          {deviceMode !== 'desktop' && (
            <div className="flex items-center gap-3 px-3 py-1 mb-3 bg-[#191e23] border border-[#2c3338] rounded-full text-xs text-slate-300 shadow-md select-none shrink-0">
              <span className="flex items-center gap-1.5 font-semibold">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <span>{deviceMode === 'tablet' ? 'Tablet Canvas (768px)' : 'Mobile Canvas (375px)'}</span>
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-[11px] text-slate-400">
                Responsive layouts, padding overrides & container max-widths active
              </span>
              <button
                onClick={() => setDeviceMode('desktop')}
                className="text-[10px] text-orange-400 hover:text-orange-300 font-semibold underline cursor-pointer ml-1"
              >
                Reset to Full Desktop
              </button>
            </div>
          )}

          <div 
            className={`transition-all duration-300 bg-white text-slate-900 min-h-[85vh] ${customViewportWidth ? 'shadow-2xl rounded-xl border-4 border-slate-700 my-4' : getDeviceWidthClass()} ${showStructureOutline ? 'ring-2 ring-blue-500/50' : ''}`}
            style={{
              ...(customViewportWidth ? { width: customViewportWidth, maxWidth: '100%' } : {}),
              ...(canvasZoom !== 100 ? { transform: `scale(${canvasZoom / 100})`, transformOrigin: 'top center' } : {})
            }}
          >
            {sections.length === 0 ? (
              <div className="p-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
                  <Wand2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900">This page canvas is empty</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Drag any element from the left library or click below to generate your first corporate section.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => handleAddSection('1-col')}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    1-Column Section
                  </button>
                  <button
                    onClick={() => handleAddSection('2-col-equal')}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs transition cursor-pointer"
                  >
                    2-Columns (50/50)
                  </button>
                  <button
                    onClick={() => handleAddSection('3-col-equal')}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs transition cursor-pointer"
                  >
                    3-Columns (33/33/33)
                  </button>
                </div>
              </div>
            ) : (
              sections.map((section, secIdx) => {
                const isSectionSelected = selectedSectionId === section.id && !isPreviewMode;
                const isDropTarget = dropTargetSectionId === section.id;

                return (
                  <div
                    key={section.id}
                    onDragOver={(e) => handleDragOver(e, section.id)}
                    onDrop={(e) => handleDrop(e, section.id)}
                    className={`relative transition-all ${isDropTarget ? 'ring-4 ring-orange-500 bg-orange-500/5' : ''}`}
                  >
                    {/* Section Renderer */}
                    <CMSSectionRenderer
                      section={section}
                      products={products}
                      categories={categories}
                      currency={currency}
                      setActivePage={setActivePage}
                      slides={slides}
                      isBuilderMode={!isPreviewMode}
                      selectedSectionId={selectedSectionId}
                      selectedWidgetId={selectedWidgetId}
                      onSelectSection={(secId) => {
                        setSelectedSectionId(secId);
                        setSelectedWidgetId(null);
                      }}
                      onSelectWidget={(secId, wId) => {
                        setSelectedSectionId(secId);
                        setSelectedWidgetId(wId);
                      }}
                      onUpdateWidgetContent={(wId, updates) => {
                        handleUpdateCurrentWidget({
                          content: { ...currentWidget?.content, ...updates }
                        });
                      }}
                      onDuplicateWidget={handleDuplicateWidget}
                      onDeleteWidget={handleDeleteWidget}
                      onMoveWidget={handleMoveWidget}
                      onCopyWidget={handleCopyWidget}
                      onCopyWidgetStyle={handleCopyStyle}
                      onPasteWidgetStyle={handlePasteStyle}
                      onMoveSection={(dir) => handleMoveSection(secIdx, dir)}
                      onDuplicateSection={() => handleDuplicateSection(section)}
                      onDeleteSection={() => handleDeleteSection(section.id)}
                      onCopySection={() => handleCopySection(section)}
                      onCopySectionStyle={() => handleCopySectionStyle(section.settings)}
                      onPasteSectionStyle={() => handlePasteSectionStyle(section.id)}
                      onSaveSectionAsTemplate={() => handleSaveSectionAsTemplate(section)}
                      canMoveUp={secIdx > 0}
                      canMoveDown={secIdx < sections.length - 1}
                      hasCopiedWidgetStyle={!!copiedStyle}
                      hasCopiedSectionStyle={!!copiedSectionStyle}
                      deviceMode={deviceMode}
                    />

                    {/* Drop target indicator */}
                    {isDropTarget && (
                      <div className="absolute inset-0 border-2 border-dashed border-orange-500 bg-orange-500/10 pointer-events-none flex items-center justify-center">
                        <span className="bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                          Drop Widget Here
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {/* Bottom Add Section Bar */}
            {!isPreviewMode && (
              <div className="p-8 bg-slate-100 border-t-2 border-dashed border-slate-300 text-center space-y-3">
                <p className="text-xs font-bold text-slate-500">Insert New Structure to Canvas</p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() => handleAddSection('1-col')}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>1 Column</span>
                  </button>
                  <button
                    onClick={() => handleAddSection('2-col-equal')}
                    className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold shadow-xs cursor-pointer transition"
                  >
                    2 Columns (50/50)
                  </button>
                  <button
                    onClick={() => handleAddSection('3-col-equal')}
                    className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold shadow-xs cursor-pointer transition"
                  >
                    3 Columns
                  </button>
                  <button
                    onClick={() => handleAddSection('4-col-equal')}
                    className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold shadow-xs cursor-pointer transition"
                  >
                    4 Columns
                  </button>
                  <button
                    onClick={() => handleAddSection('30-70')}
                    className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold shadow-xs cursor-pointer transition"
                  >
                    Sidebar + Content (30/70)
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* ----------------------------------------------------
            RIGHT SIDEBAR: ELEMENTOR-STYLE INSPECTOR (5 TABS)
        ---------------------------------------------------- */}
        {!isPreviewMode && (
          <aside className="w-80 bg-[#191e23] border-l border-[#2c3338] flex flex-col shrink-0 z-20 text-xs select-none">
            {/* 5 Inspector Navigation Tabs */}
            <div className="flex border-b border-[#2c3338] bg-[#1d2327]">
              <button
                onClick={() => setInspectorTab('content')}
                className={`flex-1 py-2.5 font-bold text-center cursor-pointer transition border-b-2 flex flex-col items-center gap-0.5 ${
                  inspectorTab === 'content'
                    ? 'border-orange-500 text-orange-400 bg-[#191e23]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="text-[10px]">Content</span>
              </button>

              <button
                onClick={() => setInspectorTab('style')}
                className={`flex-1 py-2.5 font-bold text-center cursor-pointer transition border-b-2 flex flex-col items-center gap-0.5 ${
                  inspectorTab === 'style'
                    ? 'border-orange-500 text-orange-400 bg-[#191e23]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span className="text-[10px]">Style</span>
              </button>

              <button
                onClick={() => setInspectorTab('spacing')}
                className={`flex-1 py-2.5 font-bold text-center cursor-pointer transition border-b-2 flex flex-col items-center gap-0.5 ${
                  inspectorTab === 'spacing'
                    ? 'border-orange-500 text-orange-400 bg-[#191e23]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span className="text-[10px]">Spacing</span>
              </button>

              <button
                onClick={() => setInspectorTab('device')}
                className={`flex-1 py-2.5 font-bold text-center cursor-pointer transition border-b-2 flex flex-col items-center gap-0.5 ${
                  inspectorTab === 'device'
                    ? 'border-orange-500 text-orange-400 bg-[#191e23]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="text-[10px]">Device</span>
              </button>

              <button
                onClick={() => setInspectorTab('advanced')}
                className={`flex-1 py-2.5 font-bold text-center cursor-pointer transition border-b-2 flex flex-col items-center gap-0.5 ${
                  inspectorTab === 'advanced'
                    ? 'border-orange-500 text-orange-400 bg-[#191e23]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span className="text-[10px]">Advanced</span>
              </button>
            </div>

            {/* Inspector Form Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentWidget ? (
                <>
                  {/* Active Widget Identifier Badge */}
                  <div className="p-2.5 bg-[#13171a] rounded-xl border border-[#2c3338] flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-orange-400 uppercase tracking-wider block">Target Element</span>
                      <strong className="text-white text-xs capitalize">{currentWidget.type.replace('_', ' ')}</strong>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopyWidget(currentWidget)}
                        title="Copy Widget"
                        className="p-1 bg-[#1d2327] hover:bg-[#252c32] rounded text-slate-300"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleCopyStyle(currentWidget)}
                        title="Copy Style"
                        className="p-1 bg-[#1d2327] hover:bg-[#252c32] rounded text-slate-300"
                      >
                        <Palette className="w-3 h-3" />
                      </button>
                      {copiedStyle && (
                        <button
                          onClick={() => handlePasteStyle(currentWidget.id)}
                          title="Paste Style"
                          className="p-1 bg-blue-600 hover:bg-blue-500 rounded text-white"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* TAB 1: CONTENT */}
                  {inspectorTab === 'content' && (
                    <div className="space-y-3.5">
                      {/* Alignment & Quick Text Controls */}
                      <div className="bg-[#181d22] p-2.5 rounded-lg border border-[#2c3338] space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-slate-300 font-bold text-xs flex items-center gap-1.5">
                            <AlignLeft className="w-3.5 h-3.5 text-orange-400" />
                            <span>Heading &amp; Text Alignment</span>
                          </label>
                          {(currentWidget.content.badge || currentWidget.content.text || currentWidget.content.subtext) && (
                            <button
                              type="button"
                              onClick={() => handleUpdateCurrentWidget({
                                content: {
                                  ...currentWidget.content,
                                  badge: '',
                                  text: '',
                                  subtext: ''
                                }
                              })}
                              className="text-[11px] text-rose-400 hover:text-rose-300 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                              title="Clear all heading, badge, and subtitle text"
                            >
                              <X className="w-3 h-3" />
                              <span>Clear All Text</span>
                            </button>
                          )}
                        </div>

                        {/* Alignment Buttons: Left, Center, Right, Justify */}
                        <div className="grid grid-cols-4 gap-1 bg-[#13171a] p-1 rounded-lg border border-[#2c3338]">
                          {([
                            { id: 'left', label: 'Left', icon: AlignLeft },
                            { id: 'center', label: 'Center', icon: AlignCenter },
                            { id: 'right', label: 'Right', icon: AlignRight },
                            { id: 'justify', label: 'Justify', icon: AlignJustify }
                          ] as const).map(({ id, label, icon: Icon }) => (
                            <button
                              key={id}
                              type="button"
                              onClick={() => handleUpdateCurrentWidget({
                                settings: { ...currentWidget.settings, textAlign: id }
                              })}
                              className={`py-1.5 px-2 rounded flex items-center justify-center gap-1 text-xs font-semibold transition cursor-pointer ${
                                (currentWidget.settings.textAlign || 'left') === id
                                  ? 'bg-orange-600 text-white shadow-xs'
                                  : 'text-slate-400 hover:text-white hover:bg-[#252c32]'
                              }`}
                              title={`Align ${label}`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                              <span className="text-[10px]">{label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Badge / Tagline */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-slate-400 font-semibold text-xs">Badge / Eyebrow Text</label>
                          {currentWidget.content.badge && (
                            <button
                              type="button"
                              onClick={() => handleUpdateCurrentWidget({
                                content: { ...currentWidget.content, badge: '' }
                              })}
                              className="text-[10px] text-slate-500 hover:text-rose-400 cursor-pointer"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={currentWidget.content.badge || ''}
                          onChange={(e) => handleUpdateCurrentWidget({
                            content: { ...currentWidget.content, badge: e.target.value }
                          })}
                          placeholder="e.g. 100% GENUINE OEM (Leave blank to remove)"
                          className="w-full px-3 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white focus:outline-none focus:border-orange-500 text-xs"
                        />
                      </div>

                      {/* Main Title / Headline */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-slate-400 font-semibold text-xs">Main Heading / Title</label>
                          {currentWidget.content.text && (
                            <button
                              type="button"
                              onClick={() => handleUpdateCurrentWidget({
                                content: { ...currentWidget.content, text: '' }
                              })}
                              className="text-[10px] text-slate-500 hover:text-rose-400 cursor-pointer"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                        <textarea
                          rows={2}
                          value={currentWidget.content.text || ''}
                          onChange={(e) => handleUpdateCurrentWidget({
                            content: { ...currentWidget.content, text: e.target.value }
                          })}
                          placeholder="Enter headline... (Leave blank to remove)"
                          className="w-full px-3 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white focus:outline-none focus:border-orange-500 text-xs"
                        />
                      </div>

                      {/* Subtext / Description */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-slate-400 font-semibold text-xs">Subtext / Paragraph</label>
                          {currentWidget.content.subtext && (
                            <button
                              type="button"
                              onClick={() => handleUpdateCurrentWidget({
                                content: { ...currentWidget.content, subtext: '' }
                              })}
                              className="text-[10px] text-slate-500 hover:text-rose-400 cursor-pointer"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                        <textarea
                          rows={3}
                          value={currentWidget.content.subtext || ''}
                          onChange={(e) => handleUpdateCurrentWidget({
                            content: { ...currentWidget.content, subtext: e.target.value }
                          })}
                          placeholder="Enter supporting paragraph text... (Leave blank to remove)"
                          className="w-full px-3 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white focus:outline-none focus:border-orange-500 text-xs"
                        />
                      </div>

                      {/* Image Source with Media Library Picker & Alt Text */}
                      {(currentWidget.type === 'image' || currentWidget.type === 'hero_banner') && (
                        <div className="space-y-3 pt-2 border-t border-[#2c3338]">
                          <div>
                            <label className="block text-slate-400 font-semibold mb-1">Image Asset</label>
                            {currentWidget.content.imageUrl && (
                              <div className="mb-2 relative rounded-lg overflow-hidden border border-[#2c3338] bg-[#101418] max-h-32 flex items-center justify-center">
                                <img 
                                  src={currentWidget.content.imageUrl} 
                                  alt="Preview" 
                                  className="max-h-32 object-contain"
                                />
                              </div>
                            )}
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={currentWidget.content.imageUrl || ''}
                                onChange={(e) => handleUpdateCurrentWidget({
                                  content: { ...currentWidget.content, imageUrl: e.target.value }
                                })}
                                placeholder="Image URL or pick from library..."
                                className="flex-1 px-2.5 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white font-mono text-[11px]"
                              />
                              <button
                                onClick={() => {
                                  setMediaTargetField('widget-image');
                                  setIsMediaPickerOpen(true);
                                }}
                                className="px-2.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-bold flex items-center gap-1 cursor-pointer shrink-0"
                                title="Pick from Media Library"
                              >
                                <ImageIcon className="w-3.5 h-3.5" />
                                <span>Library</span>
                              </button>
                            </div>
                          </div>

                          {/* Quick Preset Images */}
                          <div>
                            <span className="text-[10px] text-slate-500 font-semibold block mb-1">Quick Corporate Presets:</span>
                            <div className="grid grid-cols-3 gap-1">
                              <button
                                type="button"
                                onClick={() => handleUpdateCurrentWidget({
                                  content: {
                                    ...currentWidget.content,
                                    imageUrl: '/public/executive-tables-banner.jpg',
                                    altText: 'Executive Boardroom Furniture and Desks'
                                  }
                                })}
                                className="p-1 text-[10px] bg-[#191e23] hover:bg-[#252c32] text-slate-300 rounded border border-[#2c3338] text-center truncate cursor-pointer"
                              >
                                Boardroom
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateCurrentWidget({
                                  content: {
                                    ...currentWidget.content,
                                    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
                                    altText: 'Modern Corporate Office Workspace'
                                  }
                                })}
                                className="p-1 text-[10px] bg-[#191e23] hover:bg-[#252c32] text-slate-300 rounded border border-[#2c3338] text-center truncate cursor-pointer"
                              >
                                Workspace
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateCurrentWidget({
                                  content: {
                                    ...currentWidget.content,
                                    imageUrl: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=1200&q=80',
                                    altText: 'Certified OEM Laser Toner Cartridges'
                                  }
                                })}
                                className="p-1 text-[10px] bg-[#191e23] hover:bg-[#252c32] text-slate-300 rounded border border-[#2c3338] text-center truncate cursor-pointer"
                              >
                                OEM Toners
                              </button>
                            </div>
                          </div>

                          {/* Alt Text (SEO & Accessibility) */}
                          <div>
                            <label className="block text-slate-400 font-semibold mb-1">Alt Text (SEO & Accessibility)</label>
                            <input
                              type="text"
                              value={currentWidget.content.altText || ''}
                              onChange={(e) => handleUpdateCurrentWidget({
                                content: { ...currentWidget.content, altText: e.target.value }
                              })}
                              placeholder="Describe image for screen readers & Google SEO..."
                              className="w-full px-2.5 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white text-xs"
                            />
                          </div>

                          {/* Image Caption / Title */}
                          <div>
                            <label className="block text-slate-400 font-semibold mb-1">Caption / Overlay Text</label>
                            <input
                              type="text"
                              value={currentWidget.content.imageTitle || ''}
                              onChange={(e) => handleUpdateCurrentWidget({
                                content: { ...currentWidget.content, imageTitle: e.target.value }
                              })}
                              placeholder="Optional caption displayed under or on image..."
                              className="w-full px-2.5 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white text-xs"
                            />
                          </div>

                          {/* Image Link URL */}
                          <div>
                            <label className="block text-slate-400 font-semibold mb-1">Link URL (Optional)</label>
                            <div className="space-y-1.5">
                              <input
                                type="text"
                                value={currentWidget.content.imageLink || currentWidget.content.buttonUrl || ''}
                                onChange={(e) => handleUpdateCurrentWidget({
                                  content: { ...currentWidget.content, imageLink: e.target.value }
                                })}
                                placeholder="e.g. /shop, /rfq, https://..."
                                className="w-full px-2.5 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white font-mono text-[11px]"
                              />
                              <label className="flex items-center gap-2 cursor-pointer text-slate-400 text-xs">
                                <input
                                  type="checkbox"
                                  checked={!!currentWidget.settings.openInNewTab}
                                  onChange={(e) => handleUpdateCurrentWidget({
                                    settings: { ...currentWidget.settings, openInNewTab: e.target.checked }
                                  })}
                                  className="w-3.5 h-3.5 accent-orange-600 rounded"
                                />
                                <span>Open link in new browser tab</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Button Controls */}
                      {(currentWidget.type === 'button' || currentWidget.type === 'cta_banner' || currentWidget.type === 'hero_banner') && (
                        <div className="space-y-2 pt-2 border-t border-[#2c3338]">
                          <div>
                            <label className="block text-slate-400 font-semibold mb-1">Button Text</label>
                            <input
                              type="text"
                              value={currentWidget.content.buttonText || ''}
                              onChange={(e) => handleUpdateCurrentWidget({
                                content: { ...currentWidget.content, buttonText: e.target.value }
                              })}
                              className="w-full px-3 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-400 font-semibold mb-1">Button Link (URL)</label>
                            <input
                              type="text"
                              value={currentWidget.content.buttonUrl || ''}
                              onChange={(e) => handleUpdateCurrentWidget({
                                content: { ...currentWidget.content, buttonUrl: e.target.value }
                              })}
                              placeholder="e.g. /rfq, /shop"
                              className="w-full px-3 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white font-mono text-[11px]"
                            />
                          </div>
                        </div>
                      )}

                      {/* Product Specific Controls (Grids) */}
                      {(currentWidget.type === 'product_grid' || currentWidget.type === 'featured_products' || currentWidget.type === 'latest_products' || currentWidget.type === 'bestseller_products') && (
                        <div className="space-y-3 pt-2 border-t border-[#2c3338]">
                          <div>
                            <label className="block text-slate-400 font-semibold mb-1">Filter by Category</label>
                            <select
                              value={currentWidget.settings.productCategory || 'all'}
                              onChange={(e) => handleUpdateCurrentWidget({
                                settings: { ...currentWidget.settings, productCategory: e.target.value }
                              })}
                              className="w-full px-3 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white text-xs"
                            >
                              <option value="all">All Products</option>
                              {categories.map(c => (
                                <option key={c.id} value={c.slug}>{c.name}</option>
                              ))}
                            </select>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-slate-400 font-semibold mb-1">Items Limit</label>
                              <input
                                type="number"
                                value={currentWidget.settings.productsLimit || 8}
                                onChange={(e) => handleUpdateCurrentWidget({
                                  settings: { ...currentWidget.settings, productsLimit: Number(e.target.value) }
                                })}
                                className="w-full px-2.5 py-1.5 bg-[#13171a] border border-[#2c3338] rounded text-white text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-400 font-semibold mb-1">Columns</label>
                              <select
                                value={currentWidget.settings.columnsCount || 4}
                                onChange={(e) => handleUpdateCurrentWidget({
                                  settings: { ...currentWidget.settings, columnsCount: Number(e.target.value) }
                                })}
                                className="w-full px-2.5 py-1.5 bg-[#13171a] border border-[#2c3338] rounded text-white text-xs"
                              >
                                <option value={2}>2 Columns</option>
                                <option value={3}>3 Columns</option>
                                <option value={4}>4 Columns</option>
                                <option value={5}>5 Columns</option>
                                <option value={6}>6 Columns</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Category Grid Specific Controls (Add / Remove Categories, Columns, Limit, Border Radius) */}
                      {(currentWidget.type === 'category_grid' || currentWidget.type === 'product_categories') && (
                        <div className="space-y-3.5 pt-2 border-t border-[#2c3338]">
                          {/* Columns & Limit */}
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-slate-400 font-semibold mb-1">Columns</label>
                              <select
                                value={currentWidget.settings.columnsCount || 6}
                                onChange={(e) => handleUpdateCurrentWidget({
                                  settings: { ...currentWidget.settings, columnsCount: Number(e.target.value) }
                                })}
                                className="w-full px-2.5 py-1.5 bg-[#13171a] border border-[#2c3338] rounded text-white text-xs"
                              >
                                <option value={2}>2 Columns</option>
                                <option value={3}>3 Columns</option>
                                <option value={4}>4 Columns</option>
                                <option value={5}>5 Columns</option>
                                <option value={6}>6 Columns</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-slate-400 font-semibold mb-1">Max Items Limit</label>
                              <input
                                type="number"
                                placeholder="All (or number)"
                                value={currentWidget.settings.categoriesLimit || ''}
                                onChange={(e) => handleUpdateCurrentWidget({
                                  settings: { ...currentWidget.settings, categoriesLimit: e.target.value ? Number(e.target.value) : undefined }
                                })}
                                className="w-full px-2.5 py-1.5 bg-[#13171a] border border-[#2c3338] rounded text-white text-xs"
                              />
                            </div>
                          </div>

                          {/* Quick Toggle: Show Item Count */}
                          <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-xs py-1">
                            <input
                              type="checkbox"
                              checked={currentWidget.settings.showItemCount !== false}
                              onChange={(e) => handleUpdateCurrentWidget({
                                settings: { ...currentWidget.settings, showItemCount: e.target.checked }
                              })}
                              className="w-3.5 h-3.5 accent-orange-600 rounded cursor-pointer"
                            />
                            <span>Show Product Count Badge ("22 items")</span>
                          </label>

                          {/* Card Border Radius Control */}
                          <div className="p-2.5 bg-[#13171a] border border-[#2c3338] rounded-lg">
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="text-slate-300 font-semibold text-xs">Card Border Radius</label>
                              <span className="text-orange-400 font-mono text-xs font-bold">
                                {(currentWidget.settings.categoryCardBorderRadius ?? currentWidget.settings.borderRadius ?? 12)}px
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="32"
                              step="2"
                              value={currentWidget.settings.categoryCardBorderRadius ?? currentWidget.settings.borderRadius ?? 12}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                handleUpdateCurrentWidget({
                                  settings: {
                                    ...currentWidget.settings,
                                    borderRadius: val,
                                    categoryCardBorderRadius: val
                                  }
                                });
                              }}
                              className="w-full accent-orange-500 cursor-pointer h-1.5 bg-[#252c32] rounded-lg"
                            />
                            <div className="grid grid-cols-5 gap-1 mt-2">
                              {[
                                { label: 'Sharp', val: 0 },
                                { label: '6px', val: 6 },
                                { label: '12px', val: 12 },
                                { label: '16px', val: 16 },
                                { label: '24px', val: 24 }
                              ].map(preset => (
                                <button
                                  key={preset.val}
                                  type="button"
                                  onClick={() => handleUpdateCurrentWidget({
                                    settings: {
                                      ...currentWidget.settings,
                                      borderRadius: preset.val,
                                      categoryCardBorderRadius: preset.val
                                    }
                                  })}
                                  className={`py-1 text-[10px] rounded border text-center transition cursor-pointer ${
                                    (currentWidget.settings.categoryCardBorderRadius ?? currentWidget.settings.borderRadius ?? 12) === preset.val
                                      ? 'bg-orange-600 border-orange-500 text-white font-bold'
                                      : 'bg-[#191e23] border-[#2c3338] text-slate-400 hover:text-white'
                                  }`}
                                >
                                  {preset.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* CATEGORY SELECTION: ADD / REMOVE CATEGORIES */}
                          <div className="pt-2 border-t border-[#2c3338]">
                            {(() => {
                              const selectedSlugs = currentWidget.settings.selectedCategorySlugs ?? categories.map(c => c.slug);
                              const filteredList = categories.filter(c => 
                                !categorySearchQuery || 
                                c.name.toLowerCase().includes(categorySearchQuery.toLowerCase()) || 
                                c.slug.toLowerCase().includes(categorySearchQuery.toLowerCase())
                              );

                              const handleToggleCategory = (slug: string) => {
                                const isCurrentlySelected = selectedSlugs.includes(slug);
                                const newSlugs = isCurrentlySelected
                                  ? selectedSlugs.filter(s => s !== slug)
                                  : [...selectedSlugs, slug];
                                handleUpdateCurrentWidget({
                                  settings: { ...currentWidget.settings, selectedCategorySlugs: newSlugs }
                                });
                              };

                              const handleSelectAll = () => {
                                handleUpdateCurrentWidget({
                                  settings: { ...currentWidget.settings, selectedCategorySlugs: categories.map(c => c.slug) }
                                });
                              };

                              const handleClearAll = () => {
                                handleUpdateCurrentWidget({
                                  settings: { ...currentWidget.settings, selectedCategorySlugs: [] }
                                });
                              };

                              return (
                                <div>
                                  <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-slate-200 font-bold text-xs flex items-center gap-1.5">
                                      <Layers className="w-3.5 h-3.5 text-orange-400" />
                                      <span>Categories ({selectedSlugs.length}/{categories.length} active)</span>
                                    </label>
                                    <div className="flex items-center gap-1.5 text-[11px]">
                                      <button
                                        type="button"
                                        onClick={handleSelectAll}
                                        className="text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
                                      >
                                        Select All
                                      </button>
                                      <span className="text-slate-600">•</span>
                                      <button
                                        type="button"
                                        onClick={handleClearAll}
                                        className="text-slate-400 hover:text-red-400 font-medium cursor-pointer"
                                      >
                                        Clear
                                      </button>
                                    </div>
                                  </div>

                                  <p className="text-[11px] text-slate-400 mb-2">
                                    Check or uncheck categories below to add or remove them from this section.
                                  </p>

                                  {/* Filter input */}
                                  <div className="relative mb-2">
                                    <Search className="w-3 h-3 text-slate-500 absolute left-2.5 top-2.5" />
                                    <input
                                      type="text"
                                      value={categorySearchQuery}
                                      onChange={(e) => setCategorySearchQuery(e.target.value)}
                                      placeholder="Filter categories..."
                                      className="w-full pl-7 pr-7 py-1 bg-[#13171a] border border-[#2c3338] rounded-md text-white text-[11px] focus:outline-none focus:border-orange-500"
                                    />
                                    {categorySearchQuery && (
                                      <button
                                        type="button"
                                        onClick={() => setCategorySearchQuery('')}
                                        className="absolute right-2 top-2 text-slate-400 hover:text-white"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>

                                  {/* Categories checklist */}
                                  <div className="max-h-56 overflow-y-auto space-y-1 pr-1 border border-[#2c3338] rounded-lg p-1.5 bg-[#13171a]">
                                    {filteredList.map(cat => {
                                      const isSelected = selectedSlugs.includes(cat.slug) || selectedSlugs.includes(cat.id);
                                      const count = products.filter(p => isProductInCategory(p, cat.slug)).length;
                                      return (
                                        <div
                                          key={cat.id}
                                          onClick={() => handleToggleCategory(cat.slug)}
                                          className={`flex items-center gap-2.5 p-1.5 rounded cursor-pointer transition select-none ${
                                            isSelected
                                              ? 'bg-orange-500/15 border border-orange-500/40 text-white'
                                              : 'hover:bg-[#1a2024] border border-transparent text-slate-400 hover:text-slate-200 opacity-60 hover:opacity-100'
                                          }`}
                                        >
                                          <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => {}} // Handled by parent container click
                                            className="w-3.5 h-3.5 accent-orange-600 rounded cursor-pointer shrink-0 pointer-events-none"
                                          />
                                          <div className="w-7 h-7 rounded bg-slate-800 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
                                            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <span className="text-xs font-semibold block truncate leading-tight">
                                              {cat.name}
                                            </span>
                                            <span className="text-[10px] text-slate-500 block leading-tight">
                                              {count} {count === 1 ? 'item' : 'items'}
                                            </span>
                                          </div>
                                          {isSelected ? (
                                            <span className="text-[10px] font-bold text-orange-400 shrink-0 bg-orange-950/60 px-1.5 py-0.5 rounded border border-orange-800/50">
                                              Visible
                                            </span>
                                          ) : (
                                            <span className="text-[10px] text-slate-500 shrink-0">
                                              Hidden
                                            </span>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>

                                  {/* Create new category inline */}
                                  <div className="mt-2.5">
                                    {!isAddingNewCatInline ? (
                                      <button
                                        type="button"
                                        onClick={() => setIsAddingNewCatInline(true)}
                                        className="w-full py-1.5 px-3 bg-[#191e23] hover:bg-[#252c32] text-slate-300 hover:text-white rounded-lg border border-[#2c3338] text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition"
                                      >
                                        <Plus className="w-3.5 h-3.5 text-orange-400" />
                                        <span>+ Add New Category</span>
                                      </button>
                                    ) : (
                                      <div className="p-3 bg-[#171b1f] border border-orange-500/40 rounded-lg space-y-2">
                                        <div className="flex items-center justify-between">
                                          <span className="text-xs font-bold text-orange-400 flex items-center gap-1">
                                            <Plus className="w-3.5 h-3.5" />
                                            Create New Category
                                          </span>
                                          <button
                                            type="button"
                                            onClick={() => setIsAddingNewCatInline(false)}
                                            className="text-slate-400 hover:text-white"
                                          >
                                            <X className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                        <div>
                                          <label className="block text-[10px] text-slate-400 mb-0.5">Category Name</label>
                                          <input
                                            type="text"
                                            placeholder="e.g. Paper Shredders"
                                            value={newCatName}
                                            onChange={(e) => setNewCatName(e.target.value)}
                                            className="w-full px-2.5 py-1 bg-[#101418] border border-[#2c3338] rounded text-xs text-white focus:outline-none focus:border-orange-500"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-[10px] text-slate-400 mb-0.5">Image URL (optional)</label>
                                          <input
                                            type="text"
                                            placeholder="https://... or leave blank"
                                            value={newCatImage}
                                            onChange={(e) => setNewCatImage(e.target.value)}
                                            className="w-full px-2.5 py-1 bg-[#101418] border border-[#2c3338] rounded text-xs text-white font-mono text-[10px] focus:outline-none focus:border-orange-500"
                                          />
                                        </div>
                                        <div className="flex items-center gap-2 pt-1">
                                          <button
                                            type="button"
                                            disabled={!newCatName.trim()}
                                            onClick={() => {
                                              if (!newCatName.trim()) return;
                                              const slug = newCatName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
                                              const newCat: Category = {
                                                id: `cat-${Date.now()}`,
                                                name: newCatName.trim(),
                                                slug: slug,
                                                iconName: 'Folder',
                                                itemCount: 0,
                                                image: newCatImage.trim() || 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=600&q=80',
                                                description: `Certified ${newCatName.trim()} for corporate office environments.`,
                                                subcategories: []
                                              };
                                              if (onAddCategory) {
                                                onAddCategory(newCat);
                                              }
                                              // Add to current widget's selected list
                                              const updatedSlugs = [...selectedSlugs, slug];
                                              handleUpdateCurrentWidget({
                                                settings: { ...currentWidget.settings, selectedCategorySlugs: updatedSlugs }
                                              });
                                              setNewCatName('');
                                              setNewCatImage('');
                                              setIsAddingNewCatInline(false);
                                            }}
                                            className="flex-1 py-1.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-white rounded text-xs font-bold cursor-pointer transition"
                                          >
                                            Save & Add to Grid
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => setIsAddingNewCatInline(false)}
                                            className="py-1.5 px-3 bg-[#252c32] hover:bg-[#2e373e] text-slate-300 rounded text-xs cursor-pointer"
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      )}

                      {/* BANNER SLIDER & HERO CAROUSEL CONTROLS */}
                      {(currentWidget.type === 'banner_slider' || currentWidget.type === 'hero_slider') && (
                        <div className="space-y-4 pt-3 border-t border-[#2c3338]">
                          {/* Source Mode Switcher */}
                          <div>
                            <label className="block text-slate-400 font-semibold mb-1.5 text-xs">
                              Slider Content Source
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => handleUpdateCurrentWidget({
                                  settings: { ...currentWidget.settings, sliderSource: 'homepage-hero' }
                                })}
                                className={`px-2.5 py-2 rounded-lg text-xs font-bold border transition text-center cursor-pointer ${
                                  (currentWidget.settings.sliderSource !== 'custom')
                                    ? 'bg-orange-600/20 text-orange-400 border-orange-500/50'
                                    : 'bg-[#13171a] text-slate-400 border-[#2c3338] hover:text-white'
                                }`}
                              >
                                Admin Banners Sync
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateCurrentWidget({
                                  settings: { ...currentWidget.settings, sliderSource: 'custom' }
                                })}
                                className={`px-2.5 py-2 rounded-lg text-xs font-bold border transition text-center cursor-pointer ${
                                  currentWidget.settings.sliderSource === 'custom'
                                    ? 'bg-orange-600/20 text-orange-400 border-orange-500/50'
                                    : 'bg-[#13171a] text-slate-400 border-[#2c3338] hover:text-white'
                                }`}
                              >
                                Custom Slides
                              </button>
                            </div>
                          </div>

                          {/* Admin Banners Sync Mode */}
                          {currentWidget.settings.sliderSource !== 'custom' && (
                            <div className="p-3 bg-[#13171a] rounded-lg border border-[#2c3338] space-y-2.5">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-200">
                                  Synchronized Slides ({slides.length})
                                </span>
                                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800 font-bold">
                                  Auto-Synced
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 leading-relaxed">
                                This slider is directly synchronized with your admin <strong>Sliders &amp; Banners</strong> management tab. All changes, reorderings, and image updates made there reflect here automatically.
                              </p>
                              <div className="space-y-1.5 pt-1">
                                {slides.map((s, sIdx) => (
                                  <div key={s.id || sIdx} className="flex items-center gap-2 px-2.5 py-1.5 bg-[#181d22] rounded border border-[#2c3338]/60 text-xs">
                                    <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                                      {sIdx + 1}
                                    </span>
                                    <div className="flex-1 truncate">
                                      <span className="text-slate-200 font-semibold">{s.mainTitle}</span>
                                    </div>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${s.enabled ? 'text-emerald-400 bg-emerald-950/50' : 'text-slate-500 bg-slate-800'}`}>
                                      {s.enabled ? 'Active' : 'Disabled'}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Custom Slides Mode */}
                          {currentWidget.settings.sliderSource === 'custom' && (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <label className="text-slate-400 font-semibold text-xs">Custom Slide Items</label>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const currentItems = currentWidget.content.items || [];
                                    const newSlide = {
                                      id: `slide-${Date.now()}`,
                                      title: 'EXECUTIVE CORPORATE SUPPLIES',
                                      badge: 'EXCLUSIVE',
                                      description: 'OFFICIAL OEM PROCUREMENT',
                                      subtext: 'GENUINE TONERS & EXECUTIVE FURNITURE',
                                      buttonText: 'REQUEST QUOTE',
                                      buttonUrl: '/rfq',
                                      secondaryBtnText: 'VIEW CATALOG',
                                      secondaryBtnUrl: '/shop',
                                      image: '/executive-tables-banner.jpg',
                                      deliveryText: 'Same-Day Lagos White-Glove Assembled Delivery'
                                    };
                                    handleUpdateCurrentWidget({
                                      content: { ...currentWidget.content, items: [...currentItems, newSlide] }
                                    });
                                  }}
                                  className="text-xs text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" /> Add Slide
                                </button>
                              </div>

                              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                                {(currentWidget.content.items || []).map((slideItem, idx) => (
                                  <div key={slideItem.id || idx} className="p-2.5 bg-[#13171a] rounded-lg border border-[#2c3338] space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-bold text-orange-400">Slide #{idx + 1}</span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const filtered = (currentWidget.content.items || []).filter((_, i) => i !== idx);
                                          handleUpdateCurrentWidget({
                                            content: { ...currentWidget.content, items: filtered }
                                          });
                                        }}
                                        className="text-slate-500 hover:text-rose-400 text-xs cursor-pointer"
                                      >
                                        Delete
                                      </button>
                                    </div>

                                    <div>
                                      <label className="block text-[10px] text-slate-400 mb-0.5">Title / Headline</label>
                                      <input
                                        type="text"
                                        value={slideItem.title || ''}
                                        onChange={(e) => {
                                          const updated = [...(currentWidget.content.items || [])];
                                          updated[idx] = { ...updated[idx], title: e.target.value };
                                          handleUpdateCurrentWidget({ content: { ...currentWidget.content, items: updated } });
                                        }}
                                        className="w-full px-2 py-1 bg-[#181d22] border border-[#2c3338] rounded text-white text-xs"
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-[10px] text-slate-400 mb-0.5">Tagline / Description</label>
                                      <input
                                        type="text"
                                        value={slideItem.description || ''}
                                        onChange={(e) => {
                                          const updated = [...(currentWidget.content.items || [])];
                                          updated[idx] = { ...updated[idx], description: e.target.value };
                                          handleUpdateCurrentWidget({ content: { ...currentWidget.content, items: updated } });
                                        }}
                                        className="w-full px-2 py-1 bg-[#181d22] border border-[#2c3338] rounded text-white text-xs"
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-[10px] text-slate-400 mb-0.5">Image URL</label>
                                      <div className="flex gap-1.5">
                                        <input
                                          type="text"
                                          value={slideItem.image || slideItem.imageUrl || ''}
                                          onChange={(e) => {
                                            const updated = [...(currentWidget.content.items || [])];
                                            updated[idx] = { ...updated[idx], image: e.target.value, imageUrl: e.target.value };
                                            handleUpdateCurrentWidget({ content: { ...currentWidget.content, items: updated } });
                                          }}
                                          className="flex-1 px-2 py-1 bg-[#181d22] border border-[#2c3338] rounded text-white text-xs font-mono text-[11px]"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setSelectedSlideIndexForMedia(idx);
                                            setMediaTargetField('widget-slide-image');
                                            setIsMediaPickerOpen(true);
                                          }}
                                          className="px-2 py-1 bg-[#20262c] hover:bg-[#2a323a] text-slate-200 rounded text-[11px] font-bold shrink-0 cursor-pointer"
                                        >
                                          Pick
                                        </button>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-1.5">
                                      <div>
                                        <label className="block text-[10px] text-slate-400 mb-0.5">Button 1 Text</label>
                                        <input
                                          type="text"
                                          value={slideItem.buttonText || ''}
                                          onChange={(e) => {
                                            const updated = [...(currentWidget.content.items || [])];
                                            updated[idx] = { ...updated[idx], buttonText: e.target.value };
                                            handleUpdateCurrentWidget({ content: { ...currentWidget.content, items: updated } });
                                          }}
                                          className="w-full px-2 py-1 bg-[#181d22] border border-[#2c3338] rounded text-white text-xs"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[10px] text-slate-400 mb-0.5">Button 1 URL</label>
                                        <input
                                          type="text"
                                          value={slideItem.buttonUrl || ''}
                                          onChange={(e) => {
                                            const updated = [...(currentWidget.content.items || [])];
                                            updated[idx] = { ...updated[idx], buttonUrl: e.target.value };
                                            handleUpdateCurrentWidget({ content: { ...currentWidget.content, items: updated } });
                                          }}
                                          className="w-full px-2 py-1 bg-[#181d22] border border-[#2c3338] rounded text-white text-xs"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Slider Playback & Rotation Settings */}
                          <div className="pt-2 border-t border-[#2c3338] space-y-2.5">
                            <label className="block text-slate-400 font-semibold text-xs">Slider Timing &amp; Dimensions</label>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] text-slate-400 mb-1">Rotation Speed</label>
                                <select
                                  value={currentWidget.settings.sliderInterval || 6000}
                                  onChange={(e) => handleUpdateCurrentWidget({
                                    settings: { ...currentWidget.settings, sliderInterval: Number(e.target.value) }
                                  })}
                                  className="w-full px-2 py-1.5 bg-[#13171a] border border-[#2c3338] rounded text-white text-xs"
                                >
                                  <option value={3000}>3 seconds</option>
                                  <option value={5000}>5 seconds</option>
                                  <option value={6000}>6 seconds (Default)</option>
                                  <option value={8000}>8 seconds</option>
                                  <option value={10000}>10 seconds</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-[10px] text-slate-400 mb-1">Slider Height</label>
                                <select
                                  value={currentWidget.settings.sliderHeight || '520px'}
                                  onChange={(e) => handleUpdateCurrentWidget({
                                    settings: { ...currentWidget.settings, sliderHeight: e.target.value }
                                  })}
                                  className="w-full px-2 py-1.5 bg-[#13171a] border border-[#2c3338] rounded text-white text-xs"
                                >
                                  <option value="460px">Compact (460px)</option>
                                  <option value="520px">Standard (520px)</option>
                                  <option value="600px">Spacious (600px)</option>
                                  <option value="650px">Large (650px)</option>
                                </select>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 pt-1">
                              <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-xs">
                                <input
                                  type="checkbox"
                                  checked={currentWidget.settings.sliderAutoplay !== false}
                                  onChange={(e) => handleUpdateCurrentWidget({
                                    settings: { ...currentWidget.settings, sliderAutoplay: e.target.checked }
                                  })}
                                  className="rounded bg-[#13171a] border-[#2c3338] text-orange-500 focus:ring-0"
                                />
                                Autoplay Rotation
                              </label>

                              <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-xs">
                                <input
                                  type="checkbox"
                                  checked={currentWidget.settings.sliderShowArrows !== false}
                                  onChange={(e) => handleUpdateCurrentWidget({
                                    settings: { ...currentWidget.settings, sliderShowArrows: e.target.checked }
                                  })}
                                  className="rounded bg-[#13171a] border-[#2c3338] text-orange-500 focus:ring-0"
                                />
                                Show Nav Arrows
                              </label>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* PRODUCT SLIDER & CAROUSEL CONTROLS */}
                      {(currentWidget.type === 'product_carousel' || currentWidget.type === 'product_slider') && (
                        <div className="space-y-4 pt-3 border-t border-[#2c3338]">
                          <div>
                            <label className="block text-slate-400 font-semibold mb-1 text-xs">Filter By Category</label>
                            <select
                              value={currentWidget.settings.productCategory || 'all'}
                              onChange={(e) => handleUpdateCurrentWidget({
                                settings: { ...currentWidget.settings, productCategory: e.target.value }
                              })}
                              className="w-full px-3 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white text-xs"
                            >
                              <option value="all">All Store Products</option>
                              {categories.map((c) => (
                                <option key={c.id} value={c.slug}>{c.name}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-slate-400 font-semibold mb-1 text-xs">Brand Filter (Optional)</label>
                            <input
                              type="text"
                              placeholder="e.g. HP, Canon, Sharp, Epson"
                              value={currentWidget.settings.productBrand || ''}
                              onChange={(e) => handleUpdateCurrentWidget({
                                settings: { ...currentWidget.settings, productBrand: e.target.value }
                              })}
                              className="w-full px-3 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white text-xs"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] text-slate-400 mb-1">Products Limit</label>
                              <input
                                type="number"
                                min={2}
                                max={30}
                                value={currentWidget.settings.productsLimit || 12}
                                onChange={(e) => handleUpdateCurrentWidget({
                                  settings: { ...currentWidget.settings, productsLimit: Number(e.target.value) }
                                })}
                                className="w-full px-2.5 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-400 mb-1">Items Per View</label>
                              <select
                                value={currentWidget.settings.productSliderItemsToShow || 4}
                                onChange={(e) => handleUpdateCurrentWidget({
                                  settings: { ...currentWidget.settings, productSliderItemsToShow: Number(e.target.value) }
                                })}
                                className="w-full px-2.5 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white text-xs"
                              >
                                <option value={2}>2 Products</option>
                                <option value={3}>3 Products</option>
                                <option value={4}>4 Products (Standard)</option>
                                <option value={5}>5 Products</option>
                                <option value={6}>6 Products</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] text-slate-400 mb-1">Autoplay Rotation</label>
                              <select
                                value={currentWidget.settings.productSliderInterval || 5000}
                                onChange={(e) => handleUpdateCurrentWidget({
                                  settings: { ...currentWidget.settings, productSliderInterval: Number(e.target.value) }
                                })}
                                className="w-full px-2.5 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white text-xs"
                              >
                                <option value={3000}>Every 3 seconds</option>
                                <option value={4000}>Every 4 seconds</option>
                                <option value={5000}>Every 5 seconds</option>
                                <option value={7000}>Every 7 seconds</option>
                              </select>
                            </div>
                            <div className="flex flex-col justify-end">
                              <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-xs py-1.5">
                                <input
                                  type="checkbox"
                                  checked={currentWidget.settings.productSliderAutoplay !== false}
                                  onChange={(e) => handleUpdateCurrentWidget({
                                    settings: { ...currentWidget.settings, productSliderAutoplay: e.target.checked }
                                  })}
                                  className="rounded bg-[#13171a] border-[#2c3338] text-orange-500 focus:ring-0"
                                />
                                <span>Autoplay On</span>
                              </label>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 pt-1">
                            <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-xs">
                              <input
                                type="checkbox"
                                checked={Boolean(currentWidget.settings.onlyFeatured)}
                                onChange={(e) => handleUpdateCurrentWidget({
                                  settings: { ...currentWidget.settings, onlyFeatured: e.target.checked }
                                })}
                                className="rounded bg-[#13171a] border-[#2c3338] text-orange-500 focus:ring-0"
                              />
                              <span>Only Featured</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-xs">
                              <input
                                type="checkbox"
                                checked={Boolean(currentWidget.settings.onlySale)}
                                onChange={(e) => handleUpdateCurrentWidget({
                                  settings: { ...currentWidget.settings, onlySale: e.target.checked }
                                })}
                                className="rounded bg-[#13171a] border-[#2c3338] text-orange-500 focus:ring-0"
                              />
                              <span>On Sale Only</span>
                            </label>
                          </div>
                        </div>
                      )}

                      {/* LOGO SLIDER & BRAND MARQUEE CONTROLS */}
                      {(currentWidget.type === 'brand_logos' || currentWidget.type === 'client_logos' || currentWidget.type === 'logo_slider') && (
                        <div className="space-y-4 pt-3 border-t border-[#2c3338]">
                          <div>
                            <label className="block text-slate-400 font-semibold mb-1 text-xs">Display Mode</label>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => handleUpdateCurrentWidget({
                                  settings: { ...currentWidget.settings, logoSliderMode: 'marquee' }
                                })}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition text-center cursor-pointer ${
                                  (currentWidget.settings.logoSliderMode !== 'carousel')
                                    ? 'bg-orange-600/20 text-orange-400 border-orange-500/50'
                                    : 'bg-[#13171a] text-slate-400 border-[#2c3338] hover:text-white'
                                }`}
                              >
                                Continuous Marquee
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateCurrentWidget({
                                  settings: { ...currentWidget.settings, logoSliderMode: 'carousel' }
                                })}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition text-center cursor-pointer ${
                                  currentWidget.settings.logoSliderMode === 'carousel'
                                    ? 'bg-orange-600/20 text-orange-400 border-orange-500/50'
                                    : 'bg-[#13171a] text-slate-400 border-[#2c3338] hover:text-white'
                                }`}
                              >
                                Interactive Carousel
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] text-slate-400 mb-1">
                                {currentWidget.settings.logoSliderMode === 'carousel' ? 'Items Visible' : 'Ticker Speed'}
                              </label>
                              {currentWidget.settings.logoSliderMode === 'carousel' ? (
                                <select
                                  value={currentWidget.settings.logoSliderItemsToShow || 5}
                                  onChange={(e) => handleUpdateCurrentWidget({
                                    settings: { ...currentWidget.settings, logoSliderItemsToShow: Number(e.target.value) }
                                  })}
                                  className="w-full px-2.5 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white text-xs"
                                >
                                  <option value={3}>3 Logos</option>
                                  <option value={4}>4 Logos</option>
                                  <option value={5}>5 Logos</option>
                                  <option value={6}>6 Logos</option>
                                </select>
                              ) : (
                                <select
                                  value={currentWidget.settings.logoSliderSpeed || 32}
                                  onChange={(e) => handleUpdateCurrentWidget({
                                    settings: { ...currentWidget.settings, logoSliderSpeed: Number(e.target.value) }
                                  })}
                                  className="w-full px-2.5 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white text-xs"
                                >
                                  <option value={18}>Fast (18s)</option>
                                  <option value={25}>Moderate (25s)</option>
                                  <option value={32}>Smooth (32s Default)</option>
                                  <option value={45}>Gentle (45s)</option>
                                  <option value={60}>Very Slow (60s)</option>
                                </select>
                              )}
                            </div>

                            <div>
                              <label className="block text-[10px] text-slate-400 mb-1">Card Border Radius</label>
                              <input
                                type="number"
                                min={0}
                                max={30}
                                value={currentWidget.settings.logoSliderBorderRadius ?? 10}
                                onChange={(e) => handleUpdateCurrentWidget({
                                  settings: { ...currentWidget.settings, logoSliderBorderRadius: Number(e.target.value) }
                                })}
                                className="w-full px-2.5 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white text-xs"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-4 pt-1">
                            <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-xs">
                              <input
                                type="checkbox"
                                checked={currentWidget.settings.logoSliderGrayscale !== false}
                                onChange={(e) => handleUpdateCurrentWidget({
                                  settings: { ...currentWidget.settings, logoSliderGrayscale: e.target.checked }
                                })}
                                className="rounded bg-[#13171a] border-[#2c3338] text-orange-500 focus:ring-0"
                              />
                              <span>Grayscale (Color on hover)</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-xs">
                              <input
                                type="checkbox"
                                checked={currentWidget.settings.logoSliderPauseOnHover !== false}
                                onChange={(e) => handleUpdateCurrentWidget({
                                  settings: { ...currentWidget.settings, logoSliderPauseOnHover: e.target.checked }
                                })}
                                className="rounded bg-[#13171a] border-[#2c3338] text-orange-500 focus:ring-0"
                              />
                              <span>Pause on Hover</span>
                            </label>
                          </div>

                          {/* Logos list */}
                          <div className="space-y-2 pt-2 border-t border-[#2c3338]">
                            <div className="flex items-center justify-between">
                              <label className="text-slate-400 font-semibold text-xs">
                                Brand &amp; Partner Logos ({currentWidget.content.items?.length || 0})
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  const currentItems = currentWidget.content.items || [];
                                  const newLogo = {
                                    id: `logo-${Date.now()}`,
                                    title: 'Brand Partner',
                                    image: 'https://ofixbaze.com/wp-content/uploads/2020/04/HP-LOGO.jpg',
                                    link: '/shop'
                                  };
                                  handleUpdateCurrentWidget({ content: { ...currentWidget.content, items: [...currentItems, newLogo] } });
                                }}
                                className="px-2 py-1 bg-orange-600 hover:bg-orange-500 text-white rounded text-[11px] font-bold cursor-pointer"
                              >
                                + Add Logo
                              </button>
                            </div>

                            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                              {(currentWidget.content.items || []).map((logoItem, idx) => (
                                <div key={logoItem.id || idx} className="p-2.5 bg-[#13171a] border border-[#2c3338] rounded-lg space-y-2 text-xs">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-200">Logo #{idx + 1}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = [...(currentWidget.content.items || [])];
                                        updated.splice(idx, 1);
                                        handleUpdateCurrentWidget({ content: { ...currentWidget.content, items: updated } });
                                      }}
                                      className="text-red-400 hover:text-red-300 cursor-pointer text-[10px]"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                  <div>
                                    <label className="block text-[10px] text-slate-400 mb-0.5">Brand / Company Name</label>
                                    <input
                                      type="text"
                                      value={logoItem.title || ''}
                                      onChange={(e) => {
                                        const updated = [...(currentWidget.content.items || [])];
                                        updated[idx] = { ...updated[idx], title: e.target.value };
                                        handleUpdateCurrentWidget({ content: { ...currentWidget.content, items: updated } });
                                      }}
                                      className="w-full px-2 py-1 bg-[#181d22] border border-[#2c3338] rounded text-white text-xs"
                                      placeholder="e.g. HP Authorized"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] text-slate-400 mb-0.5">Logo Image URL</label>
                                    <div className="flex gap-1.5">
                                      <input
                                        type="text"
                                        value={logoItem.image || logoItem.imageUrl || ''}
                                        onChange={(e) => {
                                          const updated = [...(currentWidget.content.items || [])];
                                          updated[idx] = { ...updated[idx], image: e.target.value, imageUrl: e.target.value };
                                          handleUpdateCurrentWidget({ content: { ...currentWidget.content, items: updated } });
                                        }}
                                        className="flex-1 px-2 py-1 bg-[#181d22] border border-[#2c3338] rounded text-white text-xs"
                                        placeholder="https://..."
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSelectedSlideIndexForMedia(idx);
                                          setMediaTargetField('widget-slide-image');
                                          setIsMediaPickerOpen(true);
                                        }}
                                        className="px-2 py-1 bg-[#20262c] hover:bg-[#2a323a] text-slate-200 rounded text-[11px] font-bold shrink-0 cursor-pointer"
                                      >
                                        Pick
                                      </button>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-[10px] text-slate-400 mb-0.5">Link URL</label>
                                    <input
                                      type="text"
                                      value={logoItem.link || ''}
                                      onChange={(e) => {
                                        const updated = [...(currentWidget.content.items || [])];
                                        updated[idx] = { ...updated[idx], link: e.target.value };
                                        handleUpdateCurrentWidget({ content: { ...currentWidget.content, items: updated } });
                                      }}
                                      className="w-full px-2 py-1 bg-[#181d22] border border-[#2c3338] rounded text-white text-xs"
                                      placeholder="/shop?brand=hp"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* IMAGE SLIDER & MULTI-IMAGE CAROUSEL CONTROLS */}
                      {currentWidget.type === 'image_slider' && (
                        <div className="space-y-4 pt-3 border-t border-[#2c3338]">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] text-slate-400 mb-1">Slider Height</label>
                              <select
                                value={currentWidget.settings.imageSliderHeight || '440px'}
                                onChange={(e) => handleUpdateCurrentWidget({
                                  settings: { ...currentWidget.settings, imageSliderHeight: e.target.value }
                                })}
                                className="w-full px-2.5 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white text-xs"
                              >
                                <option value="320px">Compact (320px)</option>
                                <option value="400px">Standard (400px)</option>
                                <option value="440px">Showcase (440px)</option>
                                <option value="520px">Tall (520px)</option>
                                <option value="600px">Jumbo (600px)</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-400 mb-1">Rotation Timing</label>
                              <select
                                value={currentWidget.settings.imageSliderInterval || 6000}
                                onChange={(e) => handleUpdateCurrentWidget({
                                  settings: { ...currentWidget.settings, imageSliderInterval: Number(e.target.value) }
                                })}
                                className="w-full px-2.5 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white text-xs"
                              >
                                <option value={3000}>3 seconds</option>
                                <option value={5000}>5 seconds</option>
                                <option value={6000}>6 seconds (Default)</option>
                                <option value={8000}>8 seconds</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] text-slate-400 mb-1">Corner Radius</label>
                              <input
                                type="number"
                                min={0}
                                max={36}
                                value={currentWidget.settings.imageSliderBorderRadius ?? 16}
                                onChange={(e) => handleUpdateCurrentWidget({
                                  settings: { ...currentWidget.settings, imageSliderBorderRadius: Number(e.target.value) }
                                })}
                                className="w-full px-2.5 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-400 mb-1">Image Fit</label>
                              <select
                                value={currentWidget.settings.imageSliderObjectFit || 'cover'}
                                onChange={(e) => handleUpdateCurrentWidget({
                                  settings: { ...currentWidget.settings, imageSliderObjectFit: e.target.value as any }
                                })}
                                className="w-full px-2.5 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white text-xs"
                              >
                                <option value="cover">Cover (Full bleed crop)</option>
                                <option value="contain">Contain (No crop)</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 pt-1">
                            <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-xs">
                              <input
                                type="checkbox"
                                checked={currentWidget.settings.imageSliderAutoplay !== false}
                                onChange={(e) => handleUpdateCurrentWidget({
                                  settings: { ...currentWidget.settings, imageSliderAutoplay: e.target.checked }
                                })}
                                className="rounded bg-[#13171a] border-[#2c3338] text-orange-500 focus:ring-0"
                              />
                              <span>Autoplay On</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-xs">
                              <input
                                type="checkbox"
                                checked={currentWidget.settings.imageSliderShowArrows !== false}
                                onChange={(e) => handleUpdateCurrentWidget({
                                  settings: { ...currentWidget.settings, imageSliderShowArrows: e.target.checked }
                                })}
                                className="rounded bg-[#13171a] border-[#2c3338] text-orange-500 focus:ring-0"
                              />
                              <span>Nav Arrows</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-xs">
                              <input
                                type="checkbox"
                                checked={currentWidget.settings.imageSliderShowDots !== false}
                                onChange={(e) => handleUpdateCurrentWidget({
                                  settings: { ...currentWidget.settings, imageSliderShowDots: e.target.checked }
                                })}
                                className="rounded bg-[#13171a] border-[#2c3338] text-orange-500 focus:ring-0"
                              />
                              <span>Dots</span>
                            </label>
                          </div>

                          {/* Slides manager */}
                          <div className="space-y-2 pt-2 border-t border-[#2c3338]">
                            <div className="flex items-center justify-between">
                              <label className="text-slate-400 font-semibold text-xs">
                                Image Slides ({currentWidget.content.items?.length || 0})
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  const currentItems = currentWidget.content.items || [];
                                  const newSlide = {
                                    id: `img-${Date.now()}`,
                                    title: 'Executive Workstations',
                                    description: 'Premium modular office desks crafted for modern business hubs.',
                                    badge: 'NEW COLLECTION',
                                    image: '/executive-tables-banner.jpg',
                                    buttonText: 'DISCOVER MORE',
                                    buttonUrl: '/shop'
                                  };
                                  handleUpdateCurrentWidget({ content: { ...currentWidget.content, items: [...currentItems, newSlide] } });
                                }}
                                className="px-2 py-1 bg-orange-600 hover:bg-orange-500 text-white rounded text-[11px] font-bold cursor-pointer"
                              >
                                + Add Slide
                              </button>
                            </div>

                            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                              {(currentWidget.content.items || []).map((slide, idx) => (
                                <div key={slide.id || idx} className="p-2.5 bg-[#13171a] border border-[#2c3338] rounded-lg space-y-2 text-xs">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-200">Slide #{idx + 1}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = [...(currentWidget.content.items || [])];
                                        updated.splice(idx, 1);
                                        handleUpdateCurrentWidget({ content: { ...currentWidget.content, items: updated } });
                                      }}
                                      className="text-red-400 hover:text-red-300 cursor-pointer text-[10px]"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                  <div>
                                    <label className="block text-[10px] text-slate-400 mb-0.5">Image URL</label>
                                    <div className="flex gap-1.5">
                                      <input
                                        type="text"
                                        value={slide.image || slide.imageUrl || ''}
                                        onChange={(e) => {
                                          const updated = [...(currentWidget.content.items || [])];
                                          updated[idx] = { ...updated[idx], image: e.target.value, imageUrl: e.target.value };
                                          handleUpdateCurrentWidget({ content: { ...currentWidget.content, items: updated } });
                                        }}
                                        className="flex-1 px-2 py-1 bg-[#181d22] border border-[#2c3338] rounded text-white text-xs"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSelectedSlideIndexForMedia(idx);
                                          setMediaTargetField('widget-slide-image');
                                          setIsMediaPickerOpen(true);
                                        }}
                                        className="px-2 py-1 bg-[#20262c] hover:bg-[#2a323a] text-slate-200 rounded text-[11px] font-bold shrink-0 cursor-pointer"
                                      >
                                        Pick
                                      </button>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-1.5">
                                    <div>
                                      <label className="block text-[10px] text-slate-400 mb-0.5">Badge</label>
                                      <input
                                        type="text"
                                        value={slide.badge || ''}
                                        onChange={(e) => {
                                          const updated = [...(currentWidget.content.items || [])];
                                          updated[idx] = { ...updated[idx], badge: e.target.value };
                                          handleUpdateCurrentWidget({ content: { ...currentWidget.content, items: updated } });
                                        }}
                                        className="w-full px-2 py-1 bg-[#181d22] border border-[#2c3338] rounded text-white text-xs"
                                        placeholder="FLAGSHIP"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[10px] text-slate-400 mb-0.5">Title</label>
                                      <input
                                        type="text"
                                        value={slide.title || ''}
                                        onChange={(e) => {
                                          const updated = [...(currentWidget.content.items || [])];
                                          updated[idx] = { ...updated[idx], title: e.target.value };
                                          handleUpdateCurrentWidget({ content: { ...currentWidget.content, items: updated } });
                                        }}
                                        className="w-full px-2 py-1 bg-[#181d22] border border-[#2c3338] rounded text-white text-xs"
                                        placeholder="Slide Title"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-[10px] text-slate-400 mb-0.5">Description</label>
                                    <input
                                      type="text"
                                      value={slide.description || slide.subtext || ''}
                                      onChange={(e) => {
                                        const updated = [...(currentWidget.content.items || [])];
                                        updated[idx] = { ...updated[idx], description: e.target.value, subtext: e.target.value };
                                        handleUpdateCurrentWidget({ content: { ...currentWidget.content, items: updated } });
                                      }}
                                      className="w-full px-2 py-1 bg-[#181d22] border border-[#2c3338] rounded text-white text-xs"
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-1.5">
                                    <div>
                                      <label className="block text-[10px] text-slate-400 mb-0.5">Button Text</label>
                                      <input
                                        type="text"
                                        value={slide.buttonText || ''}
                                        onChange={(e) => {
                                          const updated = [...(currentWidget.content.items || [])];
                                          updated[idx] = { ...updated[idx], buttonText: e.target.value };
                                          handleUpdateCurrentWidget({ content: { ...currentWidget.content, items: updated } });
                                        }}
                                        className="w-full px-2 py-1 bg-[#181d22] border border-[#2c3338] rounded text-white text-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[10px] text-slate-400 mb-0.5">Button URL</label>
                                      <input
                                        type="text"
                                        value={slide.buttonUrl || slide.link || ''}
                                        onChange={(e) => {
                                          const updated = [...(currentWidget.content.items || [])];
                                          updated[idx] = { ...updated[idx], buttonUrl: e.target.value, link: e.target.value };
                                          handleUpdateCurrentWidget({ content: { ...currentWidget.content, items: updated } });
                                        }}
                                        className="w-full px-2 py-1 bg-[#181d22] border border-[#2c3338] rounded text-white text-xs"
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 2: STYLE */}
                  {inspectorTab === 'style' && (
                    <div className="space-y-4">
                      {currentWidget.type === 'image' ? (
                        /* DEDICATED IMAGE WIDGET STYLING CONTROLS */
                        <div className="space-y-4">
                          {/* Image Width Mode */}
                          <div>
                            <label className="block text-slate-400 font-semibold mb-1">Image Width Mode</label>
                            <select
                              value={currentWidget.settings.imageWidthMode || 'full-width'}
                              onChange={(e) => handleUpdateCurrentWidget({
                                settings: { ...currentWidget.settings, imageWidthMode: e.target.value as any }
                              })}
                              className="w-full px-3 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white text-xs"
                            >
                              <option value="full-width">Full Width (100% of container)</option>
                              <option value="default">Default / Contained (max-w-full)</option>
                              <option value="custom">Custom Sizing (px, %, max-width)</option>
                              <option value="full-bleed">Full Bleed (Edge-to-Edge breakout)</option>
                            </select>
                            <span className="text-[10px] text-slate-500 block mt-1">
                              {currentWidget.settings.imageWidthMode === 'full-bleed'
                                ? 'Image spans edge-to-edge across the screen, breaking out of column padding.'
                                : currentWidget.settings.imageWidthMode === 'custom'
                                ? 'Specify custom CSS width, max-width, and min-width boundaries.'
                                : 'Image adapts fluidly to the column boundary.'}
                            </span>
                          </div>

                          {/* Image Alignment */}
                          <div>
                            <label className="block text-slate-400 font-semibold mb-1">Horizontal Alignment</label>
                            <div className="grid grid-cols-4 gap-1 bg-[#13171a] border border-[#2c3338] rounded-lg p-0.5">
                              {(['left', 'center', 'right', 'stretch'] as const).map(align => (
                                <button
                                  key={align}
                                  type="button"
                                  onClick={() => handleUpdateCurrentWidget({
                                    settings: { ...currentWidget.settings, imageAlignment: align }
                                  })}
                                  className={`py-1 text-center font-semibold capitalize rounded text-xs transition ${
                                    (currentWidget.settings.imageAlignment || 'center') === align 
                                      ? 'bg-orange-600 text-white shadow' 
                                      : 'text-slate-400 hover:text-white'
                                  }`}
                                >
                                  {align}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Custom Width & Max Width (when mode is custom) */}
                          {currentWidget.settings.imageWidthMode === 'custom' && (
                            <div className="space-y-2 p-2.5 bg-[#13171a] border border-[#2c3338] rounded-lg">
                              <div>
                                <label className="block text-slate-400 text-xs font-semibold mb-1">Custom Width</label>
                                <input
                                  type="text"
                                  value={currentWidget.settings.imageWidth || '100%'}
                                  onChange={(e) => handleUpdateCurrentWidget({
                                    settings: { ...currentWidget.settings, imageWidth: e.target.value }
                                  })}
                                  placeholder="e.g. 100%, 650px, 80vw"
                                  className="w-full px-2.5 py-1 bg-[#191e23] border border-[#2c3338] rounded text-white text-xs font-mono"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-slate-400 text-[11px] font-semibold mb-0.5">Max Width</label>
                                  <input
                                    type="text"
                                    value={currentWidget.settings.imageMaxWidth || '1200px'}
                                    onChange={(e) => handleUpdateCurrentWidget({
                                      settings: { ...currentWidget.settings, imageMaxWidth: e.target.value }
                                    })}
                                    placeholder="e.g. 1200px, 100%"
                                    className="w-full px-2 py-1 bg-[#191e23] border border-[#2c3338] rounded text-white text-xs font-mono"
                                  />
                                </div>
                                <div>
                                  <label className="block text-slate-400 text-[11px] font-semibold mb-0.5">Min Width</label>
                                  <input
                                    type="text"
                                    value={currentWidget.settings.imageMinWidth || '0'}
                                    onChange={(e) => handleUpdateCurrentWidget({
                                      settings: { ...currentWidget.settings, imageMinWidth: e.target.value }
                                    })}
                                    placeholder="e.g. 200px, 0"
                                    className="w-full px-2 py-1 bg-[#191e23] border border-[#2c3338] rounded text-white text-xs font-mono"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Height Mode & Natural Aspect Ratio Handling */}
                          <div className="pt-2 border-t border-[#2c3338]">
                            <label className="block text-slate-400 font-semibold mb-1">Height Mode</label>
                            <select
                              value={currentWidget.settings.imageHeightMode || 'auto'}
                              onChange={(e) => handleUpdateCurrentWidget({
                                settings: { ...currentWidget.settings, imageHeightMode: e.target.value as any }
                              })}
                              className="w-full px-3 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white text-xs"
                            >
                              <option value="auto">Auto (Preserve Natural Aspect Ratio - Recommended)</option>
                              <option value="custom">Custom Fixed Height (Cover / Contain Crop)</option>
                            </select>
                            <span className="text-[10px] text-slate-500 block mt-1">
                              {currentWidget.settings.imageHeightMode === 'custom'
                                ? 'Enforces a specific height box. Use Object Fit to control crop.'
                                : 'Preserves native image dimensions without squishing or accidental crop.'}
                            </span>
                          </div>

                          {/* Fixed Height Controls if mode is custom */}
                          {currentWidget.settings.imageHeightMode === 'custom' && (
                            <div className="space-y-2.5 p-2.5 bg-[#13171a] border border-[#2c3338] rounded-lg">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-slate-400 text-xs font-semibold mb-1">Desktop Height</label>
                                  <input
                                    type="text"
                                    value={currentWidget.settings.imageHeightDesktop || currentWidget.settings.imageHeight || '420px'}
                                    onChange={(e) => handleUpdateCurrentWidget({
                                      settings: { 
                                        ...currentWidget.settings, 
                                        imageHeight: e.target.value,
                                        imageHeightDesktop: e.target.value
                                      }
                                    })}
                                    placeholder="e.g. 420px, 50vh"
                                    className="w-full px-2.5 py-1 bg-[#191e23] border border-[#2c3338] rounded text-white text-xs font-mono"
                                  />
                                </div>
                                <div>
                                  <label className="block text-slate-400 text-xs font-semibold mb-1">Mobile Height</label>
                                  <input
                                    type="text"
                                    value={currentWidget.settings.imageHeightMobile || currentWidget.settings.mobileImageHeight || 'auto'}
                                    onChange={(e) => handleUpdateCurrentWidget({
                                      settings: { 
                                        ...currentWidget.settings, 
                                        imageHeightMobile: e.target.value,
                                        mobileImageHeight: e.target.value
                                      }
                                    })}
                                    placeholder="auto or 200px"
                                    className="w-full px-2.5 py-1 bg-[#191e23] border border-[#2c3338] rounded text-white text-xs font-mono"
                                  />
                                </div>
                              </div>
                              <span className="text-[10px] text-slate-500 block">
                                Set Mobile to "auto" to preserve responsive proportions and avoid empty whitespace.
                              </span>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-slate-400 text-[11px] font-semibold mb-0.5">Object Fit</label>
                                  <select
                                    value={currentWidget.settings.imageObjectFit || currentWidget.settings.objectFit || 'cover'}
                                    onChange={(e) => handleUpdateCurrentWidget({
                                      settings: { 
                                        ...currentWidget.settings, 
                                        imageObjectFit: e.target.value as any,
                                        objectFit: e.target.value as any
                                      }
                                    })}
                                    className="w-full px-2 py-1 bg-[#191e23] border border-[#2c3338] rounded text-white text-xs"
                                  >
                                    <option value="cover">Cover (Fill & Crop)</option>
                                    <option value="contain">Contain (Fit within)</option>
                                    <option value="fill">Fill (Stretch)</option>
                                    <option value="none">None (Natural scale)</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-slate-400 text-[11px] font-semibold mb-0.5">Focal Position</label>
                                  <select
                                    value={currentWidget.settings.imageObjectPosition || 'center'}
                                    onChange={(e) => handleUpdateCurrentWidget({
                                      settings: { ...currentWidget.settings, imageObjectPosition: e.target.value as 'center' | 'top' | 'bottom' | 'left' | 'right' | 'custom' }
                                    })}
                                    className="w-full px-2 py-1 bg-[#191e23] border border-[#2c3338] rounded text-white text-xs"
                                  >
                                    <option value="center">Center</option>
                                    <option value="top">Top</option>
                                    <option value="bottom">Bottom</option>
                                    <option value="left">Left</option>
                                    <option value="right">Right</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Image Opacity Slider */}
                          <div className="pt-2 border-t border-[#2c3338]">
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-slate-400 font-semibold text-xs">Image Opacity</label>
                              <span className="text-xs font-mono text-orange-400">
                                {Math.round((currentWidget.settings.imageOpacity ?? 1) * 100)}%
                              </span>
                            </div>
                            <input
                              type="range"
                              min={0.1}
                              max={1.0}
                              step={0.05}
                              value={currentWidget.settings.imageOpacity ?? 1}
                              onChange={(e) => handleUpdateCurrentWidget({
                                settings: { ...currentWidget.settings, imageOpacity: parseFloat(e.target.value) }
                              })}
                              className="w-full accent-orange-600 cursor-pointer"
                            />
                          </div>

                          {/* Border Controls */}
                          <div className="pt-2 border-t border-[#2c3338] space-y-2">
                            <label className="block text-slate-400 font-semibold text-xs">Border & Stroke</label>
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <span className="text-[10px] text-slate-500 block mb-0.5">Style</span>
                                <select
                                  value={currentWidget.settings.imageBorderStyle || 'none'}
                                  onChange={(e) => handleUpdateCurrentWidget({
                                    settings: { ...currentWidget.settings, imageBorderStyle: e.target.value as any }
                                  })}
                                  className="w-full px-2 py-1 bg-[#13171a] border border-[#2c3338] rounded text-white text-xs"
                                >
                                  <option value="none">None</option>
                                  <option value="solid">Solid</option>
                                  <option value="dashed">Dashed</option>
                                  <option value="dotted">Dotted</option>
                                </select>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-500 block mb-0.5">Width (px)</span>
                                <input
                                  type="number"
                                  value={currentWidget.settings.imageBorderWidth ?? 0}
                                  onChange={(e) => handleUpdateCurrentWidget({
                                    settings: { ...currentWidget.settings, imageBorderWidth: Number(e.target.value) }
                                  })}
                                  className="w-full px-2 py-1 bg-[#13171a] border border-[#2c3338] rounded text-white text-xs"
                                />
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-500 block mb-0.5">Color</span>
                                <div className="flex items-center gap-1">
                                  <input
                                    type="color"
                                    value={currentWidget.settings.imageBorderColor || '#e2e8f0'}
                                    onChange={(e) => handleUpdateCurrentWidget({
                                      settings: { ...currentWidget.settings, imageBorderColor: e.target.value }
                                    })}
                                    className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Border Radius (Linked / Unlinked) */}
                          <div className="pt-2 border-t border-[#2c3338] space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-slate-400 font-semibold text-xs">Border Radius (px)</label>
                              <button
                                type="button"
                                onClick={() => setIsBorderRadiusLinked(!isBorderRadiusLinked)}
                                title={isBorderRadiusLinked ? 'Unlink Corner Radii' : 'Link Corner Radii'}
                                className={`p-1 rounded cursor-pointer ${isBorderRadiusLinked ? 'bg-orange-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                              >
                                {isBorderRadiusLinked ? <LinkIcon className="w-3 h-3" /> : <Unlink className="w-3 h-3" />}
                              </button>
                            </div>

                            {isBorderRadiusLinked ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="range"
                                  min={0}
                                  max={64}
                                  value={currentWidget.settings.imageBorderRadius ?? currentWidget.settings.borderRadius ?? 8}
                                  onChange={(e) => {
                                    const val = Number(e.target.value);
                                    handleUpdateCurrentWidget({
                                      settings: { 
                                        ...currentWidget.settings, 
                                        imageBorderRadius: val,
                                        borderRadius: val,
                                        imageBorderRadiusTopLeft: val,
                                        imageBorderRadiusTopRight: val,
                                        imageBorderRadiusBottomRight: val,
                                        imageBorderRadiusBottomLeft: val
                                      }
                                    });
                                  }}
                                  className="flex-1 accent-orange-600 cursor-pointer"
                                />
                                <input
                                  type="number"
                                  value={currentWidget.settings.imageBorderRadius ?? currentWidget.settings.borderRadius ?? 8}
                                  onChange={(e) => {
                                    const val = Number(e.target.value);
                                    handleUpdateCurrentWidget({
                                      settings: { 
                                        ...currentWidget.settings, 
                                        imageBorderRadius: val,
                                        borderRadius: val,
                                        imageBorderRadiusTopLeft: val,
                                        imageBorderRadiusTopRight: val,
                                        imageBorderRadiusBottomRight: val,
                                        imageBorderRadiusBottomLeft: val
                                      }
                                    });
                                  }}
                                  className="w-14 px-2 py-1 bg-[#13171a] border border-[#2c3338] rounded text-white text-xs font-mono text-center"
                                />
                              </div>
                            ) : (
                              <div className="grid grid-cols-4 gap-1 text-center">
                                <div>
                                  <span className="text-[10px] text-slate-500 block mb-0.5">TL</span>
                                  <input
                                    type="number"
                                    value={currentWidget.settings.imageBorderRadiusTopLeft ?? currentWidget.settings.imageBorderRadius ?? 8}
                                    onChange={(e) => handleUpdateCurrentWidget({
                                      settings: { ...currentWidget.settings, imageBorderRadiusTopLeft: Number(e.target.value) }
                                    })}
                                    className="w-full px-1.5 py-1 bg-[#13171a] border border-[#2c3338] rounded text-white text-xs text-center font-mono"
                                  />
                                </div>
                                <div>
                                  <span className="text-[10px] text-slate-500 block mb-0.5">TR</span>
                                  <input
                                    type="number"
                                    value={currentWidget.settings.imageBorderRadiusTopRight ?? currentWidget.settings.imageBorderRadius ?? 8}
                                    onChange={(e) => handleUpdateCurrentWidget({
                                      settings: { ...currentWidget.settings, imageBorderRadiusTopRight: Number(e.target.value) }
                                    })}
                                    className="w-full px-1.5 py-1 bg-[#13171a] border border-[#2c3338] rounded text-white text-xs text-center font-mono"
                                  />
                                </div>
                                <div>
                                  <span className="text-[10px] text-slate-500 block mb-0.5">BR</span>
                                  <input
                                    type="number"
                                    value={currentWidget.settings.imageBorderRadiusBottomRight ?? currentWidget.settings.imageBorderRadius ?? 8}
                                    onChange={(e) => handleUpdateCurrentWidget({
                                      settings: { ...currentWidget.settings, imageBorderRadiusBottomRight: Number(e.target.value) }
                                    })}
                                    className="w-full px-1.5 py-1 bg-[#13171a] border border-[#2c3338] rounded text-white text-xs text-center font-mono"
                                  />
                                </div>
                                <div>
                                  <span className="text-[10px] text-slate-500 block mb-0.5">BL</span>
                                  <input
                                    type="number"
                                    value={currentWidget.settings.imageBorderRadiusBottomLeft ?? currentWidget.settings.imageBorderRadius ?? 8}
                                    onChange={(e) => handleUpdateCurrentWidget({
                                      settings: { ...currentWidget.settings, imageBorderRadiusBottomLeft: Number(e.target.value) }
                                    })}
                                    className="w-full px-1.5 py-1 bg-[#13171a] border border-[#2c3338] rounded text-white text-xs text-center font-mono"
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Shadow Preset */}
                          <div className="pt-2 border-t border-[#2c3338]">
                            <label className="block text-slate-400 font-semibold mb-1">Drop Shadow Elevation</label>
                            <select
                              value={currentWidget.settings.imageShadowPreset || 'md'}
                              onChange={(e) => handleUpdateCurrentWidget({
                                settings: { ...currentWidget.settings, imageShadowPreset: e.target.value as any }
                              })}
                              className="w-full px-3 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white text-xs"
                            >
                              <option value="none">None</option>
                              <option value="sm">Soft Subtle Shadow (sm)</option>
                              <option value="md">Medium Shadow (md)</option>
                              <option value="lg">Large Elevated Shadow (lg)</option>
                              <option value="xl">Extra Large Floating Shadow (xl)</option>
                              <option value="2xl">Deep High-Elevation Shadow (2xl)</option>
                            </select>
                          </div>

                          {/* Interactive Hover Effects */}
                          <div className="pt-2 border-t border-[#2c3338] space-y-2">
                            <label className="block text-slate-400 font-semibold mb-1">Hover & Micro-Interactions</label>
                            <label className="flex items-center justify-between p-2 rounded bg-[#13171a] border border-[#2c3338] cursor-pointer">
                              <span className="text-xs text-slate-300">Smooth +2% Zoom on Hover</span>
                              <input
                                type="checkbox"
                                checked={!!currentWidget.settings.hoverScaleEffect}
                                onChange={(e) => handleUpdateCurrentWidget({
                                  settings: { ...currentWidget.settings, hoverScaleEffect: e.target.checked }
                                })}
                                className="w-4 h-4 accent-orange-600 rounded"
                              />
                            </label>
                            <label className="flex items-center justify-between p-2 rounded bg-[#13171a] border border-[#2c3338] cursor-pointer">
                              <span className="text-xs text-slate-300">Subtle Hover Opacity Effect</span>
                              <input
                                type="checkbox"
                                checked={!!currentWidget.settings.hoverOpacityEffect}
                                onChange={(e) => handleUpdateCurrentWidget({
                                  settings: { ...currentWidget.settings, hoverOpacityEffect: e.target.checked }
                                })}
                                className="w-4 h-4 accent-orange-600 rounded"
                              />
                            </label>
                          </div>
                        </div>
                      ) : (
                        /* STANDARD WIDGET TYPOGRAPHY & COLORS */
                        <div className="space-y-3.5">
                          {/* Typography */}
                          <div>
                            <label className="block text-slate-400 font-semibold mb-1">Font Size</label>
                            <input
                              type="text"
                              value={currentWidget.settings.fontSize || '24px'}
                              onChange={(e) => handleUpdateCurrentWidget({
                                settings: { ...currentWidget.settings, fontSize: e.target.value }
                              })}
                              placeholder="e.g. 24px, 2rem"
                              className="w-full px-3 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 font-semibold mb-1">Font Weight</label>
                            <select
                              value={currentWidget.settings.fontWeight || 'normal'}
                              onChange={(e) => handleUpdateCurrentWidget({
                                settings: { ...currentWidget.settings, fontWeight: e.target.value }
                              })}
                              className="w-full px-3 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white text-xs"
                            >
                              <option value="400">Regular (400)</option>
                              <option value="500">Medium (500)</option>
                              <option value="600">Semibold (600)</option>
                              <option value="700">Bold (700)</option>
                              <option value="800">Extrabold (800)</option>
                              <option value="900">Black (900)</option>
                            </select>
                          </div>

                          {/* Text Alignment */}
                          <div>
                            <label className="block text-slate-400 font-semibold mb-1">Text Alignment</label>
                            <div className="flex bg-[#13171a] border border-[#2c3338] rounded-lg p-0.5">
                              {(['left', 'center', 'right', 'justify'] as const).map(align => (
                                <button
                                  key={align}
                                  type="button"
                                  onClick={() => handleUpdateCurrentWidget({
                                    settings: { ...currentWidget.settings, textAlign: align }
                                  })}
                                  className={`flex-1 py-1 text-center font-semibold capitalize rounded transition ${
                                    (currentWidget.settings.textAlign || 'left') === align ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
                                  }`}
                                >
                                  {align}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Text Color */}
                          <div>
                            <label className="block text-slate-400 font-semibold mb-1">Text Color</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={currentWidget.settings.textColor || '#0f172a'}
                                onChange={(e) => handleUpdateCurrentWidget({
                                  settings: { ...currentWidget.settings, textColor: e.target.value }
                                })}
                                className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                              />
                              <input
                                type="text"
                                value={currentWidget.settings.textColor || '#0f172a'}
                                onChange={(e) => handleUpdateCurrentWidget({
                                  settings: { ...currentWidget.settings, textColor: e.target.value }
                                })}
                                className="flex-1 px-3 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white font-mono text-[11px]"
                              />
                            </div>
                          </div>

                          {/* Background Color */}
                          <div>
                            <label className="block text-slate-400 font-semibold mb-1">Background Color</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={currentWidget.settings.bgColor || '#ffffff'}
                                onChange={(e) => handleUpdateCurrentWidget({
                                  settings: { ...currentWidget.settings, bgColor: e.target.value }
                                })}
                                className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                              />
                              <input
                                type="text"
                                value={currentWidget.settings.bgColor || ''}
                                onChange={(e) => handleUpdateCurrentWidget({
                                  settings: { ...currentWidget.settings, bgColor: e.target.value }
                                })}
                                placeholder="transparent"
                                className="flex-1 px-3 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white font-mono text-[11px]"
                              />
                            </div>
                          </div>

                          {/* Border Radius */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-slate-400 font-semibold text-xs">
                                {currentWidget.type === 'category_grid' || currentWidget.type === 'product_categories'
                                  ? 'Category Card Border Radius'
                                  : 'Border Radius'}
                              </label>
                              <span className="text-orange-400 font-mono text-xs font-bold">
                                {(currentWidget.settings.categoryCardBorderRadius ?? currentWidget.settings.borderRadius ?? 12)}px
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="32"
                              step="2"
                              value={currentWidget.settings.categoryCardBorderRadius ?? currentWidget.settings.borderRadius ?? 12}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                handleUpdateCurrentWidget({
                                  settings: {
                                    ...currentWidget.settings,
                                    borderRadius: val,
                                    categoryCardBorderRadius: val
                                  }
                                });
                              }}
                              className="w-full accent-orange-500 cursor-pointer h-1.5 bg-[#252c32] rounded-lg mb-2"
                            />
                            <div className="grid grid-cols-5 gap-1">
                              {[
                                { label: 'Sharp', val: 0 },
                                { label: '6px', val: 6 },
                                { label: '12px', val: 12 },
                                { label: '16px', val: 16 },
                                { label: '24px', val: 24 }
                              ].map(preset => (
                                <button
                                  key={preset.val}
                                  type="button"
                                  onClick={() => handleUpdateCurrentWidget({
                                    settings: {
                                      ...currentWidget.settings,
                                      borderRadius: preset.val,
                                      categoryCardBorderRadius: preset.val
                                    }
                                  })}
                                  className={`py-1 text-[10px] rounded border text-center transition cursor-pointer ${
                                    (currentWidget.settings.categoryCardBorderRadius ?? currentWidget.settings.borderRadius ?? 12) === preset.val
                                      ? 'bg-orange-600 border-orange-500 text-white font-bold'
                                      : 'bg-[#191e23] border-[#2c3338] text-slate-400 hover:text-white'
                                  }`}
                                >
                                  {preset.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Category Grid Card Colors */}
                          {(currentWidget.type === 'category_grid' || currentWidget.type === 'product_categories') && (
                            <div className="space-y-3 pt-2 border-t border-[#2c3338]">
                              <div>
                                <label className="block text-slate-400 font-semibold mb-1 text-xs">Card Background Color</label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={currentWidget.settings.categoryCardBgColor || '#ffffff'}
                                    onChange={(e) => handleUpdateCurrentWidget({
                                      settings: { ...currentWidget.settings, categoryCardBgColor: e.target.value }
                                    })}
                                    className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={currentWidget.settings.categoryCardBgColor || '#ffffff'}
                                    onChange={(e) => handleUpdateCurrentWidget({
                                      settings: { ...currentWidget.settings, categoryCardBgColor: e.target.value }
                                    })}
                                    className="flex-1 px-3 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white font-mono text-[11px]"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-slate-400 font-semibold mb-1 text-xs">Card Border Color</label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={currentWidget.settings.categoryCardBorderColor || '#e2e8f0'}
                                    onChange={(e) => handleUpdateCurrentWidget({
                                      settings: { ...currentWidget.settings, categoryCardBorderColor: e.target.value }
                                    })}
                                    className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={currentWidget.settings.categoryCardBorderColor || '#e2e8f0'}
                                    onChange={(e) => handleUpdateCurrentWidget({
                                      settings: { ...currentWidget.settings, categoryCardBorderColor: e.target.value }
                                    })}
                                    className="flex-1 px-3 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white font-mono text-[11px]"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 3: SPACING (Linked / Unlinked Controls) */}
                  {inspectorTab === 'spacing' && (
                    <div className="space-y-4">
                      {/* Padding */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-slate-400 font-semibold">Padding (px)</label>
                          <button
                            onClick={() => setIsPaddingLinked(!isPaddingLinked)}
                            title={isPaddingLinked ? 'Unlink Padding Dimensions' : 'Link Padding Dimensions'}
                            className={`p-1 rounded cursor-pointer ${isPaddingLinked ? 'bg-orange-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                          >
                            {isPaddingLinked ? <LinkIcon className="w-3 h-3" /> : <Unlink className="w-3 h-3" />}
                          </button>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5 text-center">
                          <div>
                            <span className="text-[10px] text-slate-500 block mb-0.5">Top</span>
                            <input
                              type="number"
                              value={currentWidget.settings.paddingTop ?? 12}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                handleUpdateCurrentWidget({
                                  settings: {
                                    ...currentWidget.settings,
                                    paddingTop: val,
                                    ...(isPaddingLinked ? { paddingBottom: val, paddingLeft: val, paddingRight: val } : {})
                                  }
                                });
                              }}
                              className="w-full px-2 py-1 bg-[#13171a] border border-[#2c3338] rounded text-white text-center text-xs"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block mb-0.5">Right</span>
                            <input
                              type="number"
                              value={currentWidget.settings.paddingRight ?? 16}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                handleUpdateCurrentWidget({
                                  settings: {
                                    ...currentWidget.settings,
                                    paddingRight: val,
                                    ...(isPaddingLinked ? { paddingTop: val, paddingBottom: val, paddingLeft: val } : {})
                                  }
                                });
                              }}
                              className="w-full px-2 py-1 bg-[#13171a] border border-[#2c3338] rounded text-white text-center text-xs"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block mb-0.5">Bottom</span>
                            <input
                              type="number"
                              value={currentWidget.settings.paddingBottom ?? 12}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                handleUpdateCurrentWidget({
                                  settings: {
                                    ...currentWidget.settings,
                                    paddingBottom: val,
                                    ...(isPaddingLinked ? { paddingTop: val, paddingLeft: val, paddingRight: val } : {})
                                  }
                                });
                              }}
                              className="w-full px-2 py-1 bg-[#13171a] border border-[#2c3338] rounded text-white text-center text-xs"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block mb-0.5">Left</span>
                            <input
                              type="number"
                              value={currentWidget.settings.paddingLeft ?? 16}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                handleUpdateCurrentWidget({
                                  settings: {
                                    ...currentWidget.settings,
                                    paddingLeft: val,
                                    ...(isPaddingLinked ? { paddingTop: val, paddingBottom: val, paddingRight: val } : {})
                                  }
                                });
                              }}
                              className="w-full px-2 py-1 bg-[#13171a] border border-[#2c3338] rounded text-white text-center text-xs"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Margin */}
                      <div className="space-y-2 pt-3 border-t border-[#2c3338]">
                        <div className="flex items-center justify-between">
                          <label className="block text-slate-400 font-semibold">Margin (px)</label>
                          <button
                            onClick={() => setIsMarginLinked(!isMarginLinked)}
                            title={isMarginLinked ? 'Unlink Margin Dimensions' : 'Link Margin Dimensions'}
                            className={`p-1 rounded cursor-pointer ${isMarginLinked ? 'bg-orange-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                          >
                            {isMarginLinked ? <LinkIcon className="w-3 h-3" /> : <Unlink className="w-3 h-3" />}
                          </button>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5 text-center">
                          <div>
                            <span className="text-[10px] text-slate-500 block mb-0.5">Top</span>
                            <input
                              type="number"
                              value={currentWidget.settings.marginTop ?? 0}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                handleUpdateCurrentWidget({
                                  settings: {
                                    ...currentWidget.settings,
                                    marginTop: val,
                                    ...(isMarginLinked ? { marginBottom: val, marginLeft: val, marginRight: val } : {})
                                  }
                                });
                              }}
                              className="w-full px-2 py-1 bg-[#13171a] border border-[#2c3338] rounded text-white text-center text-xs"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block mb-0.5">Right</span>
                            <input
                              type="number"
                              value={currentWidget.settings.marginRight ?? 0}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                handleUpdateCurrentWidget({
                                  settings: {
                                    ...currentWidget.settings,
                                    marginRight: val,
                                    ...(isMarginLinked ? { marginTop: val, marginBottom: val, marginLeft: val } : {})
                                  }
                                });
                              }}
                              className="w-full px-2 py-1 bg-[#13171a] border border-[#2c3338] rounded text-white text-center text-xs"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block mb-0.5">Bottom</span>
                            <input
                              type="number"
                              value={currentWidget.settings.marginBottom ?? 8}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                handleUpdateCurrentWidget({
                                  settings: {
                                    ...currentWidget.settings,
                                    marginBottom: val,
                                    ...(isMarginLinked ? { marginTop: val, marginLeft: val, marginRight: val } : {})
                                  }
                                });
                              }}
                              className="w-full px-2 py-1 bg-[#13171a] border border-[#2c3338] rounded text-white text-center text-xs"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block mb-0.5">Left</span>
                            <input
                              type="number"
                              value={currentWidget.settings.marginLeft ?? 0}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                handleUpdateCurrentWidget({
                                  settings: {
                                    ...currentWidget.settings,
                                    marginLeft: val,
                                    ...(isMarginLinked ? { marginTop: val, marginBottom: val, marginRight: val } : {})
                                  }
                                });
                              }}
                              className="w-full px-2 py-1 bg-[#13171a] border border-[#2c3338] rounded text-white text-center text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: DEVICE (Responsive Visibility & Overrides) */}
                  {inspectorTab === 'device' && (
                    <div className="space-y-4">
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Toggle element visibility and configure viewport-specific overrides:
                      </p>

                      <div className="space-y-2">
                        <label className="flex items-center justify-between p-2 rounded bg-[#13171a] border border-[#2c3338] cursor-pointer">
                          <span className="font-semibold text-slate-300 text-xs">Hide on Desktop</span>
                          <input
                            type="checkbox"
                            checked={!!currentWidget.settings.hideDesktop}
                            onChange={(e) => handleUpdateCurrentWidget({
                              settings: { ...currentWidget.settings, hideDesktop: e.target.checked }
                            })}
                            className="w-4 h-4 accent-orange-600 rounded"
                          />
                        </label>

                        <label className="flex items-center justify-between p-2 rounded bg-[#13171a] border border-[#2c3338] cursor-pointer">
                          <span className="font-semibold text-slate-300 text-xs">Hide on Tablet</span>
                          <input
                            type="checkbox"
                            checked={!!currentWidget.settings.hideTablet}
                            onChange={(e) => handleUpdateCurrentWidget({
                              settings: { ...currentWidget.settings, hideTablet: e.target.checked }
                            })}
                            className="w-4 h-4 accent-orange-600 rounded"
                          />
                        </label>

                        <label className="flex items-center justify-between p-2 rounded bg-[#13171a] border border-[#2c3338] cursor-pointer">
                          <span className="font-semibold text-slate-300 text-xs">Hide on Mobile</span>
                          <input
                            type="checkbox"
                            checked={!!currentWidget.settings.hideMobile}
                            onChange={(e) => handleUpdateCurrentWidget({
                              settings: { ...currentWidget.settings, hideMobile: e.target.checked }
                            })}
                            className="w-4 h-4 accent-orange-600 rounded"
                          />
                        </label>
                      </div>

                      {/* Responsive Image Sizing Overrides */}
                      {currentWidget.type === 'image' && (
                        <div className="pt-3 border-t border-[#2c3338] space-y-3">
                          <span className="text-xs font-bold text-orange-400 uppercase tracking-wider block">
                            Responsive Size Overrides
                          </span>
                          <p className="text-[10px] text-slate-500">
                            Override width or height specifically on smaller screens:
                          </p>

                          {/* Desktop Overrides */}
                          <div className="p-2.5 bg-[#13171a] border border-[#2c3338] rounded-lg space-y-2">
                            <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                              <Monitor className="w-3.5 h-3.5 text-orange-400" />
                              <span>Desktop</span>
                            </span>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <span className="text-[10px] text-slate-500 block mb-0.5">Width</span>
                                <input
                                  type="text"
                                  value={currentWidget.settings.imageWidthDesktop || ''}
                                  onChange={(e) => handleUpdateCurrentWidget({
                                    settings: { ...currentWidget.settings, imageWidthDesktop: e.target.value }
                                  })}
                                  placeholder="Default (100%)"
                                  className="w-full px-2 py-1 bg-[#191e23] border border-[#2c3338] rounded text-white text-xs font-mono"
                                />
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-500 block mb-0.5">Height</span>
                                <input
                                  type="text"
                                  value={currentWidget.settings.imageHeightDesktop || ''}
                                  onChange={(e) => handleUpdateCurrentWidget({
                                    settings: { ...currentWidget.settings, imageHeightDesktop: e.target.value }
                                  })}
                                  placeholder="Auto / Inherit"
                                  className="w-full px-2 py-1 bg-[#191e23] border border-[#2c3338] rounded text-white text-xs font-mono"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Tablet Overrides */}
                          <div className="p-2.5 bg-[#13171a] border border-[#2c3338] rounded-lg space-y-2">
                            <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                              <Tablet className="w-3.5 h-3.5 text-orange-400" />
                              <span>Tablet (768px)</span>
                            </span>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <span className="text-[10px] text-slate-500 block mb-0.5">Width</span>
                                <input
                                  type="text"
                                  value={currentWidget.settings.imageWidthTablet || ''}
                                  onChange={(e) => handleUpdateCurrentWidget({
                                    settings: { ...currentWidget.settings, imageWidthTablet: e.target.value }
                                  })}
                                  placeholder="e.g. 100%, 500px"
                                  className="w-full px-2 py-1 bg-[#191e23] border border-[#2c3338] rounded text-white text-xs font-mono"
                                />
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-500 block mb-0.5">Height</span>
                                <input
                                  type="text"
                                  value={currentWidget.settings.imageHeightTablet || ''}
                                  onChange={(e) => handleUpdateCurrentWidget({
                                    settings: { ...currentWidget.settings, imageHeightTablet: e.target.value }
                                  })}
                                  placeholder="e.g. 350px, auto"
                                  className="w-full px-2 py-1 bg-[#191e23] border border-[#2c3338] rounded text-white text-xs font-mono"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Mobile Overrides */}
                          <div className="p-2.5 bg-[#13171a] border border-[#2c3338] rounded-lg space-y-2">
                            <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                              <Smartphone className="w-3.5 h-3.5 text-orange-400" />
                              <span>Mobile (375px)</span>
                            </span>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <span className="text-[10px] text-slate-500 block mb-0.5">Width</span>
                                <input
                                  type="text"
                                  value={currentWidget.settings.imageWidthMobile || ''}
                                  onChange={(e) => handleUpdateCurrentWidget({
                                    settings: { ...currentWidget.settings, imageWidthMobile: e.target.value }
                                  })}
                                  placeholder="e.g. 100%"
                                  className="w-full px-2 py-1 bg-[#191e23] border border-[#2c3338] rounded text-white text-xs font-mono"
                                />
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-500 block mb-0.5">Height</span>
                                <input
                                  type="text"
                                  value={currentWidget.settings.imageHeightMobile || ''}
                                  onChange={(e) => handleUpdateCurrentWidget({
                                    settings: { ...currentWidget.settings, imageHeightMobile: e.target.value }
                                  })}
                                  placeholder="e.g. 240px, auto"
                                  className="w-full px-2 py-1 bg-[#191e23] border border-[#2c3338] rounded text-white text-xs font-mono"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 5: ADVANCED (Custom CSS, ID, Animation) */}
                  {inspectorTab === 'advanced' && (
                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-slate-400 font-semibold mb-1">CSS ID (Anchor Link)</label>
                        <input
                          type="text"
                          value={currentWidget.settings.elementId || ''}
                          onChange={(e) => handleUpdateCurrentWidget({
                            settings: { ...currentWidget.settings, elementId: e.target.value }
                          })}
                          placeholder="e.g. toners, rfq-form"
                          className="w-full px-3 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white font-mono text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 font-semibold mb-1">CSS Classes (Tailwind)</label>
                        <input
                          type="text"
                          value={currentWidget.settings.cssClasses || ''}
                          onChange={(e) => handleUpdateCurrentWidget({
                            settings: { ...currentWidget.settings, cssClasses: e.target.value }
                          })}
                          placeholder="e.g. shadow-2xl border border-blue-500"
                          className="w-full px-3 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white font-mono text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 font-semibold mb-1">Entrance Animation</label>
                        <select
                          value={currentWidget.settings.animation || 'none'}
                          onChange={(e) => handleUpdateCurrentWidget({
                            settings: { ...currentWidget.settings, animation: e.target.value as any }
                          })}
                          className="w-full px-3 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white text-xs"
                        >
                          <option value="none">None</option>
                          <option value="fade">Fade In</option>
                          <option value="fade-up">Fade Up</option>
                          <option value="fade-down">Fade Down</option>
                          <option value="zoom">Zoom In</option>
                        </select>
                      </div>
                    </div>
                  )}
                </>
              ) : currentSection ? (
                /* SECTION SETTINGS (When Section is clicked) */
                <div className="space-y-4">
                  {/* Active Section Identifier & Quick Action Buttons */}
                  <div className="p-2.5 bg-[#13171a] rounded-xl border border-[#2c3338] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-orange-400 uppercase tracking-wider">Target Container</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleCopySection(currentSection)}
                          title="Copy Section"
                          className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#252c32] cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopySectionStyle(currentSection.settings)}
                          title="Copy Section Style"
                          className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#252c32] cursor-pointer"
                        >
                          <Palette className="w-3 h-3" />
                        </button>
                        {copiedSectionStyle && (
                          <button
                            type="button"
                            onClick={() => handlePasteSectionStyle(currentSection.id)}
                            title="Paste Section Style"
                            className="p-1 rounded text-orange-400 hover:text-orange-300 hover:bg-[#252c32] cursor-pointer"
                          >
                            <Sparkles className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                    <input
                      type="text"
                      value={currentSection.name}
                      onChange={(e) => handleUpdateCurrentSection({ name: e.target.value })}
                      className="w-full px-2 py-1 bg-transparent border-b border-[#2c3338] text-white font-bold text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* TAB 1: CONTENT / LAYOUT & FLEX */}
                  {inspectorTab === 'content' && (
                    <div className="space-y-4">
                      {/* Container Layout Mode */}
                      <div>
                        <label className="block text-slate-400 font-semibold mb-1 text-xs">Container Layout</label>
                        <div className="grid grid-cols-2 gap-1 bg-[#13171a] border border-[#2c3338] rounded-lg p-0.5">
                          {(['boxed', 'full-width', 'full-bleed', 'custom'] as const).map(mode => (
                            <button
                              key={mode}
                              type="button"
                              onClick={() => handleUpdateCurrentSection({
                                settings: { ...currentSection.settings, layout: mode }
                              })}
                              className={`py-1 text-center font-semibold rounded text-xs capitalize transition ${
                                (currentSection.settings.layout || 'full-width') === mode ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              {mode.replace('-', ' ')}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Max Container Width */}
                      <div>
                        <label className="block text-slate-400 font-semibold mb-1 text-xs">Max Container Width</label>
                        <select
                          value={currentSection.settings.contentMaxWidth || '100%'}
                          onChange={(e) => handleUpdateCurrentSection({
                            settings: { ...currentSection.settings, contentMaxWidth: e.target.value }
                          })}
                          className="w-full px-2.5 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white text-xs"
                        >
                          <option value="100%">100% Fluid (Window Fit)</option>
                          <option value="1600px">Ultra-Wide (1600px)</option>
                          <option value="1440px">Wide Modern (1440px)</option>
                          <option value="1280px">Default Modern (1280px / 7xl)</option>
                          <option value="1140px">Standard (1140px)</option>
                          <option value="960px">Compact (960px)</option>
                        </select>
                      </div>

                      {/* Custom Width / Min Height */}
                      {currentSection.settings.layout === 'custom' && (
                        <div className="p-2.5 bg-[#13171a] border border-[#2c3338] rounded-lg space-y-2">
                          <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider block">Custom Sizing</span>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-[10px] text-slate-500 block mb-0.5">Width</span>
                              <input
                                type="text"
                                value={currentSection.settings.customWidth || ''}
                                onChange={(e) => handleUpdateCurrentSection({
                                  settings: { ...currentSection.settings, customWidth: e.target.value }
                                })}
                                placeholder="e.g. 100%, 1200px"
                                className="w-full px-2 py-1 bg-[#191e23] border border-[#2c3338] rounded text-white text-xs font-mono"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-500 block mb-0.5">Min Height</span>
                              <input
                                type="text"
                                value={currentSection.settings.customMinHeight || ''}
                                onChange={(e) => handleUpdateCurrentSection({
                                  settings: { ...currentSection.settings, customMinHeight: e.target.value }
                                })}
                                placeholder="e.g. 400px, 80vh"
                                className="w-full px-2 py-1 bg-[#191e23] border border-[#2c3338] rounded text-white text-xs font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Column Preset Structure */}
                      <div className="pt-2 border-t border-[#2c3338]">
                        <label className="block text-slate-400 font-semibold mb-1 text-xs">Column Structure</label>
                        <select
                          value={currentSection.settings.columnsPreset || '1-col'}
                          onChange={(e) => handleUpdateCurrentSection({
                            settings: { ...currentSection.settings, columnsPreset: e.target.value as any }
                          })}
                          className="w-full px-3 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white text-xs"
                        >
                          <option value="1-col">1 Column (100% - Full Width)</option>
                          <option value="2-col-equal">2 Columns Equal (50% / 50%)</option>
                          <option value="3-col-equal">3 Columns Equal (33% / 33% / 33%)</option>
                          <option value="4-col-equal">4 Columns Equal (25% each)</option>
                          <option value="30-70">Sidebar Left (30% / 70%)</option>
                          <option value="70-30">Sidebar Right (70% / 30%)</option>
                          <option value="40-60">Asymmetric (40% / 60%)</option>
                          <option value="60-40">Asymmetric (60% / 40%)</option>
                          <option value="25-75">Narrow Sidebar Left (25% / 75%)</option>
                          <option value="75-25">Narrow Sidebar Right (75% / 25%)</option>
                          <option value="33-67">1/3 + 2/3 Split</option>
                          <option value="67-33">2/3 + 1/3 Split</option>
                        </select>
                      </div>

                      {/* Flex Controls */}
                      <div className="p-2.5 bg-[#13171a] border border-[#2c3338] rounded-lg space-y-2.5 pt-2">
                        <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider block">Flexbox Alignment</span>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-[10px] text-slate-500 block mb-0.5">Direction</span>
                            <select
                              value={currentSection.settings.flexDirection || 'row'}
                              onChange={(e) => handleUpdateCurrentSection({
                                settings: { ...currentSection.settings, flexDirection: e.target.value as any }
                              })}
                              className="w-full px-2 py-1 bg-[#191e23] border border-[#2c3338] rounded text-white text-xs"
                            >
                              <option value="row">Row (Horizontal)</option>
                              <option value="column">Column (Vertical)</option>
                            </select>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block mb-0.5">Wrap</span>
                            <select
                              value={currentSection.settings.flexWrap || 'wrap'}
                              onChange={(e) => handleUpdateCurrentSection({
                                settings: { ...currentSection.settings, flexWrap: e.target.value as any }
                              })}
                              className="w-full px-2 py-1 bg-[#191e23] border border-[#2c3338] rounded text-white text-xs"
                            >
                              <option value="wrap">Wrap</option>
                              <option value="nowrap">No Wrap</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-[10px] text-slate-500 block mb-0.5">Justify Content</span>
                            <select
                              value={currentSection.settings.justifyContent || 'flex-start'}
                              onChange={(e) => handleUpdateCurrentSection({
                                settings: { ...currentSection.settings, justifyContent: e.target.value as any }
                              })}
                              className="w-full px-2 py-1 bg-[#191e23] border border-[#2c3338] rounded text-white text-xs"
                            >
                              <option value="flex-start">Start</option>
                              <option value="center">Center</option>
                              <option value="flex-end">End</option>
                              <option value="space-between">Space Between</option>
                              <option value="space-around">Space Around</option>
                              <option value="space-evenly">Space Evenly</option>
                            </select>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block mb-0.5">Align Items</span>
                            <select
                              value={currentSection.settings.alignItems || 'stretch'}
                              onChange={(e) => handleUpdateCurrentSection({
                                settings: { ...currentSection.settings, alignItems: e.target.value as any }
                              })}
                              className="w-full px-2 py-1 bg-[#191e23] border border-[#2c3338] rounded text-white text-xs"
                            >
                              <option value="stretch">Stretch</option>
                              <option value="flex-start">Start</option>
                              <option value="center">Center</option>
                              <option value="flex-end">End</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-[10px] text-slate-500 block mb-0.5">Column Gap (px)</span>
                            <input
                              type="number"
                              value={currentSection.settings.columnGap ?? 16}
                              onChange={(e) => handleUpdateCurrentSection({
                                settings: { ...currentSection.settings, columnGap: Number(e.target.value) }
                              })}
                              className="w-full px-2 py-1 bg-[#191e23] border border-[#2c3338] rounded text-white text-xs text-center"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block mb-0.5">Row Gap (px)</span>
                            <input
                              type="number"
                              value={currentSection.settings.rowGap ?? 16}
                              onChange={(e) => handleUpdateCurrentSection({
                                settings: { ...currentSection.settings, rowGap: Number(e.target.value) }
                              })}
                              className="w-full px-2 py-1 bg-[#191e23] border border-[#2c3338] rounded text-white text-xs text-center"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: STYLE (Background, Borders, Shadows, Opacity) */}
                  {inspectorTab === 'style' && (
                    <div className="space-y-4">
                      {/* Background Color */}
                      <div>
                        <label className="block text-slate-400 font-semibold mb-1 text-xs">Background Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={currentSection.settings.bgColor || '#ffffff'}
                            onChange={(e) => handleUpdateCurrentSection({
                              settings: { ...currentSection.settings, bgColor: e.target.value }
                            })}
                            className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                          />
                          <input
                            type="text"
                            value={currentSection.settings.bgColor || ''}
                            onChange={(e) => handleUpdateCurrentSection({
                              settings: { ...currentSection.settings, bgColor: e.target.value }
                            })}
                            placeholder="e.g. #ffffff, transparent"
                            className="flex-1 px-3 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white font-mono text-xs"
                          />
                        </div>
                      </div>

                      {/* Background Gradient */}
                      <div>
                        <label className="block text-slate-400 font-semibold mb-1 text-xs">Background Gradient (CSS)</label>
                        <input
                          type="text"
                          value={currentSection.settings.bgGradient || ''}
                          onChange={(e) => handleUpdateCurrentSection({
                            settings: { ...currentSection.settings, bgGradient: e.target.value }
                          })}
                          placeholder="linear-gradient(135deg, #f97316 0%, #ea580c 100%)"
                          className="w-full px-3 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white font-mono text-xs"
                        />
                      </div>

                      {/* Background Image */}
                      <div>
                        <label className="block text-slate-400 font-semibold mb-1 text-xs">Background Image URL</label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={currentSection.settings.bgImage || ''}
                            onChange={(e) => handleUpdateCurrentSection({
                              settings: { ...currentSection.settings, bgImage: e.target.value }
                            })}
                            placeholder="https://images.unsplash.com/..."
                            className="flex-1 px-2.5 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white font-mono text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setMediaTargetField('section-bg');
                              setIsMediaPickerOpen(true);
                            }}
                            className="px-2.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-bold flex items-center gap-1 cursor-pointer text-xs"
                          >
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>Media</span>
                          </button>
                        </div>
                      </div>

                      {currentSection.settings.bgImage && (
                        <div className="p-2.5 bg-[#13171a] border border-[#2c3338] rounded-lg space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-[10px] text-slate-500 block mb-0.5">Size</span>
                              <select
                                value={currentSection.settings.bgSize || 'cover'}
                                onChange={(e) => handleUpdateCurrentSection({
                                  settings: { ...currentSection.settings, bgSize: e.target.value as any }
                                })}
                                className="w-full px-2 py-1 bg-[#191e23] border border-[#2c3338] rounded text-white text-xs"
                              >
                                <option value="cover">Cover</option>
                                <option value="contain">Contain</option>
                                <option value="auto">Auto</option>
                              </select>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-500 block mb-0.5">Position</span>
                              <select
                                value={currentSection.settings.bgPosition || 'center'}
                                onChange={(e) => handleUpdateCurrentSection({
                                  settings: { ...currentSection.settings, bgPosition: e.target.value }
                                })}
                                className="w-full px-2 py-1 bg-[#191e23] border border-[#2c3338] rounded text-white text-xs"
                              >
                                <option value="center">Center</option>
                                <option value="top">Top</option>
                                <option value="bottom">Bottom</option>
                                <option value="left">Left</option>
                                <option value="right">Right</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] text-slate-400">Dark Overlay Opacity</span>
                              <span className="text-[10px] font-mono text-orange-400">
                                {Math.round((currentSection.settings.bgOverlayOpacity ?? 0) * 100)}%
                              </span>
                            </div>
                            <input
                              type="range"
                              min={0}
                              max={0.9}
                              step={0.05}
                              value={currentSection.settings.bgOverlayOpacity ?? 0}
                              onChange={(e) => handleUpdateCurrentSection({
                                settings: { ...currentSection.settings, bgOverlayOpacity: parseFloat(e.target.value) }
                              })}
                              className="w-full accent-orange-600 cursor-pointer"
                            />
                          </div>
                        </div>
                      )}

                      {/* Border Controls */}
                      <div className="pt-2 border-t border-[#2c3338] space-y-2">
                        <label className="block text-slate-400 font-semibold text-xs">Section Border</label>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-[10px] text-slate-500 block mb-0.5">Style</span>
                            <select
                              value={currentSection.settings.borderStyle || 'none'}
                              onChange={(e) => handleUpdateCurrentSection({
                                settings: { ...currentSection.settings, borderStyle: e.target.value as any }
                              })}
                              className="w-full px-2 py-1 bg-[#13171a] border border-[#2c3338] rounded text-white text-xs"
                            >
                              <option value="none">None</option>
                              <option value="solid">Solid</option>
                              <option value="dashed">Dashed</option>
                              <option value="dotted">Dotted</option>
                            </select>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block mb-0.5">Color</span>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="color"
                                value={currentSection.settings.borderColor || '#e2e8f0'}
                                onChange={(e) => handleUpdateCurrentSection({
                                  settings: { ...currentSection.settings, borderColor: e.target.value }
                                })}
                                className="w-6 h-6 rounded border border-slate-700 bg-transparent cursor-pointer"
                              />
                              <input
                                type="text"
                                value={currentSection.settings.borderColor || ''}
                                onChange={(e) => handleUpdateCurrentSection({
                                  settings: { ...currentSection.settings, borderColor: e.target.value }
                                })}
                                placeholder="#e2e8f0"
                                className="flex-1 px-1.5 py-1 bg-[#13171a] border border-[#2c3338] rounded text-white font-mono text-[10px]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Border Radius */}
                      <div className="pt-2 border-t border-[#2c3338] space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-slate-400 font-semibold text-xs">Border Radius (px)</label>
                          <button
                            type="button"
                            onClick={() => setIsBorderRadiusLinked(!isBorderRadiusLinked)}
                            className={`p-1 rounded cursor-pointer ${isBorderRadiusLinked ? 'bg-orange-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                          >
                            {isBorderRadiusLinked ? <LinkIcon className="w-3 h-3" /> : <Unlink className="w-3 h-3" />}
                          </button>
                        </div>
                        {isBorderRadiusLinked ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min={0}
                              max={48}
                              value={currentSection.settings.borderRadius ?? 0}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                handleUpdateCurrentSection({
                                  settings: {
                                    ...currentSection.settings,
                                    borderRadius: val,
                                    borderRadiusTopLeft: val,
                                    borderRadiusTopRight: val,
                                    borderRadiusBottomRight: val,
                                    borderRadiusBottomLeft: val
                                  }
                                });
                              }}
                              className="flex-1 accent-orange-600 cursor-pointer"
                            />
                            <span className="font-mono text-xs text-orange-400 w-8 text-right">
                              {currentSection.settings.borderRadius ?? 0}px
                            </span>
                          </div>
                        ) : (
                          <div className="grid grid-cols-4 gap-1.5">
                            {(['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft'] as const).map(corner => (
                              <div key={corner} className="text-center">
                                <span className="text-[9px] text-slate-500 block mb-0.5">{corner.slice(0, 2)}</span>
                                <input
                                  type="number"
                                  value={(currentSection.settings as any)[`borderRadius${corner}`] ?? 0}
                                  onChange={(e) => handleUpdateCurrentSection({
                                    settings: { ...currentSection.settings, [`borderRadius${corner}`]: Number(e.target.value) }
                                  })}
                                  className="w-full px-1 py-1 bg-[#13171a] border border-[#2c3338] rounded text-white text-xs text-center font-mono"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Box Shadow */}
                      <div className="pt-2 border-t border-[#2c3338] space-y-2">
                        <label className="block text-slate-400 font-semibold text-xs">Elevation & Shadow</label>
                        <select
                          value={currentSection.settings.shadowPreset || 'none'}
                          onChange={(e) => handleUpdateCurrentSection({
                            settings: { ...currentSection.settings, shadowPreset: e.target.value as any }
                          })}
                          className="w-full px-2.5 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white text-xs"
                        >
                          <option value="none">None</option>
                          <option value="sm">Soft (sm)</option>
                          <option value="md">Medium (md)</option>
                          <option value="lg">Elevated (lg)</option>
                          <option value="xl">Floating (xl)</option>
                          <option value="2xl">Dramatic (2xl)</option>
                          <option value="custom">Custom Shadow Parameters</option>
                        </select>
                      </div>

                      {/* Section Opacity */}
                      <div className="pt-2 border-t border-[#2c3338] space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-slate-400 font-semibold text-xs">Section Opacity</label>
                          <span className="text-xs font-mono text-orange-400">
                            {Math.round((currentSection.settings.opacity ?? 1) * 100)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0.1}
                          max={1}
                          step={0.05}
                          value={currentSection.settings.opacity ?? 1}
                          onChange={(e) => handleUpdateCurrentSection({
                            settings: { ...currentSection.settings, opacity: parseFloat(e.target.value) }
                          })}
                          className="w-full accent-orange-600 cursor-pointer"
                        />
                      </div>
                    </div>
                  )}

                  {/* TAB 3: SPACING (Responsive Padding & Margin) */}
                  {inspectorTab === 'spacing' && (
                    <div className="space-y-4">
                      {/* Responsive Padding */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <label className="text-slate-400 font-semibold text-xs">Padding (px)</label>
                            <span className="text-[10px] text-orange-400 uppercase font-mono font-bold">
                              ({deviceMode})
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsPaddingLinked(!isPaddingLinked)}
                            className={`p-1 rounded cursor-pointer ${isPaddingLinked ? 'bg-orange-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                          >
                            {isPaddingLinked ? <LinkIcon className="w-3 h-3" /> : <Unlink className="w-3 h-3" />}
                          </button>
                        </div>

                        <div className="grid grid-cols-4 gap-1.5">
                          {(['Top', 'Right', 'Bottom', 'Left'] as const).map(side => {
                            const sideKey = deviceMode === 'mobile'
                              ? `padding${side}Mobile`
                              : deviceMode === 'tablet'
                              ? `padding${side}Tablet`
                              : `padding${side}`;
                            const val = (currentSection.settings as any)[sideKey] ?? (side === 'Top' || side === 'Bottom' ? 48 : 24);

                            return (
                              <div key={side} className="text-center">
                                <span className="text-[9px] text-slate-500 block mb-0.5">{side}</span>
                                <input
                                  type="number"
                                  value={val}
                                  onChange={(e) => {
                                    const numVal = Number(e.target.value);
                                    if (isPaddingLinked) {
                                      const updates: any = {};
                                      ['Top', 'Right', 'Bottom', 'Left'].forEach(s => {
                                        const k = deviceMode === 'mobile' ? `padding${s}Mobile` : deviceMode === 'tablet' ? `padding${s}Tablet` : `padding${s}`;
                                        updates[k] = numVal;
                                      });
                                      handleUpdateCurrentSection({ settings: { ...currentSection.settings, ...updates } });
                                    } else {
                                      handleUpdateCurrentSection({ settings: { ...currentSection.settings, [sideKey]: numVal } });
                                    }
                                  }}
                                  className="w-full px-1 py-1 bg-[#13171a] border border-[#2c3338] rounded text-white text-xs text-center font-mono"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Margin */}
                      <div className="pt-2 border-t border-[#2c3338] space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-slate-400 font-semibold text-xs">Margin (px)</label>
                          <button
                            type="button"
                            onClick={() => setIsMarginLinked(!isMarginLinked)}
                            className={`p-1 rounded cursor-pointer ${isMarginLinked ? 'bg-orange-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                          >
                            {isMarginLinked ? <LinkIcon className="w-3 h-3" /> : <Unlink className="w-3 h-3" />}
                          </button>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5">
                          {(['Top', 'Right', 'Bottom', 'Left'] as const).map(side => (
                            <div key={side} className="text-center">
                              <span className="text-[9px] text-slate-500 block mb-0.5">{side}</span>
                              <input
                                type="number"
                                value={(currentSection.settings as any)[`margin${side}`] ?? 0}
                                onChange={(e) => {
                                  const numVal = Number(e.target.value);
                                  if (isMarginLinked) {
                                    handleUpdateCurrentSection({
                                      settings: {
                                        ...currentSection.settings,
                                        marginTop: numVal,
                                        marginRight: numVal,
                                        marginBottom: numVal,
                                        marginLeft: numVal
                                      }
                                    });
                                  } else {
                                    handleUpdateCurrentSection({
                                      settings: { ...currentSection.settings, [`margin${side}`]: numVal }
                                    });
                                  }
                                }}
                                className="w-full px-1 py-1 bg-[#13171a] border border-[#2c3338] rounded text-white text-xs text-center font-mono"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: DEVICE (Responsive Visibility) */}
                  {inspectorTab === 'device' && (
                    <div className="space-y-3">
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Toggle container visibility across target screen viewports:
                      </p>
                      <div className="space-y-2">
                        <label className="flex items-center justify-between p-2.5 rounded-lg bg-[#13171a] border border-[#2c3338] cursor-pointer">
                          <span className="font-semibold text-slate-300 text-xs">Hide on Desktop</span>
                          <input
                            type="checkbox"
                            checked={!!currentSection.settings.hideDesktop}
                            onChange={(e) => handleUpdateCurrentSection({
                              settings: { ...currentSection.settings, hideDesktop: e.target.checked }
                            })}
                            className="w-4 h-4 accent-orange-600 rounded"
                          />
                        </label>
                        <label className="flex items-center justify-between p-2.5 rounded-lg bg-[#13171a] border border-[#2c3338] cursor-pointer">
                          <span className="font-semibold text-slate-300 text-xs">Hide on Tablet</span>
                          <input
                            type="checkbox"
                            checked={!!currentSection.settings.hideTablet}
                            onChange={(e) => handleUpdateCurrentSection({
                              settings: { ...currentSection.settings, hideTablet: e.target.checked }
                            })}
                            className="w-4 h-4 accent-orange-600 rounded"
                          />
                        </label>
                        <label className="flex items-center justify-between p-2.5 rounded-lg bg-[#13171a] border border-[#2c3338] cursor-pointer">
                          <span className="font-semibold text-slate-300 text-xs">Hide on Mobile</span>
                          <input
                            type="checkbox"
                            checked={!!currentSection.settings.hideMobile}
                            onChange={(e) => handleUpdateCurrentSection({
                              settings: { ...currentSection.settings, hideMobile: e.target.checked }
                            })}
                            className="w-4 h-4 accent-orange-600 rounded"
                          />
                        </label>
                      </div>
                    </div>
                  )}

                  {/* TAB 5: ADVANCED (Custom CSS, ID, Animation) */}
                  {inspectorTab === 'advanced' && (
                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-slate-400 font-semibold mb-1 text-xs">CSS ID (Anchor Link)</label>
                        <input
                          type="text"
                          value={currentSection.settings.elementId || ''}
                          onChange={(e) => handleUpdateCurrentSection({
                            settings: { ...currentSection.settings, elementId: e.target.value }
                          })}
                          placeholder="e.g. products, contact-section"
                          className="w-full px-3 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white font-mono text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 font-semibold mb-1 text-xs">CSS Classes (Tailwind)</label>
                        <input
                          type="text"
                          value={currentSection.settings.cssClasses || ''}
                          onChange={(e) => handleUpdateCurrentSection({
                            settings: { ...currentSection.settings, cssClasses: e.target.value }
                          })}
                          placeholder="e.g. overflow-hidden backdrop-blur-md"
                          className="w-full px-3 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white font-mono text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 font-semibold mb-1 text-xs">Entrance Animation</label>
                        <select
                          value={currentSection.settings.animation || 'none'}
                          onChange={(e) => handleUpdateCurrentSection({
                            settings: { ...currentSection.settings, animation: e.target.value as any }
                          })}
                          className="w-full px-3 py-1.5 bg-[#13171a] border border-[#2c3338] rounded-lg text-white text-xs"
                        >
                          <option value="none">None</option>
                          <option value="fade">Fade In</option>
                          <option value="fade-up">Fade Up</option>
                          <option value="fade-down">Fade Down</option>
                          <option value="zoom">Zoom In</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-400 font-semibold mb-1 text-xs">Scoped Custom CSS</label>
                        <textarea
                          rows={4}
                          value={currentSection.settings.customCss || ''}
                          onChange={(e) => handleUpdateCurrentSection({
                            settings: { ...currentSection.settings, customCss: e.target.value }
                          })}
                          placeholder="/* Scoped CSS */ selector { outline: 1px solid red; }"
                          className="w-full px-3 py-2 bg-[#13171a] border border-[#2c3338] rounded-lg text-white font-mono text-xs resize-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 space-y-2">
                  <Sliders className="w-8 h-8 mx-auto opacity-40" />
                  <p className="text-xs">Click any section or widget on the canvas to inspect and edit properties.</p>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* ----------------------------------------------------
          3. MEDIA PICKER MODAL
      ---------------------------------------------------- */}
      {isMediaPickerOpen && (
        <MediaPickerModal
          isOpen={isMediaPickerOpen}
          onClose={() => setIsMediaPickerOpen(false)}
          mediaItems={mediaItems}
          onUploadMedia={onUploadMedia}
          onSelectImage={(imageUrl) => {
            if (mediaTargetField === 'widget-image') {
              handleUpdateCurrentWidget({
                content: { ...currentWidget?.content, imageUrl }
              });
            } else if (mediaTargetField === 'section-bg') {
              handleUpdateCurrentSection({
                settings: { ...currentSection?.settings, bgImage: imageUrl }
              });
            } else if (mediaTargetField === 'widget-slide-image' && selectedSlideIndexForMedia !== null && currentWidget?.content.items) {
              const updatedItems = [...currentWidget.content.items];
              if (updatedItems[selectedSlideIndexForMedia]) {
                updatedItems[selectedSlideIndexForMedia] = {
                  ...updatedItems[selectedSlideIndexForMedia],
                  image: imageUrl,
                  imageUrl: imageUrl
                };
                handleUpdateCurrentWidget({
                  content: { ...currentWidget.content, items: updatedItems }
                });
              }
            }
            setIsMediaPickerOpen(false);
          }}
        />
      )}

      {/* ----------------------------------------------------
          4. REVISIONS HISTORY MODAL
      ---------------------------------------------------- */}
      {isRevisionsOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-[#191e23] border border-[#2c3338] rounded-2xl w-full max-w-xl p-6 space-y-4 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2c3338] pb-3">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-orange-400" />
                <h3 className="font-black text-sm">Page Revision History</h3>
              </div>
              <button
                onClick={() => setIsRevisionsOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {revisions.map((rev, idx) => (
                <div
                  key={rev.id}
                  className="p-3 bg-[#13171a] border border-[#2c3338] rounded-xl flex items-center justify-between hover:border-orange-500/50 transition"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">Version {revisions.length - idx}</span>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                        {rev.sections.length} Sections
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{rev.timestamp} • by {rev.author}</p>
                    {rev.summary && <p className="text-[10px] text-slate-500 italic mt-0.5">{rev.summary}</p>}
                  </div>

                  <button
                    onClick={() => handleRestoreRevision(rev)}
                    className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-bold text-xs transition cursor-pointer"
                  >
                    Restore
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          5. TOAST NOTIFICATION
      ---------------------------------------------------- */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-700 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
