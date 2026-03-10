import http, { unwrap } from './http';
import type { CursorPage, ModelDto, ModelTypeDto, ModelsParams } from '@/types/api';

/** GET /api/models — 커서 페이징 */
export function getModels(params?: ModelsParams) {
  return unwrap<CursorPage<ModelDto>>(http.get('/api/models', { params }));
}

/** GET /api/models/types */
export function getModelTypes() {
  return unwrap<ModelTypeDto[]>(http.get('/api/models/types'));
}

/** GET /api/models/count */
export function getModelCount() {
  return unwrap<number>(http.get('/api/models/count'));
}
