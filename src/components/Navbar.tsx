import React, { useState } from 'react';
import { Shield, ChevronDown, Check, UserCheck, Sparkles, Inbox, LayoutDashboard, BookOpen, BarChart3, Settings } from 'lucide-react';
import { ScreenTab, useBrandLens } from '../lib/store';
import { Role } from '../lib/types';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    setCurrentUser,
    allUsers,
    contentItems,
    brandKit,
    availableBrands,
    switchBrand,
    updateBrandInfo,
  } = useBrandLens();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isBrandMenuOpen, setIsBrandMenuOpen] = useState(false);
  const [customBrandName, setCustomBrandName] = useState('');
  const [isCustomBrandModal, setIsCustomBrandModal] = useState(false);

  // Pending reviews count
  const pendingCount = contentItems.filter(
    (item) => item.status === 'SUBMITTED' || item.status === 'IN_REVIEW'
  ).length;

  // Import RBAC utility
  // Filter nav items strictly by Role:
  // CREATOR & VIEWER: hide Inbox and Settings
  // REVIEWER: show Inbox, hide Settings
  // BRAND_ADMIN: show both
  const canSeeInbox = currentUser.role === 'REVIEWER' || currentUser.role === 'BRAND_ADMIN';
  const canSeeSettings = currentUser.role === 'BRAND_ADMIN';

  const allNavItems: { tab: ScreenTab; label: string; icon: React.ReactNode; badge?: number; visible: boolean }[] = [
    {
      tab: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      visible: true,
    },
    {
      tab: 'brand-kit',
      label: 'Brand Kit',
      icon: <BookOpen className="w-4 h-4" />,
      visible: true,
    },
    {
      tab: 'workspace',
      label: 'Review Workspace',
      icon: <Sparkles className="w-4 h-4" />,
      visible: true,
    },
    {
      tab: 'inbox',
      label: 'Inbox',
      icon: <Inbox className="w-4 h-4" />,
      badge: pendingCount > 0 ? pendingCount : undefined,
      visible: canSeeInbox,
    },
    {
      tab: 'insights',
      label: 'Insights',
      icon: <BarChart3 className="w-4 h-4" />,
      visible: true,
    },
    {
      tab: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
      visible: canSeeSettings,
    },
  ];

  const navItems = allNavItems.filter((i) => i.visible);

  const getRoleBadgeColor = (role: Role) => {
    switch (role) {
      case 'CREATOR':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'REVIEWER':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'BRAND_ADMIN':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
      case 'VIEWER':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/40';
    }
  };

  const handleApplyCustomBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customBrandName.trim()) return;
    updateBrandInfo(customBrandName.trim());
    setIsCustomBrandModal(false);
    setCustomBrandName('');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0B111E]/95 backdrop-blur-md border-b border-[#1E293B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Brand Switcher */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="flex items-center space-x-3 text-left">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="w-10 h-10 rounded-xl bg-[#0F172A] border border-blue-500/40 p-1 flex items-center justify-center shadow-lg shadow-blue-500/20 hover:scale-105 hover:border-blue-400 transition-all cursor-pointer overflow-hidden shrink-0"
                  title="BrandLens Home"
                >
                  <img
                    src="\public\assets\aistudio\WhatsApp Image 2026-10-29 at 4.30.14 PM.jpeg"
                    alt="BrandLens Logo"
                    className="w-full h-full object-contain drop-shadow"
                  />
                </button>
                <div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className="flex items-center space-x-1.5 cursor-pointer text-left focus:outline-none"
                    >
                      <span className="font-bold text-white text-base tracking-tight font-sans">
                        BrandLens
                      </span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
                        v1.0
                      </span>
                    </button>
                    <span className="text-slate-600 text-xs">|</span>
                    <button
                      onClick={() => setIsBrandMenuOpen(!isBrandMenuOpen)}
                      className="text-[11px] text-slate-300 hover:text-white flex items-center space-x-1 cursor-pointer group bg-[#131B2A] hover:bg-[#1A2538] px-2 py-0.5 rounded-md border border-[#1E293B] transition-colors"
                      title="Click to switch or rename brand workspace"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform"></span>
                      <span className="font-medium text-slate-300 group-hover:text-white">
                        {brandKit.brandName}
                      </span>
                      <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-white" />
                    </button>
                  </div>
                  <p className="text-[10px] font-semibold tracking-wider text-cyan-400/95 font-sans mt-0.5 uppercase">
                    One Brand, One Voice
                  </p>
                </div>
              </div>

              {/* Brand Switcher Dropdown */}
              {isBrandMenuOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-[#131B2A] border border-[#1E293B] rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 border-b border-[#1E293B] flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-slate-400">
                      Brand Workspaces
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      Multi-Tenant
                    </span>
                  </div>
                  <div className="py-1">
                    {availableBrands.map((bName) => (
                      <button
                        key={bName}
                        onClick={() => {
                          switchBrand(bName);
                          setIsBrandMenuOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-[#162136] flex items-center justify-between text-xs transition-colors cursor-pointer"
                      >
                        <span className={brandKit.brandName === bName ? 'text-white font-semibold' : 'text-slate-300'}>
                          {bName}
                        </span>
                        {brandKit.brandName === bName && (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="pt-1 border-t border-[#1E293B] px-2">
                    <button
                      onClick={() => {
                        setIsBrandMenuOpen(false);
                        setCustomBrandName(brandKit.brandName);
                        setIsCustomBrandModal(true);
                      }}
                      className="w-full text-left px-2 py-1.5 text-xs text-blue-400 hover:text-blue-300 hover:bg-[#162136] rounded-md transition-colors cursor-pointer flex items-center space-x-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Edit or Add New Brand...</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center space-x-1 pl-4 border-l border-[#1E293B]">
              {navItems.map((item) => {
                const isActive = activeTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    onClick={() => setActiveTab(item.tab)}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-md text-xs font-medium transition-colors relative cursor-pointer ${
                      isActive
                        ? 'bg-[#162136] text-white border border-[#2563EB]/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#131B2A]'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-slate-950">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User Persona Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2.5 bg-[#131B2A] hover:bg-[#162136] border border-[#1E293B] hover:border-[#2E3F5B] px-3 py-1.5 rounded-full text-xs transition-colors cursor-pointer"
              title="Click to switch persona role"
            >
              <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center text-[11px] font-bold text-white border border-slate-600">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  currentUser.name[0]
                )}
              </div>
              <span className="font-medium text-slate-200">{currentUser.name}</span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getRoleBadgeColor(
                  currentUser.role
                )}`}
              >
                {currentUser.role}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Persona Switcher Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-[#131B2A] border border-[#1E293B] rounded-xl shadow-2xl py-2 z-50">
                <div className="px-3.5 py-2 border-b border-[#1E293B]">
                  <p className="text-[11px] font-mono uppercase text-slate-400">
                    Switch Persona (RBAC Testing)
                  </p>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Test creator vs reviewer governance workflows
                  </p>
                </div>
                <div className="py-1">
                  {allUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        setCurrentUser(user);
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-3.5 py-2 text-left hover:bg-[#162136] flex items-center justify-between text-xs transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            user.name[0]
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-200">{user.name}</p>
                          <p className="text-[10px] text-slate-400">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full border ${getRoleBadgeColor(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                        {currentUser.id === user.id && (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="px-3.5 py-2 bg-[#0E1524] border-t border-[#1E293B] text-[11px] text-slate-400 space-y-2">
                  <div>
                    <span className="font-semibold text-slate-300">RBAC Rule:</span> Creators cannot self-approve their own submissions.
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('login');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-center py-1.5 px-2 bg-blue-950/60 hover:bg-blue-900/60 text-blue-300 border border-blue-850 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Open Sign-In Page (4 Personas)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit or Add Brand Modal */}
      {isCustomBrandModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity"
            onClick={() => setIsCustomBrandModal(false)}
          />
          <div className="relative bg-[#131B2A] border border-[#1E293B] rounded-2xl shadow-2xl max-w-md w-full p-6 z-10 text-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-white tracking-tight">
              Switch or Rename Brand Workspace
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Enter any brand name (e.g. "Amazon", "Amazon Devices", "Acme", etc.). All governance rules, guidelines, and review collateral will belong to this brand.
            </p>

            <form onSubmit={handleApplyCustomBrand} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={customBrandName}
                  onChange={(e) => setCustomBrandName(e.target.value)}
                  placeholder="e.g. Amazon, Nike, Apple..."
                  required
                  autoFocus
                  className="w-full bg-[#0B111E] border border-[#1E293B] rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-sans"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-[#1E293B]">
                <button
                  type="button"
                  onClick={() => setIsCustomBrandModal(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-blue-600/30 cursor-pointer"
                >
                  Apply Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
