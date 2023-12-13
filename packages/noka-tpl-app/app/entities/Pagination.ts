export type PaginationOptions = {
  skip: number;
  limit: number;
};

export type PaginationResult<T> = {
  total: number;
  items: T[];
};
