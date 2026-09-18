import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Upload, 
  X, 
  Search, 
  Check, 
  FileText, 
  Film,
  Plus
} from 'lucide-react';
import { CMSMediaItem } from '../../types';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string, altText?: string) => void;
  mediaItems: CMSMediaItem[];
  onUploadMedia: (item: CMSMediaItem) => void;
  title?: string;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  mediaItems,
  onUploadMedia,
  title = 'Select Media Asset'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<CMSMediaItem | null>(null);
  const [customUrl, setCustomUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'library' | 'upload' | 'url'>('library');

  if (!isOpen) return null;

  const filteredMedia = mediaItems.filter(item => 
    item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.altText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const newItem: CMSMediaItem = {
        id: `media-${Date.now()}`,
        url: dataUrl,
        filename: file.name,
        fileSize: `${(file.size / 1024).toFixed(1)} KB`,
        fileType: file.type.startsWith('image/') ? 'image' : 'document',
        uploadedAt: 'Just now',
        altText: file.name.replace(/\.[^/.]+$/, '')
      };
      onUploadMedia(newItem);
      setSelectedItem(newItem);
      setActiveTab('library');
    };
    reader.readAsDataURL(file);
  };

  const handleConfirm = () => {
    if (activeTab === 'url' && customUrl.trim()) {
      onSelectImage(customUrl.trim());
      onClose();
    } else if (selectedItem) {
      onSelectImage(selectedItem.url, selectedItem.altText);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] text-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-600/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">{title}</h3>
              <p className="text-[11px] text-slate-400">Choose from Media Library, upload new image, or provide direct URL</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-4 pt-3 border-b border-slate-800 bg-slate-950/50 text-xs">
          <button
            onClick={() => setActiveTab('library')}
            className={`px-3.5 py-2 font-semibold border-b-2 cursor-pointer transition ${
              activeTab === 'library'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Media Library ({mediaItems.length})
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3.5 py-2 font-semibold border-b-2 cursor-pointer transition ${
              activeTab === 'upload'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Upload File
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={`px-3.5 py-2 font-semibold border-b-2 cursor-pointer transition ${
              activeTab === 'url'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            External Image URL
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'library' && (
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative max-w-sm">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search assets by filename or alt text..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Grid of Items */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {filteredMedia.map((item) => {
                  const isSelected = selectedItem?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`group relative rounded-xl border p-1.5 cursor-pointer transition flex flex-col bg-slate-950 ${
                        isSelected
                          ? 'border-orange-500 ring-2 ring-orange-500/50'
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="w-full aspect-square bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center relative">
                        {item.fileType === 'image' ? (
                          <img
                            src={item.url}
                            alt={item.altText}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <FileText className="w-8 h-8 text-slate-600" />
                        )}

                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-md">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] font-medium text-slate-300 truncate mt-1.5 px-0.5">
                        {item.filename}
                      </p>
                      <span className="text-[9px] text-slate-500 px-0.5">{item.fileSize}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="p-8 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-950/40 text-center">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-white mb-1">Drag and drop images here</h4>
              <p className="text-xs text-slate-400 mb-4">Supports PNG, JPG, WEBP, SVG up to 10MB</p>
              <label className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-md transition inline-flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>Browse Local Computer</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {activeTab === 'url' && (
            <div className="max-w-xl mx-auto py-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Direct Image Web Address (URL)</label>
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              {customUrl && (
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-semibold block mb-2">Live Image Preview:</span>
                  <div className="max-h-48 flex items-center justify-center bg-slate-900 rounded-lg overflow-hidden p-2">
                    <img
                      src={customUrl}
                      alt="Preview"
                      className="max-h-44 object-contain rounded"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/400x300?text=Invalid+Image+URL';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs">
          <div className="text-slate-400">
            {selectedItem ? (
              <span>Selected: <strong className="text-white">{selectedItem.filename}</strong> ({selectedItem.dimensions || selectedItem.fileSize})</span>
            ) : (
              <span>No image selected</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={activeTab === 'url' ? !customUrl.trim() : !selectedItem}
              className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-orange-950"
            >
              <Check className="w-4 h-4" />
              <span>Use Selected Image</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
