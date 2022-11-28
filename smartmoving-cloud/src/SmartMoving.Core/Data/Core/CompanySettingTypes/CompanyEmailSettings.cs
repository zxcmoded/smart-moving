namespace SmartMoving.Core.Data.Core.CompanySettingTypes
{
    // This is an owned entity, not a top-level entity. 
    public class CompanyEmailSettings
    {
        public string BackgroundColor { get; set; }

        public string FontColor { get; set; }

        public string SystemEmailFromAddress { get; set; }

        public string Footer { get; set; }

        public string InboundAddress { get; set; }

        public string PostmarkServerKey { get; set; }
    }
}