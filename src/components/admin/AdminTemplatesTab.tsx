import React, { useState } from 'react';
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Download, 
  Upload, 
  Eye, 
  Sparkles, 
  Layers, 
  X,
  Check
} from 'lucide-react';
import { CMSTemplate } from '../../types';
import { INITIAL_CMS_TEMPLATES } from '../../data/cmsInitialData';

interface AdminTemplatesTabProps {
  onInsertTemplate?: (template: CMSTemplate) => void;
  onOpenPageBuilder?: (pageId: string) => void;
}

export const AdminTemplatesTab: React.FC<AdminTemplatesTabProps> = ({
  onInsertTemplate,
  onOpenPageBuilder
}) => {
  const [templates, setTemplates] = useState<CMSTemplate[]>(INITIAL_CMS_TEMPLATES);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'hero' | 'ecommerce' | 'corporate' | 'testimonials'>('all');
  const [previewTemplate, setPreviewTemplate] = useState<CMSTemplate | null>(null);

  const filtered = templates.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const exportTemplateJson = (t: CMSTemplate) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(t, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `${t.id}-template.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-white">Elementor & Section Templates</h2>
              <span className="text-[10px] bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold px-2 py-0.5 rounded-full">
                {templates.length} Templates
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Reusable sections, full page layouts, and corporate conversion components
            </p>
          </div>
        </div>

        {onOpenPageBuilder && (
          <button
            onClick={() => onOpenPageBuilder('page-home')}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-md shadow-orange-950 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Open Page Builder</span>
          </button>
        )}
      </div>

      {/* Toolbar & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates by name..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-0.5 rounded-lg">
          {(['all', 'hero', 'ecommerce', 'corporate', 'testimonials'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setCategoryFilter(tab)}
              className={`px-3 py-1.5 rounded-md font-semibold cursor-pointer transition uppercase text-[10px] ${
                categoryFilter === tab ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(tpl => (
          <div
            key={tpl.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-slate-700 transition shadow-sm"
          >
            <div>
              <div className="aspect-video w-full bg-slate-950 overflow-hidden relative">
                <img
                  src={tpl.thumbnail}
                  alt={tpl.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2">
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-950/80 text-orange-400 px-2.5 py-1 rounded-full border border-slate-700 backdrop-blur-xs">
                    {tpl.type || tpl.category}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="font-bold text-sm text-white group-hover:text-orange-400 transition leading-snug">
                  {tpl.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {tpl.description}
                </p>
              </div>
            </div>

            <div className="p-4 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500 capitalize">{tpl.category}</span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPreviewTemplate(tpl)}
                  className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
                  title="Inspect Template"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => exportTemplateJson(tpl)}
                  className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
                  title="Export JSON"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white">{previewTemplate.title}</h3>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
              <img
                src={previewTemplate.thumbnail}
                alt={previewTemplate.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <p className="text-slate-300 leading-relaxed">{previewTemplate.description}</p>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => exportTemplateJson(previewTemplate)}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-bold flex items-center gap-1.5 shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Template JSON</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
