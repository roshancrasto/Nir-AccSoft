dotnet new console -o HashProject
cd HashProject
dotnet add package BCrypt.Net-Next
Set-Content -Path Program.cs -Value 'using System; class Program { static void Main() { Console.WriteLine(BCrypt.Net.BCrypt.HashPassword("admin")); } }'
dotnet run
