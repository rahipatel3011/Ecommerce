using System.ComponentModel.DataAnnotations;

namespace Mango.Services.AuthApi.Models.DTOs
{
    public class RegisterDTO
    {
        [Required]
        public String Name { get; set; }
        [Required]
        public String Email { get; set; }

        [MinLength(8,ErrorMessage ="Password must be {1} charachter long")]
        public String Password { get; set; }

        [Compare("Password", ErrorMessage ="Passwords should be matched")]
        public String ConfirmPassword { get; set; }
        [Phone]
        public String PhoneNumber { get; set; }

        public string? Role { get; set; }

    }
}
