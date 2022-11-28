namespace SmartMoving.Core.Extensions
{
    public enum DecimalRounding
    {
        /// <summary>
        /// Normal midpoint rounding.
        /// </summary>
        MidpointAwayFromZero,
        /// <summary>
        /// Always round up
        /// </summary>
        Up,
        /// <summary>
        /// Always round down
        /// </summary>
        Down,
    }
}