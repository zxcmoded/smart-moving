namespace SmartMoving.Api.Features.Common
{
    public class SelectListDecimalOption : ISelectListOption<decimal>
    {
        public decimal Id { get; set; }

        public string Name { get; set; }

        public SelectListDecimalOption()
        {
            
        }

        public SelectListDecimalOption(decimal id, string name)
        {
            Id = id;
            Name = name;
        }
    }
}