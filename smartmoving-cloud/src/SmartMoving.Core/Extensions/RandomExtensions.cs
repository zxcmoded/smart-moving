using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace SmartMoving.Core.Extensions
{
    public static class RandomExtensions
    {
        private static readonly Random Rand = new Random();

        public static IEnumerable<T> TakeRandom<T>(this IEnumerable<T> source, int count)
        {
            return source.OrderBy(_ => Guid.NewGuid()).Take(count);
        }

        public static IEnumerable<T> TakeRandom<T>(this IEnumerable<T> source, int min, int max)
        {
            var count = Rand.Next(min, max);

            return source.OrderBy(_ => Guid.NewGuid()).Take(count);
        }

        public static T TakeSingleRandom<T>(this IEnumerable<T> source)
        {
            return source.TakeRandom(1).SingleOrDefault();
        }

        public static async Task<T> TakeSingleRandomAsync<T>(this IQueryable<T> source) where T : class
        {
            return (await source.ToArrayAsync()).TakeRandom(1).SingleOrDefault();
        }

        public static T GetRandomEnum<T>(this Random rand, Func<T, bool> filter = null)
        {
            var possibleValues = Enum.GetValues(typeof(T));

            return possibleValues.Cast<T>().Where(filter ?? (_ => true)).TakeSingleRandom();
        }

        public static bool GetBoolean(this Random rand)
        {
            return rand.Next() % 2 == 0;
        }

        public static string RandomDigitString(this Random rand, int length)
        {
            return string.Join("", Enumerable.Range(0, length)
                .Select(x => rand.Next(0, 10).ToString()));
        }

        public static string GetRandomPlatformId(this Random rand)
        {
            return rand.Next(1234522, 9234652).ToString();
        }
        
        public static string RandomString(this Random rand, int length)
        {
            var chars = "BDEFGHIJKLMNOPQRSTVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length).Select(s => s[rand.Next(s.Length)]).ToArray());
        }
    }
}
