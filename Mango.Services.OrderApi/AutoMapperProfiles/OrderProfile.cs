using AutoMapper;
using Mango.Services.OrderApi.Models;
using Mango.Services.OrderApi.Models.DTOs;

namespace Mango.Services.OrderApi.AutoMapperProfiles
{
    public class OrderProfile: Profile
    {
        public OrderProfile()
        {
            CreateMap<OrderDetails,OrderDetailsDTO>().ReverseMap();
            CreateMap<OrderHeader,OrderHeaderDTO>().ReverseMap();


            CreateMap<CartDTO, OrderHeaderDTO>()
                .ForMember(dest => dest.OrderTotal, opt => opt.MapFrom(src => src.Total))
                .ForMember(dest => dest.OrderDetails, opt => opt.MapFrom(src => src.Items))
                .ReverseMap();


            CreateMap<CartItemDTO, OrderDetailsDTO>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.Name))
                .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Product.Price));





            CreateMap<OrderDetails, CartItemDTO>();
        }
    }
}
