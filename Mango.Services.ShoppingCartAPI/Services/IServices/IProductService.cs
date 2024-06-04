using Mango.Services.ShoppingCartApi.Models.DTOs;

namespace Mango.Services.ShoppingCartApi.Services.IServices
{
    public interface IProductService
    {
        Task<IEnumerable<ProductDTO>> GetProducts();
    }
}
