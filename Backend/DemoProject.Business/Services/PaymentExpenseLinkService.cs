using DemoProject.Business.DTOs;
using DemoProject.Business.Interfaces;
using DemoProject.Data.Entities;
using DemoProject.Repository.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DemoProject.Business.Services
{
    public class PaymentExpenseLinkService : IPaymentExpenseLinkService
    {
        private readonly IPaymentExpenseLinkRepository _repository;

        public PaymentExpenseLinkService(IPaymentExpenseLinkRepository repository)
        {
            _repository = repository;
        }

        public async Task<int> CreateAsync(CreatePaymentExpenseLinkDto dto, int createdBy)
        {
            var entity = new PaymentExpenseLink
            {
                EventGroupKey = dto.EventGroupKey,
                VendorKey = dto.VendorKey,
                ExpenseCategoryKey = dto.ExpenseCategoryKey,
                ExpenseDetails = dto.ExpenseDetails,
                BillNo = dto.BillNo,
                BillDate = dto.BillDate,
                Amount = dto.Amount,
                PaidByMemberKey = dto.PaidByMemberKey,
                PaymentMode = dto.PaymentMode,
                RelatedPaymentID = dto.RelatedPaymentID,
                Remarks = dto.Remarks
            };

            return await _repository.AddAsync(entity, createdBy);
        }

        public async Task UpdateAsync(UpdatePaymentExpenseLinkDto dto, int id, int modifiedBy)
        {
            var entity = new PaymentExpenseLink
            {
                ExpenseId = id,
                EventGroupKey = dto.EventGroupKey,
                VendorKey = dto.VendorKey,
                ExpenseCategoryKey = dto.ExpenseCategoryKey,
                ExpenseDetails = dto.ExpenseDetails,
                BillNo = dto.BillNo,
                BillDate = dto.BillDate,
                Amount = dto.Amount,
                PaidByMemberKey = dto.PaidByMemberKey,
                PaymentMode = dto.PaymentMode,
                RelatedPaymentID = dto.RelatedPaymentID,
                Remarks = dto.Remarks
            };

            await _repository.UpdateAsync(entity, modifiedBy);
        }

        public async Task DeleteAsync(int id, int modifiedBy)
        {
            await _repository.DeleteAsync(id, modifiedBy);
        }

        public async Task<IEnumerable<PaymentExpenseLinkDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return entities.Select(MapToDto);
        }

        public async Task<IEnumerable<PaymentExpenseLinkDto>> GetPendingAllAsync()
        {
            var entities = await _repository.GetPendingAllAsync();
            return entities.Select(MapToDto);
        }

        public async Task<IEnumerable<PaymentExpenseLinkDto>> GetPendingByMemberAsync(int memberId)
        {
            var entities = await _repository.GetPendingByMemberAsync(memberId);
            return entities.Select(MapToDto);
        }

        public async Task<IEnumerable<PaymentExpenseLinkDto>> GetUnlinkedExpensesAsync(int eventGroupKey, int? currentExpenseId)
        {
            var entities = await _repository.GetUnlinkedExpensesAsync(eventGroupKey, currentExpenseId);
            return entities.Select(MapToDto);
        }

        private PaymentExpenseLinkDto MapToDto(PaymentExpenseLink entity)
        {
            return new PaymentExpenseLinkDto
            {
                ExpenseId = entity.ExpenseId,
                EventGroupKey = entity.EventGroupKey,
                EventGroupName = entity.EventGroupName,
                VendorKey = entity.VendorKey,
                VendorName = entity.VendorName,
                ExpenseCategoryKey = entity.ExpenseCategoryKey,
                CategoryName = entity.CategoryName,
                ExpenseDetails = entity.ExpenseDetails,
                BillNo = entity.BillNo,
                BillDate = entity.BillDate,
                Amount = entity.Amount,
                PaidByMemberKey = entity.PaidByMemberKey,
                MemberName = entity.MemberName,
                PaymentMode = entity.PaymentMode,
                RelatedPaymentID = entity.RelatedPaymentID,
                Remarks = entity.Remarks,
                IsSettled = entity.IsSettled,
                SettledDate = entity.SettledDate,
                PaymentId = entity.PaymentId
            };
        }
    }
}
