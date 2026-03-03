'use client'

import React, { useState } from 'react'
import Topbar from '@/components/layout/Topbar'
import { Card, Badge, ProgressBar, SectionHeader, StatDelta, Dot } from '@/components/ui'
import { useAppStore } from '@/lib/store/app-store'
import { MOCK_LEADS, LEAD_STATE_DISTRIBUTION } from '@/lib/store/mock-data'
import { cn, getLifecycleColor, getLifecycleLabel, formatHours, relativeTime, formatPercent } from '@/lib/utils'
import { LeadLifecycleState, Lead } from '@/lib/types'
import { Users, Filter, Search, Clock, Zap, AlertTriangle, RefreshCw, ArrowRight } from 'lucide-react'

const STATE_FILTERS: Array<{ state: LeadLifecycleState | 'ALL'; label: string }> = [
  { state: 'ALL', label: 'All Leads' },
  { state: 'COLD', label: 'Cold' },
  { state: 'ACTIVATED', label: 'Activated' },
  { state: 'ENGAGED', label: 'Engaged' },
  { state: 'MONETIZED', label: 'Monetized' },
  { state: 'DORMANT', label: 'Dormant' },
]

function LeadStateChip({ state }: { state: LeadLifecycleState }) {
  const stateClass: Record<LeadLifecycleState, string> = {
    COLD: 'state-cold', ACTIVATED: 'state-activated', ENGAGED: 'state-engaged',
    MONETIZED: 'state-monetized', DORMANT: 'state-dormant',
  }
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border',
      stateClass[state]
    )}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getLifecycleColor(state) }} />
      {getLifecycleLabel(state)}
    </span>
  )
}

function LeadCard({ lead }: { lead: Lead }) {
  const degradationColor = lead.degradationRisk > 70 ? '#ef4444' : lead.degradationRisk > 40 ? '#f59e0b' : '#10b981'

  return (
    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.04] transition-all group cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
            style={{ backgroundColor: `${getLifecycleColor(lead.currentState)}20`, border: `1px solid ${getLifecycleColor(lead.currentState)}30` }}
          >
            {lead.tokenizedId.slice(4, 6)}
          </div>
          <div>
            <p className="text-xs font-mono text-slate-400">{lead.tokenizedId}</p>
            <p className="text-[10px] text-slate-600 mt-0.5">via {lead.source.replace('_', ' ')}</p>
          </div>
        </div>
        <LeadStateChip state={lead.currentState} />
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center p-1.5 rounded-lg bg-white/[0.02]">
          <p className="text-xs font-bold text-white">{lead.interactionCount}</p>
          <p className="text-[10px] text-slate-600">Interactions</p>
        </div>
        <div className="text-center p-1.5 rounded-lg bg-white/[0.02]">
          <p className="text-xs font-bold text-blue-400">{lead.responseVelocityScore}</p>
          <p className="text-[10px] text-slate-600">Velocity</p>
        </div>
        <div className="text-center p-1.5 rounded-lg bg-white/[0.02]">
          <p className="text-xs font-bold text-violet-400">{lead.engagementScore}</p>
          <p className="text-[10px] text-slate-600">Engagement</p>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-600 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Degradation Risk
          </span>
          <span className="font-mono" style={{ color: degradationColor }}>{lead.degradationRisk}%</span>
        </div>
        <ProgressBar value={lead.degradationRisk} max={100} color={degradationColor} height={3} />
      </div>

      <div className="mt-3 flex items-center justify-between text-[10px] text-slate-600">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatHours(lead.timeInCurrentState)} in state
        </span>
        <span>{relativeTime(lead.lastInteractionAt)}</span>
      </div>
    </div>
  )
}

export default function LeadsPage() {
  const { leads, currentCompany } = useAppStore()
  const [filter, setFilter] = useState<LeadLifecycleState | 'ALL'>('ALL')
  const [search, setSearch] = useState('')

  const filtered = leads.filter(l => {
    if (filter !== 'ALL' && l.currentState !== filter) return false
    if (search && !l.tokenizedId.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="page-enter">
      <Topbar
        title="Lead Intelligence"
        subtitle="Lifecycle tracking · Privacy-preserved identifiers"
      >
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-violet-500/5 border border-violet-500/10 px-3 py-1.5 rounded-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
          IDs tokenized · LGPD compliant
        </div>
      </Topbar>

      <div className="p-6 space-y-6">

        {/* Lifecycle Overview */}
        <div className="grid grid-cols-5 gap-3">
          {LEAD_STATE_DISTRIBUTION.map(item => (
            <Card
              key={item.state}
              className={cn(
                'cursor-pointer transition-all',
                filter === item.state && 'border-opacity-50'
              )}
              style={{
                borderColor: filter === item.state ? `${getLifecycleColor(item.state as LeadLifecycleState)}40` : undefined
              }}
              onClick={() => setFilter(item.state as LeadLifecycleState)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500">{getLifecycleLabel(item.state as LeadLifecycleState)}</span>
                <Dot color={getLifecycleColor(item.state as LeadLifecycleState)} size={6} />
              </div>
              <p className="text-2xl font-bold font-mono text-white">{item.count}</p>
              <ProgressBar value={item.percentage} max={100} color={getLifecycleColor(item.state as LeadLifecycleState)} className="mt-2" height={3} />
              <p className="text-[10px] text-slate-600 mt-1">{item.percentage}% of total</p>
            </Card>
          ))}
        </div>

        {/* Lifecycle Flow */}
        <Card>
          <SectionHeader title="Lead Lifecycle Flow" subtitle="Average transition velocity" />
          <div className="flex items-center justify-between">
            {(['COLD', 'ACTIVATED', 'ENGAGED', 'MONETIZED', 'DORMANT'] as LeadLifecycleState[]).map((state, i, arr) => (
              <React.Fragment key={state}>
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold"
                    style={{
                      backgroundColor: `${getLifecycleColor(state)}15`,
                      border: `1px solid ${getLifecycleColor(state)}30`,
                      color: getLifecycleColor(state)
                    }}
                  >
                    {LEAD_STATE_DISTRIBUTION.find(d => d.state === state)?.count || 0}
                  </div>
                  <span className="text-[10px] text-slate-500">{getLifecycleLabel(state)}</span>
                </div>
                {i < arr.length - 1 && (
                  <div className="flex flex-col items-center gap-1 flex-1 px-2">
                    <ArrowRight className="w-4 h-4 text-slate-700" />
                    <span className="text-[10px] text-slate-700">~{[18, 36, 72, 48][i]}h avg</span>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </Card>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            {STATE_FILTERS.map(f => (
              <button
                key={f.state}
                onClick={() => setFilter(f.state)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  filter === f.state
                    ? 'bg-white/[0.08] text-white'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'
                )}
              >
                {f.label}
                <span className="ml-1.5 opacity-60 font-mono text-[10px]">
                  {f.state === 'ALL' ? leads.length : leads.filter(l => l.currentState === f.state).length}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.05] flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-600" />
            <input
              className="bg-transparent text-xs text-white placeholder-slate-600 outline-none flex-1"
              placeholder="Search by token ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="ml-auto text-xs text-slate-600">
            {filtered.length} leads
          </div>
        </div>

        {/* Lead Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map(lead => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>

        {/* Privacy Footer */}
        <div className="p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/5 flex items-start gap-3">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
            <span className="text-emerald-400 text-xs">⚙</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-emerald-400">Company Isolation Layer Active</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              All lead data is isolated by {currentCompany.tenantTier === 'ENTERPRISE_DEDICATED_DB' ? 'dedicated database per enterprise' : 'Row-Level Security (RLS) in shared DB'}.
              Lead IDs are tokenized via HMAC-SHA256 rotating keys. No PII stored.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
