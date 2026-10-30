// import {
//   ApprovedAsset,
//   ApprovedSource,
//   AuditLogEntry,
//   BrandKit,
//   ContentItem,
//   Guideline,
//   TerminologyTerm,
//   User,
// } from './types';
// import { runDetectionEngine } from './engine';

// export const SEED_USERS: User[] = [
//   {
//     id: 'ada',
//     name: 'Ada Lovelace',
//     email: 'ada@northwind.test',
//     role: 'CREATOR',
//     avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
//   },
//   {
//     id: 'marcus',
//     name: 'Marcus Aurelius',
//     email: 'marcus@northwind.test',
//     role: 'REVIEWER',
//     avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
//   },
//   {
//     id: 'priya',
//     name: 'Priya Sharma',
//     email: 'priya@northwind.test',
//     role: 'BRAND_ADMIN',
//     avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
//   },
//   {
//     id: 'sam',
//     name: 'Sam Taylor',
//     email: 'sam@northwind.test',
//     role: 'VIEWER',
//     avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
//   },
// ];

// export const SEED_GUIDELINES: Guideline[] = [
//   {
//     id: 'CLAIM-1',
//     category: 'claims',
//     ruleCode: 'CLAIM-SUPERLATIVE',
//     title: 'Superlatives & Unsubstantiated Claims',
//     description:
//       'Absolute superlatives such as "#1", "number one", "guaranteed", "risk-free", or "best-in-class" are strictly prohibited unless linked to an active, validated Approved Source. When unverified, substitute with measured qualifiers such as "leading" or "designed to".',
//     severity: 'BLOCKER',
//     examples: {
//       compliant: ['Our leading thermostat', 'Engineered to reduce heating waste'],
//       violation: ['The #1 best-in-class thermostat', 'Guaranteed lowest energy bills'],
//     },
//   },
//   {
//     id: 'CLAIM-2',
//     category: 'claims',
//     ruleCode: 'CLAIM-NUMERIC',
//     title: 'Numeric and Performance Data Verification',
//     description:
//       'Every numeric percentage, technical specification, and dollar amount quoted in content must be documented verbatim in an active Approved Source. Unverified figures create regulatory advertising liability.',
//     severity: 'HIGH',
//     examples: {
//       compliant: ['Saves up to 23% based on 2024 independent testing'],
//       violation: ['Saves 65% on electricity', 'Trusted by 5,000,000 homeowners'],
//     },
//   },
//   {
//     id: 'TERM-1',
//     category: 'terminology',
//     ruleCode: 'TERM-AVOID',
//     title: 'Approved Terminology & Prohibited Expressions',
//     description:
//       'Refer to our brand as Northwind Home, never abbreviated as Northwind or NW Home. Use smart climate control instead of HVAC gadgetry.',
//     severity: 'HIGH',
//     examples: {
//       compliant: ['Northwind Home EcoController', 'intelligent climate control'],
//       violation: ['NW Home gadget', 'Northwind thermostat app'],
//     },
//   },
//   {
//     id: 'TERM-2',
//     category: 'terminology',
//     ruleCode: 'TERM-ORTHOGRAPHY',
//     title: 'Brand Capitalization & Orthography',
//     description:
//       'Ensure strict capitalization for trademarked product terms such as EcoMode and Northwind Bridge. Never use separated or lowercase spellings.',
//     severity: 'MEDIUM',
//     examples: {
//       compliant: ['EcoMode setting', 'Northwind Bridge hub'],
//       violation: ['Eco Mode', 'ecomode', 'northwind bridge'],
//     },
//   },
//   {
//     id: 'A11Y-1',
//     category: 'accessibility',
//     ruleCode: 'A11Y-ALT-TEXT',
//     title: 'Visual Accessibility and Alternative Descriptions',
//     description:
//       'All imagery must include descriptive, purposeful alt text for assistive screen readers. Ensure all foreground text against background colors satisfies minimum WCAG AA contrast ratio of at least 4.5:1.',
//     severity: 'BLOCKER',
//     examples: {
//       compliant: ['![Northwind Home thermostat mounted on oak wall](...)]'],
//       violation: ['![](/img.png)', '![photo](...)'],
//     },
//   },
//   {
//     id: 'A11Y-2',
//     category: 'accessibility',
//     ruleCode: 'A11Y-MEANINGFUL-LINKS',
//     title: 'Structural Accessibility and Meaningful Links',
//     description:
//       'Maintain hierarchical heading order without skipping levels (e.g. h1 followed directly by h3). Links must provide descriptive context; never use ambiguous phrases like "click here" or "read more".',
//     severity: 'HIGH',
//     examples: {
//       compliant: ['[Read the Energy Star report](...)', 'h1 -> h2 -> h3'],
//       violation: ['[click here](...)', 'h1 -> h3 (skipping h2)'],
//     },
//   },
//   {
//     id: 'TONE-1',
//     category: 'tone',
//     ruleCode: 'TONE-PUNCTUATION',
//     title: 'Editorial Tone & Professional Punctuation',
//     description:
//       'Maintain a calm, measured, architectural tone. Consecutive exclamation marks, excessive caps, and sensationalist phrasing are prohibited.',
//     severity: 'LOW',
//     examples: {
//       compliant: ['Engineered for silent reliability.'],
//       violation: ['Incredible performance you must see right now!!!'],
//     },
//   },
//   {
//     id: 'TONE-2',
//     category: 'tone',
//     ruleCode: 'TONE-SLANG',
//     title: 'Brand Voice, Formality & Vocabulary',
//     description:
//       'Avoid informal internet slang, colloquial hype, or overly casual idioms. Northwind speaks with technical authority and domestic elegance.',
//     severity: 'MEDIUM',
//     examples: {
//       compliant: ['exceptional thermal precision', 'substantial savings'],
//       violation: ['super dope gadget', 'mind-blowing performance', 'gonna save tons'],
//     },
//   },
//   {
//     id: 'VIS-1',
//     category: 'visual',
//     ruleCode: 'VISUAL-LOGO-CLEARSPACE',
//     title: 'Logo Clearspace & Protection Zone',
//     description:
//       'The Northwind Home emblem requires a minimum exclusion zone equal to half the emblem height. Never rotate, recolor, or distort the logo.',
//     severity: 'HIGH',
//     examples: {
//       compliant: ['Centered logo lockup with 24px padding'],
//       violation: ['Stretched logo', 'Logo overlapping busy background photography'],
//     },
//   },
//   {
//     id: 'CONF-1',
//     category: 'confidentiality',
//     ruleCode: 'CONF-API-KEY',
//     title: 'Information Security & Credential Protection',
//     description:
//       'Zero tolerance for production credentials, secret keys (sk_live_, AKIA, ghp_), internal codenames, or employee personal data in external collateral.',
//     severity: 'BLOCKER',
//     examples: {
//       compliant: ['Configure via Northwind Cloud Console credentials.'],
//       violation: ['sk_live_northwind_99214', 'Project Boreas unreleased specs'],
//     },
//   },
// ];

// export const SEED_TERMS: TerminologyTerm[] = [
//   {
//     id: 'term-nw-home',
//     term: 'NW Home',
//     preferred: 'Northwind Home',
//     explanation: 'Avoid term "NW Home". The preferred brand terminology is "Northwind Home".',
//     category: 'BRAND_NAME',
//   },
//   {
//     id: 'term-northwind-alone',
//     term: 'Northwind',
//     preferred: 'Northwind Home',
//     explanation: 'When referring to the consumer brand, use full "Northwind Home".',
//     category: 'BRAND_NAME',
//   },
//   {
//     id: 'term-ecomode',
//     term: 'Eco Mode',
//     preferred: 'EcoMode',
//     explanation: 'Trademarked algorithm requires closed CamelCase formatting.',
//     category: 'PRODUCT_NAME',
//   },
//   {
//     id: 'term-ecomode-lower',
//     term: 'ecomode',
//     preferred: 'EcoMode',
//     explanation: 'Capitalize registered product feature names.',
//     category: 'PRODUCT_NAME',
//   },
//   {
//     id: 'term-bridge',
//     term: 'northwind bridge',
//     preferred: 'Northwind Bridge',
//     explanation: 'Capitalize proprietary gateway hardware.',
//     category: 'PRODUCT_NAME',
//   },
//   {
//     id: 'term-cheap',
//     term: 'cheap',
//     preferred: 'cost-effective',
//     explanation: 'Connotes substandard manufacturing quality.',
//     category: 'SALES_CLAIM',
//   },
//   {
//     id: 'term-foolproof',
//     term: 'foolproof',
//     preferred: 'intuitive',
//     explanation: 'Patronizing tone toward homeowner users.',
//     category: 'SALES_CLAIM',
//   },
//   {
//     id: 'term-guaranteed-fix',
//     term: 'guaranteed fix',
//     preferred: 'engineered solution',
//     explanation: 'Creates unqualified warranty liability.',
//     category: 'SALES_CLAIM',
//   },
//   {
//     id: 'term-super-dope',
//     term: 'super dope',
//     preferred: 'exceptional',
//     explanation: 'Informal slang incompatible with brand prestige.',
//     category: 'SALES_CLAIM',
//   },
//   {
//     id: 'term-mind-blowing',
//     term: 'mind-blowing',
//     preferred: 'remarkable',
//     explanation: 'Hyperbolic marketing claim.',
//     category: 'SALES_CLAIM',
//   },
//   {
//     id: 'term-gonna',
//     term: 'gonna',
//     preferred: 'going to',
//     explanation: 'Colloquial abbreviation.',
//     category: 'TECHNICAL',
//   },
//   {
//     id: 'term-tons-of',
//     term: 'tons of',
//     preferred: 'substantial',
//     explanation: 'Imprecise colloquialism.',
//     category: 'TECHNICAL',
//   },
// ];

// export const SEED_SOURCES: ApprovedSource[] = [
//   {
//     id: 'SRC-2023-THERMAL',
//     title: '2023 Thermal Modulation Award (EXPIRED)',
//     factType: 'AWARD',
//     owner: 'Market Research',
//     effectiveFrom: '2023-01-01',
//     reviewAfter: '2024-01-01',
//     isExpired: true,
//     substantiatedStatementText:
//       'Rated #1 best-in-class thermostat for smart home temperature modulation.',
//     allowedSuperlatives: ['#1', 'best-in-class'],
//     numericMetrics: {},
//     notes: 'Expired annual accreditation from Home Climate Alliance. Recertification pending.',
//   },
//   {
//     id: 'SRC-2024-ENERGY',
//     title: '2024 Energy Efficiency Independent Benchmark',
//     factType: 'ENERGY_STUDY',
//     owner: 'Hardware QA',
//     effectiveFrom: '2024-06-01',
//     reviewAfter: '2027-06-01',
//     isExpired: false,
//     substantiatedStatementText:
//       'Saves up to 23% on seasonal HVAC electricity bills across 1,200 monitored test households.',
//     allowedSuperlatives: [],
//     numericMetrics: {
//       savings: 'up to 23%',
//       households: '1,200',
//     },
//   },
//   {
//     id: 'SRC-2025-CUSTOMER',
//     title: '2025 Customer Trust & Reliability Survey',
//     factType: 'CUSTOMER_COUNT',
//     owner: 'Customer Operations',
//     effectiveFrom: '2025-01-15',
//     reviewAfter: '2027-01-15',
//     isExpired: false,
//     substantiatedStatementText:
//       'Over 85,000 connected households across Scandinavia and North America.',
//     allowedSuperlatives: [],
//     numericMetrics: {
//       customers: '85,000',
//       satisfaction: '98.2%',
//     },
//   },
//   {
//     id: 'SRC-2025-UL',
//     title: 'UL 60730-1 Safety Certification',
//     factType: 'CERTIFICATION',
//     owner: 'Compliance & Legal',
//     effectiveFrom: '2025-03-10',
//     reviewAfter: '2028-03-10',
//     isExpired: false,
//     substantiatedStatementText:
//       'Certified compliant with UL 60730-1 standard for automatic electrical controls for household and similar use.',
//     allowedSuperlatives: [],
//     numericMetrics: {},
//   },
//   {
//     id: 'SRC-2024-PATENT',
//     title: 'US Patent 11,842,910 Multi-Zone Heating Control',
//     factType: 'CERTIFICATION',
//     owner: 'Intellectual Property',
//     effectiveFrom: '2024-11-20',
//     reviewAfter: '2034-11-20',
//     isExpired: false,
//     substantiatedStatementText:
//       'Proprietary predictive thermal inertia algorithms awarded US Patent 11,842,910.',
//     allowedSuperlatives: [],
//     numericMetrics: {},
//   },
//   {
//     id: 'SRC-2022-ECODESIGN',
//     title: '2022 EcoDesign Directive Compliance Report (EXPIRED)',
//     factType: 'AWARD',
//     owner: 'Environmental Affairs',
//     effectiveFrom: '2022-01-01',
//     reviewAfter: '2023-12-31',
//     isExpired: true,
//     substantiatedStatementText:
//       'Recognized as Europe top energy conserver in residential heat pumps.',
//     allowedSuperlatives: ['top energy conserver'],
//     numericMetrics: {},
//   },
//   {
//     id: 'SRC-2025-DECIBEL',
//     title: 'Acoustic Silence Laboratory Report',
//     factType: 'ENERGY_STUDY',
//     owner: 'Acoustics Engineering',
//     effectiveFrom: '2025-02-01',
//     reviewAfter: '2027-02-01',
//     isExpired: false,
//     substantiatedStatementText:
//       'Operates silently under 18 dBA at 1 meter distance, virtually imperceptible to human ear.',
//     allowedSuperlatives: [],
//     numericMetrics: {
//       decibels: '18 dBA',
//     },
//   },
//   {
//     id: 'SRC-2026-PRICE',
//     title: '2026 Recommended Retail Pricing Matrix',
//     factType: 'PRICING',
//     owner: 'Commercial Finance',
//     effectiveFrom: '2026-01-01',
//     reviewAfter: '2026-12-31',
//     isExpired: false,
//     substantiatedStatementText:
//       'Northwind Home Smart Thermostat MSRP is $249 USD / €229 EUR.',
//     allowedSuperlatives: [],
//     numericMetrics: {
//       msrp_usd: '$249',
//       msrp_eur: '€229',
//     },
//   },
// ];

// export const SEED_ASSETS: ApprovedAsset[] = [
//   {
//     id: 'ASSET-LOGO-LIGHT',
//     name: 'Northwind Shield Logo - Light Mode',
//     type: 'LOGO',
//     dHash: 'a8f4c2e1b3d79055',
//     minClearspace: '24px',
//     description: 'Primary cobalt and white vector shield emblem for dark backgrounds.',
//     previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
//   },
//   {
//     id: 'ASSET-LOGO-DARK',
//     name: 'Northwind Shield Logo - Dark Monolith',
//     type: 'LOGO',
//     dHash: 'b4d9e3f1c2a86077',
//     minClearspace: '24px',
//     description: 'Monochrome slate shield emblem for light editorial documents.',
//     previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
//   },
//   {
//     id: 'ASSET-PALETTE',
//     name: 'Nordic Architectural Palette Tokens',
//     type: 'PALETTE',
//     paletteHex: ['#0B111E', '#131B2A', '#1E293B', '#2563EB', '#38BDF8', '#0D9488', '#F1F5F9'],
//     description: 'Core brand colors inspired by Scandinavian twilight, granite, and coastal sea.',
//     previewUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=200&auto=format&fit=crop&q=80',
//   },
//   {
//     id: 'ASSET-HERO-LIVING',
//     name: 'Hero: Modernist Scandinavian Living Room',
//     type: 'HERO_IMAGE',
//     dHash: 'c7e2b1d9a5f43890',
//     description: 'Verified hero photography featuring warm oak walls, diffused Nordic daylight, and wall unit.',
//     previewUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&auto=format&fit=crop&q=80',
//   },
//   {
//     id: 'ASSET-HERO-MINIMAL',
//     name: 'Hero: Minimal Wall-Mount Installation',
//     type: 'HERO_IMAGE',
//     dHash: 'e1a3d5b7c9f28461',
//     description: 'Close-up tactile dial interface photograph on honed architectural concrete.',
//     previewUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&auto=format&fit=crop&q=80',
//   },
//   {
//     id: 'ASSET-ICON-ECO',
//     name: 'EcoMode Verification Leaf Icon',
//     type: 'LOGO',
//     dHash: 'f0c8e4a2d6b17395',
//     description: 'Precision 24x24 geometric leaf badge signaling active energy optimization.',
//     previewUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=200&auto=format&fit=crop&q=80',
//   },
// ];

// export const SEED_BRAND_KIT: BrandKit = {
//   brandName: 'Northwind Home',
//   brandTagline: 'Intelligent climate control made simple for modern homes.',
//   guidelines: SEED_GUIDELINES,
//   terms: SEED_TERMS,
//   approvedSources: SEED_SOURCES,
//   approvedAssets: SEED_ASSETS,
//   toneProfile: {
//     targetFormality: 70,
//     maxSentenceLength: 25,
//     targetReadingGrade: [8, 11],
//     bannedSlang: [
//       'super dope',
//       'mind-blowing',
//       'gonna',
//       'tons of',
//       'insane',
//       'game-changer',
//       'crazy good',
//     ],
//     allowExclamationPoints: false,
//     maxExclamationPointsPerDoc: 1,
//     activeVoiceTarget: 80,
//   },
// };

// // 8 Rich Seed Content Items across TEXT, MARKDOWN, DOCX, PDF, IMAGE covering all 7 categories
// export function createSeedContentItems(): ContentItem[] {
//   const items: {
//     id: string;
//     title: string;
//     channel: any;
//     format: any;
//     status: any;
//     rawContent: string;
//     author: User;
//     submittedAt?: string;
//     approvedAt?: string;
//     mediaUrl?: string;
//   }[] = [
//     {
//       id: 'item-claims-term',
//       title: 'Unsubstantiated Market Claims Flyer',
//       channel: 'PRESS',
//       format: 'TEXT',
//       status: 'DRAFT',
//       rawContent:
//         'NW Home delivers the #1 best-in-class performance that is guaranteed to transform your household climate. Our intelligent thermostat brings revolutionary efficiency.',
//       author: SEED_USERS[0], // Ada
//     },
//     {
//       id: 'content-outdated-bulletin',
//       title: 'Outdated Source Reference Bulletin',
//       channel: 'BLOG',
//       format: 'DOCX',
//       status: 'DRAFT',
//       rawContent:
//         'Northwind Home remains proud of our #1 best-in-class thermostat recognition and our breakthrough that saves 45% on seasonal electricity consumption. Homeowners can count on our proven leadership.',
//       author: SEED_USERS[0],
//     },
//     {
//       id: 'content-confidential-memo',
//       title: 'Confidential Launch Memo',
//       channel: 'INTERNAL',
//       format: 'PDF',
//       status: 'DRAFT',
//       rawContent:
//         '[CONFIDENTIAL - INTERNAL ONLY]\nExecutive Briefing on Project Boreas hardware rollout.\nDeploy automated testing using live Stripe credentials sk_live_northwind_99214 for payment sandbox.\nDirect inquiries to employee lead coordinator SSN: 012-34-5678.',
//       author: SEED_USERS[0],
//     },
//     {
//       id: 'content-visual-compliance',
//       title: 'Visual Asset Compliance Test',
//       channel: 'LANDING',
//       format: 'IMAGE',
//       status: 'DRAFT',
//       mediaUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=500&unverified=true',
//       rawContent:
//         'Experience modern heating. Accent banners feature custom magenta #FF0055 styling and a stretched logo lockup designed for dramatic impact across digital displays.',
//       author: SEED_USERS[0],
//     },
//     {
//       id: 'content-tone-launch-note',
//       title: 'Tone Violations in Launch Note',
//       channel: 'SOCIAL',
//       format: 'TEXT',
//       status: 'DRAFT',
//       rawContent:
//         'This new update is super dope and totally mind-blowing!!! We are gonna help everyone save tons of cash while experiencing revolutionary efficiency and unprecedented domestic comfort across all living spaces with zero complications whatsoever and complete peace of mind.',
//       author: SEED_USERS[0],
//     },
//     {
//       id: 'content-a11y-guide',
//       title: 'Customer Onboarding Guide',
//       channel: 'SUPPORT',
//       format: 'MARKDOWN',
//       status: 'DRAFT',
//       rawContent:
//         '# Northwind Home Quickstart\n\n### Mounting and Hardware Installation\n\n![](/assets/thermostat-mounting.jpg)\n\nTo view complete electrical safety diagrams, please [click here](https://northwind.test/support/wiring).',
//       author: SEED_USERS[0],
//     },
//     {
//       id: 'content-smart-scheduling',
//       title: 'Product Feature Release: Smart Scheduling',
//       channel: 'EMAIL',
//       format: 'TEXT',
//       status: 'SUBMITTED',
//       submittedAt: '2026-10-22T14:30:00Z',
//       rawContent:
//         'Northwind Home introduces intelligent climate control made simple for modern homes. Activate Eco Mode in your mobile application to save up to 23% on seasonal HVAC electricity bills.',
//       author: SEED_USERS[0],
//     },
//     {
//       id: 'content-approved-ecomode',
//       title: 'Approved EcoMode Press Announcement',
//       channel: 'PRESS',
//       format: 'MARKDOWN',
//       status: 'APPROVED',
//       submittedAt: '2026-10-20T10:00:00Z',
//       approvedAt: '2026-10-21T11:15:00Z',
//       rawContent:
//         '# Northwind Home Unveils Advanced EcoMode Algorithms\n\nNorthwind Home introduces intelligent climate control made simple for modern homes. In rigorous independent benchmark testing across 1,200 monitored test households, EcoMode saves up to 23% on seasonal HVAC electricity bills while operating quietly at 18 dBA.',
//       author: SEED_USERS[0],
//     },
//   ];

//   return items.map((raw) => {
//     const analysis = runDetectionEngine(
//       raw.rawContent,
//       {
//         contentItemId: raw.id,
//         versionId: `${raw.id}-v1`,
//         channel: raw.channel,
//         format: raw.format,
//         mediaUrl: raw.mediaUrl,
//       },
//       SEED_BRAND_KIT
//     );

//     // If it is the approved item, mark findings as decided/clean
//     if (raw.status === 'APPROVED') {
//       analysis.findings = [];
//       analysis.readinessScore = 100;
//       analysis.blockersCount = 0;
//       analysis.totalFindingsCount = 0;
//       analysis.openFindingsCount = 0;
//     }

//     const version = {
//       id: `${raw.id}-v1`,
//       contentItemId: raw.id,
//       versionNumber: 1,
//       rawContent: raw.rawContent,
//       mediaUrl: raw.mediaUrl,
//       readinessScore: analysis.readinessScore,
//       blockersCount: analysis.blockersCount,
//       totalFindingsCount: analysis.totalFindingsCount,
//       findings: analysis.findings,
//       changeSummary: 'Initial document creation',
//       createdAt: '2026-10-22T09:00:00Z',
//       authorId: raw.author.id,
//     };

//     return {
//       id: raw.id,
//       title: raw.title,
//       channel: raw.channel,
//       format: raw.format,
//       status: raw.status,
//       author: raw.author,
//       activeVersionId: version.id,
//       currentVersion: 1,
//       versions: [version],
//       createdAt: '2026-10-22T09:00:00Z',
//       updatedAt: '2026-10-22T14:30:00Z',
//       submittedAt: raw.submittedAt,
//       approvedAt: raw.approvedAt,
//       mediaUrl: raw.mediaUrl,
//     };
//   });
// }

// export const SEED_AUDIT_LOG: AuditLogEntry[] = [
//   {
//     id: 'log-1',
//     timestamp: '2026-10-29T08:34:00Z',
//     actor: {
//       id: 'user-ada',
//       name: 'Ada Lovelace',
//       email: 'ada@northwind.test',
//       role: 'CREATOR',
//     },
//     action: 'CONTENT_CREATED',
//     targetType: 'CONTENT',
//     targetId: 'content-claims-flyer',
//     details: 'Created draft "Unsubstantiated Market Claims Flyer"',
//     previousHash: '0000000000000000',
//     hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
//   },
//   {
//     id: 'log-2',
//     timestamp: '2026-10-29T08:35:12Z',
//     actor: {
//       id: 'user-ada',
//       name: 'Ada Lovelace',
//       email: 'ada@northwind.test',
//       role: 'CREATOR',
//     },
//     action: 'ANALYSIS_RUN',
//     targetType: 'CONTENT',
//     targetId: 'content-claims-flyer',
//     details: 'Deterministic engine detected 7 findings (2 blockers, 4 high)',
//     previousHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
//     hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
//   },
//   {
//     id: 'log-3',
//     timestamp: '2026-10-29T08:36:00Z',
//     actor: {
//       id: 'user-ada',
//       name: 'Ada Lovelace',
//       email: 'ada@northwind.test',
//       role: 'CREATOR',
//     },
//     action: 'SUGGESTION_REJECTED',
//     targetType: 'FINDING',
//     targetId: 'claim-outdated-21',
//     details: 'Author rejected proposed fix for claim "#1": "Subjective marketing qualifier preferred by agency"',
//     previousHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
//     hash: '7d32c51b74d39f4e2f81907c13da5e656d782161b6c72956cf287ec347101bb2',
//   },
//   {
//     id: 'log-4',
//     timestamp: '2026-10-29T08:37:30Z',
//     actor: {
//       id: 'user-marcus',
//       name: 'Marcus Aurelius',
//       email: 'marcus@northwind.test',
//       role: 'REVIEWER',
//     },
//     action: 'STATUS_CHANGED',
//     targetType: 'CONTENT',
//     targetId: 'content-smart-scheduling',
//     details: 'Status transitioned: DRAFT -> SUBMITTED by Ada Lovelace',
//     previousHash: '7d32c51b74d39f4e2f81907c13da5e656d782161b6c72956cf287ec347101bb2',
//     hash: 'a982f14309d94f29a059b867c4273e319cb8c519d19daef671d2b7818e3a2468',
//   },
// ];




import {
  ApprovedAsset,
  ApprovedSource,
  AuditLogEntry,
  BrandKit,
  ContentItem,
  Guideline,
  TerminologyTerm,
  User,
} from './types';
import { runDetectionEngine } from './engine';

export const SEED_USERS: User[] = [
  {
    id: 'ada',
    name: 'Ada Lovelace',
    email: 'ada@northwind.test',
    role: 'CREATOR',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'marcus',
    name: 'Marcus Aurelius',
    email: 'marcus@northwind.test',
    role: 'REVIEWER',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'priya',
    name: 'Priya Sharma',
    email: 'priya@northwind.test',
    role: 'BRAND_ADMIN',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'sam',
    name: 'Sam Taylor',
    email: 'sam@northwind.test',
    role: 'VIEWER',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
  },
];

export const SEED_GUIDELINES: Guideline[] = [
  {
    id: 'CLAIM-1',
    category: 'claims',
    ruleCode: 'CLAIM-SUPERLATIVE',
    title: 'Superlatives & Unsubstantiated Claims',
    description:
      'Absolute superlatives such as "#1", "number one", "guaranteed", "risk-free", or "best-in-class" are strictly prohibited unless linked to an active, validated Approved Source. When unverified, substitute with measured qualifiers such as "leading" or "designed to".',
    severity: 'BLOCKER',
    examples: {
      compliant: ['Our leading thermostat', 'Engineered to reduce heating waste'],
      violation: ['The #1 best-in-class thermostat', 'Guaranteed lowest energy bills'],
    },
  },
  {
    id: 'CLAIM-2',
    category: 'claims',
    ruleCode: 'CLAIM-NUMERIC',
    title: 'Numeric and Performance Data Verification',
    description:
      'Every numeric percentage, technical specification, and dollar amount quoted in content must be documented verbatim in an active Approved Source. Unverified figures create regulatory advertising liability.',
    severity: 'HIGH',
    examples: {
      compliant: ['Saves up to 23% based on 2024 independent testing'],
      violation: ['Saves 65% on electricity', 'Trusted by 5,000,000 homeowners'],
    },
  },
  {
    id: 'TERM-1',
    category: 'terminology',
    ruleCode: 'TERM-AVOID',
    title: 'Approved Terminology & Prohibited Expressions',
    description:
      'Refer to our brand as Northwind Home, never abbreviated as Northwind or NW Home. Use smart climate control instead of HVAC gadgetry.',
    severity: 'HIGH',
    examples: {
      compliant: ['Northwind Home EcoController', 'intelligent climate control'],
      violation: ['NW Home gadget', 'Northwind thermostat app'],
    },
  },
  {
    id: 'TERM-2',
    category: 'terminology',
    ruleCode: 'TERM-ORTHOGRAPHY',
    title: 'Brand Capitalization & Orthography',
    description:
      'Ensure strict capitalization for trademarked product terms such as EcoMode and Northwind Bridge. Never use separated or lowercase spellings.',
    severity: 'MEDIUM',
    examples: {
      compliant: ['EcoMode setting', 'Northwind Bridge hub'],
      violation: ['Eco Mode', 'ecomode', 'northwind bridge'],
    },
  },
  {
    id: 'A11Y-1',
    category: 'accessibility',
    ruleCode: 'A11Y-ALT-TEXT',
    title: 'Visual Accessibility and Alternative Descriptions',
    description:
      'All imagery must include descriptive, purposeful alt text for assistive screen readers. Ensure all foreground text against background colors satisfies minimum WCAG AA contrast ratio of at least 4.5:1.',
    severity: 'BLOCKER',
    examples: {
      compliant: ['![Northwind Home thermostat mounted on oak wall](...)]'],
      violation: ['![](/img.png)', '![photo](...)'],
    },
  },
  {
    id: 'A11Y-2',
    category: 'accessibility',
    ruleCode: 'A11Y-MEANINGFUL-LINKS',
    title: 'Structural Accessibility and Meaningful Links',
    description:
      'Maintain hierarchical heading order without skipping levels (e.g. h1 followed directly by h3). Links must provide descriptive context; never use ambiguous phrases like "click here" or "read more".',
    severity: 'HIGH',
    examples: {
      compliant: ['[Read the Energy Star report](...)', 'h1 -> h2 -> h3'],
      violation: ['[click here](...)', 'h1 -> h3 (skipping h2)'],
    },
  },
  {
    id: 'TONE-1',
    category: 'tone',
    ruleCode: 'TONE-PUNCTUATION',
    title: 'Editorial Tone & Professional Punctuation',
    description:
      'Maintain a calm, measured, architectural tone. Consecutive exclamation marks, excessive caps, and sensationalist phrasing are prohibited.',
    severity: 'LOW',
    examples: {
      compliant: ['Engineered for silent reliability.'],
      violation: ['Incredible performance you must see right now!!!'],
    },
  },
  {
    id: 'TONE-2',
    category: 'tone',
    ruleCode: 'TONE-SLANG',
    title: 'Brand Voice, Formality & Vocabulary',
    description:
      'Avoid informal internet slang, colloquial hype, or overly casual idioms. Northwind speaks with technical authority and domestic elegance.',
    severity: 'MEDIUM',
    examples: {
      compliant: ['exceptional thermal precision', 'substantial savings'],
      violation: ['super dope gadget', 'mind-blowing performance', 'gonna save tons'],
    },
  },
  {
    id: 'VIS-1',
    category: 'visual',
    ruleCode: 'VISUAL-LOGO-CLEARSPACE',
    title: 'Logo Clearspace & Protection Zone',
    description:
      'The Northwind Home emblem requires a minimum exclusion zone equal to half the emblem height. Never rotate, recolor, or distort the logo.',
    severity: 'HIGH',
    examples: {
      compliant: ['Centered logo lockup with 24px padding'],
      violation: ['Stretched logo', 'Logo overlapping busy background photography'],
    },
  },
  {
    id: 'CONF-1',
    category: 'confidentiality',
    ruleCode: 'CONF-API-KEY',
    title: 'Information Security & Credential Protection',
    description:
      'Zero tolerance for production credentials, secret keys (sk_live_, AKIA, ghp_), internal codenames, or employee personal data in external collateral.',
    severity: 'BLOCKER',
    examples: {
      compliant: ['Configure via Northwind Cloud Console credentials.'],
      violation: ['sk_live_northwind_99214', 'Project Boreas unreleased specs'],
    },
  },
];

export const SEED_TERMS: TerminologyTerm[] = [
  {
    id: 'term-nw-home',
    term: 'NW Home',
    preferred: 'Northwind Home',
    explanation: 'Avoid term "NW Home". The preferred brand terminology is "Northwind Home".',
    category: 'BRAND_NAME',
  },
  {
    id: 'term-northwind-alone',
    term: 'Northwind',
    preferred: 'Northwind Home',
    explanation: 'When referring to the consumer brand, use full "Northwind Home".',
    category: 'BRAND_NAME',
  },
  {
    id: 'term-ecomode',
    term: 'Eco Mode',
    preferred: 'EcoMode',
    explanation: 'Trademarked algorithm requires closed CamelCase formatting.',
    category: 'PRODUCT_NAME',
  },
  {
    id: 'term-ecomode-lower',
    term: 'ecomode',
    preferred: 'EcoMode',
    explanation: 'Capitalize registered product feature names.',
    category: 'PRODUCT_NAME',
  },
  {
    id: 'term-bridge',
    term: 'northwind bridge',
    preferred: 'Northwind Bridge',
    explanation: 'Capitalize proprietary gateway hardware.',
    category: 'PRODUCT_NAME',
  },
  {
    id: 'term-cheap',
    term: 'cheap',
    preferred: 'cost-effective',
    explanation: 'Connotes substandard manufacturing quality.',
    category: 'SALES_CLAIM',
  },
  {
    id: 'term-foolproof',
    term: 'foolproof',
    preferred: 'intuitive',
    explanation: 'Patronizing tone toward homeowner users.',
    category: 'SALES_CLAIM',
  },
  {
    id: 'term-guaranteed-fix',
    term: 'guaranteed fix',
    preferred: 'engineered solution',
    explanation: 'Creates unqualified warranty liability.',
    category: 'SALES_CLAIM',
  },
  {
    id: 'term-super-dope',
    term: 'super dope',
    preferred: 'exceptional',
    explanation: 'Informal slang incompatible with brand prestige.',
    category: 'SALES_CLAIM',
  },
  {
    id: 'term-mind-blowing',
    term: 'mind-blowing',
    preferred: 'remarkable',
    explanation: 'Hyperbolic marketing claim.',
    category: 'SALES_CLAIM',
  },
  {
    id: 'term-gonna',
    term: 'gonna',
    preferred: 'going to',
    explanation: 'Colloquial abbreviation.',
    category: 'TECHNICAL',
  },
  {
    id: 'term-tons-of',
    term: 'tons of',
    preferred: 'substantial',
    explanation: 'Imprecise colloquialism.',
    category: 'TECHNICAL',
  },
];

export const SEED_SOURCES: ApprovedSource[] = [
  {
    id: 'SRC-2023-THERMAL',
    title: '2023 Thermal Modulation Award (EXPIRED)',
    factType: 'AWARD',
    owner: 'Market Research',
    effectiveFrom: '2023-01-01',
    reviewAfter: '2024-01-01',
    isExpired: true,
    substantiatedStatementText:
      'Rated #1 best-in-class thermostat for smart home temperature modulation.',
    allowedSuperlatives: ['#1', 'best-in-class'],
    numericMetrics: {},
    notes: 'Expired annual accreditation from Home Climate Alliance. Recertification pending.',
  },
  {
    id: 'SRC-2024-ENERGY',
    title: '2024 Energy Efficiency Independent Benchmark',
    factType: 'ENERGY_STUDY',
    owner: 'Hardware QA',
    effectiveFrom: '2024-06-01',
    reviewAfter: '2027-06-01',
    isExpired: false,
    substantiatedStatementText:
      'Saves up to 23% on seasonal HVAC electricity bills across 1,200 monitored test households.',
    allowedSuperlatives: [],
    numericMetrics: {
      savings: 'up to 23%',
      households: '1,200',
    },
  },
  {
    id: 'SRC-2025-CUSTOMER',
    title: '2025 Customer Trust & Reliability Survey',
    factType: 'CUSTOMER_COUNT',
    owner: 'Customer Operations',
    effectiveFrom: '2025-01-15',
    reviewAfter: '2027-01-15',
    isExpired: false,
    substantiatedStatementText:
      'Over 85,000 connected households across Scandinavia and North America.',
    allowedSuperlatives: [],
    numericMetrics: {
      customers: '85,000',
      satisfaction: '98.2%',
    },
  },
  {
    id: 'SRC-2025-UL',
    title: 'UL 60730-1 Safety Certification',
    factType: 'CERTIFICATION',
    owner: 'Compliance & Legal',
    effectiveFrom: '2025-03-10',
    reviewAfter: '2028-03-10',
    isExpired: false,
    substantiatedStatementText:
      'Certified compliant with UL 60730-1 standard for automatic electrical controls for household and similar use.',
    allowedSuperlatives: [],
    numericMetrics: {},
  },
  {
    id: 'SRC-2024-PATENT',
    title: 'US Patent 11,842,910 Multi-Zone Heating Control',
    factType: 'CERTIFICATION',
    owner: 'Intellectual Property',
    effectiveFrom: '2024-11-20',
    reviewAfter: '2034-11-20',
    isExpired: false,
    substantiatedStatementText:
      'Proprietary predictive thermal inertia algorithms awarded US Patent 11,842,910.',
    allowedSuperlatives: [],
    numericMetrics: {},
  },
  {
    id: 'SRC-2022-ECODESIGN',
    title: '2022 EcoDesign Directive Compliance Report (EXPIRED)',
    factType: 'AWARD',
    owner: 'Environmental Affairs',
    effectiveFrom: '2022-01-01',
    reviewAfter: '2023-12-31',
    isExpired: true,
    substantiatedStatementText:
      'Recognized as Europe top energy conserver in residential heat pumps.',
    allowedSuperlatives: ['top energy conserver'],
    numericMetrics: {},
  },
  {
    id: 'SRC-2025-DECIBEL',
    title: 'Acoustic Silence Laboratory Report',
    factType: 'ENERGY_STUDY',
    owner: 'Acoustics Engineering',
    effectiveFrom: '2025-02-01',
    reviewAfter: '2027-02-01',
    isExpired: false,
    substantiatedStatementText:
      'Operates silently under 18 dBA at 1 meter distance, virtually imperceptible to human ear.',
    allowedSuperlatives: [],
    numericMetrics: {
      decibels: '18 dBA',
    },
  },
  {
    id: 'SRC-2026-PRICE',
    title: '2026 Recommended Retail Pricing Matrix',
    factType: 'PRICING',
    owner: 'Commercial Finance',
    effectiveFrom: '2026-01-01',
    reviewAfter: '2026-12-31',
    isExpired: false,
    substantiatedStatementText:
      'Northwind Home Smart Thermostat MSRP is $249 USD / €229 EUR.',
    allowedSuperlatives: [],
    numericMetrics: {
      msrp_usd: '$249',
      msrp_eur: '€229',
    },
  },
];

export const SEED_ASSETS: ApprovedAsset[] = [
  {
    id: 'ASSET-LOGO-LIGHT',
    name: 'Northwind Shield Logo - Light Mode',
    type: 'LOGO',
    dHash: 'a8f4c2e1b3d79055',
    minClearspace: '24px',
    description: 'Primary cobalt and white vector shield emblem for dark backgrounds.',
    previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'ASSET-LOGO-DARK',
    name: 'Northwind Shield Logo - Dark Monolith',
    type: 'LOGO',
    dHash: 'b4d9e3f1c2a86077',
    minClearspace: '24px',
    description: 'Monochrome slate shield emblem for light editorial documents.',
    previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'ASSET-PALETTE',
    name: 'Nordic Architectural Palette Tokens',
    type: 'PALETTE',
    paletteHex: ['#0B111E', '#131B2A', '#1E293B', '#2563EB', '#38BDF8', '#0D9488', '#F1F5F9'],
    description: 'Core brand colors inspired by Scandinavian twilight, granite, and coastal sea.',
    previewUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'ASSET-HERO-LIVING',
    name: 'Hero: Modernist Scandinavian Living Room',
    type: 'HERO_IMAGE',
    dHash: 'c7e2b1d9a5f43890',
    description: 'Verified hero photography featuring warm oak walls, diffused Nordic daylight, and wall unit.',
    previewUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'ASSET-HERO-MINIMAL',
    name: 'Hero: Minimal Wall-Mount Installation',
    type: 'HERO_IMAGE',
    dHash: 'e1a3d5b7c9f28461',
    description: 'Close-up tactile dial interface photograph on honed architectural concrete.',
    previewUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'ASSET-ICON-ECO',
    name: 'EcoMode Verification Leaf Icon',
    type: 'LOGO',
    dHash: 'f0c8e4a2d6b17395',
    description: 'Precision 24x24 geometric leaf badge signaling active energy optimization.',
    previewUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=200&auto=format&fit=crop&q=80',
  },
];

export const SEED_BRAND_KIT: BrandKit = {
  brandName: 'Northwind Home',
  brandTagline: 'Intelligent climate control made simple for modern homes.',
  guidelines: SEED_GUIDELINES,
  terms: SEED_TERMS,
  approvedSources: SEED_SOURCES,
  approvedAssets: SEED_ASSETS,
  toneProfile: {
    targetFormality: 70,
    maxSentenceLength: 25,
    targetReadingGrade: [8, 11],
    bannedSlang: [
      'super dope',
      'mind-blowing',
      'gonna',
      'tons of',
      'insane',
      'game-changer',
      'crazy good',
    ],
    allowExclamationPoints: false,
    maxExclamationPointsPerDoc: 1,
    activeVoiceTarget: 80,
  },
};

export const AMAZON_BRAND_KIT: BrandKit = {
  brandName: 'Amazon Devices',
  brandTagline: "Earth's most customer-centric company: Devices and Services.",
  guidelines: [
    {
      id: 'AMZN-1',
      category: 'terminology',
      ruleCode: 'TERM-TRADEMARK',
      title: 'Alexa and Echo Trademark Guidelines',
      description:
        'Always refer to the hardware as an "Echo device" or "smart speaker with Alexa built-in". Never refer to hardware simply as "an Alexa" or use Echo as a generic verb.',
      severity: 'HIGH',
      examples: {
        compliant: ['Ask your Echo Dot with Alexa to play music.'],
        violation: ['Talk to your Alexa to play music.'],
      },
    },
    {
      id: 'AMZN-2',
      category: 'claims',
      ruleCode: 'CLAIM-SUPERLATIVE',
      title: 'Retail and Hardware Performance Claims',
      description:
        'Claims such as "best-selling smart display" or "fastest streaming stick" must link to verified quarterly sales audits.',
      severity: 'BLOCKER',
      examples: {
        compliant: ['Our popular streaming stick with 4K resolution.'],
        violation: ['The #1 best-selling streaming device of all time.'],
      },
    },
    {
      id: 'AMZN-3',
      category: 'visual',
      ruleCode: 'VISUAL-PALETTE',
      title: 'Amazon Devices Official Color System',
      description:
        'Official digital touchpoints require Squid Ink (#232F3E), Amazon Prime Blue (#00A8E1), and Amazon Smile Orange (#FF9900).',
      severity: 'MEDIUM',
      examples: {
        compliant: ['Using #232F3E Squid Ink background.'],
        violation: ['Using unauthorized neon purple banner colors.'],
      },
    },
  ],
  terms: [
    {
      id: 'term-alexa-hw',
      term: 'an Alexa',
      preferred: 'an Echo device with Alexa',
      explanation: 'Alexa is the cloud-based voice service, not the physical device.',
      category: 'PRODUCT_NAME',
    },
    {
      id: 'term-kindle-fire',
      term: 'Kindle Fire',
      preferred: 'Fire tablet',
      explanation: 'Kindle is reserved for e-readers. Tablets are branded as Fire.',
      category: 'PRODUCT_NAME',
    },
    {
      id: 'term-echo-lower',
      term: 'amazon echo',
      preferred: 'Amazon Echo',
      explanation: 'Maintain proper trademark capitalization.',
      category: 'PRODUCT_NAME',
    },
  ],
  approvedSources: [
    {
      id: 'SRC-AMZN-2026',
      title: '2026 Amazon Global Hardware Satisfaction Audit',
      factType: 'CUSTOMER_COUNT',
      owner: 'Device Product Marketing',
      effectiveFrom: '2026-01-01',
      reviewAfter: '2027-01-01',
      isExpired: false,
      substantiatedStatementText:
        'Over 500 million Alexa-enabled devices connected worldwide with 99.9% voice cloud uptime.',
      allowedSuperlatives: [],
      numericMetrics: { devices: '500M' },
    },
  ],
  approvedAssets: [
    {
      id: 'ASSET-AMZN-LOGO',
      name: 'Amazon Smile Lockup',
      type: 'LOGO',
      minClearspace: '32px',
      description: 'Official Amazon Smile emblem with a-to-z arrow curve.',
      previewUrl: 'https://images.unsplash.com/photo-1523474255658-4af61b1684c4?w=200&auto=format&fit=crop&q=80',
    },
    {
      id: 'ASSET-AMZN-PALETTE',
      name: 'Amazon Corporate Palette',
      type: 'PALETTE',
      paletteHex: ['#232F3E', '#FF9900', '#00A8E1', '#FFFFFF'],
      description: 'Squid Ink, Smile Orange, Prime Blue, and White.',
      previewUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=200&auto=format&fit=crop&q=80',
    },
  ],
  toneProfile: {
    targetFormality: 65,
    maxSentenceLength: 22,
    targetReadingGrade: [7, 10],
    bannedSlang: ['super dope', 'mind-blowing', 'gonna'],
    allowExclamationPoints: false,
    maxExclamationPointsPerDoc: 1,
    activeVoiceTarget: 85,
  },
};

export const AVAILABLE_BRANDS: Record<string, BrandKit> = {
  'Northwind Home': SEED_BRAND_KIT,
  'Amazon Devices': AMAZON_BRAND_KIT,
};

// 8 Rich Seed Content Items across TEXT, MARKDOWN, DOCX, PDF, IMAGE covering all 7 categories
export function createSeedContentItems(): ContentItem[] {
  const items: {
    id: string;
    title: string;
    channel: any;
    format: any;
    status: any;
    rawContent: string;
    author: User;
    submittedAt?: string;
    approvedAt?: string;
    mediaUrl?: string;
  }[] = [
    {
      id: 'item-claims-term',
      title: 'Unsubstantiated Market Claims Flyer',
      channel: 'PRESS',
      format: 'TEXT',
      status: 'DRAFT',
      rawContent:
        'NW Home delivers the #1 best-in-class performance that is guaranteed to transform your household climate. Our intelligent thermostat brings revolutionary efficiency.',
      author: SEED_USERS[0], // Ada
    },
    {
      id: 'content-outdated-bulletin',
      title: 'Outdated Source Reference Bulletin',
      channel: 'BLOG',
      format: 'DOCX',
      status: 'DRAFT',
      rawContent:
        'Northwind Home remains proud of our #1 best-in-class thermostat recognition and our breakthrough that saves 45% on seasonal electricity consumption. Homeowners can count on our proven leadership.',
      author: SEED_USERS[0],
    },
    {
      id: 'content-confidential-memo',
      title: 'Confidential Launch Memo',
      channel: 'INTERNAL',
      format: 'PDF',
      status: 'DRAFT',
      rawContent:
        '[CONFIDENTIAL - INTERNAL ONLY]\nExecutive Briefing on Project Boreas hardware rollout.\nDeploy automated testing using live Stripe credentials sk_live_northwind_99214 for payment sandbox.\nDirect inquiries to employee lead coordinator SSN: 012-34-5678.',
      author: SEED_USERS[0],
    },
    {
      id: 'content-visual-compliance',
      title: 'Visual Asset Compliance Test',
      channel: 'LANDING',
      format: 'IMAGE',
      status: 'DRAFT',
      mediaUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=500&unverified=true',
      rawContent:
        'Experience modern heating. Accent banners feature custom magenta #FF0055 styling and a stretched logo lockup designed for dramatic impact across digital displays.',
      author: SEED_USERS[0],
    },
    {
      id: 'content-tone-launch-note',
      title: 'Tone Violations in Launch Note',
      channel: 'SOCIAL',
      format: 'TEXT',
      status: 'DRAFT',
      rawContent:
        'This new update is super dope and totally mind-blowing!!! We are gonna help everyone save tons of cash while experiencing revolutionary efficiency and unprecedented domestic comfort across all living spaces with zero complications whatsoever and complete peace of mind.',
      author: SEED_USERS[0],
    },
    {
      id: 'content-a11y-guide',
      title: 'Customer Onboarding Guide',
      channel: 'SUPPORT',
      format: 'MARKDOWN',
      status: 'DRAFT',
      rawContent:
        '# Northwind Home Quickstart\n\n### Mounting and Hardware Installation\n\n![](/assets/thermostat-mounting.jpg)\n\nTo view complete electrical safety diagrams, please [click here](https://northwind.test/support/wiring).',
      author: SEED_USERS[0],
    },
    {
      id: 'content-smart-scheduling',
      title: 'Product Feature Release: Smart Scheduling',
      channel: 'EMAIL',
      format: 'TEXT',
      status: 'SUBMITTED',
      submittedAt: '2026-10-22T14:30:00Z',
      rawContent:
        'Northwind Home introduces intelligent climate control made simple for modern homes. Activate Eco Mode in your mobile application to save up to 23% on seasonal HVAC electricity bills.',
      author: SEED_USERS[0],
    },
    {
      id: 'content-approved-ecomode',
      title: 'Approved EcoMode Press Announcement',
      channel: 'PRESS',
      format: 'MARKDOWN',
      status: 'APPROVED',
      submittedAt: '2026-10-20T10:00:00Z',
      approvedAt: '2026-10-21T11:15:00Z',
      rawContent:
        '# Northwind Home Unveils Advanced EcoMode Algorithms\n\nNorthwind Home introduces intelligent climate control made simple for modern homes. In rigorous independent benchmark testing across 1,200 monitored test households, EcoMode saves up to 23% on seasonal HVAC electricity bills while operating quietly at 18 dBA.',
      author: SEED_USERS[0],
    },
  ];

  return items.map((raw) => {
    const analysis = runDetectionEngine(
      raw.rawContent,
      {
        contentItemId: raw.id,
        versionId: `${raw.id}-v1`,
        channel: raw.channel,
        format: raw.format,
        mediaUrl: raw.mediaUrl,
      },
      SEED_BRAND_KIT
    );

    // If it is the approved item, mark findings as decided/clean
    if (raw.status === 'APPROVED') {
      analysis.findings = [];
      analysis.readinessScore = 100;
      analysis.blockersCount = 0;
      analysis.totalFindingsCount = 0;
      analysis.openFindingsCount = 0;
    }

    const version = {
      id: `${raw.id}-v1`,
      contentItemId: raw.id,
      versionNumber: 1,
      rawContent: raw.rawContent,
      mediaUrl: raw.mediaUrl,
      readinessScore: analysis.readinessScore,
      blockersCount: analysis.blockersCount,
      totalFindingsCount: analysis.totalFindingsCount,
      findings: analysis.findings,
      changeSummary: 'Initial document creation',
      createdAt: '2026-10-22T09:00:00Z',
      authorId: raw.author.id,
    };

    return {
      id: raw.id,
      title: raw.title,
      channel: raw.channel,
      format: raw.format,
      status: raw.status,
      author: raw.author,
      activeVersionId: version.id,
      currentVersion: 1,
      versions: [version],
      createdAt: '2026-10-22T09:00:00Z',
      updatedAt: '2026-10-22T14:30:00Z',
      submittedAt: raw.submittedAt,
      approvedAt: raw.approvedAt,
      mediaUrl: raw.mediaUrl,
    };
  });
}

export const SEED_AUDIT_LOG: AuditLogEntry[] = [
  {
    id: 'log-1',
    timestamp: '2026-10-29T08:34:00Z',
    actor: {
      id: 'user-ada',
      name: 'Ada Lovelace',
      email: 'ada@northwind.test',
      role: 'CREATOR',
    },
    action: 'CONTENT_CREATED',
    targetType: 'CONTENT',
    targetId: 'content-claims-flyer',
    details: 'Created draft "Unsubstantiated Market Claims Flyer"',
    previousHash: '0000000000000000',
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  },
  {
    id: 'log-2',
    timestamp: '2026-10-29T08:35:12Z',
    actor: {
      id: 'user-ada',
      name: 'Ada Lovelace',
      email: 'ada@northwind.test',
      role: 'CREATOR',
    },
    action: 'ANALYSIS_RUN',
    targetType: 'CONTENT',
    targetId: 'content-claims-flyer',
    details: 'Deterministic engine detected 7 findings (2 blockers, 4 high)',
    previousHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
  },
  {
    id: 'log-3',
    timestamp: '2026-10-29T08:36:00Z',
    actor: {
      id: 'user-ada',
      name: 'Ada Lovelace',
      email: 'ada@northwind.test',
      role: 'CREATOR',
    },
    action: 'SUGGESTION_REJECTED',
    targetType: 'FINDING',
    targetId: 'claim-outdated-21',
    details: 'Author rejected proposed fix for claim "#1": "Subjective marketing qualifier preferred by agency"',
    previousHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    hash: '7d32c51b74d39f4e2f81907c13da5e656d782161b6c72956cf287ec347101bb2',
  },
  {
    id: 'log-4',
    timestamp: '2026-10-29T08:37:30Z',
    actor: {
      id: 'user-marcus',
      name: 'Marcus Aurelius',
      email: 'marcus@northwind.test',
      role: 'REVIEWER',
    },
    action: 'STATUS_CHANGED',
    targetType: 'CONTENT',
    targetId: 'content-smart-scheduling',
    details: 'Status transitioned: DRAFT -> SUBMITTED by Ada Lovelace',
    previousHash: '7d32c51b74d39f4e2f81907c13da5e656d782161b6c72956cf287ec347101bb2',
    hash: 'a982f14309d94f29a059b867c4273e319cb8c519d19daef671d2b7818e3a2468',
  },
];
