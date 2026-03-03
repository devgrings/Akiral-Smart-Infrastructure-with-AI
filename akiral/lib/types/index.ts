// ============================================================
// AKIRAL — Core Type Definitions
// Enterprise-grade SaaS B2B Lead Intelligence Platform
// ============================================================

// ── Tenant Architecture ──────────────────────────────────────
export type TenantTier = 'SME_SHARED_DB' | 'ENTERPRISE_DEDICATED_DB'
export type PlanType = 'BASIC' | 'PRO' | 'BUSINESS' | 'SCALE' | 'ENTERPRISE'
export type CompanyStatus = 'ACTIVE' | 'SUSPENDED' | 'TRIAL' | 'CHURNED'
export type Country = 'BR' | 'US' | 'EU' | 'OTHER'
export type PrivacyRegime = 'LGPD' | 'GDPR' | 'CCPA' | 'NONE'

export interface Company {
  id: string
  tenantId: string
  tenantTier: TenantTier
  name: string
  slug: string
  plan: PlanType
  status: CompanyStatus
  country: Country
  privacyRegime: PrivacyRegime
  industry: IndustrySector
  monthlyInteractionQuota: number
  interactionsUsed: number
  rolloverBalance: number
  dbConnectionKey?: string // only ENTERPRISE_DEDICATED_DB
  createdAt: string
  updatedAt: string
}

// ── RBAC + ABAC Roles ────────────────────────────────────────
export type UserRole =
  | 'AKIRAL_SUPER_ADMIN'
  | 'AKIRAL_ANALYST'
  | 'CLIENT_ADMIN'
  | 'CLIENT_SALES_MANAGER'
  | 'CLIENT_VIEWER'

export interface UserPermissions {
  canViewAllTenants: boolean
  canManageCompanies: boolean
  canAccessRawLogs: boolean
  canExportData: boolean
  canConfigureAI: boolean
  canViewAuditTrail: boolean
  canManageUsers: boolean
  canViewBilling: boolean
  canAccessAnalytics: boolean
  canModifyLeads: boolean
}

export interface User {
  id: string
  companyId: string
  email: string
  name: string
  role: UserRole
  permissions: UserPermissions
  plan: PlanType
  country: Country
  privacyRegime: PrivacyRegime
  lastLoginAt: string
  mfaEnabled: boolean
  createdAt: string
}

// ── Lead Intelligence Layer ──────────────────────────────────
export type LeadLifecycleState =
  | 'COLD'
  | 'ACTIVATED'
  | 'ENGAGED'
  | 'MONETIZED'
  | 'DORMANT'

export type LeadSource =
  | 'AI_RECEPTIONIST'
  | 'ORGANIC'
  | 'REFERRAL'
  | 'PAID_ADS'
  | 'SOCIAL'
  | 'MANUAL'
  | 'API_IMPORT'

export interface LeadStateTransition {
  from: LeadLifecycleState
  to: LeadLifecycleState
  triggeredAt: string
  triggeredBy: 'AI_SYSTEM' | 'HUMAN' | 'AUTOMATION'
  durationInState: number // hours
}

export interface Lead {
  id: string
  tokenizedId: string // privacy-preserving token
  companyId: string
  source: LeadSource
  currentState: LeadLifecycleState
  stateHistory: LeadStateTransition[]
  interactionCount: number
  responseVelocityScore: number // 0-100
  engagementScore: number // 0-100
  degradationRisk: number // 0-100
  enteredAt: string
  lastInteractionAt: string
  timeInCurrentState: number // hours
  averageStateTransitionTime: number // hours
  tags: string[]
  channel: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
}

// ── AKIRAL Performance Index (API™) ─────────────────────────
export type APIScoreGrade = 'S' | 'A' | 'B' | 'C' | 'D' | 'F'

export interface APIScoreBreakdown {
  leadGrowthScore: number       // 0-25 pts
  conversionScore: number       // 0-25 pts
  responseVelocityScore: number // 0-25 pts
  monthlyStabilityScore: number // 0-25 pts
}

export interface AkiralPerformanceIndex {
  companyId: string
  period: string // YYYY-MM
  totalScore: number // 0-100
  grade: APIScoreGrade
  breakdown: APIScoreBreakdown
  sectorBenchmark: number // anonymized sector average
  deltaFromBenchmark: number // +/- percentage points
  deltaFromLastPeriod: number
  trend: 'IMPROVING' | 'STABLE' | 'DECLINING'
  computedAt: string
  version: string // algorithm version for patent traceability
}

// ── Analytics — Privacy-First (No Financial Data) ────────────
export interface ConversionMetrics {
  companyId: string
  period: string
  coldToActivated: number      // % rate
  activatedToEngaged: number   // % rate
  engagedToMonetized: number   // % rate
  overallConversion: number    // % rate
  deltaOverallConversion: number // % change vs prior period
  avgTimeToConversion: number  // hours
  leadsLost: number
  leadsRecovered: number
}

export interface GrowthMetrics {
  companyId: string
  period: string
  totalLeads: number
  newLeads: number
  growthRate: number           // % vs prior period
  retentionRate: number        // %
  churnRate: number            // %
  reactivationRate: number     // %
  netLeadGrowth: number        // %
}

export interface ROIIndex {
  companyId: string
  period: string
  // PRIVACY-BY-DESIGN: No absolute monetary values
  conversionLiftPercent: number    // % improvement
  timeToConversionDelta: number    // % faster/slower
  leadQualityIndexDelta: number    // relative change
  aiAssistanceImpact: number       // % of conversions AI-assisted
  indexedROI: number               // proprietary index 0-200
  disclaimer: string               // "Indexed value — no financial data processed"
}

// ── AI Receptionist ──────────────────────────────────────────
export type InteractionType = 'SHORT' | 'MEDIUM' | 'LONG' | 'COMPLEX'
export type InteractionOutcome =
  | 'LEAD_CAPTURED'
  | 'LEAD_QUALIFIED'
  | 'LEAD_REJECTED'
  | 'ESCALATED_TO_HUMAN'
  | 'SPAM_DETECTED'
  | 'TIMEOUT'
  | 'INCOMPLETE'

export interface InteractionTokenBudget {
  type: InteractionType
  tokenMin: number
  tokenMax: number
  interactionCost: number // fractional interaction unit
}

export const INTERACTION_BUDGETS: Record<InteractionType, InteractionTokenBudget> = {
  SHORT:   { type: 'SHORT',   tokenMin: 150, tokenMax: 250,  interactionCost: 1.0 },
  MEDIUM:  { type: 'MEDIUM',  tokenMin: 500, tokenMax: 700,  interactionCost: 1.0 },
  LONG:    { type: 'LONG',    tokenMin: 700, tokenMax: 1200, interactionCost: 1.5 },
  COMPLEX: { type: 'COMPLEX', tokenMin: 1200, tokenMax: 3000, interactionCost: 2.0 },
}

export interface AIInteraction {
  id: string
  companyId: string
  leadTokenizedId: string
  sessionId: string
  type: InteractionType
  outcome: InteractionOutcome
  tokensConsumed: number
  interactionCostUnits: number
  isSpam: boolean
  isUseless: boolean          // useless = does NOT consume quota
  messages: AIMessage[]
  startedAt: string
  endedAt: string
  durationSeconds: number
  extractedLeadData?: Partial<Lead>
}

export interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
  timestamp: string
  tokensUsed: number
}

export interface AIReceptionistConfig {
  companyId: string
  persona: string
  greeting: string
  industries: string[]
  qualificationQuestions: string[]
  escalationTriggers: string[]
  blockedKeywords: string[]
  spamThreshold: number
  maxTurnsBeforeEscalation: number
  language: 'PT' | 'EN' | 'ES' | 'FR'
  timezone: string
  isActive: boolean
}

// ── Interaction Quota & Rollover ─────────────────────────────
export interface QuotaSnapshot {
  companyId: string
  plan: PlanType
  period: string
  quota: number
  used: number
  remaining: number
  rolloverFromPrior: number
  rolloverToNext: number      // max 30% of quota
  overageUnits: number
  overageCostPerUnit: number  // USD
  projectedOverage: number    // projected end-of-period
  hardLimitReached: boolean
}

// ── Audit & Compliance ───────────────────────────────────────
export type AuditAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'DATA_ACCESS'
  | 'DATA_EXPORT'
  | 'LEAD_CREATED'
  | 'LEAD_UPDATED'
  | 'LEAD_DELETED'
  | 'AI_INTERACTION_STARTED'
  | 'AI_INTERACTION_ENDED'
  | 'SETTINGS_CHANGED'
  | 'USER_INVITED'
  | 'USER_REMOVED'
  | 'PLAN_CHANGED'
  | 'COMPLIANCE_REPORT_GENERATED'
  | 'DATA_DELETION_REQUESTED'

export interface AuditLogEntry {
  id: string
  companyId: string
  userId: string
  userRole: UserRole
  action: AuditAction
  resourceType: string
  resourceId: string
  ipAddress: string
  userAgent: string
  metadata: Record<string, unknown>
  timestamp: string
  hash: string              // WORM integrity hash (SHA-256 chain)
  previousHash: string      // chain integrity
  immutable: true           // WORM flag
}

// ── Industry Sectors (for anonymized benchmarking) ───────────
export type IndustrySector =
  | 'TECHNOLOGY'
  | 'HEALTHCARE'
  | 'FINANCE'
  | 'RETAIL'
  | 'REAL_ESTATE'
  | 'EDUCATION'
  | 'LEGAL'
  | 'MARKETING'
  | 'LOGISTICS'
  | 'MANUFACTURING'
  | 'OTHER'

export interface SectorBenchmark {
  sector: IndustrySector
  period: string
  avgAPIScore: number         // anonymized average
  avgConversionRate: number
  avgResponseVelocity: number
  avgLeadGrowth: number
  sampleSize: number          // disclosed without identifying companies
  computedAt: string
}

// ── Plan Configuration ───────────────────────────────────────
export interface PlanConfig {
  type: PlanType
  displayName: string
  setupFeeMin: number   // USD
  setupFeeMax: number   // USD
  monthlyMin: number    // USD
  monthlyMax: number    // USD
  interactionQuota: number
  rolloverPercentage: number  // max 30%
  overagePerUnit: number      // USD per extra interaction
  tenantTier: TenantTier
  features: string[]
  hardLimit: boolean
  dedicatedDB: boolean
  slaUptime: number           // percentage
}

export const PLAN_CONFIGS: Record<PlanType, PlanConfig> = {
  BASIC: {
    type: 'BASIC',
    displayName: 'Basic',
    setupFeeMin: 479,
    setupFeeMax: 697,
    monthlyMin: 149,
    monthlyMax: 149,
    interactionQuota: 1500,
    rolloverPercentage: 30,
    overagePerUnit: 0.03,
    tenantTier: 'SME_SHARED_DB',
    features: ['AI Receptionist', 'Lead Dashboard', 'Basic Analytics', 'AKIRAL API™ Score'],
    hardLimit: true,
    dedicatedDB: false,
    slaUptime: 99.5,
  },
  PRO: {
    type: 'PRO',
    displayName: 'Pro',
    setupFeeMin: 997,
    setupFeeMax: 1497,
    monthlyMin: 349,
    monthlyMax: 349,
    interactionQuota: 5000,
    rolloverPercentage: 30,
    overagePerUnit: 0.025,
    tenantTier: 'SME_SHARED_DB',
    features: ['AI Receptionist', 'Lead Intelligence', 'Advanced Analytics', 'ROI Index', 'Sector Benchmarks', 'AKIRAL API™ Score'],
    hardLimit: true,
    dedicatedDB: false,
    slaUptime: 99.5,
  },
  BUSINESS: {
    type: 'BUSINESS',
    displayName: 'Business',
    setupFeeMin: 2500,
    setupFeeMax: 4000,
    monthlyMin: 749,
    monthlyMax: 1200,
    interactionQuota: 15000,
    rolloverPercentage: 30,
    overagePerUnit: 0.02,
    tenantTier: 'SME_SHARED_DB',
    features: ['AI Receptionist', 'Full Lead Intelligence', 'Full Analytics', 'ROI Index', 'Sector Benchmarks', 'AKIRAL API™ Score', 'Audit Trail', 'Multi-User'],
    hardLimit: false,
    dedicatedDB: false,
    slaUptime: 99.9,
  },
  SCALE: {
    type: 'SCALE',
    displayName: 'Scale',
    setupFeeMin: 2500,
    setupFeeMax: 4000,
    monthlyMin: 749,
    monthlyMax: 1200,
    interactionQuota: 15000,
    rolloverPercentage: 30,
    overagePerUnit: 0.02,
    tenantTier: 'ENTERPRISE_DEDICATED_DB',
    features: ['Everything in Business', 'Dedicated DB', 'Priority Support', 'Custom Integrations'],
    hardLimit: false,
    dedicatedDB: true,
    slaUptime: 99.95,
  },
  ENTERPRISE: {
    type: 'ENTERPRISE',
    displayName: 'Enterprise',
    setupFeeMin: 8000,
    setupFeeMax: 25000,
    monthlyMin: 2000,
    monthlyMax: 5000,
    interactionQuota: 100000,
    rolloverPercentage: 30,
    overagePerUnit: 0.01,
    tenantTier: 'ENTERPRISE_DEDICATED_DB',
    features: ['All Features', 'Dedicated DB + Logs + Backups', 'Custom SLA', 'White-label', 'API Access', 'LGPD/GDPR DPA', 'Compliance Reports', 'Zero Trust Audit'],
    hardLimit: false,
    dedicatedDB: true,
    slaUptime: 99.99,
  },
}
