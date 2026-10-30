import { PrismaClient } from '@prisma/client';
import {
  SEED_USERS,
  SEED_GUIDELINES,
  SEED_TERMS,
  SEED_SOURCES,
  SEED_ASSETS,
  createSeedContentItems,
} from '../src/lib/seedData';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding BrandLens Northwind Home database...');

  // 1. Create Organization
  const org = await prisma.organization.upsert({
    where: { id: 'org-northwind' },
    update: {},
    create: {
      id: 'org-northwind',
      name: 'Northwind Home',
      tagline: 'Intelligent climate control made simple for modern homes.',
    },
  });

  // 2. Create Users
  for (const user of SEED_USERS) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        id: user.id,
        organizationId: org.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  }

  // 3. Create Guidelines
  for (const g of SEED_GUIDELINES) {
    await prisma.guideline.upsert({
      where: { id: g.id },
      update: {},
      create: {
        id: g.id,
        organizationId: org.id,
        category: g.category,
        ruleCode: g.ruleCode,
        title: g.title,
        description: g.description,
        severity: g.severity,
        examplesJson: JSON.stringify(g.examples),
      },
    });
  }

  // 4. Create Terms
  for (const t of SEED_TERMS) {
    await prisma.terminologyTerm.upsert({
      where: { id: t.id },
      update: {},
      create: {
        id: t.id,
        organizationId: org.id,
        term: t.term,
        preferred: t.preferred,
        explanation: t.explanation,
        category: t.category,
      },
    });
  }

  // 5. Create Sources
  for (const s of SEED_SOURCES) {
    await prisma.approvedSource.upsert({
      where: { id: s.id },
      update: {},
      create: {
        id: s.id,
        organizationId: org.id,
        title: s.title,
        factType: s.factType,
        owner: s.owner,
        effectiveFrom: new Date(s.effectiveFrom),
        reviewAfter: new Date(s.reviewAfter),
        isExpired: s.isExpired,
        substantiatedStatementText: s.substantiatedStatementText,
        allowedSuperlativesJson: JSON.stringify(s.allowedSuperlatives),
        numericMetricsJson: JSON.stringify(s.numericMetrics),
        notes: s.notes,
      },
    });
  }

  // 6. Create Assets
  for (const a of SEED_ASSETS) {
    await prisma.approvedAsset.upsert({
      where: { id: a.id },
      update: {},
      create: {
        id: a.id,
        organizationId: org.id,
        name: a.name,
        type: a.type,
        dHash: a.dHash,
        paletteHexJson: JSON.stringify(a.paletteHex || []),
        minClearspace: a.minClearspace,
        description: a.description,
        previewUrl: a.previewUrl,
      },
    });
  }

  // 7. Create Content Items & Versions
  const seedItems = createSeedContentItems();
  for (const item of seedItems) {
    await prisma.contentItem.upsert({
      where: { id: item.id },
      update: {},
      create: {
        id: item.id,
        organizationId: org.id,
        title: item.title,
        channel: item.channel,
        format: item.format,
        status: item.status,
        authorId: item.author.id,
        currentVersion: item.currentVersion,
        mediaUrl: item.mediaUrl,
        versions: {
          create: item.versions.map((v) => ({
            id: v.id,
            versionNumber: v.versionNumber,
            rawContent: v.rawContent,
            mediaUrl: v.mediaUrl,
            readinessScore: v.readinessScore,
            blockersCount: v.blockersCount,
            totalFindingsCount: v.totalFindingsCount,
            changeSummary: v.changeSummary,
          })),
        },
      },
    });
  }

  console.log('Database seeded successfully with Northwind Home Brand Kit and collateral!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
