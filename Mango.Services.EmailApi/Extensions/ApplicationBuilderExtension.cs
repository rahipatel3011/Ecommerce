using Mango.Services.EmailApi.Messaging;

namespace Mango.Services.EmailApi.Extensions
{
    public static class ApplicationBuilderExtension
    {
        public static IApplicationBuilder UseAzureServiceBusConsumer(this IApplicationBuilder app)
        {
            IAzureServiceBusConsumer azureServiceBusConsumer = app.ApplicationServices.GetService<IAzureServiceBusConsumer>();

            IHostApplicationLifetime? hostApplicationLifetime = app.ApplicationServices.GetService<IHostApplicationLifetime>();

            hostApplicationLifetime.ApplicationStarted.Register(() => azureServiceBusConsumer?.Start());
            hostApplicationLifetime.ApplicationStopped.Register(()=> azureServiceBusConsumer?.Stop());

            return app;
        }
    }
}
