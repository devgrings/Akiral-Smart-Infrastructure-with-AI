import * as React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean
  glow?: boolean
  glowColor?: string
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, glass, glow, glowColor, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl border border-white/[0.06] bg-[#0f1117] p-6 transition-all',
        glass && 'backdrop-blur-sm bg-white/[0.02]',
        glow && 'shadow-glow',
        className
      )}
      style={glow && glowColor ? { boxShadow: `0 0 40px -12px ${glowColor}40` } : undefined}
      {...props}
    >
      {children}
    </div>
  )
)
Card.displayName = 'Card'

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-start justify-between mb-4', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

export const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm font-medium text-slate-400 uppercase tracking-widest', className)} {...props} />
  )
)
CardTitle.displayName = 'CardTitle'

export const CardValue = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-3xl font-bold text-white font-mono', className)} {...props} />
  )
)
CardValue.displayName = 'CardValue'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple'
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-slate-800 text-slate-300 border-slate-700',
      success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      danger:  'bg-red-500/10 text-red-400 border-red-500/20',
      info:    'bg-blue-500/10 text-blue-400 border-blue-500/20',
      purple:  'bg-violet-500/10 text-violet-400 border-violet-500/20',
    }
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border',
          variants[variant],
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = 'Badge'

interface ProgressBarProps {
  value: number
  max?: number
  color?: string
  className?: string
  showLabel?: boolean
  height?: number
}

export function ProgressBar({ value, max = 100, color = '#6366f1', className, showLabel, height = 6 }: ProgressBarProps) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className={cn('relative rounded-full bg-white/[0.05] overflow-hidden', className)} style={{ height }}>
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  )
}

interface StatDeltaProps {
  value: number
  suffix?: string
  className?: string
}

export function StatDelta({ value, suffix = '%', className }: StatDeltaProps) {
  const isPositive = value >= 0
  return (
    <span className={cn(
      'text-sm font-medium',
      isPositive ? 'text-emerald-400' : 'text-red-400',
      className
    )}>
      {isPositive ? '↑' : '↓'} {Math.abs(value).toFixed(1)}{suffix}
    </span>
  )
}

interface DotProps {
  color?: string
  size?: number
  pulse?: boolean
}

export function Dot({ color = '#10b981', size = 8, pulse }: DotProps) {
  return (
    <span className="relative inline-flex" style={{ width: size, height: size }}>
      {pulse && (
        <span
          className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50"
          style={{ backgroundColor: color }}
        />
      )}
      <span className="relative inline-flex rounded-full" style={{ width: size, height: size, backgroundColor: color }} />
    </span>
  )
}

interface SectionHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function Divider({ className }: { className?: string }) {
  return <div className={cn('border-t border-white/[0.05]', className)} />
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-white/[0.04]', className)} />
}

interface TooltipProps {
  label: string
  children: React.ReactNode
}

export function Tooltip({ label, children }: TooltipProps) {
  return (
    <div className="relative group inline-flex">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-slate-800 border border-white/10 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        {label}
      </div>
    </div>
  )
}
