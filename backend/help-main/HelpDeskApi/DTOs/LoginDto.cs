using System.ComponentModel.DataAnnotations;

namespace HelpDeskApi.DTOs
{
    public class LoginDto
    {
        [Required(ErrorMessage = "O e-mail é obrigatório")]
        [EmailAddress(ErrorMessage = "E-mail inválido")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "A senha é obrigatória")]
        [MinLength(4, ErrorMessage = "A senha deve ter no mínimo 4 caracteres")]
        public string Senha { get; set; } = string.Empty;
    }
}