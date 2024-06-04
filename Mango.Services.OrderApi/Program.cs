
using Mango.MessageBus.Services;
using Mango.MessageBus.Services.IServices;
using Mango.Services.OrderApi.Data;
using Mango.Services.OrderApi.Services;
using Mango.Services.OrderApi.Services.IServices;
using Mango.Services.OrderApi.Utility;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy(MyAllowSpecificOrigins, policy =>
    {
        policy.AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials()
        .WithOrigins("http://localhost:5173");
    });
});
builder.Services.AddHttpContextAccessor();

//authorization and authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateAudience = true,
        ValidateIssuer = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration.GetValue<string>("ApiSettings:JwtOptions:Issuer"),
        ValidAudience = builder.Configuration["ApiSettings:JwtOptions:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["ApiSettings:JwtOptions:SecretKey"]!)),
        ValidAlgorithms = new[] { SecurityAlgorithms.HmacSha256 }
    };
});
builder.Services.AddAuthorization();



// DataBase Config
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});
Stripe.StripeConfiguration.ApiKey = builder.Configuration.GetValue<string>("Stripe:StripeAPIKey");

//AutoMapper
builder.Services.AddAutoMapper(typeof(Program));

builder.Services.AddHttpClient("Product", client => client.BaseAddress = new Uri(builder.Configuration["ServiceAPIs:ProductAPI"]!)).AddHttpMessageHandler<BackendTokenDelegateHandler>();

// Add services to the container.
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IMessageBus, MessageBus>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition(name: "Bearer", securityScheme: new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter a valid token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            new string[]{}
        }
    });
});

var app = builder.Build();
ApplyMigration();
// Configure the HTTP request pipeline.

    app.UseSwagger(); 
app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Order API");
        c.RoutePrefix = string.Empty;
    });
app.UseStaticFiles();
app.UseCors(MyAllowSpecificOrigins);
app.UseAuthentication();
app.UseAuthorization();
app.UseHttpsRedirection();
app.MapControllers();
app.Run();



void ApplyMigration()
{
    using (var scope = app.Services.CreateScope())
    {
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        if(context.Database.GetMigrations().Count() > 0)
        {
            context.Database.Migrate();
        }
        
    }
}