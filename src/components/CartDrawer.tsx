import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Plus, Minus, FileText, ShoppingCart } from 'lucide-react';
import { CartItem, Currency, ActivePage } from '../types';
import { formatPrice } from '../utils/currency';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: Currency;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  setActivePage: (page: ActivePage) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  setActivePage
}) => {
  if (!isOpen) return null;

  const totalQuantity = items.reduce((acc, i) => acc + i.quantity, 0);
  const subtotalNGN = items.reduce((acc, i) => acc + (i.product.priceNGN * i.quantity), 0);

  const handleCheckoutClick = () => {
    onClose();
    setActivePage('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-600" />
              <h2 className="text-base font-bold text-slate-900">
                Quote Request Basket ({totalQuantity})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition cursor-pointer"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Corporate Quotation Banner */}
          <div className="px-4 py-2.5 bg-orange-50/80 border-b border-orange-100 text-xs text-orange-950 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">
              Official Corporate Quotation • 100% Genuine OEM Warranty
            </span>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <FileText className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-sm font-bold text-slate-700">Your quote basket is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  Browse our executive tables, genuine HP toners, printers and office equipment to request an official quote.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    setActivePage('shop');
                  }}
                  className="mt-2 px-4 py-2 bg-slate-950 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition cursor-pointer"
                >
                  Explore Products
                </button>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div key={product.id} className="py-3.5 flex gap-3.5 items-start">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-contain rounded-md border border-slate-100 p-1 bg-slate-50 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-blue-600">
                          {product.brand}
                        </span>
                        <h4 className="text-xs font-semibold text-slate-900 line-clamp-2 leading-snug">
                          {product.name}
                        </h4>
                      </div>
                      <button
                        onClick={() => onRemoveItem(product.id)}
                        className="text-slate-400 hover:text-red-500 p-1 transition cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2.5">
                      {/* Quantity Controller */}
                      <div className="flex items-center border border-slate-200 rounded-md bg-white">
                        <button
                          onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                          disabled={quantity <= 1}
                          className="px-2 py-0.5 text-slate-500 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-800 select-none">
                          {quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                          className="px-2 py-0.5 text-slate-500 hover:text-slate-800 cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Item Price */}
                      <div className="text-right">
                        <span className="text-xs font-black text-slate-900">
                          {formatPrice(product.priceNGN * quantity, currency)}
                        </span>
                        {quantity > 1 && (
                          <div className="text-[10px] text-slate-400">
                            {formatPrice(product.priceNGN, currency)} each
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {items.length > 0 && (
            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {formatPrice(subtotalNGN, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Delivery in Lagos</span>
                  <span className="font-medium text-emerald-700">
                    {subtotalNGN >= 300000 ? 'FREE' : 'Calculated at Checkout'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Authenticity Guarantee</span>
                  <span className="text-emerald-600 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> 100% Genuine OEM
                  </span>
                </div>
              </div>

              <button
                id="cart-checkout-button"
                onClick={handleCheckoutClick}
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-bold shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 transition cursor-pointer active:scale-[0.99]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  setActivePage('rfq');
                }}
                className="w-full py-2 text-xs text-slate-700 hover:text-orange-700 hover:bg-white rounded-md font-semibold transition border border-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-orange-600" />
                <span>Need Corporate Proforma Tender? Request RFQ</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
