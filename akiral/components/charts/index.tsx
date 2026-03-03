'use client'

import React from 'react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie, Legend
} from 'recharts'
import { cn } from '@/lib/utils'

// Custom Tooltip
function CustomTooltip({ active, payload, label, valueFormatter }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#0f1117] border border-white/10 rounded-xl p-3 shadow-xl text-sm">
      <p className="text-slate-400 text-xs mb-2">{label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
          <span className="text-slate-400 text-xs">{entry.name}:</span>
          <span className="text-white font-mono text-xs font-medium">
            {valueFormatter ? valueFormatter(entry.value) : entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}

// ── API Score History Chart ───────────────────────────────────
interface APIScoreChartProps {
  data: Array<{ period: string; totalScore: number; sectorBenchmark: number }>
  className?: string
}

export function APIScoreChart({ data, className }: APIScoreChartProps) {
  const formatted = data.map(d => ({
    ...d,
    period: d.period.slice(2).replace('-', '/'),
  }))

  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={formatted} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
          <defs>
            <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="benchGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.1} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
          <XAxis dataKey="period" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="sectorBenchmark" name="Sector Avg" stroke="#6366f1" strokeWidth={1.5} strokeDasharray="4 4" fill="url(#benchGrad)" />
          <Area type="monotone" dataKey="totalScore" name="API™ Score" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#scoreGrad)" dot={{ fill: '#8b5cf6', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: '#8b5cf6' }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── Conversion Funnel Chart ───────────────────────────────────
interface ConversionChartProps {
  data: Array<{ period: string; coldToActivated: number; activatedToEngaged: number; engagedToMonetized: number; overallConversion: number }>
  className?: string
}

export function ConversionChart({ data, className }: ConversionChartProps) {
  const formatted = data.map(d => ({
    ...d,
    period: d.period.slice(2).replace('-', '/'),
  }))

  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={formatted} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
          <XAxis dataKey="period" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
          <Tooltip content={<CustomTooltip valueFormatter={(v: number) => `${v.toFixed(1)}%`} />} />
          <Line type="monotone" dataKey="coldToActivated" name="Cold→Active" stroke="#3b82f6" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="activatedToEngaged" name="Active→Engaged" stroke="#8b5cf6" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="engagedToMonetized" name="Engaged→Conv." stroke="#10b981" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="overallConversion" name="Overall" stroke="#f59e0b" strokeWidth={2.5} strokeDasharray="0" dot={{ r: 4, fill: '#f59e0b' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── Growth Chart ──────────────────────────────────────────────
interface GrowthChartProps {
  data: Array<{ period: string; totalLeads: number; newLeads: number; growthRate: number }>
  className?: string
}

export function GrowthChart({ data, className }: GrowthChartProps) {
  const formatted = data.map(d => ({
    ...d,
    period: d.period.slice(2).replace('-', '/'),
  }))

  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={formatted} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.6} />
            </linearGradient>
            <linearGradient id="newGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.4} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
          <XAxis dataKey="period" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="totalLeads" name="Total Leads" fill="url(#barGrad)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="newLeads" name="New Leads" fill="url(#newGrad)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── Lead State Donut ──────────────────────────────────────────
interface LeadStateDonutProps {
  data: Array<{ state: string; count: number; percentage: number }>
  className?: string
}

const STATE_COLORS: Record<string, string> = {
  COLD: '#64748b', ACTIVATED: '#3b82f6', ENGAGED: '#8b5cf6', MONETIZED: '#10b981', DORMANT: '#f59e0b'
}
const STATE_LABELS: Record<string, string> = {
  COLD: 'Cold', ACTIVATED: 'Activated', ENGAGED: 'Engaged', MONETIZED: 'Monetized', DORMANT: 'Dormant'
}

export function LeadStateDonut({ data, className }: LeadStateDonutProps) {
  const chartData = data.map(d => ({ name: STATE_LABELS[d.state] || d.state, value: d.count, color: STATE_COLORS[d.state] || '#6366f1' }))

  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => <span style={{ color: '#94a3b8', fontSize: 11 }}>{value}</span>}
            iconType="circle"
            iconSize={8}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── AI Interactions Bar ───────────────────────────────────────
interface AIInteractionsChartProps {
  data: Array<{ date: string; interactions: number; qualified: number; spam: number }>
  className?: string
}

export function AIInteractionsChart({ data, className }: AIInteractionsChartProps) {
  const formatted = data.slice(-14).map(d => ({
    ...d,
    date: d.date.slice(5),
  }))

  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={formatted} margin={{ top: 5, right: 5, bottom: 5, left: -20 }} barSize={8}>
          <defs>
            <linearGradient id="intGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff06" />
          <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="interactions" name="Interactions" fill="url(#intGrad)" radius={[2, 2, 0, 0]} />
          <Bar dataKey="qualified" name="Qualified" fill="#10b981" radius={[2, 2, 0, 0]} fillOpacity={0.7} />
          <Bar dataKey="spam" name="Spam" fill="#ef4444" radius={[2, 2, 0, 0]} fillOpacity={0.5} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── API Score Radar ───────────────────────────────────────────
interface APIScoreRadarProps {
  breakdown: {
    leadGrowthScore: number
    conversionScore: number
    responseVelocityScore: number
    monthlyStabilityScore: number
  }
  className?: string
}

export function APIScoreRadar({ breakdown, className }: APIScoreRadarProps) {
  const data = [
    { subject: 'Lead Growth', value: breakdown.leadGrowthScore, fullMark: 25 },
    { subject: 'Conversion', value: breakdown.conversionScore, fullMark: 25 },
    { subject: 'Response', value: breakdown.responseVelocityScore, fullMark: 25 },
    { subject: 'Stability', value: breakdown.monthlyStabilityScore, fullMark: 25 },
  ]

  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={200}>
        <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
          <PolarGrid stroke="#ffffff0a" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
          <Radar name="Score" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15} strokeWidth={2} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
