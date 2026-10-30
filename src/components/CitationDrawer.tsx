import React from 'react';
import { X, BookOpen, AlertCircle, ShieldAlert, Award, FileText, CheckCircle2, Calendar, UserCheck } from 'lucide-react';
import { useBrandLens } from '../lib/store';

export const CitationDrawer: React.FC = () => {
  const { inspectingCitation, setInspectingCitation } = useBrandLens();

  if (!inspectingCitation) return null;

  const isSource = inspectingCitation.type === 'approved_source';
  const isExpired = inspectingCitation.isExpired;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={() => setInspectingCitation(null)}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-[#131B2A] border-l border-[#1E293B] shadow-2xl flex flex-col h-full z-10 text-slate-200 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#1E293B] flex items-center justify-between bg-[#162136]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              {isSource ? <Award className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-wider uppercase text-blue-400 block font-semibold">
                {isSource ? 'APPROVED EVIDENCE SOURCE' : 'BRAND GUIDELINE CITATION'}
              </span>
              <span className="text-xs font-mono text-slate-400">{inspectingCitation.id}</span>
            </div>
          </div>
          <button
            onClick={() => setInspectingCitation(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Title & Status Badges */}
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight leading-snug">
              {inspectingCitation.title}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-blue-900/40 text-blue-300 border border-blue-700/50">
                {isSource ? 'FACT' : 'RULE'}
              </span>
              {isExpired ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-900/50 text-rose-300 border border-rose-700/60 flex items-center space-x-1">
                  <ShieldAlert className="w-3 h-3" />
                  <span>EXPIRED / OUTDATED</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-900/40 text-emerald-300 border border-emerald-700/50 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>ACTIVE / VALIDATED</span>
                </span>
              )}
              {inspectingCitation.owner && (
                <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                  <UserCheck className="w-3 h-3 text-slate-500" />
                  <span>Owner: {inspectingCitation.owner}</span>
                </span>
              )}
            </div>
          </div>

          {/* Dates Metadata */}
          {(inspectingCitation.effectiveFrom || inspectingCitation.reviewAfter) && (
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-lg bg-[#0E1524] border border-[#1E293B] text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500 block">
                  Effective From
                </span>
                <span className="font-mono text-slate-200 mt-0.5  flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>{inspectingCitation.effectiveFrom || '1/1/2023'}</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500 block">
                  Review Date
                </span>
                <span
                  className={`font-mono font-medium mt-0.5  flex items-center space-x-1 ${
                    isExpired ? 'text-rose-400' : 'text-slate-200'
                  }`}
                >
                  <Calendar className="w-3 h-3" />
                  <span>{inspectingCitation.reviewAfter || '1/1/2024'}</span>
                </span>
              </div>
            </div>
          )}

          {/* Substantiated Statement Text */}
          {inspectingCitation.substantiatedStatementText && (
            <div>
              <h3 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2">
                SUBSTANTIATED STATEMENT TEXT
              </h3>
              <div className="p-3.5 rounded-lg bg-[#0B111E] border border-[#1E293B] text-sm text-slate-200 font-sans italic leading-relaxed">
                "{inspectingCitation.substantiatedStatementText}"
              </div>
            </div>
          )}

          {/* Evidence-Linked Brand Principle Box */}
          <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-900/60 text-xs space-y-2">
            <div className="flex items-center space-x-2 text-blue-300 font-semibold text-xs">
              <ShieldAlert className="w-4 h-4 text-blue-400" />
              <span>Evidence-Linked Brand Principle</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {inspectingCitation.brandPrinciple ||
                'Every finding flagged by BrandLens is tied to an explicit rule in the Northwind Home Brand Kit or an Approved Evidence Source. Unsubstantiated claims and rejects are strictly prohibited.'}
            </p>
          </div>

          {/* Expiration Regulatory Notice if Expired */}
          {isExpired && (
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/50 text-xs space-y-1.5 text-rose-300">
              <div className="flex items-center space-x-1.5 font-semibold">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>Regulatory Risk Disclosure</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Under FTC and EU commercial advertising statutes, citing expired benchmark studies or award titles as active present-tense performance guarantees constitutes deceptive trade practice.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1E293B] bg-[#162136] flex justify-end">
          <button
            onClick={() => setInspectingCitation(null)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            Close Citation
          </button>
        </div>
      </div>
    </div>
  );
};
