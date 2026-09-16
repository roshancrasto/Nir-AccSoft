using System;
using System.Collections.Generic;

namespace DemoProject.Data.Entities
{
    public class DashboardSummaryDto
    {
        public decimal CashInHand { get; set; }
        public decimal BankBalance { get; set; }
        public int ActiveEvents { get; set; }
        public List<RecentActivityDto> RecentActivities { get; set; } = new List<RecentActivityDto>();
    }

    public class RecentActivityDto
    {
        public string Action { get; set; } = string.Empty;
        public string Details { get; set; } = string.Empty;
        public string Time { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
        public DateTime ActivityDate { get; set; }
    }
}
