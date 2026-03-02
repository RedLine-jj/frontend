export interface ProductBrief {
  productKey: string;
  name: string;
  brand: string;
  imageUrl: string;
  listPrice: number;
  url: string;
  optionsSummary: {
    availableCount: number;
    soldOutCount: number;
  };
}

export interface ProductOption {
  optionId: string;
  displayLabel: string;
  status: 'AVAILABLE' | 'SOLD_OUT';
  price: number;
  site: string;
}

export interface SiteOptions {
  site: string;
  siteLabel: string;
  siteUrl: string;
  options: ProductOption[];
}

export interface ProductDetail {
  productKey: string;
  name: string;
  brand: string;
  mainImage: string;
  url: string;
  listPrice: number;
  siteOptions: SiteOptions[];
  updatedAt: string;
}

export interface Subscription {
  productKey: string;
  productName?: string;
  productImage?: string;
  brand?: string;
  mode: 'ALL_OPTIONS' | 'SELECTED_OPTIONS';
  selectedOptionIds: string[];
  optionsSummary?: {
    availableCount: number;
    soldOutCount: number;
  };
}

export interface PriceHistoryEntry {
  date: string;
  site: string;
  siteLabel: string;
  price: number;
}

export interface RestockEvent {
  id: string;
  productKey: string;
  productName: string;
  displayLabel: string;
  type: 'RESTOCK';
  occurredAt: string;
}

export interface ProductListResponse {
  items: ProductBrief[];
  total: number;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
}

export interface User {
  email: string;
  token: string;
}
