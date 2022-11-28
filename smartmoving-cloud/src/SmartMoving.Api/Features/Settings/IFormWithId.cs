using System;

namespace SmartMoving.Api.Features.Settings
{
    public interface IFormWithId
    {
        Guid? Id { get; set; }
    }
}