using Microsoft.EntityFrameworkCore;
using HelpDeskApi.Models;

namespace HelpDeskApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<OS> OSs { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
    }
}