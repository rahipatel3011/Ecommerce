using Mango.Services.AuthApi.Models;

namespace Mango.Services.AuthApi.Service.IService
{
    public interface IJwtService
    {
        string generateToken(ApplicationUser user, IEnumerable<string> roles);
    }
}
