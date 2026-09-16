using System;
using System.Data;
using System.Data.SqlClient;
using Dapper;

namespace TestApp
{
    class Program
    {
        static void Main(string[] args)
        {
            var connStr = "Server=lpc:.;Database=AccSoft;Trusted_Connection=True;Encrypt=False;TrustServerCertificate=True;";
            using var connection = new SqlConnection(connStr);
            
            var parameters = new DynamicParameters();
            parameters.Add("@AccountId", 5);
            parameters.Add("@FromDate", new DateTime(2025, 4, 1));
            parameters.Add("@ToDate", new DateTime(2026, 3, 31));

            using var multi = connection.QueryMultiple(
                "NU_sp_Report_AccountLedger",
                parameters,
                commandType: CommandType.StoredProcedure);

            var accountInfo = multi.ReadFirstOrDefault<dynamic>();
            Console.WriteLine($"Cash Account Name: {accountInfo?.AccountName}");
            Console.WriteLine($"Cash Opening Balance: {accountInfo?.OpeningBalance}");

            var parameters2 = new DynamicParameters();
            parameters2.Add("@AccountId", 1);
            parameters2.Add("@FromDate", new DateTime(2025, 4, 1));
            parameters2.Add("@ToDate", new DateTime(2026, 3, 31));

            using var multi2 = connection.QueryMultiple(
                "NU_sp_Report_AccountLedger",
                parameters2,
                commandType: CommandType.StoredProcedure);

            var accountInfo2 = multi2.ReadFirstOrDefault<dynamic>();
            Console.WriteLine($"Bank Account Name: {accountInfo2?.AccountName}");
            Console.WriteLine($"Bank Opening Balance: {accountInfo2?.OpeningBalance}");
        }
    }
}
