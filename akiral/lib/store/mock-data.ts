// ============================================================
// AKIRAL — Mock Data Engine
// Simulates enterprise-grade multi-tenant data
// ============================================================

import {
  Company, Lead, LeadLifecycleState, AkiralPerformanceIndex,
  ConversionMetrics, GrowthMetrics, ROIIndex, AIInteraction,
  AuditLogEntry, QuotaSnapshot, SectorBenchmark, User,
  AIReceptionistConfig, IndustrySector
} from '@/lib/types'
import { getScoreGrade, generateTokenizedId } from '@/lib/utils'

// ── Demo Company ────────────────────────────────────────────
export const DEMO_COMPANY: Company = {
  id: 'comp_e7f2a1b3c4d5',
  tenantId: 'tenant_sme_pool_1',
  tenantTier: 'SME_SHARED_DB',
  name: 'TechVenture Ltda.',
  slug: 'techventure',
  plan: 'PRO',
  status: 'ACTIVE',
  country: 'BR',
  privacyRegime: 'LGPD',
  industry: 'TECHNOLOGY',
  monthlyInteractionQuota: 5000,
  interactionsUsed: 3247,
  rolloverBalance: 412,
  createdAt: '2024-09-15T10:00:00Z',
  updatedAt: '2026-03-01T08:00:00Z',
}

export const DEMO_USER: User = {
  id: 'usr_9a2b4c6d8e',
  companyId: DEMO_COMPANY.id,
  email: 'admin@techventure.com.br',
  name: 'Rafael Mendes',
  role: 'CLIENT_ADMIN',
  permissions: {
    canViewAllTenants: false,
    canManageCompanies: true,
    canAccessRawLogs: false,
    canExportData: true,
    canConfigureAI: true,
    canViewAuditTrail: true,
    canManageUsers: true,
    canViewBilling: true,
    canAccessAnalytics: true,
    canModifyLeads: true,
  },
  plan: 'PRO',
  country: 'BR',
  privacyRegime: 'LGPD',
  lastLoginAt: '2026-03-03T09:15:22Z',
  mfaEnabled: true,
  createdAt: '2024-09-15T10:00:00Z',
}

// ── Lead Generation ─────────────────────────────────────────
const states: LeadLifecycleState[] = ['COLD', 'ACTIVATED', 'ENGAGED', 'MONETIZED', 'DORMANT']
const sources = ['AI_RECEPTIONIST', 'ORGANIC', 'REFERRAL', 'PAID_ADS', 'SOCIAL'] as const

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

function generateLead(index: number): Lead {
  const seed = index * 137
  const stateIndex = Math.floor(seededRandom(seed) * states.length)
  const state = states[stateIndex]
  const source = sources[Math.floor(seededRandom(seed + 1) * sources.length)]
  const daysAgo = randomBetween(1, 90)
  const enteredAt = new Date(Date.now() - daysAgo * 86400000).toISOString()
  const lastInteraction = new Date(Date.now() - randomBetween(1, daysAgo) * 3600000).toISOString()

  const id = `lead_${(seed * 31337 + 42).toString(16).slice(0, 12)}`

  return {
    id,
    tokenizedId: generateTokenizedId(id),
    companyId: DEMO_COMPANY.id,
    source,
    currentState: state,
    stateHistory: [],
    interactionCount: randomBetween(1, 24),
    responseVelocityScore: randomBetween(20, 98),
    engagementScore: randomBetween(10, 95),
    degradationRisk: state === 'DORMANT' ? randomBetween(60, 95) : randomBetween(5, 40),
    enteredAt,
    lastInteractionAt: lastInteraction,
    timeInCurrentState: randomBetween(2, 720),
    averageStateTransitionTime: randomBetween(12, 168),
    tags: [],
    channel: source === 'AI_RECEPTIONIST' ? 'widget' : 'web',
  }
}

export const MOCK_LEADS: Lead[] = Array.from({ length: 48 }, (_, i) => generateLead(i))

// State distribution
export const LEAD_STATE_DISTRIBUTION = states.map(state => ({
  state,
  count: MOCK_LEADS.filter(l => l.currentState === state).length,
  percentage: Math.round((MOCK_LEADS.filter(l => l.currentState === state).length / MOCK_LEADS.length) * 100),
}))

// ── AKIRAL Performance Index ─────────────────────────────────
export const MOCK_API_SCORES: AkiralPerformanceIndex[] = [
  { companyId: DEMO_COMPANY.id, period: '2025-09', totalScore: 58, grade: 'C', breakdown: { leadGrowthScore: 14, conversionScore: 13, responseVelocityScore: 16, monthlyStabilityScore: 15 }, sectorBenchmark: 61, deltaFromBenchmark: -3, deltaFromLastPeriod: 0, trend: 'STABLE', computedAt: '2025-09-30T23:59:00Z', version: 'API-v2.1' },
  { companyId: DEMO_COMPANY.id, period: '2025-10', totalScore: 63, grade: 'B', breakdown: { leadGrowthScore: 16, conversionScore: 15, responseVelocityScore: 17, monthlyStabilityScore: 15 }, sectorBenchmark: 62, deltaFromBenchmark: +1, deltaFromLastPeriod: +5, trend: 'IMPROVING', computedAt: '2025-10-31T23:59:00Z', version: 'API-v2.1' },
  { companyId: DEMO_COMPANY.id, period: '2025-11', totalScore: 67, grade: 'B', breakdown: { leadGrowthScore: 17, conversionScore: 16, responseVelocityScore: 18, monthlyStabilityScore: 16 }, sectorBenchmark: 62, deltaFromBenchmark: +5, deltaFromLastPeriod: +4, trend: 'IMPROVING', computedAt: '2025-11-30T23:59:00Z', version: 'API-v2.1' },
  { companyId: DEMO_COMPANY.id, period: '2025-12', totalScore: 65, grade: 'B', breakdown: { leadGrowthScore: 15, conversionScore: 17, responseVelocityScore: 17, monthlyStabilityScore: 16 }, sectorBenchmark: 63, deltaFromBenchmark: +2, deltaFromLastPeriod: -2, trend: 'STABLE', computedAt: '2025-12-31T23:59:00Z', version: 'API-v2.1' },
  { companyId: DEMO_COMPANY.id, period: '2026-01', totalScore: 71, grade: 'B', breakdown: { leadGrowthScore: 18, conversionScore: 18, responseVelocityScore: 19, monthlyStabilityScore: 16 }, sectorBenchmark: 63, deltaFromBenchmark: +8, deltaFromLastPeriod: +6, trend: 'IMPROVING', computedAt: '2026-01-31T23:59:00Z', version: 'API-v2.2' },
  { companyId: DEMO_COMPANY.id, period: '2026-02', totalScore: 74, grade: 'B', breakdown: { leadGrowthScore: 19, conversionScore: 18, responseVelocityScore: 19, monthlyStabilityScore: 18 }, sectorBenchmark: 64, deltaFromBenchmark: +10, deltaFromLastPeriod: +3, trend: 'IMPROVING', computedAt: '2026-02-28T23:59:00Z', version: 'API-v2.2' },
  { companyId: DEMO_COMPANY.id, period: '2026-03', totalScore: 78, grade: 'A', breakdown: { leadGrowthScore: 20, conversionScore: 19, responseVelocityScore: 21, monthlyStabilityScore: 18 }, sectorBenchmark: 64, deltaFromBenchmark: +14, deltaFromLastPeriod: +4, trend: 'IMPROVING', computedAt: '2026-03-03T12:00:00Z', version: 'API-v2.2' },
]

// ── Conversion Metrics ───────────────────────────────────────
export const MOCK_CONVERSION_METRICS: ConversionMetrics[] = [
  { companyId: DEMO_COMPANY.id, period: '2025-09', coldToActivated: 42.1, activatedToEngaged: 31.2, engagedToMonetized: 18.7, overallConversion: 9.8, deltaOverallConversion: 0, avgTimeToConversion: 96, leadsLost: 22, leadsRecovered: 4 },
  { companyId: DEMO_COMPANY.id, period: '2025-10', coldToActivated: 44.3, activatedToEngaged: 33.5, engagedToMonetized: 19.2, overallConversion: 10.6, deltaOverallConversion: +0.8, avgTimeToConversion: 88, leadsLost: 18, leadsRecovered: 6 },
  { companyId: DEMO_COMPANY.id, period: '2025-11', coldToActivated: 46.8, activatedToEngaged: 35.1, engagedToMonetized: 21.3, overallConversion: 11.7, deltaOverallConversion: +1.1, avgTimeToConversion: 80, leadsLost: 15, leadsRecovered: 7 },
  { companyId: DEMO_COMPANY.id, period: '2025-12', coldToActivated: 45.2, activatedToEngaged: 34.8, engagedToMonetized: 20.9, overallConversion: 11.4, deltaOverallConversion: -0.3, avgTimeToConversion: 82, leadsLost: 16, leadsRecovered: 5 },
  { companyId: DEMO_COMPANY.id, period: '2026-01', coldToActivated: 49.1, activatedToEngaged: 37.2, engagedToMonetized: 23.4, overallConversion: 13.1, deltaOverallConversion: +1.7, avgTimeToConversion: 74, leadsLost: 12, leadsRecovered: 9 },
  { companyId: DEMO_COMPANY.id, period: '2026-02', coldToActivated: 51.7, activatedToEngaged: 39.0, engagedToMonetized: 24.8, overallConversion: 14.2, deltaOverallConversion: +1.1, avgTimeToConversion: 68, leadsLost: 10, leadsRecovered: 11 },
  { companyId: DEMO_COMPANY.id, period: '2026-03', coldToActivated: 53.4, activatedToEngaged: 40.5, engagedToMonetized: 26.1, overallConversion: 15.3, deltaOverallConversion: +1.1, avgTimeToConversion: 63, leadsLost: 8, leadsRecovered: 12 },
]

// ── Growth Metrics ───────────────────────────────────────────
export const MOCK_GROWTH_METRICS: GrowthMetrics[] = [
  { companyId: DEMO_COMPANY.id, period: '2025-09', totalLeads: 187, newLeads: 47, growthRate: 14.2, retentionRate: 68.3, churnRate: 11.2, reactivationRate: 4.1, netLeadGrowth: 8.2 },
  { companyId: DEMO_COMPANY.id, period: '2025-10', totalLeads: 204, newLeads: 53, growthRate: 17.1, retentionRate: 70.1, churnRate: 10.4, reactivationRate: 5.2, netLeadGrowth: 9.1 },
  { companyId: DEMO_COMPANY.id, period: '2025-11', totalLeads: 228, newLeads: 61, growthRate: 22.3, retentionRate: 72.4, churnRate: 9.1, reactivationRate: 6.3, netLeadGrowth: 11.8 },
  { companyId: DEMO_COMPANY.id, period: '2025-12', totalLeads: 219, newLeads: 44, growthRate: 15.8, retentionRate: 71.2, churnRate: 9.8, reactivationRate: 5.8, netLeadGrowth: 7.4 },
  { companyId: DEMO_COMPANY.id, period: '2026-01', totalLeads: 261, newLeads: 72, growthRate: 28.4, retentionRate: 74.6, churnRate: 8.2, reactivationRate: 7.4, netLeadGrowth: 14.1 },
  { companyId: DEMO_COMPANY.id, period: '2026-02', totalLeads: 289, newLeads: 81, growthRate: 31.2, retentionRate: 76.8, churnRate: 7.6, reactivationRate: 8.1, netLeadGrowth: 16.4 },
  { companyId: DEMO_COMPANY.id, period: '2026-03', totalLeads: 312, newLeads: 87, growthRate: 33.7, retentionRate: 78.2, churnRate: 7.1, reactivationRate: 8.9, netLeadGrowth: 18.2 },
]

// ── ROI Index ────────────────────────────────────────────────
export const MOCK_ROI_INDEX: ROIIndex = {
  companyId: DEMO_COMPANY.id,
  period: '2026-03',
  conversionLiftPercent: 56.1,
  timeToConversionDelta: -34.4,
  leadQualityIndexDelta: +22.7,
  aiAssistanceImpact: 68.3,
  indexedROI: 167.4,
  disclaimer: 'Indexed value — no financial data processed. Privacy-by-Design compliant (LGPD Art. 7).',
}

// ── Quota Snapshot ───────────────────────────────────────────
export const MOCK_QUOTA: QuotaSnapshot = {
  companyId: DEMO_COMPANY.id,
  plan: 'PRO',
  period: '2026-03',
  quota: 5000,
  used: 3247,
  remaining: 1753,
  rolloverFromPrior: 412,
  rolloverToNext: 0,
  overageUnits: 0,
  overageCostPerUnit: 0.025,
  projectedOverage: 0,
  hardLimitReached: false,
}

// ── AI Receptionist Config ───────────────────────────────────
export const MOCK_AI_CONFIG: AIReceptionistConfig = {
  companyId: DEMO_COMPANY.id,
  persona: 'Aria',
  greeting: 'Olá! Sou a Aria, assistente da TechVenture. Como posso ajudá-lo hoje?',
  industries: ['TECHNOLOGY', 'FINANCE', 'RETAIL'],
  qualificationQuestions: [
    'Qual é o principal desafio da sua empresa atualmente?',
    'Quantos colaboradores sua empresa possui?',
    'Você já utilizou alguma solução de CRM ou automação?',
  ],
  escalationTriggers: ['falar com humano', 'atendente', 'urgente', 'reclamação'],
  blockedKeywords: ['concorrente', 'teste', 'bot'],
  spamThreshold: 0.75,
  maxTurnsBeforeEscalation: 8,
  language: 'PT',
  timezone: 'America/Sao_Paulo',
  isActive: true,
}

// ── Audit Log ────────────────────────────────────────────────
export const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  { id: 'aud_001', companyId: DEMO_COMPANY.id, userId: DEMO_USER.id, userRole: 'CLIENT_ADMIN', action: 'LOGIN', resourceType: 'SESSION', resourceId: 'sess_abc123', ipAddress: '189.47.xx.xx', userAgent: 'Chrome/121', metadata: {}, timestamp: '2026-03-03T09:15:22Z', hash: 'sha256_abc...', previousHash: 'sha256_000...', immutable: true },
  { id: 'aud_002', companyId: DEMO_COMPANY.id, userId: DEMO_USER.id, userRole: 'CLIENT_ADMIN', action: 'DATA_ACCESS', resourceType: 'ANALYTICS_DASHBOARD', resourceId: 'dash_main', ipAddress: '189.47.xx.xx', userAgent: 'Chrome/121', metadata: { view: 'conversion_metrics' }, timestamp: '2026-03-03T09:16:01Z', hash: 'sha256_bcd...', previousHash: 'sha256_abc...', immutable: true },
  { id: 'aud_003', companyId: DEMO_COMPANY.id, userId: DEMO_USER.id, userRole: 'CLIENT_ADMIN', action: 'AI_INTERACTION_STARTED', resourceType: 'AI_SESSION', resourceId: 'sess_ai_884', ipAddress: '189.47.xx.xx', userAgent: 'Chrome/121', metadata: { tokensEstimated: 420 }, timestamp: '2026-03-03T09:17:44Z', hash: 'sha256_cde...', previousHash: 'sha256_bcd...', immutable: true },
  { id: 'aud_004', companyId: DEMO_COMPANY.id, userId: DEMO_USER.id, userRole: 'CLIENT_ADMIN', action: 'SETTINGS_CHANGED', resourceType: 'AI_CONFIG', resourceId: 'aiconf_main', ipAddress: '189.47.xx.xx', userAgent: 'Chrome/121', metadata: { field: 'persona', oldValue: 'Bot', newValue: 'Aria' }, timestamp: '2026-03-03T09:22:18Z', hash: 'sha256_def...', previousHash: 'sha256_cde...', immutable: true },
  { id: 'aud_005', companyId: DEMO_COMPANY.id, userId: DEMO_USER.id, userRole: 'CLIENT_ADMIN', action: 'COMPLIANCE_REPORT_GENERATED', resourceType: 'REPORT', resourceId: 'rep_lgpd_202603', ipAddress: '189.47.xx.xx', userAgent: 'Chrome/121', metadata: { regulation: 'LGPD', period: '2026-03' }, timestamp: '2026-03-03T09:25:55Z', hash: 'sha256_efg...', previousHash: 'sha256_def...', immutable: true },
]

// ── Sector Benchmarks ────────────────────────────────────────
export const MOCK_SECTOR_BENCHMARKS: SectorBenchmark[] = [
  { sector: 'TECHNOLOGY', period: '2026-03', avgAPIScore: 64, avgConversionRate: 13.1, avgResponseVelocity: 68, avgLeadGrowth: 21.4, sampleSize: 247, computedAt: '2026-03-01T00:00:00Z' },
  { sector: 'FINANCE',    period: '2026-03', avgAPIScore: 71, avgConversionRate: 16.8, avgResponseVelocity: 74, avgLeadGrowth: 18.2, sampleSize: 189, computedAt: '2026-03-01T00:00:00Z' },
  { sector: 'RETAIL',     period: '2026-03', avgAPIScore: 59, avgConversionRate: 11.4, avgResponseVelocity: 62, avgLeadGrowth: 24.7, sampleSize: 312, computedAt: '2026-03-01T00:00:00Z' },
  { sector: 'HEALTHCARE', period: '2026-03', avgAPIScore: 55, avgConversionRate: 9.8,  avgResponseVelocity: 58, avgLeadGrowth: 15.1, sampleSize: 134, computedAt: '2026-03-01T00:00:00Z' },
  { sector: 'LEGAL',      period: '2026-03', avgAPIScore: 62, avgConversionRate: 14.2, avgResponseVelocity: 71, avgLeadGrowth: 16.8, sampleSize: 98, computedAt: '2026-03-01T00:00:00Z' },
]

// ── AI Interactions Timeline ─────────────────────────────────
export const MOCK_AI_INTERACTIONS_DAILY = Array.from({ length: 30 }, (_, i) => {
  const date = new Date('2026-02-01')
  date.setDate(date.getDate() + i)
  const seed = i * 17
  return {
    date: date.toISOString().split('T')[0],
    interactions: randomBetween(80, 180),
    qualified: randomBetween(20, 60),
    spam: randomBetween(2, 12),
    escalated: randomBetween(3, 15),
    tokensConsumed: randomBetween(40000, 120000),
  }
})

// ── Companies List (Multi-Tenant View) ───────────────────────
export const MOCK_COMPANIES: Company[] = [
  DEMO_COMPANY,
  { id: 'comp_b2c3d4e5f6', tenantId: 'tenant_ent_1', tenantTier: 'ENTERPRISE_DEDICATED_DB', name: 'FinancePro S.A.', slug: 'financepro', plan: 'ENTERPRISE', status: 'ACTIVE', country: 'BR', privacyRegime: 'LGPD', industry: 'FINANCE', monthlyInteractionQuota: 50000, interactionsUsed: 31240, rolloverBalance: 1200, dbConnectionKey: 'enc_key_fp_001', createdAt: '2024-01-10T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z' },
  { id: 'comp_c3d4e5f6a7', tenantId: 'tenant_sme_pool_1', tenantTier: 'SME_SHARED_DB', name: 'Retail Express', slug: 'retailexpress', plan: 'BASIC', status: 'ACTIVE', country: 'BR', privacyRegime: 'LGPD', industry: 'RETAIL', monthlyInteractionQuota: 1500, interactionsUsed: 987, rolloverBalance: 0, createdAt: '2025-03-22T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z' },
  { id: 'comp_d4e5f6a7b8', tenantId: 'tenant_ent_2', tenantTier: 'ENTERPRISE_DEDICATED_DB', name: 'LegalTech EU GmbH', slug: 'legaltech-eu', plan: 'ENTERPRISE', status: 'ACTIVE', country: 'EU', privacyRegime: 'GDPR', industry: 'LEGAL', monthlyInteractionQuota: 30000, interactionsUsed: 18940, rolloverBalance: 800, dbConnectionKey: 'enc_key_lt_002', createdAt: '2024-06-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z' },
  { id: 'comp_e5f6a7b8c9', tenantId: 'tenant_sme_pool_2', tenantTier: 'SME_SHARED_DB', name: 'HealthStart Clínica', slug: 'healthstart', plan: 'BUSINESS', status: 'TRIAL', country: 'BR', privacyRegime: 'LGPD', industry: 'HEALTHCARE', monthlyInteractionQuota: 15000, interactionsUsed: 2340, rolloverBalance: 0, createdAt: '2026-02-10T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z' },
]
