namespace SmartMoving.Api.Features.Common
{
    public interface ISelectListOption<T>
    {
        public T Id { get; set; }
        
        public string Name { get; set; }
    }
}