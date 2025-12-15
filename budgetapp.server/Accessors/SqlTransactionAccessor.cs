using budgetapp.server.Data;
using BudgetApp.Server.Data;
using System.Collections.Generic;
using System.Linq;

namespace BudgetApp.Server.Accessors
{
    public class SqlTransactionAccessor : ITransactionAccessor
    {
        private readonly BudgetDbContext _context;

        public SqlTransactionAccessor(BudgetDbContext context)
        {
            _context = context;
        }

        public List<Transaction> GetAll(string userId)
        {
            return _context.Transactions.Where(t => t.UserId == userId).ToList();
        }

        public void Add(string userId, Transaction transaction)
        {
            transaction.UserId = userId;
            _context.Transactions.Add(transaction);
            _context.SaveChanges();
        }

        public void UpdateTag(string userId, int transactionId, int? tagId)
        {
            var tx = _context.Transactions
                .SingleOrDefault(t => t.UserId == userId && t.TransactionId == transactionId);

            if (tx == null)
                throw new InvalidOperationException($"Transaction {transactionId} not found for userId '{userId}'.");

            tx.TagId = tagId;

            _context.SaveChanges();
        }
    }
}