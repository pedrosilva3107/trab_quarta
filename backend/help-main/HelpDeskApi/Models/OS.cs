// Importa os recursos de validação de dados do .NET
using System.ComponentModel.DataAnnotations;
// Importa o recurso para definir chaves estrangeiras (FK)
using System.ComponentModel.DataAnnotations.Schema;

// Define o namespace (pacote/pasta lógica) onde essa classe está
namespace HelpDeskApi.Models
{
    // Classe que representa a tabela "OSs" (Ordens de Serviço) no banco de dados
    // Uma OS é um chamado técnico que tem descrição, status, usuário responsável e categoria
    public class OS
    {
        // [Key] indica que este campo é a chave primária (PK) da tabela
        // O banco gera o Id automaticamente (auto-increment)
        [Key]
        public int Id { get; set; }

        // Descrição do problema ou serviço a ser realizado
        // [Required] torna o campo obrigatório
        [Required(ErrorMessage = "A descrição é obrigatória.")]
        public string Descricao { get; set; } = string.Empty;

        // Status atual da OS — só aceita os valores: "Aberta", "Em Andamento" ou "Concluída"
        // [RegularExpression] valida o valor com uma expressão regular (regex)
        // O ^ indica início e $ indica fim da string — garante que o valor seja exatamente um dos três
        [Required(ErrorMessage = "O status é obrigatório.")]
        [RegularExpression("^(Aberta|Em Andamento|Concluída)$", ErrorMessage = "Status inválido.")]
        public string Status { get; set; } = "Aberta"; // Valor padrão ao criar uma OS nova

        // ─── Relacionamento com Usuário ───────────────────────────
        // UsuarioId armazena apenas o número (ID) do usuário responsável pela OS
        [Required(ErrorMessage = "O usuário/técnico é obrigatório.")]
        public int UsuarioId { get; set; }

        // [ForeignKey] diz ao EF que essa propriedade é a chave estrangeira (FK) ligada a UsuarioId
        // O "?" indica que pode ser nulo (nullable) — o EF carrega o objeto completo só quando pedido (Include)
        [ForeignKey("UsuarioId")]
        public Usuario? Usuario { get; set; }

        // ─── Relacionamento com Categoria ─────────────────────────
        // CategoriaId armazena apenas o número (ID) da categoria da OS
        [Required(ErrorMessage = "A categoria é obrigatória.")]
        public int CategoriaId { get; set; }

        // [ForeignKey] diz ao EF que essa propriedade é a chave estrangeira (FK) ligada a CategoriaId
        // O "?" indica que pode ser nulo (nullable) — carregado via Include nas queries
        [ForeignKey("CategoriaId")]
        public Categoria? Categoria { get; set; }
    }
}
