﻿namespace Mango.Services.ShoppingCartApi.Models.DTOs
{
    public class CouponDTO
    {
        public int CouponId {  get; set; }
        public string CouponCode { get; set; }
        public double DiscountAmount { get; set; }
        public int MinAmount { get; set; }

    }
}
