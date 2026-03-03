import { NextResponse } from 'next/server'
import { MOCK_AI_CONFIG, MOCK_AI_INTERACTIONS_DAILY, MOCK_QUOTA } from '@/lib/store/mock-data'

export async function GET() {
  const today = MOCK_AI_INTERACTIONS_DAILY[MOCK_AI_INTERACTIONS_DAILY.length - 1]
  const totalQualified = MOCK_AI_INTERACTIONS_DAILY.reduce((a, d) => a + d.qualified, 0)
  const totalSpam = MOCK_AI_INTERACTIONS_DAILY.reduce((a, d) => a + d.spam, 0)
  const totalInteractions = MOCK_AI_INTERACTIONS_DAILY.reduce((a, d) => a + d.interactions, 0)

  return NextResponse.json({
    config: MOCK_AI_CONFIG,
    quota: MOCK_QUOTA,
    stats: {
      today,
      monthly: {
        totalInteractions,
        totalQualified,
        totalSpam,
        qualificationRate: ((totalQualified / totalInteractions) * 100).toFixed(1),
        spamRate: ((totalSpam / totalInteractions) * 100).toFixed(1),
      },
    },
    timeline: MOCK_AI_INTERACTIONS_DAILY,
    meta: {
      billingModel: 'Per-interaction (token-abstracted). Spam & useless = no charge.',
      overageRate: 'USD 0.025 per extra interaction (PRO plan)',
    },
  })
}

export async function POST(request: Request) {
  const body = await request.json()
  const { message, sessionId } = body

  // Simulate AI response
  const isSpam = message?.toLowerCase().includes('spam') || message?.length < 5
  const isQualified = message?.length > 20

  return NextResponse.json({
    sessionId: sessionId || `sess_${Date.now()}`,
    response: isSpam
      ? null
      : `Obrigado pela sua mensagem! ${isQualified ? 'Posso agendar uma demonstração para você?' : 'Poderia me contar mais sobre sua necessidade?'}`,
    isSpam,
    isQualified,
    tokensConsumed: Math.floor(Math.random() * 200) + 100,
    interactionCostUnits: 1.0,
    chargedToQuota: !isSpam,
    meta: {
      leadTokenizedId: `TKN_${Math.random().toString(36).slice(2, 14).toUpperCase()}`,
    },
  })
}
