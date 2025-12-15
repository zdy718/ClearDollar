using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using BudgetApp.Server;
using BudgetApp.Server.Accessors;

namespace budgetapp.server.Engines
{
    public class TransactionEngine
    {
        private readonly ITransactionAccessor _accessor;

        public TransactionEngine(ITransactionAccessor accessor)
        {
            _accessor = accessor;
        }

        // Parses CSV and adds each transaction via ITransactionAccessor.
        // Assumes CSV columns: 1=date (MM/dd/yyyy), 2=amount, 3=unused, 4=unused, 5=merchantDetails
        public async Task ProcessCsvAsync(IFormFile file, string userId)
        {
            var transactions = await ParseCsv(file);

            foreach (var txn in transactions)
            {
                _accessor.Add(userId, txn);
            }
        }

        // Simple CSV parser: no checks, single format assumptions.
        private async Task<List<Transaction>> ParseCsv(IFormFile file)
        {
            using var stream = file.OpenReadStream();
            using var reader = new StreamReader(stream);

            var transactions = new List<Transaction>();
            string? line;
            while ((line = await reader.ReadLineAsync()) != null)
            {
                if (string.IsNullOrWhiteSpace(line))
                    continue;

                var fields = line.Split(',');

                var dateField = fields[0].Trim().Trim('"');
                var amountField = fields[1].Trim().Trim('"');
                var merchantField = fields[4].Trim().Trim('"');

                // Assume date format "MM/dd/yyyy"
                var date = DateOnly.ParseExact(dateField, "MM/dd/yyyy", CultureInfo.InvariantCulture);
                var amount = decimal.Parse(amountField, CultureInfo.InvariantCulture);
                var merchant = merchantField;

                transactions.Add(new Transaction
                {
                    Date = date,
                    Amount = amount,
                    MerchantDetails = merchant
                });
            }

            return transactions;
        }
    }
}