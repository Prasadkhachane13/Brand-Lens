import React, { useState } from 'react';
import {
  Inbox,
  CheckCircle2,
  AlertOctagon,
  Clock,
  ArrowRight,
  ShieldCheck,
  Send,
  MessageSquare,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { useBrandLens } from '../lib/store';
import confetti from 'canvas-confetti';

export const ApprovalInboxView: React.FC = () => {
  const {
    contentItems,
    currentUser,
    approveSubmission,
    requestChangesSubmission,
    setActiveContentId,
    setActiveTab,
  } = useBrandLens();

  const [feedbackModalId, setFeedbackModalId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [workflowError, setWorkflowError] = useState<string | null>(null);
  const [workflowSuccess, setWorkflowSuccess] = useState<string | null>(null);

  // Submissions requiring review: SUBMITTED or IN_REVIEW
  const queuedItems = contentItems.filter(
    (item) => item.status === 'SUBMITTED' || item.status === 'IN_REVIEW' || item.status === 'CHANGES_REQUESTED'
  );

  const handleApprove = (id: string, stage: 'STAGE_1' | 'FINAL') => {
    setWorkflowError(null);
    const res = approveSubmission(id, stage);
    if (!res.success) {
      setWorkflowError(res.error || 'Approval rejected.');
    } else {
      setWorkflowSuccess(`Successfully approved ${stage === 'STAGE_1' ? 'Stage 1 Editorial' : 'Final Brand Release'}!`);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => setWorkflowSuccess(null), 3000);
    }
  };

  const handleRequestChanges = (id: string) => {
    if (!feedbackText.trim()) return;
    const res = requestChangesSubmission(id, feedbackText.trim());
    if (!res.success) {
      setWorkflowError(res.error || 'Failed to request changes.');
    } else {
      setWorkflowSuccess('Changes requested and sent back to author with feedback.');
      setFeedbackModalId(null);
      setFeedbackText('');
      setTimeout(() => setWorkflowSuccess(null), 3000);
    }
  };

  const handleOpenWorkspace = (id: string) => {
    setActiveContentId(id);
    setActiveTab('workspace');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1E293B]">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl font-bold text-white tracking-tight font-sans">
              Editorial & Governance Queue
            </h1>
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-amber-900/40 text-amber-300 border border-amber-700/60">
              {queuedItems.length} Pending
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Multi-stage human authority review workflow for Northwind Home brand publications
          </p>
        </div>

        {/* Persona banner */}
        <div className="flex items-center space-x-2.5 bg-[#131B2A] border border-[#1E293B] px-3.5 py-2 rounded-xl text-xs font-mono">
          <span className="text-slate-400">Reviewer Persona:</span>
          <span className="font-bold text-white">{currentUser.name}</span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              currentUser.role === 'CREATOR'
                ? 'bg-blue-900/60 text-blue-300 border border-blue-700'
                : currentUser.role === 'REVIEWER'
                ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                : 'bg-purple-900/60 text-purple-300 border border-purple-700'
            }`}
          >
            [{currentUser.role}]
          </span>
        </div>
      </div>

      {/* Workflow Notifications */}
      {workflowError && (
        <div className="mt-4 p-3.5 rounded-lg bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
          <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{workflowError}</span>
        </div>
      )}
      {workflowSuccess && (
        <div className="mt-4 p-3.5 rounded-lg bg-emerald-950/50 border border-emerald-800 text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{workflowSuccess}</span>
        </div>
      )}

      {/* Queue Cards */}
      <div className="mt-6 space-y-4">
        {queuedItems.length === 0 ? (
          <div className="p-16 text-center bg-[#131B2A] rounded-xl border border-[#1E293B] space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto opacity-70" />
            <h3 className="text-sm font-semibold text-white">Review Queue is Clear</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No submissions are currently pending editorial approval. You can submit draft collateral from the Dashboard or Review Workspace.
            </p>
          </div>
        ) : (
          queuedItems.map((item) => {
            const isCreator = currentUser.id === item.author.id;
            const activeV = item.versions.find((v) => v.id === item.activeVersionId) || item.versions[0];
            const openFindingsCount = activeV?.findings?.filter((f) => f.status === 'OPEN').length || 0;
            const stageLabel =
              item.status === 'SUBMITTED' ? 'STAGE 1: EDITORIAL' : 'STAGE 2: BRAND GOVERNANCE';

            return (
              <div
                key={item.id}
                className="bg-[#131B2A] border border-[#1E293B] rounded-xl p-5 hover:border-slate-700 transition-all shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                      {stageLabel}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {item.channel}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/50 text-amber-300 border border-amber-800">
                      {item.status} ➔
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-slate-400 flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      Submitted: {item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
                  <div>
                    <h3 className="text-base font-semibold text-white">{item.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Submitted by {item.author.name} ({item.author.email}) • v{item.currentVersion}
                    </p>
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#0B111E] text-slate-300 border border-[#1E293B]">
                        {openFindingsCount} open findings
                      </span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#0B111E] text-slate-400 border border-[#1E293B]">
                        Readiness: {activeV.readinessScore}%
                      </span>
                    </div>
                  </div>

                  {/* Review Actions with RBAC enforcement */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      onClick={() => handleOpenWorkspace(item.id)}
                      className="px-3.5 py-2 bg-[#1E293B] hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                    >
                      Open in Workspace
                    </button>

                    {isCreator ? (
                      /* Self-Approval Prohibited Enforcement Badge */
                      <div
                        className="px-3.5 py-2 rounded-lg bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs font-mono font-medium flex items-center space-x-1.5 cursor-not-allowed opacity-80"
                        title="Per brand governance constitution, authors cannot self-approve their own submissions"
                      >
                        <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                        <span>Self-Approval Prohibited</span>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => setFeedbackModalId(item.id)}
                          className="px-3.5 py-2 bg-[#1E293B] hover:bg-orange-950/60 border border-orange-800/60 text-orange-300 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                        >
                          Request Changes
                        </button>

                        <button
                          onClick={() =>
                            handleApprove(item.id, item.status === 'SUBMITTED' ? 'STAGE_1' : 'FINAL')
                          }
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-emerald-600/30 transition-all flex items-center space-x-1.5 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>
                            {item.status === 'SUBMITTED' ? 'Approve Stage 1' : 'Approve & Publish'}
                          </span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Changes Feedback Drawer / Inline Form */}
                {feedbackModalId === item.id && (
                  <div className="mt-4 p-4 rounded-xl bg-[#0B111E] border border-orange-800/60 space-y-3">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-orange-300">
                      <MessageSquare className="w-4 h-4" />
                      <span>Specify Required Editorial Changes</span>
                    </div>
                    <textarea
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      rows={3}
                      placeholder="Explain what phrasing, facts, or guidelines need revision..."
                      className="w-full bg-[#131B2A] border border-[#1E293B] rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-sans"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setFeedbackModalId(null);
                          setFeedbackText('');
                        }}
                        className="px-3 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleRequestChanges(item.id)}
                        className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Send Change Request
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
