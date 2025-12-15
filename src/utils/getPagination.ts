import { SITE } from '../config';

export interface PaginationResult<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export const getPagination = <T>(
  items: T[],
  page: number = 1,
  perPage: number = SITE.postPerPage
): PaginationResult<T> => {
  const totalPages = Math.ceil(items.length / perPage);
  const currentPage = Math.min(Math.max(1, page), totalPages || 1);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;

  return {
    data: items.slice(startIndex, endIndex),
    currentPage,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};
