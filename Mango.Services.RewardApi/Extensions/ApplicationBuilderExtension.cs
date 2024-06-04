using Mango.Services.RewardApi.Messaging;

namespace Mango.Services.RewardApi.Extensions
{
    public static class ApplicationBuilderExtension
    {
        public static IApplicationBuilder useAzureServiceBusConsumer(this IApplicationBuilder app)
        {
            // To do add services 
            IAzureServiceBusConsumer azureServiceBusConsumer =  app.ApplicationServices.GetRequiredService<IAzureServiceBusConsumer>();

             var hostApplicationLifetime = app.ApplicationServices.GetService<IHostApplicationLifetime>();

            hostApplicationLifetime.ApplicationStarted.Register(() => azureServiceBusConsumer.Start());
            hostApplicationLifetime.ApplicationStopped.Register(() => azureServiceBusConsumer.Stop());

            return app;
        }
    }
}
