'use client'

import React, { useState } from 'react'
import Topbar from '@/components/layout/Topbar'
import { Card, SectionHeader, StatDelta, Badge } from '@/components/ui'
import {
  APIScoreChart, ConversionChart, GrowthChart,
  APIScoreRadar
} from '@/components/charts'
import {
  MOCK_API_SCORES, MOCK_CONVERSION_METRICS, MOCK_GROWTH_METRICS,
  MOCK_ROI_INDEX, MOCK_SECTOR_BENCHMARKS
} from '@/lib/store/mock-data'
import { cn } from '@/lib/utils'
import { BarChart3, TrendingUp, Shield, Lock, Award, Info } from 'lucide-react'

const PERIODS = ['2025-09','2025-10','2025-11','2025-12','2026-01','2026-02','2026-03']

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('2026-03')
  const latestAPI = MOCK_API_SCORES[MOCK_API_SCORES.length - 1]
  const latestConv = MOCK_CONVERSION_METRICS.find(m => m.period === selectedPeriod) || MOCK_CONVERSION_METRICS[MOCK_CONVERSION_METRICS.length - 1]
  const latestGrowth = MOCK_GROWTH_METRICS.find(m => m.period === selectedPeriod) || MOCK_GROWTH_METRICS[MOCK_GROWTH_METRICS.length - 1]

  return (
    <div className="page-enter">
      <Topbar title="Analytics & ROI Index" subtitle="Privacy-first · Indexed metrics · No financial data" />

      <div className="p-6 space-y-6">

        {/* Privacy Banner */}
        <div className="p-4 rounded-2xl border border-amber-500/15 bg-amber-500/5 flex items-center gap-3">
          <Lock className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-semibold text-amber-300">Privacy-by-Design Analytics</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              AKIRAL never receives, stores, or processes absolute financial values.
              All ROI metrics are <strong className="text-slate-400">indexed</strong> (relative to baseline).
              Compliant with LGPD Art. 7 and GDPR Art. 5(1)(b).
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-amber-400">INDEXED ROI</p>
            <p className="text-2xl font-bold font-mono text-white">{MOCK_ROI_INDEX.indexedROI.toFixed(1)}x</p>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.05] w-fit">
          {PERIODS.map(p => (
            <button
              key={p}
              onClick={() => setSelectedPeriod(p)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                selectedPeriod === p
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'
              )}
            >
              {p.slice(2).replace('-', '/')}
            </button>
          ))}
        </div>

        {/* ROI Index Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Conversion Lift', value: `+${MOCK_ROI_INDEX.conversionLiftPercent.toFixed(1)}%`, sub: 'vs. pre-Akiral baseline', color: '#10b981' },
            { label: 'Time-to-Conversion', value: `${MOCK_ROI_INDEX.timeToConversionDelta.toFixed(1)}%`, sub: 'faster than baseline', color: '#3b82f6' },
            { label: 'Lead Quality Index', value: `+${MOCK_ROI_INDEX.leadQualityIndexDelta.toFixed(1)}%`, sub: 'engagement quality delta', color: '#8b5cf6' },
            { label: 'AI Assist. Impact', value: `${MOCK_ROI_INDEX.aiAssistanceImpact.toFixed(1)}%`, sub: 'of conv. AI-assisted', color: '#f59e0b' },
          ].map(metric => (
            <Card key={metric.label}>
              <p className="text-xs text-slate-500 mb-2">{metric.label}</p>
              <p className="text-3xl font-bold font-mono" style={{ color: metric.color }}>{metric.value}</p>
              <p className="text-[10px] text-slate-600 mt-2">{metric.sub}</p>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <SectionHeader title="Conversion Funnel Over Time" subtitle="Lifecycle transition rates (%)" />
            <ConversionChart data={MOCK_CONVERSION_METRICS} />
          </Card>

          <Card>
            <SectionHeader title="Lead Volume Growth" subtitle="Total and new leads by month" />
            <GrowthChart data={MOCK_GROWTH_METRICS} />
          </Card>
        </div>

        {/* API Score + Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <SectionHeader
              title="AKIRAL Performance Index™ Trend"
              subtitle="Your score vs. anonymous sector benchmark"
            />
            <APIScoreChart data={MOCK_API_SCORES} />

            {/* Score history table */}
            <div className="mt-4 space-y-1">
              <div className="grid grid-cols-6 text-[10px] text-slate-600 px-2 pb-1 border-b border-white/[0.05]">
                <span>Period</span>
                <span className="text-center">Score</span>
                <span className="text-center">Grade</span>
                <span className="text-center">Sector</span>
                <span className="text-center">Δ Period</span>
                <span className="text-center">Trend</span>
              </div>
              {[...MOCK_API_SCORES].reverse().map(score => {
                const gradeColors: Record<string,string> = { S:'#6366f1', A:'#10b981', B:'#3b82f6', C:'#f59e0b', D:'#ef4444', F:'#dc2626' }
                const trendColors: Record<string,string> = { IMPROVING:'#10b981', STABLE:'#f59e0b', DECLINING:'#ef4444' }
                return (
                  <div key={score.period} className="grid grid-cols-6 text-xs px-2 py-1.5 rounded-lg hover:bg-white/[0.02]">
                    <span className="text-slate-400 font-mono">{score.period.slice(2).replace('-', '/')}</span>
                    <span className="text-center font-bold font-mono text-white">{score.totalScore}</span>
                    <span className="text-center font-bold" style={{ color: gradeColors[score.grade] }}>{score.grade}</span>
                    <span className="text-center text-slate-500 font-mono">{score.sectorBenchmark}</span>
                    <span className="text-center">
                      <StatDelta value={score.deltaFromLastPeriod} suffix=" pts" />
                    </span>
                    <span className="text-center text-[10px]" style={{ color: trendColors[score.trend] }}>
                      {score.trend === 'IMPROVING' ? '↑' : score.trend === 'DECLINING' ? '↓' : '→'} {score.trend}
                    </span>
                  </div>
                )
              })}
            </div>
          </Card>

          <Card>
            <SectionHeader title="Score Breakdown" subtitle="Current period radar" />
            <APIScoreRadar breakdown={latestAPI.breakdown} />
            <div className="space-y-2 mt-2">
              {[
                { label: 'Lead Growth', value: latestAPI.breakdown.leadGrowthScore, max: 25, color: '#3b82f6' },
                { label: 'Conversion', value: latestAPI.breakdown.conversionScore, max: 25, color: '#8b5cf6' },
                { label: 'Response Velocity', value: latestAPI.breakdown.responseVelocityScore, max: 25, color: '#10b981' },
                { label: 'Stability', value: latestAPI.breakdown.monthlyStabilityScore, max: 25, color: '#f59e0b' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">{item.label}</span>
                    <span className="font-mono" style={{ color: item.color }}>{item.value}/{item.max}</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${(item.value / item.max) * 100}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <p className="text-[10px] text-slate-500 leading-relaxed">
                API™ v2.2 · Patent Pending<br />
                Algorithm version tracked for patent traceability.<br />
                Sector benchmarks: anonymous aggregate only.
              </p>
            </div>
          </Card>
        </div>

        {/* Sector Benchmarks */}
        <Card>
          <SectionHeader
            title="Anonymous Sector Benchmarks"
            subtitle="Your sector performance relative to industry peers (no individual company data)"
            action={
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Shield className="w-3.5 h-3.5" />
                <span>Anonymized · {MOCK_SECTOR_BENCHMARKS[0].sampleSize}+ companies</span>
              </div>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/[0.05]">
                  {['Sector', 'Avg API™ Score', 'Avg Conv. Rate', 'Avg Response', 'Avg Growth', 'Sample Size'].map(h => (
                    <th key={h} className="text-left text-slate-600 py-2 pr-4 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_SECTOR_BENCHMARKS.map(bench => (
                  <tr key={bench.sector} className={cn(
                    'border-b border-white/[0.03] hover:bg-white/[0.02]',
                    bench.sector === 'TECHNOLOGY' && 'bg-violet-500/5'
                  )}>
                    <td className="py-2 pr-4 font-medium text-slate-300">
                      {bench.sector}
                      {bench.sector === 'TECHNOLOGY' && <span className="ml-2 text-[10px] text-violet-400">← Your sector</span>}
                    </td>
                    <td className="py-2 pr-4 font-mono text-white">{bench.avgAPIScore}</td>
                    <td className="py-2 pr-4 font-mono text-emerald-400">{bench.avgConversionRate.toFixed(1)}%</td>
                    <td className="py-2 pr-4 font-mono text-blue-400">{bench.avgResponseVelocity}</td>
                    <td className="py-2 pr-4 font-mono text-violet-400">+{bench.avgLeadGrowth.toFixed(1)}%</td>
                    <td className="py-2 pr-4 text-slate-500">{bench.sampleSize.toLocaleString()} cos.</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[10px] text-slate-700 border-t border-white/[0.04] pt-3">
            ⚠ Benchmarks represent anonymized aggregate data. No individual company identification is possible. Zero cross-company comparison.
            AKIRAL Performance Index™ — Patent Pending. Period: {MOCK_SECTOR_BENCHMARKS[0].period}
          </p>
        </Card>

      </div>
    </div>
  )
}
