using DemoProject.Business.DTOs;
using DemoProject.Business.Interfaces;
using DemoProject.Data.Entities;
using DemoProject.Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DemoProject.Business.Services
{
    public class OpeningBalanceService : IOpeningBalanceService
    {
        private readonly IOpeningBalanceRepository _repository;

        public OpeningBalanceService(IOpeningBalanceRepository repository)
        {
            _repository = repository;
        }

        public async Task<OpeningBalanceDto> CreateAsync(OpeningBalanceCreateDto dto, int? userId)
        {
            if (dto.BalanceType == "Cash")
            {
                dto.BankAccountId = null; // Ensure BankAccount is null for Cash
            }
            else if (dto.BalanceType == "Bank" && !dto.BankAccountId.HasValue)
            {
                throw new ArgumentException("Bank Account is required for Bank Balance Type.");
            }

            var entity = new OpeningBalance
            {
                FinancialYear = dto.FinancialYear,
                BalanceType = dto.BalanceType,
                BankAccountId = dto.BankAccountId,
                OpeningAmount = dto.OpeningAmount,
                Remarks = dto.Remarks
            };

            int newId;
            try
            {
                newId = await _repository.AddAsync(entity, userId);
            }
            catch (Exception ex) when (ex.Message.Contains("already exists"))
            {
                throw new InvalidOperationException("Opening balance for this account and financial year already exists.");
            }

            return await GetByIdAsync(newId);
        }

        public async Task UpdateAsync(OpeningBalanceUpdateDto dto, int? userId)
        {
            if (dto.BalanceType == "Cash")
            {
                dto.BankAccountId = null;
            }
            else if (dto.BalanceType == "Bank" && !dto.BankAccountId.HasValue)
            {
                throw new ArgumentException("Bank Account is required for Bank Balance Type.");
            }

            var existing = await _repository.GetByIdAsync(dto.OpeningBalanceId);
            if (existing == null)
            {
                throw new KeyNotFoundException("Opening Balance not found.");
            }

            var entity = new OpeningBalance
            {
                OpeningBalanceId = dto.OpeningBalanceId,
                FinancialYear = dto.FinancialYear,
                BalanceType = dto.BalanceType,
                BankAccountId = dto.BankAccountId,
                OpeningAmount = dto.OpeningAmount,
                Remarks = dto.Remarks
            };

            try
            {
                await _repository.UpdateAsync(entity, userId);
            }
            catch (Exception ex) when (ex.Message.Contains("already exists"))
            {
                throw new InvalidOperationException("Opening balance for this account and financial year already exists.");
            }
        }

        public async Task DeleteAsync(int id, int? userId)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
            {
                throw new KeyNotFoundException("Opening Balance not found.");
            }

            await _repository.DeleteAsync(id, userId);
        }

        public async Task<IEnumerable<OpeningBalanceDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return entities.Select(e => new OpeningBalanceDto
            {
                OpeningBalanceId = e.OpeningBalanceId,
                FinancialYear = e.FinancialYear,
                BalanceType = e.BalanceType,
                BankAccountId = e.BankAccountId,
                OpeningAmount = e.OpeningAmount,
                Remarks = e.Remarks,
                IsActive = e.IsActive,
                BankName = e.BankName,
                Branch = e.Branch
            });
        }

        public async Task<OpeningBalanceDto> GetByIdAsync(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) return null;

            return new OpeningBalanceDto
            {
                OpeningBalanceId = entity.OpeningBalanceId,
                FinancialYear = entity.FinancialYear,
                BalanceType = entity.BalanceType,
                BankAccountId = entity.BankAccountId,
                OpeningAmount = entity.OpeningAmount,
                Remarks = entity.Remarks,
                IsActive = entity.IsActive,
                BankName = entity.BankName,
                Branch = entity.Branch
            };
        }

        public async Task<IEnumerable<BankAccountDropdownDto>> GetBankAccountDropdownAsync()
        {
            var entities = await _repository.GetBankAccountDropdownAsync();
            return entities.Select(e => new BankAccountDropdownDto
            {
                BankAccountKey = e.BankAccountKey,
                BankName = e.BankName,
                Branch = e.Branch,
                AccountType = e.AccountType
            });
        }
    }
}
