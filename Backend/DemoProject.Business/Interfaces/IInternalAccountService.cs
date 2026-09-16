using DemoProject.Business.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DemoProject.Business.Interfaces
{
    public interface IInternalAccountService
    {
        Task<int> CreateExpenseAsync(CreateEventExpenseDto dto);
        Task UpdateExpenseAsync(UpdateEventExpenseDto dto);
        Task DeleteExpenseAsync(int id, int modifiedBy);
        Task<EventExpenseDto?> GetExpenseByIdAsync(int id);
        Task<IEnumerable<EventExpenseDto>> GetExpensesByEventGroupAsync(int eventGroupKey);
        Task<IEnumerable<EventGroupSummaryDto>> GetEventGroupSummaryAsync();
    }
}
