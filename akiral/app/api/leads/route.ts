import { NextResponse } from 'next/server'
import { MOCK_LEADS, LEAD_STATE_DISTRIBUTION } from '@/lib/store/mock-data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const state = searchParams.get('state')
  const limit = parseInt(searchParams.get('limit') || '20')
  const page = parseInt(searchParams.get('page') || '1')

  let leads = MOCK_LEADS
  if (state) {
    leads = leads.filter(l => l.currentState === state)
  }

  const start = (page - 1) * limit
  const paginated = leads.slice(start, start + limit)

  return NextResponse.json({
    data: paginated,
    pagination: {
      total: leads.length,
      page,
      limit,
      pages: Math.ceil(leads.length / limit),
    },
    distribution: LEAD_STATE_DISTRIBUTION,
    meta: {
      complianceNote: 'Lead IDs tokenized. Raw PII not stored per LGPD Art. 7.',
      dataRetentionPolicy: '24 months active, 12 months archived',
    },
  })
}
