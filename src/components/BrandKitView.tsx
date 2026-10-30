import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Award,
  Layers,
  Palette,
  Sliders,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Sparkles,
  Building2,
  Edit3,
  Check,
} from 'lucide-react';
import { useBrandLens } from '../lib/store';
import {
  ApprovedSource,
  Guideline,
  TerminologyTerm,
  ApprovedAsset,
  FindingCategory,
  FindingSeverity,
} from '../lib/types';

export const BrandKitView: React.FC = () => {
  const {
    brandKit,
    availableBrands,
    switchBrand,
    updateBrandInfo,
    setInspectingCitation,
    currentUser,
    updateToneProfile,
    addGuideline,
    addTerm,
    addSource,
    addAsset,
  } = useBrandLens();

  type BrandKitTab = 'guidelines' | 'terms' | 'sources' | 'assets' | 'tone';
  const [activeTab, setActiveTab] = useState<BrandKitTab>('guidelines');

  // Tone profile form state
  const [toneForm, setToneForm] = useState(brandKit.toneProfile);
  const [toneSaved, setToneSaved] = useState(false);

  // Sync tone profile when brand switches
  useEffect(() => {
    setToneForm(brandKit.toneProfile);
  }, [brandKit]);

  // Brand Switch / Edit Modal
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [customBrandName, setCustomBrandName] = useState(brandKit.brandName);
  const [customTagline, setCustomTagline] = useState(brandKit.brandTagline || '');

  // Add Item Modals
  const [showAddGuideline, setShowAddGuideline] = useState(false);
  const [newGuideline, setNewGuideline] = useState<{
    id: string;
    category: FindingCategory;
    ruleCode: string;
    title: string;
    description: string;
    severity: FindingSeverity;
    compliant: string;
    violation: string;
  }>({
    id: 'GUIDE-NEW',
    category: 'tone',
    ruleCode: 'TONE-VOICE',
    title: '',
    description: '',
    severity: 'HIGH',
    compliant: '',
    violation: '',
  });

  const [showAddTerm, setShowAddTerm] = useState(false);
  const [newTerm, setNewTerm] = useState<{
    term: string;
    preferred: string;
    category: 'BRAND_NAME' | 'PRODUCT_NAME' | 'SALES_CLAIM' | 'TECHNICAL';
    explanation: string;
  }>({
    term: '',
    preferred: '',
    category: 'BRAND_NAME',
    explanation: '',
  });

  const [showAddSource, setShowAddSource] = useState(false);
  const [newSource, setNewSource] = useState<{
    id: string;
    factType: 'AWARD' | 'ENERGY_STUDY' | 'MARKET_SHARE' | 'CERTIFICATION' | 'CUSTOMER_COUNT' | 'PRICING';
    title: string;
    substantiatedStatementText: string;
    owner: string;
    effectiveFrom: string;
    reviewAfter: string;
  }>({
    id: `SRC-${Date.now().toString().slice(-4)}`,
    factType: 'CERTIFICATION',
    title: '',
    substantiatedStatementText: '',
    owner: 'Brand & Legal Affairs',
    effectiveFrom: '2026-01-01',
    reviewAfter: '2027-01-01',
  });

  const [showAddAsset, setShowAddAsset] = useState(false);
  const [newAsset, setNewAsset] = useState<{
    id: string;
    name: string;
    type: 'LOGO' | 'PALETTE' | 'HERO_IMAGE';
    description: string;
    previewUrl: string;
    dHash: string;
    paletteHex: string[];
  }>({
    id: `ASSET-${Date.now().toString().slice(-4)}`,
    name: '',
    type: 'LOGO',
    description: '',
    previewUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    dHash: 'c7e2b1a9f0d48e23',
    paletteHex: ['#FF9900', '#146EB4', '#000000'],
  });

  const handleSaveTone = (e: React.FormEvent) => {
    e.preventDefault();
    updateToneProfile(toneForm);
    setToneSaved(true);
    setTimeout(() => setToneSaved(false), 2500);
  };

  const handleSaveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (customBrandName.trim()) {
      updateBrandInfo(customBrandName.trim(), customTagline.trim());
      setShowBrandModal(false);
    }
  };

  const handleCreateGuideline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuideline.title || !newGuideline.description) return;
    addGuideline({
      id: newGuideline.id || `GUIDE-${Date.now().toString().slice(-4)}`,
      category: newGuideline.category,
      ruleCode: newGuideline.ruleCode || 'BRAND-RULE',
      title: newGuideline.title,
      description: newGuideline.description,
      severity: newGuideline.severity,
      examples: {
        compliant: [newGuideline.compliant || 'Approved phrasing according to brand rules.'],
        violation: [newGuideline.violation || 'Unapproved phrasing that violates guidelines.'],
      },
    });
    setShowAddGuideline(false);
    setNewGuideline({
      id: 'GUIDE-NEW',
      category: 'tone',
      ruleCode: 'TONE-VOICE',
      title: '',
      description: '',
      severity: 'HIGH',
      compliant: '',
      violation: '',
    });
  };

  const handleCreateTerm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTerm.term || !newTerm.preferred) return;
    addTerm({
      id: `TERM-${Date.now().toString().slice(-4)}`,
      term: newTerm.term.trim(),
      preferred: newTerm.preferred.trim(),
      category: newTerm.category,
      explanation: newTerm.explanation.trim() || 'Required brand terminology replacement.',
    });
    setShowAddTerm(false);
    setNewTerm({ term: '', preferred: '', category: 'BRAND_NAME', explanation: '' });
  };

  const handleCreateSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSource.title || !newSource.substantiatedStatementText) return;
    addSource({
      id: newSource.id,
      title: newSource.title,
      factType: newSource.factType,
      owner: newSource.owner || 'Compliance Team',
      effectiveFrom: newSource.effectiveFrom,
      reviewAfter: newSource.reviewAfter,
      isExpired: new Date(newSource.reviewAfter).getTime() < Date.now(),
      substantiatedStatementText: newSource.substantiatedStatementText,
      allowedSuperlatives: [],
      numericMetrics: {},
    });
    setShowAddSource(false);
    setNewSource({
      id: `SRC-${Date.now().toString().slice(-4)}`,
      factType: 'CERTIFICATION',
      title: '',
      substantiatedStatementText: '',
      owner: 'Brand & Legal Affairs',
      effectiveFrom: '2026-01-01',
      reviewAfter: '2027-01-01',
    });
  };

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsset.name) return;
    addAsset({
      id: newAsset.id || `ASSET-${Date.now().toString().slice(-4)}`,
      name: newAsset.name,
      type: newAsset.type,
      description: newAsset.description || 'Approved brand asset token.',
      previewUrl: newAsset.previewUrl,
      dHash: newAsset.dHash,
      paletteHex: newAsset.paletteHex,
    });
    setShowAddAsset(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1E293B]">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold text-white tracking-tight font-sans">
              Brand Kit & Governance Reference
            </h1>
            {currentUser.role === 'BRAND_ADMIN' ? (
              <button
                onClick={() => {
                  setCustomBrandName(brandKit.brandName);
                  setCustomTagline(brandKit.brandTagline || '');
                  setShowBrandModal(true);
                }}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-mono font-semibold bg-blue-900/40 text-blue-300 border border-blue-700/60 hover:bg-blue-800/50 hover:border-blue-500 transition-all cursor-pointer shadow-xs"
                title="Click to switch or edit current brand"
              >
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Brand: {brandKit.brandName}</span>
                <Edit3 className="w-3 h-3 text-slate-400 ml-1" />
              </button>
            ) : (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-mono font-semibold bg-slate-800/60 text-slate-300 border border-slate-700">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Brand: {brandKit.brandName}</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Authoritative source of guidelines, terminology rules, approved facts, and visual assets for{' '}
            <span className="text-slate-200 font-semibold">{brandKit.brandName}</span>.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {currentUser.role === 'BRAND_ADMIN' && (
            <button
              onClick={() => {
                setCustomBrandName(brandKit.brandName);
                setCustomTagline(brandKit.brandTagline || '');
                setShowBrandModal(true);
              }}
              className="flex items-center space-x-1.5 text-xs font-medium text-slate-300 hover:text-white bg-[#131B2A] hover:bg-[#1A2538] border border-[#1E293B] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Switch / Edit Brand</span>
            </button>
          )}
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 bg-[#131B2A] border border-[#1E293B] px-3 py-1.5 rounded-lg">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Rules Version: 2026.4 (Active)</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#1E293B]">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('guidelines')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'guidelines'
                ? 'bg-[#1E293B] text-white border border-slate-600 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-[#131B2A]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Guidelines ({brandKit.guidelines.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-[#1E293B] text-white border border-slate-600 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-[#131B2A]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Terminology ({brandKit.terms.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sources')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'sources'
                ? 'bg-[#1E293B] text-white border border-slate-600 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-[#131B2A]'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Approved Sources ({brandKit.approvedSources.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('assets')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'assets'
                ? 'bg-[#1E293B] text-white border border-slate-600 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-[#131B2A]'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Approved Assets ({brandKit.approvedAssets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tone')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'tone'
                ? 'bg-[#1E293B] text-white border border-slate-600 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-[#131B2A]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Tone Profile Editor</span>
          </button>
        </div>

        {/* Action Button for Active Tab - Only visible to BRAND_ADMIN */}
        {currentUser.role === 'BRAND_ADMIN' && (
          <div>
            {activeTab === 'guidelines' && (
              <button
                onClick={() => setShowAddGuideline(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Guideline</span>
              </button>
            )}
            {activeTab === 'terms' && (
              <button
                onClick={() => setShowAddTerm(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Term Rule</span>
              </button>
            )}
            {activeTab === 'sources' && (
              <button
                onClick={() => setShowAddSource(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Approved Source</span>
              </button>
            )}
            {activeTab === 'assets' && (
              <button
                onClick={() => setShowAddAsset(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Approved Asset</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tab 1: Guidelines Grid */}
      {activeTab === 'guidelines' && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {brandKit.guidelines.map((g) => (
            <div
              key={g.id}
              className="bg-[#131B2A] border border-[#1E293B] rounded-xl p-5 hover:border-[#2E3F5B] transition-all shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/40 px-2 py-0.5 rounded border border-blue-800/50">
                  {g.id}
                </span>
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                    g.severity === 'BLOCKER'
                      ? 'bg-rose-950/50 text-rose-300 border border-rose-800/60'
                      : g.severity === 'HIGH'
                      ? 'bg-amber-950/40 text-amber-300 border border-amber-800/60'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {g.severity}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white">{g.title}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {g.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#1E293B] space-y-1.5 text-[11px]">
                <div className="flex items-start space-x-2 text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span className="text-slate-300 italic">
                    "{g.examples.compliant[0]}"
                  </span>
                </div>
                <div className="flex items-start space-x-2 text-rose-400">
                  <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span className="text-slate-400 italic line-through">
                    "{g.examples.violation[0]}"
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Terminology Table */}
      {activeTab === 'terms' && (
        <div className="mt-6 bg-[#131B2A] border border-[#1E293B] rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#162136] text-[11px] font-mono uppercase text-slate-400 border-b border-[#1E293B]">
              <tr>
                <th className="py-3 px-4">Avoid Term</th>
                <th className="py-3 px-4">Preferred Brand Term</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Rationale & Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/60 text-slate-300">
              {brandKit.terms.map((t) => (
                <tr key={t.id} className="hover:bg-[#162136]/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-rose-300">
                    "{t.term}"
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                    "{t.preferred}"
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                      {t.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 max-w-md">
                    {t.explanation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Approved Sources (Click to inspect in drawer) */}
      {activeTab === 'sources' && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {brandKit.approvedSources.map((s) => (
            <div
              key={s.id}
              onClick={() =>
                setInspectingCitation({
                  type: 'approved_source',
                  id: s.id,
                  title: s.title,
                  owner: s.owner,
                  effectiveFrom: s.effectiveFrom,
                  reviewAfter: s.reviewAfter,
                  isExpired: s.isExpired,
                  substantiatedStatementText: s.substantiatedStatementText,
                  brandPrinciple: `Verified under ${s.factType} category.`,
                })
              }
              className="bg-[#131B2A] border border-[#1E293B] hover:border-blue-600/60 rounded-xl p-5 transition-all cursor-pointer shadow-sm group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/40 px-2 py-0.5 rounded border border-blue-800/50">
                  {s.id}
                </span>
                <span className="text-[10px] font-mono text-slate-400 flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  <span>Review after: {s.reviewAfter}</span>
                </span>
              </div>

              <h3 className="text-sm font-semibold text-white mt-3 group-hover:text-blue-300 transition-colors">
                {s.title}
              </h3>

              <div className="mt-2.5 p-3 rounded-lg bg-[#0B111E] border border-[#1E293B]/80 text-xs text-slate-300 font-mono">
                "{s.substantiatedStatementText}"
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                <span>Owner: {s.owner}</span>
                <span className="text-blue-400 flex items-center space-x-1">
                  <span>Inspect Citation</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Approved Assets */}
      {activeTab === 'assets' && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brandKit.approvedAssets.map((asset) => (
            <div
              key={asset.id}
              className="bg-[#131B2A] border border-[#1E293B] rounded-xl overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div className="h-44 bg-[#0B111E] flex items-center justify-center p-4 border-b border-[#1E293B] overflow-hidden">
                {asset.previewUrl ? (
                  <img
                    src={asset.previewUrl}
                    alt={asset.name}
                    className="max-h-full max-w-full object-contain rounded"
                  />
                ) : (
                  <div className="text-center text-slate-500 font-mono text-xs">
                    No image preview
                  </div>
                )}
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-blue-400">{asset.id}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {asset.type}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-white">{asset.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">{asset.description}</p>
                </div>

                <div className="pt-2 border-t border-[#1E293B] space-y-1.5 text-[10px] font-mono text-slate-400">
                  {asset.dHash && (
                    <div className="flex items-center justify-between">
                      <span>dHash (Perceptual):</span>
                      <span className="text-slate-300 font-bold">{asset.dHash}</span>
                    </div>
                  )}
                  {asset.paletteHex && (
                    <div>
                      <div className="flex items-center space-x-1.5 mt-1">
                        {asset.paletteHex.map((hex) => (
                          <div
                            key={hex}
                            className="w-5 h-5 rounded-full border border-slate-700"
                            style={{ backgroundColor: hex }}
                            title={hex}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: Tone Profile Editor */}
      {activeTab === 'tone' && (
        <form onSubmit={handleSaveTone} className="mt-6 max-w-2xl bg-[#131B2A] border border-[#1E293B] rounded-xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-[#1E293B]">
            <div>
              <h3 className="text-sm font-semibold text-white">Brand Voice & Cadence Parameters</h3>
              <p className="text-xs text-slate-400">Configure deterministic syntactic and formality thresholds for {brandKit.brandName}</p>
            </div>
            {toneSaved && (
              <span className="text-xs font-mono text-emerald-400 flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Profile Saved</span>
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Target Formality Index (0-100)</span>
              <span className="font-mono text-blue-400 font-bold">{toneForm.targetFormality} / 100</span>
            </div>
            <input
              type="range"
              min="30"
              max="95"
              value={toneForm.targetFormality}
              onChange={(e) =>
                setToneForm({ ...toneForm, targetFormality: parseInt(e.target.value) })
              }
              className="w-full accent-blue-500 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400">Standard benchmark for {brandKit.brandName} copy</span>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Maximum Sentence Length (Words)</span>
              <span className="font-mono text-blue-400 font-bold">{toneForm.maxSentenceLength} words</span>
            </div>
            <input
              type="range"
              min="15"
              max="40"
              value={toneForm.maxSentenceLength}
              onChange={(e) =>
                setToneForm({ ...toneForm, maxSentenceLength: parseInt(e.target.value) })
              }
              className="w-full accent-blue-500 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400">Flag sentences exceeding this threshold to prevent cognitive fatigue</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Prohibited Slang & Promotional Hyperbole (comma separated)
            </label>
            <input
              type="text"
              value={toneForm.bannedSlang.join(', ')}
              onChange={(e) =>
                setToneForm({
                  ...toneForm,
                  bannedSlang: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                })
              }
              className="w-full bg-[#0B111E] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div className="pt-4 border-t border-[#1E293B] flex items-center justify-between">
            {currentUser.role === 'BRAND_ADMIN' ? (
              <>
                <span className="text-[11px] text-slate-400">Authorized as Brand Administrator</span>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-blue-600/30 transition-all cursor-pointer"
                >
                  Update Tone Profile
                </button>
              </>
            ) : (
              <span className="text-xs text-slate-400 font-mono italic w-full text-right">
                Read-only: Only BRAND_ADMIN role can modify tone profile parameters.
              </span>
            )}
          </div>
        </form>
      )}

      {/* Brand Switch / Edit Modal */}
      {showBrandModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-[#101726] border border-[#1E293B] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#1E293B]">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">Brand Governance & Workspace Identity</h3>
              </div>
              <button
                onClick={() => setShowBrandModal(false)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase text-slate-400 tracking-wider">
                Select Pre-Configured Brand Kit
              </label>
              <div className="grid grid-cols-2 gap-3">
                {availableBrands.map((brandName) => {
                  const isActive = brandKit.brandName === brandName;
                  return (
                    <button
                      key={brandName}
                      type="button"
                      onClick={() => {
                        switchBrand(brandName);
                        setShowBrandModal(false);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isActive
                          ? 'border-blue-500 bg-blue-950/40 text-white'
                          : 'border-[#1E293B] bg-[#0B111E] text-slate-300 hover:border-slate-700 hover:bg-[#131B2A]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs">{brandName}</span>
                        {isActive && <Check className="w-4 h-4 text-blue-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {brandName.includes('Amazon')
                          ? 'Customer obsession, Echo & Alexa rules'
                          : 'Nordic residential & heat pump governance'}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Brand Customization */}
            <form onSubmit={handleSaveBrand} className="space-y-4 pt-3 border-t border-[#1E293B]">
              <label className="block text-xs font-mono uppercase text-slate-400 tracking-wider">
                Or Customize For Your Own Brand
              </label>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Brand / Organization Name
                </label>
                <input
                  type="text"
                  value={customBrandName}
                  onChange={(e) => setCustomBrandName(e.target.value)}
                  placeholder="e.g. Amazon, Google, Nike, Acme..."
                  className="w-full bg-[#0B111E] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Brand Tagline / Mission (Optional)
                </label>
                <input
                  type="text"
                  value={customTagline}
                  onChange={(e) => setCustomTagline(e.target.value)}
                  placeholder="e.g. Earth's most customer-centric company"
                  className="w-full bg-[#0B111E] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowBrandModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-blue-600/30 transition-all cursor-pointer"
                >
                  Apply Brand Identity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Guideline Modal */}
      {showAddGuideline && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <form onSubmit={handleCreateGuideline} className="bg-[#101726] border border-[#1E293B] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <h3 className="text-base font-bold text-white">Add Brand Guideline Rule</h3>
              <button type="button" onClick={() => setShowAddGuideline(false)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Rule ID</label>
                <input
                  type="text"
                  value={newGuideline.id}
                  onChange={(e) => setNewGuideline({ ...newGuideline, id: e.target.value })}
                  className="w-full bg-[#0B111E] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-white font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                <select
                  value={newGuideline.category}
                  onChange={(e) => setNewGuideline({ ...newGuideline, category: e.target.value as FindingCategory })}
                  className="w-full bg-[#0B111E] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-white"
                >
                  <option value="tone">Tone</option>
                  <option value="terminology">Terminology</option>
                  <option value="messaging">Messaging</option>
                  <option value="claims">Claims</option>
                  <option value="visual">Visual</option>
                  <option value="accessibility">Accessibility</option>
                  <option value="confidentiality">Confidentiality</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Rule Code</label>
                <input
                  type="text"
                  placeholder="e.g. CLAIM-SUPERLATIVE"
                  value={newGuideline.ruleCode}
                  onChange={(e) => setNewGuideline({ ...newGuideline, ruleCode: e.target.value })}
                  className="w-full bg-[#0B111E] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-white font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Severity</label>
                <select
                  value={newGuideline.severity}
                  onChange={(e) => setNewGuideline({ ...newGuideline, severity: e.target.value as FindingSeverity })}
                  className="w-full bg-[#0B111E] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-white"
                >
                  <option value="BLOCKER">BLOCKER</option>
                  <option value="HIGH">HIGH</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Rule Title</label>
              <input
                type="text"
                placeholder="e.g. State Verified Technical Specifications"
                value={newGuideline.title}
                onChange={(e) => setNewGuideline({ ...newGuideline, title: e.target.value })}
                className="w-full bg-[#0B111E] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Guideline Description</label>
              <textarea
                placeholder="Plain-language brand rule explaining what is expected..."
                rows={3}
                value={newGuideline.description}
                onChange={(e) => setNewGuideline({ ...newGuideline, description: e.target.value })}
                className="w-full bg-[#0B111E] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-emerald-400 mb-1">Compliant Example</label>
              <input
                type="text"
                placeholder="Compliant statement..."
                value={newGuideline.compliant}
                onChange={(e) => setNewGuideline({ ...newGuideline, compliant: e.target.value })}
                className="w-full bg-[#0B111E] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-rose-400 mb-1">Violation Example</label>
              <input
                type="text"
                placeholder="Violating statement..."
                value={newGuideline.violation}
                onChange={(e) => setNewGuideline({ ...newGuideline, violation: e.target.value })}
                className="w-full bg-[#0B111E] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-white"
                required
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#1E293B]">
              <button type="button" onClick={() => setShowAddGuideline(false)} className="px-4 py-2 text-xs text-slate-400 hover:text-white cursor-pointer">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold cursor-pointer">Save Rule</button>
            </div>
          </form>
        </div>
      )}

      {/* Add Term Modal */}
      {showAddTerm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <form onSubmit={handleCreateTerm} className="bg-[#101726] border border-[#1E293B] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <h3 className="text-base font-bold text-white">Add Terminology Rule</h3>
              <button type="button" onClick={() => setShowAddTerm(false)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-rose-300 mb-1">Avoid Term / Phrase</label>
                <input
                  type="text"
                  placeholder="e.g. cheap, Alexa device"
                  value={newTerm.term}
                  onChange={(e) => setNewTerm({ ...newTerm, term: e.target.value })}
                  className="w-full bg-[#0B111E] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-white font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-emerald-300 mb-1">Preferred Brand Term</label>
                <input
                  type="text"
                  placeholder="e.g. accessible, Echo device"
                  value={newTerm.preferred}
                  onChange={(e) => setNewTerm({ ...newTerm, preferred: e.target.value })}
                  className="w-full bg-[#0B111E] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-white font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
              <select
                value={newTerm.category}
                onChange={(e) => setNewTerm({ ...newTerm, category: e.target.value as any })}
                className="w-full bg-[#0B111E] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-white"
              >
                <option value="BRAND_NAME">BRAND_NAME</option>
                <option value="PRODUCT_NAME">PRODUCT_NAME</option>
                <option value="SALES_CLAIM">SALES_CLAIM</option>
                <option value="TECHNICAL">TECHNICAL</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Brand Rationale & Explanation</label>
              <textarea
                placeholder="Why the avoid term is prohibited and how the preferred term upholds brand equity..."
                rows={3}
                value={newTerm.explanation}
                onChange={(e) => setNewTerm({ ...newTerm, explanation: e.target.value })}
                className="w-full bg-[#0B111E] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-white"
                required
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#1E293B]">
              <button type="button" onClick={() => setShowAddTerm(false)} className="px-4 py-2 text-xs text-slate-400 hover:text-white cursor-pointer">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold cursor-pointer">Save Term Rule</button>
            </div>
          </form>
        </div>
      )}

      {/* Add Approved Source Modal */}
      {showAddSource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <form onSubmit={handleCreateSource} className="bg-[#101726] border border-[#1E293B] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <h3 className="text-base font-bold text-white">Add Approved Source & Fact</h3>
              <button type="button" onClick={() => setShowAddSource(false)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Source Fact Title</label>
                <input
                  type="text"
                  placeholder="e.g. Battery Life Lab Specification"
                  value={newSource.title}
                  onChange={(e) => setNewSource({ ...newSource, title: e.target.value })}
                  className="w-full bg-[#0B111E] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Fact Type</label>
                <select
                  value={newSource.factType}
                  onChange={(e) => setNewSource({ ...newSource, factType: e.target.value as any })}
                  className="w-full bg-[#0B111E] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-white"
                >
                  <option value="CERTIFICATION">CERTIFICATION</option>
                  <option value="ENERGY_STUDY">ENERGY_STUDY</option>
                  <option value="AWARD">AWARD</option>
                  <option value="MARKET_SHARE">MARKET_SHARE</option>
                  <option value="CUSTOMER_COUNT">CUSTOMER_COUNT</option>
                  <option value="PRICING">PRICING</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Substantiated Statement / Fact Text</label>
              <textarea
                placeholder="Exact verified numerical claim or certified statement..."
                rows={3}
                value={newSource.substantiatedStatementText}
                onChange={(e) => setNewSource({ ...newSource, substantiatedStatementText: e.target.value })}
                className="w-full bg-[#0B111E] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-white font-mono"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Owner / Department</label>
                <input
                  type="text"
                  placeholder="e.g. Hardware QA Lab"
                  value={newSource.owner}
                  onChange={(e) => setNewSource({ ...newSource, owner: e.target.value })}
                  className="w-full bg-[#0B111E] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Review After (Expiry)</label>
                <input
                  type="date"
                  value={newSource.reviewAfter}
                  onChange={(e) => setNewSource({ ...newSource, reviewAfter: e.target.value })}
                  className="w-full bg-[#0B111E] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-white"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#1E293B]">
              <button type="button" onClick={() => setShowAddSource(false)} className="px-4 py-2 text-xs text-slate-400 hover:text-white cursor-pointer">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold cursor-pointer">Save Source Fact</button>
            </div>
          </form>
        </div>
      )}

      {/* Add Approved Asset Modal */}
      {showAddAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <form onSubmit={handleCreateAsset} className="bg-[#101726] border border-[#1E293B] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <h3 className="text-base font-bold text-white">Register Approved Brand Asset</h3>
              <button type="button" onClick={() => setShowAddAsset(false)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Asset Name</label>
                <input
                  type="text"
                  placeholder="e.g. Primary Smile Logo"
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                  className="w-full bg-[#0B111E] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Type</label>
                <select
                  value={newAsset.type}
                  onChange={(e) => setNewAsset({ ...newAsset, type: e.target.value as any })}
                  className="w-full bg-[#0B111E] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-white"
                >
                  <option value="LOGO">LOGO</option>
                  <option value="HERO_IMAGE">HERO_IMAGE</option>
                  <option value="PALETTE">PALETTE</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Asset Description</label>
              <textarea
                placeholder="Description of usage guidelines and context..."
                rows={2}
                value={newAsset.description}
                onChange={(e) => setNewAsset({ ...newAsset, description: e.target.value })}
                className="w-full bg-[#0B111E] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Image URL / Preview</label>
              <input
                type="text"
                placeholder="https://..."
                value={newAsset.previewUrl}
                onChange={(e) => setNewAsset({ ...newAsset, previewUrl: e.target.value })}
                className="w-full bg-[#0B111E] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-white font-mono"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#1E293B]">
              <button type="button" onClick={() => setShowAddAsset(false)} className="px-4 py-2 text-xs text-slate-400 hover:text-white cursor-pointer">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold cursor-pointer">Register Asset</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
