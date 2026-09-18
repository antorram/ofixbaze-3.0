import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Download, 
  Layers, 
  RefreshCw,
  Eye,
  Trash2
} from 'lucide-react';
import { Product } from '../../types';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (products: Product[]) => void;
}

// Robust CSV Line Parser supporting quotes and multi-line fields
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField);
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentField);
      if (currentRow.length > 1 || (currentRow.length === 1 && currentRow[0].trim())) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }

  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  return rows;
}

// Category slug mapper
function mapCategorySlug(categoryName: string): { category: string; subCategory: string } {
  const lower = (categoryName || '').toLowerCase().trim();
  if (lower.includes('executive ceo') || lower.includes('ceo chair')) {
    return { category: 'executive-ceo-chairs', subCategory: 'Executive CEO Chairs' };
  }
  if (lower.includes('ergonomic') || lower.includes('mesh')) {
    return { category: 'ergonomic-chairs', subCategory: 'Ergonomic Chairs' };
  }
  if (lower.includes('visitor') || lower.includes('cantilever') || lower.includes('guest')) {
    return { category: 'visitors-chairs', subCategory: 'Visitors & Reception Chairs' };
  }
  if (lower.includes('table') || lower.includes('desk') || lower.includes('workstation')) {
    return { category: 'executive-tables', subCategory: 'Executive Tables & Desks' };
  }
  if (lower.includes('toner') || lower.includes('cartridge') || lower.includes('ink')) {
    return { category: 'toners-cartridges', subCategory: 'HP Original Toners' };
  }
  if (lower.includes('shredder') || lower.includes('counter') || lower.includes('machine')) {
    return { category: 'office-machines', subCategory: 'Office Machines & Shredders' };
  }
  if (lower.includes('printer') || lower.includes('copier')) {
    return { category: 'printers-copiers', subCategory: 'Printers & Copiers' };
  }
  if (lower.includes('ups') || lower.includes('power')) {
    return { category: 'power-ups', subCategory: 'UPS & Power Solutions' };
  }
  return { category: 'executive-ceo-chairs', subCategory: 'Executive Office Furniture' };
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({
  isOpen,
  onClose,
  onImport
}) => {
  const [activeInputTab, setActiveInputTab] = useState<'upload' | 'paste'>('upload');
  const [csvText, setCsvText] = useState<string>('');
  const [parsedProducts, setParsedProducts] = useState<Product[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [successCount, setSuccessCount] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const processCsvData = (rawText: string) => {
    setErrorMessage(null);
    setSuccessCount(null);

    if (!rawText.trim()) {
      setErrorMessage('CSV content is empty.');
      return;
    }

    try {
      const rows = parseCsv(rawText.trim());
      if (rows.length < 2) {
        setErrorMessage('CSV file must have at least a header row and one product row.');
        return;
      }

      const headers = rows[0].map(h => h.trim().toLowerCase().replace(/^["']|["']$/g, ''));
      
      // Locate column indices
      const idIdx = headers.findIndex(h => h === 'id' || h.includes('id'));
      const nameIdx = headers.findIndex(h => h === 'name' || h.includes('title') || h.includes('product name'));
      const skuIdx = headers.findIndex(h => h === 'sku');
      const catIdx = headers.findIndex(h => h === 'categories' || h === 'category');
      const shortDescIdx = headers.findIndex(h => h.includes('short description'));
      const descIdx = headers.findIndex(h => h === 'description' && !h.includes('short'));
      const regPriceIdx = headers.findIndex(h => h.includes('regular price') || h === 'price');
      const salePriceIdx = headers.findIndex(h => h.includes('sale price'));
      const imagesIdx = headers.findIndex(h => h.includes('images') || h === 'image');
      const inStockIdx = headers.findIndex(h => h.includes('in stock'));
      const stockIdx = headers.findIndex(h => h === 'stock' || h.includes('stock qty'));

      if (nameIdx === -1) {
        setErrorMessage('Could not find a "Name" column in your CSV.');
        return;
      }

      const newProducts: Product[] = [];

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length <= nameIdx) continue;

        const name = (row[nameIdx] || '').trim();
        if (!name) continue;

        const rawId = idIdx !== -1 ? row[idIdx]?.trim() : '';
        const rawSku = skuIdx !== -1 ? row[skuIdx]?.trim() : '';
        const effectiveSku = rawSku || (rawId ? `OBNL-${rawId}` : `OBNL-${Date.now()}-${i}`);
        const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || effectiveSku.toLowerCase();

        const rawCat = catIdx !== -1 ? (row[catIdx] || '') : '';
        const { category, subCategory } = mapCategorySlug(rawCat);

        // Parse images
        const rawImages = imagesIdx !== -1 ? (row[imagesIdx] || '') : '';
        const gallery = rawImages
          ? rawImages.split(/,\s*/).map(url => url.trim().replace(/^["']|["']$/g, '')).filter(Boolean)
          : ['https://ofixbaze.com/wp-content/uploads/2026/04/ergoonomic-chair.png'];
        const image = gallery[0] || 'https://ofixbaze.com/wp-content/uploads/2026/04/ergoonomic-chair.png';

        // Parse prices
        const rawRegPrice = regPriceIdx !== -1 ? parseFloat(row[regPriceIdx]?.replace(/[^0-9.]/g, '') || '0') : 0;
        const rawSalePrice = salePriceIdx !== -1 ? parseFloat(row[salePriceIdx]?.replace(/[^0-9.]/g, '') || '0') : 0;
        const priceNGN = rawSalePrice > 0 ? rawSalePrice : (rawRegPrice > 0 ? rawRegPrice : 185000);
        const originalPriceNGN = rawSalePrice > 0 && rawRegPrice > rawSalePrice ? rawRegPrice : Math.round(priceNGN * 1.15);

        // Parse descriptions
        const shortDesc = shortDescIdx !== -1 ? (row[shortDescIdx] || '').trim() : '';
        const fullDesc = descIdx !== -1 ? (row[descIdx] || '').trim() : '';
        const cleanDesc = fullDesc.replace(/\[\/?et_pb_[^\]]*\]/g, ' ').replace(/\s+/g, ' ').trim();

        // Parse stock
        const rawInStock = inStockIdx !== -1 ? row[inStockIdx]?.trim() : '1';
        const inStock = rawInStock === '1' || rawInStock.toLowerCase() === 'yes' || rawInStock.toLowerCase() === 'instock';
        const stockCount = stockIdx !== -1 && row[stockIdx]?.trim() ? parseInt(row[stockIdx]?.replace(/[^0-9]/g, '') || '10', 10) : 10;

        newProducts.push({
          id,
          name,
          brand: 'Ofixbaze',
          category,
          subCategory,
          priceNGN,
          originalPriceNGN,
          rating: 4.8,
          reviewsCount: Math.floor(Math.random() * 20) + 5,
          inStock,
          stockCount: stockCount > 0 ? stockCount : 10,
          isOriginalOEM: true,
          isFeatured: true,
          badge: 'Verified Genuine',
          image,
          gallery: gallery.length > 0 ? gallery : [image],
          shortDescription: shortDesc || name,
          description: cleanDesc || fullDesc || `${name} supplied with full official warranty by Ofixbaze Nigeria Limited.`,
          features: [
            '100% Genuine Certified Quality by Ofixbaze Nigeria Limited',
            'Full Structural Warranty & After-Sales Support',
            'Direct Delivery Available Across Lagos & Nationwide Nigeria'
          ],
          specs: {
            'Brand': 'Ofixbaze',
            'Condition': '100% Brand New',
            'Origin': 'Genuine Certified OEM',
            'Warranty': '2 Years Structural Warranty'
          },
          sku: effectiveSku,
          warranty: '2 Years OBNL Warranty'
        });
      }

      setParsedProducts(newProducts);
      if (newProducts.length === 0) {
        setErrorMessage('No valid product rows could be parsed from the CSV.');
      }
    } catch (err: any) {
      setErrorMessage(`Error parsing CSV: ${err?.message || 'Unknown error'}`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvText(text);
      processCsvData(text);
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read the file.');
    };
    reader.readAsText(file);
  };

  const handleExecuteImport = () => {
    if (parsedProducts.length === 0) return;
    setIsProcessing(true);
    setTimeout(() => {
      onImport(parsedProducts);
      setSuccessCount(parsedProducts.length);
      setIsProcessing(false);
      setTimeout(() => {
        onClose();
      }, 1500);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Import Products from CSV</h2>
              <p className="text-xs text-slate-400">
                Bulk upload WooCommerce, Shopify, or custom CSV products directly into the live catalog
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Method Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <button
              onClick={() => setActiveInputTab('upload')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeInputTab === 'upload' 
                  ? 'bg-orange-600 text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload CSV File</span>
            </button>
            <button
              onClick={() => setActiveInputTab('paste')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeInputTab === 'paste' 
                  ? 'bg-orange-600 text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Paste CSV Raw Text</span>
            </button>
          </div>

          {/* Upload File Zone */}
          {activeInputTab === 'upload' && (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-orange-500 rounded-2xl p-8 text-center bg-slate-50/50 hover:bg-orange-50/30 transition cursor-pointer group"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".csv,text/csv" 
                className="hidden" 
              />
              <div className="w-14 h-14 rounded-2xl bg-orange-100 group-hover:bg-orange-200 text-orange-600 mx-auto flex items-center justify-center mb-3 transition">
                <UploadCloud className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                {fileName ? fileName : 'Click to select or drag & drop CSV file'}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Supports WooCommerce product export CSV format with Names, Categories, Images, Prices & Descriptions
              </p>
            </div>
          )}

          {/* Paste CSV Text Zone */}
          {activeInputTab === 'paste' && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Paste your CSV content here:
              </label>
              <textarea
                value={csvText}
                onChange={(e) => {
                  setCsvText(e.target.value);
                  processCsvData(e.target.value);
                }}
                placeholder="ID,Type,SKU,Name,Published,Short description,Description,Categories,Images,..."
                rows={7}
                className="w-full p-3 font-mono text-[11px] rounded-xl border border-slate-300 bg-slate-50 text-slate-800 focus:outline-none focus:border-orange-500"
              />
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {successCount !== null && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-bold animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Successfully imported {successCount} products into the live catalog! Updating store...</span>
            </div>
          )}

          {/* Parsed Products Preview Table */}
          {parsedProducts.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Ready to Import Preview
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-bold text-[11px]">
                    {parsedProducts.length} Products Found
                  </span>
                </div>
                <button
                  onClick={() => {
                    setParsedProducts([]);
                    setCsvText('');
                    setFileName(null);
                  }}
                  className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 sticky top-0">
                    <tr>
                      <th className="py-2.5 px-3">Preview</th>
                      <th className="py-2.5 px-3">Product Name</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">SKU</th>
                      <th className="py-2.5 px-3">Price (NGN)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedProducts.map((p, idx) => (
                      <tr key={p.id + idx} className="hover:bg-slate-50 transition">
                        <td className="py-2 px-3">
                          <div className="w-8 h-8 rounded-md bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                            <img 
                              src={p.image} 
                              alt={p.name} 
                              className="w-full h-full object-cover" 
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          </div>
                        </td>
                        <td className="py-2 px-3 font-semibold text-slate-800 max-w-[220px] truncate" title={p.name}>
                          {p.name}
                        </td>
                        <td className="py-2 px-3">
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium text-[10px]">
                            {p.subCategory || p.category}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-mono text-[11px] text-slate-500">
                          {p.sku}
                        </td>
                        <td className="py-2 px-3 font-bold text-slate-900">
                          ₦{p.priceNGN.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleExecuteImport}
            disabled={parsedProducts.length === 0 || isProcessing}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-sm ${
              parsedProducts.length > 0 && !isProcessing
                ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-950/20'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Importing Products...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm &amp; Import {parsedProducts.length > 0 ? `(${parsedProducts.length}) Products` : ''}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
