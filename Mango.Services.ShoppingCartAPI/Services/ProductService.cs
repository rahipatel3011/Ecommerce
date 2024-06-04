using Mango.Services.ShoppingCartApi.Models.DTOs;
using Mango.Services.ShoppingCartApi.Services.IServices;
using Newtonsoft.Json;

namespace Mango.Services.ShoppingCartApi.Services
{
    public class ProductService : IProductService
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public ProductService(IHttpClientFactory httpClientFactory) 
        {
            _httpClientFactory = httpClientFactory;
        }

        public async Task<IEnumerable<ProductDTO>> GetProducts()
        {
            HttpClient client = _httpClientFactory.CreateClient("Product");
            HttpResponseMessage response = await client.GetAsync($"/api/product");
            String apicontent = await response.Content.ReadAsStringAsync();
            ResponseDTO responseDTO = JsonConvert.DeserializeObject<ResponseDTO>(apicontent);
            if (responseDTO.IsSuccess)
            {
                return JsonConvert.DeserializeObject<IEnumerable<ProductDTO>>(Convert.ToString(responseDTO.Result));
            }
            return new List<ProductDTO>();
        }
    }
}
