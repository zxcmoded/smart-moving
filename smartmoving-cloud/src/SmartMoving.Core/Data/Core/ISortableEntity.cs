using System;

namespace SmartMoving.Core.Data.Core
{
    public interface ISortableEntity
    {
        Guid Id { get; set; }
        
        int SortOrder { get; set; }
    }

    public interface ISortableEntityWithName : ISortableEntity
    {
        public string Name { get; set; }
    }
}