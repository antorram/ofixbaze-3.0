import React, { useState } from 'react';
import { 
  ChevronRight, 
  ShieldCheck, 
  Truck, 
  Heart, 
  ShoppingCart, 
  Check, 
  Star, 
  Building, 
  FileText, 
  RotateCcw, 
  Share2,
  AlertCircle,
  User,
  CheckCircle2
} from 'lucide-react';
import { Product, Currency, ActivePage } from '../types';
import { PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailPageProps {
  product: Product;
  currency: Currency;
  onAddToCart: (product: Product, quantity: number) => void;
  onToggleWishlist: (productId: string) => void;
  isWishlisted: boolean;
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (category: string) => void;
  setActivePage: (page: ActivePage) => void;
  onOpenAuthenticityModal: () => void;
  onQuickView: (product: Product) => void;
  wishlistIds: string[];
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  currency,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onSelectProduct,
  onSelectCategory,
  setActivePage,
  onOpenAuthenticityModal,
  onQuickView,
  wishlistIds
}) => {
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'desc' | 'genuine' | 'reviews'>('specs');
  const [isAdded, setIsAdded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Reviews state with local persistence
  const [reviewsList, setReviewsList] = useState<Array<{
    id: string;
    name: string;
    company: string;
    rating: number;
    date: string;
    verified: boolean;
    comment: string;
  }>>(() => {
    try {
      const stored = localStorage.getItem(`ofixbaze_reviews_${product.id}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    return [
      {
        id: 'rev-1',
        name: 'Engr. Dapo Alabi',
        company: 'First Horizon Financial Services, Victoria Island',
        rating: 5,
        date: '2 weeks ago',
        verified: true,
        comment: 'Authentic OEM packaging with genuine security hologram verified via QR code. Yield has been consistent across our branch print volume. Prompt same-day delivery to VI.'
      },
      {
        id: 'rev-2',
        name: 'Ngozi Chukwuemeka',
        company: 'Zenith Legal Partners, Ikoyi',
        rating: 5,
        date: '1 month ago',
        verified: true,
        comment: 'We buy all our toner cartridges and equipment here for our firm. No jamming or faded print lines. Top quality corporate supplier in Lagos.'
      }
    ];
  });

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newReviewerName, setNewReviewerName] = useState('');
  const [newReviewerRole, setNewReviewerRole] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewerName.trim() || !newReviewComment.trim()) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      name: newReviewerName.trim(),
      company: newReviewerRole.trim() || 'Corporate Client, Lagos',
      rating: newRating,
      date: 'Just now',
      verified: true,
      comment: newReviewComment.trim()
    };

    const updated = [newRev, ...reviewsList];
    setReviewsList(updated);
    try {
      localStorage.setItem(`ofixbaze_reviews_${product.id}`, JSON.stringify(updated));
    } catch (err) {
      console.warn(err);
    }

    setReviewSubmitted(true);
    setNewReviewerName('');
    setNewReviewerRole('');
    setNewReviewComment('');
    setTimeout(() => {
      setReviewSubmitted(false);
      setShowReviewForm(false);
    }, 2000);
  };

  const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const categoryObj = CATEGORIES.find(c => c.slug === product.category);

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    onAddToCart(product, quantity);
    setActivePage('checkout');
  };

  const handleShare = () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(window.location.href)
          .then(() => {
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 2500);
          })
          .catch(() => {
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 2500);
          });
      } else {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }
    } catch {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Related products from the same category
  const relatedProducts = PRODUCTS.filter(
    p => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-4 sm:py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 flex-wrap" aria-label="Breadcrumb">
        <button onClick={() => setActivePage('home')} className="hover:text-blue-600 cursor-pointer">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button 
          onClick={() => {
            onSelectCategory(product.category);
            setActivePage('shop');
          }} 
          className="hover:text-blue-600 cursor-pointer"
        >
          {categoryObj ? categoryObj.name : 'Category'}
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-slate-900 truncate max-w-xs sm:max-w-md">
          {product.name}
        </span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs mb-12">
        
        {/* Gallery Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="aspect-square bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center justify-center relative overflow-hidden group">
            <img
              src={images[activeImage] || product.image}
              alt={product.name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
            {product.isOriginalOEM && (
              <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded shadow-xs flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                100% Genuine OEM
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-16 h-16 rounded-xl border p-1 bg-slate-50 shrink-0 cursor-pointer transition ${
                    activeImage === idx ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}

          {/* Guarantee Badges */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 text-slate-600">
            <div className="flex items-center gap-2 font-medium text-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Verified Manufacturer Warranty: {product.warranty}</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Same-day dispatch from Lagos Island warehouse</span>
            </div>
          </div>
        </div>

        {/* Product Info Column (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                  {product.brand}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  SKU: {product.sku}
                </span>
              </div>
              <button
                onClick={handleShare}
                className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
                title="Share link"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Copied Link!' : 'Share'}</span>
              </button>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 leading-snug">
              {product.name}
            </h1>

            {/* Ratings & Stock */}
            <div className="flex items-center gap-4 mt-2 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-slate-700">
                  {product.rating} ({product.reviewsCount} customer reviews)
                </span>
              </div>

              <span className="text-slate-300">|</span>

              <span className={`font-bold ${product.inStock ? 'text-emerald-600' : 'text-slate-400'}`}>
                {product.inStock ? `In Stock (${product.stockCount} Units available)` : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Corporate Quotation Pricing Box */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-50/70 via-slate-50 to-orange-50/30 rounded-2xl border border-orange-200/80">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-orange-600 block mb-0.5">
                  Pricing Status
                </span>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
                  Price on Request
                </span>
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-orange-200 rounded-full text-xs font-bold text-slate-700 shadow-2xs">
                  <FileText className="w-3.5 h-3.5 text-orange-500" />
                  Instant RFQ Available
                </span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-200/60 text-xs text-slate-500">
              <span className="flex items-center gap-1 text-slate-600 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Official Nigerian VAT &amp; WHT stamped invoice provided</span>
              </span>
              <button
                onClick={() => setActivePage('rfq')}
                className="text-orange-600 hover:text-orange-700 font-bold underline cursor-pointer"
              >
                Request Custom Bulk Tender
              </button>
            </div>
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Key Bullet Features */}
          <div className="space-y-1.5 pt-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Key Highlights:</h4>
            {product.features.map((feat, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </div>
            ))}
          </div>

          {/* Order Actions */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* Quantity Picker */}
              <div className="flex items-center border border-slate-300 rounded-lg bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-50 disabled:opacity-30 cursor-pointer text-sm"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-slate-900 select-none">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-50 cursor-pointer text-sm"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                id="product-detail-add-cart"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 py-3 px-5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                  isAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 hover:bg-orange-600 text-white'
                } disabled:bg-slate-200 disabled:text-slate-400`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 text-orange-400" />
                    <span>Add to Quote Cart {quantity > 1 ? `(${quantity} Units)` : ''}</span>
                  </>
                )}
              </button>

              {/* Instant Buy Now */}
              <button
                id="product-detail-buy-now"
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="py-3 px-6 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-500 text-white transition cursor-pointer disabled:bg-slate-200 shadow-sm flex items-center gap-1.5"
              >
                <span>Buy Now</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {/* Wishlist */}
              <button
                onClick={() => onToggleWishlist(product.id)}
                className={`p-3 border rounded-lg transition cursor-pointer ${
                  isWishlisted
                    ? 'border-red-300 bg-red-50 text-red-500'
                    : 'border-slate-300 text-slate-600 hover:text-red-500'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500' : ''}`} />
              </button>
            </div>

            {/* Corporate RFQ quick link */}
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-amber-900">
                <Building className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Purchasing in bulk (5+ units) for a company or institution?</span>
              </div>
              <button
                onClick={() => setActivePage('rfq')}
                className="font-bold text-amber-800 hover:text-amber-950 underline shrink-0 cursor-pointer"
              >
                Request Proforma Quote →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section (Specifications, Detailed Overview, Genuine OEM verification, Reviews) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-12">
        <div className="flex border-b border-slate-200 gap-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 text-xs font-bold transition cursor-pointer shrink-0 ${
              activeTab === 'specs'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('desc')}
            className={`pb-3 text-xs font-bold transition cursor-pointer shrink-0 ${
              activeTab === 'desc'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Product Overview & Description
          </button>
          <button
            onClick={() => setActiveTab('genuine')}
            className={`pb-3 text-xs font-bold transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === 'genuine'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>OEM Authenticity Guarantee</span>
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-xs font-bold transition cursor-pointer shrink-0 ${
              activeTab === 'reviews'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Reviews ({product.reviewsCount})
          </button>
        </div>

        <div className="pt-6">
          {/* Specs Tab */}
          {activeTab === 'specs' && (
            <div className="max-w-2xl">
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {Object.entries(product.specs).map(([label, val], idx) => (
                  <div 
                    key={idx} 
                    className={`grid grid-cols-2 p-3 text-xs ${idx % 2 === 0 ? 'bg-slate-50/70' : 'bg-white'}`}
                  >
                    <span className="font-semibold text-slate-700">{label}</span>
                    <span className="text-slate-900">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description Tab */}
          {activeTab === 'desc' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed max-w-3xl">
              <p>{product.description}</p>
              <h4 className="text-sm font-bold text-slate-900 pt-2">Why Procure from Ofixbaze Nigeria:</h4>
              <ul className="list-disc list-inside space-y-1.5 text-slate-600 text-xs">
                <li>Direct factory-authorized source with zero tolerance for grey market or refurbished units.</li>
                <li>Comprehensive pre-delivery testing and prompt Lagos Island logistics.</li>
                <li>Official manufacturer warranty backed by direct replacement in case of defects.</li>
              </ul>
            </div>
          )}

          {/* Genuine Tab */}
          {activeTab === 'genuine' && (
            <div className="space-y-4 max-w-2xl">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-2">
                <h4 className="font-bold flex items-center gap-1.5 text-sm text-emerald-950">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  Ofixbaze 100% Anti-Counterfeit Promise
                </h4>
                <p className="leading-relaxed">
                  Every cartridge and piece of office equipment sold through ofixbaze.com is sourced directly from OEM authorized supply chains. Each HP toner arrives in its original sealed box with security QR code and tilt-to-view hologram label.
                </p>
                <button
                  onClick={onOpenAuthenticityModal}
                  className="mt-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold transition text-xs inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Learn How to Verify Hologram</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 max-w-3xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-black text-slate-900">{product.rating}</div>
                    <div className="flex text-amber-400 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">{reviewsList.length} verified ratings</div>
                  </div>
                  <div className="text-xs text-slate-600 border-l border-slate-200 pl-4 space-y-1">
                    <p className="font-semibold text-slate-900">100% Genuine Verified Purchases</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Recommended by corporate IT officers and procurement desks across Lagos.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0 transition cursor-pointer self-start sm:self-center"
                >
                  {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                </button>
              </div>

              {/* Add Review Form */}
              {showReviewForm && (
                <form onSubmit={handleAddReview} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h4 className="text-sm font-bold text-slate-900">Share Your Experience</h4>
                    <span className="text-[11px] text-slate-400">Review for: {product.name}</span>
                  </div>

                  {reviewSubmitted ? (
                    <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Thank you! Your verified corporate review has been published.</span>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-slate-700 font-semibold text-xs mb-1.5">Rating (1 to 5 Stars)</label>
                        <div className="flex items-center gap-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewRating(star)}
                              className="p-1 hover:scale-110 transition cursor-pointer"
                            >
                              <Star className={`w-5 h-5 ${star <= newRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                            </button>
                          ))}
                          <span className="ml-2 text-xs font-bold text-slate-700">{newRating} of 5 Stars</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-700 font-semibold text-xs mb-1">Your Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Babatunde Adeleke"
                            value={newReviewerName}
                            onChange={(e) => setNewReviewerName(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-blue-600"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-700 font-semibold text-xs mb-1">Company / Organization</label>
                          <input
                            type="text"
                            placeholder="e.g. Sterling Energy Ltd, Ikeja"
                            value={newReviewerRole}
                            onChange={(e) => setNewReviewerRole(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-blue-600"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold text-xs mb-1">Your Review / Feedback *</label>
                        <textarea
                          rows={3}
                          required
                          placeholder="How did the product perform? Mention print quality, page yield, packaging condition..."
                          value={newReviewComment}
                          onChange={(e) => setNewReviewComment(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-blue-600"
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                        >
                          Submit Verified Review
                        </button>
                      </div>
                    </>
                  )}
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-3">
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl border border-slate-200/80 bg-white space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{rev.name}</span>
                        {rev.verified && (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <div className="flex text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                        <span>•</span>
                        <span>{rev.date}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 font-medium">{rev.company}</p>
                    <p className="text-xs text-slate-700 leading-relaxed pt-1">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-slate-900">
              Frequently Purchased Together
            </h3>
            <button
              onClick={() => {
                onSelectCategory(product.category);
                setActivePage('shop');
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              View More in Category →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.map(rel => (
              <ProductCard
                key={rel.id}
                product={rel}
                currency={currency}
                onAddToCart={(p) => onAddToCart(p, 1)}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlistIds.includes(rel.id)}
                onQuickView={onQuickView}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
