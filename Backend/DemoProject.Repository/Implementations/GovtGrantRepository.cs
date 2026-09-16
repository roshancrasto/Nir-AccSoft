using Dapper;
using DemoProject.Data.ConnectionFactory;
using DemoProject.Data.Entities;
using DemoProject.Repository.Interfaces;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace DemoProject.Repository.Implementations
{
    public class GovtGrantRepository : IGovtGrantRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;

        public GovtGrantRepository(IDbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<int> AddAsync(GovtGrant entity, int createdBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@EventGroupKey", entity.EventGroupKey);
            parameters.Add("@GrantDate", entity.GrantDate);
            parameters.Add("@Amount", entity.Amount);
            parameters.Add("@ConsiderForAudit", entity.ConsiderForAudit);
            parameters.Add("@Remarks", entity.Remarks);
            parameters.Add("@CreatedBy", createdBy);

            return await connection.ExecuteScalarAsync<int>(
                "NU_sp_GovtGrant_Insert",
                parameters,
                commandType: CommandType.StoredProcedure);
        }

        public async Task UpdateAsync(GovtGrant entity, int modifiedBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@GovtGrantId", entity.GovtGrantId);
            parameters.Add("@EventGroupKey", entity.EventGroupKey);
            parameters.Add("@GrantDate", entity.GrantDate);
            parameters.Add("@Amount", entity.Amount);
            parameters.Add("@ConsiderForAudit", entity.ConsiderForAudit);
            parameters.Add("@Remarks", entity.Remarks);
            parameters.Add("@ModifiedBy", modifiedBy);

            await connection.ExecuteAsync(
                "NU_sp_GovtGrant_Update",
                parameters,
                commandType: CommandType.StoredProcedure);
        }

        public async Task DeleteAsync(int id, int modifiedBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@GovtGrantId", id);
            parameters.Add("@ModifiedBy", modifiedBy);

            await connection.ExecuteAsync(
                "NU_sp_GovtGrant_Delete",
                parameters,
                commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<GovtGrant>> GetAllAsync()
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<GovtGrant>(
                "NU_sp_GovtGrant_GetAll",
                commandType: CommandType.StoredProcedure);
        }

        public async Task<GovtGrant?> GetByIdAsync(int id)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@GovtGrantId", id);

            return await connection.QueryFirstOrDefaultAsync<GovtGrant>(
                "NU_sp_GovtGrant_GetById",
                parameters,
                commandType: CommandType.StoredProcedure);
        }
    }
}
