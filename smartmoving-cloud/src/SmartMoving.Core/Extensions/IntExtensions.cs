namespace SmartMoving.Core.Extensions
{
    public static class IntExtensions
    {
        public static string DashIfZero(this int number) => number == 0 ? "--" : number.ToString();
    }
}