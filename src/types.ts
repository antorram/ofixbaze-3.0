export type Currency = 'NGN' | 'USD' | 'BDT' | 'GBP';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  rate: number; // relative to NGN (1 NGN = rate * currency)
  label: string;
}

export interface ProductVariation {
  id: string;
  name: string;
  sku: string;
  priceNGN: number;
  salePriceNGN?: number;
  stockCount: number;
  image?: string;
  attributes: Record<string, string>; // e.g. { Color: 'Tan Brown', Material: 'Italian Top-Grain Leather' }
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subCategory?: string;
  priceNGN: number;
  originalPriceNGN?: number;
  costPriceNGN?: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  isOriginalOEM: boolean;
  isFeatured?: boolean;
  isHotDeal?: boolean;
  badge?: string;
  image: string;
  gallery: string[];
  shortDescription: string;
  description: string;
  features: string[];
  specs: Record<string, string>;
  sku: string;
  warranty: string;
  yieldPages?: string;
  variations?: ProductVariation[];
  brandId?: string;
  tags?: string[];
  videoUrl?: string;
  // SEO & Search Engine Optimization
  metaTitle?: string;
  metaDescription?: string;
  focusKeywords?: string;
  slug?: string;
  canonicalUrl?: string;
  robotsDirective?: 'index, follow' | 'noindex, nofollow';
  ogImage?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  itemCount: number;
  description: string;
  image: string;
  subcategories: string[];
  bannerImage?: string;
  showBannerImageOnly?: boolean;
  bannerHeight?: 'compact' | 'medium' | 'large';
  bannerTitle?: string;
  bannerSubtitle?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  trackingNumber: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  currency: Currency;
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  customer: {
    fullName: string;
    companyName?: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
  };
  paymentMethod: string;
}

export interface RFQRequest {
  id: string;
  referenceId: string;
  date: string;
  companyName: string;
  rcNumber?: string;
  contactPerson: string;
  email: string;
  phone: string;
  deliveryLocation: string;
  procurementType: string;
  itemRequirements: string;
  urgency: string;
  status: 'Pending' | 'Reviewing' | 'Quotation Sent' | 'Approved' | 'Declined';
  quoteAmountNGN?: number;
  adminNotes?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  announcementText: string;
  showAnnouncement: boolean;
  phone1: string;
  phone2: string;
  whatsapp: string;
  email: string;
  address: string;
  businessHours: string;
  freeShippingThresholdNGN: number;
  standardShippingFeeNGN: number;
}

export interface ThemeColorScheme {
  primaryColor: string; // e.g. '#ea580c' (orange) or '#2563eb' (blue)
  secondaryColor: string;
  headerBg: string;
  topBarBg: string;
  topBarTextColor: string;
  footerBg: string;
  fontFamily: 'Inter' | 'Plus Jakarta Sans' | 'Poppins' | 'System';
  borderRadius: 'rounded-none' | 'rounded-md' | 'rounded-xl' | 'rounded-2xl' | 'rounded-full';
  containerWidth?: string; // e.g. '1200px' | '1280px' | '1440px' | '1600px' | '100%'
}

export interface BannerSlideItem {
  id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
}

export interface CustomSectionData {
  title: string;
  subtitle?: string;
  content: string;
  type: 'banner' | 'image_banner' | 'image_slider' | 'features' | 'cta' | 'announcement';
  bgColor: string;
  textColor: string;
  buttonText?: string;
  buttonLink?: string;
  imageUrl?: string;
  badge?: string;
  linkUrl?: string;
  bannerHeight?: 'compact' | 'medium' | 'large' | 'auto';
  showOverlayText?: boolean;
  slides?: BannerSlideItem[];
  autoplay?: boolean;
  intervalSeconds?: number;
}

export interface HomepageSectionItem {
  id: string; // 'hero' | 'trust_badges' | 'categories' | 'flash_deals' | 'featured_tabs' | 'quote_banner' | 'brand_partners' | 'clients' | 'testimonials' | custom string
  name: string;
  description: string;
  enabled: boolean;
  order: number;
  isCustom?: boolean;
  customData?: CustomSectionData;
  // Live customizable fields for all sections
  sectionTitle?: string;
  sectionSubtitle?: string;
  sectionBadge?: string;
  buttonText?: string;
  buttonLink?: string;
  bgColor?: string;
  textColor?: string;
}

export interface NavMenuItem {
  id: string;
  label: string;
  type: 'page' | 'category' | 'custom';
  target: string; // 'home' | 'shop' | 'about' | 'contact' | 'rfq' | 'track-order' | 'wishlist' or URL
  url?: string;
  categorySlug?: string;
  subCategory?: string;
  searchKeyword?: string;
  badge?: string; // e.g. 'HOT', 'OEM', 'NEW'
  order: number;
  enabled: boolean;
  openInNewTab?: boolean;
  children?: NavMenuItem[];
}

export interface SiteCustomizerConfig {
  theme: ThemeColorScheme;
  sections: HomepageSectionItem[];
  navMenu?: NavMenuItem[];
  announcement: {
    enabled: boolean;
    text: string;
    bgColor: string;
    textColor: string;
  };
  header: {
    showHotline: boolean;
    hotlineText: string;
    showRfqButton: boolean;
    siteTitle: string;
    logoUrl?: string;
  };
  footer: {
    copyrightText: string;
    aboutText: string;
    showNewsletter: boolean;
  };
}

export interface FilterState {
  category: string;
  subCategory: string;
  brand: string;
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  oemOnly: boolean;
  searchQuery: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}

export type ActivePage = 
  | 'home' 
  | 'shop' 
  | 'product-detail' 
  | 'checkout' 
  | 'rfq' 
  | 'about' 
  | 'contact' 
  | 'track-order' 
  | 'wishlist'
  | 'admin';

export interface PageSEOItem {
  pageId: string; // 'home' | 'shop' | 'about' | 'contact' | 'rfq' | 'track-order'
  pageName: string;
  urlPath: string;
  metaTitle: string;
  metaDescription: string;
  focusKeywords: string;
  canonicalUrl?: string;
  ogImage?: string;
  robotsDirective: 'index, follow' | 'noindex, nofollow';
  lastUpdated?: string;
}

export interface SiteSEOConfig {
  siteTitle: string;
  titleSeparator: string;
  defaultMetaDescription: string;
  defaultKeywords: string;
  canonicalDomain: string;
  defaultOgImage: string;
  twitterHandle: string;
  googleSiteVerification: string;
  bingVerification: string;
  ga4MeasurementId: string;
  facebookPixelId: string;
  robotsTxtContent: string;
  sitemapEnabled: boolean;
  autoGenerateProductSchema: boolean;
  pages: Record<string, PageSEOItem>;
}

// ==========================================
// DYNAMIC CMS & PAGE BUILDER TYPES
// ==========================================

export type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export type CMSWidgetType =
  // Content
  | 'heading'
  | 'text'
  | 'rich_text'
  | 'button'
  | 'image'
  | 'image_gallery'
  | 'image_slider'
  | 'video'
  | 'icon'
  | 'icon_box'
  | 'divider'
  | 'spacer'
  | 'quote'
  // Layout
  | 'section'
  | 'container'
  | 'row'
  | 'column'
  | 'columns'
  | 'grid'
  | 'flex'
  // Ecommerce
  | 'product_grid'
  | 'product_carousel'
  | 'product_slider'
  | 'featured_products'
  | 'latest_products'
  | 'bestseller_products'
  | 'product_categories'
  | 'category_grid'
  | 'product_search'
  | 'product_filter'
  | 'product_details'
  | 'product_price'
  | 'product_rating'
  | 'add_to_cart'
  | 'buy_now'
  | 'product_variations'
  | 'related_products'
  // Business & Sections
  | 'hero_banner'
  | 'banner_slider'
  | 'hero_slider'
  | 'cta_banner'
  | 'trust_badges'
  | 'testimonials'
  | 'client_logos'
  | 'brand_logos'
  | 'logo_slider'
  | 'faq'
  | 'contact_form'
  | 'rfq_form'
  | 'newsletter'
  | 'google_map'
  // Website & Navigation
  | 'header_widget'
  | 'menu_widget'
  | 'breadcrumb'
  | 'footer_widget'
  | 'announcement_bar'
  | 'html_custom';

export interface ResponsiveVisibility {
  hideDesktop?: boolean;
  hideTablet?: boolean;
  hideMobile?: boolean;
}

export interface CMSWidgetSettings extends ResponsiveVisibility {
  // Typography
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textColor?: string;
  hoverColor?: string;
  accentColor?: string;
  // Colors & BG
  bgColor?: string;
  hoverBgColor?: string;
  bgGradient?: string;
  bgImage?: string;
  bgPosition?: string;
  bgSize?: string;
  bgRepeat?: string;
  overlayColor?: string;
  overlayOpacity?: number;
  // Box Model / Spacing
  isPaddingLinked?: boolean;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  isMarginLinked?: boolean;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  rowGap?: number;
  columnGap?: number;
  // Borders & Shadow
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
  borderRadius?: number;
  boxShadow?: string;
  shadowPreset?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'custom';
  shadowX?: number;
  shadowY?: number;
  shadowBlur?: number;
  shadowSpread?: number;
  shadowColor?: string;
  shadowOpacity?: number;
  borderTopWidth?: number;
  borderRightWidth?: number;
  borderBottomWidth?: number;
  borderLeftWidth?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomRightRadius?: number;
  borderBottomLeftRadius?: number;
  opacity?: number;
  // Dimensions
  width?: string;
  maxWidth?: string;
  minHeight?: string;
  height?: string;
  // Animation & Advanced
  animation?: 'none' | 'fade' | 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom' | 'slide-right' | 'slide-left';
  animationDuration?: number;
  animationDelay?: number;
  hoverLift?: boolean;
  hoverZoom?: boolean;
  transition?: string;
  elementId?: string;
  cssClasses?: string;
  customCss?: string;
  zIndex?: number;
  position?: 'static' | 'relative' | 'absolute' | 'sticky';
  overflow?: 'visible' | 'hidden' | 'auto';
  // Responsive Overrides
  mobileFontSize?: string;
  mobilePadding?: number;
  mobileColumns?: number;
  tabletColumns?: number;
  desktopColumns?: number;
  // Specific Widget Controls
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div' | 'span';
  url?: string;
  openInNewTab?: boolean;
  iconName?: string;
  iconPosition?: 'left' | 'right';
  columnsCount?: number;
  productCategory?: string;
  productBrand?: string;
  productsLimit?: number;
  productSort?: 'featured' | 'price-asc' | 'price-desc' | 'newest';
  onlyFeatured?: boolean;
  onlySale?: boolean;
  aspectRatio?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  // Image Specific Layout & Sizing
  imageWidthMode?: 'default' | 'full-width' | 'custom' | 'full-bleed';
  imageAlignment?: 'left' | 'center' | 'right' | 'stretch';
  imageHeightMode?: 'auto' | 'custom';
  imageHeight?: string;
  imageMinHeight?: string;
  imageMaxHeight?: string;
  imageWidth?: string;
  imageMaxWidth?: string;
  imageMinWidth?: string;
  imageObjectFit?: 'cover' | 'contain' | 'fill' | 'none';
  imageObjectPosition?: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'custom';
  imageObjectPositionCustom?: string;
  // Responsive Image Controls
  imageWidthDesktop?: string;
  imageHeightDesktop?: string;
  imageWidthTablet?: string;
  imageHeightTablet?: string;
  imageWidthMobile?: string;
  imageHeightMobile?: string;
  tabletImageWidth?: string;
  tabletImageHeight?: string;
  tabletImageMaxWidth?: string;
  mobileImageWidth?: string;
  mobileImageHeight?: string;
  mobileImageMaxWidth?: string;
  // Image Style / Effects
  imageOpacity?: number;
  imageBorderWidth?: number;
  imageBorderStyle?: 'none' | 'solid' | 'dashed' | 'dotted';
  imageBorderColor?: string;
  imageBorderRadius?: number;
  imageBorderRadiusTopLeft?: number;
  imageBorderRadiusTopRight?: number;
  imageBorderRadiusBottomRight?: number;
  imageBorderRadiusBottomLeft?: number;
  imageShadowPreset?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inner';
  imageHoverScale?: boolean;
  imageHoverOpacity?: number;
  hoverScaleEffect?: boolean;
  hoverOpacityEffect?: boolean;
  imageLinkUrl?: string;
  imageLinkTarget?: '_self' | '_blank';
  // Category Grid & Card Controls
  selectedCategorySlugs?: string[];
  categoriesLimit?: number;
  categoryCardBorderRadius?: number;
  categoryCardBgColor?: string;
  categoryCardBorderColor?: string;
  categoryCardHoverBorderColor?: string;
  showItemCount?: boolean;
  // Slider & Carousel Controls
  sliderSource?: 'homepage-hero' | 'custom';
  sliderAutoplay?: boolean;
  sliderInterval?: number;
  sliderShowArrows?: boolean;
  sliderShowDots?: boolean;
  sliderHeight?: string;
  sliderTheme?: 'modern-dark' | 'corporate-light' | 'clean-white';
  // Logo & Brand Slider Controls
  logoSliderMode?: 'marquee' | 'carousel';
  logoSliderSpeed?: number;
  logoSliderGrayscale?: boolean;
  logoSliderHeight?: number | string;
  logoSliderItemsToShow?: number;
  logoSliderPauseOnHover?: boolean;
  logoSliderShowArrows?: boolean;
  logoSliderShowDots?: boolean;
  logoSliderBgColor?: string;
  logoSliderBorderRadius?: number;
  // Product Slider Controls
  productSliderAutoplay?: boolean;
  productSliderInterval?: number;
  productSliderItemsToShow?: number;
  productSliderShowArrows?: boolean;
  productSliderShowDots?: boolean;
  productSliderScrollBy?: number;
  // Image Slider Controls
  imageSliderAutoplay?: boolean;
  imageSliderInterval?: number;
  imageSliderHeight?: string;
  imageSliderAspectRatio?: '16:9' | '4:3' | '21:9' | 'auto' | 'square';
  imageSliderBorderRadius?: number;
  imageSliderShowArrows?: boolean;
  imageSliderShowDots?: boolean;
  imageSliderEffect?: 'slide' | 'fade';
  imageSliderObjectFit?: 'cover' | 'contain';
  imageSliderHeightMobile?: string;
  mobileImageSliderHeight?: string;
  mobileMinHeight?: string;
  minHeightMobile?: string;
  mobileHeight?: string;
  heightMobile?: string;
  mobileImageMinHeight?: string;
}

export interface CMSWidget {
  id: string;
  type: CMSWidgetType;
  title: string;
  content: {
    text?: string;
    subtext?: string;
    badge?: string;
    buttonText?: string;
    buttonUrl?: string;
    secondaryBtnText?: string;
    secondaryBtnUrl?: string;
    imageUrl?: string;
    altText?: string;
    imageTitle?: string;
    imageLink?: string;
    openInNewTab?: boolean;
    videoUrl?: string;
    icon?: string;
    deliveryText?: string;
    items?: Array<{
      id: string;
      title: string;
      description?: string;
      badge?: string;
      subtext?: string;
      icon?: string;
      image?: string;
      imageUrl?: string;
      link?: string;
      buttonText?: string;
      buttonUrl?: string;
      secondaryBtnText?: string;
      secondaryBtnUrl?: string;
      deliveryText?: string;
      price?: string;
      category?: string;
      author?: string;
      role?: string;
      company?: string;
      rating?: number;
    }>;
    categorySlug?: string;
    customHtml?: string;
    quoteText?: string;
    authorName?: string;
    authorRole?: string;
    authorCompany?: string;
    authorAvatar?: string;
    rating?: number;
  };
  settings: CMSWidgetSettings;
}

export interface CMSSectionSettings extends ResponsiveVisibility {
  layout?: 'boxed' | 'full-width' | 'full-bleed' | 'custom';
  contentWidthMode?: 'boxed' | 'full-width' | 'full-bleed' | 'custom';
  contentMaxWidth?: string;
  maxWidth?: string;
  width?: string;
  customWidth?: string;
  minHeight?: string;
  mobileMinHeight?: string;
  customMinHeight?: string;
  height?: string;
  mobileHeight?: string;
  flexDirection?: 'row' | 'column';
  flexWrap?: 'wrap' | 'nowrap';
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly' | 'flex-start' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'start' | 'center' | 'end' | 'stretch' | 'flex-start' | 'flex-end';
  gap?: number;
  overflow?: 'visible' | 'hidden' | 'auto';
  opacity?: number;
  zIndex?: number;
  position?: 'static' | 'relative' | 'sticky';
  bgColor?: string;
  bgGradient?: string;
  bgImage?: string;
  bgPosition?: string;
  bgSize?: string;
  bgRepeat?: string;
  bgOverlayOpacity?: number;
  overlayColor?: string;
  overlayOpacity?: number;
  textColor?: string;
  isPaddingLinked?: boolean;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTopTablet?: number;
  paddingBottomTablet?: number;
  paddingTopMobile?: number;
  paddingBottomMobile?: number;
  tabletPaddingTop?: number;
  tabletPaddingBottom?: number;
  tabletPaddingLeft?: number;
  tabletPaddingRight?: number;
  mobilePaddingTop?: number;
  mobilePaddingBottom?: number;
  mobilePaddingLeft?: number;
  mobilePaddingRight?: number;
  isMarginLinked?: boolean;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  columnsPreset?: '1-col' | '2-col-equal' | '3-col-equal' | '4-col-equal' | '30-70' | '70-30' | '40-60' | '60-40' | '25-75' | '75-25' | '33-67' | '67-33';
  columnGap?: number;
  rowGap?: number;
  borderWidth?: number;
  borderTopWidth?: number;
  borderRightWidth?: number;
  borderBottomWidth?: number;
  borderLeftWidth?: number;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
  borderRadius?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomRightRadius?: number;
  borderBottomLeftRadius?: number;
  borderRadiusTopLeft?: number;
  borderRadiusTopRight?: number;
  borderRadiusBottomRight?: number;
  borderRadiusBottomLeft?: number;
  boxShadow?: string;
  shadowPreset?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'custom';
  shadowX?: number;
  shadowY?: number;
  shadowBlur?: number;
  shadowSpread?: number;
  shadowColor?: string;
  shadowOpacity?: number;
  elementId?: string;
  cssClasses?: string;
  customCss?: string;
  animation?: 'none' | 'fade' | 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom';
  animationDuration?: number;
  animationDelay?: number;
  isGlobal?: boolean;
  globalId?: string;
}

export interface CMSSection {
  id: string;
  name: string;
  enabled: boolean;
  settings: CMSSectionSettings;
  widgets: CMSWidget[];
}

export interface CMSPageRevision {
  id: string;
  timestamp: string;
  author: string;
  summary?: string;
  sections: CMSSection[];
}

export interface CMSPage {
  id: string;
  title: string;
  slug: string;
  status: 'published' | 'draft';
  author: string;
  createdAt: string;
  updatedAt: string;
  lastPublishedAt?: string;
  template: 'default' | 'canvas' | 'full-width' | 'landing';
  seoTitle?: string;
  seoDescription?: string;
  revisions?: CMSPageRevision[];
  sections: CMSSection[];
}

export interface CMSBrand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  website?: string;
  isFeatured: boolean;
  productCount: number;
  badge?: string;
  isAuthorizedDealer?: boolean;
}

export type Brand = CMSBrand;

export interface CMSMediaItem {
  id: string;
  url: string;
  filename: string;
  fileSize: string;
  fileType: 'image' | 'video' | 'document' | 'other';
  uploadedAt: string;
  altText: string;
  dimensions?: string;
}

export interface CMSBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  status: 'published' | 'draft';
  seoTitle?: string;
  seoDescription?: string;
  readTimeMinutes?: number;
  readTime?: string;
}

export type BlogPost = CMSBlogPost;

export interface CMSFormField {
  id: string;
  label: string;
  name: string;
  type: 'text' | 'email' | 'phone' | 'number' | 'textarea' | 'select' | 'checkbox';
  placeholder?: string;
  required: boolean;
  options?: string[]; // for select
}

export interface CMSForm {
  id: string;
  name: string;
  title?: string;
  slug: string;
  description: string;
  submitButtonText: string;
  successMessage: string;
  fields: CMSFormField[];
  submissionsCount: number;
  createdAt: string;
}

export interface CMSFormSubmission {
  id: string;
  formId: string;
  formName: string;
  submittedAt: string;
  data: Record<string, string>;
  status: 'New' | 'Read' | 'Replied';
}

export interface CMSTestimonial {
  id: string;
  name?: string;
  clientName?: string;
  company?: string;
  companyName?: string;
  role: string;
  rating: number; // 1-5
  content?: string;
  quote?: string;
  avatar: string;
  logo?: string;
  active?: boolean;
  order?: number;
  isVerified?: boolean;
}

export interface CMSTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  type?: string;
  thumbnail: string;
  sectionData?: CMSSection;
  pageData?: CMSPage;
}

export interface CMSUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Administrator' | 'Editor' | 'Product Manager' | 'Order Manager' | 'Content Manager';
  status: 'Active' | 'Suspended';
  lastLogin: string;
  avatar?: string;
}

export interface CMSCustomer {
  id: string;
  fullName: string;
  companyName?: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  totalOrders: number;
  totalSpentNGN: number;
  quoteRequestsCount: number;
  status: 'Active' | 'VIP' | 'Blocked';
  lastActive: string;
}

export type Customer = CMSCustomer;

export interface CMSRevision {
  id: string;
  pageId: string;
  title: string;
  timestamp: string;
  author: string;
  sections: CMSSection[];
}

