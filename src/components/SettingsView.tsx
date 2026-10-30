// import React, { useState } from 'react';
// import {
//   Settings as SettingsIcon,
//   Shield,
//   Lock,
//   Cpu,
//   Database,
//   RefreshCw,
//   CheckCircle2,
//   AlertTriangle,
//   Search,
//   Key,
//   Eye,
//   Hash,
//   Download,
//   Info,
// } from 'lucide-react';
// import { useBrandLens } from '../lib/store';

// export const SettingsView: React.FC = () => {
//   const {
//     externalProcessing,
//     setExternalProcessing,
//     geminiModel,
//     setGeminiModel,
//     auditLogs,
//     verifyAuditIntegrity,
//     resetToDefaultSeed,
//     currentUser,
//   } = useBrandLens();

//   const [logFilterAction, setLogFilterAction] = useState<string>('ALL');
//   const [logSearchQuery, setLogSearchQuery] = useState<string>('');
//   const [resetConfirmed, setResetConfirmed] = useState<boolean>(false);

//   const isHashChainValid = verifyAuditIntegrity();

//   // Filtered audit logs
//   const filteredLogs = auditLogs.filter((log) => {
//     if (logFilterAction !== 'ALL' && log.action !== logFilterAction) return false;
//     if (logSearchQuery.trim()) {
//       const q = logSearchQuery.toLowerCase();
//       return (
//         log.details.toLowerCase().includes(q) ||
//         log.actor.name.toLowerCase().includes(q) ||
//         log.action.toLowerCase().includes(q) ||
//         log.hash.toLowerCase().includes(q)
//       );
//     }
//     return true;
//   });

//   const handleReset = () => {
//     resetToDefaultSeed();
//     setResetConfirmed(true);
//     setTimeout(() => setResetConfirmed(false), 3000);
//   };

//   const handleExportAuditJson = () => {
//     const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
//     const downloadAnchor = document.createElement('a');
//     downloadAnchor.setAttribute('href', dataStr);
//     downloadAnchor.setAttribute('download', `brandlens_audit_chain_${new Date().toISOString().split('T')[0]}.json`);
//     document.body.appendChild(downloadAnchor);
//     downloadAnchor.click();
//     downloadAnchor.remove();
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1E293B]">
//         <div>
//           <h1 className="text-2xl font-bold text-white tracking-tight font-sans">
//             Settings & Trust Architecture
//           </h1>
//           <p className="text-xs text-slate-400 mt-1">
//             Privacy controls, AI disclosure, role-based access matrix, and append-only cryptographic audit stream
//           </p>
//         </div>

//         <button
//           onClick={handleReset}
//           className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors cursor-pointer"
//           title="Restore seed state"
//         >
//           <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
//           <span>{resetConfirmed ? 'Reset Completed!' : 'Restore Demo Seed State'}</span>
//         </button>
//       </div>

//       {/* Grid: AI Disclosure / Safety & RBAC Matrix */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Section 1: AI Disclosure & Data Processing Policy */}
//         <div className="bg-[#131B2A] border border-[#1E293B] rounded-xl p-5 shadow-sm space-y-4">
//           <div className="flex items-center space-x-2 pb-3 border-b border-[#1E293B]">
//             <Cpu className="w-4 h-4 text-purple-400" />
//             <h3 className="text-sm font-semibold text-white">AI Disclosure & Processing Sovereignty</h3>
//           </div>

//           <div className="p-4 rounded-xl bg-[#0B111E] border border-[#1E293B] space-y-3">
//             <div className="flex items-center justify-between">
//               <div>
//                 <span className="text-xs font-semibold text-white block">External AI Processing</span>
//                 <span className="text-[11px] text-slate-400">
//                   Enable optional Gemini multimodal intelligence assistance
//                 </span>
//               </div>
//               <label className="relative inline-flex items-center cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={externalProcessing}
//                   onChange={(e) => setExternalProcessing(e.target.checked)}
//                   className="sr-only peer"
//                 />
//                 <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
//               </label>
//             </div>

//             <div className="pt-2 border-t border-[#1E293B] text-[11px] text-slate-400 space-y-2">
//               <div className="flex items-start space-x-2">
//                 <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
//                 <p>
//                   <strong className="text-slate-300">Offline Pure Engine Guarantee:</strong> All 7 core detection categories (tone, terminology, messaging, claims, visual, accessibility, confidentiality) run locally without any network connection or API keys required.
//                 </p>
//               </div>

//               {externalProcessing ? (
//                 <div className="p-2.5 rounded bg-purple-950/40 border border-purple-800/60 text-purple-200">
//                   <span className="font-semibold">External Processing Active:</span> Connected model: {geminiModel}. Inbound text and uploaded imagery are analyzed via server-side Gemini intelligence proxies when explicitly invoked.
//                 </div>
//               ) : (
//                 <div className="p-2.5 rounded bg-emerald-950/30 border border-emerald-800/60 text-emerald-300 font-mono text-[10px]">
//                   ✓ ZERO DATA EGRESS: External AI processing is turned OFF.
//                 </div>
//               )}
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
//               Active Gemini Model Target
//             </label>
//             <select
//               value={geminiModel}
//               onChange={(e) => setGeminiModel(e.target.value)}
//               disabled={!externalProcessing}
//               className="w-full bg-[#0B111E] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 disabled:opacity-50 cursor-pointer font-mono"
//             >
//               <option value="gemini-3.8-flash">gemini-3.8-flash (General speed & precision)</option>
//               <option value="gemini-4-argon">gemini-4-argon (Complex reasoning & image understanding)</option>
//               <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Ultra-fast latency)</option>
//             </select>
//           </div>
//         </div>

//         {/* Section 2: Role-Based Access Control (RBAC) Matrix */}
//         <div className="bg-[#131B2A] border border-[#1E293B] rounded-xl p-5 shadow-sm space-y-4">
//           <div className="flex items-center space-x-2 pb-3 border-b border-[#1E293B]">
//             <Lock className="w-4 h-4 text-blue-400" />
//             <h3 className="text-sm font-semibold text-white">Server-Authoritative RBAC Matrix</h3>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full text-left text-xs">
//               <thead className="bg-[#0B111E] text-[10px] font-mono uppercase text-slate-400 border border-[#1E293B]">
//                 <tr>
//                   <th className="py-2.5 px-3">Role</th>
//                   <th className="py-2.5 px-3">Create / Edit</th>
//                   <th className="py-2.5 px-3">Submit</th>
//                   <th className="py-2.5 px-3">Review & Approve</th>
//                   <th className="py-2.5 px-3">Brand Kit Admin</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-[#1E293B] text-[11px] text-slate-300">
//                 <tr>
//                   <td className="py-2.5 px-3 font-mono font-bold text-blue-400">CREATOR</td>
//                   <td className="py-2.5 px-3 text-emerald-400">✓ Allowed</td>
//                   <td className="py-2.5 px-3 text-emerald-400">✓ Allowed</td>
//                   <td className="py-2.5 px-3 text-rose-400 font-bold">✕ Self-Approval Prohibited</td>
//                   <td className="py-2.5 px-3 text-slate-500">Read-only</td>
//                 </tr>
//                 <tr>
//                   <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">REVIEWER</td>
//                   <td className="py-2.5 px-3 text-slate-400">Comments only</td>
//                   <td className="py-2.5 px-3 text-slate-500">—</td>
//                   <td className="py-2.5 px-3 text-emerald-400 font-bold">✓ Stage 1 & 2 Authority</td>
//                   <td className="py-2.5 px-3 text-slate-500">Read-only</td>
//                 </tr>
//                 <tr>
//                   <td className="py-2.5 px-3 font-mono font-bold text-purple-400">BRAND_ADMIN</td>
//                   <td className="py-2.5 px-3 text-emerald-400">✓ Full access</td>
//                   <td className="py-2.5 px-3 text-emerald-400">✓ Allowed</td>
//                   <td className="py-2.5 px-3 text-emerald-400">✓ Override & Publish</td>
//                   <td className="py-2.5 px-3 text-purple-400 font-bold">✓ Full Edit Authority</td>
//                 </tr>
//                 <tr>
//                   <td className="py-2.5 px-3 font-mono font-bold text-slate-400">VIEWER</td>
//                   <td className="py-2.5 px-3 text-slate-500">—</td>
//                   <td className="py-2.5 px-3 text-slate-500">—</td>
//                   <td className="py-2.5 px-3 text-slate-500">—</td>
//                   <td className="py-2.5 px-3 text-slate-500">Read-only</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>

//           <div className="p-3 rounded-lg bg-[#0E1524] border border-[#1E293B] text-[11px] text-slate-400 space-y-1">
//             <p className="font-semibold text-slate-300">Constitutional Separation of Powers:</p>
//             <p>
//               To eliminate conflict of interest, the user who authored or drafted a piece of content is strictly prohibited from approving that content for release.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Section 3: Append-Only Cryptographic Audit Log Viewer */}
//       <div className="bg-[#131B2A] border border-[#1E293B] rounded-xl overflow-hidden shadow-sm space-y-4 p-5">
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
//           <div className="flex items-center space-x-2.5">
//             <Hash className="w-4 h-4 text-emerald-400" />
//             <div>
//               <div className="flex items-center space-x-2">
//                 <h3 className="text-sm font-semibold text-white">Append-Only Governance Audit Trail</h3>
//                 {isHashChainValid ? (
//                   <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-800 flex items-center space-x-1">
//                     <CheckCircle2 className="w-3 h-3 text-emerald-400" />
//                     <span>Hash Chain Valid (SHA-256)</span>
//                   </span>
//                 ) : (
//                   <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950/60 text-rose-300 border border-rose-800 flex items-center space-x-1">
//                     <AlertTriangle className="w-3 h-3 text-rose-400" />
//                     <span>Hash Tampering Detected</span>
//                   </span>
//                 )}
//               </div>
//               <p className="text-xs text-slate-400 mt-0.5">
//                 Every detection, human acceptance, rejection, and workflow transition is chained cryptographically.
//               </p>
//             </div>
//           </div>

//           <button
//             onClick={handleExportAuditJson}
//             className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#1E293B] hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium cursor-pointer"
//           >
//             <Download className="w-3.5 h-3.5" />
//             <span>Export Audit JSON</span>
//           </button>
//         </div>

//         {/* Audit Search and Filter Row */}
//         <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
//           <div className="relative w-full sm:w-64">
//             <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
//             <input
//               type="text"
//               value={logSearchQuery}
//               onChange={(e) => setLogSearchQuery(e.target.value)}
//               placeholder="Search audit trail..."
//               className="w-full bg-[#0B111E] border border-[#1E293B] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
//             />
//           </div>

//           <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
//             <span>Filter Action:</span>
//             <select
//               value={logFilterAction}
//               onChange={(e) => setLogFilterAction(e.target.value)}
//               className="bg-[#0B111E] border border-[#1E293B] rounded px-2.5 py-1 text-slate-200 cursor-pointer focus:outline-none"
//             >
//               <option value="ALL">All Actions</option>
//               <option value="CONTENT_CREATED">CONTENT_CREATED</option>
//               <option value="ANALYSIS_RUN">ANALYSIS_RUN</option>
//               <option value="SUGGESTION_ACCEPTED">SUGGESTION_ACCEPTED</option>
//               <option value="SUGGESTION_REJECTED">SUGGESTION_REJECTED</option>
//               <option value="STATUS_CHANGED">STATUS_CHANGED</option>
//             </select>
//           </div>
//         </div>

//         {/* Audit Table */}
//         <div className="overflow-x-auto max-h-96">
//           <table className="w-full text-left text-xs font-mono">
//             <thead className="bg-[#0B111E] text-[10px] text-slate-400 uppercase border border-[#1E293B] sticky top-0">
//               <tr>
//                 <th className="py-2.5 px-3">Timestamp</th>
//                 <th className="py-2.5 px-3">Actor</th>
//                 <th className="py-2.5 px-3">Action</th>
//                 <th className="py-2.5 px-3">Details</th>
//                 <th className="py-2.5 px-3">SHA-256 Hash</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-[#1E293B] text-[11px] text-slate-300">
//               {filteredLogs.slice().reverse().map((log) => (
//                 <tr key={log.id} className="hover:bg-[#162136]/50">
//                   <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
//                     {new Date(log.timestamp).toLocaleString([], {
//                       month: 'short',
//                       day: 'numeric',
//                       hour: '2-digit',
//                       minute: '2-digit',
//                       second: '2-digit',
//                     })}
//                   </td>
//                   <td className="py-2.5 px-3 whitespace-nowrap text-slate-200">
//                     {log.actor.name} <span className="text-slate-500">[{log.actor.role}]</span>
//                   </td>
//                   <td className="py-2.5 px-3 whitespace-nowrap">
//                     <span
//                       className={`px-1.5 py-0.5 rounded text-[10px] ${
//                         log.action.includes('ACCEPTED')
//                           ? 'bg-emerald-950 text-emerald-300'
//                           : log.action.includes('REJECTED')
//                           ? 'bg-rose-950 text-rose-300'
//                           : log.action.includes('ANALYSIS')
//                           ? 'bg-blue-950 text-blue-300'
//                           : 'bg-slate-800 text-slate-300'
//                       }`}
//                     >
//                       {log.action}
//                     </span>
//                   </td>
//                   <td className="py-2.5 px-3 text-slate-300 max-w-sm truncate" title={log.details}>
//                     {log.details}
//                   </td>
//                   <td className="py-2.5 px-3 text-slate-500 font-mono text-[10px] truncate max-w-xs" title={`Hash: ${log.hash}\nPrev: ${log.previousHash}`}>
//                     {log.hash.substring(0, 16)}...
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };






import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Shield,
  Lock,
  Cpu,
  Database,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Search,
  Key,
  Eye,
  Hash,
  Download,
  Info,
} from 'lucide-react';
import { useBrandLens } from '../lib/store';

export const SettingsView: React.FC = () => {
  const {
    externalProcessing,
    setExternalProcessing,
    geminiModel,
    setGeminiModel,
    auditLogs,
    verifyAuditIntegrity,
    resetToDefaultSeed,
    currentUser,
  } = useBrandLens();

  const [logFilterAction, setLogFilterAction] = useState<string>('ALL');
  const [logSearchQuery, setLogSearchQuery] = useState<string>('');
  const [resetConfirmed, setResetConfirmed] = useState<boolean>(false);

  // BYOK State
  const [userKey, setUserKey] = useState('');
  const [isKeySaved, setIsKeySaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('gemini_api_key');
    if (saved) setUserKey(saved);
  }, []);

  const handleSaveKey = () => {
    if (userKey.trim()) {
      localStorage.setItem('gemini_api_key', userKey.trim());
      setIsKeySaved(true);
      setTimeout(() => setIsKeySaved(false), 3000);
    } else {
      localStorage.removeItem('gemini_api_key');
      setIsKeySaved(true);
      setTimeout(() => setIsKeySaved(false), 3000);
    }
  };

  const isHashChainValid = verifyAuditIntegrity();

  // Filtered audit logs
  const filteredLogs = auditLogs.filter((log) => {
    if (logFilterAction !== 'ALL' && log.action !== logFilterAction) return false;
    if (logSearchQuery.trim()) {
      const q = logSearchQuery.toLowerCase();
      return (
        log.details.toLowerCase().includes(q) ||
        log.actor.name.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.hash.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleReset = () => {
    resetToDefaultSeed();
    setResetConfirmed(true);
    setTimeout(() => setResetConfirmed(false), 3000);
  };

  const handleExportAuditJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `brandlens_audit_chain_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1E293B]">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-sans">
            Settings & Trust Architecture
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Privacy controls, AI disclosure, role-based access matrix, and append-only cryptographic audit stream
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          title="Restore seed state"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
          <span>{resetConfirmed ? 'Reset Completed!' : 'Restore Demo Seed State'}</span>
        </button>
      </div>

      {/* Grid: AI Disclosure / Safety & RBAC Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: AI Disclosure & Data Processing Policy */}
        <div className="bg-[#131B2A] border border-[#1E293B] rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-[#1E293B]">
            <Cpu className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-white">AI Disclosure & Processing Sovereignty</h3>
          </div>

          <div className="p-4 rounded-xl bg-[#0B111E] border border-[#1E293B] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">External AI Processing</span>
                <span className="text-[11px] text-slate-400">
                  Enable optional Gemini multimodal intelligence assistance
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={externalProcessing}
                  onChange={(e) => setExternalProcessing(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div className="pt-2 border-t border-[#1E293B] text-[11px] text-slate-400 space-y-2">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-slate-300">Offline Pure Engine Guarantee:</strong> All 7 core detection categories (tone, terminology, messaging, claims, visual, accessibility, confidentiality) run locally without any network connection or API keys required.
                </p>
              </div>

              {externalProcessing ? (
                <div className="p-2.5 rounded bg-purple-950/40 border border-purple-800/60 text-purple-200">
                  <span className="font-semibold">External Processing Active:</span> Connected model: {geminiModel}. Inbound text and uploaded imagery are analyzed via server-side Gemini intelligence proxies when explicitly invoked.
                </div>
              ) : (
                <div className="p-2.5 rounded bg-emerald-950/30 border border-emerald-800/60 text-emerald-300 font-mono text-[10px]">
                  ✓ ZERO DATA EGRESS: External AI processing is turned OFF.
                </div>
              )}
            </div>
          </div>

          {/* BYOK Section */}
          <div className="pt-2">
            <label className="flex items-center space-x-2 text-xs font-mono uppercase text-slate-300 mb-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Your Gemini API Key (BYOK)</span>
            </label>
            <div className="flex space-x-2">
              <input
                type="password"
                value={userKey}
                onChange={(e) => setUserKey(e.target.value)}
                placeholder="AIzaSy..."
                className="flex-1 bg-[#0B111E] border border-[#1E293B] rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
              />
              <button
                onClick={handleSaveKey}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-purple-600/30 transition-all cursor-pointer"
              >
                {isKeySaved ? 'Saved!' : 'Save Key'}
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Stored locally in your browser. Never saved to our servers.
            </p>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
              Active Gemini Model Target
            </label>
            <select
              value={geminiModel}
              onChange={(e) => setGeminiModel(e.target.value)}
              disabled={!externalProcessing}
              className="w-full bg-[#0B111E] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 disabled:opacity-50 cursor-pointer font-mono"
            >
              <option value="gemini-3.8-flash">gemini-3.8-flash (General speed & precision)</option>
              <option value="gemini-4-argon">gemini-4-argon (Complex reasoning & image understanding)</option>
              <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Ultra-fast latency)</option>
            </select>
          </div>
        </div>

        {/* Section 2: Role-Based Access Control (RBAC) Matrix */}
        <div className="bg-[#131B2A] border border-[#1E293B] rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-[#1E293B]">
            <Lock className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">Server-Authoritative RBAC Matrix</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B111E] text-[10px] font-mono uppercase text-slate-400 border border-[#1E293B]">
                <tr>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Create / Edit</th>
                  <th className="py-2.5 px-3">Submit</th>
                  <th className="py-2.5 px-3">Review & Approve</th>
                  <th className="py-2.5 px-3">Brand Kit Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B] text-[11px] text-slate-300">
                <tr>
                  <td className="py-2.5 px-3 font-mono font-bold text-blue-400">CREATOR</td>
                  <td className="py-2.5 px-3 text-emerald-400">✓ Allowed</td>
                  <td className="py-2.5 px-3 text-emerald-400">✓ Allowed</td>
                  <td className="py-2.5 px-3 text-rose-400 font-bold">✕ Self-Approval Prohibited</td>
                  <td className="py-2.5 px-3 text-slate-500">Read-only</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">REVIEWER</td>
                  <td className="py-2.5 px-3 text-slate-400">Comments only</td>
                  <td className="py-2.5 px-3 text-slate-500">—</td>
                  <td className="py-2.5 px-3 text-emerald-400 font-bold">✓ Stage 1 & 2 Authority</td>
                  <td className="py-2.5 px-3 text-slate-500">Read-only</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-bold text-purple-400">BRAND_ADMIN</td>
                  <td className="py-2.5 px-3 text-emerald-400">✓ Full access</td>
                  <td className="py-2.5 px-3 text-emerald-400">✓ Allowed</td>
                  <td className="py-2.5 px-3 text-emerald-400">✓ Override & Publish</td>
                  <td className="py-2.5 px-3 text-purple-400 font-bold">✓ Full Edit Authority</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-400">VIEWER</td>
                  <td className="py-2.5 px-3 text-slate-500">—</td>
                  <td className="py-2.5 px-3 text-slate-500">—</td>
                  <td className="py-2.5 px-3 text-slate-500">—</td>
                  <td className="py-2.5 px-3 text-slate-500">Read-only</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 rounded-lg bg-[#0E1524] border border-[#1E293B] text-[11px] text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300">Constitutional Separation of Powers:</p>
            <p>
              To eliminate conflict of interest, the user who authored or drafted a piece of content is strictly prohibited from approving that content for release.
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Append-Only Cryptographic Audit Log Viewer */}
      <div className="bg-[#131B2A] border border-[#1E293B] rounded-xl overflow-hidden shadow-sm space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
          <div className="flex items-center space-x-2.5">
            <Hash className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-semibold text-white">Append-Only Governance Audit Trail</h3>
                {isHashChainValid ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-800 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Hash Chain Valid (SHA-256)</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950/60 text-rose-300 border border-rose-800 flex items-center space-x-1">
                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                    <span>Hash Tampering Detected</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Every detection, human acceptance, rejection, and workflow transition is chained cryptographically.
              </p>
            </div>
          </div>

          <button
            onClick={handleExportAuditJson}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#1E293B] hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit JSON</span>
          </button>
        </div>

        {/* Audit Search and Filter Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={logSearchQuery}
              onChange={(e) => setLogSearchQuery(e.target.value)}
              placeholder="Search audit trail..."
              className="w-full bg-[#0B111E] border border-[#1E293B] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <span>Filter Action:</span>
            <select
              value={logFilterAction}
              onChange={(e) => setLogFilterAction(e.target.value)}
              className="bg-[#0B111E] border border-[#1E293B] rounded px-2.5 py-1 text-slate-200 cursor-pointer focus:outline-none"
            >
              <option value="ALL">All Actions</option>
              <option value="CONTENT_CREATED">CONTENT_CREATED</option>
              <option value="ANALYSIS_RUN">ANALYSIS_RUN</option>
              <option value="SUGGESTION_ACCEPTED">SUGGESTION_ACCEPTED</option>
              <option value="SUGGESTION_REJECTED">SUGGESTION_REJECTED</option>
              <option value="STATUS_CHANGED">STATUS_CHANGED</option>
            </select>
          </div>
        </div>

        {/* Audit Table */}
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0B111E] text-[10px] text-slate-400 uppercase border border-[#1E293B] sticky top-0">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Actor</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Details</th>
                <th className="py-2.5 px-3">SHA-256 Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B] text-[11px] text-slate-300">
              {filteredLogs.slice().reverse().map((log) => (
                <tr key={log.id} className="hover:bg-[#162136]/50">
                  <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-slate-200">
                    {log.actor.name} <span className="text-slate-500">[{log.actor.role}]</span>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] ${
                        log.action.includes('ACCEPTED')
                          ? 'bg-emerald-950 text-emerald-300'
                          : log.action.includes('REJECTED')
                          ? 'bg-rose-950 text-rose-300'
                          : log.action.includes('ANALYSIS')
                          ? 'bg-blue-950 text-blue-300'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 max-w-sm truncate" title={log.details}>
                    {log.details}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 font-mono text-[10px] truncate max-w-xs" title={`Hash: ${log.hash}\nPrev: ${log.previousHash}`}>
                    {log.hash.substring(0, 16)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};