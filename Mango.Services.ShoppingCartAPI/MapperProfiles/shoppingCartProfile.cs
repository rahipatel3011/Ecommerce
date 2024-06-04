using AutoMapper;
using Mango.Services.ShoppingCartAPI.Models;
using Mango.Services.ShoppingCartAPI.Models.DTOs;

namespace Mango.Services.ShoppingCartApi.MapperProfiles
{
    public class shoppingCartProfile: Profile
    {
        public shoppingCartProfile()
        {
            CreateMap<CartDTO,Cart>().ReverseMap();
            CreateMap<CartItemDTO, CartItem>().ReverseMap();
        }
    }
}
