using AutoMapper;
using Mango.Services.CouponApi.Models;
using Mango.Services.CouponApi.Models.DTOs;

namespace Mango.Services.CouponApi.Profiles
{
    public class CouponProfile : Profile
    {
        public CouponProfile() {
            CreateMap<Coupon, CouponDTO>().ReverseMap();
        }
    }
}
