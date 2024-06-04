using Mango.Services.OrderApi.Models.DTOs;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Mango.Services.OrderApi.Models.DTOs
{
    public class CartItemDTO
    {
        public int Id { get; set; }
        public int CartId { get; set; }
        [JsonIgnore]
        public CartDTO? Cart { get; set; }
        public int ProductId { get; set; }
        public ProductDTO? Product { get; set; } 
        public int Quantity { get; set; }
    }
}
