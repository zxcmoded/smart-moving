using System;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Newtonsoft.Json;
using SmartMoving.Core.Data.Core;
using SmartMoving.Core.Extensions;

namespace SmartMoving.Core.Data
{
    public static class EFConfigurationExtensions
    {
        public static PropertyBuilder<T> HasLatLngColumnType<T>(this PropertyBuilder<T> builder)
        {
            return builder.HasColumnType("decimal(10,7)");
        }

        public static PropertyBuilder<T> StoreEnumAsString<T>(this PropertyBuilder<T> builder) where T : struct
        {
            var converter = new EnumToStringConverter<T>();

            return builder.HasConversion(converter);
        }

        public static PropertyBuilder<T> StoreAsJson<T>(this PropertyBuilder<T> builder)
        {
            var converter = new ValueConverter<T, string>(
                x => x.ToJson(),
                x => x.FromJson<T>());

            var comparer = new ValueComparer<T>(
                (l, r) => l.ToJson() == r.ToJson(),
                x => x == null ? 0 : x.ToJson().GetHashCode(),
                x => x.ToJson().FromJson<T>());

            builder.HasConversion(converter);
            builder.Metadata.SetValueConverter(converter);
            builder.Metadata.SetValueComparer(comparer);

            return builder;
        }
    }
}