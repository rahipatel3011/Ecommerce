using Mango.Services.RewardApi.Data;
using Mango.Services.RewardApi.Models;
using Mango.Services.RewardApi.Services.IServices;
using Mango.Services.RewardsApi.Message;
using Microsoft.EntityFrameworkCore;

namespace Mango.Services.RewardApi.Services
{
    public class RewardService : IRewardService
    {
        private readonly DbContextOptions<ApplicationDbContext> _options;

        public RewardService(DbContextOptions<ApplicationDbContext> options) {
            _options = options;
        }

        public async Task UpdateReward(RewardMessage rewardMessage)
        {
            try
            {

                Reward reward = new Reward()
                {
                    UserId = rewardMessage.UserId,
                    OrderId = rewardMessage.orderId,
                    RewardsActivity = rewardMessage.RewardsActivity,
                    RewardsDate = DateTime.Now
                };
                ApplicationDbContext _db = new ApplicationDbContext(_options);
                _db.Add(reward);
                await _db.SaveChangesAsync();
            }
            catch(Exception ex)
            {
            }
        }
    }
}
