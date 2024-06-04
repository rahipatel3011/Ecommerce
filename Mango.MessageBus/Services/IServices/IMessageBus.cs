using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mango.MessageBus.Services.IServices
{
    public interface IMessageBus
    {
        Task PublishMessage(string topic_queue_Name, object message);
    }
}
