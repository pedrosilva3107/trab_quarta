// Importa recursos para criar controllers e retornar respostas HTTP
using Microsoft.AspNetCore.Mvc;
// Importa o Entity Framework para consultas assíncronas e relacionamentos (Include)
using Microsoft.EntityFrameworkCore;
// Importa o contexto do banco de dados
using HelpDeskApi.Data;
// Importa o Model de OS (Ordem de Serviço)
using HelpDeskApi.Models;

namespace HelpDeskApi.Controllers
{
    // Define a rota base: http://localhost:PORTA/api/oss
    [Route("api/[controller]")]

    // Informa que é um controller de API (habilita validações automáticas)
    [ApiController]
    public class OSsController : ControllerBase
    {
        // Variável privada para acessar o banco de dados
        private readonly AppDbContext _context;

        // Construtor — o ASP.NET injeta o banco automaticamente (Injeção de Dependência)
        public OSsController(AppDbContext context)
        {
            _context = context; // Salva o banco para usar nos métodos abaixo
        }

        // ─── 1. LISTAR TODAS ───────────────────────────────────────────
        // GET http://localhost:PORTA/api/oss
        // Retorna a lista completa de Ordens de Serviço (200 OK)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OS>>> GetOSs()
        {
            return await _context.OSs
                // Include carrega os dados do Usuário relacionado (JOIN na tabela Usuarios)
                // Sem Include, o campo "Usuario" viria null mesmo tendo dados no banco
                .Include(o => o.Usuario)
                // Include carrega também os dados da Categoria relacionada (JOIN na tabela Categorias)
                .Include(o => o.Categoria)
                // Executa a consulta e retorna uma lista
                .ToListAsync();
        }

        // ─── 2. BUSCAR UMA POR ID ──────────────────────────────────────
        // GET http://localhost:PORTA/api/oss/{id}
        // Retorna uma OS específica pelo Id, com Usuário e Categoria incluídos
        [HttpGet("{id}")]
        public async Task<ActionResult<OS>> GetOS(int id)
        {
            var os = await _context.OSs
                // Carrega os dados do Usuário relacionado
                .Include(o => o.Usuario)
                // Carrega os dados da Categoria relacionada
                .Include(o => o.Categoria)
                // FirstOrDefaultAsync com condição — retorna a primeira OS com esse Id, ou null
                .FirstOrDefaultAsync(o => o.Id == id);

            // Se não encontrou nenhuma OS com esse Id, retorna 404 Not Found
            if (os == null)
            {
                return NotFound();
            }

            // Retorna a OS encontrada com 200 OK
            return os;
        }

        // ─── 3. CRIAR ──────────────────────────────────────────────────
        // POST http://localhost:PORTA/api/oss
        // Recebe os dados da nova OS no corpo da requisição (JSON)
        [HttpPost]
        public async Task<ActionResult<OS>> PostOS(OS os)
        {
            // Adiciona a nova OS ao contexto (ainda não salvou no banco)
            _context.OSs.Add(os);

            // Salva no banco de dados de forma assíncrona (executa o INSERT)
            await _context.SaveChangesAsync();

            // Retorna 201 Created com o cabeçalho Location apontando para o novo recurso
            return CreatedAtAction(nameof(GetOS), new { id = os.Id }, os);
        }

        // ─── 4. ATUALIZAR ──────────────────────────────────────────────
        // PUT http://localhost:PORTA/api/oss/{id}
        // Recebe o Id na URL e os dados atualizados no corpo (JSON)
        // Usado para mudar o status de uma OS (ex: "Aberta" → "Concluída")
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOS(int id, OS os)
        {
            // Verifica se o Id da URL bate com o Id do objeto recebido
            if (id != os.Id)
            {
                return BadRequest("O ID da URL não bate com o ID do corpo da requisição.");
            }

            // Marca o objeto inteiro como "modificado" no EF
            // Isso faz o EF gerar um UPDATE com todos os campos na hora de salvar
            _context.Entry(os).State = EntityState.Modified;

            try
            {
                // Salva as alterações no banco (executa o UPDATE)
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // Erro de concorrência: dois usuários tentaram alterar o mesmo registro ao mesmo tempo
                if (!OSExists(id))
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
        // DELETE http://localhost:PORTA/api/oss/{id}
        // Remove a OS com o Id informado na URL
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOS(int id)
        {
            // Busca a OS pelo Id
            var os = await _context.OSs.FindAsync(id);

            // Se não existe, retorna 404 Not Found
            if (os == null)
            {
                return NotFound();
            }

            // Remove a OS do contexto (marca para deletar)
            _context.OSs.Remove(os);

            // Salva no banco (executa o DELETE)
            await _context.SaveChangesAsync();

            // Retorna 204 No Content — sucesso sem corpo de resposta
            return NoContent();
        }

        // ─── MÉTODO AUXILIAR ───────────────────────────────────────────
        // Verifica se uma OS com determinado Id existe no banco
        // Usado internamente pelo PutOS para tratar concorrência
        private bool OSExists(int id)
        {
            // Any retorna true se existir pelo menos um registro com esse Id
            return _context.OSs.Any(e => e.Id == id);
        }
    }
}
