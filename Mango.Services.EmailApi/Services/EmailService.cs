using Mango.Services.EmailApi.Data;
using Mango.Services.EmailApi.Models;
using Mango.Services.EmailApi.Models.DTOs;
using Mango.Services.EmailApi.Services.IServices;
using System.Text;

namespace Mango.Services.EmailApi.Services
{
    public class EmailService : IEmailService
    {
        private readonly ApplicationDbContext _db;

        public EmailService(ApplicationDbContext db) {
            _db=db;
        }
        public async Task EmailCartAndLog(CartDTO cartDTO)
        {
            StringBuilder message = new StringBuilder();
            message.Append("<br/>Cart Email Requested ");
            message.Append("<br/>Total " + cartDTO.total);
            message.Append("<br/>");
            message.Append("<ul>");

            foreach(CartItemDTO item in cartDTO.Items)
            {
                message.Append("<li>");
                message.Append(item.Product.Name + " X " + item.Quantity);
                message.Append("</li>");
            }

            message.Append("/ul>");
             await LogAndEmail(cartDTO.Email, message.ToString());
        }

        public async Task RegisterUserEmailAndLog(string email)
        {
            string message = "User Registration Successful. </br> Email : " + email;
            await LogAndEmail(email, message);
        }

        public async Task LogOrderPlaced(RewardMessageDTO rewardMessageDTO)
        {
            string message = "New Order Placed, Order ID: " + rewardMessageDTO.orderId;
            await LogAndEmail("Admin@email.com", message);
        }

        private async Task<bool> LogAndEmail(string email, string message)
        {
            try
            {
                EmailLogger emailLog = new EmailLogger()
                {
                    Email = email,
                    Message = message,
                    EmailSet = DateTime.Now
                };

                _db.EmailLoggers.Add(emailLog);
                await _db.SaveChangesAsync();

                return true;

            }catch (Exception ex) {
                return false;
            }
        }
    }
}
