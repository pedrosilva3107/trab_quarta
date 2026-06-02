using System.ComponentModel.DataAnnotations;

namespace HelpDeskApi.Models
{
    public class Usuario
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "O nome do usuário é obrigatório.")]
        [StringLength(100, ErrorMessage = "O nome deve ter no máximo 100 caracteres.")]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "O e-mail é obrigatório.")]
        [EmailAddress(ErrorMessage = "Formato de e-mail inválido.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "A senha é obrigatória.")]
        [StringLength(20, MinimumLength = 6, ErrorMessage = "A senha deve ter entre 6 e 20 caracteres.")]
        public string Senha { get; set; } = string.Empty;
    }
}