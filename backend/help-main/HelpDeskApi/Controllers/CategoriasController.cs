// Importa recursos para criar controllers e retornar respostas HTTP
using Microsoft.AspNetCore.Mvc;
// Importa o Entity Framework para consultas assíncronas no banco
using Microsoft.EntityFrameworkCore;
// Importa o contexto do banco de dados
using HelpDeskApi.Data;
// Importa o Model de Categoria
using HelpDeskApi.Models;

namespace HelpDeskApi.Controllers
{
    // Define a rota base: http://localhost:PORTA/api/categorias
    [Route("api/[controller]")]

    // Informa que é um controller de API (habilita validações automáticas)
    [ApiController]
    public class CategoriasController : ControllerBase
    {
        // Variável privada para acessar o banco de dados
        private readonly AppDbContext _context;

        // Construtor — o ASP.NET injeta o banco automaticamente (Injeção de Dependência)
        public CategoriasController(AppDbContext context)
        {
            _context = context; // Salva o banco para usar nos métodos abaixo
        }

        // ─── 1. LISTAR TODAS ───────────────────────────────────────────
        // GET http://localhost:PORTA/api/categorias
        // Retorna a lista completa de categorias (200 OK)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Categoria>>> GetCategorias()
        {
            // ToListAsync() busca todos os registros da tabela Categorias de forma assíncrona
            return await _context.Categorias.ToListAsync();
        }

        // ─── 2. BUSCAR UMA POR ID ──────────────────────────────────────
        // GET http://localhost:PORTA/api/categorias/{id}
        // Retorna uma categoria específica pelo Id
        [HttpGet("{id}")]
        public async Task<ActionResult<Categoria>> GetCategoria(int id)
        {
            // FindAsync busca pelo valor da chave primária (Id)
            var categoria = await _context.Categorias.FindAsync(id);

            // Se não encontrou, retorna 404 Not Found com mensagem personalizada
            if (categoria == null)
            {
                return NotFound("Categoria não encontrada.");
            }

            // Retorna a categoria encontrada com 200 OK
            return categoria;
        }

        // ─── 3. CRIAR ──────────────────────────────────────────────────
        // POST http://localhost:PORTA/api/categorias
        // Recebe os dados da nova categoria no corpo da requisição (JSON)
        [HttpPost]
        public async Task<ActionResult<Categoria>> PostCategoria(Categoria categoria)
        {
            // Adiciona a nova categoria ao contexto (ainda não salvou no banco)
            _context.Categorias.Add(categoria);

            // Salva no banco de dados de forma assíncrona (executa o INSERT)
            await _context.SaveChangesAsync();

            // Retorna 201 Created com o cabeçalho Location apontando para o novo recurso
            return CreatedAtAction(nameof(GetCategoria), new { id = categoria.Id }, categoria);
        }

        // ─── 4. ATUALIZAR ──────────────────────────────────────────────
        // PUT http://localhost:PORTA/api/categorias/{id}
        // Recebe o Id na URL e os dados atualizados no corpo (JSON)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategoria(int id, Categoria categoria)
        {
            // Verifica se o Id da URL bate com o Id do objeto recebido
            if (id != categoria.Id)
            {
                return BadRequest("O ID da URL é diferente do ID do corpo da requisição.");
            }

            // Marca o objeto inteiro como "modificado" no EF
            // Isso faz o EF gerar um UPDATE com todos os campos na hora de salvar
            _context.Entry(categoria).State = EntityState.Modified;

            try
            {
                // Salva as alterações no banco (executa o UPDATE)
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // Erro de concorrência: dois usuários tentaram alterar o mesmo registro ao mesmo tempo
                if (!CategoriaExists(id))
                {
                    // Se o registro não existe mais, retorna 404 Not Found
                    return NotFound();
                }
                else
                {
                    // Outro problema de concorrência — relança para o ASP.NET tratar
                    throw;
                }
            }

            // Retorna 204 No Content — sucesso sem corpo de resposta
            return NoContent();
        }

        // ─── 5. DELETAR ────────────────────────────────────────────────
        // DELETE http://localhost:PORTA/api/categorias/{id}
        // Remove a categoria com o Id informado na URL
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategoria(int id)
        {
            // Busca a categoria pelo Id
            var categoria = await _context.Categorias.FindAsync(id);

            // Se não existe, retorna 404 Not Found
            if (categoria == null)
            {
                return NotFound();
            }

            // Remove a categoria do contexto (marca para deletar)
            _context.Categorias.Remove(categoria);

            // Salva no banco (executa o DELETE)
            await _context.SaveChangesAsync();

            // Retorna 204 No Content — sucesso sem corpo de resposta
            return NoContent();
        }

        // ─── MÉTODO AUXILIAR ───────────────────────────────────────────
        // Verifica se uma categoria com determinado Id existe no banco
        // Usado internamente pelo PutCategoria para tratar concorrência
        private bool CategoriaExists(int id)
        {
            // Any retorna true se existir pelo menos um registro com esse Id
            return _context.Categorias.Any(e => e.Id == id);
        }
    }
}
