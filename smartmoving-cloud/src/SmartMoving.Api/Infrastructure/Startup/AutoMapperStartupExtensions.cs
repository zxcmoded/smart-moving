using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using AutoMapper;
using Microsoft.Extensions.DependencyInjection;

namespace SmartMoving.Api.Infrastructure.Startup
{
    public interface IMapFrom<T>
    {
    }

    public interface IMapTo<T>
    {
    }

    public interface IMapToAndFrom<T>
    {
    }

    public interface IHaveCustomMappings
    {
        void CreateMappings(IProfileExpression profile);
    }

    public class SmartMovingHeroicAutoMapperProfile : HeroicAutoMapperProfile
    {
        public SmartMovingHeroicAutoMapperProfile()
        {
            AssemblyFilter = x => x.Name.StartsWith("SmartMoving");
        }
    }

    public abstract class HeroicAutoMapperProfile : Profile
    {
        protected Func<AssemblyName, bool> AssemblyFilter {get; set; } = null;

        public HeroicAutoMapperProfile()
        {
            var target = GetType().Assembly;

            Func<AssemblyName, bool> loadAllFilter = x => true;

            var assembliesToLoad = target.GetReferencedAssemblies()
                        .Where(AssemblyFilter ?? loadAllFilter)
                        .Select(a => Assembly.Load(a))
                        .ToList();

            assembliesToLoad.Add(target);

            LoadMapsFromAssemblies(assembliesToLoad.ToArray());
        }

        private void LoadMapsFromAssemblies(params Assembly[] assemblies)
        {
            var types = assemblies.SelectMany(a => a.GetExportedTypes()).ToArray();

            LoadIMapFromMappings(types);
            LoadIMapToMappings(types);
            LoadCustomMappings(types);
        }

        private void LoadIMapFromMappings(IEnumerable<Type> types)
        {
            var maps = (from t in types
                        from i in t.GetInterfaces()
                        where i.IsGenericType && 
                              (i.GetGenericTypeDefinition() == typeof(IMapFrom<>) || i.GetGenericTypeDefinition() == typeof(IMapToAndFrom<>)) &&
                              !t.IsAbstract &&
                              !t.IsInterface
                        select new
                        {
                            Source = i.GetGenericArguments()[0],
                            Destination = t
                        }).ToArray();

            foreach (var map in maps)
            {
                CreateMap(map.Source, map.Destination);
            }
        }

        private void LoadIMapToMappings(IEnumerable<Type> types)
        {
            var maps = (from t in types
                        from i in t.GetInterfaces()
                        where i.IsGenericType && 
                              (i.GetGenericTypeDefinition() == typeof(IMapTo<>) || i.GetGenericTypeDefinition() == typeof(IMapToAndFrom<>)) &&
                              !t.IsAbstract &&
                              !t.IsInterface
                        select new
                        {
                            Destination = i.GetGenericArguments()[0],
                            Source = t
                        }).ToArray();

            foreach (var map in maps)
            {
                CreateMap(map.Source, map.Destination);
            }
        }
        
        private void LoadCustomMappings(IEnumerable<Type> types)
        {
            var maps = types
                .Where(t => !t.IsAbstract && !t.IsInterface)
                .Where(t => t.GetInterfaces()
                    .Any(i => typeof(IHaveCustomMappings).IsAssignableFrom(t)))
                .Select(t => (IHaveCustomMappings)Activator.CreateInstance(t))
                .ToArray();

            foreach (var map in maps)
            {
                map.CreateMappings(this);
            }
        }
    }

    public static class AutoMapperStartupExtensions
    {
        public static void AddHeroicAutoMapper<TProfileType>(this IServiceCollection services)
        {
            services.AddAutoMapper(typeof(TProfileType).Assembly);
        }
    }
}
