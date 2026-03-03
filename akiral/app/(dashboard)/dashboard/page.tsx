'use client'

import React from 'react'
import Topbar from '@/components/layout/Topbar'
import { Card, CardHeader, CardTitle, CardValue, Badge, ProgressBar, StatDelta, Dot, SectionHeader } from '@/components/ui'
import { APIScoreChart, ConversionChart, GrowthChart, LeadStateDonut, AIInteractionsChart } from '@/components/charts'
import { useAppStore } from '@/lib/store/app-store'
import {
  MOCK_API_SCORES, MOCK_CONVERSION_METRICS, MOCK_GROWTH_METRICS,
  MOCK_ROI_INDEX, MOCK_QUOTA, LEAD_STATE_DISTRIBUTION,
  MOCK_AI_INTERACTIONS_DAILY, MOCK_AI_CONFIG
} from '@/lib/store/mock-data'
import { cn, formatPercent, formatHours, formatIndexedROI } from '@/lib/utils'
import {
  TrendingUp, Users, Zap, Bot, Shield, BarChart3,
  ArrowUpRight, Clock, Target, Activity, Lock, Award
} from 'lucide-react'
import { PLAN_CONFIGS } from '@/lib/types'

export default function DashboardPage() {
  const { currentCompany, leads } = useAppStore()
  const latestAPI = MOCK_API_SCORES[MOCK_API_SCORES.length - 1]
  const prevAPI = MOCK_API_SCORES[MOCK_API_SCORES.length - 2]
  const latestConv = MOCK_CONVERSION_METRICS[MOCK_CONVERSION_METRICS.length - 1]
  const latestGrowth = MOCK_GROWTH_METRICS[MOCK_GROWTH_METRICS.length - 1]
  const plan = PLAN_CONFIGS[currentCompany.plan]

  const quotaPercent = (MOCK_QUOTA.used / MOCK_QUOTA.quota) * 100
  const quotaColor = quotaPercent > 90 ? '#ef4444' : quotaPercent > 70 ? '#f59e0b' : '#10b981'

  const gradeColors: Record<string, string> = {
    S: '#6366f1', A: '#10b981', B: '#3b82f6', C: '#f59e0b', D: '#ef4444', F: '#dc2626'
  }

  return (
    <div className="page-enter">
      <Topbar
        title="Dashboard"
        subtitle={`${currentCompany.name} · ${currentCompany.privacyRegime} Compliant`}
      />

      <div className="p-6 space-y-6">

        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          {/* AKIRAL API™ Score */}
          <Card glow glowColor={gradeColors[latestAPI.grade]} className="col-span-1">
            <CardHeader>
              <CardTitle>API™ Score</CardTitle>
              <Award className="w-4 h-4 text-violet-400" />
            </CardHeader>
            <div className="flex items-end gap-3 mt-2">
              <CardValue className="gradient-text text-5xl">{latestAPI.totalScore}</CardValue>
              <div className="mb-1.5">
                <span
                  className="text-xl font-bold px-2 py-0.5 rounded-lg"
                  style={{ color: gradeColors[latestAPI.grade], backgroundColor: `${gradeColors[latestAPI.grade]}18` }}
                >
                  {latestAPI.grade}
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <StatDelta value={latestAPI.deltaFromLastPeriod} suffix=" pts" />
              <span className="text-xs text-slate-600">vs last month</span>
            </div>
            <ProgressBar value={latestAPI.totalScore} max={100} color={gradeColors[latestAPI.grade]} className="mt-3" height={4} />
            <div className="flex justify-between mt-1.5">
              <span className="text-[10px] text-slate-600">0</span>
              <span className="text-[10px] text-slate-500">
                Sector avg: <span className="text-slate-400">{latestAPI.sectorBenchmark}</span>
              </span>
              <span className="text-[10px] text-slate-600">100</span>
            </div>
          </Card>

          {/* Overall Conversion */}
          <Card>
            <CardHeader>
              <CardTitle>Overall Conv.</CardTitle>
              <Target className="w-4 h-4 text-emerald-400" />
            </CardHeader>
            <CardValue className="gradient-text-green text-4xl mt-2">
              {latestConv.overallConversion.toFixed(1)}%
            </CardValue>
            <div className="mt-3 flex items-center gap-2">
              <StatDelta value={latestConv.deltaOverallConversion} />
              <span className="text-xs text-slate-600">vs last month</span>
            </div>
            <div className="mt-3 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Cold → Active</span>
                <span className="text-slate-400 font-mono">{latestConv.coldToActivated.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Active → Engaged</span>
                <span className="text-slate-400 font-mono">{latestConv.activatedToEngaged.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Engaged → Conv.</span>
                <span className="text-slate-400 font-mono">{latestConv.engagedToMonetized.toFixed(1)}%</span>
              </div>
            </div>
          </Card>

          {/* Lead Growth */}
          <Card>
            <CardHeader>
              <CardTitle>Lead Growth</CardTitle>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </CardHeader>
            <CardValue className="text-blue-400 text-4xl mt-2">
              +{latestGrowth.growthRate.toFixed(1)}%
            </CardValue>
            <div className="mt-3 flex items-center gap-2">
              <Dot color="#3b82f6" pulse />
              <span className="text-xs text-slate-500">{latestGrowth.totalLeads} total leads</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                { label: 'New', value: latestGrowth.newLeads, color: '#10b981' },
                { label: 'Ret.', value: `${latestGrowth.retentionRate.toFixed(0)}%`, color: '#3b82f6' },
                { label: 'Churn', value: `${latestGrowth.churnRate.toFixed(1)}%`, color: '#ef4444' },
              ].map(m => (
                <div key={m.label} className="text-center p-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                  <p className="text-xs font-bold" style={{ color: m.color }}>{m.value}</p>
                  <p className="text-[10px] text-slate-600 mt-0.5">{m.label}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* ROI Index */}
          <Card glow glowColor="#f59e0b">
            <CardHeader>
              <CardTitle>ROI Index™</CardTitle>
              <Lock className="w-3.5 h-3.5 text-amber-400/60" />
            </CardHeader>
            <CardValue className="gradient-text-gold text-4xl mt-2">
              {formatIndexedROI(MOCK_ROI_INDEX.indexedROI)}
            </CardValue>
            <div className="mt-3 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Conv. Lift</span>
                <span className="text-emerald-400 font-mono">+{MOCK_ROI_INDEX.conversionLiftPercent.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Time-to-Conv.</span>
                <span className="text-emerald-400 font-mono">{MOCK_ROI_INDEX.timeToConversionDelta.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">AI Assist.</span>
                <span className="text-violet-400 font-mono">{MOCK_ROI_INDEX.aiAssistanceImpact.toFixed(1)}%</span>
              </div>
            </div>
            <p className="mt-3 text-[10px] text-slate-700 leading-relaxed">
              Privacy-by-Design · No financial data · LGPD Art. 7
            </p>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* API Score History */}
          <Card className="lg:col-span-2">
            <SectionHeader
              title="AKIRAL Performance Index™ History"
              subtitle="vs. anonymous sector benchmark"
              action={
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-violet-500 inline-block" /> Your score</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-indigo-400 border-dashed inline-block" style={{ borderTop: '1px dashed #818cf8' }} /> Sector avg</span>
                </div>
              }
            />
            <APIScoreChart data={MOCK_API_SCORES} />
          </Card>

          {/* Lead State Distribution */}
          <Card>
            <SectionHeader title="Lead Lifecycle" subtitle="Current distribution" />
            <LeadStateDonut data={LEAD_STATE_DISTRIBUTION} />
            <div className="space-y-1.5 mt-2">
              {LEAD_STATE_DISTRIBUTION.map(item => (
                <div key={item.state} className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{item.state}</span>
                  <div className="flex items-center gap-2">
                    <ProgressBar value={item.percentage} max={100} className="w-16" height={3} />
                    <span className="text-slate-400 font-mono w-8 text-right">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* AI Receptionist Activity */}
          <Card className="lg:col-span-2">
            <SectionHeader
              title="AI Receptionist Activity"
              subtitle="Last 14 days"
              action={
                <div className="flex items-center gap-1.5">
                  <Dot color="#10b981" pulse size={7} />
                  <span className="text-xs text-emerald-400 font-medium">{MOCK_AI_CONFIG.persona} · Active</span>
                </div>
              }
            />
            <AIInteractionsChart data={MOCK_AI_INTERACTIONS_DAILY} />

            {/* Quota */}
            <div className="mt-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-500">Monthly Quota: {plan.displayName}</span>
                <span className="text-xs font-mono text-slate-300">
                  {MOCK_QUOTA.used.toLocaleString()} / {MOCK_QUOTA.quota.toLocaleString()}
                </span>
              </div>
              <ProgressBar value={MOCK_QUOTA.used} max={MOCK_QUOTA.quota} color={quotaColor} height={6} />
              <div className="flex justify-between mt-1.5 text-[10px] text-slate-600">
                <span>{quotaPercent.toFixed(1)}% used</span>
                <span>Rollover: +{MOCK_QUOTA.rolloverFromPrior} from prior</span>
                <span>{MOCK_QUOTA.remaining.toLocaleString()} remaining</span>
              </div>
            </div>
          </Card>

          {/* Conversion Funnel */}
          <Card>
            <SectionHeader title="Funnel Velocity" subtitle="Avg. time between states" />
            <div className="space-y-3">
              {[
                { from: 'Cold', to: 'Activated', hours: 18, color: '#3b82f6', trend: +12 },
                { from: 'Activated', to: 'Engaged', hours: 36, color: '#8b5cf6', trend: +8 },
                { from: 'Engaged', to: 'Monetized', hours: 72, color: '#10b981', trend: +22 },
              ].map(step => (
                <div key={step.from} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-slate-400 font-medium">{step.from} → {step.to}</p>
                      <p className="text-lg font-bold font-mono mt-0.5" style={{ color: step.color }}>
                        {formatHours(step.hours)}
                      </p>
                    </div>
                    <StatDelta value={step.trend} suffix="%" />
                  </div>
                  <ProgressBar value={100 - (step.hours / 100) * 100} max={100} color={step.color} className="mt-2" height={3} />
                </div>
              ))}
            </div>

            {/* Privacy Disclaimer */}
            <div className="mt-4 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-2">
              <Shield className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-500 leading-relaxed">
                All metrics are relative. Zero financial data is stored or processed. Compliant with LGPD Art. 7 and GDPR Art. 6.
              </p>
            </div>
          </Card>
        </div>

        {/* Patent Notice Footer */}
        <div className="p-4 rounded-2xl border border-violet-500/10 bg-violet-500/5 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
            <Award className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-violet-300">
              AKIRAL Performance Index™ · Patent Pending
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              "Method and System for Privacy-Preserving Lead Intelligence, AI-Based Acquisition and Performance Benchmarking" —
              Computed via API-v2.2 · Sector benchmark uses anonymous aggregate data only · No cross-company comparison.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
