'use client'

import React, { useState } from 'react'
import Topbar from '@/components/layout/Topbar'
import { Card, SectionHeader, Badge, ProgressBar, Dot } from '@/components/ui'
import { useAppStore } from '@/lib/store/app-store'
import { MOCK_COMPANIES } from '@/lib/store/mock-data'
import { PLAN_CONFIGS, PlanType } from '@/lib/types'
import { cn, getPlanColor } from '@/lib/utils'
import {
  Settings, Building2, Shield, Lock, Globe, Users, Bell,
  Database, Key, Sliders, CreditCard, Check, ChevronRight,
  AlertTriangle, Cpu, Server, Archive
} from 'lucide-react'

const TABS = ['General', 'Security', 'Plans', 'Compliance', 'Infrastructure']

export default function SettingsPage() {
  const { currentCompany, currentUser } = useAppStore()
  const [activeTab, setActiveTab] = useState('General')

  return (
    <div className="page-enter">
      <Topbar title="Settings" subtitle="Platform configuration · Security · Compliance" />

      <div className="p-6 space-y-6">

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.05] w-fit">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-1.5 rounded-lg text-xs font-medium transition-all',
                activeTab === tab
                  ? 'bg-white/[0.08] text-white'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'General' && (
          <div className="space-y-4">
            <Card>
              <SectionHeader title="Company Profile" />
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Company Name', value: currentCompany.name },
                  { label: 'Slug', value: currentCompany.slug },
                  { label: 'Industry', value: currentCompany.industry },
                  { label: 'Country', value: currentCompany.country },
                  { label: 'Status', value: currentCompany.status },
                  { label: 'Created', value: new Date(currentCompany.createdAt).toLocaleDateString() },
                ].map(f => (
                  <div key={f.label}>
                    <p className="text-[10px] text-slate-600 mb-1">{f.label}</p>
                    <div className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-slate-300 font-mono">{f.value}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <SectionHeader title="Team Members" subtitle="RBAC + ABAC active" />
              <div className="space-y-2">
                {[
                  { name: 'Rafael Mendes', email: 'admin@techventure.com.br', role: 'CLIENT_ADMIN', mfa: true },
                  { name: 'Ana Lima', email: 'sales@techventure.com.br', role: 'CLIENT_SALES_MANAGER', mfa: false },
                  { name: 'João Costa', email: 'viewer@techventure.com.br', role: 'CLIENT_VIEWER', mfa: true },
                ].map(user => (
                  <div key={user.email} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600/30 to-indigo-600/30 border border-violet-500/20 flex items-center justify-center text-xs font-bold text-violet-300">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-300">{user.name}</p>
                        <p className="text-[10px] text-slate-600">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] text-slate-500">{user.role.replace(/_/g, ' ')}</span>
                      <span className={cn('text-[10px] px-1.5 py-0.5 rounded', user.mfa ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400')}>
                        MFA {user.mfa ? 'ON' : 'OFF'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'Security' && (
          <div className="space-y-4">
            <Card>
              <SectionHeader title="Security Architecture" subtitle="Zero Trust Internal Model" />
              <div className="space-y-3">
                {[
                  { label: 'Zero Trust Internal', status: 'ACTIVE', icon: Shield, color: '#10b981' },
                  { label: 'Encryption at Rest', status: 'AES-256-GCM', icon: Lock, color: '#10b981' },
                  { label: 'Encryption in Transit', status: 'TLS 1.3', icon: Lock, color: '#10b981' },
                  { label: 'Token ID Rotation', status: 'Every 7 days', icon: Key, color: '#3b82f6' },
                  { label: 'MFA Enforcement', status: 'REQUIRED (Admin)', icon: Shield, color: '#f59e0b' },
                  { label: 'Rate Limiting', status: '1000 req/min', icon: Sliders, color: '#10b981' },
                  { label: 'Anti-Spam AI', status: 'Active · 97.4% precision', icon: Cpu, color: '#10b981' },
                ].map(item => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" style={{ color: item.color }} />
                        <span className="text-xs text-slate-400">{item.label}</span>
                      </div>
                      <span className="text-xs font-mono" style={{ color: item.color }}>{item.status}</span>
                    </div>
                  )
                })}
              </div>
            </Card>

            <Card>
              <SectionHeader title="RBAC + ABAC Model" subtitle="Role + Attribute Based Access Control" />
              <div className="space-y-2">
                {[
                  { role: 'AKIRAL_SUPER_ADMIN', perms: ['All tenants', 'Raw logs', 'Platform config'], color: '#ef4444' },
                  { role: 'AKIRAL_ANALYST', perms: ['Read-only', 'Analytics view', 'No export'], color: '#f59e0b' },
                  { role: 'CLIENT_ADMIN', perms: ['Full company access', 'User management', 'AI config'], color: '#6366f1' },
                  { role: 'CLIENT_SALES_MANAGER', perms: ['Lead management', 'Analytics view', 'AI chat'], color: '#3b82f6' },
                  { role: 'CLIENT_VIEWER', perms: ['Read-only', 'Dashboard only', 'No export'], color: '#64748b' },
                ].map(r => (
                  <div key={r.role} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-slate-300">{r.role.replace(/_/g, ' ')}</span>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {r.perms.map(p => (
                        <span key={p} className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] text-slate-500">{p}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-600 mt-3">
                ABAC attributes: plan tier · data volume · country (LGPD/GDPR) · industry
              </p>
            </Card>
          </div>
        )}

        {activeTab === 'Plans' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {(['BASIC', 'PRO', 'BUSINESS', 'SCALE', 'ENTERPRISE'] as PlanType[]).map(planType => {
                const plan = PLAN_CONFIGS[planType]
                const isActive = planType === currentCompany.plan
                return (
                  <Card
                    key={planType}
                    className={cn(isActive && 'border-violet-500/30')}
                    style={isActive ? { background: 'rgba(139,92,246,0.05)' } : undefined}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-bold" style={{ color: getPlanColor(planType) }}>{plan.displayName}</p>
                          {isActive && <span className="text-[10px] text-violet-400 bg-violet-500/10 border border-violet-500/20 px-1.5 py-0.5 rounded-full">Current</span>}
                        </div>
                        <p className="text-xs text-slate-500">{plan.tenantTier === 'ENTERPRISE_DEDICATED_DB' ? 'Dedicated DB' : 'Shared DB + RLS'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-white">${plan.monthlyMin}<span className="text-xs text-slate-600">/mo</span></p>
                        <p className="text-[10px] text-slate-600">Setup: ${plan.setupFeeMin}+</p>
                      </div>
                    </div>
                    <div className="space-y-1 mb-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">Interactions</span>
                        <span className="text-slate-400 font-mono">{plan.interactionQuota.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">Overage</span>
                        <span className="text-slate-400 font-mono">${plan.overagePerUnit}/unit</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">SLA Uptime</span>
                        <span className="text-emerald-400 font-mono">{plan.slaUptime}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">Rollover</span>
                        <span className="text-slate-400 font-mono">{plan.rolloverPercentage}% max</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {plan.features.slice(0, 4).map(f => (
                        <div key={f} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                          <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                          {f}
                        </div>
                      ))}
                      {plan.features.length > 4 && (
                        <p className="text-[10px] text-slate-600">+{plan.features.length - 4} more features</p>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'Compliance' && (
          <div className="space-y-4">
            <Card>
              <SectionHeader title="Privacy Regime" subtitle={`Active: ${currentCompany.privacyRegime}`} />
              <div className="grid grid-cols-2 gap-4">
                {[
                  { regime: 'LGPD', country: 'Brazil', status: currentCompany.privacyRegime === 'LGPD' ? 'ACTIVE' : 'N/A', color: '#10b981', article: 'Art. 7 — Legal Bases for Processing' },
                  { regime: 'GDPR', country: 'EU/EEA', status: 'AVAILABLE', color: '#3b82f6', article: 'Art. 6 — Lawfulness of Processing' },
                  { regime: 'CCPA', country: 'California', status: 'AVAILABLE', color: '#f59e0b', article: 'Sec. 1798.100 — Consumer Rights' },
                  { regime: 'DPA', country: 'Custom', status: 'ENTERPRISE', color: '#8b5cf6', article: 'Custom Data Processing Agreement' },
                ].map(r => (
                  <div key={r.regime} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold" style={{ color: r.color }}>{r.regime}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: `${r.color}12`, color: r.color, border: `1px solid ${r.color}20` }}>
                        {r.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{r.country}</p>
                    <p className="text-[10px] text-slate-700 mt-1">{r.article}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <SectionHeader title="Privacy-by-Design Principles" subtitle="Implemented across all data flows" />
              <div className="space-y-2">
                {[
                  { label: 'Data Minimization', desc: 'Only behavioral metadata collected. Zero PII required.', ok: true },
                  { label: 'Purpose Limitation', desc: 'Data used exclusively for lead intelligence. Not sold or shared.', ok: true },
                  { label: 'Storage Limitation', desc: '24mo active + 12mo archived + 7yr audit logs (WORM).', ok: true },
                  { label: 'Integrity & Confidentiality', desc: 'AES-256-GCM at rest, TLS 1.3 in transit, Zero Trust.', ok: true },
                  { label: 'Financial Data Prohibition', desc: 'Hard-coded policy: AKIRAL never receives monetary values.', ok: true },
                  { label: 'Right to Erasure', desc: 'Data deletion request flow available with audit trail.', ok: true },
                ].map(p => (
                  <div key={p.label} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="w-4 h-4 rounded bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-300">{p.label}</p>
                      <p className="text-[10px] text-slate-600 mt-0.5">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'Infrastructure' && (
          <div className="space-y-4">
            <Card>
              <SectionHeader title="Tenant Architecture" subtitle="Multi-tenant isolation model" />
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <div className="flex items-center gap-2 mb-3">
                    <Database className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-bold text-blue-400">SME_SHARED_DB</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-500">
                    <p>• PostgreSQL shared cluster</p>
                    <p>• Row-Level Security (RLS) enforced</p>
                    <p>• Primary Key namespaced per company</p>
                    <p>• Logical isolation · Company Isolation Layer</p>
                    <p>• Plans: BASIC, PRO, BUSINESS</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                  <div className="flex items-center gap-2 mb-3">
                    <Server className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-bold text-amber-400">ENTERPRISE_DEDICATED_DB</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-500">
                    <p>• Dedicated PostgreSQL instance</p>
                    <p>• Exclusive encryption keys per company</p>
                    <p>• Dedicated audit log database (WORM)</p>
                    <p>• Isolated backups · Custom retention</p>
                    <p>• Plans: SCALE, ENTERPRISE</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <SectionHeader title="Microservices Architecture" subtitle="Backend service mesh" />
              <div className="space-y-2">
                {[
                  { name: 'Auth Service', desc: 'JWT + MFA · Zero Trust · Token rotation', color: '#6366f1', status: 'Healthy' },
                  { name: 'Lead Intelligence Service', desc: 'Lifecycle engine · State machine · Tokenization', color: '#8b5cf6', status: 'Healthy' },
                  { name: 'Analytics Service', desc: 'API™ computation · Benchmark aggregation', color: '#3b82f6', status: 'Healthy' },
                  { name: 'AI Receptionist Service', desc: 'Token management · Quota enforcement · Spam filter', color: '#10b981', status: 'Healthy' },
                  { name: 'Audit Service', desc: 'WORM log chain · SHA-256 integrity · Immutable writes', color: '#f59e0b', status: 'Healthy' },
                  { name: 'Company Isolation Layer', desc: 'DB routing · RLS enforcement · Key management', color: '#ec4899', status: 'Healthy' },
                ].map(svc => (
                  <div key={svc.name} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: svc.color }} />
                      <div>
                        <p className="text-xs font-medium text-slate-300">{svc.name}</p>
                        <p className="text-[10px] text-slate-600">{svc.desc}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/8 px-2 py-0.5 rounded border border-emerald-500/15">{svc.status}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

      </div>
    </div>
  )
}
