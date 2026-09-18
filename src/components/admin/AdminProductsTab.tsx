import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  AlertTriangle, 
  ShieldCheck, 
  Star, 
  Sparkles, 
  Flame, 
  Download, 
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Layers,
  ArrowUpDown,
  RefreshCw
} from 'lucide-react';
import { Product, Currency } from '../../types';
import { formatPrice } from '../../utils/currency';
import { CATEGORIES } from '../../data/categories';
import { CsvImportModal } from './CsvImportModal';

interface AdminProductsTabProps {
  products: Product[];
  currency: Currency;
  onAddProduct: (newProduct: Product) => void;
  onUpdateProduct: (updatedProduct: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onQuickRestock: (productId: string, amount: number) => void;
  onToggleStockStatus: (productId: string) => void;
  onToggleFeatured: (productId: string) => void;
  onOpenAddModal: () => void;
  onOpenEditModal: (product: Product) => void;
  onImportProducts?: (importedProducts: Product[]) => void;
}

export const AdminProductsTab: React.FC<AdminProductsTabProps> = ({
  products,
  currency,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onQuickRestock,
  onToggleStockStatus,
  onToggleFeatured,
  onOpenAddModal,
  onOpenEditModal,
  onImportProducts
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in-stock' | 'low-stock' | 'out-of-stock'>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc' | 'stock-asc' | 'stock-desc'>('name');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isCsvImportOpen, setIsCsvImportOpen] = useState<boolean>(false);

  // Extract unique brands
  const brands = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => {
      if (p.brand) set.add(p.brand);
    });
    return Array.from(set).sort();
  }, [products]);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        p.name.toLowerCase().includes(q) || 
        p.sku.toLowerCase().includes(q) || 
        p.brand.toLowerCase().includes(q) || 
        (p.subCategory && p.subCategory.toLowerCase().includes(q));

      // Category
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;

      // Brand
      const matchesBrand = selectedBrand === 'all' || p.brand === selectedBrand;

      // Stock
      let matchesStock = true;
      if (stockFilter === 'in-stock') matchesStock = p.inStock && p.stockCount > 0;
      else if (stockFilter === 'low-stock') matchesStock = p.stockCount > 0 && p.stockCount <= 5;
      else if (stockFilter === 'out-of-stock') matchesStock = !p.inStock || p.stockCount === 0;

      return matchesSearch && matchesCategory && matchesBrand && matchesStock;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.priceNGN - b.priceNGN;
        case 'price-desc':
          return b.priceNGN - a.priceNGN;
        case 'stock-asc':
          return a.stockCount - b.stockCount;
        case 'stock-desc':
          return b.stockCount - a.stockCount;
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [products, searchQuery, selectedCategory, selectedBrand, stockFilter, sortBy]);

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ofixbaze-catalog-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-5">
      {/* Top Action & Filter Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by product name, SKU, brand, model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-slate-50/50"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setIsCsvImportOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-emerald-700/20 transition cursor-pointer active:scale-95"
              title="Bulk upload and import products from CSV"
            >
              <Download className="w-3.5 h-3.5 rotate-180" />
              <span>Import CSV</span>
            </button>

            <button
              onClick={handleExportJson}
              className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title="Export catalog as JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Catalog</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-orange-600/20 transition cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>
        </div>

        {/* Filter chips & Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 text-xs">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px] font-medium">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="all">All Categories ({products.length})</option>
              {CATEGORIES.map(cat => (
                <option key={cat.slug} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px] font-medium">Brand:</span>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="all">All Brands</option>
              {brands.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px] font-medium">Stock:</span>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="in-stock">In Stock Only</option>
              <option value="low-stock">Low Stock (≤ 5 units)</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-slate-400 text-[11px] font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="name">Product Name (A-Z)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="stock-asc">Stock (Low to High)</option>
              <option value="stock-desc">Stock (High to Low)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
          <div>
            Showing <strong className="text-slate-900">{filteredProducts.length}</strong> of {products.length} catalog items
          </div>
          {(searchQuery || selectedCategory !== 'all' || selectedBrand !== 'all' || stockFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedBrand('all');
                setStockFilter('all');
              }}
              className="text-orange-600 hover:text-orange-700 font-semibold cursor-pointer"
            >
              Clear all filters
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Item Details</th>
                <th className="py-3 px-4">Category & SKU</th>
                <th className="py-3 px-4">Price (NGN)</th>
                <th className="py-3 px-4">Stock Level</th>
                <th className="py-3 px-4">Badges & OEM</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    No products found matching your search or filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const isLow = product.stockCount > 0 && product.stockCount <= 5;
                  const isOut = !product.inStock || product.stockCount === 0;

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/80 transition">
                      {/* Item Details */}
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="flex items-start gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-contain bg-slate-50 border border-slate-200 p-1 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLElement).setAttribute('src', 'https://ofixbaze.com/wp-content/uploads/2026/04/ergoonomic-chair.png');
                            }}
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 line-clamp-1 leading-snug" title={product.name}>
                              {product.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                              <span className="font-semibold text-slate-700">{product.brand}</span>
                              <span>•</span>
                              <span>Rating: {product.rating} ★ ({product.reviewsCount})</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category & SKU */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 capitalize">
                          {product.category.replace('-', ' & ')}
                        </div>
                        <div className="font-mono text-[11px] text-slate-400 mt-0.5">
                          SKU: {product.sku}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">
                          {formatPrice(product.priceNGN, currency)}
                        </div>
                        {product.originalPriceNGN && product.originalPriceNGN > product.priceNGN && (
                          <div className="text-[11px] text-slate-400 line-through">
                            {formatPrice(product.originalPriceNGN, currency)}
                          </div>
                        )}
                      </td>

                      {/* Stock Level with Quick +/- */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onQuickRestock(product.id, -1)}
                            disabled={product.stockCount <= 0}
                            className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs disabled:opacity-30 cursor-pointer"
                            title="Decrease stock by 1"
                          >
                            -
                          </button>

                          <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs min-w-[32px] text-center ${
                            isOut ? 'bg-rose-100 text-rose-800' :
                            isLow ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-100 text-slate-800'
                          }`}>
                            {product.stockCount}
                          </span>

                          <button
                            onClick={() => onQuickRestock(product.id, 5)}
                            className="px-1.5 h-6 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-[10px] cursor-pointer"
                            title="Add +5 units to stock"
                          >
                            +5
                          </button>
                        </div>

                        <div className="mt-1">
                          <button
                            onClick={() => onToggleStockStatus(product.id)}
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded cursor-pointer ${
                              product.inStock 
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                            }`}
                          >
                            {product.inStock ? 'In Stock (Active)' : 'Out of Stock'}
                          </button>
                        </div>
                      </td>

                      {/* Badges & OEM */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1.5">
                          {product.isOriginalOEM && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                              <ShieldCheck className="w-3 h-3" />
                              OEM
                            </span>
                          )}

                          <button
                            onClick={() => onToggleFeatured(product.id)}
                            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold border cursor-pointer transition ${
                              product.isFeatured 
                                ? 'bg-amber-50 text-amber-800 border-amber-300' 
                                : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-600'
                            }`}
                            title="Toggle featured status"
                          >
                            <Star className={`w-3 h-3 ${product.isFeatured ? 'fill-amber-500 text-amber-500' : ''}`} />
                            Featured
                          </button>

                          {product.isHotDeal && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                              <Flame className="w-3 h-3" />
                              Hot Deal
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenEditModal(product)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:border-orange-300 hover:bg-orange-50 text-slate-600 hover:text-orange-600 transition cursor-pointer"
                            title="Edit product"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {deleteConfirmId === product.id ? (
                            <div className="inline-flex items-center gap-1 bg-rose-50 p-1 rounded-lg border border-rose-200">
                              <button
                                onClick={() => {
                                  onDeleteProduct(product.id);
                                  setDeleteConfirmId(null);
                                }}
                                className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold hover:bg-rose-700"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-bold hover:bg-slate-300"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(product.id)}
                              className="p-1.5 rounded-lg border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition cursor-pointer"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSV Bulk Import Modal */}
      <CsvImportModal
        isOpen={isCsvImportOpen}
        onClose={() => setIsCsvImportOpen(false)}
        onImport={(imported) => {
          if (onImportProducts) {
            onImportProducts(imported);
          } else {
            imported.forEach(p => onAddProduct(p));
          }
        }}
      />
    </div>
  );
};
