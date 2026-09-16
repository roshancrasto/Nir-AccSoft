using DemoProject.Data.Entities;
using System.Threading.Tasks;

namespace DemoProject.Repository.Interfaces
{
    public interface IDashboardRepository
    {
        Task<DashboardSummaryDto> GetDashboardSummaryAsync();
    }
}
