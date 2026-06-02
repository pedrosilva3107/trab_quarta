using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HelpDeskApi.Models
{
    public class OS
    {
      
        [Key]
        public int Id { get; set; } 

        [Required(ErrorMessage = "A descrição é obrigatória.")]
        public string Descricao { get; set; } = string.Empty;

        [Required(ErrorMessage = "O status é obrigatório.")]
        [RegularExpression("^(Aberta|Em Andamento|Concluída)$", ErrorMessage = "Status inválido.")]
        public string Status { get; set; } = "Aberta";

   
        
        [Required(ErrorMessage = "O usuário/técnico é obrigatório.")]
        public int UsuarioId { get; set; } 
        [ForeignKey("UsuarioId")]
        public Usuario? Usuario { get; set; } 


        
        [Required(ErrorMessage = "A categoria é obrigatória.")]
        public int CategoriaId { get; set; }

        [ForeignKey("CategoriaId")]
        public Categoria? Categoria { get; set; } 
    }
}