using DemoProject.Business.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DemoProject.Business.Interfaces
{
    public interface IReceiptService
    {
        Task<int> CreateAsync(CreateReceiptDto dto);
        Task UpdateAsync(ReceiptDto dto);
        Task DeleteAsync(int id, int modifiedBy);
        Task<IEnumerable<ReceiptDto>> GetAllAsync();
    }

    public interface IPaymentExpenseLinkService
    {
        Task<int> CreateAsync(CreatePaymentExpenseLinkDto dto, int createdBy);
        Task UpdateAsync(UpdatePaymentExpenseLinkDto dto, int id, int modifiedBy);
        Task DeleteAsync(int id, int modifiedBy);
        Task<IEnumerable<PaymentExpenseLinkDto>> GetAllAsync();
        Task<IEnumerable<PaymentExpenseLinkDto>> GetPendingAllAsync();
        Task<IEnumerable<PaymentExpenseLinkDto>> GetPendingByMemberAsync(int memberId);
        Task<IEnumerable<PaymentExpenseLinkDto>> GetUnlinkedExpensesAsync(int eventGroupKey, int? currentExpenseId);
    }
}
