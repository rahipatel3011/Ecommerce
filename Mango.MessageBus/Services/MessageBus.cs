using Azure.Messaging.ServiceBus;
using Mango.MessageBus.Services.IServices;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Mango.MessageBus.Services
{
    public class MessageBus : IMessageBus
    {
        private readonly string _connectionString = "Endpoint=sb://mangoecom.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=FuXWf9CD4S+sg63+rtstRAmMbfcCDrywK+ASbFkLeYw=";
        public async Task PublishMessage(string topic_queue_Name, object message)
        {
            await using(var client = new ServiceBusClient(_connectionString))
            {
                ServiceBusSender sender = client.CreateSender(topic_queue_Name);

                string jsonMessage = JsonConvert.SerializeObject(message);
                ServiceBusMessage finalMessage = new ServiceBusMessage(Encoding.UTF8.GetBytes(jsonMessage))
                {
                    CorrelationId = new Guid().ToString()
                };
                await sender.SendMessageAsync(finalMessage);
                await sender.DisposeAsync();
            }
        }

    }
}
