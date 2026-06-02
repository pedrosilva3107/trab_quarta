// Importa o Entity Framework Core — biblioteca ORM que conecta o C# ao banco de dados
using Microsoft.EntityFrameworkCore;
// Importa os Models para que o EF saiba quais tabelas criar
using HelpDeskApi.Models;

// Define o namespace (pacote/pasta lógica) onde essa classe está
namespace HelpDeskApi.Data
{
    // AppDbContext é o "portal" entre a aplicação e o banco de dados
    // Herda de DbContext, que é a classe principal do Entity Framework
    // Toda operação no banco (SELECT, INSERT, UPDATE, DELETE) passa por aqui
    public class AppDbContext : DbContext
    {
        // Construtor que recebe as configurações do banco (string de conexão, tipo do banco, etc.)
        // O ": base(options)" repassa essas configurações para a classe pai (DbContext)
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // DbSet representa uma tabela no banco de dados
        // "Categorias" será o nome da tabela — o EF usa o nome da propriedade
        public DbSet<Categoria> Categorias { get; set; }

        // Tabela de Ordens de Serviço
        public DbSet<OS> OSs { get; set; }

        // Tabela de Usuários
        public DbSet<Usuario> Usuarios { get; set; }
    }
}
