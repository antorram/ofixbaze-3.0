import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  FileText, 
  Headphones, 
  ArrowRight, 
  Sparkles, 
  Star, 
  Quote, 
  ChevronLeft,
  ChevronRight, 
  SlidersHorizontal,
  CheckCircle2, 
  Play, 
  ExternalLink, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Search, 
  Heart, 
  ShoppingBag, 
  Eye, 
  Layers, 
  Copy, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Edit3, 
  HelpCircle, 
  Check,
  Flame,
  Award,
  BadgeCheck,
  Paintbrush,
  ClipboardCheck,
  CopyCheck,
  BookmarkPlus
} from 'lucide-react';
import { 
  CMSSection, 
  CMSWidget, 
  Product, 
  Category, 
  Currency, 
  ActivePage, 
  Brand,
  DeviceMode 
} from '../types';
import { ProductCard } from './ProductCard';
import { isProductInCategory } from '../utils/categoryMatcher';
import { SlideConfig, INITIAL_SLIDES_CONFIG } from '../data/adminData';
import { HeroSlider } from './HeroSlider';
import { 
  CMSLogoSliderWidget, 
  CMSProductSliderWidget, 
  CMSImageSliderWidget 
} from './CMSSliderWidgets';

interface CMSSectionRendererProps {
  section: CMSSection;
  products: Product[];
  categories: Category[];
  currency: Currency;
  setActivePage: (page: ActivePage) => void;
  onSelectCategory?: (slug: string) => void;
  onSelectProduct?: (product: Product) => void;
  onAddToCart?: (product: Product, quantity?: number) => void;
  onToggleWishlist?: (productId: string) => void;
  wishlistIds?: string[];
  onQuickView?: (product: Product) => void;
  onOpenAuthenticityModal?: () => void;
  slides?: SlideConfig[];
  // Builder specific props (optional - if provided, enables builder selection & inline tools)
  isBuilderMode?: boolean;
  selectedSectionId?: string | null;
  selectedWidgetId?: string | null;
  onSelectSection?: (sectionId: string) => void;
  onSelectWidget?: (sectionId: string, widgetId: string) => void;
  onUpdateWidgetContent?: (widgetId: string, updates: Partial<CMSWidget['content']>) => void;
  onDuplicateWidget?: (sectionId: string, widget: CMSWidget) => void;
  onDeleteWidget?: (sectionId: string, widgetId: string) => void;
  onMoveWidget?: (sectionId: string, widgetId: string, direction: 'up' | 'down') => void;
  onCopyWidget?: (widget: CMSWidget) => void;
  onCopyWidgetStyle?: (settings: any) => void;
  onPasteWidgetStyle?: (sectionId: string, widgetId: string) => void;
  onMoveSection?: (direction: 'up' | 'down') => void;
  onDuplicateSection?: () => void;
  onDeleteSection?: () => void;
  onCopySection?: (section: CMSSection) => void;
  onCopySectionStyle?: (settings: any) => void;
  onPasteSectionStyle?: (sectionId: string) => void;
  onSaveSectionAsTemplate?: () => void;
  onToggleSectionVisibility?: () => void;
  hasCopiedWidgetStyle?: boolean;
  hasCopiedSectionStyle?: boolean;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  deviceMode?: 'desktop' | 'tablet' | 'mobile';
}

export const CMSSectionRenderer: React.FC<CMSSectionRendererProps> = ({
  section,
  products,
  categories,
  currency,
  setActivePage,
  onSelectCategory,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  wishlistIds = [],
  onQuickView,
  onOpenAuthenticityModal,
  slides,
  isBuilderMode = false,
  selectedSectionId,
  selectedWidgetId,
  onSelectSection,
  onSelectWidget,
  onUpdateWidgetContent,
  onDuplicateWidget,
  onDeleteWidget,
  onMoveWidget,
  onCopyWidget,
  onCopyWidgetStyle,
  onPasteWidgetStyle,
  onMoveSection,
  onDuplicateSection,
  onDeleteSection,
  onCopySection,
  onCopySectionStyle,
  onPasteSectionStyle,
  onSaveSectionAsTemplate,
  onToggleSectionVisibility,
  hasCopiedWidgetStyle = false,
  hasCopiedSectionStyle = false,
  canMoveUp = false,
  canMoveDown = false,
  deviceMode = 'desktop'
}) => {
  // Inline editing state for builder
  const [editingWidgetId, setEditingWidgetId] = useState<string | null>(null);
  const [inlineDraftText, setInlineDraftText] = useState<string>('');
  const [rfqSubmitted, setRfqSubmitted] = useState<boolean>(false);
  const [rfqFormData, setRfqFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    requirements: ''
  });

  // Screen size detection for live storefront view (when not manually selected via builder deviceMode)
  const [windowWidth, setWindowWidth] = useState<number>(() => typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    if (isBuilderMode) return;
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isBuilderMode]);

  const effectiveDeviceMode: DeviceMode = isBuilderMode 
    ? deviceMode 
    : (windowWidth < 640 ? 'mobile' : windowWidth < 1024 ? 'tablet' : 'desktop');

  if (!section.enabled && !isBuilderMode) {
    return null;
  }

  const isSectionSelected = isBuilderMode && selectedSectionId === section.id;

  // Detect whether this section represents an image or hero banner
  const isImageBannerSection = section.widgets.length === 1 && (
    section.widgets[0].type === 'image' || 
    section.widgets[0].type === 'banner_slider' || 
    section.widgets[0].type === 'hero_banner' ||
    section.widgets[0].type === 'image_slider'
  );

  // Responsive hide classes for section
  const sectionHideClasses = [
    section.settings.hideDesktop ? 'lg:hidden' : '',
    section.settings.hideTablet ? 'md:max-lg:hidden' : '',
    section.settings.hideMobile ? 'max-md:hidden' : ''
  ].filter(Boolean).join(' ');

  // Compute responsive padding for section
  const getResponsiveSectionPadding = () => {
    let pt = section.settings.paddingTop ?? 32;
    let pb = section.settings.paddingBottom ?? 32;
    let pl = section.settings.paddingLeft;
    let pr = section.settings.paddingRight;

    if (effectiveDeviceMode === 'tablet') {
      if (section.settings.tabletPaddingTop !== undefined) pt = section.settings.tabletPaddingTop;
      else if (section.settings.paddingTopTablet !== undefined) pt = section.settings.paddingTopTablet;

      if (section.settings.tabletPaddingBottom !== undefined) pb = section.settings.tabletPaddingBottom;
      else if (section.settings.paddingBottomTablet !== undefined) pb = section.settings.paddingBottomTablet;

      if (section.settings.tabletPaddingLeft !== undefined) pl = section.settings.tabletPaddingLeft;
      if (section.settings.tabletPaddingRight !== undefined) pr = section.settings.tabletPaddingRight;
    } else if (effectiveDeviceMode === 'mobile') {
      if (section.settings.mobilePaddingTop !== undefined) pt = section.settings.mobilePaddingTop;
      else if (section.settings.paddingTopMobile !== undefined) pt = section.settings.paddingTopMobile;
      else if (isImageBannerSection) pt = Math.min(pt, 12);

      if (section.settings.mobilePaddingBottom !== undefined) pb = section.settings.mobilePaddingBottom;
      else if (section.settings.paddingBottomMobile !== undefined) pb = section.settings.paddingBottomMobile;
      else if (isImageBannerSection) pb = 0; // Avoid artificial empty gap beneath banners on mobile

      if (section.settings.mobilePaddingLeft !== undefined) pl = section.settings.mobilePaddingLeft;
      if (section.settings.mobilePaddingRight !== undefined) pr = section.settings.mobilePaddingRight;
    }
    return { pt, pb, pl, pr };
  };

  const { pt: sectionPt, pb: sectionPb, pl: sectionPl, pr: sectionPr } = getResponsiveSectionPadding();

  // Compute background styling
  const isSectionBoxed = section.settings.layout === 'boxed';
  const widthMode = section.settings.contentWidthMode || (isSectionBoxed ? 'boxed' : 'full-width');

  let computedSectionShadow = section.settings.boxShadow;
  if (!computedSectionShadow) {
    if (section.settings.shadowPreset === 'sm') computedSectionShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
    else if (section.settings.shadowPreset === 'md') computedSectionShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)';
    else if (section.settings.shadowPreset === 'lg') computedSectionShadow = '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)';
    else if (section.settings.shadowPreset === 'xl') computedSectionShadow = '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)';
    else if (section.settings.shadowPreset === '2xl') computedSectionShadow = '0 25px 50px -12px rgb(0 0 0 / 0.25)';
    else if (section.settings.shadowPreset === 'custom' || (section.settings.shadowBlur !== undefined || section.settings.shadowX !== undefined || section.settings.shadowY !== undefined)) {
      const sx = section.settings.shadowX ?? 0;
      const sy = section.settings.shadowY ?? 4;
      const sb = section.settings.shadowBlur ?? 12;
      const ss = section.settings.shadowSpread ?? 0;
      const sc = section.settings.shadowColor || 'rgba(0,0,0,0.15)';
      computedSectionShadow = `${sx}px ${sy}px ${sb}px ${ss}px ${sc}`;
    }
  }

  const hasSectionCornerRadius =
    section.settings.borderTopLeftRadius !== undefined ||
    section.settings.borderTopRightRadius !== undefined ||
    section.settings.borderBottomRightRadius !== undefined ||
    section.settings.borderBottomLeftRadius !== undefined;

  const computedSectionRadius = hasSectionCornerRadius
    ? `${section.settings.borderTopLeftRadius ?? 0}px ${section.settings.borderTopRightRadius ?? 0}px ${section.settings.borderBottomRightRadius ?? 0}px ${section.settings.borderBottomLeftRadius ?? 0}px`
    : section.settings.borderRadius !== undefined
      ? `${section.settings.borderRadius}px`
      : undefined;

  const sectionBgStyle: React.CSSProperties = {
    backgroundColor: section.settings.bgColor || undefined,
    backgroundImage: section.settings.bgGradient 
      ? section.settings.bgGradient 
      : section.settings.bgImage 
        ? `url(${section.settings.bgImage})` 
        : undefined,
    backgroundPosition: section.settings.bgPosition || 'center',
    backgroundSize: section.settings.bgSize || 'cover',
    backgroundRepeat: section.settings.bgRepeat || 'no-repeat',
    color: section.settings.textColor || undefined,
    paddingTop: `${sectionPt}px`,
    paddingBottom: `${sectionPb}px`,
    marginTop: section.settings.marginTop ? `${section.settings.marginTop}px` : undefined,
    marginBottom: section.settings.marginBottom ? `${section.settings.marginBottom}px` : undefined,
    minHeight: effectiveDeviceMode === 'mobile'
      ? (section.settings.mobileMinHeight || undefined)
      : (section.settings.minHeight || undefined),
    height: effectiveDeviceMode === 'mobile'
      ? (section.settings.mobileHeight || undefined)
      : (section.settings.height || undefined),
    width: '100%',
    maxWidth: '100%',
    borderRadius: computedSectionRadius,
    borderWidth: section.settings.borderWidth ? `${section.settings.borderWidth}px` : undefined,
    borderTopWidth: section.settings.borderTopWidth ? `${section.settings.borderTopWidth}px` : undefined,
    borderRightWidth: section.settings.borderRightWidth ? `${section.settings.borderRightWidth}px` : undefined,
    borderBottomWidth: section.settings.borderBottomWidth ? `${section.settings.borderBottomWidth}px` : undefined,
    borderLeftWidth: section.settings.borderLeftWidth ? `${section.settings.borderLeftWidth}px` : undefined,
    borderColor: section.settings.borderColor || undefined,
    borderStyle: section.settings.borderStyle || 'solid',
    boxShadow: computedSectionShadow,
    overflow: section.settings.overflow || undefined,
    opacity: section.settings.opacity !== undefined ? section.settings.opacity : undefined,
    zIndex: section.settings.zIndex || undefined,
    position: (section.settings.position as any) || 'relative'
  };

  // Section column preset classes for widget layout inside the section
  const getSectionLayoutClass = () => {
    switch (section.settings.columnsPreset) {
      case '2-col-equal':
        return 'grid grid-cols-1 md:grid-cols-2 gap-6 items-center';
      case '3-col-equal':
        return 'grid grid-cols-1 md:grid-cols-3 gap-6';
      case '4-col-equal':
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4';
      case '30-70':
        return 'grid grid-cols-1 md:grid-cols-12 gap-6 [&>*:first-child]:md:col-span-4 [&>*:nth-child(2)]:md:col-span-8 items-center';
      case '70-30':
        return 'grid grid-cols-1 md:grid-cols-12 gap-6 [&>*:first-child]:md:col-span-8 [&>*:nth-child(2)]:md:col-span-4 items-center';
      case '40-60':
        return 'grid grid-cols-1 md:grid-cols-12 gap-6 [&>*:first-child]:md:col-span-5 [&>*:nth-child(2)]:md:col-span-7 items-center';
      case '60-40':
        return 'grid grid-cols-1 md:grid-cols-12 gap-6 [&>*:first-child]:md:col-span-7 [&>*:nth-child(2)]:md:col-span-5 items-center';
      case '25-75':
        return 'grid grid-cols-1 md:grid-cols-12 gap-6 [&>*:first-child]:md:col-span-3 [&>*:nth-child(2)]:md:col-span-9 items-center';
      case '75-25':
        return 'grid grid-cols-1 md:grid-cols-12 gap-6 [&>*:first-child]:md:col-span-9 [&>*:nth-child(2)]:md:col-span-3 items-center';
      case '33-67':
        return 'grid grid-cols-1 md:grid-cols-12 gap-6 [&>*:first-child]:md:col-span-4 [&>*:nth-child(2)]:md:col-span-8 items-center';
      case '67-33':
        return 'grid grid-cols-1 md:grid-cols-12 gap-6 [&>*:first-child]:md:col-span-8 [&>*:nth-child(2)]:md:col-span-4 items-center';
      default:
        return 'space-y-4';
    }
  };

  const handleInlineSave = (widgetId: string) => {
    if (onUpdateWidgetContent) {
      onUpdateWidgetContent(widgetId, { text: inlineDraftText });
    }
    setEditingWidgetId(null);
  };

  const handleRfqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rfqFormData.companyName || !rfqFormData.email) return;

    try {
      const existingRaw = localStorage.getItem('ofixbaze_rfqs');
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      const newRfq = {
        id: `rfq-${Date.now()}`,
        companyName: rfqFormData.companyName,
        contactPerson: rfqFormData.companyName,
        email: rfqFormData.email,
        phone: rfqFormData.phone || 'N/A',
        deliveryLocation: 'Lagos Corporate Center',
        items: rfqFormData.requirements,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      };
      localStorage.setItem('ofixbaze_rfqs', JSON.stringify([newRfq, ...existing]));
    } catch (err) {
      console.error(err);
    }

    setRfqSubmitted(true);
    setTimeout(() => {
      setRfqSubmitted(false);
      setRfqFormData({ companyName: '', email: '', phone: '', requirements: '' });
    }, 4000);
  };

  // Render individual widget
  const renderWidget = (widget: CMSWidget) => {
    const isWidgetSelected = isBuilderMode && selectedWidgetId === widget.id;
    const isInlineEditing = isBuilderMode && editingWidgetId === widget.id;

    // Responsive hide classes for widget
    const widgetHideClasses = [
      widget.settings.hideDesktop ? 'lg:hidden' : '',
      widget.settings.hideTablet ? 'md:max-lg:hidden' : '',
      widget.settings.hideMobile ? 'max-md:hidden' : ''
    ].filter(Boolean).join(' ');

    const isFullWidthWidget = (widget.type === 'image' && 
      (widget.settings.imageWidthMode === 'full-width' || widget.settings.imageWidthMode === 'full-bleed' || widget.settings.imageAlignment === 'stretch')) ||
      widget.type === 'banner_slider' || widget.type === 'hero_slider' || widget.type === 'image_slider';

    // Compute widget shadow
    let computedWidgetShadow = widget.settings.boxShadow;
    if (!computedWidgetShadow) {
      if (widget.settings.shadowPreset === 'sm') computedWidgetShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
      else if (widget.settings.shadowPreset === 'md') computedWidgetShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)';
      else if (widget.settings.shadowPreset === 'lg') computedWidgetShadow = '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)';
      else if (widget.settings.shadowPreset === 'xl') computedWidgetShadow = '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)';
      else if (widget.settings.shadowPreset === '2xl') computedWidgetShadow = '0 25px 50px -12px rgb(0 0 0 / 0.25)';
      else if (widget.settings.shadowPreset === 'custom' || (widget.settings.shadowBlur !== undefined || widget.settings.shadowX !== undefined || widget.settings.shadowY !== undefined)) {
        const sx = widget.settings.shadowX ?? 0;
        const sy = widget.settings.shadowY ?? 4;
        const sb = widget.settings.shadowBlur ?? 12;
        const ss = widget.settings.shadowSpread ?? 0;
        const sc = widget.settings.shadowColor || 'rgba(0,0,0,0.15)';
        computedWidgetShadow = `${sx}px ${sy}px ${sb}px ${ss}px ${sc}`;
      }
    }

    const hasWidgetCornerRadius = 
      widget.settings.borderTopLeftRadius !== undefined ||
      widget.settings.borderTopRightRadius !== undefined ||
      widget.settings.borderBottomRightRadius !== undefined ||
      widget.settings.borderBottomLeftRadius !== undefined;

    const computedWidgetRadius = hasWidgetCornerRadius
      ? `${widget.settings.borderTopLeftRadius ?? 0}px ${widget.settings.borderTopRightRadius ?? 0}px ${widget.settings.borderBottomRightRadius ?? 0}px ${widget.settings.borderBottomLeftRadius ?? 0}px`
      : widget.settings.borderRadius !== undefined 
        ? `${widget.settings.borderRadius}px` 
        : undefined;

    const isImageOrBanner = widget.type === 'image' || widget.type === 'banner_slider' || widget.type === 'hero_slider' || widget.type === 'image_slider';

    // Avoid legacy desktop 400px min-height creating blank space on mobile view
    const computedWidgetMinHeight = effectiveDeviceMode === 'mobile'
      ? (widget.settings.mobileMinHeight || widget.settings.minHeightMobile || undefined)
      : (isImageOrBanner && widget.settings.imageHeightMode !== 'custom' ? undefined : (widget.settings.minHeight || undefined));

    const computedWidgetHeight = effectiveDeviceMode === 'mobile'
      ? (widget.settings.mobileHeight || widget.settings.heightMobile || undefined)
      : (widget.settings.height || undefined);

    const widgetStyle: React.CSSProperties = {
      color: widget.settings.textColor || undefined,
      backgroundColor: widget.settings.bgColor || undefined,
      paddingTop: widget.settings.paddingTop !== undefined ? `${widget.settings.paddingTop}px` : undefined,
      paddingBottom: widget.settings.paddingBottom !== undefined ? `${widget.settings.paddingBottom}px` : undefined,
      paddingLeft: ((widget.type === 'image' && widget.settings.imageWidthMode === 'full-bleed') || widget.type === 'banner_slider' || widget.type === 'hero_slider') 
        ? 0 
        : (widget.settings.paddingLeft !== undefined ? `${widget.settings.paddingLeft}px` : undefined),
      paddingRight: ((widget.type === 'image' && widget.settings.imageWidthMode === 'full-bleed') || widget.type === 'banner_slider' || widget.type === 'hero_slider') 
        ? 0 
        : (widget.settings.paddingRight !== undefined ? `${widget.settings.paddingRight}px` : undefined),
      marginTop: widget.settings.marginTop !== undefined ? `${widget.settings.marginTop}px` : undefined,
      marginBottom: widget.settings.marginBottom !== undefined ? `${widget.settings.marginBottom}px` : undefined,
      marginLeft: widget.settings.marginLeft !== undefined ? `${widget.settings.marginLeft}px` : undefined,
      marginRight: widget.settings.marginRight !== undefined ? `${widget.settings.marginRight}px` : undefined,
      borderRadius: computedWidgetRadius,
      borderWidth: widget.settings.borderWidth !== undefined ? `${widget.settings.borderWidth}px` : undefined,
      borderTopWidth: widget.settings.borderTopWidth !== undefined ? `${widget.settings.borderTopWidth}px` : undefined,
      borderRightWidth: widget.settings.borderRightWidth !== undefined ? `${widget.settings.borderRightWidth}px` : undefined,
      borderBottomWidth: widget.settings.borderBottomWidth !== undefined ? `${widget.settings.borderBottomWidth}px` : undefined,
      borderLeftWidth: widget.settings.borderLeftWidth !== undefined ? `${widget.settings.borderLeftWidth}px` : undefined,
      borderColor: widget.settings.borderColor || undefined,
      borderStyle: widget.settings.borderStyle || 'solid',
      boxShadow: computedWidgetShadow,
      textAlign: widget.settings.textAlign || 'left',
      fontFamily: widget.settings.fontFamily || undefined,
      opacity: widget.settings.opacity !== undefined ? widget.settings.opacity : undefined,
      width: widget.settings.width || (isFullWidthWidget ? '100%' : undefined),
      maxWidth: widget.settings.maxWidth || undefined,
      minHeight: computedWidgetMinHeight,
      height: computedWidgetHeight,
      zIndex: widget.settings.zIndex || undefined,
      position: (widget.settings.position as any) || 'relative'
    };

    const hoverEffects = [
      widget.settings.hoverLift ? 'hover:-translate-y-1 hover:shadow-xl transition-all duration-200' : '',
      widget.settings.hoverZoom ? 'hover:scale-[1.02] transition-transform duration-200' : ''
    ].filter(Boolean).join(' ');

    return (
      <div
        key={widget.id}
        id={widget.settings.elementId || undefined}
        onClick={(e) => {
          if (isBuilderMode && onSelectWidget) {
            e.stopPropagation();
            onSelectSection?.(section.id);
            onSelectWidget(section.id, widget.id);
          }
        }}
        onDoubleClick={(e) => {
          if (isBuilderMode && (widget.type === 'heading' || widget.type === 'text' || widget.type === 'button')) {
            e.stopPropagation();
            setEditingWidgetId(widget.id);
            setInlineDraftText(widget.content.text || widget.content.buttonText || '');
          }
        }}
        style={widgetStyle}
        className={`relative transition-all duration-150 ${isImageOrBanner ? 'max-md:!min-h-0 max-md:!h-auto' : ''} ${widgetHideClasses} ${hoverEffects} ${widget.settings.cssClasses || ''} ${
          isWidgetSelected
            ? 'outline outline-2 outline-blue-500 rounded bg-blue-500/5'
            : isBuilderMode
            ? 'hover:outline hover:outline-1 hover:outline-blue-300/80 rounded'
            : ''
        } ${isFullWidthWidget ? 'w-full' : ''}`}
      >
        {/* Builder Widget Floating Toolbar */}
        {isWidgetSelected && (
          <div className="absolute -top-8 left-2 bg-[#1e293b] text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-xl flex items-center gap-1 z-40 select-none border border-slate-700/80 animate-in fade-in">
            <span className="capitalize text-blue-400 font-extrabold">{widget.type.replace('_', ' ')}</span>
            <span className="text-slate-400 text-[9px]">#{widget.id.slice(-4)}</span>
            <div className="h-3 w-px bg-slate-700 mx-0.5" />

            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveWidget?.(section.id, widget.id, 'up');
              }}
              title="Move Up"
              className="hover:bg-slate-700 p-1 rounded cursor-pointer text-slate-300 hover:text-white"
            >
              <ArrowUp className="w-3 h-3" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveWidget?.(section.id, widget.id, 'down');
              }}
              title="Move Down"
              className="hover:bg-slate-700 p-1 rounded cursor-pointer text-slate-300 hover:text-white"
            >
              <ArrowDown className="w-3 h-3" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicateWidget?.(section.id, widget);
              }}
              title="Duplicate Element (Ctrl+D)"
              className="hover:bg-slate-700 p-1 rounded cursor-pointer text-slate-300 hover:text-white"
            >
              <Copy className="w-3 h-3" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onCopyWidget?.(widget);
              }}
              title="Copy Widget (Ctrl+C)"
              className="hover:bg-slate-700 p-1 rounded cursor-pointer text-slate-300 hover:text-white"
            >
              <CopyCheck className="w-3 h-3" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onCopyWidgetStyle?.(widget.settings);
              }}
              title="Copy Style"
              className="hover:bg-slate-700 p-1 rounded cursor-pointer text-amber-400 hover:text-amber-300"
            >
              <Paintbrush className="w-3 h-3" />
            </button>

            {hasCopiedWidgetStyle && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPasteWidgetStyle?.(section.id, widget.id);
                }}
                title="Paste Style"
                className="hover:bg-slate-700 p-1 rounded cursor-pointer text-emerald-400 hover:text-emerald-300"
              >
                <ClipboardCheck className="w-3 h-3" />
              </button>
            )}

            <div className="h-3 w-px bg-slate-700 mx-0.5" />

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteWidget?.(section.id, widget.id);
              }}
              title="Delete Element (Del / Backspace)"
              className="hover:bg-rose-600 p-1 rounded cursor-pointer text-rose-300 hover:text-white"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* ----------------------------------------------------
            WIDGET CONTENT TYPES
        ---------------------------------------------------- */}

        {/* 1. HEADING */}
        {widget.type === 'heading' && (
          <div className={
            widget.settings.textAlign === 'center' ? 'text-center' :
            widget.settings.textAlign === 'right' ? 'text-right' :
            widget.settings.textAlign === 'justify' ? 'text-justify' : 'text-left'
          }>
            {widget.content.badge && (
              <span className="inline-block text-[11px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200 mb-2">
                {widget.content.badge}
              </span>
            )}
            {isInlineEditing ? (
              <div className="flex items-center gap-2 my-1">
                <input
                  type="text"
                  autoFocus
                  value={inlineDraftText}
                  onChange={(e) => setInlineDraftText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleInlineSave(widget.id);
                    if (e.key === 'Escape') setEditingWidgetId(null);
                  }}
                  className="w-full px-3 py-1.5 bg-white border-2 border-blue-500 rounded text-slate-900 font-bold focus:outline-none text-lg shadow-lg"
                />
                <button
                  onClick={() => handleInlineSave(widget.id)}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded font-bold text-xs cursor-pointer"
                >
                  Save
                </button>
              </div>
            ) : (
              widget.content.text ? (
                <h2
                  style={{
                    fontSize: widget.settings.fontSize || '28px',
                    fontWeight: widget.settings.fontWeight || '800',
                    lineHeight: widget.settings.lineHeight || '1.2',
                    letterSpacing: widget.settings.letterSpacing || 'normal',
                    textTransform: widget.settings.textTransform || 'none'
                  }}
                  className="font-black text-slate-900 tracking-tight"
                >
                  {widget.content.text}
                </h2>
              ) : isBuilderMode && !widget.content.badge && !widget.content.subtext ? (
                <div className="py-2.5 px-3 border border-dashed border-slate-300 text-slate-400 text-xs rounded-lg text-center bg-slate-50/50">
                  (Empty Heading - Click or use Inspector to add text)
                </div>
              ) : null
            )}
            {widget.content.subtext && (
              <p className={`text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed ${
                widget.settings.textAlign === 'center' ? 'mx-auto text-center' :
                widget.settings.textAlign === 'right' ? 'ml-auto text-right' :
                widget.settings.textAlign === 'justify' ? 'text-justify' : 'text-left'
              }`}>
                {widget.content.subtext}
              </p>
            )}
          </div>
        )}

        {/* 2. TEXT / RICH TEXT */}
        {(widget.type === 'text' || widget.type === 'rich_text') && (
          <div
            style={{
              fontSize: widget.settings.fontSize || '15px',
              lineHeight: widget.settings.lineHeight || '1.6',
              fontWeight: widget.settings.fontWeight || 'normal',
              color: widget.settings.textColor || '#475569',
              textAlign: widget.settings.textAlign || 'left'
            }}
            className="leading-relaxed"
          >
            {widget.content.text ? (
              widget.content.text
            ) : isBuilderMode ? (
              <div className="py-2 px-3 border border-dashed border-slate-300 text-slate-400 text-xs rounded text-center bg-slate-50/50">
                (Empty Text Block - Add content in Inspector)
              </div>
            ) : null}
          </div>
        )}

        {/* 3. BUTTON */}
        {widget.type === 'button' && (
          <div className={`py-1 ${widget.settings.textAlign === 'center' ? 'text-center' : widget.settings.textAlign === 'right' ? 'text-right' : 'text-left'}`}>
            <button
              onClick={() => {
                if (!isBuilderMode) {
                  const url = widget.content.buttonUrl || '';
                  if (url.includes('rfq')) setActivePage('rfq');
                  else if (url.includes('shop')) setActivePage('shop');
                  else if (url.includes('about')) setActivePage('about');
                  else if (url.includes('contact')) setActivePage('contact');
                  else if (url.startsWith('http')) {
                    if (widget.settings.openInNewTab) window.open(url, '_blank');
                    else window.location.href = url;
                  } else if (url.startsWith('/')) {
                    const slug = url.replace('/', '') as ActivePage;
                    setActivePage(slug || 'home');
                  }
                }
              }}
              style={{
                backgroundColor: widget.settings.bgColor || '#ea580c',
                color: widget.settings.textColor || '#ffffff',
                paddingTop: widget.settings.paddingTop !== undefined ? `${widget.settings.paddingTop}px` : '12px',
                paddingBottom: widget.settings.paddingBottom !== undefined ? `${widget.settings.paddingBottom}px` : '12px',
                paddingLeft: widget.settings.paddingLeft !== undefined ? `${widget.settings.paddingLeft}px` : '24px',
                paddingRight: widget.settings.paddingRight !== undefined ? `${widget.settings.paddingRight}px` : '24px',
                borderRadius: widget.settings.borderRadius !== undefined ? `${widget.settings.borderRadius}px` : '8px',
                fontSize: widget.settings.fontSize || '13px',
                fontWeight: widget.settings.fontWeight || '700',
                letterSpacing: '0.025em'
              }}
              className="inline-flex items-center gap-2 hover:opacity-90 shadow-md cursor-pointer transition-all active:scale-98"
            >
              <span>{widget.content.buttonText || 'Take Action'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 4. IMAGE */}
        {widget.type === 'image' && (() => {
          const widthMode = widget.settings.imageWidthMode || 'default';
          const heightMode = widget.settings.imageHeightMode || 'auto';
          const alignment = widget.settings.imageAlignment || 'center';
          const isFullBleed = widthMode === 'full-bleed' || widget.settings.imageWidthMode === 'full-bleed';
          const isFullWidth = widthMode === 'full-width' || isFullBleed || widget.settings.imageWidthMode === 'full-width' || alignment === 'stretch';

          // Responsive sizing based on effectiveDeviceMode
          let effWidth = (effectiveDeviceMode === 'desktop' && widget.settings.imageWidthDesktop)
            ? widget.settings.imageWidthDesktop
            : (widget.settings.imageWidth || '100%');
          let effHeight = (effectiveDeviceMode === 'desktop' && widget.settings.imageHeightDesktop)
            ? widget.settings.imageHeightDesktop
            : (heightMode === 'custom' ? (widget.settings.imageHeight || '400px') : 'auto');
          let effMaxWidth = isFullWidth ? 'none' : (widget.settings.imageMaxWidth || '100%');

          if (effectiveDeviceMode === 'tablet') {
            if (widget.settings.imageWidthTablet) effWidth = widget.settings.imageWidthTablet;
            else if (widget.settings.tabletImageWidth) effWidth = widget.settings.tabletImageWidth;

            if (widget.settings.imageHeightTablet && heightMode === 'custom') effHeight = widget.settings.imageHeightTablet;
            else if (widget.settings.tabletImageHeight && heightMode === 'custom') effHeight = widget.settings.tabletImageHeight;

            if (widget.settings.tabletImageMaxWidth) effMaxWidth = widget.settings.tabletImageMaxWidth;
          } else if (effectiveDeviceMode === 'mobile') {
            if (widget.settings.imageWidthMobile) effWidth = widget.settings.imageWidthMobile;
            else if (widget.settings.mobileImageWidth) effWidth = widget.settings.mobileImageWidth;
            else effWidth = '100%';

            if (widget.settings.imageHeightMobile) effHeight = widget.settings.imageHeightMobile;
            else if (widget.settings.mobileImageHeight) effHeight = widget.settings.mobileImageHeight;
            else effHeight = 'auto'; // Seamless auto aspect ratio on mobile avoids blank vertical whitespace

            if (widget.settings.mobileImageMaxWidth) effMaxWidth = widget.settings.mobileImageMaxWidth;
          }

          // Alignment container classes
          const alignClass = alignment === 'center' 
            ? 'flex justify-center' 
            : alignment === 'right' 
              ? 'flex justify-end' 
              : alignment === 'stretch' 
                ? 'w-full' 
                : 'flex justify-start';

          // Border radius computation
          const hasIndividualRadius = 
            widget.settings.imageBorderRadiusTopLeft !== undefined ||
            widget.settings.imageBorderRadiusTopRight !== undefined ||
            widget.settings.imageBorderRadiusBottomRight !== undefined ||
            widget.settings.imageBorderRadiusBottomLeft !== undefined;
          
          const computedBorderRadius = hasIndividualRadius
            ? `${widget.settings.imageBorderRadiusTopLeft ?? 0}px ${widget.settings.imageBorderRadiusTopRight ?? 0}px ${widget.settings.imageBorderRadiusBottomRight ?? 0}px ${widget.settings.imageBorderRadiusBottomLeft ?? 0}px`
            : widget.settings.imageBorderRadius !== undefined 
              ? `${widget.settings.imageBorderRadius}px` 
              : widget.settings.borderRadius !== undefined 
                ? `${widget.settings.borderRadius}px` 
                : isFullBleed ? '0px' : '12px';

          // Shadow class
          const shadowClass = widget.settings.imageShadowPreset === 'none' 
            ? '' 
            : widget.settings.imageShadowPreset === 'sm' 
              ? 'shadow-sm' 
              : widget.settings.imageShadowPreset === 'md' 
                ? 'shadow-md' 
                : widget.settings.imageShadowPreset === 'lg' 
                  ? 'shadow-lg' 
                  : widget.settings.imageShadowPreset === 'xl' 
                    ? 'shadow-xl' 
                    : widget.settings.imageShadowPreset === '2xl' 
                      ? 'shadow-2xl' 
                      : isFullBleed ? '' : 'shadow-md';

          // Object position
          const objectPosition = widget.settings.imageObjectPosition === 'custom'
            ? (widget.settings.imageObjectPositionCustom || 'center')
            : (widget.settings.imageObjectPosition || 'center');

          // Object fit
          const objectFit = widget.settings.imageObjectFit || widget.settings.objectFit || 'cover';

          // Full bleed container breakout classes
          const fullBleedClass = (isFullBleed && section.settings.contentWidthMode !== 'full-width')
            ? (sectionPl === undefined && sectionPr === undefined
                ? '-mx-4 sm:-mx-6 lg:-mx-8 w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] lg:w-[calc(100%+4rem)] max-w-none'
                : 'max-w-none')
            : isFullBleed ? 'w-full max-w-none' : '';

          const fullBleedStyle: React.CSSProperties = (isFullBleed && section.settings.contentWidthMode !== 'full-width' && (sectionPl !== undefined || sectionPr !== undefined))
            ? {
                marginLeft: sectionPl !== undefined ? `-${sectionPl}px` : undefined,
                marginRight: sectionPr !== undefined ? `-${sectionPr}px` : undefined,
                width: (sectionPl !== undefined && sectionPr !== undefined) 
                  ? `calc(100% + ${sectionPl + sectionPr}px)` 
                  : undefined,
                maxWidth: 'none'
              }
            : {};

          const imgElement = (
            <img
              src={widget.content.imageUrl || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&auto=format&fit=crop&q=85'}
              alt={widget.content.altText || widget.title || 'Ofixbaze Showcase'}
              title={widget.content.imageTitle || undefined}
              style={{
                width: alignment === 'stretch' || isFullWidth ? '100%' : effWidth,
                maxWidth: effMaxWidth,
                minWidth: widget.settings.imageMinWidth || undefined,
                height: effHeight,
                maxHeight: widget.settings.imageMaxHeight || undefined,
                minHeight: effectiveDeviceMode === 'mobile' 
                  ? (widget.settings.mobileImageMinHeight || widget.settings.mobileMinHeight || undefined) 
                  : (widget.settings.imageMinHeight || undefined),
                objectFit: heightMode === 'custom' ? objectFit : undefined,
                objectPosition: heightMode === 'custom' ? objectPosition : undefined,
                borderRadius: computedBorderRadius,
                borderWidth: widget.settings.imageBorderWidth !== undefined ? `${widget.settings.imageBorderWidth}px` : undefined,
                borderStyle: widget.settings.imageBorderStyle || 'none',
                borderColor: widget.settings.imageBorderColor || undefined,
                opacity: widget.settings.imageOpacity !== undefined ? widget.settings.imageOpacity : 1,
                display: 'block'
              }}
              className={`transition-all duration-300 max-md:!min-h-0 max-md:h-auto ${shadowClass} ${
                (widget.settings.imageHoverScale || widget.settings.hoverScaleEffect) ? 'hover:scale-[1.02]' : ''
              } ${(widget.settings.imageHoverOpacity !== undefined || widget.settings.hoverOpacityEffect) ? 'hover:opacity-90' : ''}`}
            />
          );

          const linkedElement = (widget.content.imageLink || widget.settings.imageLinkUrl) ? (
            <a
              href={!isBuilderMode ? (widget.content.imageLink || widget.settings.imageLinkUrl) : undefined}
              target={widget.content.openInNewTab || widget.settings.imageLinkTarget === '_blank' ? '_blank' : '_self'}
              rel="noreferrer"
              className="inline-block w-full cursor-pointer max-md:!min-h-0"
              onClick={(e) => {
                if (isBuilderMode) e.preventDefault();
              }}
            >
              {imgElement}
            </a>
          ) : imgElement;

          return (
            <div 
              style={fullBleedStyle}
              className={`${isFullBleed ? 'py-0' : 'py-0 sm:py-1'} ${alignClass} ${fullBleedClass} overflow-hidden max-md:!min-h-0`}
            >
              {linkedElement}
            </div>
          );
        })()}

        {/* 5. HERO BANNER - ENTERPRISE 2-COLUMN LAYOUT */}
        {widget.type === 'hero_banner' && (
          <div
            style={{
              backgroundColor: widget.settings.bgColor || '#0b1120',
              borderRadius: widget.settings.borderRadius !== undefined ? `${widget.settings.borderRadius}px` : '20px'
            }}
            className="relative overflow-hidden p-6 sm:p-10 lg:p-12 text-white shadow-2xl border border-slate-800/80 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
          >
            {/* Subtle background glow effect */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* LEFT COLUMN: Enterprise Typography & Direct CTAs */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-5">
                {/* Eyebrow */}
                <div className="inline-flex items-center gap-2 bg-orange-500/15 text-orange-400 border border-orange-500/30 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                  <span>{widget.content.badge || "NIGERIA'S TRUSTED CORPORATE PROCUREMENT PARTNER"}</span>
                </div>

                {/* Large Headline */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight uppercase">
                  {widget.content.text || 'PREMIUM OFFICE EQUIPMENT. BUILT FOR BUSINESS.'}
                </h1>

                {/* Supporting Text */}
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-xl">
                  {widget.content.subtext || 'Supply your workplace with genuine OEM toners, executive furniture, printers, and document machines with official warranty and fast Lagos delivery.'}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <button
                    onClick={() => !isBuilderMode && setActivePage('rfq')}
                    className="px-6 py-3.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-950/40 flex items-center gap-2.5 cursor-pointer transition transform hover:-translate-y-0.5 active:scale-95"
                  >
                    <FileText className="w-4 h-4 text-orange-200" />
                    <span>{widget.content.buttonText || 'REQUEST CORPORATE QUOTE'}</span>
                    <ArrowRight className="w-4 h-4 text-orange-200" />
                  </button>

                  <button
                    onClick={() => {
                      if (!isBuilderMode) {
                        onSelectCategory('all');
                        setActivePage('shop');
                      }
                    }}
                    className="px-5 py-3.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white border border-slate-700 rounded-xl font-bold text-xs uppercase tracking-wider backdrop-blur-sm cursor-pointer transition"
                  >
                    <span>{widget.content.secondaryBtnText || 'EXPLORE CATALOGUE'}</span>
                  </button>
                </div>

                {/* Value Propositions Underneath CTAs */}
                <div className="pt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-semibold text-slate-400">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>100% Genuine OEM Guarantee</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-blue-400">
                    <Truck className="w-3.5 h-3.5 text-blue-400" />
                    <span>Same-Day Lagos Delivery</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <Building className="w-3.5 h-3.5 text-amber-400" />
                    <span>Corporate Tender &amp; RFQ</span>
                  </span>
                </div>
              </div>

              {/* RIGHT COLUMN: High Quality Office Furniture / Product Imagery */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-800/40 aspect-4/3 sm:aspect-16/11 group">
                  <img
                    src={widget.content.imageUrl || '/public/executive-tables-banner.jpg'}
                    alt="Ofixbaze Executive Office Suite"
                    className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&auto=format&fit=crop&q=85';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Floating Authenticity Badge */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 p-3 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/70 shadow-lg flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs">
                        OEM
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white leading-tight">Executive Procurement Ready</div>
                        <div className="text-[10px] text-slate-400">BIFMA Certified Furniture &amp; Genuine HP Toners</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wide bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                      In Stock
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5B. BANNER SLIDER / HERO SLIDER */}
        {(widget.type === 'banner_slider' || widget.type === 'hero_slider') && (() => {
          const isCustomSource = widget.settings?.sliderSource === 'custom' && Boolean(widget.content?.items && widget.content.items.length > 0);

          const effectiveSlides: SlideConfig[] = isCustomSource
            ? (widget.content.items || []).map((item, idx) => ({
                id: item.id || `custom-slide-${idx}`,
                enabled: true,
                highlightTitle: item.badge || 'PREMIUM',
                mainTitle: item.title || 'EXECUTIVE OFFICE SUITE',
                subtitle: item.description || '',
                tagline: item.subtext || '',
                primaryBtnText: item.buttonText || 'REQUEST CORPORATE QUOTE',
                secondaryBtnText: item.secondaryBtnText || 'EXPLORE CATALOGUE',
                deliveryText: item.deliveryText || 'Same-Day Lagos White-Glove Assembled Delivery Available',
                image: item.image || item.imageUrl || '/executive-tables-banner.jpg'
              }))
            : (slides && slides.length > 0 ? slides : INITIAL_SLIDES_CONFIG);

          return (
            <div className="w-full relative group/slider-widget">
              <HeroSlider
                setActivePage={setActivePage}
                onSelectCategory={onSelectCategory || (() => {})}
                onOpenAuthenticityModal={onOpenAuthenticityModal || (() => {})}
                customSlides={effectiveSlides}
              />
              {isBuilderMode && (
                <div className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-orange-500/40 text-[11px] text-orange-300 font-bold pointer-events-none shadow-xl">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-orange-400" />
                  <span>Hero Slider ({isCustomSource ? `${effectiveSlides.length} Custom Slides` : 'Synced with Sliders & Banners'})</span>
                </div>
              )}
            </div>
          );
        })()}

        {/* 6. PRODUCT GRID / FEATURED */}
        {(widget.type === 'product_grid' || 
          widget.type === 'featured_products' || 
          widget.type === 'latest_products' || 
          widget.type === 'bestseller_products') && (
          <div className="space-y-4">
            {/* Header if defined */}
            {(widget.content.text || widget.content.badge) && (
              widget.settings.textAlign === 'left' ? (
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4">
                  <div>
                    {widget.content.badge && (
                      <span className="text-xs font-bold text-orange-600 uppercase tracking-wider block mb-1">
                        {widget.content.badge}
                      </span>
                    )}
                    {widget.content.text && (
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        {widget.content.text}
                      </h3>
                    )}
                    {widget.content.subtext && (
                      <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                        {widget.content.subtext}
                      </p>
                    )}
                  </div>
                  {!isBuilderMode && (
                    <button
                      onClick={() => {
                        if (widget.settings.productCategory && onSelectCategory) {
                          onSelectCategory(widget.settings.productCategory);
                        }
                        setActivePage('shop');
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition self-start sm:self-auto cursor-pointer"
                    >
                      <span>View All Products</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center max-w-2xl mx-auto mb-6">
                  {widget.content.badge && (
                    <span className="text-xs font-bold text-orange-600 uppercase tracking-wider block mb-1">
                      {widget.content.badge}
                    </span>
                  )}
                  {widget.content.text && (
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {widget.content.text}
                    </h3>
                  )}
                  {widget.content.subtext && (
                    <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-xl mx-auto">
                      {widget.content.subtext}
                    </p>
                  )}
                  {!isBuilderMode && (
                    <div className="mt-2.5 flex justify-center">
                      <button
                        onClick={() => {
                          if (widget.settings.productCategory && onSelectCategory) {
                            onSelectCategory(widget.settings.productCategory);
                          }
                          setActivePage('shop');
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition cursor-pointer"
                      >
                        <span>View All Products</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )
            )}

            {/* Filter and slice products */}
            {(() => {
              let displayProds = [...products];

              if (widget.settings.productCategory && widget.settings.productCategory !== 'all') {
                displayProds = displayProds.filter(p => isProductInCategory(p, widget.settings.productCategory!));
              }

              if (widget.settings.onlyFeatured || widget.type === 'featured_products') {
                displayProds = displayProds.filter(p => p.isFeatured);
              }

              if (widget.settings.onlySale) {
                displayProds = displayProds.filter(p => p.originalPriceNGN && p.originalPriceNGN > p.priceNGN);
              }

              if (widget.settings.productBrand) {
                const brandKeyword = widget.settings.productBrand.toLowerCase();
                displayProds = displayProds.filter(p => (p.brand || '').toLowerCase().includes(brandKeyword) || p.name.toLowerCase().includes(brandKeyword));
              }

              const limit = widget.settings.productsLimit || 8;
              const finalProducts = displayProds.slice(0, limit);

              if (finalProducts.length === 0) {
                return (
                  <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs">
                    No products found matching category "{widget.settings.productCategory || 'All'}". Products in catalog: {products.length}.
                  </div>
                );
              }

              const cols = widget.settings.columnsCount || 4;
              const gridColsClass = 
                cols === 2 ? 'grid-cols-1 sm:grid-cols-2' :
                cols === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
                cols === 5 ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5' :
                cols === 6 ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6' :
                'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

              return (
                <div className={`grid ${gridColsClass} gap-4`}>
                  {finalProducts.map(prod => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      currency={currency}
                      onAddToCart={onAddToCart || (() => {})}
                      onToggleWishlist={onToggleWishlist || (() => {})}
                      isWishlisted={wishlistIds.includes(prod.id)}
                      onQuickView={onQuickView || (() => {})}
                      onSelectProduct={onSelectProduct || (() => {})}
                    />
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {/* 6B. PRODUCT SLIDER / CAROUSEL WIDGET */}
        {(widget.type === 'product_carousel' || widget.type === 'product_slider') && (
          <CMSProductSliderWidget
            widget={widget}
            products={products}
            categories={categories}
            currency={currency}
            setActivePage={setActivePage}
            onSelectCategory={onSelectCategory}
            onSelectProduct={onSelectProduct}
            onAddToCart={onAddToCart}
            onToggleWishlist={onToggleWishlist}
            wishlistIds={wishlistIds}
            onQuickView={onQuickView}
            isBuilderMode={isBuilderMode}
          />
        )}

        {/* 6C. IMAGE SLIDER / MULTI-IMAGE CAROUSEL WIDGET */}
        {widget.type === 'image_slider' && (
          <CMSImageSliderWidget
            widget={widget}
            setActivePage={setActivePage}
            isBuilderMode={isBuilderMode}
          />
        )}

        {/* 7. CATEGORY GRID / PRODUCT CATEGORIES */}
        {(widget.type === 'category_grid' || widget.type === 'product_categories') && (() => {
          // Dynamic category filtering based on admin panel selection
          let displayCats = [...categories];
          if (widget.settings.selectedCategorySlugs && widget.settings.selectedCategorySlugs.length > 0) {
            const selectedSet = new Set(widget.settings.selectedCategorySlugs);
            displayCats = displayCats.filter(cat => selectedSet.has(cat.slug) || selectedSet.has(cat.id));
            // Maintain user-selected order
            displayCats.sort((a, b) => {
              const idxA = widget.settings.selectedCategorySlugs!.indexOf(a.slug);
              const idxB = widget.settings.selectedCategorySlugs!.indexOf(b.slug);
              return (idxA >= 0 ? idxA : 999) - (idxB >= 0 ? idxB : 999);
            });
          }

          if (widget.settings.categoriesLimit && widget.settings.categoriesLimit > 0) {
            displayCats = displayCats.slice(0, widget.settings.categoriesLimit);
          } else if (!widget.settings.selectedCategorySlugs || widget.settings.selectedCategorySlugs.length === 0) {
            const defaultLimit = widget.settings.columnsCount ? widget.settings.columnsCount * 2 : 12;
            displayCats = displayCats.slice(0, defaultLimit);
          }

          // Dynamic Card Border Radius configured from Admin Panel
          const cardRadius = widget.settings.categoryCardBorderRadius !== undefined 
            ? widget.settings.categoryCardBorderRadius 
            : (widget.settings.borderRadius !== undefined ? widget.settings.borderRadius : 12);

          const innerImageRadius = Math.max(0, cardRadius - 4);

          // Grid Columns responsive class
          const cols = widget.settings.columnsCount || 6;
          const gridColsClass = 
            cols === 2 ? 'grid-cols-1 sm:grid-cols-2' :
            cols === 3 ? 'grid-cols-2 sm:grid-cols-3' :
            cols === 4 ? 'grid-cols-2 sm:grid-cols-4' :
            cols === 5 ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5' :
            'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6';

          const cardBgColor = widget.settings.categoryCardBgColor || '#ffffff';
          const cardBorderColor = widget.settings.categoryCardBorderColor || '#e2e8f0';
          const showItemCount = widget.settings.showItemCount !== false;

          return (
            <div className="space-y-4">
              {(widget.content.text || widget.content.badge) && (
                <div className={`mb-6 ${widget.settings.textAlign === 'left' ? 'text-left' : 'text-center max-w-2xl mx-auto'}`}>
                  {widget.content.badge && (
                    <span className="text-xs font-bold text-orange-600 uppercase tracking-wider block mb-1">
                      {widget.content.badge}
                    </span>
                  )}
                  {widget.content.text && (
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {widget.content.text}
                    </h3>
                  )}
                  {widget.content.subtext && (
                    <p className={`text-xs sm:text-sm text-slate-500 mt-1.5 max-w-xl ${widget.settings.textAlign === 'left' ? '' : 'mx-auto'}`}>
                      {widget.content.subtext}
                    </p>
                  )}
                </div>
              )}

              {displayCats.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs">
                  No categories selected for this grid. Select categories from the Admin Page Builder properties panel.
                </div>
              ) : (
                <div className={`grid ${gridColsClass} gap-3`}>
                  {displayCats.map(cat => {
                    const count = products.filter(p => isProductInCategory(p, cat.slug)).length;
                    return (
                      <div
                        key={cat.id}
                        onClick={() => {
                          if (!isBuilderMode) {
                            onSelectCategory?.(cat.slug);
                            setActivePage('shop');
                          }
                        }}
                        style={{
                          borderRadius: `${cardRadius}px`,
                          backgroundColor: cardBgColor,
                          borderColor: cardBorderColor
                        }}
                        className="group border hover:border-orange-500 hover:shadow-md p-3.5 transition-all flex flex-col items-center text-center cursor-pointer shadow-2xs"
                      >
                        <div 
                          style={{ borderRadius: `${innerImageRadius}px` }}
                          className="w-14 h-14 bg-slate-50 p-1.5 mb-2 group-hover:scale-105 transition-transform overflow-hidden flex items-center justify-center border border-slate-100"
                        >
                          <img
                            src={cat.image}
                            alt={cat.name}
                            style={{ borderRadius: `${Math.max(0, innerImageRadius - 2)}px` }}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 group-hover:text-orange-600 transition-colors leading-tight line-clamp-2">
                          {cat.name}
                        </h4>
                        {showItemCount && (
                          <span className="text-[10px] text-slate-400 mt-1 font-medium">
                            {count} {count === 1 ? 'item' : 'items'}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

        {/* 8. TRUST BADGES */}
        {widget.type === 'trust_badges' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3.5 p-2">
              <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">100% Genuine OEM</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Official HP Hologram verified</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-2">
              <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">Fast Corporate Delivery</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Same-day Lagos & Nationwide</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-2">
              <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">Corporate RFQ & Tenders</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Stamped VAT proforma quotes</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-2">
              <div className="w-11 h-11 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">Dedicated Account Desk</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">B2B procurement specialists</p>
              </div>
            </div>
          </div>
        )}

        {/* 9. CTA BANNER (Corporate Procurement RFQ Prompt) */}
        {widget.type === 'cta_banner' && (
          <div
            style={{
              backgroundColor: widget.settings.bgColor || '#1e293b',
              color: widget.settings.textColor || '#ffffff',
              borderRadius: widget.settings.borderRadius !== undefined ? `${widget.settings.borderRadius}px` : '16px'
            }}
            className="p-8 sm:p-10 text-center shadow-xl relative overflow-hidden"
          >
            {widget.content.badge && (
              <span className="inline-block text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-full mb-3">
                {widget.content.badge}
              </span>
            )}
            <h3 className="text-xl sm:text-3xl font-black text-white max-w-2xl mx-auto leading-tight">
              {widget.content.text || 'Need Bulk Corporate Supplies with Stamped Proforma Invoices?'}
            </h3>
            {widget.content.subtext && (
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl mx-auto leading-relaxed">
                {widget.content.subtext}
              </p>
            )}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <button
                onClick={() => !isBuilderMode && setActivePage('rfq')}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer transition"
              >
                <span>{widget.content.buttonText || 'Request Stamped RFQ Quote'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              {widget.content.secondaryBtnText && (
                <a
                  href={widget.content.secondaryBtnUrl || 'tel:09069425822'}
                  className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-bold text-xs tracking-wider cursor-pointer transition flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>{widget.content.secondaryBtnText}</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* 10. INTERACTIVE RFQ / CONTACT FORM WIDGET */}
        {(widget.type === 'rfq_form' || widget.type === 'contact_form') && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8 max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900">
                {widget.content.text || 'Corporate Request for Quotation (RFQ)'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                {widget.content.subtext || 'Submit your corporate requirements for formal stamped proforma invoices with TIN & VAT breakdown.'}
              </p>
            </div>

            {rfqSubmitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-black text-emerald-900">RFQ Submitted Successfully!</h4>
                <p className="text-xs text-emerald-700">
                  Your tender reference has been registered. Our B2B corporate desk will email your formal proforma quotation within 2-4 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRfqSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Company / Organization Name *</label>
                  <input
                    type="text"
                    required
                    value={rfqFormData.companyName}
                    onChange={(e) => setRfqFormData({ ...rfqFormData, companyName: e.target.value })}
                    placeholder="e.g. Zenith Bank PLC / TotalEnergies Nigeria"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Official Corporate Email *</label>
                    <input
                      type="email"
                      required
                      value={rfqFormData.email}
                      onChange={(e) => setRfqFormData({ ...rfqFormData, email: e.target.value })}
                      placeholder="procurement@company.ng"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phone / WhatsApp Number</label>
                    <input
                      type="tel"
                      value={rfqFormData.phone}
                      onChange={(e) => setRfqFormData({ ...rfqFormData, phone: e.target.value })}
                      placeholder="+234 800 000 0000"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Items & Quantities Required *</label>
                  <textarea
                    rows={3}
                    required
                    value={rfqFormData.requirements}
                    onChange={(e) => setRfqFormData({ ...rfqFormData, requirements: e.target.value })}
                    placeholder="e.g. 50 units HP 26A Toner, 10 Executive Mesh Chairs, 2 Comix S350 Shredders..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-md transition cursor-pointer text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <span>{widget.content.buttonText || 'Generate Stamped Proforma Quote'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        )}

        {/* 11. BRAND LOGOS / CLIENT LOGOS / LOGO SLIDER */}
        {(widget.type === 'brand_logos' || widget.type === 'client_logos' || widget.type === 'logo_slider') && (
          <CMSLogoSliderWidget
            widget={widget}
            isBuilderMode={isBuilderMode}
          />
        )}

        {/* 12. TESTIMONIALS */}
        {widget.type === 'testimonials' && (
          <div className="space-y-4">
            {(widget.content.text || widget.content.badge) && (
              <div className="text-center max-w-xl mx-auto mb-6">
                {widget.content.badge && (
                  <span className="text-xs font-bold text-orange-600 uppercase tracking-wider block mb-1">
                    {widget.content.badge}
                  </span>
                )}
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {widget.content.text || 'Trusted by Over 500+ Corporate Clients in Nigeria'}
                </h3>
                {widget.content.subtext && (
                  <p className="text-xs text-slate-500 mt-1">
                    {widget.content.subtext}
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 italic leading-relaxed">
                  "Ofixbaze outfitted our 3-floor Marina corporate headquarters with executive walnut boardroom tables and genuine HP laserjet cartridges. Outstanding delivery speed."
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                    BA
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 leading-tight">Chief Babatunde Adeleke</h5>
                    <span className="text-[10px] text-slate-400">Managing Partner, Apex Capital Ltd</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 italic leading-relaxed">
                  "The authenticity verification QR codes on their HP toners saved us from counterfeit market hazards. When filing urgent court briefs, we cannot afford smudges."
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center">
                    NO
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 leading-tight">Barrister Nneka Okafor</h5>
                    <span className="text-[10px] text-slate-400">Head of Admin, Prime Chambers</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 italic leading-relaxed">
                  "The RFQ proforma portal made corporate audit reconciliation effortless. We received formal TIN/VAT stamped documents within 2 hours. A true supply partner."
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
                    FA
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 leading-tight">Folake Adeyemi</h5>
                    <span className="text-[10px] text-slate-400">Procurement Lead, Zenith MFB PLC</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 13. DIVIDER & SPACER */}
        {widget.type === 'divider' && (
          <div className="py-3">
            <div className="w-full border-t border-slate-200" />
          </div>
        )}
        {widget.type === 'spacer' && (
          <div style={{ height: widget.settings.minHeight || '32px' }} />
        )}

        {/* 14. QUOTE */}
        {widget.type === 'quote' && (
          <blockquote className="border-l-4 border-orange-500 pl-4 py-2 my-2 text-slate-700 italic text-sm">
            "{widget.content.text || 'We equip Nigeria’s top enterprises with certified office equipment and authentic toner supplies.'}"
            {widget.content.authorName && (
              <cite className="block text-xs font-bold not-italic text-slate-900 mt-2">
                — {widget.content.authorName} {widget.content.authorRole ? `(${widget.content.authorRole})` : ''}
              </cite>
            )}
          </blockquote>
        )}

        {/* 15. FAQ ACCORDION */}
        {widget.type === 'faq' && (
          <div className="space-y-2.5 max-w-2xl mx-auto">
            <details className="bg-white rounded-xl border border-slate-200 p-3.5 cursor-pointer group" open>
              <summary className="font-bold text-slate-900 text-xs flex items-center justify-between">
                <span>Are all HP toner cartridges sold by Ofixbaze 100% genuine?</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
              </summary>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Yes, absolutely. Every cartridge includes the official dynamic security hologram and QR code verified via HP SureSupply. We provide 100% replacement warranties.
              </p>
            </details>
            <details className="bg-white rounded-xl border border-slate-200 p-3.5 cursor-pointer group">
              <summary className="font-bold text-slate-900 text-xs flex items-center justify-between">
                <span>Do you provide stamped proforma invoices for corporate auditing?</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
              </summary>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Yes. All corporate orders and RFQs receive formal stamped invoices with Tax Identification Number (TIN) and standard VAT breakdown for corporate financial audits.
              </p>
            </details>
            <details className="bg-white rounded-xl border border-slate-200 p-3.5 cursor-pointer group">
              <summary className="font-bold text-slate-900 text-xs flex items-center justify-between">
                <span>How fast is delivery within Lagos and to other states?</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
              </summary>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                We provide same-day courier dispatch across Lagos (Island, Ikeja, Lekki, Victoria Island). Deliveries to Abuja, Port Harcourt, and nationwide arrive within 24–48 hours.
              </p>
            </details>
          </div>
        )}
      </div>
    );
  };

  return (
    <section
      id={section.settings.elementId || undefined}
      onClick={(e) => {
        if (isBuilderMode && onSelectSection) {
          e.stopPropagation();
          onSelectSection(section.id);
        }
      }}
      style={sectionBgStyle}
      className={`relative transition-all ${isImageBannerSection ? 'max-md:!min-h-0' : ''} ${sectionHideClasses} ${section.settings.cssClasses || ''} ${
        isSectionSelected
          ? 'ring-2 ring-orange-500 z-10'
          : isBuilderMode
          ? 'hover:ring-1 hover:ring-blue-400/80'
          : ''
      }`}
    >
      {/* Builder Section Floating Controls */}
      {isSectionSelected && (
        <div className="absolute -top-8 left-4 bg-[#0f172a] text-white text-[11px] font-bold px-2.5 py-1 rounded-t-lg flex items-center gap-2 shadow-2xl z-40 select-none border-t border-x border-slate-700">
          <div className="flex items-center gap-1.5 text-orange-400">
            <Layers className="w-3.5 h-3.5" />
            <span className="truncate max-w-[130px] font-semibold">{section.name || 'Section'}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono uppercase bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
            {section.settings.contentWidthMode || (isSectionBoxed ? 'Boxed' : 'Full')}
          </span>
          <div className="h-3.5 w-px bg-slate-700" />
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveSection?.('up');
              }}
              disabled={!canMoveUp}
              title="Move Section Up"
              className="hover:bg-slate-800 p-1 rounded disabled:opacity-30 cursor-pointer text-slate-300 hover:text-white"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveSection?.('down');
              }}
              disabled={!canMoveDown}
              title="Move Section Down"
              className="hover:bg-slate-800 p-1 rounded disabled:opacity-30 cursor-pointer text-slate-300 hover:text-white"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicateSection?.();
              }}
              title="Duplicate Section"
              className="hover:bg-slate-800 p-1 rounded cursor-pointer text-slate-300 hover:text-white"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCopySection?.(section);
              }}
              title="Copy Section"
              className="hover:bg-slate-800 p-1 rounded cursor-pointer text-slate-300 hover:text-white"
            >
              <CopyCheck className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCopySectionStyle?.(section.settings);
              }}
              title="Copy Section Style"
              className="hover:bg-slate-800 p-1 rounded cursor-pointer text-amber-400 hover:text-amber-300"
            >
              <Paintbrush className="w-3.5 h-3.5" />
            </button>
            {hasCopiedSectionStyle && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPasteSectionStyle?.(section.id);
                }}
                title="Paste Section Style"
                className="hover:bg-slate-800 p-1 rounded cursor-pointer text-emerald-400 hover:text-emerald-300"
              >
                <ClipboardCheck className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSaveSectionAsTemplate?.();
              }}
              title="Save Section as Reusable Template"
              className="hover:bg-slate-800 p-1 rounded cursor-pointer text-blue-400 hover:text-blue-300"
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
            </button>
            <div className="h-3.5 w-px bg-slate-700" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteSection?.();
              }}
              title="Delete Section"
              className="hover:bg-rose-600 p-1 rounded cursor-pointer text-rose-300 hover:text-white"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Background Overlay if configured */}
      {((section.settings.bgOverlayOpacity ?? 0) > 0 || (section.settings.overlayOpacity ?? 0) > 0) && (
        <div 
          style={{
            backgroundColor: section.settings.overlayColor || '#000000',
            opacity: section.settings.bgOverlayOpacity ?? section.settings.overlayOpacity ?? 0
          }}
          className="absolute inset-0 pointer-events-none z-0"
        />
      )}

      {/* Section Container Content */}
      <div 
        style={{
          maxWidth: (widthMode === 'custom' && section.settings.customWidth && section.settings.customWidth !== '1320px')
            ? section.settings.customWidth
            : (section.settings.contentMaxWidth && section.settings.contentMaxWidth !== '1320px')
            ? section.settings.contentMaxWidth
            : '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: widthMode === 'full-bleed' 
            ? '0px' 
            : sectionPl !== undefined ? `${sectionPl}px` : undefined,
          paddingRight: widthMode === 'full-bleed' 
            ? '0px' 
            : sectionPr !== undefined ? `${sectionPr}px` : undefined,
        }}
        className={`relative z-10 w-full ${
          widthMode === 'full-bleed'
            ? 'px-0'
            : (sectionPl === undefined || sectionPr === undefined)
              ? 'px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12'
              : ''
        }`}
      >
        <div className={getSectionLayoutClass()}>
          {section.widgets.map(widget => renderWidget(widget))}
        </div>
      </div>
    </section>
  );
};
