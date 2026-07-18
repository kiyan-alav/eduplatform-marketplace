export interface PaginationParams {
  page: number;
  limit: number;
}

interface PaginationMeta {
  totalDocs: number;
  limit: number;
  page: number;
}

export function buildPagination({ page, limit }: PaginationParams) {
  const skip = (page - 1) * limit;
  const take = limit;

  return { skip, take };
}

export function paginationMeta({ limit, page, totalDocs }: PaginationMeta) {
  const totalPages = Math.ceil(totalDocs / limit);
  const hasPrevPage = page > 1;
  const hasNextPage = page < totalPages;

  return { totalPages, hasNextPage, hasPrevPage };
}
