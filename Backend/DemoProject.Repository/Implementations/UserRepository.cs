using Dapper;
using DemoProject.Data.ConnectionFactory;
using DemoProject.Data.Entities;
using DemoProject.Repository.Interfaces;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace DemoProject.Repository.Implementations
{
    public class UserRepository : IUserRepository
    {
        private readonly IDbConnectionFactory _connectionFactory;

        public UserRepository(IDbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@Email", email);

            var users = await connection.QueryAsync<User>(
                "NU_sp_User_GetByEmail",
                parameters,
                commandType: CommandType.StoredProcedure);

            return users.FirstOrDefault();
        }

        public async Task<int> CreateUserAsync(User user)
        {
            using var connection = _connectionFactory.CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@FullName", user.FullName);
            parameters.Add("@Email", user.Email);
            parameters.Add("@PasswordHash", user.PasswordHash);
            parameters.Add("@RoleId", user.RoleId);
            parameters.Add("@CreatedBy", 1); // System or Admin

            return await connection.ExecuteScalarAsync<int>(
                "NU_sp_User_Insert",
                parameters,
                commandType: CommandType.StoredProcedure);
        }
    }
}
