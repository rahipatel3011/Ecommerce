using Mango.MessageBus.Services;
using Mango.MessageBus.Services.IServices;
using Mango.Services.ShoppingCartApi.Data;
using Mango.Services.ShoppingCartApi.Services;
using Mango.Services.ShoppingCartApi.Services.IServices;
using Mango.Services.ShoppingCartApi.Utils;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;


var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy(MyAllowSpecificOrigins,policy =>
    {
        policy.AllowAnyHeader();
        policy.AllowAnyMethod();
        policy.AllowCredentials();
        policy.WithOrigins(["http://localhost:5173"]);
    });
}); //ADD CORS
builder.Services.AddHttpContextAccessor();

builder.Services.AddScoped<IProductService,ProductService>();
builder.Services.AddScoped<ICouponService,CouponService>();
builder.Services.AddScoped<BackendTokenDelegateHandler>();
builder.Services.AddScoped<IMessageBus,MessageBus>();

// Add services to the container.
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

//AutoMapper
builder.Services.AddAutoMapper(typeof(Program));


// CONFIGURE DATABASE
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

//Configure JWT Authentication Authentication and authorization
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateAudience = true,
        ValidateIssuer = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["ApiSettings:JwtOptions:Issuer"],
        ValidAudience = builder.Configuration["ApiSettings:JwtOptions:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["ApiSettings:JwtOptions:SecretKey"]!))
    };
});
builder.Services.AddAuthorization();


// Adding HttpClient
builder.Services.AddHttpClient("Product", client => client.BaseAddress = new Uri(builder.Configuration["ServiceAPIs:ProductAPI"]!)).AddHttpMessageHandler<BackendTokenDelegateHandler>();
builder.Services.AddHttpClient("Coupon", client => client.BaseAddress = new Uri(builder.Configuration["ServiceAPIs:CouponAPI"]!)).AddHttpMessageHandler<BackendTokenDelegateHandler>();

var app = builder.Build();
ApplyMigration();
app.UseStaticFiles();
app.UseCors(MyAllowSpecificOrigins);
// Configure the HTTP request pipeline.
    app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Cart API");
    c.RoutePrefix = string.Empty;
});

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();



void ApplyMigration()
{
    using (var scope = app.Services.CreateScope())
    {
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        context.Database.Migrate();
    }
}