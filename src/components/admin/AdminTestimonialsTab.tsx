import React, { useState } from 'react';
import { 
  MessageSquareQuote, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Star, 
  Building2, 
  Check, 
  X,
  Image as ImageIcon
} from 'lucide-react';
import { CMSTestimonial, CMSMediaItem } from '../../types';
import { MediaPickerModal } from './MediaPickerModal';

interface AdminTestimonialsTabProps {
  testimonials: CMSTestimonial[];
  onAddTestimonial: (t: CMSTestimonial) => void;
  onUpdateTestimonial: (t: CMSTestimonial) => void;
  onDeleteTestimonial: (id: string) => void;
  mediaItems: CMSMediaItem[];
  onUploadMedia: (item: CMSMediaItem) => void;
}

export const AdminTestimonialsTab: React.FC<AdminTestimonialsTabProps> = ({
  testimonials,
  onAddTestimonial,
  onUpdateTestimonial,
  onDeleteTestimonial,
  mediaItems,
  onUploadMedia
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CMSTestimonial | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  // Form
  const [clientName, setClientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [quote, setQuote] = useState('');
  const [rating, setRating] = useState(5);
  const [avatar, setAvatar] = useState('');
  const [isVerified, setIsVerified] = useState(true);

  const filtered = testimonials.filter(t => {
    const name = t.clientName || t.name || '';
    const company = t.companyName || t.company || '';
    const text = t.quote || t.content || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      text.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setClientName('');
    setCompanyName('');
    setRole('Procurement Manager');
    setQuote('');
    setRating(5);
    setAvatar('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200');
    setIsVerified(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: CMSTestimonial) => {
    setEditingItem(t);
    setClientName(t.clientName || t.name || '');
    setCompanyName(t.companyName || t.company || '');
    setRole(t.role);
    setQuote(t.quote || t.content || '');
    setRating(t.rating);
    setAvatar(t.avatar);
    setIsVerified(t.isVerified ?? true);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !quote.trim()) return;

    if (editingItem) {
      onUpdateTestimonial({
        ...editingItem,
        clientName: clientName.trim(),
        name: clientName.trim(),
        companyName: companyName.trim(),
        company: companyName.trim(),
        role: role.trim(),
        quote: quote.trim(),
        content: quote.trim(),
        rating,
        avatar: avatar.trim(),
        isVerified
      });
    } else {
      const newItem: CMSTestimonial = {
        id: `test-${Date.now()}`,
        clientName: clientName.trim(),
        name: clientName.trim(),
        companyName: companyName.trim(),
        company: companyName.trim(),
        role: role.trim(),
        quote: quote.trim(),
        content: quote.trim(),
        rating,
        avatar: avatar.trim() || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        isVerified
      };
      onAddTestimonial(newItem);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
            <MessageSquareQuote className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-white">Client Testimonials & Endorsements</h2>
              <span className="text-[10px] bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold px-2 py-0.5 rounded-full">
                {testimonials.length} Endorsements
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Manage executive client quotes, corporate trust proof, and verified buyer reviews
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-md shadow-orange-950 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search testimonials by company, name, quote..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(item => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < item.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                      }`}
                    />
                  ))}
                </div>
                {item.isVerified && (
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                    Verified Corporate Buyer
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 italic leading-relaxed">
                "{item.quote || item.content}"
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={item.avatar}
                  alt={item.clientName || item.name || 'Client'}
                  className="w-9 h-9 rounded-full object-cover border border-slate-700"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-bold text-xs text-white leading-tight">{item.clientName || item.name}</h4>
                  <span className="text-[11px] text-slate-400 block">{item.role}, {item.companyName || item.company}</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
                  title="Edit"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteTestimonial(item.id)}
                  className="p-1.5 text-rose-400 hover:text-rose-300 rounded hover:bg-rose-500/10 transition"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white">
                {editingItem ? 'Edit Testimonial' : 'Add Client Testimonial'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Client Full Name *</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Adebayo Ogunlesi"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Company *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Access Bank PLC"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Job Title</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Procurement Director"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Avatar Image</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-[11px]"
                  />
                  <button
                    type="button"
                    onClick={() => setIsMediaPickerOpen(true)}
                    className="px-3 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-bold flex items-center gap-1"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Media</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Client Quote / Review *</label>
                <textarea
                  rows={3}
                  required
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="Their endorsement of Ofixbaze supplies..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ 5 Stars (Exceptional)</option>
                  <option value={4}>⭐⭐⭐⭐ 4 Stars (Very Good)</option>
                  <option value={3}>⭐⭐⭐ 3 Stars (Average)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-bold shadow"
                >
                  Save Endorsement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Picker */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelectImage={(url) => setAvatar(url)}
        mediaItems={mediaItems}
        onUploadMedia={onUploadMedia}
        title="Select Client Headshot"
      />
    </div>
  );
};
