using budgetapp.server.Data;

namespace BudgetApp.Server.Controllers
{
    public class UpdateTagRequest
    {
        public string? TagName { get; set; }
        public decimal? BudgetAmount { get; set; }
        public TagType? TagType { get; set; } // optional; usually unchanged here
        public int? ParentTagId { get; set; } // optional; for drag-drop if you ever want
    }
}