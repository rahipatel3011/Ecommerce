using Mango.Services.OrderApi.Models.DTOs;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mango.Services.OrderApi.Models.DTOs
{
    public class CartDTO
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string Coupon { get; set; }
        public double Total { get; set; }
        public double Discount { get; set; }
        public string? Name { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public ICollection<CartItemDTO> Items { get; set;}
    }
}
