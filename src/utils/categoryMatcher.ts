import { Product } from '../types';

/**
 * Robust Category Matching Utility
 * Ensures products match their designated category slug even if imported with
 * legacy categories (like 'furniture-safes') or subcategory variations.
 */
export function isProductInCategory(product: Product, categorySlug: string): boolean {
  if (!product) return false;
  if (!categorySlug || categorySlug === 'all') return true;

  // Direct exact slug match
  if (product.category === categorySlug) return true;

  const cat = (product.category || '').toLowerCase();
  const sub = (product.subCategory || '').toLowerCase();
  const name = (product.name || '').toLowerCase();
  const sku = (product.sku || '').toLowerCase();

  switch (categorySlug) {
    case 'printer':
    case 'printers-copiers':
      if (cat === 'printer' || cat === 'printers-copiers') return true;
      return sub.includes('printer') || 
             sub.includes('copier') || 
             name.includes('printer') || 
             name.includes('copier') || 
             name.includes('laserjet') || 
             name.includes('mfp') || 
             name.includes('deskjet') || 
             name.includes('officejet') || 
             name.includes('smart tank') || 
             name.includes('imagerunner');

    case 'toners':
    case 'toners-cartridges':
      if (cat === 'toners' || cat === 'toners-cartridges') return true;
      return sub.includes('toner') || 
             sub.includes('cartridge') || 
             name.includes('toner') || 
             name.includes('cartridge') || 
             sku.startsWith('ce') || 
             sku.startsWith('cf') || 
             sku.includes('toner');

    case 'inks':
      if (cat === 'inks') return true;
      return sub.includes('ink') || 
             sub.includes('printhead') || 
             name.includes('ink') || 
             name.includes('printhead') || 
             name.includes('gt52') || 
             name.includes('gt53') || 
             name.includes('bottle');

    case 'ups':
    case 'power-ups':
      if (cat === 'ups' || cat === 'power-ups') return true;
      return sub.includes('ups') || 
             sub.includes('power') || 
             name.includes('ups') || 
             name.includes('apc') || 
             name.includes('blue gate') || 
             name.includes('mercury') || 
             name.includes('voltage') || 
             name.includes('regulator') || 
             name.includes('surge');

    case 'kits':
      if (cat === 'kits') return true;
      return sub.includes('kit') || 
             sub.includes('transfer') || 
             name.includes('transfer kit') || 
             name.includes('image transfer') || 
             name.includes('maintenance kit') || 
             name.includes('fuser');

    case 'accessories':
      if (cat === 'accessories') return true;
      return sub.includes('accessor') || 
             name.includes('accessor') || 
             name.includes('cable') || 
             name.includes('paper tray') || 
             name.includes('adapter');

    case 'office-furniture':
      if (cat === 'office-furniture') return true;
      return isProductInCategory(product, 'office-chairs') || isProductInCategory(product, 'executive-tables');

    case 'office-chairs':
      if (cat === 'office-chairs') return true;
      if (cat === 'furniture-safes' || cat === 'chairs' || cat === 'executive-ceo-chairs' || cat === 'ergonomic-chairs' || cat === 'visitors-chairs') {
        const isDesk = sub.includes('table') || sub.includes('desk') || name.includes('table') || name.includes('desk');
        return !isDesk;
      }
      return name.includes('chair') || sub.includes('chair');

    case 'executive-ceo-chairs':
      if (cat === 'executive-ceo-chairs') return true;
      if (cat === 'furniture-safes' || cat === 'chairs' || cat === 'office-chairs') {
        const isDesk = sub.includes('table') || sub.includes('desk') || name.includes('table') || name.includes('desk');
        const isVisitor = sub.includes('visitor') || name.includes('visitor') || name.includes('seater') || name.includes('cantilever');
        const isErgonomic = sub.includes('mesh') || name.includes('mesh') || name.includes('orthopedic') || name.includes('kidney');
        if (!isDesk && !isVisitor && !isErgonomic) return true;
      }
      return sub.includes('ceo') || name.includes('ceo') || (name.includes('executive') && !name.includes('desk') && !name.includes('table') && !name.includes('visitor'));

    case 'ergonomic-chairs':
      if (cat === 'ergonomic-chairs') return true;
      return sub.includes('ergonomic') || 
             sub.includes('mesh') || 
             name.includes('mesh') || 
             name.includes('orthopedic') || 
             name.includes('kidney') || 
             (name.includes('ergonomic') && !name.includes('desk') && !name.includes('table'));

    case 'visitors-chairs':
      if (cat === 'visitors-chairs') return true;
      return sub.includes('visitor') || 
             sub.includes('reception') || 
             sub.includes('cantilever') || 
             name.includes('visitor') || 
             name.includes('reception') || 
             name.includes('seater') || 
             name.includes('cantilever') || 
             name.includes('guest');

    case 'executive-tables':
      if (cat === 'executive-tables') return true;
      return sub.includes('table') || 
             sub.includes('desk') || 
             sub.includes('workstation') || 
             name.includes('table') || 
             name.includes('desk') || 
             name.includes('workstation');

    default:
      return cat === categorySlug.toLowerCase();
  }
}

/**
 * Computes live product counts per category slug
 */
export function getCategoryCounts(products: Product[]): Record<string, number> {
  const counts: Record<string, number> = {};
  products.forEach(p => {
    counts[p.category] = (counts[p.category] || 0) + 1;
  });
  return counts;
}
