
using Azure.Messaging.ServiceBus;
using Mango.Services.RewardApi.Services;
using Mango.Services.RewardApi.Services.IServices;
using Mango.Services.RewardsApi.Message;
using Newtonsoft.Json;
using System.Text;

namespace Mango.Services.RewardApi.Messaging
{
    public class AzureServiceBusConsumer : IAzureServiceBusConsumer
    {
        private readonly RewardService _rewardService;
        private readonly IConfiguration _config;
        private readonly ServiceBusProcessor _rewardProcessor;

        public AzureServiceBusConsumer(IConfiguration config, RewardService rewardService)
        {
            _rewardService = rewardService;
            _config = config;
            string serviceConnectionString = _config.GetValue<string>("ServiceBusConnectionString")!;
            ServiceBusClient client = new ServiceBusClient(serviceConnectionString);


            var SubscriptionName = _config.GetValue<string>("TopicAndQueueNames:OrderCreated_RewardUpdate_Subscription");
            var TopicName = _config.GetValue<string>("TopicAndQueueNames:OrderCreatedTopic");
            _rewardProcessor= client.CreateProcessor(TopicName,SubscriptionName);
        }

        public async Task Start()
        {
            _rewardProcessor.ProcessMessageAsync += OnRewardUpdateRequestReceive;
            _rewardProcessor.ProcessErrorAsync += ErrorHandler;
            await _rewardProcessor.StartProcessingAsync();

        }

        private async Task OnRewardUpdateRequestReceive(ProcessMessageEventArgs args)
        {
            var message = args.Message;
            string body = Encoding.UTF8.GetString(message.Body);
            RewardMessage rewardMessage = JsonConvert.DeserializeObject<RewardMessage>(body);

            // To-Do call service to add and log into Database
            try
            {
                await _rewardService.UpdateReward(rewardMessage);
                await args.CompleteMessageAsync(args.Message);

            }catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        private Task ErrorHandler(ProcessErrorEventArgs args)
        {
            Console.WriteLine(args.Exception.ToString());
            return Task.CompletedTask;
        }

        public async Task Stop()
        {
            await _rewardProcessor.StopProcessingAsync();
            await _rewardProcessor.DisposeAsync();

        }
    }
}
