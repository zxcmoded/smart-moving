using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using SmartMoving.Api.Infrastructure;
using SmartMoving.Data;
using SmartMoving.Data.Contexts;

namespace SmartMoving.Api.Features.Settings.Company
{
    [ApiController,
     Authorize,
     EnableCors(CorsPolicy.SmClient),
     StandardRoute("settings/company")]
    public class CompanySettingsController : SettingsControllerBase<CompanySettingsModel, Core.Data.Core.Company>
    {
        public CompanySettingsController(AppDbContext context, IMapper mapper) : base(context, mapper)
        {
        }
    }
}