import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Building, 
  CheckCircle, 
  FileText, 
  ArrowLeft, 
  Printer, 
  Download,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { CartItem, Currency, ActivePage, Order } from '../types';

interface CheckoutPageProps {
  items: CartItem[];
  currency: Currency;
  onClearCart: () => void;
  setActivePage: (page: ActivePage) => void;
  onAddOrder?: (order: Order) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  items,
  currency,
  onClearCart,
  setActivePage,
  onAddOrder
}) => {
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Lagos Island',
    state: 'Lagos State',
    country: 'Nigeria',
    deliveryNotes: '',
    paymentMethod: 'transfer' // transfer | card | pos | po
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState<any | null>(null);

  const totalQuantity = items.reduce((acc, i) => acc + i.quantity, 0);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const orderId = `OFX-${Math.floor(10000 + Math.random() * 90000)}`;
      const trackingCode = `TRK-NG-${Math.floor(1000000 + Math.random() * 9000000)}`;
      const subtotal = items.reduce((sum, i) => sum + i.product.priceNGN * i.quantity, 0);
      const discount = subtotal > 500000 ? Math.round(subtotal * 0.05) : 0;
      const shipping = subtotal > 300000 ? 0 : 5000;
      const grandTotal = subtotal - discount + shipping;

      const newOrder: Order = {
        id: orderId,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        customer: {
          fullName: formData.fullName,
          companyName: formData.companyName || undefined,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country
        },
        items: items.map(i => ({
          productId: i.product.id,
          productName: i.product.name,
          quantity: i.quantity,
          price: i.product.priceNGN,
          image: i.product.image
        })),
        subtotal,
        discount,
        shipping,
        total: grandTotal,
        currency: currency,
        status: 'Processing',
        paymentMethod: formData.paymentMethod,
        trackingNumber: trackingCode
      };

      const orderReceipt = {
        id: orderId,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        items: [...items],
        totalUnits: totalQuantity,
        customer: { ...formData },
        paymentMethod: formData.paymentMethod,
        trackingNumber: trackingCode
      };

      if (onAddOrder) {
        onAddOrder(newOrder);
      }

      setOrderPlaced(orderReceipt);
      setIsSubmitting(false);
      onClearCart();
    }, 1200);
  };

  // If order was placed, show confirmation receipt
  if (orderPlaced) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xl">
          <div className="text-center pb-8 border-b border-slate-200">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
              <CheckCircle className="w-9 h-9" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Quotation Request Confirmed
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Thank You for Your RFQ Request!
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              RFQ Reference: <strong className="text-slate-900 font-mono text-sm">{orderPlaced.id}</strong> | Tracking Number: <strong className="text-blue-600 font-mono text-sm">{orderPlaced.trackingNumber}</strong>
            </p>
          </div>

          <div className="py-6 border-b border-slate-200 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-50">
                <h4 className="font-bold text-slate-900 mb-1">Customer & Delivery:</h4>
                <p className="text-slate-700">{orderPlaced.customer.fullName}</p>
                {orderPlaced.customer.companyName && (
                  <p className="text-slate-600 font-medium">Co: {orderPlaced.customer.companyName}</p>
                )}
                <p className="text-slate-500 mt-1">{orderPlaced.customer.address}</p>
                <p className="text-slate-500">{orderPlaced.customer.city}, {orderPlaced.customer.state}</p>
                <p className="text-slate-500">{orderPlaced.customer.phone} • {orderPlaced.customer.email}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50">
                <h4 className="font-bold text-slate-900 mb-1">Quotation & Dispatch:</h4>
                <p className="text-slate-700">
                  Terms: <strong className="capitalize">{orderPlaced.paymentMethod === 'transfer' ? 'Corporate Bank Transfer' : orderPlaced.paymentMethod}</strong>
                </p>
                <p className="text-slate-500 mt-1">Status: <span className="text-orange-600 font-bold">Proforma Invoice in Preparation</span></p>
                <p className="text-slate-500">Warehouse: 22 Bamgbose St, Lagos Island Hub</p>
                <p className="text-slate-500">Warranty: 100% Genuine HP OEM Guaranteed</p>
              </div>
            </div>

            {/* Bank details if Transfer */}
            {orderPlaced.paymentMethod === 'transfer' && (
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <h5 className="font-bold text-blue-900 mb-1">Ofixbaze Official Bank Account for Transfer:</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-blue-950 font-mono">
                  <div>Bank: <strong>Guaranty Trust Bank (GTBank)</strong></div>
                  <div>Account Name: <strong>Ofixbaze Nigeria Limited</strong></div>
                  <div>Account Number: <strong>0459823104</strong></div>
                  <div>Reference: <strong>{orderPlaced.id}</strong></div>
                </div>
              </div>
            )}
          </div>

          {/* Items Summary Table */}
          <div className="py-6 border-b border-slate-200">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Requested Items for Quotation
            </h4>
            <div className="divide-y divide-slate-100 text-xs">
              {orderPlaced.items.map((item: any) => (
                <div key={item.product.id} className="py-2.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={item.product.image} alt="" className="w-10 h-10 object-contain rounded p-1 bg-slate-50" />
                    <div>
                      <p className="font-semibold text-slate-900">{item.product.name}</p>
                      <p className="text-slate-400 text-[10px]">Qty: {item.quantity} Units • SKU: {item.product.sku}</p>
                    </div>
                  </div>
                  <span className="font-bold text-orange-600 text-xs bg-orange-50 px-2 py-1 rounded border border-orange-100">
                    Quote in Progress
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-xs text-right">
              <div className="text-slate-500">Total Units: {orderPlaced.totalUnits} Items</div>
              <div className="text-slate-500">Document: Official Corporate Proforma Invoice</div>
              <div className="text-base font-black text-slate-900 pt-1">
                Pricing: Official Proforma Quote Delivered by Email
              </div>
            </div>
          </div>

          {/* WhatsApp Direct Dispatch Sync */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs space-y-0.5">
              <span className="font-bold text-emerald-950">Fast Corporate Dispatch Verification:</span>
              <p className="text-emerald-800 text-[11px]">Send this order summary directly to our Lagos delivery desk on WhatsApp for instant confirmation.</p>
            </div>
            <a
              href={`https://wa.me/2348020923522?text=${encodeURIComponent(
                `Hello Ofixbaze,\nI have placed an order (${orderPlaced.id}):\nCustomer: ${orderPlaced.customer.fullName} (${orderPlaced.customer.companyName || 'Corporate Client'})\nTotal Units: ${orderPlaced.totalUnits}\nPayment: ${orderPlaced.paymentMethod}\nAddress: ${orderPlaced.customer.address}, ${orderPlaced.customer.city}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs shrink-0 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Confirm on WhatsApp (0802-092-3522)</span>
            </a>
          </div>

          {/* Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => setActivePage('track-order')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
            >
              Track This Order
            </button>
            <button
              onClick={() => {
                try {
                  if (typeof window !== 'undefined' && window.print) {
                    window.print();
                  }
                } catch (e) {
                  console.warn('Print not supported in current environment', e);
                }
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Tax Invoice</span>
            </button>
            <button
              onClick={() => setActivePage('home')}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty
  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="p-8 bg-white rounded-2xl border border-slate-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Truck className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Your cart is empty</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Please add your required HP toners, copiers, paper shredders, or office furniture to your cart before proceeding to checkout.
          </p>
          <button
            onClick={() => setActivePage('shop')}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-4 sm:py-6">
      <button
        onClick={() => setActivePage('shop')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Continue Shopping</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Column (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
          <h1 className="text-xl font-black text-slate-900 mb-6">
            Complete Your Corporate Order
          </h1>

          <form onSubmit={handleSubmitOrder} className="space-y-6 text-xs">
            
            {/* Step 1: Customer Contact Info */}
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
                <span>Contact & Organization</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tunde Balogun"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Company / Organization (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. First Bank Nigeria Ltd"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Corporate Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Phone Number (Calls & WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+234 803 000 0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Delivery Address */}
            <div className="pt-4 border-t border-slate-100">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">2</span>
                <span>Delivery Address (Lagos or Nationwide)</span>
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Office / Street Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 15 Marina Road, 4th Floor"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">City / Area *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lagos Island / Ikeja"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">State *</label>
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 bg-white"
                    >
                      <option value="Lagos State">Lagos State</option>
                      <option value="Abuja FCT">Abuja (FCT)</option>
                      <option value="Rivers (Port Harcourt)">Rivers (Port Harcourt)</option>
                      <option value="Ogun State">Ogun State</option>
                      <option value="Oyo State (Ibadan)">Oyo State (Ibadan)</option>
                      <option value="Kano State">Kano State</option>
                      <option value="Delta State">Delta State</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Country</label>
                    <input
                      type="text"
                      disabled
                      value={formData.country}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-500 bg-slate-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Delivery Instructions (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Deliver to Security Reception / Attention to IT Department"
                    value={formData.deliveryNotes}
                    onChange={(e) => setFormData({ ...formData, deliveryNotes: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="pt-4 border-t border-slate-100">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">3</span>
                <span>Select Payment Method</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                  formData.paymentMethod === 'transfer' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="transfer"
                    checked={formData.paymentMethod === 'transfer'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'transfer' })}
                    className="mt-0.5 text-blue-600"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">Direct Bank Transfer</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      GTBank / Zenith Bank account. Ideal for corporate accounts.
                    </span>
                  </div>
                </label>

                <label className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                  formData.paymentMethod === 'card' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'card' })}
                    className="mt-0.5 text-blue-600"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">Online Debit Card</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Paystack / Interswitch Mastercard, Visa, Verve.
                    </span>
                  </div>
                </label>

                <label className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                  formData.paymentMethod === 'pos' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="pos"
                    checked={formData.paymentMethod === 'pos'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'pos' })}
                    className="mt-0.5 text-blue-600"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">POS on Delivery</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Available for Lagos Island & Mainland locations.
                    </span>
                  </div>
                </label>

                <label className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                  formData.paymentMethod === 'po' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="po"
                    checked={formData.paymentMethod === 'po'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'po' })}
                    className="mt-0.5 text-blue-600"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">Corporate PO (Net 30)</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      For registered institutional & enterprise clients.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-slate-950 hover:bg-orange-600 text-white rounded-xl text-sm font-bold shadow-md shadow-slate-900/10 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processing Your RFQ Request...</span>
                ) : (
                  <>
                    <FileText className="w-4 h-4 text-orange-400" />
                    <span>Submit Corporate RFQ Request</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary Sidebar (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>Quotation Basket ({totalQuantity} Items)</span>
              <span className="text-[11px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                Official RFQ
              </span>
            </h3>

            {/* Item List */}
            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="py-3 flex items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-contain rounded border border-slate-100 p-1 bg-slate-50 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Qty: {quantity} • SKU: {product.sku}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100 shrink-0">
                    Price on RFQ
                  </span>
                </div>
              ))}
            </div>

            {/* Terms and Summary */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Total Units for Quote</span>
                <span className="font-semibold text-slate-900">{totalQuantity} Units</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Quotation Document</span>
                <span className="font-semibold text-slate-900">Official Proforma Invoice</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Dispatch & Logistics</span>
                <span className="font-semibold text-emerald-600">Lagos & Nationwide</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-slate-200 text-slate-950">
                <span className="text-sm font-bold">Estimated Cost</span>
                <span className="text-sm font-bold text-orange-600">
                  Custom Corporate Pricing
                </span>
              </div>
            </div>
          </div>

          {/* Genuine Guarantee Box */}
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-3 text-xs text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-emerald-950">100% Genuine OEM Assurance</h4>
              <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                All cartridges and machines come factory-sealed with official manufacturer security labels and full replacement warranty.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
