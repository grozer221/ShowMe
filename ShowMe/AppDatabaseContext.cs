using Microsoft.EntityFrameworkCore;
using ShowMe.Models;

namespace ShowMe
{
    public class AppDatabaseContext : DbContext
    {
        public AppDatabaseContext(DbContextOptions<AppDatabaseContext> options) : base(options)
        {

        }

        public DbSet<UserModel> Users { get; set; }
    }
}
