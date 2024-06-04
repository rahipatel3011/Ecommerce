using Mango.Services.AuthApi.Models.DTOs;

namespace Mango.Services.AuthApi.Service.IService
{
    public interface IAuthService
    {
        Task<string> Register(RegisterDTO registerDTO);
        Task<LoginResponseDTO> Login(LoginDTO loginDTO);
        Task<bool> AssignRole(RegisterDTO registerDTO, string roleName);

    }
}
