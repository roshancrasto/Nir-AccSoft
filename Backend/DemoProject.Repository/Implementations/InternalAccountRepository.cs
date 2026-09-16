using Dapper;
using DemoProject.Data.ConnectionFactory;
using DemoProject.Data.Entities;
using DemoProject.Repository.Interfaces;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace DemoProject.Repository.Implementations
{
    public class InternalAccountRepository : IInternalAccountRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;

        public InternalAccountRepository(IDbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<int> AddExpenseAsync(EventExpense entity)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@EventGroupKey", entity.EventGroupKey);
            parameters.Add("@ExpenseCode", entity.ExpenseCode);
            parameters.Add("@ExpenseDetails", entity.ExpenseDetails);
            parameters.Add("@ExpenseDesc", entity.ExpenseDesc);
            parameters.Add("@PaymentMode", entity.PaymentMode);
            parameters.Add("@Amount", entity.Amount);
            parameters.Add("@CreatedBy", entity.CreatedBy);
            
            return await connection.ExecuteScalarAsync<int>("NU_sp_EventExpense_Insert", parameters, commandType: CommandType.StoredProcedure);
        }

        public async Task UpdateExpenseAsync(EventExpense entity)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@EventExpenseKey", entity.EventExpenseKey);
            parameters.Add("@EventGroupKey", entity.EventGroupKey);
            parameters.Add("@ExpenseCode", entity.ExpenseCode);
            parameters.Add("@ExpenseDetails", entity.ExpenseDetails);
            parameters.Add("@ExpenseDesc", entity.ExpenseDesc);
            parameters.Add("@PaymentMode", entity.PaymentMode);
            parameters.Add("@Amount", entity.Amount);
            parameters.Add("@ModifiedBy", entity.ModifiedBy);
            
            await connection.ExecuteAsync("NU_sp_EventExpense_Update", parameters, commandType: CommandType.StoredProcedure);
        }

        public async Task DeleteExpenseAsync(int id, int modifiedBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            await connection.ExecuteAsync("NU_sp_EventExpense_Delete", new { EventExpenseKey = id, ModifiedBy = modifiedBy }, commandType: CommandType.StoredProcedure);
        }

        public async Task<EventExpense?> GetExpenseByIdAsync(int id)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<EventExpense>("NU_sp_EventExpense_GetById", new { EventExpenseKey = id }, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<EventExpense>> GetExpensesByEventGroupAsync(int eventGroupKey)
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<EventExpense>("NU_sp_EventExpense_GetByEventGroup", new { EventGroupKey = eventGroupKey }, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<EventGroupSummary>> GetEventGroupSummaryAsync()
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<EventGroupSummary>("NU_sp_EventGroupSummary_Get", commandType: CommandType.StoredProcedure);
        }
    }
}
