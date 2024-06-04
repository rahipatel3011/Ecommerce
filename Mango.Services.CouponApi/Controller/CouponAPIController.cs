using AutoMapper;
using Mango.Services.CouponApi.Data;
using Mango.Services.CouponApi.Models;
using Mango.Services.CouponApi.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Mango.Services.CouponApi.Controller
{
    [Route("api/coupon")]
    [ApiController]
    [Authorize]
    public class CouponAPIController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly ResponseDTO _response;
        private readonly IMapper _mapper;

        public CouponAPIController(ApplicationDbContext db, IMapper mapper)
        {
            _db = db;
            _response = new ResponseDTO();
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ResponseDTO> GetAllCoupons()
        {
            try
            {
                IEnumerable<Coupon> couponsObj = await _db.Coupons.ToListAsync();
                IEnumerable<CouponDTO> couponDto = _mapper.Map<IEnumerable<CouponDTO>>(couponsObj);
                _response.Result = couponDto;

            } catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.Message = ex.Message;
            }
            return _response;
        }


        [HttpGet("{id:int}")]
        public async Task<ResponseDTO> GetCoupon(int id)
        {
            try
            {
                Coupon coupon = _db.Coupons.First(coupon => coupon.CouponId == id);
                CouponDTO couponDto = _mapper.Map<CouponDTO>(coupon);
                _response.Result = couponDto;

            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.Message = ex.Message;
            }
            return _response;
        }

        [HttpGet("{code}")]
        public async Task<ResponseDTO> GetCoupon(string code)
        {
            try
            {
                Coupon coupon = _db.Coupons.First(coupon => coupon.CouponCode == code.ToUpper());
                CouponDTO couponDto = _mapper.Map<CouponDTO>(coupon);
                _response.Result = couponDto;

            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.Message = ex.Message;
            }
            return _response;
        }


        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ResponseDTO> CreateCoupon([FromBody]CouponDTO couponDto)
        {
            try
            {
                Coupon coupon = _mapper.Map<Coupon>(couponDto);
                coupon.CouponCode = couponDto.CouponCode.ToUpper(); // to awoid case sensitivity
                //await _db.Coupons.AddAsync(coupon);
                _db.Coupons.Add(coupon);


                var options = new Stripe.CouponCreateOptions
                {
                    AmountOff = (long)(couponDto.DiscountAmount * 100),
                    Name = coupon.CouponCode,
                    Currency = "usd",
                    Id = coupon.CouponCode
                    
                };
                var service = new Stripe.CouponService();
                service.Create(options);

                // updating database after creting in a stripe
                int response = await _db.SaveChangesAsync();
                _response.Result = response;
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.Message = ex.Message;
            }
            return _response;
        }

        [HttpPut]
        [Authorize(Roles ="Admin")]
        public async Task<ResponseDTO> UpdateCoupon(CouponDTO couponDto)
        {
            try
            {
                Coupon coupon = _mapper.Map<Coupon>(couponDto);
                _db.Coupons.Update(coupon);
                int response = await _db.SaveChangesAsync();
                _response.Result = response;
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.Message = ex.Message;
            }
            return _response;
        }

        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<ResponseDTO> DeleteCoupon(int id)
        {
            try
            {
                Coupon foundCoupon = await _db.Coupons.FirstAsync(coupon => coupon.CouponId == id);
                _db.Coupons.Remove(foundCoupon);
                int affectRow = await _db.SaveChangesAsync();

                var service = new Stripe.CouponService();
                service.Delete(foundCoupon.CouponCode);

                _response.Result = affectRow;
            }catch(Exception ex)
            {
                _response.IsSuccess = false;
                _response.Message = ex.Message;
            }
            return _response;
        }




        

    }
}
