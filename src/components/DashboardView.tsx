import React, { useState } from 'react';
import {
  ShieldAlert,
  Plus,
  ArrowRight,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Activity,
  ScrollText,
  Sparkles,
} from 'lucide-react';
import { useBrandLens } from '../lib/store';
import { ContentChannel, ContentFormat, ContentStatus } from '../lib/types';
// import { NewContentModal } from './NewContentModal';
import { CreateNewContentModal } from './CreateNewContentModal';

export const DashboardView: React.FC = () => {
  const {
    contentItems,
    setActiveContentId,
    setActiveTab,
    auditLogs,
    currentUser,
    brandKit,
  } = useBrandLens();

  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [channelFilter, setChannelFilter] = useState<string>('ALL');
  const [formatFilter, setFormatFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // RBAC SCOPING:
  // CREATOR: Show ONLY their own items (author.id === user.id)
  // VIEWER: View only APPROVED or PUBLISHED items
  // REVIEWER & BRAND_ADMIN: View ALL items
  const roleScopedItems = contentItems.filter((item) => {
    if (currentUser.role === 'CREATOR') {
      return item.author.id === currentUser.id || item.author.email === currentUser.email;
    }
    if (currentUser.role === 'VIEWER') {
      return item.status === 'APPROVED' || item.status === 'PUBLISHED';
    }
    return true;
  });

  // Calculate blockers across role-scoped items
  const totalBlockers = roleScopedItems.reduce((acc, item) => {
    const activeV = item.versions.find((v) => v.id === item.activeVersionId) || item.versions[0];
    return acc + (activeV?.blockersCount || 0);
  }, 0);

  // Counts by status
  const draftsCount = roleScopedItems.filter((i) => i.status === 'DRAFT').length;
  const submittedCount = roleScopedItems.filter((i) => i.status === 'SUBMITTED').length;
  const inReviewCount = roleScopedItems.filter((i) => i.status === 'IN_REVIEW').length;
  const revisionsCount = roleScopedItems.filter((i) => i.status === 'CHANGES_REQUESTED').length;
  const approvedCount = roleScopedItems.filter((i) => i.status === 'APPROVED').length;
  const publishedCount = roleScopedItems.filter((i) => i.status === 'PUBLISHED').length;

  const filterTabs = [
    { id: 'ALL', label: `All Items ${roleScopedItems.length}` },
    { id: 'DRAFT', label: `Drafts ${draftsCount}` },
    { id: 'SUBMITTED', label: `Submitted ${submittedCount}` },
    { id: 'IN_REVIEW', label: `In Review ${inReviewCount}` },
    { id: 'CHANGES_REQUESTED', label: `Revisions ${revisionsCount}` },
    { id: 'APPROVED', label: `Approved ${approvedCount}` },
    { id: 'PUBLISHED', label: `Published ${publishedCount}` },
  ];

  // Filter items
  const filteredItems = roleScopedItems.filter((item) => {
    if (activeFilter !== 'ALL' && item.status !== activeFilter) return false;
    if (channelFilter !== 'ALL' && item.channel !== channelFilter) return false;
    if (formatFilter !== 'ALL' && item.format !== formatFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.channel.toLowerCase().includes(q) ||
        item.format.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: ContentStatus) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-slate-800 text-slate-300 border-slate-700';
      case 'SUBMITTED':
        return 'bg-blue-900/40 text-blue-300 border-blue-700/60';
      case 'IN_REVIEW':
        return 'bg-amber-900/40 text-amber-300 border-amber-700/60';
      case 'CHANGES_REQUESTED':
        return 'bg-orange-900/40 text-orange-300 border-orange-700/60';
      case 'APPROVED':
        return 'bg-emerald-900/40 text-emerald-300 border-emerald-700/60';
      case 'PUBLISHED':
        return 'bg-cyan-900/40 text-cyan-300 border-cyan-700/60';
    }
  };

  const handleOpenWorkspace = (id: string) => {
    setActiveContentId(id);
    setActiveTab('workspace');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1E293B]">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl font-bold text-white tracking-tight font-sans">
              Governance Dashboard
            </h1>
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-blue-900/40 text-blue-300 border border-blue-700/50">
              Northwind Home
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time compliance monitoring across pre-publication marketing & product collateral
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {totalBlockers > 0 && (
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs font-mono font-medium shadow-sm">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>{totalBlockers} Publication Blockers</span>
            </div>
          )}

          {currentUser.role === 'CREATOR' && (
            <button
              onClick={() => setIsNewModalOpen(true)}
              className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ New Content</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs Row */}
      <div className="mt-6 flex flex-wrap items-center gap-1.5 pb-2">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              activeFilter === tab.id
                ? 'bg-[#1E293B] text-white border border-slate-600 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#131B2A]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search and Filters Bar */}
      <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-[#131B2A] rounded-xl border border-[#1E293B]">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search collateral titles..."
            className="w-full bg-[#0B111E] border border-[#1E293B] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end text-xs">
          <div className="flex items-center space-x-1 text-slate-400 font-mono text-[11px]">
            <Filter className="w-3.5 h-3.5" />
            <span>Channel:</span>
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="bg-[#0B111E] border border-[#1E293B] rounded px-2 py-1 text-slate-200 cursor-pointer focus:outline-none"
            >
              <option value="ALL">All Channels</option>
              <option value="PRESS">PRESS</option>
              <option value="BLOG">BLOG</option>
              <option value="INTERNAL">INTERNAL</option>
              <option value="LANDING">LANDING</option>
              <option value="SOCIAL">SOCIAL</option>
              <option value="EMAIL">EMAIL</option>
              <option value="SUPPORT">SUPPORT</option>
            </select>
          </div>

          <div className="flex items-center space-x-1 text-slate-400 font-mono text-[11px]">
            <span>Format:</span>
            <select
              value={formatFilter}
              onChange={(e) => setFormatFilter(e.target.value)}
              className="bg-[#0B111E] border border-[#1E293B] rounded px-2 py-1 text-slate-200 cursor-pointer focus:outline-none"
            >
              <option value="ALL">All Formats</option>
              <option value="TEXT">TEXT</option>
              <option value="MARKDOWN">MARKDOWN</option>
              <option value="DOCX">DOCX</option>
              <option value="PDF">PDF</option>
              <option value="IMAGE">IMAGE</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Collateral List (Left) + Principles & Live Stream (Right) */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collateral Cards Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-3.5">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center bg-[#131B2A] rounded-xl border border-[#1E293B]">
              <p className="text-sm text-slate-400">No content items found matching current filters.</p>
              <button
                onClick={() => {
                  setActiveFilter('ALL');
                  setChannelFilter('ALL');
                  setFormatFilter('ALL');
                  setSearchQuery('');
                }}
                className="mt-3 text-xs text-blue-400 hover:underline cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredItems.map((item) => {
              const activeV =
                item.versions.find((v) => v.id === item.activeVersionId) ||
                item.versions[item.versions.length - 1];
              const blockers = activeV?.blockersCount || 0;
              const totalFindings = activeV?.totalFindingsCount || 0;
              const readiness = activeV?.readinessScore ?? 100;

              return (
                <div
                  key={item.id}
                  className="bg-[#131B2A] hover:bg-[#162136] border border-[#1E293B] hover:border-[#2E3F5B] rounded-xl p-4 transition-all shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${getStatusBadge(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {item.channel}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {item.format}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                      {item.title}
                    </h3>

                    <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                      <span>Author: {item.author.name}</span>
                      <span>•</span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="font-mono text-slate-400">v{item.currentVersion}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    {/* Findings & Readiness status pill */}
                    {blockers > 0 ? (
                      <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-rose-950/60 text-rose-300 border border-rose-800/80 flex items-center space-x-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                        <span>{blockers} {blockers === 1 ? 'Blocker' : 'Blockers'}</span>
                      </span>
                    ) : totalFindings > 0 ? (
                      <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-amber-950/40 text-amber-300 border border-amber-800/60 flex items-center space-x-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        <span>{totalFindings} Open Issues</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-emerald-950/40 text-emerald-300 border border-emerald-800/60 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Compliant (100%)</span>
                      </span>
                    )}

                    <button
                      onClick={() => handleOpenWorkspace(item.id)}
                      className="px-3.5 py-1.5 bg-[#1E293B] hover:bg-blue-600 text-slate-200 hover:text-white rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Open</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Rail: Core Principles & Governance Audit Stream */}
        <div className="space-y-6">
          {/* Card: Core Principles */}
          <div className="bg-[#131B2A] border border-[#1E293B] rounded-xl p-5 shadow-sm">
            <div className="flex items-center space-x-2 pb-3.5 border-b border-[#1E293B]">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-white">
                CORE BRANDLENS PRINCIPLES
              </h3>
            </div>
            <div className="mt-4 space-y-3.5 text-xs">
              <div className="space-y-1">
                <p className="font-semibold text-slate-200">1. Explain, Never Reject</p>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  100% of findings include plain-language rationale and citations to rules or sources.
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-slate-200">2. Human Authority</p>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  All corrections are proposals requiring explicit human Accept, Edit, or Reject. Never auto-applied.
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-slate-200">3. Evidence-Linked</p>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Citations link directly to verified Brand Guidelines or Approved Fact Sources with expiration dates.
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-slate-200">4. Server-Authoritative RBAC</p>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Permission enforcement executes strictly in router handlers. Creators cannot self-approve.
                </p>
              </div>
            </div>
          </div>

          {/* Card: Live Governance Audit Stream */}
          <div className="bg-[#131B2A] border border-[#1E293B] rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#1E293B]">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-white">
                  GOVERNANCE AUDIT STREAM
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('settings')}
                className="text-[11px] font-mono text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
              >
                Full Log
              </button>
            </div>

            <div className="mt-3 divide-y divide-[#1E293B]/60 max-h-72 overflow-y-auto">
              {auditLogs.slice(-5).reverse().map((log) => (
                <div key={log.id} className="py-2.5 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-blue-400 text-[10px]">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-tight line-clamp-2">
                    {log.details}
                  </p>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Actor: {log.actor.name} ({log.actor.role})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <CreateNewContentModal isOpen={isNewModalOpen} onClose={() => setIsNewModalOpen(false)} />
    </div>
  );
};
