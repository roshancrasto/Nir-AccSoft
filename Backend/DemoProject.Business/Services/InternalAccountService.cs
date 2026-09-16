using DemoProject.Business.DTOs;
using DemoProject.Business.Interfaces;
using DemoProject.Data.Entities;
using DemoProject.Repository.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DemoProject.Business.Services
{
    public class InternalAccountService : IInternalAccountService
    {
        private readonly IInternalAccountRepository _repository;

        public InternalAccountService(IInternalAccountRepository repository)
        {
            _repository = repository;
        }

        public async Task<int> CreateExpenseAsync(CreateEventExpenseDto dto)
        {
            var entity = new EventExpense
            {
                EventGroupKey = dto.EventGroupKey,
                ExpenseCode = dto.ExpenseCode,
                ExpenseDetails = dto.ExpenseDetails,
                ExpenseDesc = dto.ExpenseDesc,
                PaymentMode = dto.PaymentMode,
                Amount = dto.Amount,
                CreatedBy = dto.CreatedBy
            };
            return await _repository.AddExpenseAsync(entity);
        }

        public async Task UpdateExpenseAsync(UpdateEventExpenseDto dto)
        {
            var entity = new EventExpense
            {
                EventExpenseKey = dto.EventExpenseKey,
                EventGroupKey = dto.EventGroupKey,
                ExpenseCode = dto.ExpenseCode,
                ExpenseDetails = dto.ExpenseDetails,
                ExpenseDesc = dto.ExpenseDesc,
                PaymentMode = dto.PaymentMode,
                Amount = dto.Amount,
                ModifiedBy = dto.ModifiedBy
            };
            await _repository.UpdateExpenseAsync(entity);
        }

        public async Task DeleteExpenseAsync(int id, int modifiedBy)
        {
            await _repository.DeleteExpenseAsync(id, modifiedBy);
        }

        public async Task<EventExpenseDto?> GetExpenseByIdAsync(int id)
        {
            var entity = await _repository.GetExpenseByIdAsync(id);
            if (entity == null) return null;

            return new EventExpenseDto
            {
                EventExpenseKey = entity.EventExpenseKey,
                EventGroupKey = entity.EventGroupKey,
                ExpenseCode = entity.ExpenseCode,
                ExpenseDetails = entity.ExpenseDetails,
                ExpenseDesc = entity.ExpenseDesc,
                PaymentMode = entity.PaymentMode,
                Amount = entity.Amount,
                PaidAmount = entity.PaidAmount,
                PendingAmount = entity.PendingAmount,
                CreatedDate = entity.CreatedDate
            };
        }

        public async Task<IEnumerable<EventExpenseDto>> GetExpensesByEventGroupAsync(int eventGroupKey)
        {
            var expenses = await _repository.GetExpensesByEventGroupAsync(eventGroupKey);
            return expenses.Select(e => new EventExpenseDto
            {
                EventExpenseKey = e.EventExpenseKey,
                EventGroupKey = e.EventGroupKey,
                ExpenseCode = e.ExpenseCode,
                ExpenseDetails = e.ExpenseDetails,
                ExpenseDesc = e.ExpenseDesc,
                PaymentMode = e.PaymentMode,
                Amount = e.Amount,
                PaidAmount = e.PaidAmount,
                PendingAmount = e.PendingAmount,
                CreatedDate = e.CreatedDate
            });
        }

        public async Task<IEnumerable<EventGroupSummaryDto>> GetEventGroupSummaryAsync()
        {
            var summaries = await _repository.GetEventGroupSummaryAsync();
            return summaries.Select(s => new EventGroupSummaryDto
            {
                EventGroupKey = s.EventGroupKey,
                EventGroupName = s.EventGroupName,
                TotalExpenseAmount = s.TotalExpenseAmount,
                PaidAmount = s.PaidAmount,
                PendingAmount = s.PendingAmount,
                TotalReceipts = s.TotalReceipts,
                ReceiptsCreated = s.ReceiptsCreated,
                PendingReceipts = s.PendingReceipts
            });
        }
    }
}
