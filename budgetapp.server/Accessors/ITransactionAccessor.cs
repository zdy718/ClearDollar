using System.Collections.Generic;
using budgetapp.server.Data;

namespace BudgetApp.Server.Accessors
{
    public interface ITransactionAccessor
    {
        List<Transaction> GetAll(string userId);
        void Add(string userId, Transaction transaction);
        void UpdateTag(string userId, int transactionId, int? tagId);
    }
}