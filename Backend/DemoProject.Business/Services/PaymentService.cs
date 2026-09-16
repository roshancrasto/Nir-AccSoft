using AutoMapper;
using DemoProject.Business.DTOs;
using DemoProject.Business.Interfaces;
using DemoProject.Data.Entities;
using DemoProject.Repository.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DemoProject.Business.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IPaymentRepository _repository;
        private readonly IPaymentExpenseLinkRepository _expenseLinkRepository;
        private readonly IMapper _mapper;

        public PaymentService(IPaymentRepository repository, IPaymentExpenseLinkRepository expenseLinkRepository, IMapper mapper)
        {
            _repository = repository;
            _expenseLinkRepository = expenseLinkRepository;
            _mapper = mapper;
        }

        public async Task<int> CreateAsync(CreatePaymentDto dto)
        {
            var entity = _mapper.Map<Payment>(dto);

            // Validation: Total Allocated must match Debit Amount
            decimal totalAllocated = dto.EventExpenseMappings?.Sum(m => m.Amount) ?? 0;
            if (totalAllocated != entity.DebitAmount)
            {
                throw new System.Exception($"Amount mismatch: Total allocated ({totalAllocated}) must match payment amount ({entity.DebitAmount}).");
            }

            int paymentId = await _repository.AddAsync(entity, 1); // Default createdBy = 1

            if (dto.EventExpenseMappings != null && dto.EventExpenseMappings.Count > 0)
            {
                var mappings = _mapper.Map<IEnumerable<PaymentExpenseMapping>>(dto.EventExpenseMappings);
                foreach (var m in mappings) m.PaymentID = paymentId;
                await _repository.AddMappingsAsync(mappings);
            }

            if ((dto.PaymentType == "Re-Imbursement" || dto.PaymentType == "Multiple Payments") && dto.SelectedExpenseIds != null && dto.SelectedExpenseIds.Count > 0)
            {
                await _expenseLinkRepository.UpdateSettlementAsync(dto.SelectedExpenseIds, paymentId, 1);
            }

            return paymentId;
        }

        public async Task UpdateAsync(PaymentDto dto)
        {
            var entity = _mapper.Map<Payment>(dto);

            // Validation: Total Allocated must match Debit Amount
            decimal totalAllocated = dto.EventExpenseMappings?.Sum(m => m.Amount) ?? 0;
            if (totalAllocated != entity.DebitAmount)
            {
                throw new System.Exception($"Amount mismatch: Total allocated ({totalAllocated}) must match payment amount ({entity.DebitAmount}).");
            }

            await _repository.UpdateAsync(entity, 1); // Default modifiedBy = 1

            // Update mappings: Delete existing and add new ones (standard pattern for this project's simplicity)
            await _repository.DeleteMappingsByPaymentIdAsync(dto.PaymentId, 1);
            if (dto.EventExpenseMappings != null && dto.EventExpenseMappings.Count > 0)
            {
                var mappings = _mapper.Map<IEnumerable<PaymentExpenseMapping>>(dto.EventExpenseMappings);
                foreach (var m in mappings) m.PaymentID = dto.PaymentId;
                await _repository.AddMappingsAsync(mappings);
            }

            if (dto.PaymentType == "Re-Imbursement" || dto.PaymentType == "Multiple Payments")
            {
                await _expenseLinkRepository.UnsettleByPaymentIdAsync(dto.PaymentId, 1);
                
                if (dto.SelectedExpenseIds != null && dto.SelectedExpenseIds.Count > 0)
                {
                    await _expenseLinkRepository.UpdateSettlementAsync(dto.SelectedExpenseIds, dto.PaymentId, 1);
                }
            }
        }

        public async Task DeleteAsync(int id, int modifiedBy)
        {
            await _repository.DeleteAsync(id, modifiedBy);
        }

        public async Task<IEnumerable<PaymentDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<PaymentDto>>(entities);
        }

        public async Task<PaymentDto?> GetByIdAsync(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) return null;

            var dto = _mapper.Map<PaymentDto>(entity);
            var mappings = await _repository.GetMappingsByPaymentIdAsync(id);
            dto.EventExpenseMappings = _mapper.Map<List<PaymentExpenseMappingDto>>(mappings);

            if (dto.PaymentType == "Re-Imbursement" || dto.PaymentType == "Multiple Payments")
            {
                var links = await _expenseLinkRepository.GetByPaymentIdAsync(id);
                dto.SelectedExpenseIds = links.Select(l => l.ExpenseId).ToList();
            }

            return dto;
        }

        public async Task<IEnumerable<PendingEventExpenseDto>> GetPendingEventExpensesAsync()
        {
            var entities = await _repository.GetPendingEventExpensesAsync();
            return _mapper.Map<IEnumerable<PendingEventExpenseDto>>(entities);
        }

        public async Task<IEnumerable<RelatedPaymentDto>> GetRelatedPaymentsAsync(int? eventGroupKey, int? currentPaymentId)
        {
            var entities = await _repository.GetRelatedPaymentsAsync(eventGroupKey, currentPaymentId);
            return _mapper.Map<IEnumerable<RelatedPaymentDto>>(entities);
        }
    }
}
