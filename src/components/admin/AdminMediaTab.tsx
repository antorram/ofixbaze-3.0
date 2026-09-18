import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Upload, 
  Trash2, 
  Search, 
  Copy, 
  Check, 
  FileText, 
  Grid, 
  List, 
  Download, 
  ExternalLink,
  Plus,
  Info,
  Sparkles,
  X
} from 'lucide-react';
import { CMSMediaItem } from '../../types';

interface AdminMediaTabProps {
  mediaItems: CMSMediaItem[];
  onUploadMedia: (item: CMSMediaItem) => void;
  onDeleteMedia: (id: string) => void;
  onUpdateMediaAlt: (id: string, altText: string) => void;
}

export const AdminMediaTab: React.FC<AdminMediaTabProps> = ({
  mediaItems,
  onUploadMedia,
  onDeleteMedia,
  onUpdateMediaAlt
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'document'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<CMSMediaItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const filteredMedia = mediaItems.filter(item => {
    const matchesSearch = item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.altText.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || item.fileType === filterType;
    return matchesSearch && matchesType;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const newItem: CMSMediaItem = {
          id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          url: dataUrl,
          filename: file.name,
          fileSize: `${(file.size / 1024).toFixed(1)} KB`,
          fileType: file.type.startsWith('image/') ? 'image' : 'document',
          uploadedAt: 'Today',
          altText: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
        };
        onUploadMedia(newItem);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard?.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header / Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-white">Media Library CMS</h2>
              <span className="text-[10px] bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold px-2 py-0.5 rounded-full">
                {mediaItems.length} Assets
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Manage product photography, executive banners, brand logos and PDF catalogs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-md shadow-orange-950 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            <span>Upload New Media</span>
            <input
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search filename or alt text..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-0.5 rounded-lg">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-md font-semibold cursor-pointer transition ${
                filterType === 'all' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('image')}
              className={`px-3 py-1.5 rounded-md font-semibold cursor-pointer transition ${
                filterType === 'image' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Images
            </button>
            <button
              onClick={() => setFilterType('document')}
              className={`px-3 py-1.5 rounded-md font-semibold cursor-pointer transition ${
                filterType === 'document' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Docs
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded cursor-pointer transition ${
                viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded cursor-pointer transition ${
                viewMode === 'list' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={`group bg-slate-900 rounded-xl border transition cursor-pointer flex flex-col overflow-hidden ${
                selectedItem?.id === item.id
                  ? 'border-orange-500 ring-2 ring-orange-500/40'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="w-full aspect-square bg-slate-950 flex items-center justify-center relative overflow-hidden">
                {item.fileType === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.altText}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <FileText className="w-10 h-10 text-slate-500" />
                )}

                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 p-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyUrl(item.url, item.id);
                    }}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white shadow transition cursor-pointer"
                    title="Copy URL"
                  >
                    {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteMedia(item.id);
                    }}
                    className="p-2 bg-rose-600/80 hover:bg-rose-600 rounded-lg text-white shadow transition cursor-pointer"
                    title="Delete Media"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-2.5 flex flex-col justify-between flex-1 text-[11px]">
                <p className="font-semibold text-slate-200 truncate" title={item.filename}>
                  {item.filename}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                  <span>{item.fileSize}</span>
                  <span>{item.uploadedAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Preview</th>
                <th className="p-3">File Name</th>
                <th className="p-3">Alt Text</th>
                <th className="p-3">Size</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredMedia.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="hover:bg-slate-800/50 cursor-pointer transition"
                >
                  <td className="p-3 w-16">
                    <div className="w-10 h-10 rounded-lg bg-slate-950 overflow-hidden flex items-center justify-center">
                      {item.fileType === 'image' ? (
                        <img src={item.url} alt={item.altText} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <FileText className="w-5 h-5 text-slate-500" />
                      )}
                    </div>
                  </td>
                  <td className="p-3 font-semibold text-white">{item.filename}</td>
                  <td className="p-3 text-slate-400">{item.altText}</td>
                  <td className="p-3 text-slate-500">{item.fileSize}</td>
                  <td className="p-3 text-slate-500">{item.uploadedAt}</td>
                  <td className="p-3 text-right">
                    <div className="inline-flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleCopyUrl(item.url, item.id)}
                        className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                        title="Copy Link"
                      >
                        {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => onDeleteMedia(item.id)}
                        className="p-1.5 text-rose-400 hover:text-rose-300 rounded hover:bg-rose-500/10"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Item Details Drawer Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white">Attachment Details</h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-3 rounded-xl flex items-center justify-center max-h-64 overflow-hidden border border-slate-800">
                {selectedItem.fileType === 'image' ? (
                  <img src={selectedItem.url} alt={selectedItem.altText} className="max-h-56 object-contain rounded" referrerPolicy="no-referrer" />
                ) : (
                  <FileText className="w-16 h-16 text-slate-600" />
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">File Name</label>
                  <p className="font-mono text-white bg-slate-950 p-2 rounded-lg border border-slate-800 truncate">{selectedItem.filename}</p>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">File URL</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      readOnly
                      value={selectedItem.url}
                      className="flex-1 bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded-lg text-slate-300 font-mono text-[11px]"
                    />
                    <button
                      onClick={() => handleCopyUrl(selectedItem.url, selectedItem.id)}
                      className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-bold flex items-center gap-1"
                    >
                      {copiedId === selectedItem.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Alt Text (For SEO & Accessibility)</label>
                  <input
                    type="text"
                    value={selectedItem.altText}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedItem({ ...selectedItem, altText: val });
                      onUpdateMediaAlt(selectedItem.id, val);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="flex items-center justify-between text-slate-400 pt-2 border-t border-slate-800 text-[11px]">
                  <span>Size: {selectedItem.fileSize}</span>
                  <span>Uploaded: {selectedItem.uploadedAt}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  onDeleteMedia(selectedItem.id);
                  setSelectedItem(null);
                }}
                className="px-4 py-2 bg-rose-600/20 text-rose-400 border border-rose-500/30 hover:bg-rose-600 hover:text-white rounded-lg font-semibold transition cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Permanently</span>
              </button>
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
