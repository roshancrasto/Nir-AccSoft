using DemoProject.Business.Interfaces;
using DemoProject.Data.Entities;
using DemoProject.Repository.Interfaces;
using System.Threading.Tasks;

namespace DemoProject.Business.Implementations
{
    public class DashboardService : IDashboardService
    {
        private readonly IDashboardRepository _repository;

        public DashboardService(IDashboardRepository repository)
        {
            _repository = repository;
        }

        public async Task<DashboardSummaryDto> GetDashboardSummaryAsync()
        {
            return await _repository.GetDashboardSummaryAsync();
        }
    }
}
