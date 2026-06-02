// Importa os recursos de validação de dados do .NET
using System.ComponentModel.DataAnnotations;

// Define o namespace (pacote/pasta lógica) onde essa classe está
namespace HelpDeskApi.Models
{
    // Classe que representa a tabela "Usuarios" no banco de dados
    // Cada propriedade aqui vira uma coluna na tabela
    public class Usuario
    {
        // [Key] diz ao Entity Framework que este campo é a chave primária (PK) da tabela
        // O banco gera o Id automaticamente (auto-increment)
        [Key]
        public int Id { get; set; }

        // [Required] torna o campo obrigatório — se vier vazio, retorna erro com a mensagem definida
        // [StringLength] limita o tamanho máximo do texto a 100 caracteres
        [Required(ErrorMessage = "O nome do usuário é obrigatório.")]
        [StringLength(100, ErrorMessage = "O nome deve ter no máximo 100 caracteres.")]
        public string Nome { get; set; } = string.Empty; // string.Empty = valor padrão vazio ("")

        // Valida que o campo não é vazio e que o texto tem formato de e-mail (contém @ e .)
        [Required(ErrorMessage = "O e-mail é obrigatório.")]
        [EmailAddress(ErrorMessage = "Formato de e-mail inválido.")]
        public string Email { get; set; } = string.Empty;

        // Valida que a senha não é vazia e que tem entre 6 e 20 caracteres
        [Required(ErrorMessage = "A senha é obrigatória.")]
        [StringLength(20, MinimumLength = 6, ErrorMessage = "A senha deve ter entre 6 e 20 caracteres.")]
        public string Senha { get; set; } = string.Empty;
    }
}
