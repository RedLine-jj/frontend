// ── Redline API 공통 응답 래퍼 ──

/** 모든 API 응답의 최상위 형태 */
export interface ApiResponse<T = null> {
  success: boolean;
  message: string | null;
  data: T;
}

/** 커서 기반 페이지네이션 응답 */
export interface CursorPage<T> {
  content: T[];
  nextCursor: number | null;
  hasNext: boolean;
}

/** 커서 페이지네이션 요청 파라미터 */
export interface CursorParams {
  cursor?: number;
  size?: number;
}

// ── Auth ──

export interface LoginRequest {
  userId: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface SignupRequest {
  userId: string;
  password: string;
  userName: string;
}

// ── Sites ──

export interface SiteDto {
  id: number;
  siteName: string;
  siteLink: string;
}

// ── Brands ──

export interface BrandDto {
  id: number;
  brandName: string;
  brandNameKo: string;
}

// ── Models ──

export interface ModelDto {
  id: number;
  brandId: number;
  brandName: string;
  brandNameKo: string;
  modelName: string;
  imageUrl: string;
  type: string;
  lowestPrice: number | null;
}

export interface ModelTypeDto {
  code: string;
  label: string;
}

export interface ModelsParams extends CursorParams {
  brandId?: number;
  brandIds?: number[];
  types?: string[];
}

// ── SiteOptions ──

export interface SiteOptionDto {
  id: number;
  siteName: string;
  modelName: string;
  optionLabel: string;
  price: number;
  status: boolean;
  lastCapturedAt: string;
}

export interface SiteOptionDetailDto {
  id: number;
  siteName: string;
  siteLink: string;
  brandName: string;
  modelName: string;
  imageUrl: string;
  optionLabel: string;
  price: number;
  status: boolean;
  url: string;
  lastCapturedAt: string;
}

export interface SiteOptionLogDto {
  id: number;
  optionLabel: string;
  price: number;
  status: boolean;
  capturedAt: string;
}

export interface SiteOptionsParams extends CursorParams {
  siteId?: number;
  modelId?: number;
  status?: boolean;
}

// ── Subscriptions ──

export interface SubscriptionDto {
  id: number;
  modelId: number;
  brandName: string;
  modelName: string;
  imageUrl: string;
  createdAt: string;
}

export interface SubscribeRequest {
  modelId: number;
}

// ── Dashboard ──

export interface PriceComparisonDto {
  modelName: string;
  imageUrl: string;
  sites: unknown[]; // API가 껍데기라 상세 타입 미정
}

export interface PriceComparisonParams {
  modelId: number;
}
