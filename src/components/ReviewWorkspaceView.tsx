// import React, { useState, useMemo } from 'react';
// import {
//   ShieldAlert,
//   ShieldCheck,
//   AlertTriangle,
//   CheckCircle2,
//   XCircle,
//   Edit3,
//   RotateCcw,
//   Sparkles,
//   Send,
//   Eye,
//   FileEdit,
//   GitCompare,
//   Upload,
//   MessageSquare,
//   HelpCircle,
//   ExternalLink,
//   ChevronRight,
//   Check,
//   X,
// } from 'lucide-react';
// import { useBrandLens } from '../lib/store';
// import { Finding, FindingCategory, FindingDecision, TextSpan } from '../lib/types';
// import confetti from 'canvas-confetti';

// export const ReviewWorkspaceView: React.FC = () => {
//   const {
//     activeContentItem,
//     activeVersion,
//     updateContentText,
//     reanalyzeContent,
//     acceptFindingFix,
//     editFindingFix,
//     rejectFindingFix,
//     submitForReview,
//     approveSubmission,
//     requestChangesSubmission,
//     publishContent,
//     setInspectingCitation,
//     selectedFindingId,
//     setSelectedFindingId,
//     comments,
//     addComment,
//     currentUser,
//     externalProcessing,
//   } = useBrandLens();

//   type ViewMode = 'preview' | 'editor' | 'diff';
//   const [viewMode, setViewMode] = useState<ViewMode>('preview');
//   const [editorContent, setEditorContent] = useState<string>(activeVersion?.rawContent || '');
//   const [decisionFilter, setDecisionFilter] = useState<'OPEN' | 'ALL' | 'DECIDED'>('OPEN');
//   const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

//   // Edit finding fix modal/state
//   const [editingFindingId, setEditingFindingId] = useState<string | null>(null);
//   const [customEditText, setCustomEditText] = useState<string>('');

//   // Reject finding reason modal/state
//   const [rejectingFindingId, setRejectingFindingId] = useState<string | null>(null);
//   const [rejectReason, setRejectReason] = useState<string>('Guideline is ambiguous in this marketing context');

//   // Request changes modal state
//   const [showRequestChangesModal, setShowRequestChangesModal] = useState<boolean>(false);
//   const [changesFeedback, setChangesFeedback] = useState<string>('');

//   // New comment input
//   const [newCommentText, setNewCommentText] = useState<string>('');
//   const [submitError, setSubmitError] = useState<string | null>(null);
//   const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

//   // Gemini AI intelligence simulation/execution
//   const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
//   const [aiSuggestions, setAiSuggestions] = useState<string | null>(null);

//   // Sync editor content with active version
//   React.useEffect(() => {
//     if (activeVersion) {
//       setEditorContent(activeVersion.rawContent);
//     }
//   }, [activeVersion?.id, activeVersion?.rawContent]);

//   if (!activeContentItem || !activeVersion) {
//     return (
//       <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">
//         No active content collateral selected. Please select an item from the Dashboard.
//       </div>
//     );
//   }

//   const findings = activeVersion.findings || [];

//   // Categorize counts
//   const openFindings = findings.filter((f) => f.status === 'OPEN');
//   const decidedFindings = findings.filter((f) => f.status !== 'OPEN');
//   const blockersCount = activeVersion.blockersCount;
//   const readiness = activeVersion.readinessScore;

//   // Filtered findings for right rail
//   const displayedFindings = findings.filter((f) => {
//     if (decisionFilter === 'OPEN' && f.status !== 'OPEN') return false;
//     if (decisionFilter === 'DECIDED' && f.status === 'OPEN') return false;
//     if (categoryFilter !== 'ALL' && f.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;
//     return true;
//   });

//   // Calculate circular SVG progress ring
//   const radius = 28;
//   const circumference = 2 * Math.PI * radius;
//   const strokeDashoffset = circumference - (readiness / 100) * circumference;

//   const handleApplyEditorChanges = () => {
//     updateContentText(activeContentItem.id, editorContent);
//     setViewMode('preview');
//   };

//   const handleStartEdit = (f: Finding) => {
//     setEditingFindingId(f.id);
//     setCustomEditText(f.suggestedFix.text);
//   };

//   const handleSaveEdit = (f: Finding) => {
//     editFindingFix(f.id, customEditText);
//     setEditingFindingId(null);
//   };

//   const handleStartReject = (f: Finding) => {
//     setRejectingFindingId(f.id);
//     setRejectReason('Guideline is ambiguous in this marketing context');
//   };

//   const handleConfirmReject = (f: Finding) => {
//     rejectFindingFix(f.id, rejectReason);
//     setRejectingFindingId(null);
//   };

//   const handleSubmitForReview = () => {
//     setSubmitError(null);
//     const res = submitForReview(activeContentItem.id);
//     if (!res.success) {
//       setSubmitError(res.error || 'Failed to submit.');
//     } else {
//       setSubmitSuccess(true);
//       confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
//       setTimeout(() => setSubmitSuccess(false), 3000);
//     }
//   };

//   const handleApprove = (stage: 'STAGE_1' | 'FINAL') => {
//     setSubmitError(null);
//     const res = approveSubmission(activeContentItem.id, stage);
//     if (!res.success) {
//       setSubmitError(res.error || 'Approval rejected.');
//     } else {
//       setSubmitSuccess(true);
//       confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
//       setTimeout(() => setSubmitSuccess(false), 3500);
//     }
//   };

//   const handleConfirmRequestChanges = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!changesFeedback.trim()) return;
//     setSubmitError(null);
//     const res = requestChangesSubmission(activeContentItem.id, changesFeedback.trim());
//     if (!res.success) {
//       setSubmitError(res.error || 'Failed to request changes.');
//     } else {
//       setSubmitSuccess(true);
//       setShowRequestChangesModal(false);
//       setChangesFeedback('');
//       setTimeout(() => setSubmitSuccess(false), 3500);
//     }
//   };

//   const handlePublish = () => {
//     setSubmitError(null);
//     const res = publishContent(activeContentItem.id);
//     if (!res.success) {
//       setSubmitError(res.error || 'Failed to publish.');
//     } else {
//       setSubmitSuccess(true);
//       confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 } });
//       setTimeout(() => setSubmitSuccess(false), 3500);
//     }
//   };

//   const handleAddComment = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newCommentText.trim()) return;
//     addComment(activeContentItem.id, newCommentText.trim());
//     setNewCommentText('');
//   };

//   const handleRunAiAssistance = () => {
//     setIsAiAnalyzing(true);
//     setTimeout(() => {
//       setIsAiAnalyzing(false);
//       setAiSuggestions(
//         `AI Executive Assessment:\n• Brand compliance score: ${readiness}%\n• Tone is overly sensationalized in paragraph 1\n• Recommendation: Rephrase superlatives to highlight independent thermal test benchmarks.`
//       );
//     }, 900);
//   };

//   // Render text with clickable highlighted spans
//   const renderMarkedPreview = () => {
//     const raw = activeVersion.rawContent;
//     if (!raw) return <span className="text-slate-500 italic">No content</span>;

//     // Filter open findings with spans
//     const openSpans = findings
//       .filter((f) => f.status === 'OPEN' && f.span && f.span.end > f.span.start)
//       .sort((a, b) => a.span.start - b.span.start);

//     if (openSpans.length === 0) {
//       return <div className="text-slate-200 whitespace-pre-wrap leading-relaxed">{raw}</div>;
//     }

//     const segments: React.ReactNode[] = [];
//     let currentIndex = 0;

//     openSpans.forEach((finding, idx) => {
//       const { start, end, text } = finding.span;

//       // Handle overlap or out of bounds safely
//       if (start < currentIndex || start >= raw.length) return;

//       // Preceding normal text
//       if (start > currentIndex) {
//         segments.push(
//           <span key={`text-${currentIndex}`}>
//             {raw.substring(currentIndex, start)}
//           </span>
//         );
//       }

//       const isSelected = selectedFindingId === finding.id;
//       let highlightClass = 'bg-amber-500/20 text-amber-200 border-b-2 border-amber-500';
//       let tagLabel = finding.ruleCode || finding.category.toUpperCase();

//       if (finding.category === 'confidentiality') {
//         highlightClass = 'bg-rose-500/25 text-rose-200 border-b-2 border-rose-500 font-medium';
//         tagLabel = 'CONF-BLOCK';
//       } else if (finding.category === 'terminology') {
//         highlightClass = 'bg-orange-500/25 text-orange-200 border-b-2 border-orange-500';
//         tagLabel = 'TERM-AVOID';
//       } else if (finding.category === 'claims') {
//         highlightClass = finding.severity === 'BLOCKER' 
//           ? 'bg-rose-500/20 text-rose-200 border-b-2 border-rose-400 font-semibold'
//           : 'bg-amber-500/25 text-amber-100 border-b-2 border-amber-400 font-semibold';
//         tagLabel = 'CLAIM';
//       } else if (finding.category === 'messaging') {
//         highlightClass = 'bg-blue-500/25 text-blue-200 border-b-2 border-blue-400';
//         tagLabel = 'MESSAGING';
//       } else if (finding.category === 'tone') {
//         highlightClass = 'bg-purple-500/25 text-purple-200 border-b-2 border-purple-400';
//         tagLabel = 'TONE';
//       } else if (finding.category === 'accessibility') {
//         highlightClass = 'bg-emerald-500/25 text-emerald-200 border-b-2 border-emerald-400';
//         tagLabel = 'A11Y';
//       }

//       segments.push(
//         <span
//           key={`span-${finding.id}-${idx}`}
//           onClick={() => {
//             setSelectedFindingId(finding.id);
//             setInspectingCitation(finding.citation);
//           }}
//           className={`relative px-1 py-0.5 rounded-xs transition-all cursor-pointer ${highlightClass} ${
//             isSelected ? 'ring-2 ring-blue-400 shadow-md scale-102 inline-block' : 'hover:opacity-85'
//           }`}
//           title={`${finding.why} (Click to inspect citation)`}
//         >
//           {raw.substring(start, end)}
//           <span className="ml-1 text-[9px] uppercase font-mono px-1 py-0.2 rounded bg-slate-900/80 text-white/90 border border-slate-700/80 align-middle">
//             {tagLabel}
//           </span>
//         </span>
//       );

//       currentIndex = end;
//     });

//     if (currentIndex < raw.length) {
//       segments.push(
//         <span key={`text-end`}>
//           {raw.substring(currentIndex)}
//         </span>
//       );
//     }

//     return (
//       <div className="text-slate-100 text-sm md:text-base whitespace-pre-wrap leading-relaxed font-sans select-text">
//         {segments}
//       </div>
//     );
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//       {/* Workspace Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#1E293B]">
//         <div className="space-y-1">
//           <div className="flex flex-wrap items-center gap-2">
//             <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
//               {activeContentItem.title}
//             </h1>
//             <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
//               {activeContentItem.channel}
//             </span>
//             <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
//               {activeContentItem.format}
//             </span>
//             <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-700/60 font-semibold">
//               {activeContentItem.status}
//             </span>
//           </div>

//           <div className="flex items-center space-x-3 text-xs text-slate-400">
//             <span>Author: {activeContentItem.author.name}</span>
//             <span>•</span>
//             <span className="font-mono text-slate-300">
//               Version {activeVersion.versionNumber} (Active)
//             </span>
//             <span>•</span>
//             <button
//               onClick={() => setViewMode(viewMode === 'diff' ? 'preview' : 'diff')}
//               className="text-blue-400 hover:text-blue-300 font-mono underline cursor-pointer"
//             >
//               {viewMode === 'diff' ? 'exit DIFF' : 'view DIFF'}
//             </button>
//           </div>
//         </div>

//         {/* Action Controls & Readiness Score Ring */}
//         <div className="flex items-center space-x-4">
//           <div className="flex items-center space-x-2">
//             <button
//               onClick={() => reanalyzeContent(activeContentItem.id)}
//               className="px-3 py-1.5 bg-[#1E293B] hover:bg-[#2E3F5B] text-slate-200 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
//               title="Rerun pure engine checks"
//             >
//               <RotateCcw className="w-3.5 h-3.5" />
//               <span>Re-analyse</span>
//             </button>

//             {externalProcessing && (
//               <button
//                 onClick={handleRunAiAssistance}
//                 disabled={isAiAnalyzing}
//                 className="px-3 py-1.5 bg-purple-900/30 hover:bg-purple-900/50 border border-purple-700/60 text-purple-300 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
//                 title="Optional Gemini Intelligence assist"
//               >
//                 <Sparkles className="w-3.5 h-3.5" />
//                 <span>{isAiAnalyzing ? 'Analyzing...' : 'AI Assist'}</span>
//               </button>
//             )}

//             {/* 1. CREATOR Actions: Submit for Review only. Hide Approve, Request Changes, and Publish */}
//             {currentUser.role === 'CREATOR' && (
//               <button
//                 onClick={handleSubmitForReview}
//                 disabled={blockersCount > 0 || activeContentItem.status === 'APPROVED' || activeContentItem.status === 'PUBLISHED'}
//                 className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-md transition-all cursor-pointer ${
//                   blockersCount > 0 || activeContentItem.status === 'APPROVED' || activeContentItem.status === 'PUBLISHED'
//                     ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-75'
//                     : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
//                 }`}
//                 title={
//                   blockersCount > 0
//                     ? 'Resolve all blockers before submitting for review'
//                     : 'Submit draft to Reviewer Queue'
//                 }
//               >
//                 <Send className="w-3.5 h-3.5" />
//                 <span>Submit for Review</span>
//               </button>
//             )}

//             {/* 2. REVIEWER Actions: Request Changes and Stage 1 Approve. Hide Submit and Publish */}
//             {currentUser.role === 'REVIEWER' && (
//               <div className="flex items-center space-x-2">
//                 <button
//                   onClick={() => setShowRequestChangesModal(true)}
//                   className="px-3 py-1.5 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-700 text-amber-300 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
//                   title="Request changes with comment"
//                 >
//                   <RotateCcw className="w-3.5 h-3.5" />
//                   <span>Request Changes</span>
//                 </button>

//                 <button
//                   onClick={() => handleApprove('STAGE_1')}
//                   disabled={blockersCount > 0 || activeContentItem.status === 'APPROVED' || activeContentItem.status === 'PUBLISHED'}
//                   className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-md transition-all cursor-pointer ${
//                     blockersCount > 0 || activeContentItem.status === 'APPROVED' || activeContentItem.status === 'PUBLISHED'
//                       ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-75'
//                       : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
//                   }`}
//                   title={blockersCount > 0 ? 'Cannot approve with active blockers' : 'Grant Stage 1 Approval'}
//                 >
//                   <CheckCircle2 className="w-3.5 h-3.5" />
//                   <span>Stage 1 Approve</span>
//                 </button>
//               </div>
//             )}

//             {/* 3. BRAND_ADMIN Actions: Stage 2 Approve and Publish. Hide Submit */}
//             {currentUser.role === 'BRAND_ADMIN' && (
//               <div className="flex items-center space-x-2">
//                 <button
//                   onClick={() => handleApprove('FINAL')}
//                   disabled={blockersCount > 0 || activeContentItem.status === 'PUBLISHED'}
//                   className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-md transition-all cursor-pointer ${
//                     blockersCount > 0 || activeContentItem.status === 'PUBLISHED'
//                       ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-75'
//                       : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30'
//                   }`}
//                   title={blockersCount > 0 ? 'Cannot approve with active blockers' : 'Grant Stage 2 Final Approval'}
//                 >
//                   <ShieldCheck className="w-3.5 h-3.5" />
//                   <span>Stage 2 Approve</span>
//                 </button>

//                 <button
//                   onClick={handlePublish}
//                   disabled={activeContentItem.status !== 'APPROVED'}
//                   className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-md transition-all cursor-pointer ${
//                     activeContentItem.status !== 'APPROVED'
//                       ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-75'
//                       : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/30'
//                   }`}
//                   title={activeContentItem.status !== 'APPROVED' ? 'Must achieve full approval before publishing' : 'Publish collateral live'}
//                 >
//                   <Send className="w-3.5 h-3.5" />
//                   <span>Publish</span>
//                 </button>
//               </div>
//             )}

//             {/* 4. VIEWER: Read-only badge */}
//             {currentUser.role === 'VIEWER' && (
//               <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
//                 View-Only Collateral
//               </span>
//             )}
//           </div>

//           {/* Readiness Score Ring Indicator */}
//           <div className="flex items-center space-x-3 pl-3 border-l border-[#1E293B]">
//             <div className="relative w-14 h-14 flex items-center justify-center">
//               <svg className="w-full h-full transform -rotate-90">
//                 <circle
//                   cx="28"
//                   cy="28"
//                   r={radius}
//                   className="stroke-slate-800"
//                   strokeWidth="4"
//                   fill="transparent"
//                 />
//                 <circle
//                   cx="28"
//                   cy="28"
//                   r={radius}
//                   className={blockersCount > 0 ? 'stroke-rose-500' : 'stroke-emerald-400'}
//                   strokeWidth="4"
//                   fill="transparent"
//                   strokeDasharray={circumference}
//                   strokeDashoffset={strokeDashoffset}
//                   strokeLinecap="round"
//                 />
//               </svg>
//               <span className="absolute text-xs font-mono font-bold text-white">
//                 {readiness}%
//               </span>
//             </div>

//             <div className="space-y-0.5">
//               <span className="text-[10px] font-mono uppercase text-slate-400 block tracking-wider">
//                 READINESS SCORE
//               </span>
//               <span
//                 className={`text-xs font-semibold block ${
//                   blockersCount > 0 ? 'text-rose-400' : 'text-emerald-400'
//                 }`}
//               >
//                 {blockersCount > 0 ? 'Publication Blocked' : 'Ready for Review'}
//               </span>
//               <div className="flex items-center space-x-1.5 text-[10px] font-mono text-slate-400">
//                 <span className={blockersCount > 0 ? 'text-rose-400 font-bold' : ''}>
//                   {blockersCount} Blockers
//                 </span>
//                 <span>•</span>
//                 <span>{findings.length} Total</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Submission Feedback Notices */}
//       {submitError && (
//         <div className="mt-4 p-3 rounded-lg bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs flex items-center space-x-2">
//           <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
//           <span>{submitError}</span>
//         </div>
//       )}
//       {submitSuccess && (
//         <div className="mt-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/80 text-emerald-300 text-xs flex items-center space-x-2">
//           <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
//           <span>Submitted successfully! Item is now queued for editorial reviewer approval.</span>
//         </div>
//       )}
//       {aiSuggestions && (
//         <div className="mt-4 p-3.5 rounded-lg bg-purple-950/30 border border-purple-800/60 text-purple-200 text-xs whitespace-pre-wrap flex justify-between items-start">
//           <div>{aiSuggestions}</div>
//           <button onClick={() => setAiSuggestions(null)} className="text-slate-400 hover:text-white cursor-pointer ml-3">
//             <X className="w-4 h-4" />
//           </button>
//         </div>
//       )}

//       {/* Main Workspace Grid: Document Inspection & Raw Editor (Left) + Findings & Suggestions (Right) */}
//       <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
//         {/* Left Document Pane (7 Cols) */}
//         <div className="lg:col-span-7 space-y-4">
//           {/* Subheader / Mode switcher */}
//           <div className="flex items-center justify-between bg-[#131B2A] border border-[#1E293B] rounded-xl px-4 py-2.5">
//             <div className="flex items-center space-x-2">
//               <button
//                 onClick={() => setViewMode('preview')}
//                 className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
//                   viewMode === 'preview'
//                     ? 'bg-blue-600 text-white shadow-xs'
//                     : 'text-slate-400 hover:text-slate-200 hover:bg-[#1E293B]'
//                 }`}
//               >
//                 <Eye className="w-3.5 h-3.5" />
//                 <span>Marked Inspection Preview</span>
//               </button>

//               <button
//                 onClick={() => setViewMode('editor')}
//                 className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
//                   viewMode === 'editor'
//                     ? 'bg-blue-600 text-white shadow-xs'
//                     : 'text-slate-400 hover:text-slate-200 hover:bg-[#1E293B]'
//                 }`}
//               >
//                 <FileEdit className="w-3.5 h-3.5" />
//                 <span>Raw Copy Editor</span>
//               </button>

//               <button
//                 onClick={() => setViewMode('diff')}
//                 className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
//                   viewMode === 'diff'
//                     ? 'bg-blue-600 text-white shadow-xs'
//                     : 'text-slate-400 hover:text-slate-200 hover:bg-[#1E293B]'
//                 }`}
//               >
//                 <GitCompare className="w-3.5 h-3.5" />
//                 <span>Diff & Anchored Comments</span>
//               </button>
//             </div>

//             <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
//               {viewMode === 'preview' ? 'Click highlighted span to inspect' : `${editorContent.split(/\s+/).filter(Boolean).length} words`}
//             </span>
//           </div>

//           {/* Mode 1: Marked Inspection Preview */}
//           {viewMode === 'preview' && (
//             <div className="bg-[#131B2A] border border-[#1E293B] rounded-xl p-6 min-h-105 shadow-sm flex flex-col justify-between">
//               <div>
//                 {activeContentItem.mediaUrl && (
//                   <div className="mb-5 rounded-lg overflow-hidden border border-[#1E293B] bg-[#0B111E] p-2 flex justify-center">
//                     <img
//                       src={activeContentItem.mediaUrl}
//                       alt="Uploaded media preview"
//                       className="max-h-64 object-contain rounded"
//                     />
//                   </div>
//                 )}
//                 {renderMarkedPreview()}
//               </div>

//               <div className="mt-8 pt-4 border-t border-[#1E293B] flex items-center justify-between text-xs text-slate-400 font-mono">
//                 <span>Deterministic Category Engines: Active (7/7)</span>
//                 <span>Zero auto-apply rule enforced</span>
//               </div>
//             </div>
//           )}

//           {/* Mode 2: Raw Copy Editor */}
//           {viewMode === 'editor' && (
//             <div className="bg-[#131B2A] border border-[#1E293B] rounded-xl p-5 shadow-sm space-y-3">
//               <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
//                 <span>{currentUser.role === 'CREATOR' ? 'Direct Markdown / Copy Editor' : 'Read-Only Document Content'}</span>
//                 <span className={currentUser.role === 'CREATOR' ? 'text-slate-400' : 'text-amber-400 font-bold'}>
//                   {currentUser.role === 'CREATOR' ? 'Type and click Update to trigger engine' : `View-Only for Role [${currentUser.role}]`}
//                 </span>
//               </div>
//               <textarea
//                 value={editorContent}
//                 onChange={(e) => setEditorContent(e.target.value)}
//                 readOnly={currentUser.role !== 'CREATOR'}
//                 disabled={currentUser.role !== 'CREATOR'}
//                 rows={14}
//                 className={`w-full bg-[#0B111E] border border-[#1E293B] rounded-lg p-4 text-sm font-mono text-slate-100 focus:outline-none leading-relaxed ${
//                   currentUser.role !== 'CREATOR' ? 'opacity-75 cursor-not-allowed' : 'focus:border-blue-500'
//                 }`}
//                 placeholder="Content..."
//               />
//               <div className="flex items-center justify-between pt-2">
//                 <span className="text-xs text-slate-400">
//                   {currentUser.role === 'CREATOR'
//                     ? 'Modifying content resets resolved spans.'
//                     : 'Permission Notice: Only the CREATOR author role can modify draft copy.'}
//                 </span>
//                 {currentUser.role === 'CREATOR' && (
//                   <button
//                     onClick={handleApplyEditorChanges}
//                     className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-blue-600/30 cursor-pointer"
//                   >
//                     Update & Re-analyse Content
//                   </button>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Mode 3: Diff & Anchored Comments */}
//           {viewMode === 'diff' && (
//             <div className="bg-[#131B2A] border border-[#1E293B] rounded-xl p-5 shadow-sm space-y-5">
//               <div>
//                 <h3 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2">
//                   Version 1 vs Revised Version (Side-by-Side Diff)
//                 </h3>
//                 <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-[#0B111E] p-3 rounded-lg border border-[#1E293B]">
//                   <div>
//                     <span className="text-slate-500 block mb-1">Base Draft (v1):</span>
//                     <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
//                       {activeVersion.rawContent}
//                     </p>
//                   </div>
//                   <div className="border-l border-[#1E293B] pl-3">
//                     <span className="text-emerald-400 block mb-1">Accepted Suggestions:</span>
//                     <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
//                       {activeVersion.rawContent}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Anchored Comments Thread */}
//               <div className="pt-4 border-t border-[#1E293B] space-y-3">
//                 <div className="flex items-center space-x-2 text-xs font-semibold text-white">
//                   <MessageSquare className="w-4 h-4 text-blue-400" />
//                   <span>Anchored Editorial Comments ({comments.filter(c => c.contentItemId === activeContentItem.id).length})</span>
//                 </div>

//                 <div className="space-y-2.5 max-h-56 overflow-y-auto">
//                   {comments
//                     .filter((c) => c.contentItemId === activeContentItem.id)
//                     .map((comm) => (
//                       <div key={comm.id} className="p-3 bg-[#0E1524] border border-[#1E293B] rounded-lg text-xs space-y-1">
//                         <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
//                           <span className="font-semibold text-slate-200">{comm.author.name} ({comm.author.role})</span>
//                           <span>{new Date(comm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
//                         </div>
//                         {comm.span && (
//                           <span className="inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
//                             Anchored to: "{comm.span.text}"
//                           </span>
//                         )}
//                         <p className="text-slate-200 mt-1">{comm.text}</p>
//                       </div>
//                     ))}
//                 </div>

//                 {/* Add Comment Form */}
//                 <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
//                   <input
//                     type="text"
//                     value={newCommentText}
//                     onChange={(e) => setNewCommentText(e.target.value)}
//                     placeholder="Leave anchored comment for reviewer..."
//                     className="flex-1 bg-[#0B111E] border border-[#1E293B] rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
//                   />
//                   <button
//                     type="submit"
//                     className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium cursor-pointer"
//                   >
//                     Post
//                   </button>
//                 </form>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Right Findings & Suggestions Pane (5 Cols) */}
//         <div className="lg:col-span-5 space-y-4">
//           <div className="bg-[#131B2A] border border-[#1E293B] rounded-xl p-4 shadow-sm space-y-3">
//             {/* Header */}
//             <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
//               <div className="flex items-center space-x-2">
//                 <h2 className="text-sm font-bold text-white tracking-tight">
//                   Findings & Suggestions
//                 </h2>
//                 <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
//                   {openFindings.length} open
//                 </span>
//               </div>

//               {/* Status tabs: Open, All, Decided */}
//               <div className="flex items-center bg-[#0B111E] p-0.5 rounded-lg border border-[#1E293B] text-[11px]">
//                 {(['OPEN', 'ALL', 'DECIDED'] as const).map((mode) => (
//                   <button
//                     key={mode}
//                     onClick={() => setDecisionFilter(mode)}
//                     className={`px-2.5 py-1 rounded-md font-mono transition-colors cursor-pointer ${
//                       decisionFilter === mode
//                         ? 'bg-[#1E293B] text-white font-bold'
//                         : 'text-slate-400 hover:text-slate-200'
//                     }`}
//                   >
//                     {mode === 'OPEN' && `Open (${openFindings.length})`}
//                     {mode === 'ALL' && `All (${findings.length})`}
//                     {mode === 'DECIDED' && `Decided (${decidedFindings.length})`}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Category Filter Chips */}
//             <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-[#1E293B]">
//               {['ALL', 'CLAIM', 'TERM', 'TONE', 'A11Y', 'CONF', 'VISUAL', 'MESSAGING'].map((cat) => {
//                 const count =
//                   cat === 'ALL'
//                     ? findings.length
//                     : findings.filter((f) => f.category.toLowerCase().includes(cat.toLowerCase())).length;
//                 return (
//                   <button
//                     key={cat}
//                     onClick={() => setCategoryFilter(cat)}
//                     className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
//                       categoryFilter === cat
//                         ? 'bg-blue-600 text-white font-bold'
//                         : 'bg-[#0E1524] text-slate-400 hover:text-white border border-[#1E293B]'
//                     }`}
//                   >
//                     {cat} ({count})
//                   </button>
//                 );
//               })}
//             </div>

//             {/* Finding Cards List */}
//             <div className="space-y-3.5 max-h-160 overflow-y-auto pr-1">
//               {displayedFindings.length === 0 ? (
//                 <div className="p-8 text-center text-slate-400 text-xs">
//                   <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
//                   <p className="font-semibold text-slate-200">No findings in this view</p>
//                   <p className="text-[11px] text-slate-400 mt-1">All issues in this category are compliant or resolved.</p>
//                 </div>
//               ) : (
//                 displayedFindings.map((finding) => {
//                   const isSelected = selectedFindingId === finding.id;
//                   const isBlocker = finding.severity === 'BLOCKER';
//                   const isHigh = finding.severity === 'HIGH';

//                   return (
//                     <div
//                       key={finding.id}
//                       onClick={() => setSelectedFindingId(finding.id)}
//                       className={`rounded-xl p-4 transition-all border ${
//                         isSelected
//                           ? 'bg-[#162136] border-blue-500 shadow-md ring-1 ring-blue-500/40'
//                           : 'bg-[#0E1524] border-[#1E293B] hover:border-slate-700'
//                       }`}
//                     >
//                       {/* Top Badges Row */}
//                       <div className="flex items-center justify-between text-[10px] font-mono mb-2">
//                         <div className="flex items-center space-x-1.5">
//                           <span
//                             className={`px-1.5 py-0.5 rounded font-bold uppercase ${
//                               isBlocker
//                                 ? 'bg-rose-950/60 text-rose-300 border border-rose-800'
//                                 : isHigh
//                                 ? 'bg-amber-950/60 text-amber-300 border border-amber-800'
//                                 : 'bg-slate-800 text-slate-300 border border-slate-700'
//                             }`}
//                           >
//                             {finding.severity}
//                           </span>
//                           <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
//                             {finding.ruleCode}
//                           </span>
//                         </div>

//                         {/* Citation Link button */}
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             setInspectingCitation(finding.citation);
//                           }}
//                           className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 underline cursor-pointer"
//                           title="Open evidence source & guideline principle drawer"
//                         >
//                           <span>{finding.citation.id}</span>
//                           <ExternalLink className="w-3 h-3" />
//                         </button>
//                       </div>

//                       {/* Span snippet */}
//                       <div className="flex items-center space-x-2 text-xs font-mono bg-[#0B111E] px-2.5 py-1.5 rounded border border-[#1E293B] mb-2.5">
//                         <span className="text-slate-400">"{finding.span.text}"</span>
//                         <span className="text-[10px] text-slate-400">
//                           [{finding.span.start}-{finding.span.end}]
//                         </span>
//                       </div>

//                       {/* Plain Language Why */}
//                       <p className="text-xs text-slate-200 leading-relaxed mb-3">
//                         {finding.why}
//                       </p>

//                       {/* Proposed Correction Box */}
//                       <div className="bg-[#0B111E] border border-[#1E293B] rounded-lg p-2.5 mb-3 text-xs">
//                         <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
//                           <span className="font-semibold uppercase tracking-wider text-slate-400">
//                             PROPOSED CORRECTION
//                           </span>
//                           <span className="px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-800">
//                             {finding.suggestedFix.action}
//                           </span>
//                         </div>

//                         {editingFindingId === finding.id ? (
//                           <div className="space-y-2 mt-2">
//                             <input
//                               type="text"
//                               value={customEditText}
//                               onChange={(e) => setCustomEditText(e.target.value)}
//                               className="w-full bg-[#131B2A] border border-blue-500 rounded px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none"
//                             />
//                             <div className="flex justify-end space-x-2">
//                               <button
//                                 onClick={() => setEditingFindingId(null)}
//                                 className="px-2 py-1 text-[11px] text-slate-400 hover:text-white cursor-pointer"
//                               >
//                                 Cancel
//                               </button>
//                               <button
//                                 onClick={() => handleSaveEdit(finding)}
//                                 className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-semibold cursor-pointer"
//                               >
//                                 Apply Edit
//                               </button>
//                             </div>
//                           </div>
//                         ) : (
//                           <div className="font-mono text-emerald-400 text-xs mt-1 flex items-center space-x-1">
//                             <span>➔</span>
//                             <span>"{finding.suggestedFix.text}"</span>
//                           </div>
//                         )}
//                       </div>

//                       {/* Reject modal / inline reason */}
//                       {rejectingFindingId === finding.id && (
//                         <div className="p-2.5 rounded-lg bg-[#0B111E] border border-rose-800/80 mb-3 text-xs space-y-2">
//                           <span className="text-[10px] font-mono text-rose-300 font-semibold block uppercase">
//                             Reject Reason (Feeds Ambiguity Radar)
//                           </span>
//                           <select
//                             value={rejectReason}
//                             onChange={(e) => setRejectReason(e.target.value)}
//                             className="w-full bg-[#131B2A] border border-[#1E293B] rounded px-2 py-1 text-slate-200 text-xs focus:outline-none cursor-pointer"
//                           >
//                             <option value="Guideline is ambiguous in this marketing context">
//                               Guideline is ambiguous in this marketing context
//                             </option>
//                             <option value="Approved legal exemption on file">
//                               Approved legal exemption on file
//                             </option>
//                             <option value="Superlative is substantiated by trade agency review">
//                               Superlative is substantiated by trade agency review
//                             </option>
//                             <option value="Stylistic exception requested by brand director">
//                               Stylistic exception requested by brand director
//                             </option>
//                           </select>
//                           <div className="flex justify-end space-x-2">
//                             <button
//                               onClick={() => setRejectingFindingId(null)}
//                               className="px-2 py-1 text-[11px] text-slate-400 hover:text-white cursor-pointer"
//                             >
//                               Cancel
//                             </button>
//                             <button
//                               onClick={() => handleConfirmReject(finding)}
//                               className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[11px] font-semibold cursor-pointer"
//                             >
//                               Confirm Reject
//                             </button>
//                           </div>
//                         </div>
//                       )}

//                       {/* Action Buttons: Reject, Edit, Accept (Only CREATOR has authority to decide findings) */}
//                       {finding.status === 'OPEN' ? (
//                         <div className="flex items-center justify-between pt-2 border-t border-[#1E293B]/80 text-xs">
//                           <span className="text-[10px] font-mono text-slate-400">
//                             weight: {finding.weight.toFixed(1)}
//                           </span>

//                           {currentUser.role === 'CREATOR' ? (
//                             <div className="flex items-center space-x-1.5">
//                               <button
//                                 onClick={() => handleStartReject(finding)}
//                                 className="px-2.5 py-1 rounded bg-[#131B2A] hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-[#1E293B] hover:border-rose-800 text-[11px] font-medium transition-colors cursor-pointer"
//                               >
//                                 ✕ Reject
//                               </button>

//                               <button
//                                 onClick={() => handleStartEdit(finding)}
//                                 className="px-2.5 py-1 rounded bg-[#131B2A] hover:bg-slate-700 text-slate-300 border border-[#1E293B] text-[11px] font-medium transition-colors cursor-pointer"
//                               >
//                                 Edit
//                               </button>

//                               <button
//                                 onClick={() => acceptFindingFix(finding.id)}
//                                 className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold shadow-xs transition-colors flex items-center space-x-1 cursor-pointer"
//                               >
//                                 <Check className="w-3 h-3" />
//                                 <span>Accept</span>
//                               </button>
//                             </div>
//                           ) : (
//                             <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 italic">
//                               Author Action Required
//                             </span>
//                           )}
//                         </div>
//                       ) : (
//                         <div className="flex items-center justify-between pt-2 border-t border-[#1E293B]/80 text-[11px] font-mono">
//                           <span
//                             className={
//                               finding.status === 'ACCEPTED'
//                                 ? 'text-emerald-400'
//                                 : finding.status === 'EDITED'
//                                 ? 'text-blue-400'
//                                 : 'text-rose-400'
//                             }
//                           >
//                             Status: {finding.status}
//                           </span>
//                           <span className="text-slate-400">
//                             {finding.rejectionReason ? `Reason: ${finding.rejectionReason}` : 'Human authorized'}
//                           </span>
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* Request Changes Modal for Reviewers */}
//       {showRequestChangesModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
//           <form
//             onSubmit={handleConfirmRequestChanges}
//             className="bg-[#101726] border border-[#1E293B] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150"
//           >
//             <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
//               <div className="flex items-center space-x-2">
//                 <RotateCcw className="w-4 h-4 text-amber-400" />
//                 <h3 className="text-sm font-bold text-white">Request Changes from Author</h3>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => setShowRequestChangesModal(false)}
//                 className="text-slate-400 hover:text-white text-xs cursor-pointer"
//               >
//                 ✕
//               </button>
//             </div>

//             <p className="text-xs text-slate-400">
//               Provide specific editorial guidance for what needs to be changed before this item can receive approval.
//             </p>

//             <div>
//               <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
//                 Feedback & Required Revisions
//               </label>
//               <textarea
//                 value={changesFeedback}
//                 onChange={(e) => setChangesFeedback(e.target.value)}
//                 placeholder="e.g. Please substantiate the thermal efficiency claims with 2026 certified lab reports..."
//                 rows={4}
//                 required
//                 className="w-full bg-[#0B111E] border border-[#1E293B] rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-sans"
//               />
//             </div>

//             <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#1E293B]">
//               <button
//                 type="button"
//                 onClick={() => setShowRequestChangesModal(false)}
//                 className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-amber-600/30 cursor-pointer"
//               >
//                 Send Feedback to Author
//               </button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };




import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Edit3,
  RotateCcw,
  Sparkles,
  Send,
  Eye,
  FileEdit,
  GitCompare,
  Upload,
  MessageSquare,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Check,
  X,
} from 'lucide-react';
import { useBrandLens } from '../lib/store';
import { Finding, FindingCategory, FindingDecision, TextSpan } from '../lib/types';
import confetti from 'canvas-confetti';

export const ReviewWorkspaceView: React.FC = () => {
  const {
    activeContentItem,
    activeVersion,
    updateContentText,
    reanalyzeContent,
    acceptFindingFix,
    editFindingFix,
    rejectFindingFix,
    submitForReview,
    approveSubmission,
    requestChangesSubmission,
    publishContent,
    setInspectingCitation,
    selectedFindingId,
    setSelectedFindingId,
    comments,
    addComment,
    currentUser,
    externalProcessing,
  } = useBrandLens();

  type ViewMode = 'preview' | 'editor' | 'diff';
  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  const [editorContent, setEditorContent] = useState<string>(activeVersion?.rawContent || '');
  const [decisionFilter, setDecisionFilter] = useState<'OPEN' | 'ALL' | 'DECIDED'>('OPEN');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Edit finding fix modal/state
  const [editingFindingId, setEditingFindingId] = useState<string | null>(null);
  const [customEditText, setCustomEditText] = useState<string>('');

  // Reject finding reason modal/state
  const [rejectingFindingId, setRejectingFindingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('Guideline is ambiguous in this marketing context');

  // Request changes modal state
  const [showRequestChangesModal, setShowRequestChangesModal] = useState<boolean>(false);
  const [changesFeedback, setChangesFeedback] = useState<string>('');

  // New comment input
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // Gemini AI intelligence simulation/execution
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string | null>(null);

  // Sync editor content with active version
  React.useEffect(() => {
    if (activeVersion) {
      setEditorContent(activeVersion.rawContent);
    }
  }, [activeVersion?.id, activeVersion?.rawContent]);

  if (!activeContentItem || !activeVersion) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">
        No active content collateral selected. Please select an item from the Dashboard.
      </div>
    );
  }

  const findings = activeVersion.findings || [];

  // Categorize counts
  const openFindings = findings.filter((f) => f.status === 'OPEN');
  const decidedFindings = findings.filter((f) => f.status !== 'OPEN');
  const blockersCount = activeVersion.blockersCount;
  const readiness = activeVersion.readinessScore;

  // Filtered findings for right rail
  const displayedFindings = findings.filter((f) => {
    if (decisionFilter === 'OPEN' && f.status !== 'OPEN') return false;
    if (decisionFilter === 'DECIDED' && f.status === 'OPEN') return false;
    if (categoryFilter !== 'ALL' && f.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;
    return true;
  });

  // Calculate circular SVG progress ring
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (readiness / 100) * circumference;

  const handleApplyEditorChanges = () => {
    updateContentText(activeContentItem.id, editorContent);
    setViewMode('preview');
  };

  const handleStartEdit = (f: Finding) => {
    setEditingFindingId(f.id);
    setCustomEditText(f.suggestedFix.text);
  };

  const handleSaveEdit = (f: Finding) => {
    editFindingFix(f.id, customEditText);
    setEditingFindingId(null);
  };

  const handleStartReject = (f: Finding) => {
    setRejectingFindingId(f.id);
    setRejectReason('Guideline is ambiguous in this marketing context');
  };

  const handleConfirmReject = (f: Finding) => {
    rejectFindingFix(f.id, rejectReason);
    setRejectingFindingId(null);
  };

  const handleSubmitForReview = () => {
    setSubmitError(null);
    const res = submitForReview(activeContentItem.id);
    if (!res.success) {
      setSubmitError(res.error || 'Failed to submit.');
    } else {
      setSubmitSuccess(true);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      setTimeout(() => setSubmitSuccess(false), 3000);
    }
  };

  const handleApprove = (stage: 'STAGE_1' | 'FINAL') => {
    setSubmitError(null);
    const res = approveSubmission(activeContentItem.id, stage);
    if (!res.success) {
      setSubmitError(res.error || 'Approval rejected.');
    } else {
      setSubmitSuccess(true);
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      setTimeout(() => setSubmitSuccess(false), 3500);
    }
  };

  const handleConfirmRequestChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!changesFeedback.trim()) return;
    setSubmitError(null);
    const res = requestChangesSubmission(activeContentItem.id, changesFeedback.trim());
    if (!res.success) {
      setSubmitError(res.error || 'Failed to request changes.');
    } else {
      setSubmitSuccess(true);
      setShowRequestChangesModal(false);
      setChangesFeedback('');
      setTimeout(() => setSubmitSuccess(false), 3500);
    }
  };

  const handlePublish = () => {
    setSubmitError(null);
    const res = publishContent(activeContentItem.id);
    if (!res.success) {
      setSubmitError(res.error || 'Failed to publish.');
    } else {
      setSubmitSuccess(true);
      confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 } });
      setTimeout(() => setSubmitSuccess(false), 3500);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    addComment(activeContentItem.id, newCommentText.trim());
    setNewCommentText('');
  };

  // --- UPDATED: BYOK Secure AI Call ---
  const handleRunAiAssistance = async () => {
    setIsAiAnalyzing(true);
    
    // 1. Get the user's key from localStorage
    const userKey = localStorage.getItem('gemini_api_key');
    if (!userKey) {
      setSubmitError("Please add your Gemini API Key in the Settings tab to use AI Assist.");
      setIsAiAnalyzing(false);
      return;
    }

    try {
      // 2. Call backend securely with the key in the header
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-key': userKey, // <--- Secure header
        },
        body: JSON.stringify({ 
          text: activeVersion.rawContent,
          model: 'gemini-3.8-flash'
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAiSuggestions(data.suggestions);
      } else {
        setSubmitError(data.error || 'AI analysis failed.');
      }
    } catch (err) {
      console.error(err);
      setSubmitError('Network error communicating with AI.');
    } finally {
      setIsAiAnalyzing(false);
    }
  };
  // ------------------------------------

  // Render text with clickable highlighted spans
  const renderMarkedPreview = () => {
    const raw = activeVersion.rawContent;
    if (!raw) return <span className="text-slate-500 italic">No content</span>;

    // Filter open findings with spans
    const openSpans = findings
      .filter((f) => f.status === 'OPEN' && f.span && f.span.end > f.span.start)
      .sort((a, b) => a.span.start - b.span.start);

    if (openSpans.length === 0) {
      return <div className="text-slate-200 whitespace-pre-wrap leading-relaxed">{raw}</div>;
    }

    const segments: React.ReactNode[] = [];
    let currentIndex = 0;

    openSpans.forEach((finding, idx) => {
      const { start, end, text } = finding.span;

      if (start < currentIndex || start >= raw.length) return;

      if (start > currentIndex) {
        segments.push(
          <span key={`text-${currentIndex}`}>
            {raw.substring(currentIndex, start)}
          </span>
        );
      }

      const isSelected = selectedFindingId === finding.id;
      let highlightClass = 'bg-amber-500/20 text-amber-200 border-b-2 border-amber-500';
      let tagLabel = finding.ruleCode || finding.category.toUpperCase();

      if (finding.category === 'confidentiality') {
        highlightClass = 'bg-rose-500/25 text-rose-200 border-b-2 border-rose-500 font-medium';
        tagLabel = 'CONF-BLOCK';
      } else if (finding.category === 'terminology') {
        highlightClass = 'bg-orange-500/25 text-orange-200 border-b-2 border-orange-500';
        tagLabel = 'TERM-AVOID';
      } else if (finding.category === 'claims') {
        highlightClass = finding.severity === 'BLOCKER' 
          ? 'bg-rose-500/20 text-rose-200 border-b-2 border-rose-400 font-semibold'
          : 'bg-amber-500/25 text-amber-100 border-b-2 border-amber-400 font-semibold';
        tagLabel = 'CLAIM';
      } else if (finding.category === 'messaging') {
        highlightClass = 'bg-blue-500/25 text-blue-200 border-b-2 border-blue-400';
        tagLabel = 'MESSAGING';
      } else if (finding.category === 'tone') {
        highlightClass = 'bg-purple-500/25 text-purple-200 border-b-2 border-purple-400';
        tagLabel = 'TONE';
      } else if (finding.category === 'accessibility') {
        highlightClass = 'bg-emerald-500/25 text-emerald-200 border-b-2 border-emerald-400';
        tagLabel = 'A11Y';
      }

      segments.push(
        <span
          key={`span-${finding.id}-${idx}`}
          onClick={() => {
            setSelectedFindingId(finding.id);
            setInspectingCitation(finding.citation);
          }}
          className={`relative px-1 py-0.5 rounded-xs transition-all cursor-pointer ${highlightClass} ${
            isSelected ? 'ring-2 ring-blue-400 shadow-md scale-102 inline-block' : 'hover:opacity-85'
          }`}
          title={`${finding.why} (Click to inspect citation)`}
        >
          {raw.substring(start, end)}
          <span className="ml-1 text-[9px] uppercase font-mono px-1 py-0.2 rounded bg-slate-900/80 text-white/90 border border-slate-700/80 align-middle">
            {tagLabel}
          </span>
        </span>
      );

      currentIndex = end;
    });

    if (currentIndex < raw.length) {
      segments.push(
        <span key={`text-end`}>
          {raw.substring(currentIndex)}
        </span>
      );
    }

    return (
      <div className="text-slate-100 text-sm md:text-base whitespace-pre-wrap leading-relaxed font-sans select-text">
        {segments}
      </div>
    );
  };
return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#1E293B]">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              {activeContentItem.title}
            </h1>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {activeContentItem.channel}
            </span>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              {activeContentItem.format}
            </span>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-700/60 font-semibold">
              {activeContentItem.status}
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs text-slate-400">
            <span>Author: {activeContentItem.author.name}</span>
            <span>•</span>
            <span className="font-mono text-slate-300">
              Version {activeVersion.versionNumber} (Active)
            </span>
            <span>•</span>
            <button
              onClick={() => setViewMode(viewMode === 'diff' ? 'preview' : 'diff')}
              className="text-blue-400 hover:text-blue-300 font-mono underline cursor-pointer"
            >
              {viewMode === 'diff' ? 'exit DIFF' : 'view DIFF'}
            </button>
          </div>
        </div>

        {/* Action Controls & Readiness Score Ring */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => reanalyzeContent(activeContentItem.id)}
              className="px-3 py-1.5 bg-[#1E293B] hover:bg-[#2E3F5B] text-slate-200 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
              title="Rerun pure engine checks"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Re-analyse</span>
            </button>

            {externalProcessing && (
              <button
                onClick={handleRunAiAssistance}
                disabled={isAiAnalyzing}
                className="px-3 py-1.5 bg-purple-900/30 hover:bg-purple-900/50 border border-purple-700/60 text-purple-300 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
                title="Optional Gemini Intelligence assist"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAiAnalyzing ? 'Analyzing...' : 'AI Assist'}</span>
              </button>
            )}

            {/* 1. CREATOR Actions: Submit for Review only. Hide Approve, Request Changes, and Publish */}
            {currentUser.role === 'CREATOR' && (
              <button
                onClick={handleSubmitForReview}
                disabled={blockersCount > 0 || activeContentItem.status === 'APPROVED' || activeContentItem.status === 'PUBLISHED'}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-md transition-all cursor-pointer ${
                  blockersCount > 0 || activeContentItem.status === 'APPROVED' || activeContentItem.status === 'PUBLISHED'
                    ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-75'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                }`}
                title={
                  blockersCount > 0
                    ? 'Resolve all blockers before submitting for review'
                    : 'Submit draft to Reviewer Queue'
                }
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit for Review</span>
              </button>
            )}

            {/* 2. REVIEWER Actions: Request Changes and Stage 1 Approve. Hide Submit and Publish */}
            {currentUser.role === 'REVIEWER' && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowRequestChangesModal(true)}
                  className="px-3 py-1.5 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-700 text-amber-300 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
                  title="Request changes with comment"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Request Changes</span>
                </button>

                <button
                  onClick={() => handleApprove('STAGE_1')}
                  disabled={blockersCount > 0 || activeContentItem.status === 'APPROVED' || activeContentItem.status === 'PUBLISHED'}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-md transition-all cursor-pointer ${
                    blockersCount > 0 || activeContentItem.status === 'APPROVED' || activeContentItem.status === 'PUBLISHED'
                      ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-75'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                  }`}
                  title={blockersCount > 0 ? 'Cannot approve with active blockers' : 'Grant Stage 1 Approval'}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Stage 1 Approve</span>
                </button>
              </div>
            )}

            {/* 3. BRAND_ADMIN Actions: Stage 2 Approve and Publish. Hide Submit */}
            {currentUser.role === 'BRAND_ADMIN' && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleApprove('FINAL')}
                  disabled={blockersCount > 0 || activeContentItem.status === 'PUBLISHED'}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-md transition-all cursor-pointer ${
                    blockersCount > 0 || activeContentItem.status === 'PUBLISHED'
                      ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-75'
                      : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30'
                  }`}
                  title={blockersCount > 0 ? 'Cannot approve with active blockers' : 'Grant Stage 2 Final Approval'}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Stage 2 Approve</span>
                </button>

                <button
                  onClick={handlePublish}
                  disabled={activeContentItem.status !== 'APPROVED'}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-md transition-all cursor-pointer ${
                    activeContentItem.status !== 'APPROVED'
                      ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-75'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/30'
                  }`}
                  title={activeContentItem.status !== 'APPROVED' ? 'Must achieve full approval before publishing' : 'Publish collateral live'}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish</span>
                </button>
              </div>
            )}

            {/* 4. VIEWER: Read-only badge */}
            {currentUser.role === 'VIEWER' && (
              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
                View-Only Collateral
              </span>
            )}
          </div>

          {/* Readiness Score Ring Indicator */}
          <div className="flex items-center space-x-3 pl-3 border-l border-[#1E293B]">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r={radius}
                  className="stroke-slate-800"
                  strokeWidth="4"
                  fill="transparent"
                />
                <circle
                  cx="28"
                  cy="28"
                  r={radius}
                  className={blockersCount > 0 ? 'stroke-rose-500' : 'stroke-emerald-400'}
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-xs font-mono font-bold text-white">
                {readiness}%
              </span>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-slate-400 block tracking-wider">
                READINESS SCORE
              </span>
              <span
                className={`text-xs font-semibold block ${
                  blockersCount > 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {blockersCount > 0 ? 'Publication Blocked' : 'Ready for Review'}
              </span>
              <div className="flex items-center space-x-1.5 text-[10px] font-mono text-slate-400">
                <span className={blockersCount > 0 ? 'text-rose-400 font-bold' : ''}>
                  {blockersCount} Blockers
                </span>
                <span>•</span>
                <span>{findings.length} Total</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submission Feedback Notices */}
      {submitError && (
        <div className="mt-4 p-3 rounded-lg bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}
      {submitSuccess && (
        <div className="mt-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/80 text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Submitted successfully! Item is now queued for editorial reviewer approval.</span>
        </div>
      )}
      {aiSuggestions && (
        <div className="mt-4 p-3.5 rounded-lg bg-purple-950/30 border border-purple-800/60 text-purple-200 text-xs whitespace-pre-wrap flex justify-between items-start">
          <div>{aiSuggestions}</div>
          <button onClick={() => setAiSuggestions(null)} className="text-slate-400 hover:text-white cursor-pointer ml-3">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Workspace Grid: Document Inspection & Raw Editor (Left) + Findings & Suggestions (Right) */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Document Pane (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Subheader / Mode switcher */}
          <div className="flex items-center justify-between bg-[#131B2A] border border-[#1E293B] rounded-xl px-4 py-2.5">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('preview')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'preview'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#1E293B]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Marked Inspection Preview</span>
              </button>

              <button
                onClick={() => setViewMode('editor')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'editor'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#1E293B]'
                }`}
              >
                <FileEdit className="w-3.5 h-3.5" />
                <span>Raw Copy Editor</span>
              </button>

              <button
                onClick={() => setViewMode('diff')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'diff'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#1E293B]'
                }`}
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>Diff & Anchored Comments</span>
              </button>
            </div>

            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
              {viewMode === 'preview' ? 'Click highlighted span to inspect' : `${editorContent.split(/\s+/).filter(Boolean).length} words`}
            </span>
          </div>

          {/* Mode 1: Marked Inspection Preview */}
          {viewMode === 'preview' && (
            <div className="bg-[#131B2A] border border-[#1E293B] rounded-xl p-6 min-h-105 shadow-sm flex flex-col justify-between">
              <div>
                {activeContentItem.mediaUrl && (
                  <div className="mb-5 rounded-lg overflow-hidden border border-[#1E293B] bg-[#0B111E] p-2 flex justify-center">
                    <img
                      src={activeContentItem.mediaUrl}
                      alt="Uploaded media preview"
                      className="max-h-64 object-contain rounded"
                    />
                  </div>
                )}
                {renderMarkedPreview()}
              </div>

              <div className="mt-8 pt-4 border-t border-[#1E293B] flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Deterministic Category Engines: Active (7/7)</span>
                <span>Zero auto-apply rule enforced</span>
              </div>
            </div>
          )}

          {/* Mode 2: Raw Copy Editor */}
          {viewMode === 'editor' && (
            <div className="bg-[#131B2A] border border-[#1E293B] rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>{currentUser.role === 'CREATOR' ? 'Direct Markdown / Copy Editor' : 'Read-Only Document Content'}</span>
                <span className={currentUser.role === 'CREATOR' ? 'text-slate-400' : 'text-amber-400 font-bold'}>
                  {currentUser.role === 'CREATOR' ? 'Type and click Update to trigger engine' : `View-Only for Role [${currentUser.role}]`}
                </span>
              </div>
              <textarea
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                readOnly={currentUser.role !== 'CREATOR'}
                disabled={currentUser.role !== 'CREATOR'}
                rows={14}
                className={`w-full bg-[#0B111E] border border-[#1E293B] rounded-lg p-4 text-sm font-mono text-slate-100 focus:outline-none leading-relaxed ${
                  currentUser.role !== 'CREATOR' ? 'opacity-75 cursor-not-allowed' : 'focus:border-blue-500'
                }`}
                placeholder="Content..."
              />
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">
                  {currentUser.role === 'CREATOR'
                    ? 'Modifying content resets resolved spans.'
                    : 'Permission Notice: Only the CREATOR author role can modify draft copy.'}
                </span>
                {currentUser.role === 'CREATOR' && (
                  <button
                    onClick={handleApplyEditorChanges}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-blue-600/30 cursor-pointer"
                  >
                    Update & Re-analyse Content
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Mode 3: Diff & Anchored Comments */}
          {viewMode === 'diff' && (
            <div className="bg-[#131B2A] border border-[#1E293B] rounded-xl p-5 shadow-sm space-y-5">
              <div>
                <h3 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2">
                  Version 1 vs Revised Version (Side-by-Side Diff)
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-[#0B111E] p-3 rounded-lg border border-[#1E293B]">
                  <div>
                    <span className="text-slate-500 block mb-1">Base Draft (v1):</span>
                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {activeVersion.rawContent}
                    </p>
                  </div>
                  <div className="border-l border-[#1E293B] pl-3">
                    <span className="text-emerald-400 block mb-1">Accepted Suggestions:</span>
                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {activeVersion.rawContent}
                    </p>
                  </div>
                </div>
              </div>

              {/* Anchored Comments Thread */}
              <div className="pt-4 border-t border-[#1E293B] space-y-3">
                <div className="flex items-center space-x-2 text-xs font-semibold text-white">
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                  <span>Anchored Editorial Comments ({comments.filter(c => c.contentItemId === activeContentItem.id).length})</span>
                </div>

                <div className="space-y-2.5 max-h-56 overflow-y-auto">
                  {comments
                    .filter((c) => c.contentItemId === activeContentItem.id)
                    .map((comm) => (
                      <div key={comm.id} className="p-3 bg-[#0E1524] border border-[#1E293B] rounded-lg text-xs space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                          <span className="font-semibold text-slate-200">{comm.author.name} ({comm.author.role})</span>
                          <span>{new Date(comm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        {comm.span && (
                          <span className="inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                            Anchored to: "{comm.span.text}"
                          </span>
                        )}
                        <p className="text-slate-200 mt-1">{comm.text}</p>
                      </div>
                    ))}
                </div>

                {/* Add Comment Form */}
                <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Leave anchored comment for reviewer..."
                    className="flex-1 bg-[#0B111E] border border-[#1E293B] rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium cursor-pointer"
                  >
                    Post
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Right Findings & Suggestions Pane (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#131B2A] border border-[#1E293B] rounded-xl p-4 shadow-sm space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-white tracking-tight">
                  Findings & Suggestions
                </h2>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                  {openFindings.length} open
                </span>
              </div>

              {/* Status tabs: Open, All, Decided */}
              <div className="flex items-center bg-[#0B111E] p-0.5 rounded-lg border border-[#1E293B] text-[11px]">
                {(['OPEN', 'ALL', 'DECIDED'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setDecisionFilter(mode)}
                    className={`px-2.5 py-1 rounded-md font-mono transition-colors cursor-pointer ${
                      decisionFilter === mode
                        ? 'bg-[#1E293B] text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mode === 'OPEN' && `Open (${openFindings.length})`}
                    {mode === 'ALL' && `All (${findings.length})`}
                    {mode === 'DECIDED' && `Decided (${decidedFindings.length})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-[#1E293B]">
              {['ALL', 'CLAIM', 'TERM', 'TONE', 'A11Y', 'CONF', 'VISUAL', 'MESSAGING'].map((cat) => {
                const count =
                  cat === 'ALL'
                    ? findings.length
                    : findings.filter((f) => f.category.toLowerCase().includes(cat.toLowerCase())).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                      categoryFilter === cat
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-[#0E1524] text-slate-400 hover:text-white border border-[#1E293B]'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>

            {/* Finding Cards List */}
            <div className="space-y-3.5 max-h-160 overflow-y-auto pr-1">
              {displayedFindings.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                  <p className="font-semibold text-slate-200">No findings in this view</p>
                  <p className="text-[11px] text-slate-400 mt-1">All issues in this category are compliant or resolved.</p>
                </div>
              ) : (
                displayedFindings.map((finding) => {
                  const isSelected = selectedFindingId === finding.id;
                  const isBlocker = finding.severity === 'BLOCKER';
                  const isHigh = finding.severity === 'HIGH';

                  return (
                    <div
                      key={finding.id}
                      onClick={() => setSelectedFindingId(finding.id)}
                      className={`rounded-xl p-4 transition-all border ${
                        isSelected
                          ? 'bg-[#162136] border-blue-500 shadow-md ring-1 ring-blue-500/40'
                          : 'bg-[#0E1524] border-[#1E293B] hover:border-slate-700'
                      }`}
                    >
                      {/* Top Badges Row */}
                      <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                        <div className="flex items-center space-x-1.5">
                          <span
                            className={`px-1.5 py-0.5 rounded font-bold uppercase ${
                              isBlocker
                                ? 'bg-rose-950/60 text-rose-300 border border-rose-800'
                                : isHigh
                                ? 'bg-amber-950/60 text-amber-300 border border-amber-800'
                                : 'bg-slate-800 text-slate-300 border border-slate-700'
                            }`}
                          >
                            {finding.severity}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {finding.ruleCode}
                          </span>
                        </div>

                        {/* Citation Link button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectingCitation(finding.citation);
                          }}
                          className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 underline cursor-pointer"
                          title="Open evidence source & guideline principle drawer"
                        >
                          <span>{finding.citation.id}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Span snippet */}
                      <div className="flex items-center space-x-2 text-xs font-mono bg-[#0B111E] px-2.5 py-1.5 rounded border border-[#1E293B] mb-2.5">
                        <span className="text-slate-400">"{finding.span.text}"</span>
                        <span className="text-[10px] text-slate-400">
                          [{finding.span.start}-{finding.span.end}]
                        </span>
                      </div>

                      {/* Plain Language Why */}
                      <p className="text-xs text-slate-200 leading-relaxed mb-3">
                        {finding.why}
                      </p>

                      {/* Proposed Correction Box */}
                      <div className="bg-[#0B111E] border border-[#1E293B] rounded-lg p-2.5 mb-3 text-xs">
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                          <span className="font-semibold uppercase tracking-wider text-slate-400">
                            PROPOSED CORRECTION
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-800">
                            {finding.suggestedFix.action}
                          </span>
                        </div>

                        {editingFindingId === finding.id ? (
                          <div className="space-y-2 mt-2">
                            <input
                              type="text"
                              value={customEditText}
                              onChange={(e) => setCustomEditText(e.target.value)}
                              className="w-full bg-[#131B2A] border border-blue-500 rounded px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none"
                            />
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => setEditingFindingId(null)}
                                className="px-2 py-1 text-[11px] text-slate-400 hover:text-white cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSaveEdit(finding)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-semibold cursor-pointer"
                              >
                                Apply Edit
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="font-mono text-emerald-400 text-xs mt-1 flex items-center space-x-1">
                            <span>➔</span>
                            <span>"{finding.suggestedFix.text}"</span>
                          </div>
                        )}
                      </div>

                      {/* Reject modal / inline reason */}
                      {rejectingFindingId === finding.id && (
                        <div className="p-2.5 rounded-lg bg-[#0B111E] border border-rose-800/80 mb-3 text-xs space-y-2">
                          <span className="text-[10px] font-mono text-rose-300 font-semibold block uppercase">
                            Reject Reason (Feeds Ambiguity Radar)
                          </span>
                          <select
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="w-full bg-[#131B2A] border border-[#1E293B] rounded px-2 py-1 text-slate-200 text-xs focus:outline-none cursor-pointer"
                          >
                            <option value="Guideline is ambiguous in this marketing context">
                              Guideline is ambiguous in this marketing context
                            </option>
                            <option value="Approved legal exemption on file">
                              Approved legal exemption on file
                            </option>
                            <option value="Superlative is substantiated by trade agency review">
                              Superlative is substantiated by trade agency review
                            </option>
                            <option value="Stylistic exception requested by brand director">
                              Stylistic exception requested by brand director
                            </option>
                          </select>
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setRejectingFindingId(null)}
                              className="px-2 py-1 text-[11px] text-slate-400 hover:text-white cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleConfirmReject(finding)}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[11px] font-semibold cursor-pointer"
                            >
                              Confirm Reject
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons: Reject, Edit, Accept (Only CREATOR has authority to decide findings) */}
                      {finding.status === 'OPEN' ? (
                        <div className="flex items-center justify-between pt-2 border-t border-[#1E293B]/80 text-xs">
                          <span className="text-[10px] font-mono text-slate-400">
                            weight: {finding.weight.toFixed(1)}
                          </span>

                          {currentUser.role === 'CREATOR' ? (
                            <div className="flex items-center space-x-1.5">
                              <button
                                onClick={() => handleStartReject(finding)}
                                className="px-2.5 py-1 rounded bg-[#131B2A] hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-[#1E293B] hover:border-rose-800 text-[11px] font-medium transition-colors cursor-pointer"
                              >
                                ✕ Reject
                              </button>

                              <button
                                onClick={() => handleStartEdit(finding)}
                                className="px-2.5 py-1 rounded bg-[#131B2A] hover:bg-slate-700 text-slate-300 border border-[#1E293B] text-[11px] font-medium transition-colors cursor-pointer"
                              >
                                Edit
                              </button>

                              <button
                                onClick={() => acceptFindingFix(finding.id)}
                                className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold shadow-xs transition-colors flex items-center space-x-1 cursor-pointer"
                              >
                                <Check className="w-3 h-3" />
                                <span>Accept</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 italic">
                              Author Action Required
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-between pt-2 border-t border-[#1E293B]/80 text-[11px] font-mono">
                          <span
                            className={
                              finding.status === 'ACCEPTED'
                                ? 'text-emerald-400'
                                : finding.status === 'EDITED'
                                ? 'text-blue-400'
                                : 'text-rose-400'
                            }
                          >
                            Status: {finding.status}
                          </span>
                          <span className="text-slate-400">
                            {finding.rejectionReason ? `Reason: ${finding.rejectionReason}` : 'Human authorized'}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Request Changes Modal for Reviewers */}
      {showRequestChangesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <form
            onSubmit={handleConfirmRequestChanges}
            className="bg-[#101726] border border-[#1E293B] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <div className="flex items-center space-x-2">
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Request Changes from Author</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRequestChangesModal(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Provide specific editorial guidance for what needs to be changed before this item can receive approval.
            </p>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Feedback & Required Revisions
              </label>
              <textarea
                value={changesFeedback}
                onChange={(e) => setChangesFeedback(e.target.value)}
                placeholder="e.g. Please substantiate the thermal efficiency claims with 2026 certified lab reports..."
                rows={4}
                required
                className="w-full bg-[#0B111E] border border-[#1E293B] rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-sans"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#1E293B]">
              <button
                type="button"
                onClick={() => setShowRequestChangesModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-amber-600/30 cursor-pointer"
              >
                Send Feedback to Author
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
