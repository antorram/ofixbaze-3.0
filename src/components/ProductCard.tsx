import React, { useState } from 'react';
import { ShoppingCart, Heart, Eye, Check, Star, ShieldCheck, FileText } from 'lucide-react';
import { Product, Currency } from '../types';

interface ProductCardProps {
  product: Product;
  currency: Currency;
  onAddToCart: (product: Product, quantity?: number) => void;
  onToggleWishlist: (productId: string) => void;
  isWishlisted: boolean;
  onQuickView: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onQuickView,
  onSelectProduct
}) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
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
      id={`product-card-${product.id}`}
      onClick={() => onSelectProduct(product)}
      className="group relative bg-white rounded-xl border border-slate-200/90 hover:border-orange-500/80 hover:shadow-md transition-all duration-200 flex flex-col h-full cursor-pointer overflow-hidden"
    >
      {/* Top Media / Thumbnail Section */}
      <div className="relative pt-[82%] bg-slate-50/80 overflow-hidden border-b border-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-250"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          {product.badge && (
            <span className="bg-orange-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-xs tracking-wider uppercase">
              {product.badge}
            </span>
          )}
          {product.isOriginalOEM && (
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-300/80 shadow-2xs">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              OEM Genuine
            </span>
          )}
        </div>

        {/* Quick Action Overlay Buttons (Wishlist & Quick View) */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
          <button
            onClick={handleWishlist}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition shadow-xs cursor-pointer ${
              isWishlisted
                ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                : 'bg-white/95 text-slate-600 hover:text-rose-600 hover:bg-white border border-slate-200'
            }`}
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-label="Toggle wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          <button
            onClick={handleQuickView}
            className="w-8 h-8 rounded-full bg-white/95 hover:bg-white text-slate-600 hover:text-blue-700 border border-slate-200 flex items-center justify-center transition shadow-xs opacity-0 group-hover:opacity-100 cursor-pointer"
            title="Quick View"
            aria-label="Quick View product"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Brand & Stock Row */}
        <div className="flex items-center justify-between gap-2 text-[11px] mb-1.5">
          <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            {product.brand}
          </span>
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${product.inStock ? 'bg-emerald-500' : 'bg-slate-300'}`} />
            <span className={`font-semibold text-[11px] ${product.inStock ? 'text-emerald-700' : 'text-slate-400'}`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>

        {/* Product Title */}
        <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 min-h-[2.5rem] group-hover:text-orange-600 transition-colors leading-snug">
          {product.name}
        </h3>

        {/* Rating and SKU */}
        <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
          <div className="flex items-center gap-1">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                />
              ))}
            </div>
            <span className="text-[11px] font-medium text-slate-600">({product.reviewsCount})</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono tracking-tight">SKU: {product.sku}</span>
        </div>

        {/* Yield or Key Spec */}
        {product.yieldPages && (
          <div className="text-[10px] text-slate-600 bg-slate-100/70 border border-slate-200/80 rounded px-2 py-0.5 mt-2 self-start font-medium">
            Page Yield: <span className="font-bold text-slate-800">{product.yieldPages}</span>
          </div>
        )}

        {/* Bottom CTA Block */}
        <div className="mt-auto pt-3">
          {/* Price on Request Notice */}
          <div className="flex items-center justify-between mb-2.5 bg-slate-50/90 px-2.5 py-1.5 rounded-lg border border-slate-200/70">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-orange-600" />
              <span>Price on Request</span>
            </span>
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-orange-800 bg-orange-100 px-1.5 py-0.5 rounded border border-orange-200">
              Corporate RFQ
            </span>
          </div>

          {/* Request Quote Button */}
          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
              isAdded
                ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                : 'bg-slate-900 hover:bg-orange-600 text-white hover:shadow-orange-600/20 active:scale-[0.98]'
            } disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Quote Added!</span>
              </>
            ) : (
              <>
                <FileText className="w-3.5 h-3.5 text-orange-400 group-hover:text-white transition-colors" />
                <span>Request Quote</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
