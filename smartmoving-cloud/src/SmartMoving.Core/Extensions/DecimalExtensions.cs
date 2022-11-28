using System;
using System.Globalization;

namespace SmartMoving.Core.Extensions
{
    public static class DecimalExtensions
    {
        public static string FormatAsCurrency(this decimal value, bool showZeroAsNumber = false, int precision = 2)
        {
            return FormatAsCurrency((decimal?)value, showZeroAsNumber, precision);
        }

        public static string FormatAsHighPrecisionCurrency(this decimal value, bool showZeroAsNumber = false)
        {
            return FormatAsCurrency(value, showZeroAsNumber, 4);
        }

        public static string FormatAsCurrency(this decimal? value, bool showZeroAsNumber = false, int precision = 2)
        {
            var currencyFormat = $"C{precision}";

            if (value == null)
            {
                return showZeroAsNumber ? 0.ToString(currencyFormat) : "--";
            }

            if (value == 0)
            {
                return showZeroAsNumber ? value.Value.ToString(currencyFormat) : "--";
            }

            var formattedStringVal = value.Value.ToString(currencyFormat);

            // need to strip trailing zeros after 2nd decimal position
            return precision > 2 ? formattedStringVal.RemoveTrailingZeros() : formattedStringVal;
        }

        public static string FormatAsPercentWithoutTrailingZeros(this decimal value)
        {
            return $"{(value * 100).ToString(CultureInfo.InvariantCulture).RemoveTrailingZeros(false)}%";
        }

        public static string RemoveTrailingZeros(this string numberToParse, bool preserveMinimumOf2DecimalPrecision = true)
        {
            var splitNumberAtDecimal = numberToParse.Split('.');
            var decimals = splitNumberAtDecimal.Length > 1 ? splitNumberAtDecimal[1] : string.Empty;
            var lastIndexOfZero = decimals.LastIndexOf("0", StringComparison.Ordinal);

            var lastIndexCutoff = preserveMinimumOf2DecimalPrecision ? 2 : 0;

            // trim the last zero if it's greater than 2 decimal places and is in the final position, then recursive fun
            if (lastIndexOfZero >= lastIndexCutoff && lastIndexOfZero == decimals.Length - 1)
            {
                decimals = decimals.Remove(lastIndexOfZero);
                return $"{splitNumberAtDecimal[0]}.{decimals}".RemoveTrailingZeros(preserveMinimumOf2DecimalPrecision);
            }

            // decimals will be empty if all trailing zeros are stripped, so turn into whole number when not preserving 2 decimal precision
            return string.IsNullOrWhiteSpace(decimals) ? splitNumberAtDecimal[0] : $"{splitNumberAtDecimal[0]}.{decimals}";
        }

        public static string FormatAsPercent(this decimal value, bool showZeroAsPercent = false)
        {
            return FormatAsPercent((decimal?)value, showZeroAsPercent);
        }

        public static string FormatAsPercent(this decimal? value, bool showZeroAsPercent = false)
        {
            if (value == null || value == 0)
            {
                return showZeroAsPercent ? 0.ToString("P0") : "--";
            }

            return value.Value.ToString("P").Replace(".00", "");
        }

        public static string FormatAsNumber(this decimal value, bool showZeroDecimals = false)
        {
            return FormatAsNumber((decimal?)value, showZeroDecimals);
        }

        public static string FormatAsNumber(this decimal? value, bool showZeroDecimals = false)
        {
            if (value == null || value == 0)
            {
                return "--";
            }

            return value.Value.ToString($"0.{(showZeroDecimals ? "00" : "##")}");
        }

        public static decimal RoundToNearestHalf(this decimal value)
        {
            return Math.Round(value * 2, MidpointRounding.AwayFromZero) / 2;
        }

        public static decimal RoundToNearest(this decimal value, int nearestAmount, DecimalRounding rounding = DecimalRounding.MidpointAwayFromZero)
        {
            return rounding switch
            {
                DecimalRounding.MidpointAwayFromZero => Math.Round(value / nearestAmount) * nearestAmount,
                DecimalRounding.Up => Math.Ceiling(value / nearestAmount) * nearestAmount,
                DecimalRounding.Down => Math.Floor(value / nearestAmount) * nearestAmount,
                _ => throw new ArgumentOutOfRangeException(nameof(rounding), rounding, null)
            };
        }
    }
}