// Importa recursos para criar controllers e retornar respostas HTTP
using Microsoft.AspNetCore.Mvc;
// Importa o Entity Framework para consultas assíncronas no banco
using Microsoft.EntityFrameworkCore;
// Importa o contexto do banco de dados
using HelpDeskApi.Data;
// Importa o Model de Usuário
using HelpDeskApi.Models;

namespace HelpDeskApi.Controllers
{
    // Define a rota base: http://localhost:PORTA/api/usuarios
    [Route("api/[controller]")]

    // Informa que é um controller de API (habilita validações automáticas)
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        // Variável privada para acessar o banco de dados
        private readonly AppDbContext _context;

        // Construtor — o ASP.NET injeta o banco automaticamente (Injeção de Dependência)
        public UsuariosController(AppDbContext context)
        {
            _context = context; // Salva o banco para usar nos métodos abaixo
        }

        // ─── 1. LISTAR TODOS ───────────────────────────────────────────
        // GET http://localhost:PORTA/api/usuarios
        // Retorna a lista completa de usuários do banco (200 OK)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Usuario>>> GetUsuarios()
        {
            // ToListAsync() busca todos os registros da tabela Usuarios de forma assíncrona
            return await _context.Usuarios.ToListAsync();
        }

        // ─── 2. BUSCAR UM POR ID ───────────────────────────────────────
        // GET http://localhost:PORTA/api/usuarios/{id}
        // Retorna um usuário específico pelo Id
        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> GetUsuario(int id)
        {
            // FindAsync busca pelo valor da chave primária (Id)
            var usuario = await _context.Usuarios.FindAsync(id);

            // Se não encontrou, retorna 404 Not Found
            if (usuario == null)
            {
                return NotFound();
            }

            // Retorna o usuário encontrado com 200 OK
            return usuario;
        }

        // ─── 3. CRIAR ──────────────────────────────────────────────────
        // POST http://localhost:PORTA/api/usuarios
        // Recebe os dados do novo usuário no corpo da requisição (JSON)
        [HttpPost]
        public async Task<ActionResult<Usuario>> PostUsuario(Usuario usuario)
        {
            // Adiciona o novo usuário ao contexto (ainda não salvou no banco)
            _context.Usuarios.Add(usuario);

            // Salva no banco de dados de forma assíncrona (executa o INSERT)
            await _context.SaveChangesAsync();

            // Retorna 201 Created com o cabeçalho Location apontando para o novo recurso
            // nameof(GetUsuario) = "GetUsuario" — indica qual endpoint busca o item criado
            return CreatedAtAction(nameof(GetUsuario), new { id = usuario.Id }, usuario);
        }

        // ─── 4. ATUALIZAR ──────────────────────────────────────────────
        // PUT http://localhost:PORTA/api/usuarios/{id}
        // Recebe o Id na URL e os dados atualizados no corpo (JSON)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsuario(int id, Usuario usuario)
        {
            // Verifica se o Id da URL bate com o Id do objeto recebido
            // Evita atualizar o registro errado por inconsistência
            if (id != usuario.Id)
            {
                return BadRequest("O ID da URL não bate com o ID do corpo da requisição.");
            }

            // Marca o objeto inteiro como "modificado" no EF
            // Isso faz o EF gerar um UPDATE com todos os campos na hora de salvar
            _context.Entry(usuario).State = EntityState.Modified;

            try
            {
                // Salva as alterações no banco (executa o UPDATE)
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // Esse erro acontece quando dois usuários tentam atualizar o mesmo registro ao mesmo tempo
                if (!UsuarioExists(id))
                {
                    // Se o registro não existe mais, retorna 404 Not Found
                    return NotFound();
                }
                else
                {
                    // Se foi outro problema de concorrência, relança o erro para o ASP.NET tratar
                    throw;
                }
            }

            // Retorna 204 No Content — sucesso sem corpo de resposta
            return NoContent();
        }

        // ─── 5. DELETAR ────────────────────────────────────────────────
        // DELETE http://localhost:PORTA/api/usuarios/{id}
        // Remove o usuário com o Id informado na URL
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            // Busca o usuário pelo Id
            var usuario = await _context.Usuarios.FindAsync(id);

            // Se não existe, retorna 404 Not Found
            if (usuario == null)
            {
                return NotFound();
            }

            // Remove o usuário do contexto (marca para deletar)
            _context.Usuarios.Remove(usuario);

            // Salva no banco (executa o DELETE)
            await _context.SaveChangesAsync();

            // Retorna 204 No Content — sucesso sem corpo de resposta
            return NoContent();
        }

        // ─── MÉTODO AUXILIAR ───────────────────────────────────────────
        // Verifica se um usuário com determinado Id existe no banco
        // Usado internamente pelo método PutUsuario para tratar concorrência
        private bool UsuarioExists(int id)
        {
            // Any retorna true se existir pelo menos um registro com esse Id
            return _context.Usuarios.Any(e => e.Id == id);
        }
    }
}
