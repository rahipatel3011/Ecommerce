using Mango.Services.OrderApi.Models.DTOs;

namespace Mango.Services.OrderApi.Services.IServices
{
    public interface IProductService
    {
        Task<IEnumerable<ProductDTO>> GetProducts();
    }
}
