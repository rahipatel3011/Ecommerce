using AutoMapper;
using Mango.MessageBus.Services.IServices;
using Mango.Services.OrderApi.Data;
using Mango.Services.OrderApi.Models;
using Mango.Services.OrderApi.Models.DTOs;
using Mango.Services.OrderApi.Services.IServices;
using Mango.Services.OrderApi.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;
using Stripe.Checkout;

namespace Mango.Services.OrderApi.Controllers
{
    [Route("api/order")]
    [ApiController]
    public class OrderApiController : ControllerBase
    {
        protected readonly ResponseDTO _response;
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _db;
        private readonly IProductService _productService;
        private readonly IConfiguration _config;
        private readonly IMessageBus _messageBus;

        public OrderApiController(IMapper mapper, ApplicationDbContext db, IProductService productService, IConfiguration config, IMessageBus messageBus)
        {
            _db = db;
            _mapper = mapper;
            _productService = productService;
            _response = new ResponseDTO();
            _config = config;
            _messageBus = messageBus;
        }



        /// <summary>
        /// Returns all orders if user is admin otherwise it returns all orders of the user
        /// </summary>
        /// <param name="userId">userId</param>
        /// <returns>All Orders</returns>
        [HttpGet("GetOrders/{userId}")]
        [Authorize]
        public async Task<ResponseDTO> GetOrders(string? userId){
            try
            {
                List<OrderHeader> allOrderHeader;
                if (User.IsInRole(SD.RoleAdmin))
                {
                    // if user is admin getting all orders
                    allOrderHeader = _db.OrderHeaders.Include(u => u.OrderDetails).OrderByDescending(u=>u.OrderHeaderId).ToList();
                }
                else
                {
                    // if user is not admin then retriving only there orders
                    allOrderHeader = _db.OrderHeaders.Include(u => u.OrderDetails).Where(orderHeader => orderHeader.UserId == userId).OrderByDescending(u => u.OrderHeaderId).ToList();
                }
                _response.Result = _mapper.Map<ICollection<OrderHeaderDTO>>(allOrderHeader);

            }catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.Message = ex.Message;
            }
            return _response;
        }



        /// <summary>
        /// Returns Order by OrderId
        /// </summary>
        /// <param name="orderId">Order ID</param>
        /// <returns>Order</returns>
        [HttpGet("GetOrder/{orderId:int}")]
        [Authorize]
        public async Task<ResponseDTO> GetOrders(int orderId)
        {
            try
            {
                OrderHeader orderHeader = await _db.OrderHeaders.Include(u=>u.OrderDetails).FirstAsync(orderHeader=>orderHeader.OrderHeaderId == orderId);
                _response.Result = _mapper.Map<OrderHeaderDTO>(orderHeader);

            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.Message = ex.Message;
            }
            return _response;
        }




        /// <summary>
        /// Creates orderHeader and orderDetail in database
        /// Returns Response DTO including orderHeaderDTO
        /// </summary>
        /// <param name="cartDTO">CartDTO</param>
        /// <returns>ResponseDTO</returns>
        [HttpPost("createOrder")]
        [Authorize]
        public async Task<ResponseDTO> CreateOrder([FromBody] CartDTO cartDTO)
        {

            try
            {
                OrderHeaderDTO orderHeaderDTO = _mapper.Map<OrderHeaderDTO>(cartDTO);
                orderHeaderDTO.OrderTime = DateTime.Now;
                orderHeaderDTO.Status = SD.Status_Pending;
                
                OrderHeader orderHeader= _mapper.Map<OrderHeader>(orderHeaderDTO);

                OrderHeader orderCreated = _db.OrderHeaders.Add(orderHeader).Entity;
                await _db.SaveChangesAsync();

                orderHeaderDTO.OrderHeaderId = orderCreated.OrderHeaderId;
                _response.Result = orderHeaderDTO;

            }catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.Message = ex.Message;
            }
            return _response;

        }



        /// <summary>
        /// Update Order status to new status
        /// </summary>
        /// <param name="orderId">Order Id</param>
        /// <param name="newStatus">New Status</param>
        /// <returns>Updated OrderHeader</returns>
        [HttpPost("UpdateOrder/{orderId:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<ResponseDTO> UpdateOrder([FromRoute]int orderId, [FromBody] string newStatus)
        {

            try
            {
                OrderHeader orderHeader = _db.OrderHeaders.First(orderHeader => orderHeader.OrderHeaderId == orderId);
                if (newStatus.ToLower() == SD.Status_Cancelled)
                {
                    var options = new RefundCreateOptions { 
                        PaymentIntent = orderHeader.PaymentIntentId,
                        Reason = RefundReasons.RequestedByCustomer
                    };
                    var service = new RefundService();
                    Refund refund = service.Create(options);
                }

                orderHeader.Status = newStatus;
                _db.Update(orderHeader);
                await _db.SaveChangesAsync();
                _response.Result = _mapper.Map<OrderHeaderDTO>(orderHeader);
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.Message = ex.Message;
            }
            return _response;

        }



        /// <summary>
        /// Creating Stripe Session
        /// Returns updated StripeDTO with session URL
        /// </summary>
        /// <param name="stripeRequestDTO">stripeDTO</param>
        /// <returns>ResponseDTO</returns>
        [HttpPost("CreateSession")]
        [Authorize]
        public async Task<ResponseDTO> CreateStripeSession([FromBody] StripeRequestDTO stripeRequestDTO)
        {
            try
            {

                // firstly, create List of products (SessionLineItemOptions) that we need to add to the stripe cart
                List<SessionLineItemOptions> items = new List<SessionLineItemOptions>();
                foreach (OrderDetailsDTO item in stripeRequestDTO.OrderHeader.OrderDetails)
                {
                    items.Add(new SessionLineItemOptions()
                    {
                        PriceData = new SessionLineItemPriceDataOptions()
                        {
                            Currency = "usd",
                            UnitAmount = (long)(item.Price * 100),
                            ProductData = new SessionLineItemPriceDataProductDataOptions()
                            {
                                Name = item.ProductName
                            },
                            
                        },
                        Quantity = item.Quantity,
                    }) ;
                }

                // adding coupon
                List<SessionDiscountOptions> discount = new List<SessionDiscountOptions>()
                {
                    new SessionDiscountOptions() {Coupon = stripeRequestDTO.OrderHeader.Coupon.ToUpper()}
                };


                // creating options for stripe session
                //var domain = _config.GetValue<string>("ServiceAPIs:FrontEnd");
                var options = new SessionCreateOptions
                {
                    LineItems = items,
                    Mode = "payment",
                    SuccessUrl = stripeRequestDTO.ApprovedUrl,
                    CancelUrl = stripeRequestDTO.CancelUrl,
                };
                if(stripeRequestDTO.OrderHeader.Coupon != null && stripeRequestDTO.OrderHeader.Coupon != "")
                    options.Discounts = discount;

                

                var service = new SessionService();
                Session session = service.Create(options);

                stripeRequestDTO.StripeSessionUrl = session.Url;
                // retriving orderHeader which is created and pass to the stripe and update sessionId there.
                OrderHeader orderHeader = _db.OrderHeaders.First(header => header.OrderHeaderId == stripeRequestDTO.OrderHeader.OrderHeaderId);
                orderHeader.StripeSessionId = session.Id;
                await _db.SaveChangesAsync();
                _response.Result = stripeRequestDTO;
            }
            catch (Exception ex)
            {
                _response.Message=ex.Message;
                _response.IsSuccess = false;
            }
            return _response;
        }




        /// <summary>
        /// Validate Payment of the  Stripe Session
        /// Returns OrderHeaderDTO with PaymentIntent information
        /// </summary>
        /// <param name="OrderHeaderId">OrderHeader ID</param>
        /// <returns>OrderHeaderDTO</returns>
        [HttpPost("ValidateStripeSession")]
        [Authorize]
        public async Task<ResponseDTO> ValidateStripeSession([FromBody] int OrderHeaderId)
        {
            try
            {
                OrderHeader foundOrderHeader =  _db.OrderHeaders.First(orderHeader => orderHeader.OrderHeaderId == OrderHeaderId);
                if(foundOrderHeader.PaymentIntentId == null)
                {
                    var session = new SessionService();
                    Session foundSession = session.Get(foundOrderHeader.StripeSessionId);
                    PaymentIntentService paymentIntentService = new PaymentIntentService();
                    PaymentIntent paymentIntent = paymentIntentService.Get(foundSession.PaymentIntentId);
                    if (paymentIntent.Status == "succeeded")
                    {
                        // payment successful so store payment id and status of the order
                        foundOrderHeader.PaymentIntentId = paymentIntent.Id;
                        foundOrderHeader.Status = SD.Status_Approved;
                        await _db.SaveChangesAsync();

                        RewardsDTO rewardsDTO = new RewardsDTO()
                        {
                            orderId = foundOrderHeader.OrderHeaderId,
                            RewardsActivity = Convert.ToInt32(foundOrderHeader.OrderTotal),
                            UserId = foundOrderHeader.UserId
                        };

                        // TO-DO send message to Azure Topic with rewardsDTO
                        string topicName = _config.GetValue<string>("TopicAndQueueNames:OrderCreatedTopic")!;
                        await _messageBus.PublishMessage(topicName, rewardsDTO);
                    }
                
                }
                    _response.Result = _mapper.Map<OrderHeaderDTO>(foundOrderHeader);

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
