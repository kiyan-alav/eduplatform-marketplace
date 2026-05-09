export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string | null;
  data: T | null;
  meta: PaginationMeta | null;
  errors: unknown | null;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage?: boolean | null;
  hasPrevPage?: boolean | null;
}

export function buildApiResponse<T>({
  success,
  message = null,
  data = null,
  meta = null,
  errors = null,
}: {
  success: boolean;
  message?: string | null;
  data?: T | null;
  meta?: PaginationMeta | null;
  errors?: unknown | null;
}): ApiResponse<T> {
  return {
    success,
    message: message ?? null,
    data: data ?? null,
    meta: meta ?? null,
    errors: errors ?? null,
  };
}
