import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { LeadLifecycleState, APIScoreGrade, PlanType } from '@/lib/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`
}

export function formatDelta(value: number, decimals = 1): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}`
}

export function getLifecycleColor(state: LeadLifecycleState): string {
  const map: Record<LeadLifecycleState, string> = {
    COLD:       '#64748b',
    ACTIVATED:  '#3b82f6',
    ENGAGED:    '#8b5cf6',
    MONETIZED:  '#10b981',
    DORMANT:    '#f59e0b',
  }
  return map[state]
}

export function getLifecycleLabel(state: LeadLifecycleState): string {
  const map: Record<LeadLifecycleState, string> = {
    COLD:       'Cold',
    ACTIVATED:  'Activated',
    ENGAGED:    'Engaged',
    MONETIZED:  'Monetized',
    DORMANT:    'Dormant',
  }
  return map[state]
}

export function getGradeColor(grade: APIScoreGrade): string {
  const map: Record<APIScoreGrade, string> = {
    S: '#6366f1',
    A: '#10b981',
    B: '#3b82f6',
    C: '#f59e0b',
    D: '#ef4444',
    F: '#dc2626',
  }
  return map[grade]
}

export function getScoreGrade(score: number): APIScoreGrade {
  if (score >= 90) return 'S'
  if (score >= 80) return 'A'
  if (score >= 65) return 'B'
  if (score >= 50) return 'C'
  if (score >= 35) return 'D'
  return 'F'
}

export function getPlanColor(plan: PlanType): string {
  const map: Record<PlanType, string> = {
    BASIC:      '#64748b',
    PRO:        '#3b82f6',
    BUSINESS:   '#8b5cf6',
    SCALE:      '#ec4899',
    ENTERPRISE: '#f59e0b',
  }
  return map[plan]
}

export function getPlanBadgeClass(plan: PlanType): string {
  const map: Record<PlanType, string> = {
    BASIC:      'badge-slate',
    PRO:        'badge-blue',
    BUSINESS:   'badge-purple',
    SCALE:      'badge-pink',
    ENTERPRISE: 'badge-amber',
  }
  return map[plan]
}

export function truncateAddress(addr: string, chars = 6): string {
  return `${addr.slice(0, chars)}...${addr.slice(-4)}`
}

export function formatHours(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)}m`
  if (hours < 24) return `${hours.toFixed(1)}h`
  return `${(hours / 24).toFixed(1)}d`
}

export function calculateRollover(quota: number, used: number): number {
  const unused = quota - used
  if (unused <= 0) return 0
  return Math.min(unused, quota * 0.30) // max 30%
}

export function generateTokenizedId(id: string): string {
  // Simulated tokenization — in production: HMAC-SHA256 with rotating key
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  const seed = Math.abs(hash)
  let result = 'TKN_'
  for (let i = 0; i < 12; i++) {
    result += chars[(seed + i * 7) % chars.length]
  }
  return result
}

export function formatIndexedROI(value: number): string {
  return `${value.toFixed(1)}x`
}

export function formatDate(dateString: string): string {
  const d = new Date(dateString)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatDateTime(dateString: string): string {
  const d = new Date(dateString)
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

export function relativeTime(dateString: string): string {
  const now = Date.now()
  const then = new Date(dateString).getTime()
  const diffSecs = Math.floor((now - then) / 1000)
  if (diffSecs < 60) return `${diffSecs}s ago`
  if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`
  if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`
  return `${Math.floor(diffSecs / 86400)}d ago`
}
