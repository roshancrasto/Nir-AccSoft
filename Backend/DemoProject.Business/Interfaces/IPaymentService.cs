using DemoProject.Business.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DemoProject.Business.Interfaces
{
    public interface IPaymentService
    {
        Task<int> CreateAsync(CreatePaymentDto dto);
        Task UpdateAsync(PaymentDto dto);
        Task DeleteAsync(int id, int modifiedBy);
        Task<IEnumerable<PaymentDto>> GetAllAsync();
        Task<PaymentDto?> GetByIdAsync(int id);
        Task<IEnumerable<PendingEventExpenseDto>> GetPendingEventExpensesAsync();
        Task<IEnumerable<RelatedPaymentDto>> GetRelatedPaymentsAsync(int? eventGroupKey, int? currentPaymentId);
    }
}
