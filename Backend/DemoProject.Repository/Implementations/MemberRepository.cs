using Dapper;
using DemoProject.Data.Entities;
using DemoProject.Repository.Interfaces;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace DemoProject.Repository.Implementations
{
    public class MemberRepository : IMemberRepository
    {
        private readonly string _connectionString;
        private readonly IConfiguration _configuration;

        public MemberRepository(IConfiguration configuration)
        {
            _configuration = configuration;
            _connectionString = _configuration.GetConnectionString("AccSoftConnection");
        }

        public async Task<IEnumerable<MemberDetail>> GetAllAsync()
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var query = "SELECT MemberKey, MemberName, CAST(1 AS BIT) AS IsActive FROM NU_MemberDetails ORDER BY MemberName";
                return await connection.QueryAsync<MemberDetail>(query);
            }
        }
    }
}
