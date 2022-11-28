using System;
using System.Linq;
using Humanizer;
using SmartMoving.Core.Extensions;

namespace SmartMoving.Api.Features.Common
{
    public class SelectListOption : ISelectListOption<string>
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public SelectListOption()
        {
            
        }

        public SelectListOption(object id, string name)
        {
            Id = id?.ToString();
            Name = name;
        }

        public static SelectListOption[] MakeListForEnum<T>(bool humanize = false, T[] except = null) where T: Enum 
        {
            return Enum.GetValues(typeof(T))
                .Cast<T>()
                .Where(x => except is null || !except.Contains(x))
                .Select(x => new SelectListOption(x.ToString(), humanize ? x.Humanize() : x.Titleize()))
                .ToArray();
        }
    }
}