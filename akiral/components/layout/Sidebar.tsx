'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/lib/store/app-store'
import {
  LayoutDashboard, Users, BarChart3, Bot, Shield, Settings,
  ChevronLeft, ChevronRight, Zap, Building2, Bell, LogOut,
  TrendingUp, FileText, Lock, Globe
} from 'lucide-react'

const NAV_ITEMS = [
  {
    group: 'Core',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
      { href: '/leads', label: 'Lead Intelligence', icon: Users, id: 'leads' },
      { href: '/analytics', label: 'Analytics & ROI', icon: BarChart3, id: 'analytics' },
    ],
  },
  {
    group: 'Intelligence',
    items: [
      { href: '/ai-receptionist', label: 'AI Receptionist', icon: Bot, id: 'ai-receptionist' },
      { href: '/performance', label: 'API™ Score', icon: TrendingUp, id: 'performance' },
    ],
  },
  {
    group: 'Compliance',
    items: [
      { href: '/audit', label: 'Audit Trail', icon: Shield, id: 'audit' },
      { href: '/settings', label: 'Settings', icon: Settings, id: 'settings' },
    ],
  },
]

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar, currentCompany, currentUser } = useAppStore()
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full z-50 flex flex-col bg-[#080a0e] border-r border-white/[0.05] transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-16'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-white/[0.05]">
        {sidebarOpen ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-white font-bold text-lg tracking-tight">AKIRAL</span>
              <div className="flex items-center gap-1 -mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-emerald-400 font-medium">LIVE</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mx-auto">
            <Zap className="w-4 h-4 text-white" />
          </div>
        )}
        {sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Company Badge */}
      {sidebarOpen && (
        <div className="mx-3 mt-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-4 h-4 text-violet-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white truncate">{currentCompany.name}</p>
              <p className="text-[10px] text-slate-500">{currentCompany.plan} · {currentCompany.tenantTier === 'ENTERPRISE_DEDICATED_DB' ? 'Dedicated DB' : 'Shared DB'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        {NAV_ITEMS.map((group) => (
          <div key={group.group}>
            {sidebarOpen && (
              <p className="px-3 mb-1.5 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">
                {group.group}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon
                const isActive = pathname === `/${item.id}` || pathname.startsWith(`/${item.id}/`)
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all group',
                        isActive
                          ? 'bg-violet-500/10 text-violet-300 border border-violet-500/20'
                          : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.04]',
                        !sidebarOpen && 'justify-center'
                      )}
                      title={!sidebarOpen ? item.label : undefined}
                    >
                      <Icon className={cn('flex-shrink-0', sidebarOpen ? 'w-4 h-4' : 'w-5 h-5')} />
                      {sidebarOpen && <span>{item.label}</span>}
                      {isActive && sidebarOpen && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400" />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Privacy Badge */}
      {sidebarOpen && (
        <div className="mx-3 mb-2 p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-[10px] font-semibold text-emerald-400">LGPD / GDPR</p>
              <p className="text-[10px] text-slate-600">Privacy-by-Design Active</p>
            </div>
          </div>
        </div>
      )}

      {/* Collapse toggle for collapsed state */}
      {!sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="p-3 text-slate-500 hover:text-white hover:bg-white/[0.05] transition-colors border-t border-white/[0.05]"
        >
          <ChevronRight className="w-4 h-4 mx-auto" />
        </button>
      )}

      {/* User */}
      <div className={cn(
        'p-3 border-t border-white/[0.05] flex items-center gap-2.5',
        !sidebarOpen && 'justify-center'
      )}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">
          {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        {sidebarOpen && (
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-white truncate">{currentUser.name}</p>
            <p className="text-[10px] text-slate-500 truncate">{currentUser.role.replace('_', ' ')}</p>
          </div>
        )}
        {sidebarOpen && (
          <button className="p-1 text-slate-600 hover:text-slate-300 transition-colors">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </aside>
  )
}
