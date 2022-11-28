using System;

namespace SmartMoving.Api.Features.Paging
{
    public class PageViewModel<T> where T : class
    {
        public int PageNumber { get; set; }

        public int PageSize { get; set; }

        public bool LastPage => PageNumber * PageSize >= TotalResults;

        public int TotalPages => (int)Math.Ceiling((double)TotalResults / PageSize);

        public int TotalResults { get; set; }

        public int TotalThisPage { get; set; }

        public T[] PageResults { get; set; }
    }
}