using DemoProject.Data.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DemoProject.Repository.Interfaces
{
    public interface IReceiptRepository
    {
        Task<int> AddAsync(Receipt entity, int createdBy);
        Task UpdateAsync(Receipt entity, int modifiedBy);
        Task DeleteAsync(int id, int modifiedBy);
        Task<IEnumerable<Receipt>> GetAllAsync();
    }

    public interface IPaymentRepository
    {
        Task<int> AddAsync(Payment entity, int createdBy);
        Task UpdateAsync(Payment entity, int modifiedBy);
        Task DeleteAsync(int id, int modifiedBy);
        Task<IEnumerable<Payment>> GetAllAsync();
        Task<Payment?> GetByIdAsync(int id);
        Task<IEnumerable<PendingEventExpense>> GetPendingEventExpensesAsync();
        Task AddMappingsAsync(IEnumerable<PaymentExpenseMapping> mappings);
        Task<IEnumerable<PaymentExpenseMapping>> GetMappingsByPaymentIdAsync(int paymentId);
        Task DeleteMappingsByPaymentIdAsync(int paymentId, int modifiedBy);
        Task<IEnumerable<RelatedPayment>> GetRelatedPaymentsAsync(int? eventGroupKey, int? currentPaymentId);
    }

    public interface IPaymentExpenseLinkRepository
    {
        Task<int> AddAsync(PaymentExpenseLink entity, int createdBy);
        Task UpdateAsync(PaymentExpenseLink entity, int modifiedBy);
        Task DeleteAsync(int id, int modifiedBy);
        Task<IEnumerable<PaymentExpenseLink>> GetAllAsync();
        Task<IEnumerable<PaymentExpenseLink>> GetPendingAllAsync();
        Task<IEnumerable<PaymentExpenseLink>> GetPendingByMemberAsync(int memberId);
        Task<IEnumerable<PaymentExpenseLink>> GetByPaymentIdAsync(int paymentId);
        Task UpdateSettlementAsync(IEnumerable<int> expenseIds, int? paymentId, int modifiedBy);
        Task UnsettleByPaymentIdAsync(int paymentId, int modifiedBy);
        Task<IEnumerable<PaymentExpenseLink>> GetUnlinkedExpensesAsync(int eventGroupKey, int? currentExpenseId);
    }
}
