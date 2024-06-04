using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mango.Services.EmailApi.Models.DTOs
{
    public class CartDTO
    {
        public int Id { get; set; }
        public string userId { get; set; }
        public string coupon { get; set; }
        public double total { get; set; }
        public double discount { get; set; }
        public string? Name { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public ICollection<CartItemDTO> Items { get; set;}
    }
}
