import { NextResponse } from 'next/server'
import {
  MOCK_API_SCORES, MOCK_CONVERSION_METRICS,
  MOCK_GROWTH_METRICS, MOCK_ROI_INDEX, MOCK_SECTOR_BENCHMARKS
} from '@/lib/store/mock-data'

export async function GET() {
  const latest = MOCK_API_SCORES[MOCK_API_SCORES.length - 1]
  const conv = MOCK_CONVERSION_METRICS[MOCK_CONVERSION_METRICS.length - 1]
  const growth = MOCK_GROWTH_METRICS[MOCK_GROWTH_METRICS.length - 1]

  return NextResponse.json({
    performanceIndex: latest,
    conversion: conv,
    growth,
    roi: MOCK_ROI_INDEX,
    history: {
      apiScores: MOCK_API_SCORES,
      conversion: MOCK_CONVERSION_METRICS,
      growth: MOCK_GROWTH_METRICS,
    },
    sectorBenchmarks: MOCK_SECTOR_BENCHMARKS,
    meta: {
      privacyNote: 'All metrics are relative/indexed. No absolute financial values processed.',
      methodology: 'AKIRAL Performance Index™ v2.2 — Patent Pending',
    },
  })
}
