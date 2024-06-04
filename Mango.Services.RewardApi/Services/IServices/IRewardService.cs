
using Mango.Services.RewardsApi.Message;

namespace Mango.Services.RewardApi.Services.IServices
{
    public interface IRewardService
    {
        Task UpdateReward(RewardMessage rewardMessage);
    }
}
