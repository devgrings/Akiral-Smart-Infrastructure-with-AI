'use client'

import React, { useState } from 'react'
import Topbar from '@/components/layout/Topbar'
import { Card, SectionHeader, Badge } from '@/components/ui'
import { MOCK_AUDIT_LOGS } from '@/lib/store/mock-data'
import { cn, formatDateTime, relativeTime } from '@/lib/utils'
import { AuditAction } from '@/lib/types'
import { Shield, Lock, FileText, AlertTriangle, Download, Filter, Hash, Eye } from 'lucide-react'

const ACTION_COLORS: Record<AuditAction, string> = {
  LOGIN: '#10b981',
  LOGOUT: '#64748b',
  DATA_ACCESS: '#3b82f6',
  DATA_EXPORT: '#f59e0b',
  LEAD_CREATED: '#8b5cf6',
  LEAD_UPDATED: '#6366f1',
  LEAD_DELETED: '#ef4444',
  AI_INTERACTION_STARTED: '#8b5cf6',
  AI_INTERACTION_ENDED: '#6366f1',
  SETTINGS_CHANGED: '#f59e0b',
  USER_INVITED: '#10b981',
  USER_REMOVED: '#ef4444',
  PLAN_CHANGED: '#fbbf24',
  COMPLIANCE_REPORT_GENERATED: '#10b981',
  DATA_DELETION_REQUESTED: '#ef4444',
}

const ACTION_ICONS: Partial<Record<AuditAction, React.ReactNode>> = {
  LOGIN: <Shield className="w-3.5 h-3.5" />,
  DATA_ACCESS: <Eye className="w-3.5 h-3.5" />,
  DATA_EXPORT: <Download className="w-3.5 h-3.5" />,
  SETTINGS_CHANGED: <AlertTriangle className="w-3.5 h-3.5" />,
  COMPLIANCE_REPORT_GENERATED: <FileText className="w-3.5 h-3.5" />,
}

export default function AuditPage() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="page-enter">
      <Topbar
        title="Audit Trail"
        subtitle="WORM · Immutable · SHA-256 chain integrity"
      >
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300 hover:bg-white/[0.08] transition-colors">
          <Download className="w-3.5 h-3.5" />
          Export (PDF/JSON)
        </button>
      </Topbar>

      <div className="p-6 space-y-6">

        {/* WORM Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {[
            { icon: Lock, label: 'Storage Mode', value: 'WORM', sub: 'Write Once Read Many', color: '#10b981' },
            { icon: Hash, label: 'Integrity', value: 'SHA-256', sub: 'Chained hash · Tamper-evident', color: '#6366f1' },
            { icon: FileText, label: 'Retention', value: '7 Years', sub: 'LGPD / GDPR requirement', color: '#3b82f6' },
            { icon: Shield, label: 'Compliance', value: 'ISO 27001', sub: 'SOC 2 Type II compatible', color: '#f59e0b' },
          ].map(item => {
            const Icon = item.icon
            return (
              <Card key={item.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${item.color}12`, border: `1px solid ${item.color}25` }}>
                  <Icon className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-600">{item.label}</p>
                  <p className="text-sm font-bold text-white">{item.value}</p>
                  <p className="text-[10px] text-slate-600">{item.sub}</p>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Log Table */}
        <Card>
          <SectionHeader
            title="Immutable Audit Log"
            subtitle={`${MOCK_AUDIT_LOGS.length} entries · All actions cryptographically signed`}
            action={
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <Lock className="w-3 h-3" />
                <span>Chain verified</span>
              </div>
            }
          />

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/[0.05]">
                  {['Timestamp', 'Action', 'Resource', 'User / Role', 'IP Address', 'Hash', 'Chain'].map(h => (
                    <th key={h} className="text-left text-slate-600 py-2 pr-4 font-medium pb-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_AUDIT_LOGS.map(log => (
                  <tr
                    key={log.id}
                    className={cn(
                      'border-b border-white/[0.03] hover:bg-white/[0.02] cursor-pointer transition-colors',
                      selected === log.id && 'bg-violet-500/5'
                    )}
                    onClick={() => setSelected(selected === log.id ? null : log.id)}
                  >
                    <td className="py-3 pr-4">
                      <p className="font-mono text-slate-300">{formatDateTime(log.timestamp)}</p>
                      <p className="text-[10px] text-slate-600">{relativeTime(log.timestamp)}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-1.5" style={{ color: ACTION_COLORS[log.action] || '#94a3b8' }}>
                        {ACTION_ICONS[log.action] || <Shield className="w-3.5 h-3.5" />}
                        <span className="font-medium">{log.action.replace(/_/g, ' ')}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <p className="text-slate-400">{log.resourceType}</p>
                      <p className="text-[10px] font-mono text-slate-600">{log.resourceId}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <p className="text-slate-400">{log.userId.slice(0, 12)}...</p>
                      <p className="text-[10px] text-slate-600">{log.userRole.replace(/_/g, ' ')}</p>
                    </td>
                    <td className="py-3 pr-4 font-mono text-slate-500">{log.ipAddress}</td>
                    <td className="py-3 pr-4 font-mono text-slate-700">{log.hash.slice(0, 16)}...</td>
                    <td className="py-3 pr-4">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="text-[10px]">OK</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Expanded Detail */}
          {selected && (() => {
            const log = MOCK_AUDIT_LOGS.find(l => l.id === selected)!
            return (
              <div className="mt-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <p className="text-xs font-semibold text-slate-300 mb-3">Entry Detail — {log.id}</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-slate-600 mb-0.5">Current Hash (SHA-256)</p>
                    <p className="font-mono text-slate-400 break-all">{log.hash}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 mb-0.5">Previous Hash (Chain Link)</p>
                    <p className="font-mono text-slate-400 break-all">{log.previousHash}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 mb-0.5">User Agent</p>
                    <p className="text-slate-400">{log.userAgent}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 mb-0.5">Metadata</p>
                    <p className="font-mono text-slate-400 text-[11px]">{JSON.stringify(log.metadata)}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-emerald-400">
                  <Shield className="w-3.5 h-3.5" />
                  WORM · immutable: true · Tampering detected: NO
                </div>
              </div>
            )
          })()}
        </Card>

        {/* LGPD/GDPR Compliance Export */}
        <Card>
          <SectionHeader title="Compliance Report Generator" subtitle="On-demand reports for LGPD / GDPR auditors" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {[
              { title: 'LGPD Activity Report', sub: 'Art. 37 — Record of processing activities', color: '#10b981', badge: 'LGPD' },
              { title: 'GDPR Data Access Log', sub: 'Art. 30 — Records of processing activities', color: '#3b82f6', badge: 'GDPR' },
              { title: 'Full Audit Export', sub: 'ISO 27001 · SOC 2 format · PDF/JSON', color: '#6366f1', badge: 'ISO' },
            ].map(r => (
              <div key={r.title} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] cursor-pointer transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="text-[10px] font-bold px-2 py-0.5 rounded"
                    style={{ backgroundColor: `${r.color}15`, color: r.color, border: `1px solid ${r.color}25` }}
                  >
                    {r.badge}
                  </div>
                  <Download className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                </div>
                <p className="text-sm font-medium text-slate-300">{r.title}</p>
                <p className="text-[10px] text-slate-600 mt-1">{r.sub}</p>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  )
}
