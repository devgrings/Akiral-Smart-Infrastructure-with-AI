'use client'

import React from 'react'
import Sidebar from '@/components/layout/Sidebar'
import { useAppStore } from '@/lib/store/app-store'
import { cn } from '@/lib/utils'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { sidebarOpen } = useAppStore()

  return (
    <div className="min-h-screen bg-[#080a0e] grid-bg">
      {/* Background orbs */}
      <div className="orb orb-violet" />
      <div className="orb orb-blue" />

      <Sidebar />

      <main
        className={cn(
          'transition-all duration-300 min-h-screen relative z-10',
          sidebarOpen ? 'ml-64' : 'ml-16'
        )}
      >
        {children}
      </main>
    </div>
  )
}
