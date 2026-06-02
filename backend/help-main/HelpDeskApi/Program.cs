// Importa o Entity Framework Core para configurar o banco de dados
using Microsoft.EntityFrameworkCore;
// Importa o pacote de autenticação JWT Bearer
using Microsoft.AspNetCore.Authentication.JwtBearer;
// Importa os parâmetros de validação do token JWT
using Microsoft.IdentityModel.Tokens;
// Importa codificação de texto (para converter a chave secreta em bytes)
using System.Text;
// Importa o contexto do banco de dados da aplicação
using HelpDeskApi.Data;

// Cria o "construtor" da aplicação — configura todos os serviços antes de iniciar
var builder = WebApplication.CreateBuilder(args);

// ======================== CORS ========================
// CORS (Cross-Origin Resource Sharing) controla quais origens podem acessar a API
// Sem isso, o navegador bloqueia chamadas do frontend (localhost:5173) para a API (localhost:5144)
builder.Services.AddCors(options =>
{
    // Cria uma política chamada "AllowAll"
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()  // Permite qualquer URL (ex: localhost:5173, qualquer IP)
              .AllowAnyMethod()  // Permite qualquer método HTTP (GET, POST, PUT, DELETE...)
              .AllowAnyHeader(); // Permite qualquer cabeçalho (Authorization, Content-Type...)
    });
});

// ======================== JWT Configuration ========================
// Lê as configurações do JWT definidas no arquivo appsettings.json (seção "Jwt")
var jwtSettings = builder.Configuration.GetSection("Jwt");

// Converte a chave secreta (string) para bytes — necessário para validar a assinatura do token
// O "!" no final garante que não é nulo (lança exceção se não encontrar a chave)
var key = Encoding.ASCII.GetBytes(jwtSettings["Key"] ??
    throw new InvalidOperationException("Chave JWT não encontrada no appsettings.json"));

// Configura o sistema de autenticação usando JWT Bearer como esquema padrão
builder.Services.AddAuthentication(options =>
{
    // Define JWT Bearer como o esquema padrão para autenticar requisições
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    // Define JWT Bearer como o esquema padrão para desafiar (pedir autenticação)
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    // Em desenvolvimento não precisamos de HTTPS para o token (em produção deve ser true)
    options.RequireHttpsMetadata = false;

    // Salva o token no contexto HTTP para acesso posterior se necessário
    options.SaveToken = true;

    // Define as regras de validação do token recebido nas requisições
    options.TokenValidationParameters = new TokenValidationParameters
    {
        // Valida se a assinatura do token bate com a chave secreta
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key), // A chave secreta usada para validar

        // Valida se o token foi emitido pelo servidor correto (campo "iss" do token)
        ValidateIssuer = true,
        // Valida se o token é destinado ao cliente correto (campo "aud" do token)
        ValidateAudience = true,

        // Os valores esperados de Issuer e Audience (devem bater com os do token gerado)
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],

        // Remove a tolerância de tempo padrão (5 min) — o token expira exatamente no horário definido
        ClockSkew = TimeSpan.Zero
    };
});

// Adiciona o suporte a Controllers (os arquivos da pasta Controllers/)
builder.Services.AddControllers();

// Adiciona o serviço que expõe os endpoints da API no formato OpenAPI (usado pelo Swagger)
builder.Services.AddEndpointsApiExplorer();

// Configura o Swagger — interface visual para testar a API no navegador
builder.Services.AddSwaggerGen(c =>
{
    // Define o título e versão da documentação da API
    c.SwaggerDoc("v1", new() { Title = "HelpDesk API", Version = "v1" });

    // Adiciona suporte a JWT no Swagger — permite enviar o token nas requisições de teste
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization. Exemplo: Bearer {token}", // Instrução para o usuário
        Name = "Authorization",                                       // Nome do cabeçalho HTTP
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,      // O token vai no cabeçalho
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,   // Tipo: chave de API
        Scheme = "Bearer"                                             // Prefixo "Bearer" antes do token
    });

    // Exige que o token seja enviado em todos os endpoints protegidos no Swagger
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer" // Referencia o esquema "Bearer" definido acima
                }
            },
            Array.Empty<string>() // Lista de escopos (vazia = sem restrição de escopo)
        }
    });
});

// Registra o banco de dados usando SQLite
// A string de conexão ("DefaultConnection") está no appsettings.json → ex: "Data Source=helpdesk.db"
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Constrói a aplicação com todas as configurações acima
var app = builder.Build();

// ======================== Middlewares ========================
// Middlewares são camadas que processam a requisição antes de chegar no controller

// Ativa o Swagger apenas em ambiente de desenvolvimento (não expõe em produção)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();    // Gera o JSON da documentação em /swagger/v1/swagger.json
    app.UseSwaggerUI(); // Exibe a interface visual em /swagger
}

// Redireciona automaticamente HTTP para HTTPS (segurança)
app.UseHttpsRedirection();

// Ativa a política de CORS definida acima ("AllowAll")
// IMPORTANTE: deve vir antes de UseAuthentication e UseAuthorization
app.UseCors("AllowAll");

// Ativa o middleware de autenticação — lê e valida o token JWT das requisições
// IMPORTANTE: deve vir antes do UseAuthorization
app.UseAuthentication();

// Ativa o middleware de autorização — verifica se o usuário tem permissão para o endpoint
app.UseAuthorization();

// Mapeia os controllers para as rotas definidas nos atributos [Route] e [HttpGet/Post/Put/Delete]
app.MapControllers();

// Inicia o servidor e começa a ouvir as requisições
app.Run();
