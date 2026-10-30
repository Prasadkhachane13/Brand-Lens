export type Role = 'CREATOR' | 'REVIEWER' | 'BRAND_ADMIN' | 'VIEWER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export type ContentFormat = 'TEXT' | 'MARKDOWN' | 'DOCX' | 'PDF' | 'IMAGE';
export type ContentChannel = 'PRESS' | 'BLOG' | 'INTERNAL' | 'LANDING' | 'SOCIAL' | 'EMAIL' | 'SUPPORT';
export type ContentStatus = 'DRAFT' | 'SUBMITTED' | 'IN_REVIEW' | 'CHANGES_REQUESTED' | 'APPROVED' | 'PUBLISHED';

export type FindingCategory =
  | 'tone'
  | 'terminology'
  | 'messaging'
  | 'claims'
  | 'visual'
  | 'accessibility'
  | 'confidentiality';

export type FindingSeverity = 'BLOCKER' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface TextSpan {
  start: number;
  end: number;
  text: string;
}

export interface Citation {
  id: string; // e.g. "CLAIM-1", "SRC-2023-THERMAL"
  type: 'guideline' | 'approved_source';
  title: string;
  section?: string;
  owner?: string;
  effectiveFrom?: string;
  reviewAfter?: string;
  isExpired?: boolean;
  substantiatedStatementText?: string;
  brandPrinciple?: string;
}

export interface SuggestedFix {
  action: 'REPLACE' | 'INSERT' | 'REMOVE';
  text: string;
  replacementSpan?: TextSpan;
}

export type FindingDecision = 'OPEN' | 'ACCEPTED' | 'REJECTED' | 'EDITED';

export interface Finding {
  id: string;
  contentItemId: string;
  versionId: string;
  category: FindingCategory;
  severity: FindingSeverity;
  ruleCode: string; // e.g. "CLAIM-SUPERLATIVE", "TERM-AVOID", "A11Y-HEADING-SKIP"
  span: TextSpan;
  why: string;
  citation: Citation;
  suggestedFix: SuggestedFix;
  status: FindingDecision;
  weight: number;
  editedFix?: string;
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface ContentVersion {
  id: string;
  contentItemId: string;
  versionNumber: number;
  rawContent: string;
  mediaUrl?: string;
  readinessScore: number;
  blockersCount: number;
  totalFindingsCount: number;
  findings: Finding[];
  changeSummary?: string;
  createdAt: string;
  authorId: string;
}

export interface AnchoredComment {
  id: string;
  contentItemId: string;
  versionNumber: number;
  author: User;
  span?: TextSpan;
  text: string;
  createdAt: string;
  resolved: boolean;
}

export interface ContentItem {
  id: string;
  title: string;
  channel: ContentChannel;
  format: ContentFormat;
  status: ContentStatus;
  author: User;
  activeVersionId: string;
  currentVersion: number;
  versions: ContentVersion[];
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  approvedAt?: string;
  publishedAt?: string;
  reviewerId?: string;
  reviewNotes?: string;
  mediaUrl?: string;
}

export interface Guideline {
  id: string; // e.g. "A11Y-1"
  category: FindingCategory;
  ruleCode: string;
  title: string;
  description: string;
  severity: FindingSeverity;
  examples: {
    compliant: string[];
    violation: string[];
  };
}

export interface TerminologyTerm {
  id: string;
  term: string;
  preferred: string;
  explanation: string;
  category: 'BRAND_NAME' | 'PRODUCT_NAME' | 'SALES_CLAIM' | 'TECHNICAL';
  prohibitedContext?: string;
}

export interface ApprovedSource {
  id: string; // e.g. "SRC-2023-THERMAL"
  title: string;
  factType: 'AWARD' | 'ENERGY_STUDY' | 'MARKET_SHARE' | 'CERTIFICATION' | 'CUSTOMER_COUNT' | 'PRICING';
  owner: string;
  effectiveFrom: string;
  reviewAfter: string;
  isExpired: boolean;
  substantiatedStatementText: string;
  allowedSuperlatives: string[];
  numericMetrics: Record<string, string | number>;
  notes?: string;
}

export interface ApprovedAsset {
  id: string;
  name: string;
  type: 'LOGO' | 'PALETTE' | 'HERO_IMAGE';
  dHash?: string; // 64-bit hex hash for image match
  paletteHex?: string[];
  minClearspace?: string;
  description: string;
  previewUrl: string;
}

export interface ToneProfile {
  targetFormality: number; // 0-100 (e.g. 70 for Northwind)
  maxSentenceLength: number; // e.g. 25 words
  targetReadingGrade: [number, number]; // [8, 11]
  bannedSlang: string[];
  allowExclamationPoints: boolean;
  maxExclamationPointsPerDoc: number;
  activeVoiceTarget: number; // min percentage
}

export interface BrandKit {
  brandName: string;
  brandTagline: string;
  guidelines: Guideline[];
  terms: TerminologyTerm[];
  approvedSources: ApprovedSource[];
  approvedAssets: ApprovedAsset[];
  toneProfile: ToneProfile;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: {
    id: string;
    name: string;
    email: string;
    role: Role;
  };
  action:
    | 'CONTENT_CREATED'
    | 'VERSION_CREATED'
    | 'ANALYSIS_RUN'
    | 'SUGGESTION_ACCEPTED'
    | 'SUGGESTION_REJECTED'
    | 'SUGGESTION_EDITED'
    | 'STATUS_CHANGED'
    | 'COMMENT_ADDED'
    | 'GUIDELINE_UPDATED'
    | 'SOURCE_UPDATED'
    | 'SETTINGS_UPDATED';
  targetType: 'CONTENT' | 'FINDING' | 'GUIDELINE' | 'SOURCE' | 'SYSTEM';
  targetId: string;
  details: string;
  previousHash: string;
  hash: string;
}

export interface AmbiguityRadarItem {
  ruleCode: string;
  guidelineSection: string;
  ruleName: string;
  accepted: number;
  rejected: number;
  rejectionRate: number;
  governanceDiagnostic: 'Guideline may be unclear' | 'Content adherence' | 'Requires review';
}
