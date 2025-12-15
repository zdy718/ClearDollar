using System.Collections.Generic;
using System.Threading.Tasks;
using budgetapp.server.Data;
using budgetapp.server.Engines;
using BudgetApp.Server.Accessors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace BudgetApp.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly ILogger<TransactionsController> _logger;
        private readonly ITransactionAccessor _accessor;
        private readonly TransactionEngine _transactionEngine;

        public TransactionsController(ILogger<TransactionsController> logger, ITransactionAccessor accessor, TransactionEngine transactionEngine )
        {
            _logger = logger;
            _accessor = accessor;
            _transactionEngine = transactionEngine;
        }

        [HttpGet]
        public IEnumerable<Transaction> Get(string userId)
        {
            Console.WriteLine($"GET transactions for userId: {userId}");
            return _accessor.GetAll(userId);
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromForm] IFormFile file, string userId)
        {
            Console.WriteLine("POST csvFile");
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            await _transactionEngine.ProcessCsvAsync(file,userId);
            return Ok(new { message = "File processed." });
        }

        public record UpdateTransactionTagDto(int? TagId);

        [HttpPatch("{transactionId:int}/tag")]
        public IActionResult UpdateTag(int transactionId, string userId, [FromBody] UpdateTransactionTagDto dto)
        {
            Console.WriteLine($"PATCH Transaction {transactionId}");

            _accessor.UpdateTag(userId, transactionId, dto.TagId);
            return Ok();
        }
    }
}