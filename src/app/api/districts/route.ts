import { NextRequest, NextResponse } from 'next/server'
import { districts } from '@/lib/mock-data'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name')
  const minPopulation = searchParams.get('minPopulation')
  const maxPopulation = searchParams.get('maxPopulation')

  let filteredDistricts = [...districts]

  if (name) {
    filteredDistricts = filteredDistricts.filter((d) =>
      d.name.toLowerCase().includes(name.toLowerCase())
    )
  }

  if (minPopulation) {
    filteredDistricts = filteredDistricts.filter(
      (d) => d.population >= parseInt(minPopulation)
    )
  }

  if (maxPopulation) {
    filteredDistricts = filteredDistricts.filter(
      (d) => d.population <= parseInt(maxPopulation)
    )
  }

  return NextResponse.json({
    data: filteredDistricts,
    meta: {
      total: filteredDistricts.length,
      filters: { name, minPopulation, maxPopulation },
    },
  })
}