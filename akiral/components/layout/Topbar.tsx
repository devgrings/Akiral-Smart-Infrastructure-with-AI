'use client'

import React from 'react'
import { useAppStore } from '@/lib/store/app-store'
import { Bell, Search, Globe, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TopbarProps {
  title: string
  subtitle?: string
  children?: React.ReactNode
}

export default function Topbar({ title, subtitle, children }: TopbarProps) {
  const { currentCompany } = useAppStore()

  return (
    <header className="h-16 border-b border-white/[0.05] bg-[#080a0e]/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-40">
      <div>
        <h1 className="text-lg font-semibold text-white leading-none">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {children}

        {/* Privacy Regime Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/8 border border-emerald-500/15">
          <Globe className="w-3 h-3 text-emerald-400" />
          <span className="text-[11px] font-semibold text-emerald-400">{currentCompany.privacyRegime}</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/[0.05] transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-violet-500 rounded-full" />
        </button>
      </div>
    </header>
  )
}
