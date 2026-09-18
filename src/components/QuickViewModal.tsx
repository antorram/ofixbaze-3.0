import React, { useState } from 'react';
import { X, ShoppingCart, Heart, ShieldCheck, Check, Star, ArrowRight, FileText } from 'lucide-react';
import { Product, Currency } from '../types';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  currency: Currency;
  onAddToCart: (product: Product, quantity: number) => void;
  onToggleWishlist: (productId: string) => void;
  isWishlisted: boolean;
  onSelectProduct: (product: Product) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  currency,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onSelectProduct
}) => {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleFullDetail = () => {
    onSelectProduct(product);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl z-10 overflow-hidden">
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Gallery Column */}
            <div>
              <div className="aspect-square bg-slate-50 rounded-xl overflow-hidden p-4 border border-slate-100 relative">
                <img
                  src={images[activeImage] || product.image}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
                {product.isOriginalOEM && (
                  <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Genuine OEM
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`w-14 h-14 rounded-lg border p-1 bg-slate-50 shrink-0 cursor-pointer ${
                        activeImage === idx ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200 opacity-70'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Column */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {product.brand}
                </span>
                <span className="text-xs text-slate-400 font-mono">SKU: {product.sku}</span>
              </div>

              <h2 className="text-lg font-bold text-slate-900 leading-snug">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-600">
                  {product.rating} ({product.reviewsCount} customer reviews)
                </span>
              </div>

              {/* Price / Quote Status */}
              <div className="flex items-center justify-between gap-2.5 mt-3 py-2.5 px-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <div className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-orange-600" />
                    <span>Price on Request</span>
                  </div>
                  <div className="text-[11px] text-slate-500">Official B2B Quote • Proforma Invoice</div>
                </div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  {product.inStock ? `In Stock (${product.stockCount} units)` : 'Out of Stock'}
                </span>
              </div>

              {/* Short description */}
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                {product.shortDescription}
              </p>

              {/* Key Features */}
              <div className="mt-3 space-y-1">
                {product.features.slice(0, 3).map((feat, i) => (
                  <div key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Action row */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-slate-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-slate-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Request Quote button */}
                <button
                  onClick={handleAdd}
                  disabled={!product.inStock}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-950 hover:bg-orange-600 text-white'
                  } disabled:bg-slate-200 disabled:text-slate-400`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Quote Requested!</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 text-orange-400" />
                      <span>Request Quote</span>
                    </>
                  )}
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className={`p-2.5 border rounded-lg transition cursor-pointer ${
                    isWishlisted
                      ? 'border-red-300 bg-red-50 text-red-500'
                      : 'border-slate-300 text-slate-600 hover:text-red-500'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500' : ''}`} />
                </button>
              </div>

              {/* View Full details link */}
              <button
                onClick={handleFullDetail}
                className="mt-3 text-xs text-center text-blue-600 hover:text-blue-800 font-semibold flex items-center justify-center gap-1 cursor-pointer py-1"
              >
                <span>View Full Technical Specifications & Warranty</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
