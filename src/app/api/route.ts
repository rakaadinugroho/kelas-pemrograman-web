import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json({
    name: 'Wonosobo Smart City API',
    version: 'v1',
    resources: {
      districts: '/api/districts',
      cctvs: '/api/cctvs',
    },
    docs: {
      districts: {
        list: '/api/districts',
        detail: '/api/districts/{code}',
        commodities: '/api/districts/{code}/commodities',
        inflationMarkets: '/api/districts/{code}/inflation-markets',
      },
    },
  })
}
