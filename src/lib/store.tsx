// import React, { createContext, useContext, useEffect, useState } from 'react';
// import {
//   AnchoredComment,
//   AuditLogEntry,
//   BrandKit,
//   Citation,
//   ContentChannel,
//   ContentFormat,
//   ContentItem,
//   ContentStatus,
//   ContentVersion,
//   Finding,
//   Guideline,
//   Role,
//   TerminologyTerm,
//   ApprovedSource,
//   ApprovedAsset,
//   ToneProfile,
//   User,
// } from './types';
// import {
//   SEED_AUDIT_LOG,
//   SEED_BRAND_KIT,
//   SEED_USERS,
//   createSeedContentItems,
// } from './seedData';
// import { applySuggestedFix, runDetectionEngine, sha256 } from './engine';

// export type ScreenTab =
//   | 'dashboard'
//   | 'brand-kit'
//   | 'workspace'
//   | 'inbox'
//   | 'insights'
//   | 'settings';

// interface BrandLensContextType {
//   // Navigation & User
//   activeTab: ScreenTab;
//   setActiveTab: (tab: ScreenTab) => void;
//   currentUser: User;
//   setCurrentUser: (user: User) => void;
//   allUsers: User[];

//   // Brand Kit
//   brandKit: BrandKit;
//   updateGuideline: (guideline: Guideline) => void;
//   addGuideline: (guideline: Guideline) => void;
//   updateTerm: (term: TerminologyTerm) => void;
//   addTerm: (term: TerminologyTerm) => void;
//   updateSource: (source: ApprovedSource) => void;
//   addSource: (source: ApprovedSource) => void;
//   updateToneProfile: (profile: ToneProfile) => void;

//   // Content Items & Review Workspace
//   contentItems: ContentItem[];
//   activeContentItem: ContentItem | null;
//   activeVersion: ContentVersion | null;
//   setActiveContentId: (id: string) => void;
//   updateContentText: (id: string, text: string) => void;
//   reanalyzeContent: (id: string) => void;
//   createNewVersion: (id: string, newText: string, summary?: string) => void;

//   // Decision Handling (Human Authority: Accept, Edit, Reject)
//   acceptFindingFix: (findingId: string) => void;
//   editFindingFix: (findingId: string, customReplacement: string) => void;
//   rejectFindingFix: (findingId: string, reason?: string) => void;

//   // Workflow & Approval
//   submitForReview: (id: string) => { success: boolean; error?: string };
//   approveSubmission: (id: string, stage: 'STAGE_1' | 'FINAL') => { success: boolean; error?: string };
//   requestChangesSubmission: (id: string, feedback: string) => { success: boolean; error?: string };
//   publishContent: (id: string) => { success: boolean; error?: string };
//   createNewContentItem: (item: {
//     title: string;
//     channel: ContentChannel;
//     format: ContentFormat;
//     rawContent: string;
//     mediaUrl?: string;
//   }) => ContentItem;

//   // Citations & Inspection Drawer
//   inspectingCitation: Citation | null;
//   setInspectingCitation: (citation: Citation | null) => void;
//   selectedFindingId: string | null;
//   setSelectedFindingId: (id: string | null) => void;

//   // Anchored Comments
//   comments: AnchoredComment[];
//   addComment: (contentItemId: string, text: string, span?: any) => void;
//   resolveComment: (commentId: string) => void;

//   // Audit Log
//   auditLogs: AuditLogEntry[];
//   verifyAuditIntegrity: () => boolean;

//   // Settings & Trust
//   externalProcessing: boolean;
//   setExternalProcessing: (enabled: boolean) => void;
//   geminiModel: string;
//   setGeminiModel: (model: string) => void;

//   // Reset
//   resetToDefaultSeed: () => void;
// }

// const BrandLensContext = createContext<BrandLensContextType | undefined>(undefined);

// const STORAGE_KEY = 'brandlens_state_v1';

// export const BrandLensProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [activeTab, setActiveTab] = useState<ScreenTab>('dashboard');
//   const [currentUser, setCurrentUser] = useState<User>(SEED_USERS[0]); // Ada Lovelace (CREATOR)
//   const [brandKit, setBrandKit] = useState<BrandKit>(SEED_BRAND_KIT);
//   const [contentItems, setContentItems] = useState<ContentItem[]>(() => {
//     if (typeof window !== 'undefined') {
//       try {
//         const saved = localStorage.getItem(`${STORAGE_KEY}_items`);
//         if (saved) return JSON.parse(saved);
//       } catch (e) {
//         console.error(e);
//       }
//     }
//     return createSeedContentItems();
//   });

//   const [activeContentId, setActiveContentId] = useState<string>('content-claims-flyer');
//   const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
//     if (typeof window !== 'undefined') {
//       try {
//         const saved = localStorage.getItem(`${STORAGE_KEY}_audit`);
//         if (saved) return JSON.parse(saved);
//       } catch (e) {
//         console.error(e);
//       }
//     }
//     return SEED_AUDIT_LOG;
//   });

//   const [comments, setComments] = useState<AnchoredComment[]>([
//     {
//       id: 'comment-1',
//       contentItemId: 'content-claims-flyer',
//       versionNumber: 1,
//       author: SEED_USERS[1], // Marcus Aurelius
//       text: 'Please review the outdated 2023 Thermal Modulation Award claim before submitting for Stage 1 editorial approval.',
//       createdAt: '2026-10-22T10:00:00Z',
//       resolved: false,
//       span: { start: 21, end: 23, text: '#1' },
//     },
//   ]);

//   const [inspectingCitation, setInspectingCitation] = useState<Citation | null>(null);
//   const [selectedFindingId, setSelectedFindingId] = useState<string | null>(null);

//   // Settings: External Processing defaults to OFF as required
//   const [externalProcessing, setExternalProcessing] = useState<boolean>(false);
//   const [geminiModel, setGeminiModel] = useState<string>('gemini-3.8-flash');

//   // Persistence
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       try {
//         localStorage.setItem(`${STORAGE_KEY}_items`, JSON.stringify(contentItems));
//       } catch (e) {
//         console.error(e);
//       }
//     }
//   }, [contentItems]);

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       try {
//         localStorage.setItem(`${STORAGE_KEY}_audit`, JSON.stringify(auditLogs));
//       } catch (e) {
//         console.error(e);
//       }
//     }
//   }, [auditLogs]);

//   // Active item & version
//   const activeContentItem =
//     contentItems.find((item) => item.id === activeContentId) || contentItems[0] || null;

//   const activeVersion = activeContentItem
//     ? activeContentItem.versions.find((v) => v.id === activeContentItem.activeVersionId) ||
//       activeContentItem.versions[activeContentItem.versions.length - 1]
//     : null;

//   // Append to audit log with SHA-256 hash chaining
//   const recordAudit = async (
//     action: AuditLogEntry['action'],
//     targetType: AuditLogEntry['targetType'],
//     targetId: string,
//     details: string
//   ) => {
//     const prev = auditLogs[auditLogs.length - 1];
//     const previousHash = prev ? prev.hash : '0000000000000000';
//     const timestamp = new Date().toISOString();
//     const rawPayload = `${timestamp}|${currentUser.id}|${action}|${targetId}|${previousHash}|${details}`;
//     const hash = await sha256(rawPayload);

//     const newLog: AuditLogEntry = {
//       id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
//       timestamp,
//       actor: {
//         id: currentUser.id,
//         name: currentUser.name,
//         email: currentUser.email,
//         role: currentUser.role,
//       },
//       action,
//       targetType,
//       targetId,
//       details,
//       previousHash,
//       hash,
//     };

//     setAuditLogs((prevLogs) => [...prevLogs, newLog]);
//   };

//   // Re-run detection engine on content item
//   const reanalyzeContent = (id: string) => {
//     setContentItems((items) =>
//       items.map((item) => {
//         if (item.id !== id) return item;

//         const currentV =
//           item.versions.find((v) => v.id === item.activeVersionId) ||
//           item.versions[item.versions.length - 1];

//         const analysis = runDetectionEngine(
//           currentV.rawContent,
//           {
//             contentItemId: item.id,
//             versionId: currentV.id,
//             channel: item.channel,
//             format: item.format,
//             mediaUrl: item.mediaUrl,
//           },
//           brandKit
//         );

//         const updatedVersion: ContentVersion = {
//           ...currentV,
//           findings: analysis.findings,
//           readinessScore: analysis.readinessScore,
//           blockersCount: analysis.blockersCount,
//           totalFindingsCount: analysis.totalFindingsCount,
//         };

//         return {
//           ...item,
//           updatedAt: new Date().toISOString(),
//           versions: item.versions.map((v) => (v.id === currentV.id ? updatedVersion : v)),
//         };
//       })
//     );

//     recordAudit('ANALYSIS_RUN', 'CONTENT', id, 'Re-ran deterministic detection engine across 7 categories');
//   };

//   // Update raw text of active version & re-analyze
//   const updateContentText = (id: string, text: string) => {
//     setContentItems((items) =>
//       items.map((item) => {
//         if (item.id !== id) return item;

//         const currentV =
//           item.versions.find((v) => v.id === item.activeVersionId) ||
//           item.versions[item.versions.length - 1];

//         const analysis = runDetectionEngine(
//           text,
//           {
//             contentItemId: item.id,
//             versionId: currentV.id,
//             channel: item.channel,
//             format: item.format,
//             mediaUrl: item.mediaUrl,
//           },
//           brandKit
//         );

//         const updatedVersion: ContentVersion = {
//           ...currentV,
//           rawContent: text,
//           findings: analysis.findings,
//           readinessScore: analysis.readinessScore,
//           blockersCount: analysis.blockersCount,
//           totalFindingsCount: analysis.totalFindingsCount,
//         };

//         return {
//           ...item,
//           updatedAt: new Date().toISOString(),
//           versions: item.versions.map((v) => (v.id === currentV.id ? updatedVersion : v)),
//         };
//       })
//     );
//   };

//   // Create a new version
//   const createNewVersion = (id: string, newText: string, summary?: string) => {
//     setContentItems((items) =>
//       items.map((item) => {
//         if (item.id !== id) return item;

//         const newVersionNumber = item.currentVersion + 1;
//         const newVersionId = `${item.id}-v${newVersionNumber}`;

//         const analysis = runDetectionEngine(
//           newText,
//           {
//             contentItemId: item.id,
//             versionId: newVersionId,
//             channel: item.channel,
//             format: item.format,
//             mediaUrl: item.mediaUrl,
//           },
//           brandKit
//         );

//         const newVersion: ContentVersion = {
//           id: newVersionId,
//           contentItemId: item.id,
//           versionNumber: newVersionNumber,
//           rawContent: newText,
//           mediaUrl: item.mediaUrl,
//           readinessScore: analysis.readinessScore,
//           blockersCount: analysis.blockersCount,
//           totalFindingsCount: analysis.totalFindingsCount,
//           findings: analysis.findings,
//           changeSummary: summary || `Version ${newVersionNumber} revision`,
//           createdAt: new Date().toISOString(),
//           authorId: currentUser.id,
//         };

//         return {
//           ...item,
//           currentVersion: newVersionNumber,
//           activeVersionId: newVersionId,
//           updatedAt: new Date().toISOString(),
//           versions: [...item.versions, newVersion],
//         };
//       })
//     );

//     recordAudit('VERSION_CREATED', 'CONTENT', id, `Created version #${activeContentItem?.currentVersion ? activeContentItem.currentVersion + 1 : 2}`);
//   };

//   // Human Authority: Accept a suggested fix
//   const acceptFindingFix = (findingId: string) => {
//     if (!activeContentItem || !activeVersion) return;

//     const finding = activeVersion.findings.find((f) => f.id === findingId);
//     if (!finding) return;

//     const updatedText = applySuggestedFix(activeVersion.rawContent, finding);

//     // Apply fix and reanalyze
//     setContentItems((items) =>
//       items.map((item) => {
//         if (item.id !== activeContentItem.id) return item;

//         const analysis = runDetectionEngine(
//           updatedText,
//           {
//             contentItemId: item.id,
//             versionId: activeVersion.id,
//             channel: item.channel,
//             format: item.format,
//             mediaUrl: item.mediaUrl,
//           },
//           brandKit
//         );

//         // Mark this finding as accepted
//         const markedFindings = analysis.findings.map((f) =>
//           f.id === findingId
//             ? { ...f, status: 'ACCEPTED' as const, reviewedBy: currentUser.id, reviewedAt: new Date().toISOString() }
//             : f
//         );

//         const updatedVersion: ContentVersion = {
//           ...activeVersion,
//           rawContent: updatedText,
//           findings: markedFindings,
//           readinessScore: analysis.readinessScore,
//           blockersCount: analysis.blockersCount,
//           totalFindingsCount: analysis.totalFindingsCount,
//         };

//         return {
//           ...item,
//           updatedAt: new Date().toISOString(),
//           versions: item.versions.map((v) => (v.id === activeVersion.id ? updatedVersion : v)),
//         };
//       })
//     );

//     recordAudit(
//       'SUGGESTION_ACCEPTED',
//       'FINDING',
//       findingId,
//       `Accepted fix "${finding.suggestedFix.text}" for rule ${finding.ruleCode}`
//     );
//   };

//   // Human Authority: Edit a suggested fix before applying
//   const editFindingFix = (findingId: string, customReplacement: string) => {
//     if (!activeContentItem || !activeVersion) return;

//     const finding = activeVersion.findings.find((f) => f.id === findingId);
//     if (!finding) return;

//     const updatedText = applySuggestedFix(activeVersion.rawContent, finding, customReplacement);

//     setContentItems((items) =>
//       items.map((item) => {
//         if (item.id !== activeContentItem.id) return item;

//         const analysis = runDetectionEngine(
//           updatedText,
//           {
//             contentItemId: item.id,
//             versionId: activeVersion.id,
//             channel: item.channel,
//             format: item.format,
//             mediaUrl: item.mediaUrl,
//           },
//           brandKit
//         );

//         const markedFindings = analysis.findings.map((f) =>
//           f.id === findingId
//             ? {
//                 ...f,
//                 status: 'EDITED' as const,
//                 editedFix: customReplacement,
//                 reviewedBy: currentUser.id,
//                 reviewedAt: new Date().toISOString(),
//               }
//             : f
//         );

//         const updatedVersion: ContentVersion = {
//           ...activeVersion,
//           rawContent: updatedText,
//           findings: markedFindings,
//           readinessScore: analysis.readinessScore,
//           blockersCount: analysis.blockersCount,
//           totalFindingsCount: analysis.totalFindingsCount,
//         };

//         return {
//           ...item,
//           updatedAt: new Date().toISOString(),
//           versions: item.versions.map((v) => (v.id === activeVersion.id ? updatedVersion : v)),
//         };
//       })
//     );

//     recordAudit(
//       'SUGGESTION_EDITED',
//       'FINDING',
//       findingId,
//       `Edited and applied custom fix "${customReplacement}" for rule ${finding.ruleCode}`
//     );
//   };

//   // Human Authority: Reject a suggested fix (feeds Ambiguity Radar!)
//   const rejectFindingFix = (findingId: string, reason?: string) => {
//     if (!activeContentItem || !activeVersion) return;

//     setContentItems((items) =>
//       items.map((item) => {
//         if (item.id !== activeContentItem.id) return item;

//         const updatedFindings = activeVersion.findings.map((f) => {
//           if (f.id === findingId) {
//             return {
//               ...f,
//               status: 'REJECTED' as const,
//               rejectionReason: reason || 'Author deemed guideline ambiguous or non-applicable',
//               reviewedBy: currentUser.id,
//               reviewedAt: new Date().toISOString(),
//             };
//           }
//           return f;
//         });

//         const updatedVersion: ContentVersion = {
//           ...activeVersion,
//           findings: updatedFindings,
//         };

//         return {
//           ...item,
//           versions: item.versions.map((v) => (v.id === activeVersion.id ? updatedVersion : v)),
//         };
//       })
//     );

//     const f = activeVersion.findings.find((x) => x.id === findingId);
//     recordAudit(
//       'SUGGESTION_REJECTED',
//       'FINDING',
//       findingId,
//       `Rejected fix for ${f?.ruleCode || 'rule'}. Reason: ${reason || 'Ambiguous'}`
//     );
//   };

//   // Workflow: Submit for Review
//   const submitForReview = (id: string): { success: boolean; error?: string } => {
//     const item = contentItems.find((i) => i.id === id);
//     if (!item) return { success: false, error: 'Content item not found.' };

//     const version = item.versions.find((v) => v.id === item.activeVersionId) || item.versions[item.versions.length - 1];
//     if (version.blockersCount > 0) {
//       return {
//         success: false,
//         error: `Submission blocked: ${version.blockersCount} critical BLOCKER findings must be resolved before requesting review.`,
//       };
//     }

//     setContentItems((items) =>
//       items.map((i) =>
//         i.id === id
//           ? {
//               ...i,
//               status: 'SUBMITTED' as ContentStatus,
//               submittedAt: new Date().toISOString(),
//               updatedAt: new Date().toISOString(),
//             }
//           : i
//       )
//     );

//     recordAudit('STATUS_CHANGED', 'CONTENT', id, 'Status changed: DRAFT -> SUBMITTED');
//     return { success: true };
//   };

//   // Workflow: Approve (CRITICAL RBAC: Creators cannot self-approve!)
//   const approveSubmission = (
//     id: string,
//     stage: 'STAGE_1' | 'FINAL'
//   ): { success: boolean; error?: string } => {
//     const item = contentItems.find((i) => i.id === id);
//     if (!item) return { success: false, error: 'Item not found.' };

//     // RBAC Rule: Creators cannot self-approve!
//     if (currentUser.id === item.author.id) {
//       return {
//         success: false,
//         error: 'RBAC Enforcement: Creators cannot self-approve their own submissions. A separate Reviewer or Brand Admin must approve.',
//       };
//     }

//     if (currentUser.role === 'CREATOR' || currentUser.role === 'VIEWER') {
//       return {
//         success: false,
//         error: `Role ${currentUser.role} does not possess review authority. Only REVIEWER or BRAND_ADMIN can approve.`,
//       };
//     }

//     const nextStatus: ContentStatus = stage === 'STAGE_1' ? 'IN_REVIEW' : 'APPROVED';

//     setContentItems((items) =>
//       items.map((i) =>
//         i.id === id
//           ? {
//               ...i,
//               status: nextStatus,
//               approvedAt: stage === 'FINAL' ? new Date().toISOString() : undefined,
//               reviewerId: currentUser.id,
//               updatedAt: new Date().toISOString(),
//             }
//           : i
//       )
//     );

//     recordAudit(
//       'STATUS_CHANGED',
//       'CONTENT',
//       id,
//       `Submission approved by ${currentUser.name} (${currentUser.role}) -> ${nextStatus}`
//     );
//     return { success: true };
//   };

//   // Workflow: Request Changes
//   const requestChangesSubmission = (
//     id: string,
//     feedback: string
//   ): { success: boolean; error?: string } => {
//     if (currentUser.role === 'CREATOR' || currentUser.role === 'VIEWER') {
//       return {
//         success: false,
//         error: 'Only REVIEWER or BRAND_ADMIN personas can request editorial changes.',
//       };
//     }

//     setContentItems((items) =>
//       items.map((i) =>
//         i.id === id
//           ? {
//               ...i,
//               status: 'CHANGES_REQUESTED' as ContentStatus,
//               reviewNotes: feedback,
//               updatedAt: new Date().toISOString(),
//             }
//           : i
//       )
//     );

//     recordAudit(
//       'STATUS_CHANGED',
//       'CONTENT',
//       id,
//       `Changes requested by ${currentUser.name}: "${feedback}"`
//     );
//     return { success: true };
//   };

//   // Workflow: Publish Content
//   const publishContent = (id: string): { success: boolean; error?: string } => {
//     const item = contentItems.find((i) => i.id === id);
//     if (!item) return { success: false, error: 'Item not found.' };

//     if (item.status !== 'APPROVED') {
//       return {
//         success: false,
//         error: 'Content must achieve full human approval before publishing.',
//       };
//     }

//     setContentItems((items) =>
//       items.map((i) =>
//         i.id === id
//           ? {
//               ...i,
//               status: 'PUBLISHED' as ContentStatus,
//               publishedAt: new Date().toISOString(),
//               updatedAt: new Date().toISOString(),
//             }
//           : i
//       )
//     );

//     recordAudit('STATUS_CHANGED', 'CONTENT', id, `Content published live to ${item.channel} channel`);
//     return { success: true };
//   };

//   // Create new content item
//   const createNewContentItem = (newItem: {
//     title: string;
//     channel: ContentChannel;
//     format: ContentFormat;
//     rawContent: string;
//     mediaUrl?: string;
//   }): ContentItem => {
//     const id = `content-${Date.now()}`;
//     const versionId = `${id}-v1`;

//     const analysis = runDetectionEngine(
//       newItem.rawContent,
//       {
//         contentItemId: id,
//         versionId,
//         channel: newItem.channel,
//         format: newItem.format,
//         mediaUrl: newItem.mediaUrl,
//       },
//       brandKit
//     );

//     const version: ContentVersion = {
//       id: versionId,
//       contentItemId: id,
//       versionNumber: 1,
//       rawContent: newItem.rawContent,
//       mediaUrl: newItem.mediaUrl,
//       readinessScore: analysis.readinessScore,
//       blockersCount: analysis.blockersCount,
//       totalFindingsCount: analysis.totalFindingsCount,
//       findings: analysis.findings,
//       changeSummary: 'Initial document draft',
//       createdAt: new Date().toISOString(),
//       authorId: currentUser.id,
//     };

//     const item: ContentItem = {
//       id,
//       title: newItem.title,
//       channel: newItem.channel,
//       format: newItem.format,
//       status: 'DRAFT',
//       author: currentUser,
//       activeVersionId: versionId,
//       currentVersion: 1,
//       versions: [version],
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//       mediaUrl: newItem.mediaUrl,
//     };

//     setContentItems((prev) => [item, ...prev]);
//     setActiveContentId(id);
//     setActiveTab('workspace');

//     recordAudit('CONTENT_CREATED', 'CONTENT', id, `Created new ${newItem.format} content in ${newItem.channel}`);
//     return item;
//   };

//   // Brand Kit modifications
//   const updateGuideline = (g: Guideline) => {
//     setBrandKit((prev) => ({
//       ...prev,
//       guidelines: prev.guidelines.map((x) => (x.id === g.id ? g : x)),
//     }));
//     recordAudit('GUIDELINE_UPDATED', 'GUIDELINE', g.id, `Updated guideline ${g.title}`);
//   };

//   const addGuideline = (g: Guideline) => {
//     setBrandKit((prev) => ({
//       ...prev,
//       guidelines: [...prev.guidelines, g],
//     }));
//     recordAudit('GUIDELINE_UPDATED', 'GUIDELINE', g.id, `Created guideline ${g.title}`);
//   };

//   const updateTerm = (t: TerminologyTerm) => {
//     setBrandKit((prev) => ({
//       ...prev,
//       terms: prev.terms.map((x) => (x.id === t.id ? t : x)),
//     }));
//     recordAudit('SETTINGS_UPDATED', 'SYSTEM', t.id, `Updated term rule ${t.term} -> ${t.preferred}`);
//   };

//   const addTerm = (t: TerminologyTerm) => {
//     setBrandKit((prev) => ({
//       ...prev,
//       terms: [...prev.terms, t],
//     }));
//     recordAudit('SETTINGS_UPDATED', 'SYSTEM', t.id, `Added term rule ${t.term} -> ${t.preferred}`);
//   };

//   const updateSource = (s: ApprovedSource) => {
//     setBrandKit((prev) => ({
//       ...prev,
//       approvedSources: prev.approvedSources.map((x) => (x.id === s.id ? s : x)),
//     }));
//     recordAudit('SOURCE_UPDATED', 'SOURCE', s.id, `Updated approved source ${s.title}`);
//   };

//   const addSource = (s: ApprovedSource) => {
//     setBrandKit((prev) => ({
//       ...prev,
//       approvedSources: [...prev.approvedSources, s],
//     }));
//     recordAudit('SOURCE_UPDATED', 'SOURCE', s.id, `Added approved source ${s.title}`);
//   };

//   const updateToneProfile = (tp: ToneProfile) => {
//     setBrandKit((prev) => ({
//       ...prev,
//       toneProfile: tp,
//     }));
//     recordAudit('SETTINGS_UPDATED', 'SYSTEM', 'tone-profile', 'Updated brand tone profile benchmarks');
//   };

//   // Anchored Comments
//   const addComment = (contentItemId: string, text: string, span?: any) => {
//     const newComment: AnchoredComment = {
//       id: `comm-${Date.now()}`,
//       contentItemId,
//       versionNumber: activeVersion?.versionNumber || 1,
//       author: currentUser,
//       text,
//       span,
//       createdAt: new Date().toISOString(),
//       resolved: false,
//     };
//     setComments((prev) => [...prev, newComment]);
//     recordAudit('COMMENT_ADDED', 'CONTENT', contentItemId, `Added anchored comment: "${text.substring(0, 40)}..."`);
//   };

//   const resolveComment = (commentId: string) => {
//     setComments((prev) =>
//       prev.map((c) => (c.id === commentId ? { ...c, resolved: true } : c))
//     );
//   };

//   // Verify cryptographic integrity of append-only audit log
//   const verifyAuditIntegrity = (): boolean => {
//     for (let i = 1; i < auditLogs.length; i++) {
//       if (auditLogs[i].previousHash !== auditLogs[i - 1].hash) {
//         return false;
//       }
//     }
//     return true;
//   };

//   const resetToDefaultSeed = () => {
//     const items = createSeedContentItems();
//     setContentItems(items);
//     setBrandKit(SEED_BRAND_KIT);
//     setAuditLogs(SEED_AUDIT_LOG);
//     setActiveContentId('content-claims-flyer');
//     if (typeof window !== 'undefined') {
//       localStorage.removeItem(`${STORAGE_KEY}_items`);
//       localStorage.removeItem(`${STORAGE_KEY}_audit`);
//     }
//   };

//   return (
//     <BrandLensContext.Provider
//       value={{
//         activeTab,
//         setActiveTab,
//         currentUser,
//         setCurrentUser,
//         allUsers: SEED_USERS,
//         brandKit,
//         updateGuideline,
//         addGuideline,
//         updateTerm,
//         addTerm,
//         updateSource,
//         addSource,
//         updateToneProfile,
//         contentItems,
//         activeContentItem,
//         activeVersion,
//         setActiveContentId,
//         updateContentText,
//         reanalyzeContent,
//         createNewVersion,
//         acceptFindingFix,
//         editFindingFix,
//         rejectFindingFix,
//         submitForReview,
//         approveSubmission,
//         requestChangesSubmission,
//         publishContent,
//         createNewContentItem,
//         inspectingCitation,
//         setInspectingCitation,
//         selectedFindingId,
//         setSelectedFindingId,
//         comments,
//         addComment,
//         resolveComment,
//         auditLogs,
//         verifyAuditIntegrity,
//         externalProcessing,
//         setExternalProcessing,
//         geminiModel,
//         setGeminiModel,
//         resetToDefaultSeed,
//       }}
//     >
//       {children}
//     </BrandLensContext.Provider>
//   );
// };

// export const useBrandLens = (): BrandLensContextType => {
//   const context = useContext(BrandLensContext);
//   if (!context) {
//     throw new Error('useBrandLens must be used within a BrandLensProvider');
//   }
//   return context;
// };




// import React, { createContext, useContext, useEffect, useState } from 'react';
// import {
//   AnchoredComment,
//   AuditLogEntry,
//   BrandKit,
//   Citation,
//   ContentChannel,
//   ContentFormat,
//   ContentItem,
//   ContentStatus,
//   ContentVersion,
//   Finding,
//   Guideline,
//   Role,
//   TerminologyTerm,
//   ApprovedSource,
//   ApprovedAsset,
//   ToneProfile,
//   User,
// } from './types';
// import {
//   AVAILABLE_BRANDS,
//   SEED_AUDIT_LOG,
//   SEED_BRAND_KIT,
//   SEED_USERS,
//   createSeedContentItems,
// } from './seedData';
// import { applySuggestedFix, runDetectionEngine, sha256 } from './engine';

// export type ScreenTab =
//   | 'dashboard'
//   | 'brand-kit'
//   | 'workspace'
//   | 'inbox'
//   | 'insights'
//   | 'settings';

// interface BrandLensContextType {
//   // Navigation & User
//   activeTab: ScreenTab;
//   setActiveTab: (tab: ScreenTab) => void;
//   currentUser: User;
//   setCurrentUser: (user: User) => void;
//   allUsers: User[];

//   // Brand Kit
//   brandKit: BrandKit;
//   availableBrands: string[];
//   switchBrand: (brandName: string) => void;
//   updateBrandInfo: (name: string, tagline?: string) => void;
//   updateGuideline: (guideline: Guideline) => void;
//   addGuideline: (guideline: Guideline) => void;
//   updateTerm: (term: TerminologyTerm) => void;
//   addTerm: (term: TerminologyTerm) => void;
//   updateSource: (source: ApprovedSource) => void;
//   addSource: (source: ApprovedSource) => void;
//   addAsset: (asset: ApprovedAsset) => void;
//   updateToneProfile: (profile: ToneProfile) => void;

//   // Content Items & Review Workspace
//   contentItems: ContentItem[];
//   activeContentItem: ContentItem | null;
//   activeVersion: ContentVersion | null;
//   setActiveContentId: (id: string) => void;
//   updateContentText: (id: string, text: string) => void;
//   reanalyzeContent: (id: string) => void;
//   createNewVersion: (id: string, newText: string, summary?: string) => void;

//   // Decision Handling (Human Authority: Accept, Edit, Reject)
//   acceptFindingFix: (findingId: string) => void;
//   editFindingFix: (findingId: string, customReplacement: string) => void;
//   rejectFindingFix: (findingId: string, reason?: string) => void;

//   // Workflow & Approval
//   submitForReview: (id: string) => { success: boolean; error?: string };
//   approveSubmission: (id: string, stage: 'STAGE_1' | 'FINAL') => { success: boolean; error?: string };
//   requestChangesSubmission: (id: string, feedback: string) => { success: boolean; error?: string };
//   publishContent: (id: string) => { success: boolean; error?: string };
//   createNewContentItem: (item: {
//     title: string;
//     channel: ContentChannel;
//     format: ContentFormat;
//     rawContent: string;
//     mediaUrl?: string;
//   }) => ContentItem;

//   // Citations & Inspection Drawer
//   inspectingCitation: Citation | null;
//   setInspectingCitation: (citation: Citation | null) => void;
//   selectedFindingId: string | null;
//   setSelectedFindingId: (id: string | null) => void;

//   // Anchored Comments
//   comments: AnchoredComment[];
//   addComment: (contentItemId: string, text: string, span?: any) => void;
//   resolveComment: (commentId: string) => void;

//   // Audit Log
//   auditLogs: AuditLogEntry[];
//   verifyAuditIntegrity: () => boolean;

//   // Settings & Trust
//   externalProcessing: boolean;
//   setExternalProcessing: (enabled: boolean) => void;
//   geminiModel: string;
//   setGeminiModel: (model: string) => void;

//   // Reset
//   resetToDefaultSeed: () => void;
// }

// const BrandLensContext = createContext<BrandLensContextType | undefined>(undefined);

// const STORAGE_KEY = 'brandlens_state_v1';

// export const BrandLensProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [activeTab, setActiveTab] = useState<ScreenTab>('dashboard');
//   const [currentUser, setCurrentUser] = useState<User>(SEED_USERS[0]); // Ada Lovelace (CREATOR)
//   const [brandKit, setBrandKit] = useState<BrandKit>(SEED_BRAND_KIT);
//   const [contentItems, setContentItems] = useState<ContentItem[]>(() => {
//     if (typeof window !== 'undefined') {
//       try {
//         const saved = localStorage.getItem(`${STORAGE_KEY}_items`);
//         if (saved) return JSON.parse(saved);
//       } catch (e) {
//         console.error(e);
//       }
//     }
//     return createSeedContentItems();
//   });

//   const [activeContentId, setActiveContentId] = useState<string>('content-claims-flyer');
//   const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
//     if (typeof window !== 'undefined') {
//       try {
//         const saved = localStorage.getItem(`${STORAGE_KEY}_audit`);
//         if (saved) return JSON.parse(saved);
//       } catch (e) {
//         console.error(e);
//       }
//     }
//     return SEED_AUDIT_LOG;
//   });

//   const [comments, setComments] = useState<AnchoredComment[]>([
//     {
//       id: 'comment-1',
//       contentItemId: 'content-claims-flyer',
//       versionNumber: 1,
//       author: SEED_USERS[1], // Marcus Aurelius
//       text: 'Please review the outdated 2023 Thermal Modulation Award claim before submitting for Stage 1 editorial approval.',
//       createdAt: '2026-10-22T10:00:00Z',
//       resolved: false,
//       span: { start: 21, end: 23, text: '#1' },
//     },
//   ]);

//   const [inspectingCitation, setInspectingCitation] = useState<Citation | null>(null);
//   const [selectedFindingId, setSelectedFindingId] = useState<string | null>(null);

//   // Settings: External Processing defaults to OFF as required
//   const [externalProcessing, setExternalProcessing] = useState<boolean>(false);
//   const [geminiModel, setGeminiModel] = useState<string>('gemini-3.8-flash');

//   // Persistence
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       try {
//         localStorage.setItem(`${STORAGE_KEY}_items`, JSON.stringify(contentItems));
//       } catch (e) {
//         console.error(e);
//       }
//     }
//   }, [contentItems]);

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       try {
//         localStorage.setItem(`${STORAGE_KEY}_audit`, JSON.stringify(auditLogs));
//       } catch (e) {
//         console.error(e);
//       }
//     }
//   }, [auditLogs]);

//   // Active item & version
//   const activeContentItem =
//     contentItems.find((item) => item.id === activeContentId) || contentItems[0] || null;

//   const activeVersion = activeContentItem
//     ? activeContentItem.versions.find((v) => v.id === activeContentItem.activeVersionId) ||
//       activeContentItem.versions[activeContentItem.versions.length - 1]
//     : null;

//   // Append to audit log with SHA-256 hash chaining
//   const recordAudit = async (
//     action: AuditLogEntry['action'],
//     targetType: AuditLogEntry['targetType'],
//     targetId: string,
//     details: string
//   ) => {
//     const prev = auditLogs[auditLogs.length - 1];
//     const previousHash = prev ? prev.hash : '0000000000000000';
//     const timestamp = new Date().toISOString();
//     const rawPayload = `${timestamp}|${currentUser.id}|${action}|${targetId}|${previousHash}|${details}`;
//     const hash = await sha256(rawPayload);

//     const newLog: AuditLogEntry = {
//       id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
//       timestamp,
//       actor: {
//         id: currentUser.id,
//         name: currentUser.name,
//         email: currentUser.email,
//         role: currentUser.role,
//       },
//       action,
//       targetType,
//       targetId,
//       details,
//       previousHash,
//       hash,
//     };

//     setAuditLogs((prevLogs) => [...prevLogs, newLog]);
//   };

//   // Re-run detection engine on content item
//   const reanalyzeContent = (id: string) => {
//     setContentItems((items) =>
//       items.map((item) => {
//         if (item.id !== id) return item;

//         const currentV =
//           item.versions.find((v) => v.id === item.activeVersionId) ||
//           item.versions[item.versions.length - 1];

//         const analysis = runDetectionEngine(
//           currentV.rawContent,
//           {
//             contentItemId: item.id,
//             versionId: currentV.id,
//             channel: item.channel,
//             format: item.format,
//             mediaUrl: item.mediaUrl,
//           },
//           brandKit
//         );

//         const updatedVersion: ContentVersion = {
//           ...currentV,
//           findings: analysis.findings,
//           readinessScore: analysis.readinessScore,
//           blockersCount: analysis.blockersCount,
//           totalFindingsCount: analysis.totalFindingsCount,
//         };

//         return {
//           ...item,
//           updatedAt: new Date().toISOString(),
//           versions: item.versions.map((v) => (v.id === currentV.id ? updatedVersion : v)),
//         };
//       })
//     );

//     recordAudit('ANALYSIS_RUN', 'CONTENT', id, 'Re-ran deterministic detection engine across 7 categories');
//   };

//   // Update raw text of active version & re-analyze
//   const updateContentText = (id: string, text: string) => {
//     setContentItems((items) =>
//       items.map((item) => {
//         if (item.id !== id) return item;

//         const currentV =
//           item.versions.find((v) => v.id === item.activeVersionId) ||
//           item.versions[item.versions.length - 1];

//         const analysis = runDetectionEngine(
//           text,
//           {
//             contentItemId: item.id,
//             versionId: currentV.id,
//             channel: item.channel,
//             format: item.format,
//             mediaUrl: item.mediaUrl,
//           },
//           brandKit
//         );

//         const updatedVersion: ContentVersion = {
//           ...currentV,
//           rawContent: text,
//           findings: analysis.findings,
//           readinessScore: analysis.readinessScore,
//           blockersCount: analysis.blockersCount,
//           totalFindingsCount: analysis.totalFindingsCount,
//         };

//         return {
//           ...item,
//           updatedAt: new Date().toISOString(),
//           versions: item.versions.map((v) => (v.id === currentV.id ? updatedVersion : v)),
//         };
//       })
//     );
//   };

//   // Create a new version
//   const createNewVersion = (id: string, newText: string, summary?: string) => {
//     setContentItems((items) =>
//       items.map((item) => {
//         if (item.id !== id) return item;

//         const newVersionNumber = item.currentVersion + 1;
//         const newVersionId = `${item.id}-v${newVersionNumber}`;

//         const analysis = runDetectionEngine(
//           newText,
//           {
//             contentItemId: item.id,
//             versionId: newVersionId,
//             channel: item.channel,
//             format: item.format,
//             mediaUrl: item.mediaUrl,
//           },
//           brandKit
//         );

//         const newVersion: ContentVersion = {
//           id: newVersionId,
//           contentItemId: item.id,
//           versionNumber: newVersionNumber,
//           rawContent: newText,
//           mediaUrl: item.mediaUrl,
//           readinessScore: analysis.readinessScore,
//           blockersCount: analysis.blockersCount,
//           totalFindingsCount: analysis.totalFindingsCount,
//           findings: analysis.findings,
//           changeSummary: summary || `Version ${newVersionNumber} revision`,
//           createdAt: new Date().toISOString(),
//           authorId: currentUser.id,
//         };

//         return {
//           ...item,
//           currentVersion: newVersionNumber,
//           activeVersionId: newVersionId,
//           updatedAt: new Date().toISOString(),
//           versions: [...item.versions, newVersion],
//         };
//       })
//     );

//     recordAudit('VERSION_CREATED', 'CONTENT', id, `Created version #${activeContentItem?.currentVersion ? activeContentItem.currentVersion + 1 : 2}`);
//   };

//   // Human Authority: Accept a suggested fix
//   const acceptFindingFix = (findingId: string) => {
//     if (!activeContentItem || !activeVersion) return;

//     const finding = activeVersion.findings.find((f) => f.id === findingId);
//     if (!finding) return;

//     const updatedText = applySuggestedFix(activeVersion.rawContent, finding);

//     // Apply fix and reanalyze
//     setContentItems((items) =>
//       items.map((item) => {
//         if (item.id !== activeContentItem.id) return item;

//         const analysis = runDetectionEngine(
//           updatedText,
//           {
//             contentItemId: item.id,
//             versionId: activeVersion.id,
//             channel: item.channel,
//             format: item.format,
//             mediaUrl: item.mediaUrl,
//           },
//           brandKit
//         );

//         // Mark this finding as accepted
//         const markedFindings = analysis.findings.map((f) =>
//           f.id === findingId
//             ? { ...f, status: 'ACCEPTED' as const, reviewedBy: currentUser.id, reviewedAt: new Date().toISOString() }
//             : f
//         );

//         const updatedVersion: ContentVersion = {
//           ...activeVersion,
//           rawContent: updatedText,
//           findings: markedFindings,
//           readinessScore: analysis.readinessScore,
//           blockersCount: analysis.blockersCount,
//           totalFindingsCount: analysis.totalFindingsCount,
//         };

//         return {
//           ...item,
//           updatedAt: new Date().toISOString(),
//           versions: item.versions.map((v) => (v.id === activeVersion.id ? updatedVersion : v)),
//         };
//       })
//     );

//     recordAudit(
//       'SUGGESTION_ACCEPTED',
//       'FINDING',
//       findingId,
//       `Accepted fix "${finding.suggestedFix.text}" for rule ${finding.ruleCode}`
//     );
//   };

//   // Human Authority: Edit a suggested fix before applying
//   const editFindingFix = (findingId: string, customReplacement: string) => {
//     if (!activeContentItem || !activeVersion) return;

//     const finding = activeVersion.findings.find((f) => f.id === findingId);
//     if (!finding) return;

//     const updatedText = applySuggestedFix(activeVersion.rawContent, finding, customReplacement);

//     setContentItems((items) =>
//       items.map((item) => {
//         if (item.id !== activeContentItem.id) return item;

//         const analysis = runDetectionEngine(
//           updatedText,
//           {
//             contentItemId: item.id,
//             versionId: activeVersion.id,
//             channel: item.channel,
//             format: item.format,
//             mediaUrl: item.mediaUrl,
//           },
//           brandKit
//         );

//         const markedFindings = analysis.findings.map((f) =>
//           f.id === findingId
//             ? {
//                 ...f,
//                 status: 'EDITED' as const,
//                 editedFix: customReplacement,
//                 reviewedBy: currentUser.id,
//                 reviewedAt: new Date().toISOString(),
//               }
//             : f
//         );

//         const updatedVersion: ContentVersion = {
//           ...activeVersion,
//           rawContent: updatedText,
//           findings: markedFindings,
//           readinessScore: analysis.readinessScore,
//           blockersCount: analysis.blockersCount,
//           totalFindingsCount: analysis.totalFindingsCount,
//         };

//         return {
//           ...item,
//           updatedAt: new Date().toISOString(),
//           versions: item.versions.map((v) => (v.id === activeVersion.id ? updatedVersion : v)),
//         };
//       })
//     );

//     recordAudit(
//       'SUGGESTION_EDITED',
//       'FINDING',
//       findingId,
//       `Edited and applied custom fix "${customReplacement}" for rule ${finding.ruleCode}`
//     );
//   };

//   // Human Authority: Reject a suggested fix (feeds Ambiguity Radar!)
//   const rejectFindingFix = (findingId: string, reason?: string) => {
//     if (!activeContentItem || !activeVersion) return;

//     setContentItems((items) =>
//       items.map((item) => {
//         if (item.id !== activeContentItem.id) return item;

//         const updatedFindings = activeVersion.findings.map((f) => {
//           if (f.id === findingId) {
//             return {
//               ...f,
//               status: 'REJECTED' as const,
//               rejectionReason: reason || 'Author deemed guideline ambiguous or non-applicable',
//               reviewedBy: currentUser.id,
//               reviewedAt: new Date().toISOString(),
//             };
//           }
//           return f;
//         });

//         const updatedVersion: ContentVersion = {
//           ...activeVersion,
//           findings: updatedFindings,
//         };

//         return {
//           ...item,
//           versions: item.versions.map((v) => (v.id === activeVersion.id ? updatedVersion : v)),
//         };
//       })
//     );

//     const f = activeVersion.findings.find((x) => x.id === findingId);
//     recordAudit(
//       'SUGGESTION_REJECTED',
//       'FINDING',
//       findingId,
//       `Rejected fix for ${f?.ruleCode || 'rule'}. Reason: ${reason || 'Ambiguous'}`
//     );
//   };

//   // Workflow: Submit for Review
//   const submitForReview = (id: string): { success: boolean; error?: string } => {
//     const item = contentItems.find((i) => i.id === id);
//     if (!item) return { success: false, error: 'Content item not found.' };

//     const version = item.versions.find((v) => v.id === item.activeVersionId) || item.versions[item.versions.length - 1];
//     if (version.blockersCount > 0) {
//       return {
//         success: false,
//         error: `Submission blocked: ${version.blockersCount} critical BLOCKER findings must be resolved before requesting review.`,
//       };
//     }

//     setContentItems((items) =>
//       items.map((i) =>
//         i.id === id
//           ? {
//               ...i,
//               status: 'SUBMITTED' as ContentStatus,
//               submittedAt: new Date().toISOString(),
//               updatedAt: new Date().toISOString(),
//             }
//           : i
//       )
//     );

//     recordAudit('STATUS_CHANGED', 'CONTENT', id, 'Status changed: DRAFT -> SUBMITTED');
//     return { success: true };
//   };

//   // Workflow: Approve (CRITICAL RBAC: Creators cannot self-approve!)
//   const approveSubmission = (
//     id: string,
//     stage: 'STAGE_1' | 'FINAL'
//   ): { success: boolean; error?: string } => {
//     const item = contentItems.find((i) => i.id === id);
//     if (!item) return { success: false, error: 'Item not found.' };

//     // RBAC Rule: Creators cannot self-approve!
//     if (currentUser.id === item.author.id) {
//       return {
//         success: false,
//         error: 'RBAC Enforcement: Creators cannot self-approve their own submissions. A separate Reviewer or Brand Admin must approve.',
//       };
//     }

//     if (currentUser.role === 'CREATOR' || currentUser.role === 'VIEWER') {
//       return {
//         success: false,
//         error: `Role ${currentUser.role} does not possess review authority. Only REVIEWER or BRAND_ADMIN can approve.`,
//       };
//     }

//     const nextStatus: ContentStatus = stage === 'STAGE_1' ? 'IN_REVIEW' : 'APPROVED';

//     setContentItems((items) =>
//       items.map((i) =>
//         i.id === id
//           ? {
//               ...i,
//               status: nextStatus,
//               approvedAt: stage === 'FINAL' ? new Date().toISOString() : undefined,
//               reviewerId: currentUser.id,
//               updatedAt: new Date().toISOString(),
//             }
//           : i
//       )
//     );

//     recordAudit(
//       'STATUS_CHANGED',
//       'CONTENT',
//       id,
//       `Submission approved by ${currentUser.name} (${currentUser.role}) -> ${nextStatus}`
//     );
//     return { success: true };
//   };

//   // Workflow: Request Changes
//   const requestChangesSubmission = (
//     id: string,
//     feedback: string
//   ): { success: boolean; error?: string } => {
//     if (currentUser.role === 'CREATOR' || currentUser.role === 'VIEWER') {
//       return {
//         success: false,
//         error: 'Only REVIEWER or BRAND_ADMIN personas can request editorial changes.',
//       };
//     }

//     setContentItems((items) =>
//       items.map((i) =>
//         i.id === id
//           ? {
//               ...i,
//               status: 'CHANGES_REQUESTED' as ContentStatus,
//               reviewNotes: feedback,
//               updatedAt: new Date().toISOString(),
//             }
//           : i
//       )
//     );

//     recordAudit(
//       'STATUS_CHANGED',
//       'CONTENT',
//       id,
//       `Changes requested by ${currentUser.name}: "${feedback}"`
//     );
//     return { success: true };
//   };

//   // Workflow: Publish Content
//   const publishContent = (id: string): { success: boolean; error?: string } => {
//     const item = contentItems.find((i) => i.id === id);
//     if (!item) return { success: false, error: 'Item not found.' };

//     if (item.status !== 'APPROVED') {
//       return {
//         success: false,
//         error: 'Content must achieve full human approval before publishing.',
//       };
//     }

//     setContentItems((items) =>
//       items.map((i) =>
//         i.id === id
//           ? {
//               ...i,
//               status: 'PUBLISHED' as ContentStatus,
//               publishedAt: new Date().toISOString(),
//               updatedAt: new Date().toISOString(),
//             }
//           : i
//       )
//     );

//     recordAudit('STATUS_CHANGED', 'CONTENT', id, `Content published live to ${item.channel} channel`);
//     return { success: true };
//   };

//   // Create new content item
//   const createNewContentItem = (newItem: {
//     title: string;
//     channel: ContentChannel;
//     format: ContentFormat;
//     rawContent: string;
//     mediaUrl?: string;
//   }): ContentItem => {
//     const id = `content-${Date.now()}`;
//     const versionId = `${id}-v1`;

//     const analysis = runDetectionEngine(
//       newItem.rawContent,
//       {
//         contentItemId: id,
//         versionId,
//         channel: newItem.channel,
//         format: newItem.format,
//         mediaUrl: newItem.mediaUrl,
//       },
//       brandKit
//     );

//     const version: ContentVersion = {
//       id: versionId,
//       contentItemId: id,
//       versionNumber: 1,
//       rawContent: newItem.rawContent,
//       mediaUrl: newItem.mediaUrl,
//       readinessScore: analysis.readinessScore,
//       blockersCount: analysis.blockersCount,
//       totalFindingsCount: analysis.totalFindingsCount,
//       findings: analysis.findings,
//       changeSummary: 'Initial document draft',
//       createdAt: new Date().toISOString(),
//       authorId: currentUser.id,
//     };

//     const item: ContentItem = {
//       id,
//       title: newItem.title,
//       channel: newItem.channel,
//       format: newItem.format,
//       status: 'DRAFT',
//       author: currentUser,
//       activeVersionId: versionId,
//       currentVersion: 1,
//       versions: [version],
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//       mediaUrl: newItem.mediaUrl,
//     };

//     setContentItems((prev) => [item, ...prev]);
//     setActiveContentId(id);
//     setActiveTab('workspace');

//     recordAudit('CONTENT_CREATED', 'CONTENT', id, `Created new ${newItem.format} content in ${newItem.channel}`);
//     return item;
//   };

//   // Brand Kit modifications
//   const updateGuideline = (g: Guideline) => {
//     setBrandKit((prev) => ({
//       ...prev,
//       guidelines: prev.guidelines.map((x) => (x.id === g.id ? g : x)),
//     }));
//     recordAudit('GUIDELINE_UPDATED', 'GUIDELINE', g.id, `Updated guideline ${g.title}`);
//   };

//   const addGuideline = (g: Guideline) => {
//     setBrandKit((prev) => ({
//       ...prev,
//       guidelines: [...prev.guidelines, g],
//     }));
//     recordAudit('GUIDELINE_UPDATED', 'GUIDELINE', g.id, `Created guideline ${g.title}`);
//   };

//   const updateTerm = (t: TerminologyTerm) => {
//     setBrandKit((prev) => ({
//       ...prev,
//       terms: prev.terms.map((x) => (x.id === t.id ? t : x)),
//     }));
//     recordAudit('SETTINGS_UPDATED', 'SYSTEM', t.id, `Updated term rule ${t.term} -> ${t.preferred}`);
//   };

//   const addTerm = (t: TerminologyTerm) => {
//     setBrandKit((prev) => ({
//       ...prev,
//       terms: [...prev.terms, t],
//     }));
//     recordAudit('SETTINGS_UPDATED', 'SYSTEM', t.id, `Added term rule ${t.term} -> ${t.preferred}`);
//   };

//   const updateSource = (s: ApprovedSource) => {
//     setBrandKit((prev) => ({
//       ...prev,
//       approvedSources: prev.approvedSources.map((x) => (x.id === s.id ? s : x)),
//     }));
//     recordAudit('SOURCE_UPDATED', 'SOURCE', s.id, `Updated approved source ${s.title}`);
//   };

//   const addSource = (s: ApprovedSource) => {
//     setBrandKit((prev) => ({
//       ...prev,
//       approvedSources: [...prev.approvedSources, s],
//     }));
//     recordAudit('SOURCE_UPDATED', 'SOURCE', s.id, `Added approved source ${s.title}`);
//   };

//   const addAsset = (a: ApprovedAsset) => {
//     setBrandKit((prev) => ({
//       ...prev,
//       approvedAssets: [...prev.approvedAssets, a],
//     }));
//     recordAudit('SETTINGS_UPDATED', 'SYSTEM', a.id, `Added approved asset ${a.name}`);
//   };

//   const availableBrands = Object.keys(AVAILABLE_BRANDS);

//   const switchBrand = (name: string) => {
//     if (AVAILABLE_BRANDS[name]) {
//       setBrandKit(AVAILABLE_BRANDS[name]);
//       recordAudit('SETTINGS_UPDATED', 'SYSTEM', name, `Switched active brand workspace to ${name}`);
//     } else {
//       setBrandKit((prev) => ({
//         ...prev,
//         brandName: name,
//       }));
//       recordAudit('SETTINGS_UPDATED', 'SYSTEM', name, `Switched brand name to ${name}`);
//     }
//   };

//   const updateBrandInfo = (name: string, tagline?: string) => {
//     setBrandKit((prev) => ({
//       ...prev,
//       brandName: name.trim() || prev.brandName,
//       brandTagline: tagline !== undefined ? tagline : prev.brandTagline,
//     }));
//     recordAudit('SETTINGS_UPDATED', 'SYSTEM', name, `Updated brand identity to ${name}`);
//   };

//   const updateToneProfile = (tp: ToneProfile) => {
//     setBrandKit((prev) => ({
//       ...prev,
//       toneProfile: tp,
//     }));
//     recordAudit('SETTINGS_UPDATED', 'SYSTEM', 'tone-profile', 'Updated brand tone profile benchmarks');
//   };

//   // Anchored Comments
//   const addComment = (contentItemId: string, text: string, span?: any) => {
//     const newComment: AnchoredComment = {
//       id: `comm-${Date.now()}`,
//       contentItemId,
//       versionNumber: activeVersion?.versionNumber || 1,
//       author: currentUser,
//       text,
//       span,
//       createdAt: new Date().toISOString(),
//       resolved: false,
//     };
//     setComments((prev) => [...prev, newComment]);
//     recordAudit('COMMENT_ADDED', 'CONTENT', contentItemId, `Added anchored comment: "${text.substring(0, 40)}..."`);
//   };

//   const resolveComment = (commentId: string) => {
//     setComments((prev) =>
//       prev.map((c) => (c.id === commentId ? { ...c, resolved: true } : c))
//     );
//   };

//   // Verify cryptographic integrity of append-only audit log
//   const verifyAuditIntegrity = (): boolean => {
//     for (let i = 1; i < auditLogs.length; i++) {
//       if (auditLogs[i].previousHash !== auditLogs[i - 1].hash) {
//         return false;
//       }
//     }
//     return true;
//   };

//   const resetToDefaultSeed = () => {
//     const items = createSeedContentItems();
//     setContentItems(items);
//     setBrandKit(SEED_BRAND_KIT);
//     setAuditLogs(SEED_AUDIT_LOG);
//     setActiveContentId('content-claims-flyer');
//     if (typeof window !== 'undefined') {
//       localStorage.removeItem(`${STORAGE_KEY}_items`);
//       localStorage.removeItem(`${STORAGE_KEY}_audit`);
//     }
//   };

//   return (
//     <BrandLensContext.Provider
//       value={{
//         activeTab,
//         setActiveTab,
//         currentUser,
//         setCurrentUser,
//         allUsers: SEED_USERS,
//         brandKit,
//         availableBrands,
//         switchBrand,
//         updateBrandInfo,
//         updateGuideline,
//         addGuideline,
//         updateTerm,
//         addTerm,
//         updateSource,
//         addSource,
//         addAsset,
//         updateToneProfile,
//         contentItems,
//         activeContentItem,
//         activeVersion,
//         setActiveContentId,
//         updateContentText,
//         reanalyzeContent,
//         createNewVersion,
//         acceptFindingFix,
//         editFindingFix,
//         rejectFindingFix,
//         submitForReview,
//         approveSubmission,
//         requestChangesSubmission,
//         publishContent,
//         createNewContentItem,
//         inspectingCitation,
//         setInspectingCitation,
//         selectedFindingId,
//         setSelectedFindingId,
//         comments,
//         addComment,
//         resolveComment,
//         auditLogs,
//         verifyAuditIntegrity,
//         externalProcessing,
//         setExternalProcessing,
//         geminiModel,
//         setGeminiModel,
//         resetToDefaultSeed,
//       }}
//     >
//       {children}
//     </BrandLensContext.Provider>
//   );
// };

// export const useBrandLens = (): BrandLensContextType => {
//   const context = useContext(BrandLensContext);
//   if (!context) {
//     throw new Error('useBrandLens must be used within a BrandLensProvider');
//   }
//   return context;
// };



import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AnchoredComment,
  AuditLogEntry,
  BrandKit,
  Citation,
  ContentChannel,
  ContentFormat,
  ContentItem,
  ContentStatus,
  ContentVersion,
  Finding,
  Guideline,
  Role,
  TerminologyTerm,
  ApprovedSource,
  ApprovedAsset,
  ToneProfile,
  User,
} from './types';
import {
  AVAILABLE_BRANDS,
  SEED_AUDIT_LOG,
  SEED_BRAND_KIT,
  SEED_USERS,
  createSeedContentItems,
} from './seedData';
import { applySuggestedFix, runDetectionEngine, sha256 } from './engine';

export type ScreenTab =
  | 'dashboard'
  | 'brand-kit'
  | 'workspace'
  | 'inbox'
  | 'insights'
  | 'settings'
  | 'login';

interface BrandLensContextType {
  // Navigation & User
  activeTab: ScreenTab;
  setActiveTab: (tab: ScreenTab) => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  allUsers: User[];

  // Brand Kit
  brandKit: BrandKit;
  availableBrands: string[];
  switchBrand: (brandName: string) => void;
  updateBrandInfo: (name: string, tagline?: string) => void;
  updateGuideline: (guideline: Guideline) => void;
  addGuideline: (guideline: Guideline) => void;
  updateTerm: (term: TerminologyTerm) => void;
  addTerm: (term: TerminologyTerm) => void;
  updateSource: (source: ApprovedSource) => void;
  addSource: (source: ApprovedSource) => void;
  addAsset: (asset: ApprovedAsset) => void;
  updateToneProfile: (profile: ToneProfile) => void;

  // Content Items & Review Workspace
  contentItems: ContentItem[];
  activeContentItem: ContentItem | null;
  activeVersion: ContentVersion | null;
  setActiveContentId: (id: string) => void;
  updateContentText: (id: string, text: string) => void;
  reanalyzeContent: (id: string) => void;
  createNewVersion: (id: string, newText: string, summary?: string) => void;

  // Decision Handling (Human Authority: Accept, Edit, Reject)
  acceptFindingFix: (findingId: string) => void;
  editFindingFix: (findingId: string, customReplacement: string) => void;
  rejectFindingFix: (findingId: string, reason?: string) => void;

  // Workflow & Approval
  submitForReview: (id: string) => { success: boolean; error?: string };
  approveSubmission: (id: string, stage: 'STAGE_1' | 'FINAL') => { success: boolean; error?: string };
  requestChangesSubmission: (id: string, feedback: string) => { success: boolean; error?: string };
  publishContent: (id: string) => { success: boolean; error?: string };
  createNewContentItem: (item: {
    title: string;
    channel: ContentChannel;
    format: ContentFormat;
    rawContent: string;
    mediaUrl?: string;
  }) => ContentItem;

  // Citations & Inspection Drawer
  inspectingCitation: Citation | null;
  setInspectingCitation: (citation: Citation | null) => void;
  selectedFindingId: string | null;
  setSelectedFindingId: (id: string | null) => void;

  // Anchored Comments
  comments: AnchoredComment[];
  addComment: (contentItemId: string, text: string, span?: any) => void;
  resolveComment: (commentId: string) => void;

  // Audit Log
  auditLogs: AuditLogEntry[];
  verifyAuditIntegrity: () => boolean;

  // Settings & Trust
  externalProcessing: boolean;
  setExternalProcessing: (enabled: boolean) => void;
  geminiModel: string;
  setGeminiModel: (model: string) => void;

  // Reset
  resetToDefaultSeed: () => void;
}

const BrandLensContext = createContext<BrandLensContextType | undefined>(undefined);

const STORAGE_KEY = 'brandlens_state_v1';

export const BrandLensProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ScreenTab>('dashboard');
  const [currentUser, setCurrentUser] = useState<User>(SEED_USERS[0]); // Ada Lovelace (CREATOR)
  const [brandKit, setBrandKit] = useState<BrandKit>(SEED_BRAND_KIT);
  const [contentItems, setContentItems] = useState<ContentItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`${STORAGE_KEY}_items`);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return createSeedContentItems();
  });

  const [activeContentId, setActiveContentId] = useState<string>('content-claims-flyer');
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`${STORAGE_KEY}_audit`);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return SEED_AUDIT_LOG;
  });

  const [comments, setComments] = useState<AnchoredComment[]>([
    {
      id: 'comment-1',
      contentItemId: 'content-claims-flyer',
      versionNumber: 1,
      author: SEED_USERS[1], // Marcus Aurelius
      text: 'Please review the outdated 2023 Thermal Modulation Award claim before submitting for Stage 1 editorial approval.',
      createdAt: '2026-10-22T10:00:00Z',
      resolved: false,
      span: { start: 21, end: 23, text: '#1' },
    },
  ]);

  const [inspectingCitation, setInspectingCitation] = useState<Citation | null>(null);
  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(null);

  // Settings: External Processing defaults to OFF as required
  const [externalProcessing, setExternalProcessing] = useState<boolean>(false);
  const [geminiModel, setGeminiModel] = useState<string>('gemini-3.8-flash');

  // Persistence
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`${STORAGE_KEY}_items`, JSON.stringify(contentItems));
      } catch (e) {
        console.error(e);
      }
    }
  }, [contentItems]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`${STORAGE_KEY}_audit`, JSON.stringify(auditLogs));
      } catch (e) {
        console.error(e);
      }
    }
  }, [auditLogs]);

  // Active item & version
  const activeContentItem =
    contentItems.find((item) => item.id === activeContentId) || contentItems[0] || null;

  const activeVersion = activeContentItem
    ? activeContentItem.versions.find((v) => v.id === activeContentItem.activeVersionId) ||
      activeContentItem.versions[activeContentItem.versions.length - 1]
    : null;

  // Append to audit log with SHA-256 hash chaining
  const recordAudit = async (
    action: AuditLogEntry['action'],
    targetType: AuditLogEntry['targetType'],
    targetId: string,
    details: string
  ) => {
    const prev = auditLogs[auditLogs.length - 1];
    const previousHash = prev ? prev.hash : '0000000000000000';
    const timestamp = new Date().toISOString();
    const rawPayload = `${timestamp}|${currentUser.id}|${action}|${targetId}|${previousHash}|${details}`;
    const hash = await sha256(rawPayload);

    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp,
      actor: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
      },
      action,
      targetType,
      targetId,
      details,
      previousHash,
      hash,
    };

    setAuditLogs((prevLogs) => [...prevLogs, newLog]);
  };

  // Re-run detection engine on content item
  const reanalyzeContent = (id: string) => {
    setContentItems((items) =>
      items.map((item) => {
        if (item.id !== id) return item;

        const currentV =
          item.versions.find((v) => v.id === item.activeVersionId) ||
          item.versions[item.versions.length - 1];

        const analysis = runDetectionEngine(
          currentV.rawContent,
          {
            contentItemId: item.id,
            versionId: currentV.id,
            channel: item.channel,
            format: item.format,
            mediaUrl: item.mediaUrl,
          },
          brandKit
        );

        const updatedVersion: ContentVersion = {
          ...currentV,
          findings: analysis.findings,
          readinessScore: analysis.readinessScore,
          blockersCount: analysis.blockersCount,
          totalFindingsCount: analysis.totalFindingsCount,
        };

        return {
          ...item,
          updatedAt: new Date().toISOString(),
          versions: item.versions.map((v) => (v.id === currentV.id ? updatedVersion : v)),
        };
      })
    );

    recordAudit('ANALYSIS_RUN', 'CONTENT', id, 'Re-ran deterministic detection engine across 7 categories');
  };

  // Update raw text of active version & re-analyze
  const updateContentText = (id: string, text: string) => {
    setContentItems((items) =>
      items.map((item) => {
        if (item.id !== id) return item;

        const currentV =
          item.versions.find((v) => v.id === item.activeVersionId) ||
          item.versions[item.versions.length - 1];

        const analysis = runDetectionEngine(
          text,
          {
            contentItemId: item.id,
            versionId: currentV.id,
            channel: item.channel,
            format: item.format,
            mediaUrl: item.mediaUrl,
          },
          brandKit
        );

        const updatedVersion: ContentVersion = {
          ...currentV,
          rawContent: text,
          findings: analysis.findings,
          readinessScore: analysis.readinessScore,
          blockersCount: analysis.blockersCount,
          totalFindingsCount: analysis.totalFindingsCount,
        };

        return {
          ...item,
          updatedAt: new Date().toISOString(),
          versions: item.versions.map((v) => (v.id === currentV.id ? updatedVersion : v)),
        };
      })
    );
  };

  // Create a new version
  const createNewVersion = (id: string, newText: string, summary?: string) => {
    setContentItems((items) =>
      items.map((item) => {
        if (item.id !== id) return item;

        const newVersionNumber = item.currentVersion + 1;
        const newVersionId = `${item.id}-v${newVersionNumber}`;

        const analysis = runDetectionEngine(
          newText,
          {
            contentItemId: item.id,
            versionId: newVersionId,
            channel: item.channel,
            format: item.format,
            mediaUrl: item.mediaUrl,
          },
          brandKit
        );

        const newVersion: ContentVersion = {
          id: newVersionId,
          contentItemId: item.id,
          versionNumber: newVersionNumber,
          rawContent: newText,
          mediaUrl: item.mediaUrl,
          readinessScore: analysis.readinessScore,
          blockersCount: analysis.blockersCount,
          totalFindingsCount: analysis.totalFindingsCount,
          findings: analysis.findings,
          changeSummary: summary || `Version ${newVersionNumber} revision`,
          createdAt: new Date().toISOString(),
          authorId: currentUser.id,
        };

        return {
          ...item,
          currentVersion: newVersionNumber,
          activeVersionId: newVersionId,
          updatedAt: new Date().toISOString(),
          versions: [...item.versions, newVersion],
        };
      })
    );

    recordAudit('VERSION_CREATED', 'CONTENT', id, `Created version #${activeContentItem?.currentVersion ? activeContentItem.currentVersion + 1 : 2}`);
  };

  // Human Authority: Accept a suggested fix
  const acceptFindingFix = (findingId: string) => {
    if (!activeContentItem || !activeVersion) return;

    const finding = activeVersion.findings.find((f) => f.id === findingId);
    if (!finding) return;

    const updatedText = applySuggestedFix(activeVersion.rawContent, finding);

    // Apply fix and reanalyze
    setContentItems((items) =>
      items.map((item) => {
        if (item.id !== activeContentItem.id) return item;

        const analysis = runDetectionEngine(
          updatedText,
          {
            contentItemId: item.id,
            versionId: activeVersion.id,
            channel: item.channel,
            format: item.format,
            mediaUrl: item.mediaUrl,
          },
          brandKit
        );

        // Mark this finding as accepted
        const markedFindings = analysis.findings.map((f) =>
          f.id === findingId
            ? { ...f, status: 'ACCEPTED' as const, reviewedBy: currentUser.id, reviewedAt: new Date().toISOString() }
            : f
        );

        const updatedVersion: ContentVersion = {
          ...activeVersion,
          rawContent: updatedText,
          findings: markedFindings,
          readinessScore: analysis.readinessScore,
          blockersCount: analysis.blockersCount,
          totalFindingsCount: analysis.totalFindingsCount,
        };

        return {
          ...item,
          updatedAt: new Date().toISOString(),
          versions: item.versions.map((v) => (v.id === activeVersion.id ? updatedVersion : v)),
        };
      })
    );

    recordAudit(
      'SUGGESTION_ACCEPTED',
      'FINDING',
      findingId,
      `Accepted fix "${finding.suggestedFix.text}" for rule ${finding.ruleCode}`
    );
  };

  // Human Authority: Edit a suggested fix before applying
  const editFindingFix = (findingId: string, customReplacement: string) => {
    if (!activeContentItem || !activeVersion) return;

    const finding = activeVersion.findings.find((f) => f.id === findingId);
    if (!finding) return;

    const updatedText = applySuggestedFix(activeVersion.rawContent, finding, customReplacement);

    setContentItems((items) =>
      items.map((item) => {
        if (item.id !== activeContentItem.id) return item;

        const analysis = runDetectionEngine(
          updatedText,
          {
            contentItemId: item.id,
            versionId: activeVersion.id,
            channel: item.channel,
            format: item.format,
            mediaUrl: item.mediaUrl,
          },
          brandKit
        );

        const markedFindings = analysis.findings.map((f) =>
          f.id === findingId
            ? {
                ...f,
                status: 'EDITED' as const,
                editedFix: customReplacement,
                reviewedBy: currentUser.id,
                reviewedAt: new Date().toISOString(),
              }
            : f
        );

        const updatedVersion: ContentVersion = {
          ...activeVersion,
          rawContent: updatedText,
          findings: markedFindings,
          readinessScore: analysis.readinessScore,
          blockersCount: analysis.blockersCount,
          totalFindingsCount: analysis.totalFindingsCount,
        };

        return {
          ...item,
          updatedAt: new Date().toISOString(),
          versions: item.versions.map((v) => (v.id === activeVersion.id ? updatedVersion : v)),
        };
      })
    );

    recordAudit(
      'SUGGESTION_EDITED',
      'FINDING',
      findingId,
      `Edited and applied custom fix "${customReplacement}" for rule ${finding.ruleCode}`
    );
  };

  // Human Authority: Reject a suggested fix (feeds Ambiguity Radar!)
  const rejectFindingFix = (findingId: string, reason?: string) => {
    if (!activeContentItem || !activeVersion) return;

    setContentItems((items) =>
      items.map((item) => {
        if (item.id !== activeContentItem.id) return item;

        const updatedFindings = activeVersion.findings.map((f) => {
          if (f.id === findingId) {
            return {
              ...f,
              status: 'REJECTED' as const,
              rejectionReason: reason || 'Author deemed guideline ambiguous or non-applicable',
              reviewedBy: currentUser.id,
              reviewedAt: new Date().toISOString(),
            };
          }
          return f;
        });

        const updatedVersion: ContentVersion = {
          ...activeVersion,
          findings: updatedFindings,
        };

        return {
          ...item,
          versions: item.versions.map((v) => (v.id === activeVersion.id ? updatedVersion : v)),
        };
      })
    );

    const f = activeVersion.findings.find((x) => x.id === findingId);
    recordAudit(
      'SUGGESTION_REJECTED',
      'FINDING',
      findingId,
      `Rejected fix for ${f?.ruleCode || 'rule'}. Reason: ${reason || 'Ambiguous'}`
    );
  };

  // Workflow: Submit for Review
  const submitForReview = (id: string): { success: boolean; error?: string } => {
    const item = contentItems.find((i) => i.id === id);
    if (!item) return { success: false, error: 'Content item not found.' };

    const version = item.versions.find((v) => v.id === item.activeVersionId) || item.versions[item.versions.length - 1];
    if (version.blockersCount > 0) {
      return {
        success: false,
        error: `Submission blocked: ${version.blockersCount} critical BLOCKER findings must be resolved before requesting review.`,
      };
    }

    setContentItems((items) =>
      items.map((i) =>
        i.id === id
          ? {
              ...i,
              status: 'SUBMITTED' as ContentStatus,
              submittedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : i
      )
    );

    recordAudit('STATUS_CHANGED', 'CONTENT', id, 'Status changed: DRAFT -> SUBMITTED');
    return { success: true };
  };

  // Workflow: Approve (CRITICAL RBAC: Creators cannot self-approve!)
  const approveSubmission = (
    id: string,
    stage: 'STAGE_1' | 'FINAL'
  ): { success: boolean; error?: string } => {
    const item = contentItems.find((i) => i.id === id);
    if (!item) return { success: false, error: 'Item not found.' };

    // RBAC Rule: Creators cannot self-approve!
    if (currentUser.id === item.author.id) {
      return {
        success: false,
        error: 'RBAC Enforcement: Creators cannot self-approve their own submissions. A separate Reviewer or Brand Admin must approve.',
      };
    }

    if (currentUser.role === 'CREATOR' || currentUser.role === 'VIEWER') {
      return {
        success: false,
        error: `Role ${currentUser.role} does not possess review authority. Only REVIEWER or BRAND_ADMIN can approve.`,
      };
    }

    const nextStatus: ContentStatus = stage === 'STAGE_1' ? 'IN_REVIEW' : 'APPROVED';

    setContentItems((items) =>
      items.map((i) =>
        i.id === id
          ? {
              ...i,
              status: nextStatus,
              approvedAt: stage === 'FINAL' ? new Date().toISOString() : undefined,
              reviewerId: currentUser.id,
              updatedAt: new Date().toISOString(),
            }
          : i
      )
    );

    recordAudit(
      'STATUS_CHANGED',
      'CONTENT',
      id,
      `Submission approved by ${currentUser.name} (${currentUser.role}) -> ${nextStatus}`
    );
    return { success: true };
  };

  // Workflow: Request Changes
  const requestChangesSubmission = (
    id: string,
    feedback: string
  ): { success: boolean; error?: string } => {
    if (currentUser.role === 'CREATOR' || currentUser.role === 'VIEWER') {
      return {
        success: false,
        error: 'Only REVIEWER or BRAND_ADMIN personas can request editorial changes.',
      };
    }

    setContentItems((items) =>
      items.map((i) =>
        i.id === id
          ? {
              ...i,
              status: 'CHANGES_REQUESTED' as ContentStatus,
              reviewNotes: feedback,
              updatedAt: new Date().toISOString(),
            }
          : i
      )
    );

    recordAudit(
      'STATUS_CHANGED',
      'CONTENT',
      id,
      `Changes requested by ${currentUser.name}: "${feedback}"`
    );
    return { success: true };
  };

  // Workflow: Publish Content
  const publishContent = (id: string): { success: boolean; error?: string } => {
    const item = contentItems.find((i) => i.id === id);
    if (!item) return { success: false, error: 'Item not found.' };

    if (item.status !== 'APPROVED') {
      return {
        success: false,
        error: 'Content must achieve full human approval before publishing.',
      };
    }

    setContentItems((items) =>
      items.map((i) =>
        i.id === id
          ? {
              ...i,
              status: 'PUBLISHED' as ContentStatus,
              publishedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : i
      )
    );

    recordAudit('STATUS_CHANGED', 'CONTENT', id, `Content published live to ${item.channel} channel`);
    return { success: true };
  };

  // Create new content item
  const createNewContentItem = (newItem: {
    title: string;
    channel: ContentChannel;
    format: ContentFormat;
    rawContent: string;
    mediaUrl?: string;
  }): ContentItem => {
    const id = `content-${Date.now()}`;
    const versionId = `${id}-v1`;

    const analysis = runDetectionEngine(
      newItem.rawContent,
      {
        contentItemId: id,
        versionId,
        channel: newItem.channel,
        format: newItem.format,
        mediaUrl: newItem.mediaUrl,
      },
      brandKit
    );

    const version: ContentVersion = {
      id: versionId,
      contentItemId: id,
      versionNumber: 1,
      rawContent: newItem.rawContent,
      mediaUrl: newItem.mediaUrl,
      readinessScore: analysis.readinessScore,
      blockersCount: analysis.blockersCount,
      totalFindingsCount: analysis.totalFindingsCount,
      findings: analysis.findings,
      changeSummary: 'Initial document draft',
      createdAt: new Date().toISOString(),
      authorId: currentUser.id,
    };

    const item: ContentItem = {
      id,
      title: newItem.title,
      channel: newItem.channel,
      format: newItem.format,
      status: 'DRAFT',
      author: currentUser,
      activeVersionId: versionId,
      currentVersion: 1,
      versions: [version],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      mediaUrl: newItem.mediaUrl,
    };

    setContentItems((prev) => [item, ...prev]);
    setActiveContentId(id);
    setActiveTab('workspace');

    recordAudit('CONTENT_CREATED', 'CONTENT', id, `Created new ${newItem.format} content in ${newItem.channel}`);
    return item;
  };

  // Brand Kit modifications
  const updateGuideline = (g: Guideline) => {
    setBrandKit((prev) => ({
      ...prev,
      guidelines: prev.guidelines.map((x) => (x.id === g.id ? g : x)),
    }));
    recordAudit('GUIDELINE_UPDATED', 'GUIDELINE', g.id, `Updated guideline ${g.title}`);
  };

  const addGuideline = (g: Guideline) => {
    setBrandKit((prev) => ({
      ...prev,
      guidelines: [...prev.guidelines, g],
    }));
    recordAudit('GUIDELINE_UPDATED', 'GUIDELINE', g.id, `Created guideline ${g.title}`);
  };

  const updateTerm = (t: TerminologyTerm) => {
    setBrandKit((prev) => ({
      ...prev,
      terms: prev.terms.map((x) => (x.id === t.id ? t : x)),
    }));
    recordAudit('SETTINGS_UPDATED', 'SYSTEM', t.id, `Updated term rule ${t.term} -> ${t.preferred}`);
  };

  const addTerm = (t: TerminologyTerm) => {
    setBrandKit((prev) => ({
      ...prev,
      terms: [...prev.terms, t],
    }));
    recordAudit('SETTINGS_UPDATED', 'SYSTEM', t.id, `Added term rule ${t.term} -> ${t.preferred}`);
  };

  const updateSource = (s: ApprovedSource) => {
    setBrandKit((prev) => ({
      ...prev,
      approvedSources: prev.approvedSources.map((x) => (x.id === s.id ? s : x)),
    }));
    recordAudit('SOURCE_UPDATED', 'SOURCE', s.id, `Updated approved source ${s.title}`);
  };

  const addSource = (s: ApprovedSource) => {
    setBrandKit((prev) => ({
      ...prev,
      approvedSources: [...prev.approvedSources, s],
    }));
    recordAudit('SOURCE_UPDATED', 'SOURCE', s.id, `Added approved source ${s.title}`);
  };

  const addAsset = (a: ApprovedAsset) => {
    setBrandKit((prev) => ({
      ...prev,
      approvedAssets: [...prev.approvedAssets, a],
    }));
    recordAudit('SETTINGS_UPDATED', 'SYSTEM', a.id, `Added approved asset ${a.name}`);
  };

  const availableBrands = Object.keys(AVAILABLE_BRANDS);

  const switchBrand = (name: string) => {
    if (AVAILABLE_BRANDS[name]) {
      setBrandKit(AVAILABLE_BRANDS[name]);
      recordAudit('SETTINGS_UPDATED', 'SYSTEM', name, `Switched active brand workspace to ${name}`);
    } else {
      setBrandKit((prev) => ({
        ...prev,
        brandName: name,
      }));
      recordAudit('SETTINGS_UPDATED', 'SYSTEM', name, `Switched brand name to ${name}`);
    }
  };

  const updateBrandInfo = (name: string, tagline?: string) => {
    setBrandKit((prev) => ({
      ...prev,
      brandName: name.trim() || prev.brandName,
      brandTagline: tagline !== undefined ? tagline : prev.brandTagline,
    }));
    recordAudit('SETTINGS_UPDATED', 'SYSTEM', name, `Updated brand identity to ${name}`);
  };

  const updateToneProfile = (tp: ToneProfile) => {
    setBrandKit((prev) => ({
      ...prev,
      toneProfile: tp,
    }));
    recordAudit('SETTINGS_UPDATED', 'SYSTEM', 'tone-profile', 'Updated brand tone profile benchmarks');
  };

  // Anchored Comments
  const addComment = (contentItemId: string, text: string, span?: any) => {
    const newComment: AnchoredComment = {
      id: `comm-${Date.now()}`,
      contentItemId,
      versionNumber: activeVersion?.versionNumber || 1,
      author: currentUser,
      text,
      span,
      createdAt: new Date().toISOString(),
      resolved: false,
    };
    setComments((prev) => [...prev, newComment]);
    recordAudit('COMMENT_ADDED', 'CONTENT', contentItemId, `Added anchored comment: "${text.substring(0, 40)}..."`);
  };

  const resolveComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, resolved: true } : c))
    );
  };

  // Verify cryptographic integrity of append-only audit log
  const verifyAuditIntegrity = (): boolean => {
    for (let i = 1; i < auditLogs.length; i++) {
      if (auditLogs[i].previousHash !== auditLogs[i - 1].hash) {
        return false;
      }
    }
    return true;
  };

  const resetToDefaultSeed = () => {
    const items = createSeedContentItems();
    setContentItems(items);
    setBrandKit(SEED_BRAND_KIT);
    setAuditLogs(SEED_AUDIT_LOG);
    setActiveContentId('content-claims-flyer');
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`${STORAGE_KEY}_items`);
      localStorage.removeItem(`${STORAGE_KEY}_audit`);
    }
  };

  return (
    <BrandLensContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentUser,
        setCurrentUser,
        allUsers: SEED_USERS,
        brandKit,
        availableBrands,
        switchBrand,
        updateBrandInfo,
        updateGuideline,
        addGuideline,
        updateTerm,
        addTerm,
        updateSource,
        addSource,
        addAsset,
        updateToneProfile,
        contentItems,
        activeContentItem,
        activeVersion,
        setActiveContentId,
        updateContentText,
        reanalyzeContent,
        createNewVersion,
        acceptFindingFix,
        editFindingFix,
        rejectFindingFix,
        submitForReview,
        approveSubmission,
        requestChangesSubmission,
        publishContent,
        createNewContentItem,
        inspectingCitation,
        setInspectingCitation,
        selectedFindingId,
        setSelectedFindingId,
        comments,
        addComment,
        resolveComment,
        auditLogs,
        verifyAuditIntegrity,
        externalProcessing,
        setExternalProcessing,
        geminiModel,
        setGeminiModel,
        resetToDefaultSeed,
      }}
    >
      {children}
    </BrandLensContext.Provider>
  );
};

export const useBrandLens = (): BrandLensContextType => {
  const context = useContext(BrandLensContext);
  if (!context) {
    throw new Error('useBrandLens must be used within a BrandLensProvider');
  }
  return context;
};
