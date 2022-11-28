namespace SmartMoving.Core.Data.Core
{
    // This is an owned entity.
    public class BranchAddress
    {
        public string FullAddress { get; set; }

        public string Street { get; set; }

        public string Unit { get; set; }

        public string City { get; set; }

        public string State { get; set; }

        public string Zip { get; set; }

        public decimal Lat { get; set; }

        public decimal Lng { get; set; }

        public override string ToString()
        {
            return Address.FormatFromComponents(Street, City, State, Zip);
        }
    }
}