using Dapper;
using DemoProject.Data.ConnectionFactory;
using DemoProject.Data.Entities;
using DemoProject.Repository.Interfaces;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace DemoProject.Repository.Implementations
{
    public class BoxCollectionRepository : IBoxCollectionRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;

        public BoxCollectionRepository(IDbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<int> AddAsync(BoxCollection entity, int createdBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@EventGroupKey", entity.EventGroupKey);
            parameters.Add("@CollectionDate", entity.CollectionDate);
            parameters.Add("@Amount", entity.Amount);
            parameters.Add("@ConsiderForAudit", entity.ConsiderForAudit);
            parameters.Add("@Remarks", entity.Remarks);
            parameters.Add("@CreatedBy", createdBy);

            return await connection.ExecuteScalarAsync<int>(
                "NU_sp_BoxCollection_Insert",
                parameters,
                commandType: CommandType.StoredProcedure);
        }

        public async Task UpdateAsync(BoxCollection entity, int modifiedBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@BoxCollectionId", entity.BoxCollectionId);
            parameters.Add("@EventGroupKey", entity.EventGroupKey);
            parameters.Add("@CollectionDate", entity.CollectionDate);
            parameters.Add("@Amount", entity.Amount);
            parameters.Add("@ConsiderForAudit", entity.ConsiderForAudit);
            parameters.Add("@Remarks", entity.Remarks);
            parameters.Add("@ModifiedBy", modifiedBy);

            await connection.ExecuteAsync(
                "NU_sp_BoxCollection_Update",
                parameters,
                commandType: CommandType.StoredProcedure);
        }

        public async Task DeleteAsync(int id, int modifiedBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@BoxCollectionId", id);
            parameters.Add("@ModifiedBy", modifiedBy);

            await connection.ExecuteAsync(
                "NU_sp_BoxCollection_Delete",
                parameters,
                commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<BoxCollection>> GetAllAsync()
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<BoxCollection>(
                "NU_sp_BoxCollection_GetAll",
                commandType: CommandType.StoredProcedure);
        }

        public async Task<BoxCollection?> GetByIdAsync(int id)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@BoxCollectionId", id);

            return await connection.QueryFirstOrDefaultAsync<BoxCollection>(
                "NU_sp_BoxCollection_GetById",
                parameters,
                commandType: CommandType.StoredProcedure);
        }
    }
}
