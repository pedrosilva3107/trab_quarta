// Importa os recursos de validação de dados do .NET
using System.ComponentModel.DataAnnotations;

// Define o namespace (pacote/pasta lógica) onde essa classe está
namespace HelpDeskApi.DTOs
{
    // DTO = Data Transfer Object
    // É um objeto simples usado apenas para TRANSPORTAR dados entre o cliente e a API
    // Diferente dos Models, ele não representa uma tabela no banco — só carrega os dados do login
    public class LoginDto
    {
        // Campo de e-mail obrigatório com validação de formato (precisa ter @ e .)
        [Required(ErrorMessage = "O e-mail é obrigatório")]
        [EmailAddress(ErrorMessage = "E-mail inválido")]
        public string Email { get; set; } = string.Empty; // Valor padrão vazio

        // Campo de senha obrigatório com no mínimo 4 caracteres
        [Required(ErrorMessage = "A senha é obrigatória")]
        [MinLength(4, ErrorMessage = "A senha deve ter no mínimo 4 caracteres")]
        public string Senha { get; set; } = string.Empty; // Valor padrão vazio
    }
}
