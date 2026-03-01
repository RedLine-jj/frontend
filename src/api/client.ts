import { ProductBrief, ProductDetail, Subscription, RestockEvent, ProductListResponse } from '@/types';

const BRANDS = ['LEVI\'S', 'WRANGLER', 'LEE', 'NUDIE JEANS', 'A.P.C.'];

const MOCK_PRODUCTS: ProductBrief[] = [
  {
    productKey: 'PM-301',
    name: 'Indigo Classic Wide Jeans',
    brand: 'LEVI\'S',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
    listPrice: 89000,
    url: 'https://modeman.co.kr/product/PM-301',
    optionsSummary: { availableCount: 3, soldOutCount: 2 },
  },
  {
    productKey: 'PM-302',
    name: 'Raw Selvedge Slim Fit',
    brand: 'NUDIE JEANS',
    imageUrl: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400&h=400&fit=crop',
    listPrice: 159000,
    url: 'https://modeman.co.kr/product/PM-302',
    optionsSummary: { availableCount: 5, soldOutCount: 0 },
  },
  {
    productKey: 'PM-303',
    name: 'Vintage Wash Straight Denim',
    brand: 'WRANGLER',
    imageUrl: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=400&h=400&fit=crop',
    listPrice: 69000,
    url: 'https://modeman.co.kr/product/PM-303',
    optionsSummary: { availableCount: 0, soldOutCount: 4 },
  },
  {
    productKey: 'PM-304',
    name: 'Deep Blue Tapered Jeans',
    brand: 'A.P.C.',
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop',
    listPrice: 245000,
    url: 'https://modeman.co.kr/product/PM-304',
    optionsSummary: { availableCount: 2, soldOutCount: 3 },
  },
  {
    productKey: 'PM-305',
    name: 'Black Rinse Skinny Denim',
    brand: 'LEE',
    imageUrl: 'https://images.unsplash.com/photo-1475178626620-a4d074967571?w=400&h=400&fit=crop',
    listPrice: 79000,
    url: 'https://modeman.co.kr/product/PM-305',
    optionsSummary: { availableCount: 4, soldOutCount: 1 },
  },
  {
    productKey: 'PM-306',
    name: 'Washed Bootcut Classic',
    brand: 'WRANGLER',
    imageUrl: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=400&h=400&fit=crop',
    listPrice: 75000,
    url: 'https://modeman.co.kr/product/PM-306',
    optionsSummary: { availableCount: 1, soldOutCount: 5 },
  },
  {
    productKey: 'PM-307',
    name: 'Organic Cotton Relaxed Fit',
    brand: 'NUDIE JEANS',
    imageUrl: 'https://images.unsplash.com/photo-1551854838-212c50b4c184?w=400&h=400&fit=crop',
    listPrice: 189000,
    url: 'https://modeman.co.kr/product/PM-307',
    optionsSummary: { availableCount: 6, soldOutCount: 0 },
  },
  {
    productKey: 'PM-308',
    name: 'Stone Wash Regular Jeans',
    brand: 'LEVI\'S',
    imageUrl: 'https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?w=400&h=400&fit=crop',
    listPrice: 95000,
    url: 'https://modeman.co.kr/product/PM-308',
    optionsSummary: { availableCount: 2, soldOutCount: 4 },
  },
];

const SIZE_LABELS = ['1(28)', '2(29)', '3(30)', '4(31)', '5(32)', '6(33)'];

function generateOptions(productKey: string, summary: { availableCount: number; soldOutCount: number }) {
  const total = summary.availableCount + summary.soldOutCount;
  const options = [];
  for (let i = 0; i < total; i++) {
    options.push({
      optionId: `${productKey}-OPT-${i + 1}`,
      displayLabel: SIZE_LABELS[i % SIZE_LABELS.length],
      status: (i < summary.availableCount ? 'AVAILABLE' : 'SOLD_OUT') as 'AVAILABLE' | 'SOLD_OUT',
      price: MOCK_PRODUCTS.find(p => p.productKey === productKey)?.listPrice ?? 0,
    });
  }
  return options;
}

const MOCK_EVENTS: RestockEvent[] = [
  { id: 'evt-1', productKey: 'PM-301', productName: 'Indigo Classic Wide Jeans', displayLabel: '1(30)', type: 'RESTOCK', occurredAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  { id: 'evt-2', productKey: 'PM-304', productName: 'Deep Blue Tapered Jeans', displayLabel: '4(31)', type: 'RESTOCK', occurredAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: 'evt-3', productKey: 'PM-306', productName: 'Washed Bootcut Classic', displayLabel: '2(29)', type: 'RESTOCK', occurredAt: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
];

let mockSubscriptions: Subscription[] = [];

// Simulated delay
const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export const api = {
  async getProducts(params?: { query?: string; filter?: string; page?: number; pageSize?: number }): Promise<ProductListResponse> {
    await delay(400);
    let items = [...MOCK_PRODUCTS];
    if (params?.query) {
      const q = params.query.toLowerCase();
      items = items.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    if (params?.filter === 'in_stock') {
      items = items.filter(p => p.optionsSummary.availableCount > 0);
    } else if (params?.filter === 'sold_out') {
      items = items.filter(p => p.optionsSummary.soldOutCount > 0);
    }
    return { items, total: items.length, updatedAt: new Date().toISOString() };
  },

  async getProduct(productKey: string): Promise<ProductDetail> {
    await delay(300);
    const brief = MOCK_PRODUCTS.find(p => p.productKey === productKey);
    if (!brief) throw new Error('상품을 찾을 수 없습니다.');
    return {
      productKey: brief.productKey,
      name: brief.name,
      brand: brief.brand,
      mainImage: brief.imageUrl,
      url: brief.url,
      listPrice: brief.listPrice,
      options: generateOptions(brief.productKey, brief.optionsSummary),
      updatedAt: new Date().toISOString(),
    };
  },

  async login(email: string, _password: string): Promise<{ accessToken: string }> {
    await delay(500);
    if (!email) throw new Error('이메일을 입력해주세요.');
    return { accessToken: `mock-token-${Date.now()}` };
  },

  async getSubscriptions(): Promise<Subscription[]> {
    await delay(300);
    return mockSubscriptions.map(s => {
      const p = MOCK_PRODUCTS.find(pr => pr.productKey === s.productKey);
      return { ...s, productName: p?.name, productImage: p?.imageUrl, brand: p?.brand, optionsSummary: p?.optionsSummary };
    });
  },

  async subscribe(sub: { productKey: string; mode: 'ALL_OPTIONS' | 'SELECTED_OPTIONS'; selectedOptionIds: string[] }): Promise<void> {
    await delay(200);
    mockSubscriptions = mockSubscriptions.filter(s => s.productKey !== sub.productKey);
    mockSubscriptions.push(sub);
  },

  async unsubscribe(productKey: string): Promise<void> {
    await delay(200);
    mockSubscriptions = mockSubscriptions.filter(s => s.productKey !== productKey);
  },

  async getEvents(limit = 5): Promise<RestockEvent[]> {
    await delay(200);
    return MOCK_EVENTS.slice(0, limit);
  },

  isSubscribed(productKey: string): boolean {
    return mockSubscriptions.some(s => s.productKey === productKey);
  },
};
