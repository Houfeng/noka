export type PagingOptions = {
  skip: number;
  limit: number;
};

export type PagingResult<T> = {
  total: number;
  items: T[];
};
