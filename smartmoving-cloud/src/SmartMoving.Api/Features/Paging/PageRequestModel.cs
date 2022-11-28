using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace SmartMoving.Api.Features.Paging
{
    [ModelBinder(BinderType = typeof(PagerModelBinder))]
    public class PageRequestModel
    {
        public const int MAX_PAGE_SIZE = 200;
        
        private int _page = 1;
        public int Page
        {
            get => _page;
            set => _page = (value < 2 ? 1 : value);
        }

        private int _pageSize = MAX_PAGE_SIZE;

        public int PageSize 
        {
            get => _pageSize;
            set => _pageSize = (value >  MAX_PAGE_SIZE ? MAX_PAGE_SIZE : value);
        }

        public string Sort { get; set; }
    }

    public class PagerModelBinder : IModelBinder
    {
        public Task BindModelAsync(ModelBindingContext bindingContext)
        {
            var model = new PageRequestModel 
            {
                Page = int.Parse(bindingContext.ValueProvider.GetValue("page").ToString()),
                PageSize = int.Parse(bindingContext.ValueProvider.GetValue("pageSize").ToString())
            };

            var sort = bindingContext.ValueProvider.GetValue("sort");

            model.Sort = string.IsNullOrWhiteSpace(sort.ToString()) ? string.Empty : sort.ToString();

            bindingContext.Result = ModelBindingResult.Success(model);
            return Task.CompletedTask;
        }
    } 
}