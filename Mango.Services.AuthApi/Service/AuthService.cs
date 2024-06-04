using Azure.Messaging.ServiceBus;
using Mango.MessageBus.Services.IServices;
using Mango.Services.AuthApi.Data;
using Mango.Services.AuthApi.Models;
using Mango.Services.AuthApi.Models.DTOs;
using Mango.Services.AuthApi.Service.IService;
using Microsoft.AspNetCore.Identity;

namespace Mango.Services.AuthApi.Service
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IJwtService _jwt;

        public AuthService(ApplicationDbContext db, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IJwtService jwt) {
            _db = db;
            _userManager = userManager;
            _roleManager = roleManager;
            _jwt = jwt;
        }

        

        /// <summary>
        /// Allow user to login
        /// </summary>
        /// <param name="loginDTO">loginDTO</param>
        /// <returns>LoginResponseDTO</returns>
        public async Task<LoginResponseDTO> Login(LoginDTO loginDTO)
        {
            LoginResponseDTO responseDTO = new LoginResponseDTO();
            try
            {
                ApplicationUser? user = await _userManager.FindByEmailAsync(loginDTO.Email);
                
                if (user == null)
                {
                    return responseDTO;
                }
                var userDto = new UserDTO()
                {
                    Email = user.Email,
                    Id = user.Id,
                    Name = user.Name,
                    PhoneNumber = user.PhoneNumber
                };
                bool userCheck = await _userManager.CheckPasswordAsync(user, loginDTO.Password);

                if (!userCheck)
                {
                    return responseDTO; ;
                }

                IEnumerable<string> roles = await _userManager.GetRolesAsync(user);
                string jwt_token = _jwt.generateToken(user, roles);

                responseDTO.User = userDto;

                return new LoginResponseDTO() { token=jwt_token, User=userDto};
                



            }catch(Exception ex)
            {
                return null;
            }
            
        }



        /// <summary>
        /// Represent to register user into application
        /// </summary>
        /// <param name="registerDTO">registerDTO</param>
        /// <returns>empty string or error as a string</returns>
        public async Task<String> Register(RegisterDTO registerDTO)
        {
            
            ApplicationUser user = new ApplicationUser()
            {
                UserName = registerDTO.Email,
                Email = registerDTO.Email,
                NormalizedEmail = registerDTO.Email.ToUpper(),
                Name = registerDTO.Name,
                PhoneNumber = registerDTO.PhoneNumber,
            };

            try
            {
                IdentityResult response = await _userManager.CreateAsync(user,registerDTO.Password);
                if (response.Succeeded)
                {
                    bool isRoleAssigned = await AssignRole(registerDTO, registerDTO.Role);
                    // after registering user, find created user and return it
                    ApplicationUser foundUser = _db.ApplicationUsers.First(u => u.UserName == registerDTO.Email);
                    UserDTO userDTO = new UserDTO() {
                        Id = foundUser.Id,
                        Email = foundUser.Email,
                        Name = foundUser.Name,
                        PhoneNumber = foundUser.PhoneNumber,
                    };
                    return "";
                }
                else
                {
                    return response.Errors.FirstOrDefault().Description;
                }
            }catch(Exception ex)
            {
            }
            return "Error Encountered";
        }

        public async Task<bool> AssignRole(RegisterDTO registerDTO, string roleName)
        {
            ApplicationUser? user = await _userManager.FindByEmailAsync(registerDTO.Email);
            if(user != null)
            {
                if(!await _roleManager.RoleExistsAsync(roleName))
                {
                    await _roleManager.CreateAsync(new IdentityRole(roleName));
                }
                await _userManager.AddToRoleAsync(user, roleName);
                return true;
            }
            return false;
        }


    }
}
