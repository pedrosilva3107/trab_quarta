using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HelpDeskApi.Data;
using HelpDeskApi.Models;

namespace HelpDeskApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OSsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OSsController(AppDbContext context)
        {
            _context = context;
        }

        // 1. GET: Listar todas as OSs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OS>>> GetOSs()
        {
            return await _context.OSs
                                 .Include(o => o.Usuario)
                                 .Include(o => o.Categoria)
                                 .ToListAsync();
        }

        // 2. GET: Buscar uma OS específica pelo ID
        [HttpGet("{id}")]
        public async Task<ActionResult<OS>> GetOS(int id)
        {
            var os = await _context.OSs
                                   .Include(o => o.Usuario)
                                   .Include(o => o.Categoria)
                                   .FirstOrDefaultAsync(o => o.Id == id);

            if (os == null)
            {
                return NotFound();
            }

            return os;
        }

        // 3. POST: Criar uma nova Ordem de Serviço
        [HttpPost]
        public async Task<ActionResult<OS>> PostOS(OS os)
        {
            _context.OSs.Add(os);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOS), new { id = os.Id }, os);
        }

        // 4. PUT: Atualizar uma OS (ex: mudar o Status para "Concluída")
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOS(int id, OS os)
        {
            if (id != os.Id)
            {
                return BadRequest("O ID da URL não bate com o ID do corpo da requisição.");
            }

            _context.Entry(os).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OSExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // 5. DELETE: Deletar uma OS
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOS(int id)
        {
            var os = await _context.OSs.FindAsync(id);
            if (os == null)
            {
                return NotFound();
            }

            _context.OSs.Remove(os);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OSExists(int id)
        {
            return _context.OSs.Any(e => e.Id == id);
        }
    }
}