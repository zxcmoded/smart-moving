using System;
using System.Collections.Generic;
using NodaTime;
using SmartMoving.Core.Helpers;

namespace SmartMoving.Core.Extensions
{
    public static class DateTimeOffsetExtensions
    {
        public const string CentralTimeZoneIdForWindows = "Central Standard Time";
        public const string CentralTimeZoneIdForNix = "America/Chicago";

        private static TimeZoneInfo FindCentralTime()
        {
            try
            {
                return TimeZoneInfo.FindSystemTimeZoneById(CentralTimeZoneIdForWindows);
            }
            catch (TimeZoneNotFoundException)
            {
                try
                {
                    return TimeZoneInfo.FindSystemTimeZoneById("CentralTimeZoneIdForNix");
                }
                catch (TimeZoneNotFoundException)
                {
                    return TimeZoneInfo.Utc;
                }
            }
        }

        public static double GetCentralTimeOffsetMinutes(this DateTime datetime)
        {
            //Let's find the TZI for Central time...
            var centralTimeZone = FindCentralTime();
            //Since Central Time uses Daylight Savings Time for part of the year, we need
            //to see what offset to use for our target datetime.
            var centralTimeOffset = centralTimeZone.GetUtcOffset(datetime);

            return centralTimeOffset.TotalMinutes;
        }

        public static DateTimeOffset AsCentralTime(this DateTime datetime)
        {
            //Let's find the TZI for Central time...
            var centralTimeZone = FindCentralTime();
            //Since Central Time uses Daylight Savings Time for part of the year, we need
            //to see what offset to use for our target datetime.
            var centralTimeOffset = centralTimeZone.GetUtcOffset(datetime);

            return new DateTimeOffset(datetime, centralTimeOffset);
        }

        public static DateTimeOffset ToCentralTime(this DateTimeOffset datetimeUtc)
        {
            //Let's find the TZI for Central time...
            var centralTimeZone = FindCentralTime();
            //Since Central Time uses Daylight Savings Time for part of the year, we need
            //to see what offset to use for our target datetime.
            var centralTimeOffset = centralTimeZone.GetUtcOffset(datetimeUtc);

            //So, now let's see what time it is in Central.  Note that this might change
            //the date!!  If it was 4am on 1/26/2017 in UTC, our result here will be
            //11pm on the 25th!  
            var timeInCentral = datetimeUtc.ToOffset(centralTimeOffset);

            return timeInCentral;
        }

        public static int GetUtcOffsetForCentral(this DateTimeOffset datetimeUtc)
        {
            var centralTimeZone = FindCentralTime();
            
            var centralTimeOffset = centralTimeZone.GetUtcOffset(datetimeUtc);

            return (int)centralTimeOffset.TotalHours;
        }

        public static DateTimeOffset ToStartOfDayCentralTime(this DateTimeOffset datetimeUtc)
        {
            var timeInCentral = datetimeUtc.ToCentralTime();

            //Now we have the current day and time, in central time, and we want the start of
            //the day, so let's just clear the time component...
            var startOfDateInCentral = timeInCentral.Subtract(timeInCentral.TimeOfDay);

            return startOfDateInCentral;
        }

        public static DateTimeOffset ToStartOfDay(this DateTimeOffset dateTimeUtc)
        {
            return dateTimeUtc.Subtract(dateTimeUtc.TimeOfDay);
        }

        public static DateTimeOffset ToEndOfDay(this DateTimeOffset datetimeUtc)
        {
            var timeUntilMidnight = TimeSpan.FromHours(24) - datetimeUtc.TimeOfDay;
            var endOfDate = datetimeUtc.Add(timeUntilMidnight).AddSeconds(-1);

            return endOfDate;
        }

        public static DateTimeOffset ToEndOfDayCentralTime(this DateTimeOffset datetimeUtc)
        {
            var timeInCentral = datetimeUtc.ToCentralTime();

            //Now we have the current day and time, in central time, and we want the *end* of
            //the day, so let's advance the time to the end of the day...
            var timeUntilMidnight = TimeSpan.FromHours(24) - timeInCentral.TimeOfDay;
            var endOfDateInCentral = timeInCentral.Add(timeUntilMidnight);

            //And now we can move this back to UTC.  
            endOfDateInCentral = endOfDateInCentral.ToUniversalTime();

            return endOfDateInCentral;
        }

        public static DateTimeOffset ToStartOfWeek(this DateTimeOffset datetimeUtc)
        {
            var startOfDay = datetimeUtc.ToStartOfDay();

            //Now we have the current day, we want the start of the week, so take off the days...
            var startOfWeek = startOfDay.AddDays(-(int)startOfDay.DayOfWeek);

            return startOfWeek;
        }

        public static DateTimeOffset ToEndOfWeek(this DateTimeOffset datetimeUtc)
        {
            var startOfWeek = datetimeUtc.ToStartOfWeek();

            return startOfWeek.AddDays(7).AddSeconds(-1);
        }

        public static DateTimeOffset ToStartOfWeekCentralTime(this DateTimeOffset datetimeUtc)
        {
            var timeInCentral = datetimeUtc.ToStartOfDayCentralTime();

            //Now we have the current day, we want the start of the week, so take off the days...
            var startOfWeek = timeInCentral.AddDays(-(int)timeInCentral.DayOfWeek);

            return startOfWeek;
        }

        public static DateTimeOffset ToEndOfWeekCentralTime(this DateTimeOffset datetimeUtc)
        {
            var timeInCentral = datetimeUtc.ToStartOfDayCentralTime();

            //Now we have the current day, we want the end of the week, so let's move forward to the first day of the next week...
            var startOfNextWeek = timeInCentral.AddDays(7 - (int)timeInCentral.DayOfWeek);

            //And now we can move it back to 11:59 the previous day...
            var endOfWeekInCentral = startOfNextWeek.AddSeconds(-1);

            return endOfWeekInCentral;
        }

        public static DateTimeOffset ToStartOfMonthCentralTime(this DateTimeOffset datetimeUtc)
        {
            var timeInCentral = datetimeUtc.ToStartOfDayCentralTime();

            //Now we have the current day, let's back it up to the first day of the month
            var startOfMonth = timeInCentral.AddDays(-(timeInCentral.Day-1));

            return startOfMonth;
        }

        public static DateTimeOffset ToEndOfMonthCentralTime(this DateTimeOffset datetimeUtc)
        {
            var timeInCentral = datetimeUtc.ToStartOfDayCentralTime();

            //Now we have the current day, let's back it up to the first day of the month
            var startOfMonth = timeInCentral.AddDays(-(timeInCentral.Day-1));

            //And now we can advance to the end of the month.
            var endOfMonth = startOfMonth.AddMonths(1).AddSeconds(-1);

            return endOfMonth;
        }

        public static DateTimeOffset ToStartOfMonth(this DateTimeOffset datetimeUtc)
        {
            var time = datetimeUtc.ToStartOfDay();

            //Now we have the current day, let's back it up to the first day of the month
            var startOfMonth = time.AddDays(-(time.Day-1));

            return startOfMonth;
        }

        public static DateTimeOffset ToEndOfMonth(this DateTimeOffset datetimeUtc)
        {
            var time = datetimeUtc.ToStartOfDay();

            //Now we have the current day, let's back it up to the first day of the month
            var startOfMonth = time.AddDays(-(time.Day-1));

            //And now we can advance to the end of the month.
            var endOfMonth = startOfMonth.AddMonths(1).AddSeconds(-1);

            return endOfMonth;
        }

        public static int ToDateKey(this DateTimeOffset date)
        {
            return DateKey.From(date);
        }

        public static int ToDateKey(this DateTimeOffset? date)
        {
            if (!date.HasValue)
            {
                return 0;
            }

            return DateKey.From(date.Value);
        }

        public static int ToDateKey(this DateTime date)
        {
            return DateKey.From(date);
        }

        public static DateTimeOffset FromJobDateKey(this int key)
        {
            var date = new DateTime(DateKey.Year(key), DateKey.Month(key), DateKey.Day(key));

            var centralTimeZone = FindCentralTime();
            var centralTimeOffset = centralTimeZone.GetUtcOffset(date);

            var datetime = new DateTimeOffset(date, centralTimeOffset);
            return datetime;
        }

        public static bool IsWeekend(this DateTimeOffset datetime)
        {
            return datetime.DayOfWeek == DayOfWeek.Saturday ||
                   datetime.DayOfWeek == DayOfWeek.Sunday;
        }

        public static string FormatDateTimeForDisplay(this DateTimeOffset? datetime)
        {
            return !datetime.HasValue ? "--" : datetime.Value.FormatDateTimeForDisplay();
        }

        public static string FormatDateTimeForDisplay(this DateTimeOffset datetime)
        {
            return datetime.ToString("g");
        }

        public static string FormatDateOnlyForDisplay(this DateTimeOffset datetime)
        {
            return datetime.ToString("M/d/yyyy");
        }

        public static string FormatDateOnlyForDisplay(this DateTime datetime)
        {
            return datetime.ToString("M/d/yyyy");
        }

        public static DateTimeOffset ToStartOfMinuteInterval(this DateTimeOffset datetime, int minuteInterval)
        {
            var now = DateTimeOffset.UtcNow;
            var test = new DateTimeOffset(datetime.Year, datetime.Month, datetime.Day, datetime.Hour, 0, 0, 0, datetime.Offset).AddMinutes(-minuteInterval);

            while (test < now)
            {
                test = test.AddMinutes(minuteInterval);
            }

            return test.AddMinutes(-minuteInterval);
        }

        public static DateTimeOffset Localize(this DateTimeOffset datetime, string ianaTzdbTimeZone)
        {
            var zone = DateTimeZoneProviders.Tzdb[ianaTzdbTimeZone];

            var zonedTime = ZonedDateTime.FromDateTimeOffset(datetime).WithZone(zone);

            return zonedTime.ToDateTimeOffset();
        }

        public static DateTimeOffset GetNextValidTimeDayHappens(this DateTimeOffset startingFrom, int dayOfMonth)
        {
            return startingFrom.Date.GetNextValidTimeDayHappens(dayOfMonth);
        }

        public static DateTime GetNextValidTimeDayHappens(this DateTime startingFrom, int dayOfMonth)
        {
            DateTime potentialDate;

            try
            {
                potentialDate = new DateTime(startingFrom.Year, startingFrom.Month, dayOfMonth);
            }
            catch
            {
                // Some invalid date, like Feb 31st
                potentialDate = new DateTimeOffset(startingFrom).ToEndOfMonthCentralTime().ToStartOfDay().DateTime;
            }

            if (startingFrom.ToDateKey() > potentialDate.ToDateKey())
            {
                potentialDate = GetNextValidTimeDayHappens(potentialDate.AddMonths(1), dayOfMonth);
            }

            return potentialDate;
        }
    }
}
