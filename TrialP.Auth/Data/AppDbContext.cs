using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TrialP.Auth.Models;

namespace TrialP.Auth.Data
{
    public class AppDbContext : IdentityDbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
            //Database.EnsureCreated();
        }

        public AppDbContext()
        {

        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Server=localhost;Database=TrialP_IdentityServer;Trusted_Connection=True;trustServerCertificate=true;");
        }

        public virtual DbSet<RefreshToken> RefreshTokens { get; set; }
    }
}
