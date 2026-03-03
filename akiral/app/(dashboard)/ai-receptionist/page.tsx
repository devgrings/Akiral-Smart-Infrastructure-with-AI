'use client'

import React, { useState } from 'react'
import Topbar from '@/components/layout/Topbar'
import { Card, SectionHeader, ProgressBar, Dot, Badge } from '@/components/ui'
import { AIInteractionsChart } from '@/components/charts'
import {
  MOCK_AI_CONFIG, MOCK_AI_INTERACTIONS_DAILY, MOCK_QUOTA
} from '@/lib/store/mock-data'
import { useAppStore } from '@/lib/store/app-store'
import { cn } from '@/lib/utils'
import { PLAN_CONFIGS } from '@/lib/types'
import {
  Bot, Zap, MessageSquare, Shield, AlertTriangle,
  CheckCircle2, XCircle, ArrowUpRight, Send, RefreshCw,
  Settings, Users, Clock
} from 'lucide-react'

type ChatMessage = { role: 'user' | 'assistant'; content: string; timestamp: string; tokens?: number }

const DEMO_CONVERSATION: ChatMessage[] = [
  { role: 'assistant', content: 'Olá! Sou a Aria, assistente da TechVenture. Como posso ajudá-lo hoje?', timestamp: '09:00:01', tokens: 38 },
  { role: 'user', content: 'Olá, gostaria de saber mais sobre as soluções de vocês para e-commerce.', timestamp: '09:00:45', tokens: 22 },
  { role: 'assistant', content: 'Ótimo! Temos soluções completas para e-commerce, desde automação de atendimento até análise de dados. Poderia me contar o tamanho da sua operação e o principal desafio que enfrenta atualmente?', timestamp: '09:00:46', tokens: 54 },
  { role: 'user', content: 'Temos um time de 45 pessoas e o maior problema é qualificar leads vindos de campanhas pagas.', timestamp: '09:01:22', tokens: 31 },
  { role: 'assistant', content: 'Entendo! Com 45 colaboradores, você se enquadra bem no perfil que atendemos. Nossa IA pode qualificar leads automaticamente com base em critérios customizados para o seu negócio, reduzindo o tempo de qualificação em até 60%. Posso agendar uma demonstração esta semana?', timestamp: '09:01:23', tokens: 68 },
]

export default function AIReceptionistPage() {
  const { currentCompany } = useAppStore()
  const [messages, setMessages] = useState<ChatMessage[]>(DEMO_CONVERSATION)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const plan = PLAN_CONFIGS[currentCompany.plan]
  const totalInteractions = MOCK_AI_INTERACTIONS_DAILY.reduce((a, d) => a + d.interactions, 0)
  const totalQualified = MOCK_AI_INTERACTIONS_DAILY.reduce((a, d) => a + d.qualified, 0)
  const totalSpam = MOCK_AI_INTERACTIONS_DAILY.reduce((a, d) => a + d.spam, 0)
  const qualRate = ((totalQualified / totalInteractions) * 100).toFixed(1)
  const quotaPercent = (MOCK_QUOTA.used / MOCK_QUOTA.quota) * 100

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userMsg: ChatMessage = { role: 'user', content: input, timestamp: new Date().toTimeString().slice(0, 8) }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    await new Promise(r => setTimeout(r, 900))

    const responses = [
      'Excelente! Podemos agendar uma demo rápida de 20 minutos. Qual horário funciona melhor para você esta semana?',
      'Ótima pergunta! Nossa plataforma se integra com os principais CRMs do mercado. Você já utiliza algum CRM atualmente?',
      'Entendido! Com base no que descreveu, nossa solução PRO seria ideal. Posso enviar um estudo de caso do seu setor?',
      'Com certeza! Nosso suporte é 24/7 para planos Business e Enterprise. Quer conhecer os detalhes de cada plano?',
    ]

    const aiMsg: ChatMessage = {
      role: 'assistant',
      content: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date().toTimeString().slice(0, 8),
      tokens: Math.floor(Math.random() * 60) + 40,
    }
    setMessages(prev => [...prev, aiMsg])
    setLoading(false)
  }

  return (
    <div className="page-enter">
      <Topbar title="AI Receptionist" subtitle="Powered by AKIRAL Intelligence Layer" />

      <div className="p-6 space-y-6">

        {/* Status Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { icon: Bot, label: 'Persona', value: MOCK_AI_CONFIG.persona, color: '#8b5cf6' },
            { icon: Zap, label: 'Status', value: 'Active', color: '#10b981', pulse: true },
            { icon: MessageSquare, label: 'Interactions (mo.)', value: totalInteractions.toLocaleString(), color: '#3b82f6' },
            { icon: CheckCircle2, label: 'Qualification Rate', value: `${qualRate}%`, color: '#10b981' },
            { icon: Shield, label: 'Spam Blocked', value: totalSpam.toString(), color: '#f59e0b' },
          ].map(stat => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${stat.color}15` }}>
                  <Icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-600">{stat.label}</p>
                  <div className="flex items-center gap-1.5">
                    {stat.pulse && <Dot color={stat.color} size={6} pulse />}
                    <p className="text-sm font-bold text-white">{stat.value}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Live Chat Demo */}
          <Card className="lg:col-span-2 flex flex-col" style={{ height: 560 }}>
            <SectionHeader
              title="Live Interaction Preview"
              subtitle="Demo session — TKN_SMP8X2K3L4M"
              action={
                <div className="flex items-center gap-2">
                  <Dot color="#10b981" pulse size={6} />
                  <span className="text-xs text-emerald-400">Live</span>
                </div>
              }
            />

            {/* Chat */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1" style={{ maxHeight: 380 }}>
              {messages.map((msg, i) => (
                <div key={i} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className={cn(
                    'max-w-xs px-3 py-2 rounded-xl text-sm',
                    msg.role === 'assistant'
                      ? 'bg-white/[0.04] border border-white/[0.06] text-slate-200'
                      : 'bg-violet-600/20 border border-violet-500/20 text-violet-100'
                  )}>
                    <p className="text-xs leading-relaxed">{msg.content}</p>
                    <div className="flex justify-between items-center mt-1.5">
                      <span className="text-[10px] text-slate-600">{msg.timestamp}</span>
                      {msg.tokens && (
                        <span className="text-[10px] text-slate-700">{msg.tokens}t</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2">
                    <div className="flex gap-1">
                      {[0,1,2].map(i => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <input
                className="flex-1 bg-transparent text-sm text-white placeholder-slate-600 outline-none"
                placeholder="Type a message to test the AI Receptionist..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="p-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

            {/* Token Counter */}
            <div className="mt-2 flex justify-between text-[10px] text-slate-700">
              <span>Session tokens: ~{messages.reduce((a, m) => a + (m.tokens || 40), 0)}</span>
              <span>Est. interaction cost: 1.0 unit</span>
              <span>Charged to quota: Yes</span>
            </div>
          </Card>

          {/* Config + Quota */}
          <div className="space-y-4">
            {/* AI Config */}
            <Card>
              <SectionHeader title="Receptionist Config" subtitle={`Persona: ${MOCK_AI_CONFIG.persona}`} />
              <div className="space-y-2">
                {[
                  { label: 'Language', value: MOCK_AI_CONFIG.language === 'PT' ? 'Portuguese (BR)' : 'English' },
                  { label: 'Max Turns', value: `${MOCK_AI_CONFIG.maxTurnsBeforeEscalation} before escalation` },
                  { label: 'Spam Threshold', value: `${(MOCK_AI_CONFIG.spamThreshold * 100).toFixed(0)}% confidence` },
                  { label: 'Timezone', value: MOCK_AI_CONFIG.timezone },
                ].map(c => (
                  <div key={c.label} className="flex justify-between text-xs">
                    <span className="text-slate-600">{c.label}</span>
                    <span className="text-slate-400 font-mono">{c.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 space-y-1">
                <p className="text-[10px] text-slate-600 mb-1.5">Escalation Triggers</p>
                <div className="flex flex-wrap gap-1">
                  {MOCK_AI_CONFIG.escalationTriggers.map(t => (
                    <span key={t} className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Card>

            {/* Quota */}
            <Card>
              <SectionHeader title="Interaction Quota" subtitle={`${plan.displayName} Plan · ${plan.interactionQuota.toLocaleString()} / mo`} />
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-500">Used this month</span>
                    <span className="font-mono text-white">{MOCK_QUOTA.used.toLocaleString()} / {MOCK_QUOTA.quota.toLocaleString()}</span>
                  </div>
                  <ProgressBar
                    value={MOCK_QUOTA.used}
                    max={MOCK_QUOTA.quota}
                    color={quotaPercent > 90 ? '#ef4444' : quotaPercent > 70 ? '#f59e0b' : '#10b981'}
                    height={8}
                  />
                  <p className="text-[10px] text-slate-600 mt-1">{quotaPercent.toFixed(1)}% consumed</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Rollover In', value: `+${MOCK_QUOTA.rolloverFromPrior}`, color: '#10b981' },
                    { label: 'Remaining', value: MOCK_QUOTA.remaining.toLocaleString(), color: '#3b82f6' },
                    { label: 'Overage Rate', value: `$${MOCK_QUOTA.overageCostPerUnit}/unit`, color: '#f59e0b' },
                    { label: 'Hard Limit', value: plan.hardLimit ? 'ON' : 'OFF', color: plan.hardLimit ? '#ef4444' : '#10b981' },
                  ].map(q => (
                    <div key={q.label} className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                      <p className="text-[10px] text-slate-600">{q.label}</p>
                      <p className="text-xs font-bold font-mono mt-0.5" style={{ color: q.color }}>{q.value}</p>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 rounded-lg bg-blue-500/5 border border-blue-500/10">
                  <p className="text-[10px] text-slate-500">
                    <strong className="text-blue-400">Rollover Policy:</strong> Up to 30% of unused quota carries over.
                    Anti-spam and rate limiting active. Useless/spam interactions do not consume quota.
                  </p>
                </div>
              </div>
            </Card>

            {/* Interaction Types */}
            <Card>
              <SectionHeader title="Interaction Budgets" />
              <div className="space-y-2">
                {[
                  { type: 'SHORT', tokens: '150–250', cost: '1.0 unit', color: '#3b82f6' },
                  { type: 'MEDIUM', tokens: '500–700', cost: '1.0 unit', color: '#8b5cf6' },
                  { type: 'LONG', tokens: '700–1200', cost: '1.5 units', color: '#f59e0b' },
                  { type: 'COMPLEX', tokens: '1200–3000', cost: '2.0 units', color: '#ef4444' },
                ].map(t => (
                  <div key={t.type} className="flex items-center justify-between text-xs">
                    <span className="font-medium" style={{ color: t.color }}>{t.type}</span>
                    <span className="text-slate-600 font-mono">{t.tokens} tokens</span>
                    <span className="text-slate-400 font-mono">{t.cost}</span>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[10px] text-slate-700">Tokens are internal billing units, invisible to clients.</p>
            </Card>
          </div>
        </div>

        {/* Activity Chart */}
        <Card>
          <SectionHeader title="Daily Interaction Volume" subtitle="Last 30 days" />
          <AIInteractionsChart data={MOCK_AI_INTERACTIONS_DAILY} />
        </Card>

      </div>
    </div>
  )
}
