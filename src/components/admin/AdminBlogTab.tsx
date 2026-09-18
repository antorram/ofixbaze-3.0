import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Image as ImageIcon, 
  X,
  ExternalLink,
  Tag
} from 'lucide-react';
import { CMSBlogPost, CMSMediaItem } from '../../types';
import { MediaPickerModal } from './MediaPickerModal';

interface AdminBlogTabProps {
  posts: CMSBlogPost[];
  onAddPost: (post: CMSBlogPost) => void;
  onUpdatePost: (post: CMSBlogPost) => void;
  onDeletePost: (postId: string) => void;
  mediaItems: CMSMediaItem[];
  onUploadMedia: (item: CMSMediaItem) => void;
}

export const AdminBlogTab: React.FC<AdminBlogTabProps> = ({
  posts,
  onAddPost,
  onUpdatePost,
  onDeletePost,
  mediaItems,
  onUploadMedia
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<CMSBlogPost | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [category, setCategory] = useState('Procurement Guide');
  const [author, setAuthor] = useState('Ofixbaze Technical Advisory');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [readTime, setReadTime] = useState('5 min read');

  const filteredPosts = posts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingPost(null);
    setTitle('');
    setSlug('');
    setExcerpt('');
    setContent('');
    setFeaturedImage('/public/ceo-chairs-banner.jpg');
    setCategory('Procurement Guide');
    setAuthor('Ofixbaze Technical Advisory');
    setStatus('published');
    setReadTime('4 min read');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post: CMSBlogPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setFeaturedImage(post.featuredImage);
    setCategory(post.category);
    setAuthor(post.author);
    setStatus(post.status);
    setReadTime(post.readTime || `${post.readTimeMinutes || 5} min read`);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const postSlug = slug.trim() 
      ? slug.toLowerCase().replace(/[^a-z0-9-]/g, '-')
      : title.toLowerCase().replace(/[^a-z0-9-]/g, '-');

    if (editingPost) {
      onUpdatePost({
        ...editingPost,
        title: title.trim(),
        slug: postSlug,
        excerpt: excerpt.trim(),
        content: content.trim(),
        featuredImage: featuredImage.trim(),
        category,
        author,
        status,
        readTime: readTime || '5 min read',
        readTimeMinutes: 5
      });
    } else {
      const newPost: CMSBlogPost = {
        id: `post-${Date.now()}`,
        title: title.trim(),
        slug: postSlug,
        excerpt: excerpt.trim(),
        content: content.trim(),
        featuredImage: featuredImage.trim() || '/public/ceo-chairs-banner.jpg',
        category,
        author,
        publishedAt: 'Today',
        status,
        tags: [category],
        readTime: readTime || '5 min read',
        readTimeMinutes: 5
      };
      onAddPost(newPost);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-white">Articles & Buyer's Guides CMS</h2>
              <span className="text-[10px] bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold px-2 py-0.5 rounded-full">
                {posts.length} Posts
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Publish office ergonomics guides, cartridge authenticity verification, and procurement tips
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-md shadow-orange-950 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Toolbar & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search article titles, categories..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-0.5 rounded-lg">
          {(['all', 'published', 'draft'] as const).map(f => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-md font-semibold cursor-pointer transition uppercase text-[10px] ${
                statusFilter === f ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPosts.map(post => (
          <div
            key={post.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-slate-700 transition shadow-sm"
          >
            <div>
              <div className="aspect-video w-full bg-slate-950 overflow-hidden relative">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2">
                  <span className="text-[10px] font-bold bg-slate-950/80 text-white backdrop-blur-xs px-2.5 py-1 rounded-full border border-slate-700">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{post.publishedAt}</span>
                  <span>{post.readTime || `${post.readTimeMinutes || 5} min read`}</span>
                </div>

                <h3 className="font-bold text-sm text-white line-clamp-2 group-hover:text-orange-400 transition leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </div>

            <div className="p-4 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                post.status === 'published'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                {post.status === 'published' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                <span className="capitalize">{post.status}</span>
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(post)}
                  className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition cursor-pointer"
                  title="Edit Post"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeletePost(post.id)}
                  className="p-1.5 text-rose-400 hover:text-rose-300 rounded hover:bg-rose-500/10 transition cursor-pointer"
                  title="Delete Post"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Write/Edit Article Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl p-6 space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-600/20 text-orange-400 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-white">
                  {editingPost ? 'Edit Blog Article' : 'Write New Article'}
                </h3>
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
                <label className="block text-slate-300 font-semibold mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!slug) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'));
                    }
                  }}
                  placeholder="e.g. How to Verify Original HP Laser Cartridges"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  >
                    <option value="Procurement Guide">Procurement Guide</option>
                    <option value="Authenticity Advisory">Authenticity Advisory</option>
                    <option value="Ergonomics & Health">Ergonomics & Health</option>
                    <option value="Corporate Tech">Corporate Tech</option>
                    <option value="Industry News">Industry News</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Publish Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Featured Image</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
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
                <label className="block text-slate-300 font-semibold mb-1">Short Excerpt *</label>
                <textarea
                  rows={2}
                  required
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Summary displayed in blog cards and social sharing..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Article Content *</label>
                <textarea
                  rows={8}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write the comprehensive guide or article here..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs leading-relaxed"
                />
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
                  {editingPost ? 'Save Changes' : 'Publish Article'}
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
        onSelectImage={(url) => setFeaturedImage(url)}
        mediaItems={mediaItems}
        onUploadMedia={onUploadMedia}
        title="Select Featured Article Image"
      />
    </div>
  );
};
