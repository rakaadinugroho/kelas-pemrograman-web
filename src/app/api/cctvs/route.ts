import { NextRequest, NextResponse } from 'next/server'
import { cctvs } from '@/lib/mock-data'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const districtCode = searchParams.get('districtCode')
  const status = searchParams.get('status')

  let filteredCCTVs = [...cctvs]

  if (districtCode) {
    filteredCCTVs = filteredCCTVs.filter(
      (c) => c.districtCode.toLowerCase() === districtCode.toLowerCase()
    )
  }

  if (status) {
    filteredCCTVs = filteredCCTVs.filter(
      (c) => c.status.toLowerCase() === status.toLowerCase()
    )
  }

  return NextResponse.json({
    data: filteredCCTVs,
    meta: {
      total: filteredCCTVs.length,
      filters: { districtCode, status },
    },
  })
}