using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace budgetapp.server.Engines
{
    public class TransactionEngine
    {
        // Skeleton: read the uploaded CSV and print its contents to the server console.
        public async Task ProcessCsvAsync(IFormFile file)
        {
            if (file == null) throw new ArgumentNullException(nameof(file));

            using var stream = file.OpenReadStream();
            using var reader = new StreamReader(stream);
            string? content = await reader.ReadToEndAsync();

            Console.WriteLine("=== Received CSV file contents ===");
            Console.WriteLine(content);
            Console.WriteLine("=== End CSV ===");
        }
    }
}