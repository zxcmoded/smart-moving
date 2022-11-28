using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using NodaTime;
using SmartMoving.Core.Extensions;

[assembly: InternalsVisibleTo("SmartMoving.IntegrationSpecs")]
namespace SmartMoving.Core.Helpers
{
    public static class DateKey
    {
        public static int Today => From(DateTimeOffset.UtcNow.ToCentralTime());

        public static int MinValue => 10000101;

        public static string FromAsString(int year, int month, int day)
        {
            return $"{year}{month:D2}{day:D2}";
        }

        public static int From(LocalDate date)
        {
            return date.Day + date.Month * 100 + date.Year * 10000;
        }

        public static int From(int year, int month, int day)
        {
            if (year < 1000 || year > 9999)
            {
                throw new InvalidOperationException($"Invalid year: {year}");
            }

            if (month < 1 || month > 12)
            {
                throw new InvalidOperationException($"Invalid month: {month}");
            }

            if (day < 1 || day > 31)
            {
                throw new InvalidOperationException($"Invalid day: {day}");
            }

            return day + month * 100 + year * 10000;
        }
        
        /// <summary>
        /// This method is useful in working with datekeys when you want to retrieve feb 28/29 based on leap year (when stored as xxxx0229). 
        /// </summary>
        /// <param name="dateKey"></param>
        /// <returns></returns>
        public static int GetDateKeyWithLeapYearCheck(int dateKey)
        {
            return GetDateKeyWithLeapYearCheck(dateKey, DateTime.IsLeapYear(DateTimeOffset.UtcNow.Year));
        }
        
        // exposing for test purposes
        internal static int GetDateKeyWithLeapYearCheck(int dateKey, bool isLeapYear)
        {
            // check if feb 29th, if so and it isn't a leap year, then force it to feb 28th
            var monthAndDay = MonthAndDay(dateKey);
            if (monthAndDay == 0229 && !isLeapYear)
            {
                return From(Year(dateKey), 2, 28);
            }

            return dateKey;
        }
        
        /// <summary>
        /// if the date is feb 28th, always change that to the 29th, regardless of leap year
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static int SetLeapYearSafeDateKey(int value)
        {
            return MonthAndDay(value) == 0228 ? 
                From(Year(value), 02, 29) : 
                value;
        }

        public static int From(DateTimeOffset target)
        {
            return From(target.Year, target.Month, target.Day);
        }

        public static bool IsValid(int dateKey)
        {
            var day = Day(dateKey);
            var month = Month(dateKey);
            var year = Year(dateKey);

            return year >= 1000 && year <= 9999 &&
                   month >= 1 && month <= 12 &&
                   day >= 1 && day <= DateTime.DaysInMonth(year, month);
        }
        
        public static int GetFirstDayOfYearDateKey()
        {
            return new DateTime(DateTime.Now.Year, 1, 1).ToDateKey();
        }
        
        public static int GetLastDayOfYearDateKey()
        {
            return new DateTime(DateTime.Now.Year, 12, 31).ToDateKey();
        }

        public static (int year, int month, int day) ToParts(int dateKey)
        {
            return (Year(dateKey), Month(dateKey), Day(dateKey));
        }

        public static int Year(int dateKey)
        {
            return dateKey / 10000;
        }

        public static int Month(int dateKey)
        {
            return dateKey % 10000 / 100;
        }

        public static int Day(int dateKey)
        {
            return dateKey % 100;
        }

        public static int MonthAndDay(int dateKey)
        {
            return dateKey % 10000;
        }

        public static string Format(int dateKey)
        {
            return $"{Month(dateKey)}/{Day(dateKey)}/{Year(dateKey)}";
        }

        public static string FormatWithoutYear(int dateKey)
        {
            return $"{Month(dateKey)}/{Day(dateKey)}";
        }

        public static string FormatAsISOStandard(int dateKey)
        {
            return $"{Year(dateKey)}-{Month(dateKey):00}-{Day(dateKey):00}";
        }

        public static DayOfWeek DayOfWeek(int dateKey)
        {
            var day = Day(dateKey);
            var month = Month(dateKey);
            var year = Year(dateKey);

            var datetime = new DateTime(year, month, day, 12, 0, 0);

            return datetime.DayOfWeek;
        }

        public static IEnumerable<int> EnumerateDates(int startDateKey, int endDateKey)
        {
            if (startDateKey > endDateKey)
            {
                throw new InvalidOperationException("Start date was after end date.");
            }

            var date = startDateKey.FromJobDateKey();
            var dateKey = date.ToDateKey();

            yield return dateKey;

            while (true)
            {
                date = date.AddDays(1);
                dateKey = date.ToDateKey();

                if (dateKey > endDateKey)
                {
                    yield break;
                }

                yield return dateKey;
            }
        }

        public static DateTime ToDateTime(int targetDate)
        {
            return new DateTime(Year(targetDate), Month(targetDate), Day(targetDate));
        }
    }
}
