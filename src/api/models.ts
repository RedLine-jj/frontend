import http, { unwrap } from "./http";
import type {
  CursorPage,
  ModelDto,
  ModelTypeDto,
  ModelsParams,
} from "@/types/api";

/** GET /api/models — 커서 페이징 */
export function getModels(params?: ModelsParams) {
  const requestParams = { ...params };

  // brandIds 배열을 콤마로 구분된 문자열로 변환
  if (requestParams.brandIds && requestParams.brandIds.length > 0) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    requestParams.brandIds = requestParams.brandIds.join(",");
  } else {
    delete requestParams.brandIds;
  }

  // types 배열을 콤마로 구분된 문자열로 변환
  if (requestParams.types && requestParams.types.length > 0) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    requestParams.types = requestParams.types.join(",");
  } else {
    delete requestParams.types;
  }

  return unwrap<CursorPage<ModelDto>>(
    http.get("/api/models", { params: requestParams }),
  );
}

/** GET /api/models/types */
export function getModelTypes() {
  return unwrap<ModelTypeDto[]>(http.get("/api/models/types"));
}

/** GET /api/models/count */
export function getModelCount() {
  return unwrap<number>(http.get("/api/models/count"));
}

/** GET /api/models/:id */
export function getModel(id: number) {
  return unwrap<ModelDto>(http.get(`/api/models/${id}`));
}
