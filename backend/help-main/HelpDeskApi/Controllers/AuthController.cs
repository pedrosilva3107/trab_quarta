// Importa recursos para criar controllers e retornar respostas HTTP
using Microsoft.AspNetCore.Mvc;
// Importa o Entity Framework para consultar o banco de dados de forma assíncrona
using Microsoft.EntityFrameworkCore;
// Importa recursos para trabalhar com tokens JWT
using Microsoft.IdentityModel.Tokens;
// Importa o handler que cria e valida tokens JWT
using System.IdentityModel.Tokens.Jwt;
// Importa o recurso de Claims (informações embutidas no token, como nome e e-mail)
using System.Security.Claims;
// Importa codificação de texto (usado para converter a chave secreta em bytes)
using System.Text;
// Importa o contexto do banco de dados da aplicação
using HelpDeskApi.Data;
// Importa o DTO de login (objeto que recebe e-mail e senha do cliente)
using HelpDeskApi.DTOs;
// Importa o Model de Usuário
using HelpDeskApi.Models;

namespace HelpDeskApi.Controllers
{
    // Define a rota base do controller: http://localhost:PORTA/api/auth
    // [controller] é substituído automaticamente pelo nome da classe sem "Controller" → "auth"
    [Route("api/[controller]")]

    // Informa ao ASP.NET que esta classe é um controller de API
    // Habilita validação automática do modelo e retornos padronizados
    [ApiController]
    public class AuthController : ControllerBase
    {
        // Variável privada para acessar o banco de dados
        private readonly AppDbContext _context;

        // Variável privada para acessar as configurações do appsettings.json (chave JWT, etc.)
        private readonly IConfiguration _configuration;

        // Construtor — o ASP.NET injeta automaticamente o banco e as configurações (Injeção de Dependência)
        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;           // Salva o banco para usar nos métodos
            _configuration = configuration; // Salva as configurações para ler a chave JWT
        }

        // Endpoint de login: POST http://localhost:PORTA/api/auth/login
        // Recebe e-mail e senha no corpo da requisição (JSON) via LoginDto
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            // Verifica se os dados recebidos passaram nas validações do LoginDto
            // Ex: e-mail com formato inválido ou senha muito curta retorna 400 Bad Request
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Busca no banco o primeiro usuário com o e-mail informado
            // FirstOrDefaultAsync retorna null se não encontrar nenhum
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            // Se o usuário não existe OU a senha está errada, retorna 401 Unauthorized
            // Nota: em produção, a senha deveria ser comparada com hash (ex: BCrypt)
            if (usuario == null || usuario.Senha != loginDto.Senha)
            {
                return Unauthorized(new { message = "E-mail ou senha incorretos" });
            }

            // Gera o token JWT para o usuário autenticado
            var token = GenerateJwtToken(usuario);

            // Retorna 200 OK com o token e os dados básicos do usuário
            return Ok(new
            {
                token,       // O token JWT que o frontend usará nas próximas requisições
                usuario = new
                {
                    usuario.Id,    // Id do usuário
                    usuario.Nome,  // Nome do usuário
                    usuario.Email  // E-mail do usuário
                }
            });
        }

        // Método privado que gera o token JWT — chamado somente dentro deste controller
        private string GenerateJwtToken(Usuario usuario)
        {
            // Lê as configurações JWT do appsettings.json (seção "Jwt")
            var jwtSettings = _configuration.GetSection("Jwt");

            // Converte a chave secreta de texto para um array de bytes (necessário para assinar o token)
            var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]!);

            // Define as informações que serão embutidas no token (payload)
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                // Claims = informações do usuário gravadas dentro do token
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()), // Id do usuário
                    new Claim(ClaimTypes.Name, usuario.Nome),                    // Nome do usuário
                    new Claim(ClaimTypes.Email, usuario.Email)                   // E-mail do usuário
                }),

                // Define quando o token expira (lê o tempo do appsettings.json, padrão 60 minutos)
                Expires = DateTime.UtcNow.AddMinutes(
                    int.Parse(jwtSettings["ExpiresInMinutes"] ?? "60")),

                // Issuer = quem emitiu o token (identificação do servidor)
                Issuer = jwtSettings["Issuer"],

                // Audience = quem pode usar o token (identificação do cliente autorizado)
                Audience = jwtSettings["Audience"],

                // Define o algoritmo de assinatura: HMAC-SHA256 com a chave secreta
                // Isso garante que o token não foi alterado
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            // Cria o token com base nas configurações acima
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            // Converte o token para a string final no formato: xxxxx.yyyyy.zzzzz
            return tokenHandler.WriteToken(token);
        }
    }
}
