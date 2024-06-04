using Mango.Services.ShoppingCartApi.Models.DTOs;

namespace Mango.Services.ShoppingCartApi.Services.IServices
{
    public interface ICouponService
    {
        Task<CouponDTO> getCoupon(string code); 
    }
}
