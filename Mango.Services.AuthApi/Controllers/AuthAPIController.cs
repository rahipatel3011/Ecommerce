using Mango.MessageBus.Services.IServices;
using Mango.Services.AuthApi.Models.DTOs;
using Mango.Services.AuthApi.Service.IService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Mango.Services.AuthApi.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthAPIController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ResponseDTO _response;
        private readonly IMessageBus _messageBus;
        private readonly IConfiguration _config;
        public AuthAPIController(IAuthService authService, IMessageBus messageBus, IConfiguration config) {
            _authService = authService;
            _response = new ResponseDTO();
            _messageBus = messageBus;
            _config = config;
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody]LoginDTO loginDto)
        {
            LoginResponseDTO loginResponseDTO = await _authService.Login(loginDto);
            _response.Result = loginResponseDTO;
            List<String> errors = new List<String>();
            if(loginResponseDTO == null)
            {
                errors.Add("Unable to login");
                _response.IsSuccess = false;
                _response.Message = errors;
                
                return BadRequest(_response);
            }
            if(loginResponseDTO.User == null || loginResponseDTO.token.Length <= 0)
            {
                errors.Add("Invalid Credentials");
                _response.IsSuccess = false;
                _response.Message = errors;
                //return _response;
                return Unauthorized(_response);
            }

            
            return Ok(_response);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody]RegisterDTO registerDTO)
        {
            List<String> errors =  new List<String>();
           
            string result = await _authService.Register(registerDTO);
            
            if(result.Equals(String.Empty)) {
                await _messageBus.PublishMessage(_config.GetValue<string>("TopicAndQueueNames:RegisterUserQueue"), registerDTO.Email);
                return Ok(_response);
            }

            // design service as it's only return empty string if it's successfull
            // if result is not empty string then it's error from the service class
            errors.Add(result);
            _response.IsSuccess = false;
            _response.Message = errors;
            return BadRequest(_response);
        }


        [HttpPost("AssignRole")]
        public async Task<IActionResult> AssignRole([FromBody] RegisterDTO registerDTO)
        {
            bool assignRoleSuccessful = await _authService.AssignRole(registerDTO, registerDTO.Role.ToUpper());
            List<String> errors = new List<String>();
            if (!assignRoleSuccessful)
            {
                errors.Add("Unable to AssignRole");
                _response.IsSuccess = false;
                _response.Message = errors;

                return BadRequest(_response);
            }
            return Ok(_response);
        }


    }
}
