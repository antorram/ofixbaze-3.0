import React, { useState } from 'react';
import { ShoppingCart, Heart, Eye, Check, Star, ShieldCheck, FileText } from 'lucide-react';
import { Product, Currency } from '../types';

export interface MarketplaceProductCardProps {
  product: Product;
  currency: Currency;
  onAddToCart: (product: Product, quantity?: number) => void;
  onToggleWishlist: (productId: string) => void;
  isWishlisted: boolean;
  onQuickView: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  compact?: boolean;
}

export const MarketplaceProductCard: React.FC<MarketplaceProductCardProps> = ({
  product,
  currency,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onQuickView,
  onSelectProduct,
  compact = false
}) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickView(product);
  };

  return (
    <div
      id={`marketplace-card-${product.id}`}
      onClick={() => onSelectProduct(product)}
      className="group relative bg-white rounded-xl border border-slate-200 hover:border-orange-500 hover:shadow-lg transition-all duration-200 flex flex-col h-full cursor-pointer overflow-hidden transform hover:-translate-y-1"
    >
      {/* Media Container with Badges */}
      <div className="relative pt-[84%] bg-slate-50/70 overflow-hidden border-b border-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300 ease-out"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=400&q=80';
          }}
        />

        {/* Badges: OEM & Features */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10">
          {product.isOriginalOEM && (
            <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-300 shadow-2xs">
              <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
              OEM
            </span>
          )}
          {product.badge && (
            <span className="bg-orange-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
              {product.badge}
            </span>
          )}
        </div>

        {/* Quick Action Overlay Buttons (Wishlist & Quick View) */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
          <button
            onClick={handleWishlist}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition shadow-xs cursor-pointer ${
              isWishlisted
                ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                : 'bg-white/90 text-slate-500 hover:text-rose-600 hover:bg-white border border-slate-200'
            }`}
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-label="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          <button
            onClick={handleQuickView}
            className="w-7 h-7 rounded-full bg-white/90 hover:bg-orange-50 text-slate-500 hover:text-orange-600 border border-slate-200 flex items-center justify-center transition shadow-xs opacity-0 group-hover:opacity-100 cursor-pointer"
            title="Quick View"
            aria-label="Quick View"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1">
        {/* Brand & In-Stock Status */}
        <div className="flex items-center justify-between gap-1 text-[11px] mb-1">
          <span className="font-extrabold text-slate-600 uppercase tracking-wider text-[9px] bg-slate-100 px-1.5 py-0.5 rounded">
            {product.brand}
          </span>
          <div className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${product.inStock ? 'bg-emerald-500' : 'bg-slate-300'}`} />
            <span className={`font-semibold text-[10px] ${product.inStock ? 'text-emerald-700' : 'text-slate-400'}`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>

        {/* Product Title */}
        <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 line-clamp-2 min-h-[2.4rem] group-hover:text-orange-600 transition-colors leading-snug">
          {product.name}
        </h3>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-2.5 h-2.5 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
              />
            ))}
          </div>
          <span className="text-[10px] font-medium text-slate-500">({product.reviewsCount})</span>
        </div>

        {/* Price on Request / RFQ status */}
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-black text-orange-600 tracking-tight uppercase">
            Price on Request
          </span>
          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
            RFQ
          </span>
        </div>

        {/* Add to Quote CTA */}
        <div className="mt-auto pt-2.5">
          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            className={`w-full py-2 px-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs ${
              isAdded
                ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                : 'bg-slate-900 hover:bg-orange-600 text-white active:scale-[0.98]'
            } disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5 text-orange-400 group-hover:text-white transition-colors" />
                <span>Add to Quote</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
