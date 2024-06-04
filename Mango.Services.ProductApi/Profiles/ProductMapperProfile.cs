using AutoMapper;
using Mango.Services.ProductApi.Models;
using Mango.Services.ProductApi.Models.DTOs;

namespace Mango.Services.ProductApi.Profiles
{
    public class ProductMapperProfile : Profile
    {
        public ProductMapperProfile() { 
            CreateMap<Product, ProductDTO>().ReverseMap();
        }
    }
}
