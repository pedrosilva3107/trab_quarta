using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HelpDeskApi.Data;
using HelpDeskApi.Models;

namespace HelpDeskApi.Controllers
{
    // A rota base será: http://localhost:PORTA/api/categorias
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriasController : ControllerBase
    {
        private readonly AppDbContext _context;

        // O Controller pede o Banco de Dados emprestado aqui
        public CategoriasController(AppDbContext context)
        {
            _context = context;
        }

        // 1. READ: Listar todas as categorias (GET)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Categoria>>> GetCategorias()
        {
            return await _context.Categorias.ToListAsync();
        }

        // 2. READ: Buscar uma categoria por ID (GET)
        [HttpGet("{id}")]
        public async Task<ActionResult<Categoria>> GetCategoria(int id)
        {
            var categoria = await _context.Categorias.FindAsync(id);

            if (categoria == null)
            {
                return NotFound("Categoria não encontrada."); // Retorna erro 404
            }

            return categoria;
        }

        // 3. CREATE: Criar uma nova categoria (POST)
        [HttpPost]
        public async Task<ActionResult<Categoria>> PostCategoria(Categoria categoria)
        {
            _context.Categorias.Add(categoria);
            await _context.SaveChangesAsync(); // Salva no banco

            // Retorna o código 201 (Criado) e mostra onde o item foi salvo
            return CreatedAtAction(nameof(GetCategoria), new { id = categoria.Id }, categoria);
        }

        // 4. UPDATE: Atualizar uma categoria existente (PUT)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategoria(int id, Categoria categoria)
        {
            if (id != categoria.Id)
            {
                return BadRequest("O ID da URL é diferente do ID do corpo da requisição.");
            }

            _context.Entry(categoria).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoriaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent(); // Retorna 204 (Sucesso, sem conteúdo para mostrar)
        }

        // 5. DELETE: Deletar uma categoria (DELETE)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategoria(int id)
        {
            var categoria = await _context.Categorias.FindAsync(id);
            if (categoria == null)
            {
                return NotFound();
            }

            _context.Categorias.Remove(categoria);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Método auxiliar para checar se a categoria existe
        private bool CategoriaExists(int id)
        {
            return _context.Categorias.Any(e => e.Id == id);
        }
    }
}