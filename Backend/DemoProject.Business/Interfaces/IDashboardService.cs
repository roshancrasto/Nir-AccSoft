using DemoProject.Data.Entities;
using System.Threading.Tasks;

namespace DemoProject.Business.Interfaces
{
    public interface IDashboardService
    {
        Task<DashboardSummaryDto> GetDashboardSummaryAsync();
    }
}
