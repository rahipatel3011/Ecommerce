using Mango.Services.ShoppingCartApi.Models.DTOs;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Mango.Services.ShoppingCartAPI.Models
{
    public class CartItem
    {
        public int Id { get; set; }

        public int CartId { get; set; }

        [ForeignKey("CartId")]
        [JsonIgnore]
        public Cart Cart { get; set; }

        public int ProductId { get; set; }

        [NotMapped]
        public ProductDTO Product { get; set; } 
        public int Quantity { get; set; }
        public double Price { get; set; }
    }
}
