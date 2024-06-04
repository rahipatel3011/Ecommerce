using AutoMapper;
using Mango.MessageBus.Services.IServices;
using Mango.Services.ShoppingCartApi.Data;
using Mango.Services.ShoppingCartApi.Models.DTOs;
using Mango.Services.ShoppingCartApi.Services;
using Mango.Services.ShoppingCartApi.Services.IServices;
using Mango.Services.ShoppingCartAPI.Models;
using Mango.Services.ShoppingCartAPI.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Mango.Services.ShoppingCartApi.Controllers
{
    [Route("api/cart")]
    [ApiController]
    [Authorize]
    public class ShoppingCartAPIController : ControllerBase
    {

        private readonly IMapper _mapper;
        private readonly ResponseDTO _response;
        private readonly ApplicationDbContext _db;
        private readonly IProductService _productService;
        private readonly ICouponService _couponService;
        private readonly IMessageBus _messageBus;
        private readonly IConfiguration _config;


        public ShoppingCartAPIController(ApplicationDbContext db, IMapper mapper, IProductService productService, ICouponService couponService, IMessageBus messageBus, IConfiguration config) {
            _db = db;
            _mapper = mapper;
            _productService = productService;
            _couponService = couponService;
            _response = new ResponseDTO();
            _messageBus = messageBus;
            _config = config;
        }


        [HttpGet("{userId}")]
        public async Task<ResponseDTO> GetCart([FromRoute]string userId)
        {

            try
            {
                Cart cart = await _db.Carts.Include(cart => cart.Items).FirstOrDefaultAsync(cart => cart.userId == userId);
                CartDTO cartDTO = new CartDTO();
                if (cart != null)
                {

                    cartDTO = _mapper.Map<CartDTO>(cart);

                    IEnumerable<ProductDTO> productDTOs = await _productService.GetProducts();

                    foreach (CartItemDTO item in cartDTO.Items)
                    {
                        item.Product = productDTOs.FirstOrDefault(product => product.ProductId == item.ProductId);
                        if (item.Product == null)
                        {
                            throw new ArgumentNullException(nameof(item.Product));
                        }
                        cartDTO.total += (item.Quantity * item.Product.Price);
                    }

                    // if coupon is applied
                    if (!String.IsNullOrEmpty(cartDTO.coupon))
                    {
                        CouponDTO couponDTO = await _couponService.getCoupon(cartDTO.coupon);
                        if(couponDTO != null && cartDTO.total < couponDTO.MinAmount)
                        {
                            // if coupon is already applied and then product deleted then remove coupon
                            cart.coupon = "";
                            _db.Update(cart);
                            await _db.SaveChangesAsync();
                            _response.IsSuccess = false;
                            _response.Message = $"Total amount should be ${couponDTO.MinAmount} min";
                        }
                        if (couponDTO != null && cartDTO.total >= couponDTO.MinAmount)
                        {
                            cartDTO.discount = couponDTO.DiscountAmount;
                            cartDTO.total = Math.Round(cartDTO.total - couponDTO.DiscountAmount,2);
                        }
                    }
                }

                _response.Result = cartDTO;

            }catch (Exception ex)
            {
                _response.Message = ex.Message;
                _response.IsSuccess = false;
            }
            return _response;
        }

        [HttpPost("CartUpsert")]
        public async Task<ResponseDTO> UpsertCart([FromBody]CartDTO cartDTO)
        {
            try
            {
                Cart? cartFromDb = await _db.Carts.Include(item=>item.Items).FirstOrDefaultAsync(cart=>cart.userId == cartDTO.userId);
                if(cartFromDb == null)
                {
                    // create new cart for the user
                    Cart cart = _mapper.Map<Cart>(cartDTO);
                    cart.Items = new List<CartItem>();
                    _db.Carts.Add(cart);
                    await _db.SaveChangesAsync();


                    CartItem cartItem = _mapper.Map<CartItem>(cartDTO.Items.First());
                    cartItem.CartId = cart.Id;
                    _db.Items.Add(cartItem);
                    //cart.Items = cart.Items.Append(cartItem);
                    await _db.SaveChangesAsync();

                }
                else
                {
                    // check if user has same cartItems in cart
                    CartItem? item = cartFromDb.Items.FirstOrDefault(cartItem=> cartItem.ProductId == cartDTO.Items.First().ProductId);
                    if(item == null)
                    {
                        // product is not inside cart
                        // add product to the cart
                        cartDTO.Items.First().CartId = cartFromDb.Id;
                        CartItem cartItem = _mapper.Map<CartItem>(cartDTO.Items.First());
                        _db.Items.Add(cartItem);


                        await _db.SaveChangesAsync();
                    }
                    else
                    {
                        // product is inside cart
                        // increase quantity of the product inside cart
                        item.Quantity += cartDTO.Items.First().Quantity;
                        _db.Items.Update(item);
                        await _db.SaveChangesAsync();
                    }
                }
                _response.Result = cartDTO;

            }catch (Exception ex) { 
                _response.Message = ex.Message;
                _response.IsSuccess = false;
            }

            return _response;
        }


        [HttpPost("RemoveCart")]
        public async Task<ResponseDTO> RemoveCart([FromBody]int cartItemId)
        {
            try
            {

                CartItem cartItemsFromDb = await _db.Items.FirstAsync(item => item.Id == cartItemId);
                _db.Items.Remove(cartItemsFromDb);

                int totalProducts = _db.Items.Where(item=>item.CartId == cartItemsFromDb.CartId).Count();
               
                if (totalProducts == 1)
                {
                    // means only 1 product is available in cart so delete entire cart
                    Cart cartToBeDeleted = await _db.Carts.FirstAsync(cart => cart.Id == cartItemsFromDb.CartId);
                    _db.Carts.Remove(cartToBeDeleted);
                }
               
                await _db.SaveChangesAsync();
                _response.Result = true;
            }
            catch (Exception ex)
            {
                _response.Message = ex.Message;
                _response.IsSuccess = false;
            }
            return _response;
        }

        [HttpPost("ApplyCoupon")] 
        public async Task<ResponseDTO> ApplyCoupon([FromBody]CartDTO cartDTO)
        {
            try
            {
                Cart cart = _db.Carts.First(cart=>cart.userId == cartDTO.userId);
                CouponDTO foundCoupon = await _couponService.getCoupon(cartDTO.coupon);
                if (foundCoupon == null)
                {
                    _response.Message = "Invalid/Expired Coupon Code";
                    _response.IsSuccess = false;
                    return _response;
                }
                if(foundCoupon.MinAmount > cartDTO.total)
                {
                    _response.Message = $"Total amount should be ${foundCoupon.MinAmount} min";
                    _response.IsSuccess = false;
                    return _response;
                }
                cart.coupon = cartDTO.coupon;
                _db.Carts.Update(cart);
                await _db.SaveChangesAsync();
                _response.Result = true;

            }catch (Exception ex)
            {
                _response.Message = ex.Message;
                _response.IsSuccess = false;
            }
            return _response;
        }


        [HttpPost("RemoveCoupon")]
        public async Task<ResponseDTO> RemoveCoupon([FromBody] CartDTO cartDTO)
        {
            try
            {
                Cart cart = _db.Carts.First(cart => cart.userId == cartDTO.userId);
                cart.coupon = String.Empty;
                _db.Carts.Update(cart);
                await _db.SaveChangesAsync();
                _response.Result = true;

            }
            catch (Exception ex)
            {
                _response.Message = ex.Message;
                _response.IsSuccess = false;
            }
            return _response;
        }


        [HttpPost("EmailCartRequest")]
        public async Task<ResponseDTO> SendEmailRequest([FromBody] CartDTO cartDTO)
        {
            try
            {
                await _messageBus.PublishMessage(_config.GetValue<string>("TopicAndQueueNames:EmailShoppingCartQueue")!,cartDTO);

            }
            catch (Exception ex)
            {
                _response.Message = ex.Message;
                _response.IsSuccess = false;
            }
            return _response;
        }



    }
}
