using Mango.Services.RewardApi.Models;
using Microsoft.EntityFrameworkCore;

namespace Mango.Services.RewardApi.Data
{
    public class ApplicationDbContext: DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options):base(options)
        {

        }
        public DbSet<Reward> Rewards { get; set; } 
    }
}
