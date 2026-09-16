using Dapper;
using DemoProject.Data.ConnectionFactory;
using DemoProject.Data.Entities;
using DemoProject.Repository.Interfaces;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using System.Linq;

namespace DemoProject.Repository.Implementations
{
    public class OpeningBalanceRepository : IOpeningBalanceRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;

        public OpeningBalanceRepository(IDbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<int> AddAsync(OpeningBalance entity, int? createdBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@FinancialYear", entity.FinancialYear);
            parameters.Add("@BalanceType", entity.BalanceType);
            parameters.Add("@BankAccountId", entity.BankAccountId);
            parameters.Add("@OpeningAmount", entity.OpeningAmount);
            parameters.Add("@Remarks", entity.Remarks);
            parameters.Add("@CreatedBy", createdBy);

            return await connection.ExecuteScalarAsync<int>(
                "NU_sp_OpeningBalance_Insert",
                parameters,
                commandType: CommandType.StoredProcedure);
        }

        public async Task UpdateAsync(OpeningBalance entity, int? modifiedBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@OpeningBalanceId", entity.OpeningBalanceId);
            parameters.Add("@FinancialYear", entity.FinancialYear);
            parameters.Add("@BalanceType", entity.BalanceType);
            parameters.Add("@BankAccountId", entity.BankAccountId);
            parameters.Add("@OpeningAmount", entity.OpeningAmount);
            parameters.Add("@Remarks", entity.Remarks);
            parameters.Add("@ModifiedBy", modifiedBy);

            await connection.ExecuteAsync(
                "NU_sp_OpeningBalance_Update",
                parameters,
                commandType: CommandType.StoredProcedure);
        }

        public async Task DeleteAsync(int id, int? modifiedBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@OpeningBalanceId", id);
            parameters.Add("@ModifiedBy", modifiedBy);

            await connection.ExecuteAsync(
                "NU_sp_OpeningBalance_Delete",
                parameters,
                commandType: CommandType.StoredProcedure);
        }

        public async Task<OpeningBalance?> GetByIdAsync(int id)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@OpeningBalanceId", id);

            return await connection.QueryFirstOrDefaultAsync<OpeningBalance>(
                "NU_sp_OpeningBalance_GetById",
                parameters,
                commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<OpeningBalance>> GetAllAsync()
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<OpeningBalance>(
                "NU_sp_OpeningBalance_GetAll",
                commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<BankAccountDropdown>> GetBankAccountDropdownAsync()
        {
            using var connection = _connectionFactory.CreateConnection();
            string sql = @"
                SELECT BankAccountkey, BankName, Branch, AccountType
                FROM NU_BankAccountDetails
                ORDER BY BankName, Branch";
            
            return await connection.QueryAsync<BankAccountDropdown>(sql);
        }
    }
}
