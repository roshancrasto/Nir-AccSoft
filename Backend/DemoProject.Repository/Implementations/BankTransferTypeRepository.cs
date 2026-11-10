using Dapper;
using DemoProject.Data.Entities;
using DemoProject.Repository.Interfaces;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace DemoProject.Repository.Implementations
{
    public class BankTransferTypeRepository : IBankTransferTypeRepository
    {
        private readonly string _connectionString;

        public BankTransferTypeRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("AccSoftConnection");
        }

        public async Task<IEnumerable<BankTransferType>> GetBankTransferTypesAsync()
        {
            using (IDbConnection connection = new SqlConnection(_connectionString))
            {
                return await connection.QueryAsync<BankTransferType>(
                    "sp_GetBankTransferTypes",
                    commandType: CommandType.StoredProcedure
                );
            }
        }
    }
}
