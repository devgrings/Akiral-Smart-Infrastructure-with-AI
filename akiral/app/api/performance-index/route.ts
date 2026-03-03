import { NextResponse } from 'next/server'
import { MOCK_API_SCORES, MOCK_SECTOR_BENCHMARKS } from '@/lib/store/mock-data'
import { getScoreGrade } from '@/lib/utils'

export async function GET() {
  const latest = MOCK_API_SCORES[MOCK_API_SCORES.length - 1]
  const benchmark = MOCK_SECTOR_BENCHMARKS.find(b => b.sector === 'TECHNOLOGY')

  return NextResponse.json({
    current: latest,
    history: MOCK_API_SCORES,
    benchmark,
    methodology: {
      version: 'API-v2.2',
      components: [
        { name: 'Lead Growth Score', weight: 0.25, description: 'Volume and velocity of new lead acquisition' },
        { name: 'Conversion Score', weight: 0.25, description: 'Funnel efficiency across lifecycle states' },
        { name: 'Response Velocity Score', weight: 0.25, description: 'Speed of AI + human follow-up' },
        { name: 'Monthly Stability Score', weight: 0.25, description: 'Consistency and variance reduction' },
      ],
      gradingScale: {
        S: '90-100 — Exceptional',
        A: '80-89 — High Performance',
        B: '65-79 — Above Average',
        C: '50-64 — Developing',
        D: '35-49 — Below Average',
        F: '0-34 — Critical',
      },
      patentNote: 'AKIRAL Performance Index™ computation method — Patent Pending. "Method and System for Privacy-Preserving Lead Intelligence."',
      privacyNote: 'Benchmarks use only anonymized, aggregated sector data. Zero cross-company comparison.',
    },
  })
}
