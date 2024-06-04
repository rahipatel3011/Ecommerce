using Mango.Services.ShoppingCartApi.Models.DTOs;
using Mango.Services.ShoppingCartApi.Services.IServices;
using Newtonsoft.Json;

namespace Mango.Services.ShoppingCartApi.Services
{
    public class CouponService : ICouponService
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public CouponService(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        public async Task<CouponDTO> getCoupon(string code)
        {
            
            HttpClient client = _httpClientFactory.CreateClient("Coupon");
            
            HttpResponseMessage response = await client.GetAsync($"/api/coupon/{code}");
            if (response.IsSuccessStatusCode)
            {
                string apiContent = await response.Content.ReadAsStringAsync();
                ResponseDTO responseDTO = JsonConvert.DeserializeObject<ResponseDTO>(apiContent);
                if (responseDTO.IsSuccess)
                {
                    return JsonConvert.DeserializeObject<CouponDTO>(Convert.ToString(responseDTO.Result));
                }
            }
            return null;
        }
    }
}
