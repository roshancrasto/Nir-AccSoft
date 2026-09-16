using Dapper;
using DemoProject.Data.ConnectionFactory;
using DemoProject.Data.Entities;
using DemoProject.Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace DemoProject.Repository.Implementations
{
    public class DashboardRepository : IDashboardRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;

        public DashboardRepository(IDbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<DashboardSummaryDto> GetDashboardSummaryAsync()
        {
            using var connection = _connectionFactory.CreateConnection();
            var summary = new DashboardSummaryDto();

            using var multi = await connection.QueryMultipleAsync("NU_sp_Dashboard_GetSummary", commandType: CommandType.StoredProcedure);

            var totals = await multi.ReadFirstOrDefaultAsync();
            if (totals != null)
            {
                summary.CashInHand = totals.CashInHand ?? 0m;
                summary.BankBalance = totals.BankBalance ?? 0m;
                summary.ActiveEvents = totals.ActiveEvents ?? 0;
            }

            var activities = await multi.ReadAsync<RecentActivityDto>();
            if (activities != null)
            {
                summary.RecentActivities = activities.ToList();
            }
            
            // Generate friendly time strings like "2 hours ago" based on ActivityDate
            var now = DateTime.Now;
            foreach (var activity in summary.RecentActivities)
            {
                var ts = now - activity.ActivityDate;
                if (ts.TotalMinutes < 60)
                    activity.Time = $"{(int)ts.TotalMinutes} mins ago";
                else if (ts.TotalHours < 24)
                    activity.Time = $"{(int)ts.TotalHours} hours ago";
                else
                    activity.Time = $"{(int)ts.TotalDays} days ago";
            }

            return summary;
        }
    }
}
