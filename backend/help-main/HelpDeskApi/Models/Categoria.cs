// Importa os recursos de validação de dados do .NET
using System.ComponentModel.DataAnnotations;

// Define o namespace (pacote/pasta lógica) onde essa classe está
namespace HelpDeskApi.Models
{
    // Classe que representa a tabela "Categorias" no banco de dados
    // Categorias são usadas para classificar as Ordens de Serviço
    public class Categoria
    {
        // [Key] indica que este campo é a chave primária (PK) da tabela
        // O banco gera o Id automaticamente (auto-increment)
        [Key]
        public int Id { get; set; }

        // [Required] torna o campo obrigatório
        // [StringLength] limita o nome a no máximo 50 caracteres
        [Required(ErrorMessage = "O nome da categoria é obrigatório.")]
        [StringLength(50, ErrorMessage = "O nome da categoria deve ter no máximo 50 caracteres.")]
        public string Nome { get; set; } = string.Empty; // Valor padrão vazio para evitar null
    }
}
