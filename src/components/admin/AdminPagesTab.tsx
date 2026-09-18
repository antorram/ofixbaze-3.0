import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Edit3, 
  Wand2, 
  Trash2, 
  Copy, 
  Eye, 
  ExternalLink,
  CheckCircle2, 
  Clock, 
  Layers,
  Sparkles,
  X
} from 'lucide-react';
import { CMSPage, ActivePage } from '../../types';

interface AdminPagesTabProps {
  pages: CMSPage[];
  onAddPage: (newPage: CMSPage) => void;
  onUpdatePage: (updatedPage: CMSPage) => void;
  onDeletePage: (pageId: string) => void;
  onDuplicatePage: (page: CMSPage) => void;
  onOpenPageBuilder: (pageId: string) => void;
  setActivePage: (page: ActivePage) => void;
}

export const AdminPagesTab: React.FC<AdminPagesTabProps> = ({
  pages,
  onAddPage,
  onUpdatePage,
  onDeletePage,
  onDuplicatePage,
  onOpenPageBuilder,
  setActivePage
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');
  const [newPageTemplate, setNewPageTemplate] = useState<'default' | 'full-width' | 'landing'>('default');

  const filteredPages = pages.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle.trim()) return;

    const slug = newPageSlug.trim() 
      ? newPageSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-')
      : newPageTitle.toLowerCase().replace(/[^a-z0-9-]/g, '-');

    const newPage: CMSPage = {
      id: `page-${Date.now()}`,
      title: newPageTitle.trim(),
      slug,
      status: 'draft',
      author: 'Super Admin',
      createdAt: 'Today',
      updatedAt: 'Just now',
      template: newPageTemplate,
      seoTitle: `${newPageTitle.trim()} | Ofixbaze Nigeria`,
      seoDescription: `${newPageTitle.trim()} corporate supplies and executive office furniture in Lagos Nigeria.`,
      sections: [
        {
          id: `sec-${Date.now()}`,
          name: 'Hero Section',
          enabled: true,
          settings: {
            layout: 'full-width',
            bgColor: '#0f172a',
            textColor: '#ffffff',
            paddingTop: 60,
            paddingBottom: 60
          },
          widgets: [
            {
              id: `w-${Date.now()}`,
              type: 'heading',
              title: 'Heading',
              content: {
                badge: 'NEW SECTION',
                text: newPageTitle.trim(),
                subtext: 'Craft this page visually using our Elementor-style Visual Page Builder.'
              },
              settings: {
                textAlign: 'center',
                textColor: '#ffffff'
              }
            }
          ]
        }
      ]
    };

    onAddPage(newPage);
    setIsAddModalOpen(false);
    setNewPageTitle('');
    setNewPageSlug('');
    onOpenPageBuilder(newPage.id);
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-white">Pages CMS & Visual Layouts</h2>
              <span className="text-[10px] bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold px-2 py-0.5 rounded-full">
                {pages.length} Pages
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Create, visually arrange, and publish dynamic pages using Elementor-style builder
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-md shadow-orange-950 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Page</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by page title or slug..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-0.5 rounded-lg">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-md font-semibold cursor-pointer transition ${
                statusFilter === 'all' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({pages.length})
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1.5 rounded-md font-semibold cursor-pointer transition ${
                statusFilter === 'published' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Published ({pages.filter(p => p.status === 'published').length})
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1.5 rounded-md font-semibold cursor-pointer transition ${
                statusFilter === 'draft' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Drafts ({pages.filter(p => p.status === 'draft').length})
            </button>
          </div>
        </div>
      </div>

      {/* Pages Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden text-xs">
        <table className="w-full text-left">
          <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
            <tr>
              <th className="p-3.5">Title</th>
              <th className="p-3.5">Slug</th>
              <th className="p-3.5">Template</th>
              <th className="p-3.5">Sections</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Last Updated</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredPages.map((page) => (
              <tr key={page.id} className="hover:bg-slate-800/40 transition group">
                <td className="p-3.5">
                  <div className="flex flex-col">
                    <span className="font-bold text-white text-sm group-hover:text-orange-400 transition">
                      {page.title}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      By {page.author} • {page.seoTitle ? 'SEO Configured' : 'Default SEO'}
                    </span>
                  </div>
                </td>
                <td className="p-3.5 font-mono text-slate-300">
                  <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    /{page.slug}
                  </span>
                </td>
                <td className="p-3.5 capitalize text-slate-300">
                  {page.template}
                </td>
                <td className="p-3.5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-300 bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800">
                    <Layers className="w-3 h-3 text-orange-400" />
                    {page.sections.length} sections
                  </span>
                </td>
                <td className="p-3.5">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    page.status === 'published'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}>
                    {page.status === 'published' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    <span className="capitalize">{page.status}</span>
                  </span>
                </td>
                <td className="p-3.5 text-slate-400 text-[11px]">
                  {page.updatedAt}
                </td>
                <td className="p-3.5 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    {/* Visual Page Builder Button */}
                    <button
                      onClick={() => onOpenPageBuilder(page.id)}
                      className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg transition cursor-pointer shadow flex items-center gap-1.5 text-xs active:scale-95"
                      title="Open in Visual Page Builder"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>Edit Builder</span>
                    </button>

                    <button
                      onClick={() => onDuplicatePage(page)}
                      className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition cursor-pointer"
                      title="Duplicate Page"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {page.slug !== 'home' && (
                      <button
                        onClick={() => onDeletePage(page.id)}
                        className="p-1.5 text-rose-400 hover:text-rose-300 rounded hover:bg-rose-500/10 transition cursor-pointer"
                        title="Delete Page"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Page Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-600/20 text-orange-400 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-white">Create New Website Page</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePage} className="space-y-3.5">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Page Title *</label>
                <input
                  type="text"
                  required
                  value={newPageTitle}
                  onChange={(e) => {
                    setNewPageTitle(e.target.value);
                    if (!newPageSlug) {
                      setNewPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'));
                    }
                  }}
                  placeholder="e.g. Corporate Procurement Solutions"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Page URL Slug</label>
                <div className="flex items-center">
                  <span className="bg-slate-800 px-2.5 py-2 rounded-l-lg text-slate-400 font-mono text-[11px] border border-r-0 border-slate-800">/</span>
                  <input
                    type="text"
                    value={newPageSlug}
                    onChange={(e) => setNewPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                    placeholder="corporate-procurement"
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-r-lg text-white font-mono text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Page Template Layout</label>
                <select
                  value={newPageTemplate}
                  onChange={(e) => setNewPageTemplate(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="default">Default Header & Footer Template</option>
                  <option value="full-width">Full-Width Canvas (No Sidebar)</option>
                  <option value="landing">Dedicated Landing Page (Minimalist Header)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-orange-950"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Create & Launch Builder</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
