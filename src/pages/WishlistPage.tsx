import React from 'react';
import { Heart, ShoppingCart, Trash2, ArrowRight, FileText } from 'lucide-react';
import { Product, Currency, ActivePage } from '../types';
import { PRODUCTS } from '../data/products';

interface WishlistPageProps {
  wishlistIds: string[];
  currency: Currency;
  onAddToCart: (product: Product, quantity?: number) => void;
  onRemoveFromWishlist: (productId: string) => void;
  onClearWishlist: () => void;
  onSelectProduct: (product: Product) => void;
  setActivePage: (page: ActivePage) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
  wishlistIds,
  currency,
  onAddToCart,
  onRemoveFromWishlist,
  onClearWishlist,
  onSelectProduct,
  setActivePage
}) => {
  const wishlistedProducts = PRODUCTS.filter(p => wishlistIds.includes(p.id));

  const handleAddAllToCart = () => {
    wishlistedProducts.forEach(p => onAddToCart(p, 1));
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            My Wishlist ({wishlistedProducts.length} Items)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Your saved office equipment and toners for future corporate orders.
          </p>
        </div>

        {wishlistedProducts.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleAddAllToCart}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add All to Cart</span>
            </button>
            <button
              onClick={onClearWishlist}
              className="px-3 py-2 text-slate-500 hover:text-red-500 text-xs font-medium transition cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Your wishlist is empty</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Click the heart icon on any toner, printer, or office equipment to save it here for later.
          </p>
          <button
            onClick={() => setActivePage('shop')}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {wishlistedProducts.map(product => (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="bg-white rounded-xl border border-slate-200 hover:border-blue-400 p-4 flex flex-col justify-between cursor-pointer transition shadow-xs group"
            >
              <div>
                <div className="aspect-square bg-slate-50 rounded-lg p-4 mb-3 flex items-center justify-center relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFromWishlist(product.id);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white text-slate-400 hover:text-red-500 shadow-sm"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <span className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                  {product.brand}
                </span>
                <h3 className="text-xs font-bold text-slate-900 mt-1 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  SKU: {product.sku}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-orange-600" />
                  <span>Price on Request</span>
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product, 1);
                  }}
                  className="px-3 py-1.5 bg-slate-950 hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3 h-3 text-orange-400" />
                  <span>Request Quote</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
