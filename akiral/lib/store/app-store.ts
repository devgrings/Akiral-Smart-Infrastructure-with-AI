import { create } from 'zustand'
import { Company, User, Lead, AkiralPerformanceIndex } from '@/lib/types'
import {
  DEMO_COMPANY, DEMO_USER, MOCK_LEADS,
  MOCK_API_SCORES, MOCK_COMPANIES
} from '@/lib/store/mock-data'

interface AppState {
  currentCompany: Company
  currentUser: User
  leads: Lead[]
  apiScores: AkiralPerformanceIndex[]
  companies: Company[]
  sidebarOpen: boolean
  activeSection: string

  setActiveSection: (section: string) => void
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  switchCompany: (companyId: string) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  currentCompany: DEMO_COMPANY,
  currentUser: DEMO_USER,
  leads: MOCK_LEADS,
  apiScores: MOCK_API_SCORES,
  companies: MOCK_COMPANIES,
  sidebarOpen: true,
  activeSection: 'dashboard',

  setActiveSection: (section) => set({ activeSection: section }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  switchCompany: (companyId) => {
    const company = get().companies.find(c => c.id === companyId)
    if (company) set({ currentCompany: company })
  },
}))
