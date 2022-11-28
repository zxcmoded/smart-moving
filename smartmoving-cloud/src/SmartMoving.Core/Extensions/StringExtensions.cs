using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Text.RegularExpressions;
using Humanizer;
using SmartMoving.Core.Helpers;

namespace SmartMoving.Core.Extensions
{
    public static class StringExtensions
    {
        public static string TrimSafe(this string instance)
        {
            return string.IsNullOrEmpty(instance) ? instance : instance.Trim();
        }

        public static string TrimStart(this string instance, string value)
        {
            return instance.StartsWith(value) ? instance.Remove(0, value.Length) : instance;
        }

        public static string TrimAllStart(this string instance, params string[] values)
        {
            foreach (var value in values)
            {
                instance = instance.TrimStart(value);
            }

            return instance;
        }

        public static string ExtractEmailAddress(this string instance)
        {
            try
            {
                var mailAddress = new MailAddress(instance);

                return mailAddress.Address;
            }
            catch (Exception)
            {
                return instance;
            }
        }

        public static string TrimNonNumeric(this string instance)
        {
            return string.IsNullOrEmpty(instance) ? instance : Regex.Replace(instance, "[^0-9.]", "");
        }

        public static string TrimNonDigits(this string instance)
        {
            return string.IsNullOrEmpty(instance) ? instance : Regex.Replace(instance, "[^0-9]", "");
        }

        public static string TrimNonAlphaNumeric(this string instance)
        {
            return (string.IsNullOrWhiteSpace(instance) ? instance : Regex.Replace(instance, "[^0-9a-zA-Z ]", "").Replace("  ", " ")).TrimSafe();
        }

        public static string FormatAsPhoneNumber(this string value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return string.Empty;
            }

            return Regex.Replace(value, @"(\d{3})(\d{3})(\d{4})", "$1-$2-$3");
        }

        public static string FormatDateKey(this int dateKey)
        {
            return DateKey.Format(dateKey);
        }

        public static string ReplaceTokens(this string input, Dictionary<string, string> tokens)
        {
            var sb = new StringBuilder(input);
            //Apply longest tokens first, gets around issues like @SomeToken and @SomeTokenWithSuffix
            foreach (var token in tokens.OrderByDescending(x => x.Key.Length))
            {
                sb.Replace(token.Key, token.Value);
            }

            return sb.ToString();
        }

        public static string NullIfEmpty(this string input)
        {
            if (string.IsNullOrEmpty(input))
            {
                return null;
            }

            return input;
        }

        public static string NullIfWhitespace(this string input)
        {
            if (string.IsNullOrWhiteSpace(input))
            {
                return null;
            }

            return input;
        }

        public static string MakeSureEndsWithPeriod(this string input)
        {
            var trimmed = input.Trim();

            return trimmed.EndsWith(".") ? trimmed : $"{trimmed}.";
        }

        public static string Left(this string input, int count)
        {
            return (string.IsNullOrEmpty(input) || input.Length <= count) ? input : input.Substring(0, count);
        }

        public static string Right(this string input, int count)
        {
            return (string.IsNullOrEmpty(input) || input.Length <= count) ? input : input.Substring(input.Length - count, count);
        }

        public static string JoinNonNullEntries(this IEnumerable<string> input, string separator)
        {
            return string.Join(separator, input.Where(x => !string.IsNullOrWhiteSpace(x)));
        }

        /// <summary>
        /// Turns a list into a properly formatted sentence fragment, like "item 1, item 2, and item 3" or
        /// "item1 and item 2". 
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public static string SentenceJoinNonNullEntries(this IEnumerable<string> input)
        {
            var items = input.Where(x => !string.IsNullOrWhiteSpace(x)).ToArray();

            return items.Length > 1
                ? string.Join(", ", items.Take(items.Length - 1)) + $"{(items.Length > 2 ? "," : string.Empty)} and " + items.Last()
                : items.FirstOrDefault() ?? string.Empty;
        }

        public static string NormalizePhoneNumber(this string input)
        {
            if (string.IsNullOrEmpty(input))
            {
                return input;
            }

            var parts = Regex.Split(input, "(?:([eE][xX][tT])|[xX])");

            var phonePart = parts[0];
            var extensionPart = parts.Length > 1 ? $" ext {parts.Last().Trim()}" : null;

            phonePart = phonePart.TrimNonDigits();

            if (phonePart.Length == 10)
            {
                return $"{phonePart}{extensionPart}";
            }

            //Unknown format!
            return input;
        }

        public static string[] DelimitedListToArray(this string delimitedValue, bool trim = false)
        {
            return string.IsNullOrWhiteSpace(delimitedValue)
                ? new string[0]
                : delimitedValue.Split(',')
                                .Where(x => !string.IsNullOrWhiteSpace(x))
                                .Select(x => trim ? x.Trim() : x)
                                .ToArray();
        }

        public static (string FirstName, string LastName) SplitIntoFirstAndLastName(this string value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return (string.Empty, string.Empty);
            }

            var parts = value.Trim().Split(' ').Select(x => x.Trim()).ToArray();

            return (parts.First(), parts.Length > 1 ? parts.Last() : string.Empty);
        }

        public static string GetLastXCharacters(this string value, int count)
        {
            var result = value;

            if (!string.IsNullOrWhiteSpace(result) && result.Length > count)
            {
                result = result.Substring(result.Length - 4);
            }

            return result;
        }

        // Appends a QueryString Parameter with appropriate `?` or `&` separator
        // Will not append empty key-value parameters
        public static string AppendQueryStringParameter(this string value, string parameterName, string parameterValue)
        {
            var results = string.Empty;

            if (!string.IsNullOrWhiteSpace(parameterValue))
            {
                results = value.Contains("?")
                    ? $"&{parameterName}={parameterValue}"
                    : $"?{parameterName}={parameterValue}";
            }

            return value + results;
        }

        public static string ToCamelCase(this string value)
        {
            return char.ToLowerInvariant(value[0]) + value.Substring(1);
        }

        public static string RemoveSuffix(this string value, string suffix)
        {
            return value.EndsWith(suffix) ? value.Substring(0, value.Length - suffix.Length) : value;
        }

        public static string PluralizeIf(this string value, bool condition)
        {
            return condition ? value.Pluralize() : value;
        }

        public static bool ContainsAny(this string value, params string[] searches)
        {
            return searches.Any(value.Contains);
        }
    }
}