import Database from 'better-sqlite3';
import { PrismaClient } from '@prisma/client';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SQLITE_PATH = join(__dirname, '..', 'prisma', 'dev.db');
const BATCH = 1000;

function toBigInt(v: unknown): bigint {
  if (v === null || v === undefined) throw new Error('Unexpected null BigInt');
  return BigInt(v as number | string);
}

async function migrate() {
  console.log('Conectando ao SQLite...');
  const sqlite = new Database(SQLITE_PATH);

  console.log('Conectando ao PostgreSQL...');
  const pg = new PrismaClient();

  // 1. Fighter
  console.log('Migrando Fighters...');
  const fighters = sqlite.prepare('SELECT * FROM Fighter').all() as any[];
  for (let i = 0; i < fighters.length; i += BATCH) {
    const batch = fighters.slice(i, i + BATCH).map((f: any) => ({
      shortId: toBigInt(f.shortId),
      fighterId: f.fighterId || null,
      platformId: f.platformId,
      platformName: f.platformName,
      platformTool: f.platformTool,
      circleName: f.circleName || null,
    }));
    await pg.fighter.createMany({ data: batch }).catch((err) => {
      console.error(`  Erro no batch fighters ${i}: ${err.message}`);
    });
    if ((i / BATCH) % 10 === 0) console.log(`  ${Math.min(i + BATCH, fighters.length)}/${fighters.length}`);
  }
  console.log(`  ${fighters.length} fighters migrados`);

  // 2. Account
  console.log('Migrando Accounts...');
  const accounts = sqlite.prepare('SELECT * FROM Account').all() as any[];
  for (let i = 0; i < accounts.length; i += BATCH) {
    const batch = accounts.slice(i, i + BATCH).map((a: any) => ({
      id: a.id,
      email: a.email,
      passwordHash: a.passwordHash,
      shortId: a.shortId ? toBigInt(a.shortId) : null,
      refreshToken: a.refreshToken || null,
      role: a.role,
      createdAt: new Date(a.createdAt),
      consentGivenAt: a.consentGivenAt ? new Date(a.consentGivenAt) : null,
    }));
    await pg.account.createMany({ data: batch }).catch((err) => {
      console.error(`  Erro no batch accounts ${i}: ${err.message}`);
    });
  }
  console.log(`  ${accounts.length} accounts migradas`);

  // 3. VerificationToken
  console.log('Migrando VerificationTokens...');
  const tokens = sqlite.prepare('SELECT * FROM VerificationToken').all() as any[];
  for (let i = 0; i < tokens.length; i += BATCH) {
    const batch = tokens.slice(i, i + BATCH).map((t: any) => ({
      id: t.id,
      token: t.token,
      type: t.type,
      accountId: t.accountId,
      metadata: t.metadata || null,
      expiresAt: new Date(t.expiresAt),
      usedAt: t.usedAt ? new Date(t.usedAt) : null,
      createdAt: new Date(t.createdAt),
    }));
    await pg.verificationToken.createMany({ data: batch }).catch((err) => {
      console.error(`  Erro no batch tokens ${i}: ${err.message}`);
    });
  }
  console.log(`  ${tokens.length} tokens migrados`);

  // 4. Report (reporterId/reportedId are BigInt)
  console.log('Migrando Reports...');
  const reports = sqlite.prepare('SELECT * FROM Report').all() as any[];
  for (let i = 0; i < reports.length; i += BATCH) {
    const batch = reports.slice(i, i + BATCH).map((r: any) => ({
      id: r.id,
      reporterId: toBigInt(r.reporterId),
      reportedId: toBigInt(r.reportedId),
      proofImagePath: r.proofImagePath,
      comment: r.comment,
      adminComment: r.adminComment || null,
      exifData: r.exifData || null,
      aiSuspicious: r.aiSuspicious === 1,
      aiReason: r.aiReason || null,
      createdAt: new Date(r.createdAt),
      status: r.status,
    }));
    await pg.report.createMany({ data: batch }).catch((err) => {
      console.error(`  Erro no batch reports ${i}: ${err.message}`);
    });
  }
  console.log(`  ${reports.length} reports migrados`);

  // 5. ContactInquiry
  console.log('Migrando ContactInquiries...');
  const inquiries = sqlite.prepare('SELECT * FROM ContactInquiry').all() as any[];
  for (let i = 0; i < inquiries.length; i += BATCH) {
    const batch = inquiries.slice(i, i + BATCH).map((c: any) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      subject: c.subject,
      message: c.message,
      createdAt: new Date(c.createdAt),
    }));
    await pg.contactInquiry.createMany({ data: batch }).catch((err) => {
      console.error(`  Erro no batch inquiries ${i}: ${err.message}`);
    });
  }
  console.log(`  ${inquiries.length} inquiries migradas`);

  // 6. BugReport
  console.log('Migrando BugReports...');
  const bugReports = sqlite.prepare('SELECT * FROM BugReport').all() as any[];
  for (let i = 0; i < bugReports.length; i += BATCH) {
    const batch = bugReports.slice(i, i + BATCH).map((b: any) => ({
      id: b.id,
      subject: b.subject,
      description: b.description,
      status: b.status,
      createdAt: new Date(b.createdAt),
    }));
    await pg.bugReport.createMany({ data: batch }).catch((err) => {
      console.error(`  Erro no batch bugReports ${i}: ${err.message}`);
    });
  }
  console.log(`  ${bugReports.length} bugReports migrados`);

  await pg.$disconnect();
  sqlite.close();
  console.log('Migração concluída!');
}

migrate().catch((err) => {
  console.error('Falha na migração:', err);
  process.exit(1);
});
