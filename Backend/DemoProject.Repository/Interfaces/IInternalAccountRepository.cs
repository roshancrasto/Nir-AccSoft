using DemoProject.Data.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DemoProject.Repository.Interfaces
{
    public interface IInternalAccountRepository
    {
        Task<int> AddExpenseAsync(EventExpense entity);
        Task UpdateExpenseAsync(EventExpense entity);
        Task DeleteExpenseAsync(int id, int modifiedBy);
        Task<EventExpense?> GetExpenseByIdAsync(int id);
        Task<IEnumerable<EventExpense>> GetExpensesByEventGroupAsync(int eventGroupKey);
        Task<IEnumerable<EventGroupSummary>> GetEventGroupSummaryAsync();
    }
}
