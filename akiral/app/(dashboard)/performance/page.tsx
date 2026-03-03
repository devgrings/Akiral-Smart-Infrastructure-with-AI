'use client'

import React, { useState } from 'react'
import Topbar from '@/components/layout/Topbar'
import { Card, SectionHeader, ProgressBar, Badge, Dot } from '@/components/ui'
import { useAppStore } from '@/lib/store/app-store'
import { MOCK_API_SCORES, MOCK_SECTOR_BENCHMARKS } from '@/lib/store/mock-data'
import { PLAN_CONFIGS } from '@/lib/types'
import { cn, getScoreGrade } from '@/lib/utils'
import { APIScoreRadar, APIScoreChart } from '@/components/charts'
import {
  Award, TrendingUp, Shield, Lock, Cpu, Star,
  ChevronRight, BarChart3, Zap, Globe
} from 'lucide-react'

export default function PerformancePage() {
  const { currentCompany } = useAppStore()
  const latestAPI = MOCK_API_SCORES[MOCK_API_SCORES.length - 1]
  const benchmark = MOCK_SECTOR_BENCHMARKS.find(b => b.sector === currentCompany.industry)

  const gradeColors: Record<string, string> = {
    S: '#6366f1', A: '#10b981', B: '#3b82f6', C: '#f59e0b', D: '#ef4444', F: '#dc2626'
  }
  const gradeLabels: Record<string, string> = {
    S: 'Exceptional', A: 'High Performance', B: 'Above Average', C: 'Developing', D: 'Below Average', F: 'Critical'
  }

  return (
    <div className="page-enter">
      <Topbar title="AKIRAL Performance Index™" subtitle="API™ · Patent Pending · v2.2" />

      <div className="p-6 space-y-6">

        {/* Hero Score */}
        <div className="relative rounded-2xl border border-violet-500/20 overflow-hidden p-6" style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(99,102,241,0.05) 100%)'
        }}>
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-6 h-6 text-violet-400" />
                <span className="text-sm font-semibold text-violet-300">AKIRAL Performance Index™</span>
                <span className="text-[10px] text-violet-500 font-medium px-2 py-0.5 bg-violet-500/10 border border-violet-500/20 rounded-full">Patent Pending</span>
              </div>
              <div className="flex items-end gap-4">
                <div>
                  <p className="text-8xl font-black font-mono" style={{ color: gradeColors[latestAPI.grade] }}>
                    {latestAPI.totalScore}
                  </p>
                  <p className="text-lg text-slate-400 font-medium">/ 100</p>
                </div>
                <div className="mb-4">
                  <div
                    className="text-4xl font-black px-4 py-2 rounded-xl"
                    style={{ color: gradeColors[latestAPI.grade], backgroundColor: `${gradeColors[latestAPI.grade]}15`, border: `1px solid ${gradeColors[latestAPI.grade]}25` }}
                  >
                    {latestAPI.grade}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 text-center">{gradeLabels[latestAPI.grade]}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-sm">
                  <span className="text-emerald-400 font-bold">+{latestAPI.deltaFromLastPeriod} pts</span>
                  <span className="text-slate-500">vs last month</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <span style={{ color: latestAPI.deltaFromBenchmark >= 0 ? '#10b981' : '#ef4444' }}>
                    {latestAPI.deltaFromBenchmark >= 0 ? '+' : ''}{latestAPI.deltaFromBenchmark} pts
                  </span>
                  <span className="text-slate-500">vs sector avg ({benchmark?.avgAPIScore || 64})</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:block w-64">
              <APIScoreRadar breakdown={latestAPI.breakdown} />
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Lead Growth', key: 'leadGrowthScore', icon: TrendingUp, color: '#3b82f6', desc: 'Acquisition velocity & volume' },
            { label: 'Conversion', key: 'conversionScore', icon: BarChart3, color: '#8b5cf6', desc: 'Funnel efficiency score' },
            { label: 'Response Velocity', key: 'responseVelocityScore', icon: Zap, color: '#10b981', desc: 'AI + human follow-up speed' },
            { label: 'Stability', key: 'monthlyStabilityScore', icon: Shield, color: '#f59e0b', desc: 'Consistency & variance' },
          ].map(item => {
            const Icon = item.icon
            const value = latestAPI.breakdown[item.key as keyof typeof latestAPI.breakdown]
            return (
              <Card key={item.label}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${item.color}15` }}>
                    <Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                  </div>
                  <span className="text-xs text-slate-500">{item.label}</span>
                </div>
                <div className="text-3xl font-black font-mono" style={{ color: item.color }}>{value}</div>
                <div className="text-xs text-slate-700 mt-0.5">/ 25 pts</div>
                <ProgressBar value={value} max={25} color={item.color} className="mt-3" height={4} />
                <p className="text-[10px] text-slate-600 mt-2">{item.desc}</p>
              </Card>
            )
          })}
        </div>

        {/* History Chart */}
        <Card>
          <SectionHeader
            title="Score Evolution"
            subtitle="7 months · API™ v2.1 → v2.2"
            action={
              <div className="text-[10px] text-slate-600">
                Algo version tracked for IP protection
              </div>
            }
          />
          <APIScoreChart data={MOCK_API_SCORES} />
        </Card>

        {/* Patent & Methodology */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="border-violet-500/15" style={{ background: 'rgba(139,92,246,0.04)' }}>
            <SectionHeader title="Patent Information" subtitle="Intellectual Property Protection" />
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <p className="text-xs font-semibold text-violet-300 mb-2">Method Title</p>
                <p className="text-xs text-slate-400 italic">
                  "Method and System for Privacy-Preserving Lead Intelligence, AI-Based Acquisition and Performance Benchmarking"
                </p>
              </div>
              <div className="space-y-2">
                {[
                  'Hybrid multi-tenant data isolation (SME + Enterprise)',
                  'ROI computation via indexed metadata (no financial data)',
                  'Lead performance index via behavioral metadata only',
                  'Automated anonymous sector benchmarking',
                ].map((claim, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <span className="w-4 h-4 rounded bg-violet-500/10 flex items-center justify-center text-violet-400 flex-shrink-0 text-[10px] font-bold">{i + 1}</span>
                    <span className="text-slate-400">{claim}</span>
                  </div>
                ))}
              </div>
              <div className="p-2 rounded-lg bg-violet-500/5 border border-violet-500/10">
                <p className="text-[10px] text-violet-400">Status: Patent Pending · Filed 2025 · Jurisdiction: Brazil + PCT</p>
              </div>
            </div>
          </Card>

          <Card>
            <SectionHeader title="Algorithm Methodology" subtitle="API™ v2.2 Computation" />
            <div className="space-y-2">
              {[
                { step: '01', label: 'Data Collection', desc: 'Behavioral metadata only — no PII, no financial data', color: '#3b82f6' },
                { step: '02', label: 'Normalization', desc: 'Rolling 30-day windows, seasonal adjustment', color: '#8b5cf6' },
                { step: '03', label: 'Component Scoring', desc: '4 dimensions × 25pts each = 100pt scale', color: '#10b981' },
                { step: '04', label: 'Sector Calibration', desc: 'Anonymous benchmark comparison only', color: '#f59e0b' },
                { step: '05', label: 'Grade Assignment', desc: 'S/A/B/C/D/F scale with trend tracking', color: '#6366f1' },
              ].map(s => (
                <div key={s.step} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/[0.02] transition-colors">
                  <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: `${s.color}15`, color: s.color }}>{s.step}</span>
                  <div>
                    <p className="text-xs font-medium text-slate-300">{s.label}</p>
                    <p className="text-[10px] text-slate-600">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <p className="text-[10px] text-slate-600">
                Algorithm version <strong className="text-slate-500">API-v2.2</strong> is logged on every computation for IP traceability.
                Previous: v2.1. All versions archived immutably.
              </p>
            </div>
          </Card>
        </div>

      </div>
    </div>
  )
}
