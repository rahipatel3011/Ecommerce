namespace Mango.Services.AuthApi.Models.DTOs
{
    public class LoginResponseDTO
    {
        public UserDTO User { get; set; }
        public String token { get; set; } = "";
    }
}
