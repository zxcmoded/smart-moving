using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;

namespace SmartMoving.Core.Extensions
{
    public static class JsonExtensions
    {
        private static JsonSerializerSettings SerializerSettings => new JsonSerializerSettings
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver(),
            NullValueHandling = NullValueHandling.Ignore,
            Converters =
            {
                new StringEnumConverter()
            }
        };
        

        public static string ToJson<T>(this T value)
        {
            return value.ToJson(null);
        }

        public static string ToJson<T>(this T value, JsonSerializerSettings settings)
        {
            return JsonConvert.SerializeObject(value, settings ?? SerializerSettings);
        }

        public static string TryConvertToJson<T>(this T value)
        {
            try
            {
                return JsonConvert.SerializeObject(value, SerializerSettings);
            }
            catch (Exception ex)
            {
                return $"Serialization error: {ex.Message}";
            }
        }

        public static T FromJson<T>(this string value)
        {
            return value.FromJson<T>((JsonSerializerSettings)null);
        }

        public static T TryConvertFromJson<T>(this string value) where T : class
        {
            try
            {
                return value.FromJson<T>((JsonSerializerSettings)null);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public static T FromJson<T>(this string value, JsonSerializerSettings settings)
        {
            return JsonConvert.DeserializeObject<T>(value, settings ?? SerializerSettings);
        }

        // Can't use an optional parameter because it's used in expression trees.
        public static T FromJson<T>(this string value, Action<JsonSerializerSettings> overrides)
        {
            var settings = SerializerSettings;
            overrides?.Invoke(settings);
            return JsonConvert.DeserializeObject<T>(value, settings);
        }

        public static dynamic FromJsonDynamic(this string value)
        {
            return JsonConvert.DeserializeObject(value, SerializerSettings);
        }

        public static async Task<T> ReadAsJsonAsync<T>(this HttpContent content, JsonSerializerSettings serializerSettings = null)
        {
            return (await content.ReadAsStringAsync()).FromJson<T>(serializerSettings);
        }

        public static async Task<(HttpResponseMessage response, T parsedResult)> GetAsJsonAsync<T>(this HttpClient client, string url) where T : class
        {
            var response = await client.GetAsync(url);

            if (!response.IsSuccessStatusCode)
            {
                return (response, null);
            }

            string result = null;

            try
            {
                result = await response.Content.ReadAsStringAsync();
                var parsedResult = result.FromJson<T>();

                return (response, parsedResult);
            }
            catch (Exception exception)
            {
                throw new Exception($"Failed reading response. Code: {response.StatusCode}, Url: {url}, Result: {result}", exception);
            }
        }
        
    }
}
