import { NextResponse } from 'next/server'
import { MOCK_AUDIT_LOGS } from '@/lib/store/mock-data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  const limit = parseInt(searchParams.get('limit') || '50')

  let logs = MOCK_AUDIT_LOGS
  if (action) {
    logs = logs.filter(l => l.action === action)
  }

  return NextResponse.json({
    data: logs.slice(0, limit),
    total: logs.length,
    meta: {
      storage: 'WORM — Write Once Read Many. Tamper-evident SHA-256 chain.',
      retention: '7 years (LGPD/GDPR requirement)',
      exportFormats: ['PDF', 'JSON', 'CSV'],
      complianceStandard: 'ISO 27001 / SOC 2 Type II compatible',
    },
  })
}
