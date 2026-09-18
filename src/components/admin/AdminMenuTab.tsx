import React, { useState } from 'react';
import { 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Link as LinkIcon, 
  RotateCcw, 
  CheckCircle2, 
  Eye, 
  Tag, 
  Menu as MenuIcon,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  FolderPlus,
  CornerDownRight,
  Sliders,
  FileText
} from 'lucide-react';
import { NavMenuItem, Category, ActivePage } from '../../types';

interface AdminMenuTabProps {
  navMenu: NavMenuItem[];
  categories: Category[];
  onUpdateNavMenu: (newMenu: NavMenuItem[]) => void;
  onResetDefaultMenu: () => void;
  setActivePage: (page: ActivePage) => void;
}

export const AdminMenuTab: React.FC<AdminMenuTabProps> = ({
  navMenu,
  categories,
  onUpdateNavMenu,
  onResetDefaultMenu,
  setActivePage
}) => {
  // Main Top-level Menu Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<NavMenuItem | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Expanded parent menus for sub-category view
  const [expandedMenuIds, setExpandedMenuIds] = useState<Record<string, boolean>>({
    'nav-products': true
  });

  // Sub-category Modal states
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [activeParentMenuId, setActiveParentMenuId] = useState<string | null>(null);
  const [activeSubParentId, setActiveSubParentId] = useState<string | null>(null); // For level 2 items
  const [subItemToEdit, setSubItemToEdit] = useState<NavMenuItem | null>(null);

  // Sub-category form states
  const [subLabel, setSubLabel] = useState('');
  const [subType, setSubType] = useState<'category' | 'page' | 'custom'>('category');
  const [subTarget, setSubTarget] = useState('shop');
  const [subCategorySlug, setSubCategorySlug] = useState(categories[0]?.slug || 'toners-cartridges');
  const [subSearchKeyword, setSubSearchKeyword] = useState('');
  const [subBadge, setSubBadge] = useState('');
  const [subEnabled, setSubEnabled] = useState(true);

  // Main menu form states
  const [label, setLabel] = useState('');
  const [type, setType] = useState<'page' | 'category' | 'custom'>('page');
  const [target, setTarget] = useState('shop');
  const [categorySlug, setCategorySlug] = useState(categories[0]?.slug || 'toners-cartridges');
  const [badge, setBadge] = useState('');
  const [enabled, setEnabled] = useState(true);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const toggleExpand = (id: string) => {
    setExpandedMenuIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // --- Top-Level Menu Actions ---
  const openAddModal = () => {
    setItemToEdit(null);
    setLabel('');
    setType('page');
    setTarget('shop');
    setCategorySlug(categories[0]?.slug || 'toners-cartridges');
    setBadge('');
    setEnabled(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: NavMenuItem) => {
    setItemToEdit(item);
    setLabel(item.label);
    setType(item.type);
    setTarget(item.target);
    setCategorySlug(item.categorySlug || categories[0]?.slug || '');
    setBadge(item.badge || '');
    setEnabled(item.enabled);
    setIsModalOpen(true);
  };

  const handleToggle = (id: string) => {
    const updated = navMenu.map(item => 
      item.id === id ? { ...item, enabled: !item.enabled } : item
    );
    onUpdateNavMenu(updated);
    showToast('Menu item visibility updated');
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const items = [...navMenu];
    const temp = items[index];
    items[index] = items[index - 1];
    items[index - 1] = temp;
    const reordered = items.map((item, idx) => ({ ...item, order: idx + 1 }));
    onUpdateNavMenu(reordered);
    showToast('Menu order updated');
  };

  const handleMoveDown = (index: number) => {
    if (index === navMenu.length - 1) return;
    const items = [...navMenu];
    const temp = items[index];
    items[index] = items[index + 1];
    items[index + 1] = temp;
    const reordered = items.map((item, idx) => ({ ...item, order: idx + 1 }));
    onUpdateNavMenu(reordered);
    showToast('Menu order updated');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this navigation link? Any sub-categories under it will also be deleted.')) {
      const updated = navMenu.filter(item => item.id !== id);
      onUpdateNavMenu(updated);
      showToast('Menu item deleted');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;

    if (itemToEdit) {
      const updated = navMenu.map(item => {
        if (item.id === itemToEdit.id) {
          return {
            ...item,
            label: label.trim(),
            type,
            target: type === 'category' ? 'shop' : target,
            categorySlug: type === 'category' ? categorySlug : undefined,
            badge: badge.trim() || undefined,
            enabled
          };
        }
        return item;
      });
      onUpdateNavMenu(updated);
      showToast('Menu link saved');
    } else {
      const newItem: NavMenuItem = {
        id: `nav-${Date.now()}`,
        label: label.trim(),
        type,
        target: type === 'category' ? 'shop' : target,
        categorySlug: type === 'category' ? categorySlug : undefined,
        badge: badge.trim() || undefined,
        order: navMenu.length + 1,
        enabled,
        children: []
      };
      onUpdateNavMenu([...navMenu, newItem]);
      showToast('New menu item added');
    }

    setIsModalOpen(false);
  };

  // --- Sub-Category / Sub-Menu Operations ---
  const openAddSubModal = (parentMenuId: string, subParentId?: string) => {
    setActiveParentMenuId(parentMenuId);
    setActiveSubParentId(subParentId || null);
    setSubItemToEdit(null);
    setSubLabel('');
    setSubType('category');
    setSubTarget('shop');
    setSubCategorySlug(categories[0]?.slug || 'toners-cartridges');
    setSubSearchKeyword('');
    setSubBadge('');
    setSubEnabled(true);
    setIsSubModalOpen(true);
  };

  const openEditSubModal = (parentMenuId: string, item: NavMenuItem, subParentId?: string) => {
    setActiveParentMenuId(parentMenuId);
    setActiveSubParentId(subParentId || null);
    setSubItemToEdit(item);
    setSubLabel(item.label);
    setSubType(item.type);
    setSubTarget(item.target || 'shop');
    setSubCategorySlug(item.categorySlug || categories[0]?.slug || 'toners-cartridges');
    setSubSearchKeyword(item.searchKeyword || '');
    setSubBadge(item.badge || '');
    setSubEnabled(item.enabled);
    setIsSubModalOpen(true);
  };

  const handleSaveSubCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeParentMenuId || !subLabel.trim()) return;

    const updated = navMenu.map(parent => {
      if (parent.id !== activeParentMenuId) return parent;

      const currentChildren = parent.children || [];

      // If we are editing or adding a level-2 item inside a sub-parent
      if (activeSubParentId) {
        const updatedChildren = currentChildren.map(subGroup => {
          if (subGroup.id !== activeSubParentId) return subGroup;

          const level2Items = subGroup.children || [];
          if (subItemToEdit) {
            // Edit level 2
            const editedLevel2 = level2Items.map(ch => {
              if (ch.id === subItemToEdit.id) {
                return {
                  ...ch,
                  label: subLabel.trim(),
                  type: subType,
                  target: subType === 'category' ? 'shop' : subTarget,
                  categorySlug: subType === 'category' ? subCategorySlug : undefined,
                  searchKeyword: subSearchKeyword.trim() || undefined,
                  badge: subBadge.trim() || undefined,
                  enabled: subEnabled
                };
              }
              return ch;
            });
            return { ...subGroup, children: editedLevel2 };
          } else {
            // Add level 2
            const newLevel2: NavMenuItem = {
              id: `nav-sub2-${Date.now()}`,
              label: subLabel.trim(),
              type: subType,
              target: subType === 'category' ? 'shop' : subTarget,
              categorySlug: subType === 'category' ? subCategorySlug : undefined,
              searchKeyword: subSearchKeyword.trim() || undefined,
              badge: subBadge.trim() || undefined,
              order: level2Items.length + 1,
              enabled: subEnabled
            };
            return { ...subGroup, children: [...level2Items, newLevel2] };
          }
        });
        return { ...parent, children: updatedChildren };
      }

      // We are editing or adding a level-1 sub-category
      if (subItemToEdit) {
        const updatedChildren = currentChildren.map(sub => {
          if (sub.id === subItemToEdit.id) {
            return {
              ...sub,
              label: subLabel.trim(),
              type: subType,
              target: subType === 'category' ? 'shop' : subTarget,
              categorySlug: subType === 'category' ? subCategorySlug : undefined,
              searchKeyword: subSearchKeyword.trim() || undefined,
              badge: subBadge.trim() || undefined,
              enabled: subEnabled
            };
          }
          return sub;
        });
        return { ...parent, children: updatedChildren };
      } else {
        const newSubItem: NavMenuItem = {
          id: `nav-sub-${Date.now()}`,
          label: subLabel.trim(),
          type: subType,
          target: subType === 'category' ? 'shop' : subTarget,
          categorySlug: subType === 'category' ? subCategorySlug : undefined,
          searchKeyword: subSearchKeyword.trim() || undefined,
          badge: subBadge.trim() || undefined,
          order: currentChildren.length + 1,
          enabled: subEnabled,
          children: []
        };
        return { ...parent, children: [...currentChildren, newSubItem] };
      }
    });

    onUpdateNavMenu(updated);
    setIsSubModalOpen(false);
    showToast(subItemToEdit ? 'Sub-category updated!' : 'Sub-category added successfully!');
  };

  const handleDeleteSubCategory = (parentMenuId: string, subId: string, subParentId?: string) => {
    if (!window.confirm('Delete this sub-category item?')) return;

    const updated = navMenu.map(parent => {
      if (parent.id !== parentMenuId) return parent;

      if (subParentId) {
        // Delete level 2 item
        const updatedChildren = (parent.children || []).map(group => {
          if (group.id !== subParentId) return group;
          return {
            ...group,
            children: (group.children || []).filter(c => c.id !== subId)
          };
        });
        return { ...parent, children: updatedChildren };
      } else {
        // Delete level 1 sub-item
        return {
          ...parent,
          children: (parent.children || []).filter(c => c.id !== subId)
        };
      }
    });

    onUpdateNavMenu(updated);
    showToast('Sub-category removed');
  };

  const handleMoveSubCategory = (parentMenuId: string, index: number, direction: 'up' | 'down') => {
    const parent = navMenu.find(p => p.id === parentMenuId);
    if (!parent || !parent.children) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= parent.children.length) return;

    const newChildren = [...parent.children];
    const temp = newChildren[index];
    newChildren[index] = newChildren[targetIndex];
    newChildren[targetIndex] = temp;

    const updated = navMenu.map(p => p.id === parentMenuId ? { ...p, children: newChildren } : p);
    onUpdateNavMenu(updated);
    showToast('Sub-category reordered');
  };

  const handleAutoPopulateCategories = (parentMenuId: string) => {
    const parent = navMenu.find(p => p.id === parentMenuId);
    if (!parent) return;

    const generatedSubs: NavMenuItem[] = categories.map((cat, idx) => ({
      id: `nav-sub-gen-${cat.slug}-${Date.now()}-${idx}`,
      label: cat.name.toUpperCase(),
      type: 'category',
      target: 'shop',
      categorySlug: cat.slug,
      order: idx + 1,
      enabled: true,
      children: cat.subcategories ? cat.subcategories.map((sub, sIdx) => ({
        id: `nav-sub2-gen-${cat.slug}-${sIdx}-${Date.now()}`,
        label: sub,
        type: 'category',
        target: 'shop',
        categorySlug: cat.slug,
        searchKeyword: sub,
        order: sIdx + 1,
        enabled: true
      })) : []
    }));

    const updated = navMenu.map(p => p.id === parentMenuId ? { ...p, children: generatedSubs } : p);
    onUpdateNavMenu(updated);
    setExpandedMenuIds(prev => ({ ...prev, [parentMenuId]: true }));
    showToast(`Added ${generatedSubs.length} sub-categories from Store Departments!`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white text-[11px] font-bold px-2 py-0.5 rounded">
              Header & Navigation
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Site Navigation, Menus & Sub-Categories
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Individually edit, add, or remove sub-categories and sub-menus under any navigation item. Configure badges, links, and order.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={onResetDefaultMenu}
            className="px-3 py-2 text-xs font-semibold text-slate-600 border border-slate-300 rounded-xl hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
            title="Reset navigation menu to original"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={openAddModal}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Navigation Item</span>
          </button>
        </div>
      </div>

      {/* Live Storefront Menu Bar Preview */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm border border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Live Storefront Navigation Bar Preview:
          </span>
          <span className="text-[10px] text-slate-400">
            {navMenu.filter(m => m.enabled).length} active items
          </span>
        </div>
        <div className="bg-slate-800/80 rounded-xl p-3 overflow-x-auto flex items-center gap-2 border border-slate-700">
          {navMenu.filter(m => m.enabled).map((item) => (
            <div 
              key={item.id}
              className="px-3 py-1.5 rounded-lg bg-slate-900/90 text-white text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 border border-slate-700/80"
            >
              <span>{item.label}</span>
              {item.children && item.children.length > 0 && (
                <ChevronDown className="w-3 h-3 text-slate-400" />
              )}
              {item.badge && (
                <span className="bg-orange-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Menu Items List with Expandable Sub-Categories */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Navigation Menu & Sub-Category Tree ({navMenu.length} Top Items)
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Click "Manage Sub-Categories" on any item to add, edit, or remove sub-menus.
            </p>
          </div>
          <span className="text-xs text-slate-400">
            Click arrows to reorder
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {navMenu.map((item, index) => {
            const isExpanded = !!expandedMenuIds[item.id];
            const childCount = item.children?.length || 0;

            let destinationText = '';
            if (item.type === 'page') {
              destinationText = `Page: /${item.target}`;
            } else if (item.type === 'category') {
              const catObj = categories.find(c => c.slug === item.categorySlug);
              destinationText = `Category: ${catObj ? catObj.name : item.categorySlug}`;
            } else {
              destinationText = `Custom URL: ${item.target}`;
            }

            return (
              <div key={item.id} className="transition">
                {/* Top Level Item Row */}
                <div 
                  className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    item.enabled ? 'bg-white hover:bg-slate-50/70' : 'bg-slate-50/60 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Order Controls */}
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className={`p-1 rounded transition ${
                          index === 0 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer'
                        }`}
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveDown(index)}
                        disabled={index === navMenu.length - 1}
                        className={`p-1 rounded transition ${
                          index === navMenu.length - 1 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer'
                        }`}
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="w-6 text-center text-xs font-mono font-bold text-slate-400">
                      #{index + 1}
                    </span>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-900">
                          {item.label}
                        </span>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          childCount > 0 
                            ? 'bg-blue-50 text-blue-700 border-blue-200' 
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>
                          {childCount} {childCount === 1 ? 'Sub-Category' : 'Sub-Categories'}
                        </span>

                        {item.badge && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-200">
                            {item.badge}
                          </span>
                        )}

                        {!item.enabled && (
                          <span className="bg-slate-200 text-slate-600 text-[10px] font-medium px-1.5 py-0.5 rounded">
                            Hidden
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <LinkIcon className="w-3 h-3 text-slate-400" />
                          <span>{destinationText}</span>
                        </p>

                        <button
                          onClick={() => toggleExpand(item.id)}
                          className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer bg-blue-50/70 hover:bg-blue-100/70 px-2 py-0.5 rounded-lg border border-blue-200/60 transition"
                        >
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                          <span>{isExpanded ? 'Hide Sub-Categories' : `Manage Sub-Categories (${childCount})`}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-center flex-wrap">
                    <button
                      onClick={() => openAddSubModal(item.id)}
                      className="px-2.5 py-1 rounded-xl text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition cursor-pointer flex items-center gap-1"
                      title="Add sub-category under this menu"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Sub-Category</span>
                    </button>

                    <button
                      onClick={() => handleToggle(item.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        item.enabled
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {item.enabled ? 'Enabled' : 'Disabled'}
                    </button>

                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                      title="Edit Item"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Delete Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sub-Category Management Panel (Expanded) */}
                {isExpanded && (
                  <div className="bg-slate-50/90 border-t border-b border-slate-200 p-4 sm:p-5 ml-4 sm:ml-8 my-2 rounded-2xl border space-y-3 animate-in fade-in duration-150">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <Layers className="w-4 h-4 text-blue-600" />
                          <span>Sub-Categories under "{item.label}" ({childCount} items)</span>
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          These sub-categories appear in dropdown menus and category popups when customers hover over "{item.label}".
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => handleAutoPopulateCategories(item.id)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition flex items-center gap-1 cursor-pointer"
                          title="Auto-fill sub-categories from all 9 store categories"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>Sync from Store Categories</span>
                        </button>

                        <button
                          onClick={() => openAddSubModal(item.id)}
                          className="px-3 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition flex items-center gap-1 cursor-pointer shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Sub-Category</span>
                        </button>
                      </div>
                    </div>

                    {childCount === 0 ? (
                      <div className="text-center py-6 bg-white rounded-xl border border-dashed border-slate-300">
                        <FolderPlus className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
                        <p className="text-xs font-bold text-slate-700">No sub-categories configured yet</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Add custom sub-categories or click "Sync from Store Categories" to instantly populate this menu.
                        </p>
                        <button
                          onClick={() => openAddSubModal(item.id)}
                          className="mt-3 px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition cursor-pointer"
                        >
                          + Add First Sub-Category
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {item.children?.map((sub, subIdx) => {
                          const level2Count = sub.children?.length || 0;

                          return (
                            <div 
                              key={sub.id} 
                              className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs space-y-2 hover:border-slate-300 transition"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                  {/* Sub reorder */}
                                  <div className="flex flex-col gap-0.5">
                                    <button
                                      onClick={() => handleMoveSubCategory(item.id, subIdx, 'up')}
                                      disabled={subIdx === 0}
                                      className="p-0.5 text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer"
                                    >
                                      <ArrowUp className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => handleMoveSubCategory(item.id, subIdx, 'down')}
                                      disabled={subIdx === (item.children?.length || 1) - 1}
                                      className="p-0.5 text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer"
                                    >
                                      <ArrowDown className="w-3 h-3" />
                                    </button>
                                  </div>

                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-xs font-bold text-slate-900">
                                        {sub.label}
                                      </span>

                                      {sub.categorySlug && (
                                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                                          {sub.categorySlug}
                                        </span>
                                      )}

                                      {sub.badge && (
                                        <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.2 rounded">
                                          {sub.badge}
                                        </span>
                                      )}

                                      {level2Count > 0 && (
                                        <span className="text-[9px] bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.2 rounded border border-indigo-200">
                                          {level2Count} Child items
                                        </span>
                                      )}

                                      {!sub.enabled && (
                                        <span className="text-[9px] bg-slate-200 text-slate-600 px-1 py-0.2 rounded">
                                          Hidden
                                        </span>
                                      )}
                                    </div>

                                    {sub.searchKeyword && (
                                      <p className="text-[10px] text-slate-400 mt-0.5">
                                        Search filter: "{sub.searchKeyword}"
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 self-end sm:self-center flex-wrap">
                                  <button
                                    onClick={() => openAddSubModal(item.id, sub.id)}
                                    className="px-2 py-0.5 text-[10px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md border border-indigo-200 transition cursor-pointer flex items-center gap-1"
                                    title="Add nested child under this sub-category"
                                  >
                                    <Plus className="w-3 h-3" />
                                    <span>Add Child Item</span>
                                  </button>

                                  <button
                                    onClick={() => openEditSubModal(item.id, sub)}
                                    className="p-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition cursor-pointer"
                                    title="Edit Sub-Category"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    onClick={() => handleDeleteSubCategory(item.id, sub.id)}
                                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                                    title="Delete Sub-Category"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Nested Level 2 Children (if any) */}
                              {sub.children && sub.children.length > 0 && (
                                <div className="pl-6 pt-1 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5">
                                  {sub.children.map((child) => (
                                    <div 
                                      key={child.id}
                                      className="flex items-center justify-between gap-1.5 px-2 py-1 bg-slate-50 rounded-lg border border-slate-200 text-[11px]"
                                    >
                                      <div className="flex items-center gap-1.5 truncate">
                                        <CornerDownRight className="w-3 h-3 text-slate-400 shrink-0" />
                                        <span className="font-medium text-slate-700 truncate">{child.label}</span>
                                      </div>
                                      <div className="flex items-center gap-1 shrink-0">
                                        <button
                                          onClick={() => openEditSubModal(item.id, child, sub.id)}
                                          className="p-0.5 text-slate-400 hover:text-blue-600 cursor-pointer"
                                          title="Edit Child Item"
                                        >
                                          <Edit3 className="w-3 h-3" />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteSubCategory(item.id, child.id, sub.id)}
                                          className="p-0.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                                          title="Delete Child Item"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add / Edit Main Menu Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <MenuIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {itemToEdit ? 'Edit Navigation Link' : 'Add Navigation Link'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Configure link destination and appearance
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Menu Item Label *
                </label>
                <input
                  type="text"
                  required
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. Products / Office Furniture / Track Order"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Link Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('page')}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition cursor-pointer ${
                      type === 'page' 
                        ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Site Page
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('category')}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition cursor-pointer ${
                      type === 'category' 
                        ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Category
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('custom')}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition cursor-pointer ${
                      type === 'custom' 
                        ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Custom
                  </button>
                </div>
              </div>

              {type === 'page' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Select Page
                  </label>
                  <select
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="home">Home Page</option>
                    <option value="shop">All Products (Shop)</option>
                    <option value="rfq">Corporate Quote (RFQ)</option>
                    <option value="about">About Us</option>
                    <option value="contact">Contact & Showroom</option>
                    <option value="track-order">Track Order</option>
                    <option value="wishlist">Wishlist</option>
                  </select>
                </div>
              )}

              {type === 'category' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Select Department / Category
                  </label>
                  <select
                    value={categorySlug}
                    onChange={(e) => setCategorySlug(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    {categories.map(cat => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.name} ({cat.slug})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {type === 'custom' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Target URL / Path
                  </label>
                  <input
                    type="text"
                    required
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="e.g. /clearance or https://..."
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Optional Promo Badge
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. HOT, NEW, OEM, SALE"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl uppercase"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="font-bold text-slate-700">
                    Visible in Storefront Navigation
                  </span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{itemToEdit ? 'Save Changes' : 'Add Link'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Sub-Category Modal */}
      {isSubModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {subItemToEdit ? 'Edit Sub-Category' : 'Add Sub-Category'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {activeSubParentId ? 'Adding child item under sub-group' : 'Adding under parent navigation menu'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSubModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubCategory} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Sub-Category Label *
                </label>
                <input
                  type="text"
                  required
                  value={subLabel}
                  onChange={(e) => setSubLabel(e.target.value)}
                  placeholder="e.g. Executive Desks / HP Color Toners / Cross-Cut Shredders"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Destination Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSubType('category')}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition cursor-pointer ${
                      subType === 'category' 
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-700 font-bold' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Category
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubType('page')}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition cursor-pointer ${
                      subType === 'page' 
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-700 font-bold' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Site Page
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubType('custom')}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition cursor-pointer ${
                      subType === 'custom' 
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-700 font-bold' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Custom
                  </button>
                </div>
              </div>

              {subType === 'category' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Select Target Department / Category
                  </label>
                  <select
                    value={subCategorySlug}
                    onChange={(e) => setSubCategorySlug(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl bg-white font-medium"
                  >
                    {categories.map(cat => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.name} ({cat.slug})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {subType === 'page' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Select Page
                  </label>
                  <select
                    value={subTarget}
                    onChange={(e) => setSubTarget(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="shop">Shop Catalog</option>
                    <option value="rfq">Corporate RFQ Quote</option>
                    <option value="contact">Contact & Showroom</option>
                    <option value="about">About Us</option>
                    <option value="track-order">Track Order</option>
                  </select>
                </div>
              )}

              {subType === 'custom' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Custom URL / Path
                  </label>
                  <input
                    type="text"
                    required
                    value={subTarget}
                    onChange={(e) => setSubTarget(e.target.value)}
                    placeholder="e.g. /promotions or https://..."
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Optional Search Filter Keyword
                </label>
                <input
                  type="text"
                  value={subSearchKeyword}
                  onChange={(e) => setSubSearchKeyword(e.target.value)}
                  placeholder="e.g. Color MFP / DeskJet / Ergonomic / 05A"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl"
                />
                <p className="text-[11px] text-slate-400 mt-0.5">
                  When clicked, this keyword is automatically filtered on the Shop catalog.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Optional Promo Badge
                </label>
                <input
                  type="text"
                  value={subBadge}
                  onChange={(e) => setSubBadge(e.target.value)}
                  placeholder="e.g. HOT, NEW, OEM, SALE"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl uppercase"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subEnabled}
                    onChange={(e) => setSubEnabled(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span className="font-bold text-slate-700">
                    Visible in Dropdown Menus
                  </span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSubModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{subItemToEdit ? 'Save Sub-Category' : 'Add Sub-Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
