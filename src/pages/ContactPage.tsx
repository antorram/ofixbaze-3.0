import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageSquare,
  Building,
  ExternalLink
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'product_inquiry',
    message: ''
  });

  const [submittedData, setSubmittedData] = useState<{ id: string; name: string; message: string; phone: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inqId = `INQ-${Date.now().toString().slice(-6)}`;
    const inquiryRecord = {
      id: inqId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
      createdAt: new Date().toISOString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem('ofixbaze_customer_inquiries') || '[]');
      existing.unshift(inquiryRecord);
      localStorage.setItem('ofixbaze_customer_inquiries', JSON.stringify(existing.slice(0, 50)));
    } catch (err) {
      console.warn('Failed to save inquiry:', err);
    }

    setSubmittedData({
      id: inqId,
      name: formData.name,
      message: formData.message,
      phone: formData.phone
    });
    setSubmitted(true);
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6 sm:py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          Contact & Showroom
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
          Visit Our Lagos Showroom or Speak With Us
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Need stock availability checks, walk-in product pickups, or technical consultation on enterprise copiers and shredders? We are readily available.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Contact Info Details (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">
              Showroom & Warehouse Information
            </h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Physical Address</h3>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">
                    20/22, Bamgbose Street, Off Tinubu Square, Lagos Nigeria (New Address).
                  </p>
                  <span className="text-[11px] text-blue-600 font-semibold block mt-1">
                    (Heart of Lagos Commercial District, Off Tinubu Square)
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900">Direct Lines &amp; WhatsApp</h3>
                  <p className="text-slate-600 font-mono text-[11px]">
                    Call / SMS: <a href="tel:09069425822" className="text-blue-600 hover:underline">0906-942-5822</a>
                  </p>
                  <p className="text-slate-600 font-mono text-[11px]">
                    Customer Care: <a href="tel:08020923522" className="text-blue-600 hover:underline">0802-092-3522</a>
                  </p>
                  <p className="text-slate-600 font-mono text-[11px]">
                    Support Line: <a href="tel:08067655771" className="text-blue-600 hover:underline">0806-765-5771</a>
                  </p>
                  <div className="pt-1">
                    <a 
                      href="https://wa.me/2348020923522" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 transition"
                    >
                      <span>Chat on WhatsApp (0802-092-35-22)</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Email Desks</h3>
                  <p className="text-slate-600 mt-0.5">
                    Official Inquiries: <a href="mailto:info@ofixbaze.com" className="font-bold text-blue-600 hover:underline">info@ofixbaze.com</a>
                  </p>
                  <p className="text-slate-600">
                    Alternate Desk: <a href="mailto:ofixbaze@yahoo.com" className="font-bold text-blue-600 hover:underline">ofixbaze@yahoo.com</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Opening Hours</h3>
                  <p className="text-slate-600 mt-0.5">
                    Monday – Friday: 8:00 AM – 6:00 PM
                  </p>
                  <p className="text-slate-600">
                    Saturday: 9:00 AM – 4:00 PM (Closed Sundays)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Map Visual Box */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase text-blue-400">Lagos Island Location</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                Open for Walk-Ins
              </span>
            </div>
            <div className="h-44 bg-slate-800 rounded-xl overflow-hidden relative flex items-center justify-center border border-slate-700">
              <div className="text-center p-4">
                <MapPin className="w-8 h-8 text-red-500 mx-auto animate-bounce mb-1" />
                <p className="text-xs font-bold text-white">Ofixbaze Nigeria Ltd</p>
                <p className="text-[10px] text-slate-400">22 Bamgbose St, Lagos Island</p>
                <div className="mt-2 text-[10px] text-blue-300 underline">
                  Off Tinubu Square • Easy Access via Broad Street / Marina
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 pb-2 border-b border-slate-100">
            Send an Inquiry or Message
          </h2>

          {submitted ? (
            <div className="p-8 text-center space-y-4 animate-in fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold text-slate-400">
                  Reference: {submittedData?.id || 'INQ-REGISTERED'}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">Inquiry Dispatched Successfully</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Thank you, <strong className="text-slate-800">{submittedData?.name}</strong>. Your inquiry has been routed to our Lagos showroom technical & sales desk.
                </p>
              </div>

              {/* Instant WhatsApp forward option */}
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl max-w-md mx-auto text-left space-y-2.5">
                <p className="text-[11px] text-emerald-900 font-semibold">
                  Need a faster quote or stock confirmation?
                </p>
                <a
                  href={`https://wa.me/2348020923522?text=${encodeURIComponent(
                    `Hello Ofixbaze Lagos Desk,\nI submitted an inquiry (${submittedData?.id || ''}):\nName: ${submittedData?.name || ''}\nMessage: ${submittedData?.message || ''}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Forward Message to WhatsApp Desk (0802-092-3522)</span>
                </a>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      subject: 'product_inquiry',
                      message: ''
                    });
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  Send another inquiry or quote request
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samuel Okafor"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+234 803 000 0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Inquiry Purpose</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 bg-white"
                  >
                    <option value="product_inquiry">Product Price & Stock Availability</option>
                    <option value="corporate_rfq">Corporate Bulk Purchase & Quotation</option>
                    <option value="warranty_support">Warranty & Technical Maintenance</option>
                    <option value="showroom_visit">Schedule Lagos Showroom Visit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Your Message or Specification *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Detail the printer models, cartridge quantities, or delivery requirements you need..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-600/20 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message to Sales Desk</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
