export class PageViewModel<T> {
  pageNumber: number;
  pageSize: number;
  lastPage: boolean;
  totalPages: number;
  totalResults: number;
  totalThisPage: number;
  pageResults: T[];
}
