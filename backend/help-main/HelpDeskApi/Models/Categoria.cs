using System.ComponentModel.DataAnnotations;

namespace HelpDeskApi.Models
{
    public class Categoria
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "O nome da categoria é obrigatório.")]
        [StringLength(50, ErrorMessage = "O nome da categoria deve ter no máximo 50 caracteres.")]
        public string Nome { get; set; } = string.Empty;
    }
}