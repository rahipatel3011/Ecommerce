namespace Mango.Services.RewardApi.Messaging
{
    public interface IAzureServiceBusConsumer
    {
        public Task Start();
        public Task Stop();
    }
}
