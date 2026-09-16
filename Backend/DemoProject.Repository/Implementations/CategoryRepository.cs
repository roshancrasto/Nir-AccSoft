using Dapper;
using DemoProject.Data.ConnectionFactory;
using DemoProject.Data.Entities;
using DemoProject.Repository.Interfaces;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace DemoProject.Repository.Implementations
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;

        public CategoryRepository(IDbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<int> AddAsync(Category category)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@CategoryName", category.CategoryName);
            parameters.Add("@CreatedBy", category.CreatedBy);

            return await connection.ExecuteScalarAsync<int>(
                "NU_sp_Category_Insert",
                parameters,
                commandType: CommandType.StoredProcedure);
        }

        public async Task UpdateAsync(Category category)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@CategoryId", category.CategoryId);
            parameters.Add("@CategoryName", category.CategoryName);
            parameters.Add("@IsActive", category.IsActive);
            parameters.Add("@ModifiedBy", category.ModifiedBy);

            await connection.ExecuteAsync(
                "NU_sp_Category_Update",
                parameters,
                commandType: CommandType.StoredProcedure);
        }

        public async Task DeleteAsync(int categoryId, int modifiedBy)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@CategoryId", categoryId);
            parameters.Add("@ModifiedBy", modifiedBy);

            await connection.ExecuteAsync(
                "NU_sp_Category_Delete",
                parameters,
                commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<Category>> GetAllAsync()
        {
            using var connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<Category>(
                "NU_sp_Category_GetAll",
                commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> ExistsByNameAsync(string categoryName, int? excludeCategoryId = null)
        {
            using var connection = _connectionFactory.CreateConnection();
            var sql = @"SELECT COUNT(1) FROM NU_Categories 
                        WHERE CategoryName = @CategoryName COLLATE SQL_Latin1_General_CP1_CI_AS 
                        AND DeletedFlag = 0";

            var parameters = new DynamicParameters();
            parameters.Add("@CategoryName", categoryName);

            if (excludeCategoryId.HasValue)
            {
                sql += " AND CategoryId <> @ExcludeId";
                parameters.Add("@ExcludeId", excludeCategoryId.Value);
            }

            var count = await connection.ExecuteScalarAsync<int>(sql, parameters);
            return count > 0;
        }
    }
}
