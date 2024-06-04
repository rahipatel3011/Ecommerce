using Mango.Services.AuthApi.Models;
using Mango.Services.AuthApi.Service.IService;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Mango.Services.AuthApi.Service
{
    public class JwtService : IJwtService
    {

        private readonly IConfiguration _config;
        public JwtService(IConfiguration configuration) { 
            _config = configuration;
        } 
        public string generateToken(ApplicationUser user, IEnumerable<string> roles)
        {
            string key = _config["ApiSettings:JwtOptions:SecretKey"];
            string issuer = _config["ApiSettings:JwtOptions:Issuer"];
            string audience = _config["ApiSettings:JwtOptions:Audience"];
            SymmetricSecurityKey SecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            SigningCredentials credentials = new SigningCredentials(SecurityKey, SecurityAlgorithms.HmacSha256);

            List<Claim> claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Name, user.Name),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.Id)
            };

            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            var token = new JwtSecurityToken(issuer,audience,claims, DateTime.Now, DateTime.Now.AddMinutes(120),credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
