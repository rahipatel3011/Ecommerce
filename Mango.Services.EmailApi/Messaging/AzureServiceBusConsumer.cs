using Azure.Messaging.ServiceBus;
using Mango.Services.EmailApi.Models.DTOs;
using Mango.Services.EmailApi.Services.IServices;
using Newtonsoft.Json;
using System.Text;

namespace Mango.Services.EmailApi.Messaging
{
    public class AzureServiceBusConsumer : IAzureServiceBusConsumer
    {
        private readonly string serviceBusConnectionString;
        private readonly string emailCartQueue;
        private readonly string registerUserQueue;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _config;
        private readonly ServiceBusProcessor _rewardProcessor;
        private ServiceBusProcessor _emailProcessor;
        private ServiceBusProcessor _registerUserProcessor;

        public AzureServiceBusConsumer(IConfiguration config, IEmailService emailService)
        {
            _emailService = emailService;
            _config = config;
            serviceBusConnectionString = _config.GetValue<string>("ServiceBusConnectionString")!;
            emailCartQueue = _config.GetValue<string>("TopicAndQueueNames:EmailShoppingCartQueue")!;
            registerUserQueue = _config.GetValue<string>("TopicAndQueueNames:RegisterUserQueue")!;
            var client = new ServiceBusClient(serviceBusConnectionString);
            _emailProcessor = client.CreateProcessor(emailCartQueue);
            //processor for register user
            _registerUserProcessor = client.CreateProcessor(registerUserQueue);
            // processor for reward

            var SubscriptionName = _config.GetValue<string>("TopicAndQueueNames:OrderCreated_OrderCreated_Subscription");
            var TopicName = _config.GetValue<string>("TopicAndQueueNames:OrderCreatedTopic");
            _rewardProcessor = client.CreateProcessor(TopicName, SubscriptionName);
        }

        public async Task Start()
        {
            _emailProcessor.ProcessMessageAsync += OnEmailCartRequestReceived;
            _emailProcessor.ProcessErrorAsync += ErrorHandler;
            await _emailProcessor.StartProcessingAsync();

            _registerUserProcessor.ProcessMessageAsync += OnUserRegisterRequestReceived;
            _registerUserProcessor.ProcessErrorAsync += ErrorHandler;
            await _registerUserProcessor.StartProcessingAsync();

            _rewardProcessor.ProcessMessageAsync += OnRewardRequestReceived;
            _rewardProcessor.ProcessErrorAsync += ErrorHandler;
            await _rewardProcessor.StartProcessingAsync();
        }

        private async Task OnRewardRequestReceived(ProcessMessageEventArgs args)
        {
            ServiceBusReceivedMessage message = args.Message;
            string body = Encoding.UTF8.GetString(message.Body);
            RewardMessageDTO rewardMessageDTO = JsonConvert.DeserializeObject<RewardMessageDTO>(body);
            try
            {
                // TO- DO here
                await _emailService.LogOrderPlaced(rewardMessageDTO);
                await args.CompleteMessageAsync(args.Message);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        private async Task OnUserRegisterRequestReceived(ProcessMessageEventArgs args)
        {
            ServiceBusReceivedMessage message = args.Message;
            string body = Encoding.UTF8.GetString(message.Body);
            string email = JsonConvert.DeserializeObject<string>(body);
            try
            {
                await _emailService.RegisterUserEmailAndLog(email);
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

        private async Task OnEmailCartRequestReceived(ProcessMessageEventArgs args)
        {
            var message = args.Message;
            var body = Encoding.UTF8.GetString(message.Body);
            CartDTO? cartDTO = JsonConvert.DeserializeObject<CartDTO>(body);
            try
            {
                //log email
                await _emailService.EmailCartAndLog(cartDTO);
                await args.CompleteMessageAsync(args.Message);
            }catch(Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task Stop()
        {
            await _emailProcessor.StopProcessingAsync();
            await _emailProcessor.DisposeAsync();


            await _registerUserProcessor.StopProcessingAsync();
            await _registerUserProcessor.DisposeAsync();

        }
    }
}
