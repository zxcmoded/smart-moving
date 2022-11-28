using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using SmartMoving.Core;
using SmartMoving.Data.Contexts;

namespace SmartMoving.Data
{
    public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            var builder = new DbContextOptionsBuilder<AppDbContext>();
            builder.UseSqlServer("Server=CLBAOCLJKCLJ\\SQLEXPRESS;Database=SmartMoving_Interview;Trusted_Connection=True;MultipleActiveResultSets=true");
            return new AppDbContext(builder.Options, new AnonymousUser());
        }
    }
}
