
namespace Mango.Services.OrderApi.Models.DTOs
{
    public class OrderHeaderDTO
    {
        public int? OrderHeaderId { get; set; }
        public string? UserId { get; set; }
        public string? Coupon { get; set; }
        public string? Discount { get; set; }
        public double OrderTotal { get; set; }
        public string? Name { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public DateTime OrderTime { get; set; }
        public string? Status { get; set; }
        public string? PaymentIntentId { get; set; }
        public string? StripeSessionId { get; set; }
        public ICollection<OrderDetailsDTO> OrderDetails { get; set; }
    }
}
