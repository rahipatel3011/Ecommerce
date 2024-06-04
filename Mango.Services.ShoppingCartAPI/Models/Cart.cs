using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mango.Services.ShoppingCartAPI.Models
{
    public class Cart
    {
        [Key]
        public int Id { get; set; }
        public string userId { get; set; }
        public string coupon { get; set; }
        public ICollection<CartItem> Items { get; set;}
    }
}
