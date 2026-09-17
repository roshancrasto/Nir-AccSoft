using System;
using BCrypt.Net;

class Program {
    static void Main(string[] args) {
        Console.WriteLine(BCrypt.Net.BCrypt.HashPassword("admin123"));
    }
}
