using System.Data;

namespace DemoProject.Data.ConnectionFactory
{
    public interface IDbConnectionFactory
    {
        IDbConnection CreateConnection();
    }
}
