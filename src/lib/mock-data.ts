export interface District {
  code: string;
  name: string;
  population: number;
  area: string;
  description: string;
}

export interface Commodity {
  id: string;
  districtCode: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  lastUpdated: string;
}

export interface InflationMarket {
  id: string;
  districtCode: string;
  marketName: string;
  inflationRate: number;
  month: string;
  year: number;
  categories: string[];
}

export interface CCTV {
  id: string;
  name: string;
  location: string;
  districtCode: string;
  latitude: number;
  longitude: number;
  status: 'active' | 'inactive' | 'maintenance';
  lastPing: string;
}

export const districts: District[] = [
  {
    code: 'SKU',
    name: 'Sapuran',
    population: 45230,
    area: '45.12 km²',
    description: 'Kecamatan Sapuran位于Wonosobo县东部，以农业生产为主。',
  },
  {
    code: 'KRT',
    name: 'Kertek',
    population: 67890,
    area: '52.34 km²',
    description: 'Kecamatan Kertek是Wonosobo县的经济中心，商业繁荣。',
  },
  {
    code: 'WNS',
    name: 'Wonosobo',
    population: 89012,
    area: '48.21 km²',
    description: 'Wonosobo镇中心，是县行政和文化的核心地区。',
  },
  {
    code: 'MJT',
    name: 'Majateng',
    population: 34567,
    area: '38.90 km²',
    description: 'Majateng以其传统手工艺和旅游景点的自然风光著称。',
  },
  {
    code: 'LGH',
    name: 'Leksono',
    population: 23456,
    area: '41.15 km²',
    description: 'Leksono是新兴的工业区，正在快速发展中。',
  },
];

export const commodities: Commodity[] = [
  {
    id: 'cmd-001',
    districtCode: 'SKU',
    name: 'Beras Premium',
    category: 'Pangan',
    price: 12500,
    unit: 'kg',
    lastUpdated: '2026-04-10T08:00:00Z',
  },
  {
    id: 'cmd-002',
    districtCode: 'SKU',
    name: 'Cabai Merah',
    category: 'Pangan',
    price: 35000,
    unit: 'kg',
    lastUpdated: '2026-04-10T08:00:00Z',
  },
  {
    id: 'cmd-003',
    districtCode: 'KRT',
    name: 'Gula Pasir',
    category: 'Pangan',
    price: 15000,
    unit: 'kg',
    lastUpdated: '2026-04-10T08:00:00Z',
  },
  {
    id: 'cmd-004',
    districtCode: 'WNS',
    name: 'Minyak Goreng',
    category: 'Pangan',
    price: 18000,
    unit: 'liter',
    lastUpdated: '2026-04-10T08:00:00Z',
  },
  {
    id: 'cmd-005',
    districtCode: 'MJT',
    name: 'Kopi Arabika',
    category: 'Minuman',
    price: 85000,
    unit: 'kg',
    lastUpdated: '2026-04-10T08:00:00Z',
  },
];

export const inflationMarkets: InflationMarket[] = [
  {
    id: 'inf-001',
    districtCode: 'SKU',
    marketName: 'Pasar Sapuran',
    inflationRate: 3.2,
    month: 'Maret',
    year: 2026,
    categories: ['Pangan', 'Perumahan', 'Transportasi'],
  },
  {
    id: 'inf-002',
    districtCode: 'KRT',
    marketName: 'Pasar Kertek',
    inflationRate: 2.8,
    month: 'Maret',
    year: 2026,
    categories: ['Pangan', 'Kesehatan', 'Pendidikan'],
  },
  {
    id: 'inf-003',
    districtCode: 'WNS',
    marketName: 'Pasar Wonosobo',
    inflationRate: 4.1,
    month: 'Maret',
    year: 2026,
    categories: ['Pangan', 'Transportasi', 'Perumahan'],
  },
  {
    id: 'inf-004',
    districtCode: 'MJT',
    marketName: 'Pasar Majateng',
    inflationRate: 2.5,
    month: 'Maret',
    year: 2026,
    categories: ['Pangan', 'Sandang'],
  },
];

export const cctvs: CCTV[] = [
  {
    id: 'cctv-001',
    name: 'CCTV Bundaran Wonosobo',
    location: 'Jl.家宝路 No. 1',
    districtCode: 'WNS',
    latitude: -7.3601,
    longitude: 109.8964,
    status: 'active',
    lastPing: '2026-04-10T12:00:00Z',
  },
  {
    id: 'cctv-002',
    name: 'CCTV Pasar Kertek',
    location: 'Jl.市场路 No. 15',
    districtCode: 'KRT',
    latitude: -7.3456,
    longitude: 109.9123,
    status: 'active',
    lastPing: '2026-04-10T12:00:00Z',
  },
  {
    id: 'cctv-003',
    name: 'CCTV Pertigaan Sapuran',
    location: 'Jl.农业路 No. 8',
    districtCode: 'SKU',
    latitude: -7.3789,
    longitude: 109.8567,
    status: 'maintenance',
    lastPing: '2026-04-10T11:30:00Z',
  },
  {
    id: 'cctv-004',
    name: 'CCTV Jalan Tol Wonosobo',
    location: 'Wonosobo Toll Gate',
    districtCode: 'WNS',
    latitude: -7.3400,
    longitude: 109.8900,
    status: 'active',
    lastPing: '2026-04-10T12:00:00Z',
  },
  {
    id: 'cctv-005',
    name: 'CCTV Destinasi Dieng',
    location: 'Jalan scenic Dieng',
    districtCode: 'MJT',
    latitude: -7.4200,
    longitude: 109.8800,
    status: 'inactive',
    lastPing: '2026-04-10T06:00:00Z',
  },
];