using Mango.Services.EmailApi.Models.DTOs;

namespace Mango.Services.EmailApi.Services.IServices
{
    public interface IEmailService
    {
        Task EmailCartAndLog(CartDTO cartDTO);
        Task RegisterUserEmailAndLog(string email);
        Task LogOrderPlaced(RewardMessageDTO rewardMessageDTO);
    }
}
