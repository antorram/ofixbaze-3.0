import React, { useState } from 'react';
import { 
  Award, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  ShieldCheck, 
  Check, 
  X,
  Image as ImageIcon
} from 'lucide-react';
import { CMSBrand, CMSMediaItem } from '../../types';
import { MediaPickerModal } from './MediaPickerModal';

interface AdminBrandsTabProps {
  brands: CMSBrand[];
  onAddBrand: (brand: CMSBrand) => void;
  onUpdateBrand: (brand: CMSBrand) => void;
  onDeleteBrand: (brandId: string) => void;
  mediaItems: CMSMediaItem[];
  onUploadMedia: (item: CMSMediaItem) => void;
}

export const AdminBrandsTab: React.FC<AdminBrandsTabProps> = ({
  brands,
  onAddBrand,
  onUpdateBrand,
  onDeleteBrand,
  mediaItems,
  onUploadMedia
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<CMSBrand | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [logo, setLogo] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [isAuthorizedDealer, setIsAuthorizedDealer] = useState(true);

  const filteredBrands = brands.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingBrand(null);
    setName('');
    setLogo('');
    setDescription('');
    setWebsite('');
    setIsAuthorizedDealer(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (brand: CMSBrand) => {
    setEditingBrand(brand);
    setName(brand.name);
    setLogo(brand.logo);
    setDescription(brand.description);
    setWebsite(brand.website || '');
    setIsAuthorizedDealer(brand.isAuthorizedDealer);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingBrand) {
      onUpdateBrand({
        ...editingBrand,
        name: name.trim(),
        logo: logo.trim() || 'https://placehold.co/120x60?text=' + encodeURIComponent(name),
        description: description.trim(),
        website: website.trim() || undefined,
        isAuthorizedDealer
      });
    } else {
      const newBrand: CMSBrand = {
        id: `brand-${Date.now()}`,
        name: name.trim(),
        slug: name.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        logo: logo.trim() || 'https://placehold.co/120x60?text=' + encodeURIComponent(name),
        description: description.trim(),
        website: website.trim() || undefined,
        isFeatured: false,
        isAuthorizedDealer,
        productCount: 0
      };
      onAddBrand(newBrand);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-white">Partner OEM Brands CMS</h2>
              <span className="text-[10px] bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold px-2 py-0.5 rounded-full">
                {brands.length} Brands
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Manage certified manufacturers, authorized dealer badges, and manufacturer warranties
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-md shadow-orange-950 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Brand</span>
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="flex items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search manufacturer brand..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Brands Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBrands.map((brand) => (
          <div
            key={brand.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col justify-between transition group shadow-sm"
          >
            <div>
              <div className="h-16 bg-slate-950 rounded-xl p-3 flex items-center justify-center border border-slate-800/80 mb-3 overflow-hidden">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-h-10 max-w-[120px] object-contain"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/120x60?text=' + encodeURIComponent(brand.name);
                  }}
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-white text-sm group-hover:text-orange-400 transition">{brand.name}</h3>
                {brand.isAuthorizedDealer && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Authorized</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                {brand.description}
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">
                {brand.productCount ?? 0} Products
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(brand)}
                  className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition cursor-pointer"
                  title="Edit Brand"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteBrand(brand.id)}
                  className="p-1.5 text-rose-400 hover:text-rose-300 rounded hover:bg-rose-500/10 transition cursor-pointer"
                  title="Delete Brand"
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
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-600/20 text-orange-400 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-white">{editingBrand ? 'Edit Manufacturer Brand' : 'Add New Brand'}</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Brand Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Hewlett-Packard (HP)"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Brand Logo Image URL</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={logo}
                    onChange={(e) => setLogo(e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-[11px] focus:outline-none focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => setIsMediaPickerOpen(true)}
                    className="px-3 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg flex items-center gap-1"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Media</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Brand Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Official OEM manufacturer of LaserJet toners, commercial multifunction printers..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Official Website</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://www.hp.com"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <input
                    type="checkbox"
                    checked={isAuthorizedDealer}
                    onChange={(e) => setIsAuthorizedDealer(e.target.checked)}
                    className="w-4 h-4 accent-orange-600 rounded"
                  />
                  <span className="font-semibold text-slate-200">Certified Authorized Distributor / Partner</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-orange-950"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{editingBrand ? 'Save Changes' : 'Add Brand'}</span>
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
        onSelectImage={(url) => setLogo(url)}
        mediaItems={mediaItems}
        onUploadMedia={onUploadMedia}
        title="Select Brand Logo"
      />
    </div>
  );
};
