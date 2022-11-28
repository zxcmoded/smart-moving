using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GlobalExceptionHandler.WebApi;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using SmartMoving.Api.Infrastructure.Authorization;
using SmartMoving.Core.Data.Security;
using SmartMoving.Core.Extensions;
using SmartMoving.Data.Contexts;
using static Microsoft.AspNetCore.Http.HttpMethods;

namespace SmartMoving.Api.Infrastructure.Startup
{
    public static class MvcStartupExtensions
    {
        public static void AddMvcWithAuth(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddResponseCaching();

            services.AddCors(options =>
            {
                // SmartMoving client web-app policy
                options.AddPolicy(CorsPolicy.SmClient,
                    builder =>
                    {
                        var allowedOrigins = configuration.GetSection("Cors:ClientAllowedOrigins")
                                                          .AsEnumerable()
                                                          .Where(x => !string.IsNullOrEmpty(x.Value))
                                                          .Select(x => x.Value)
                                                          .ToArray();

                        builder.WithOrigins(allowedOrigins)
                               // note: need to allow wildcards here due to ngrok usage
                               .SetIsOriginAllowedToAllowWildcardSubdomains()
                               .WithMethods(Get, Put, Post, Delete)
                               .AllowAnyHeader();
                    });

                // SmartMoving public
                options.AddPolicy(CorsPolicy.SmPublic,
                    builder =>
                    {
                        builder.AllowAnyOrigin()
                               .WithMethods(Get, Put, Post, Delete)
                               .AllowAnyHeader();
                    });
            });

            //Good overview of auth issues: https://fullstackmark.com/post/13/jwt-authentication-with-aspnet-core-2-web-api-angular-5-net-core-identity-and-facebook-login
            //More: https://github.com/mmacneil/AngularASPNETCore2WebApiAuth/tree/master/src
            services.AddMvc(config =>
                    {
                        var policy = new AuthorizationPolicyBuilder(IdentityConstants.ApplicationScheme, JwtBearerDefaults.AuthenticationScheme)
                                     .RequireAuthenticatedUser()
                                     .Build();

                        config.Filters.Add(new AuthorizeFilter(policy));
                    })
                    .AddNewtonsoftJson(x =>
                    {
                        x.SerializerSettings.Converters.Add(new StringEnumConverter());
                        x.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                    });

            services.Configure<TokenProviderOptions>(configuration.GetSection("TokenProviderOptions"));

            services.AddAuthentication(IdentityConstants.ApplicationScheme)
                    .AddCookie(IdentityConstants.ApplicationScheme, x =>
                    {
                        x.Events.OnRedirectToAccessDenied =
                            x.Events.OnRedirectToLogin = c =>
                            {
                                c.Response.StatusCode = StatusCodes.Status401Unauthorized;
                                return Task.CompletedTask;
                            };
                    });

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                    .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, x =>
                    {
                        var signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(configuration.GetSection("TokenProviderOptions:SecretKey").Value));

                        var tokenValidationParameters = new TokenValidationParameters
                        {
                            RequireExpirationTime = true,
                            RequireSignedTokens = true,
                            ValidateIssuerSigningKey = true,
                            IssuerSigningKey = signingKey,
                            ValidateIssuer = true,
                            ValidIssuer = configuration.GetSection("TokenProviderOptions:Issuer").Value,
                            ValidateAudience = true,
                            ValidAudience = configuration.GetSection("TokenProviderOptions:Audience").Value,
                            ValidateLifetime = true,
                            ClockSkew = TimeSpan.Zero
                        };

                        x.Audience = configuration.GetSection("TokenProviderOptions:Audience").Value;
                        x.ClaimsIssuer = configuration.GetSection("TokenProviderOptions:Issuer").Value;
                        x.TokenValidationParameters = tokenValidationParameters;
                        x.SaveToken = true;

                        x.Events = new JwtBearerEvents()
                        {
                            OnMessageReceived = context =>
                            {
                                var accessToken = context.Request.Query["access_token"];

                                // If the request is for our hub...
                                var path = context.HttpContext.Request.Path;
                                if (!string.IsNullOrEmpty(accessToken) &&
                                    (path.StartsWithSegments("/api/hub/sync")))
                                {
                                    // Read the token out of the query string
                                    context.Token = accessToken;
                                }

                                return Task.CompletedTask;
                            }
                        };
                    });

            services.AddAuthorization(x =>
            {
                foreach (var permission in EnumHelper.GetAll<Permission>())
                {
                    x.AddPolicy(permission.ToString(), policy => policy.Requirements.Add(new PermissionRequirement(permission)));
                }
            });

            services.AddSingleton<IAuthorizationHandler, PermissionHandler>();

            services.Configure<IdentityOptions>(options =>
            {
                // Password settings
                options.Password.RequireDigit = true;
                options.Password.RequiredLength = 8;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = true;
                options.Password.RequireLowercase = false;
                options.Password.RequiredUniqueChars = 6;

                // Lockout settings
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(30);
                options.Lockout.MaxFailedAccessAttempts = 10;
                options.Lockout.AllowedForNewUsers = true;

                // User settings
                options.User.RequireUniqueEmail = true;
            });

            var identityBuilder = services.AddIdentityCore<AppUser>(options =>
            {
                // Password settings
                options.Password.RequireDigit = true;
                options.Password.RequiredLength = 8;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = true;
                options.Password.RequireLowercase = false;
                options.Password.RequiredUniqueChars = 6;

                // Lockout settings
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(30);
                options.Lockout.MaxFailedAccessAttempts = 10;
                options.Lockout.AllowedForNewUsers = true;

                // User settings
                options.User.RequireUniqueEmail = true;
            });

            identityBuilder = new IdentityBuilder(identityBuilder.UserType, typeof(AppRole), identityBuilder.Services);
            identityBuilder
                .AddEntityFrameworkStores<AppDbContext>()
                .AddDefaultTokenProviders()
                .AddSignInManager();

            services.AddSession();
        }

        public static void UseMvcWithAppSettings(this IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseRouting();

            app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            app.UseMaintainCorsHeaders();

            app.UseExceptionHandler("/api/error");
            app.UseGlobalExceptionHandler(x =>
            {
                x.ContentType = "application/json";
                x.ResponseBody(exception => JsonConvert.SerializeObject(new
                {
                    Message = "An error occurred whilst processing your request",
                    Exception = env.IsEnvironment("Local") || env.IsDevelopment() ? exception.ToString() : string.Empty
                }, Formatting.Indented, new JsonSerializerSettings
                {
                    ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                }));
            });

            app.Map("/api/error", x => x.Run(_ => throw new InvalidOperationException("Error route hit!")));

            if (env.IsEnvironment("Local"))
            {
                app.UseDeveloperExceptionPage();
                //                Console.WriteLine("What do I have? ");
                //                Console.WriteLine("----------------------------------");
                //                Console.WriteLine(Container.WhatDoIHave());
                //                Console.WriteLine("----------------------------------");
                //                Console.WriteLine("What did I scan?");
                //                Console.WriteLine("----------------------------------");
                //                Console.WriteLine(Container.WhatDidIScan());
            }
            else
            {
                app.UseHsts();
                app.UseHttpsRedirection();
            }

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseResponseCaching();

            // Used in Hangfire
            app.UseSession();
            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
        }
    }
}