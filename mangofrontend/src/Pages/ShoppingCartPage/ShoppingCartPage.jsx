import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useContext, useRef } from "react";
import {mutateCoupon, getCartByUserId } from "../../Utils/CartHttp";
import LoadingIndicator from "../../Components/UI/LoadingIndicator";
import ErrorBlock from "../../Components/UI/ErrorBlock";
import { queryClient } from "../../Utils/CouponHttp.js";
import { currencyFormat } from "../../Utils/formatter";
import CartItem from "../../Components/CartItem.jsx";
import { decodedToken } from "../../Utils/helper.js";
import EmailCartButton from "../../Components/UI/EmailCartButton.jsx";
import { Link } from "react-router-dom";
import { TokenContext } from "../../Store/TokenContextProvider.jsx";

export default function ShoppingCartPage(){
  const{token} = useContext(TokenContext);
  const user = decodedToken(token);
  const couponRef = useRef();
  const {
    data: cart,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: ({signal})=>getCartByUserId({signal,userId: user?.unique_name, token}),
  });

  const {
    mutate,
    isPending: couponIsPending,
    isError: couponIsError,
    error: couponError,
  } = useMutation({
    mutationFn: mutateCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  if (isPending) {
    return <LoadingIndicator />;
  }

  if (isError) {
    return (
      <ErrorBlock
        title="Failed to load cart"
        message={error.message || "Failed to Load cart please try again later"}
      />
    );
  }

  if(cart.userId == null && cart.items == null){
    return <p>Please Add Items to the cart</p>
  }

  function applyCouponHandler({total}) {
    if(couponRef.current.disabled){
      couponRef.current.value="";
    }
      let couponCode = couponRef.current.value;
    
    mutate({ couponCode,total, userId: user.unique_name, token });
  }

  return (
    <div className="container">
      <h2>Cart</h2>
      <div className="row">
        <div className="col-md-9">
          <div className="row">
            <div className="col-6">
              <h5>Product Details</h5>
            </div>
            <div className="col-2">
              <h5>Quantity</h5>
            </div>
            <div className="col-2">
              <h5>Price</h5>
            </div>
            <div className="col-2">
              <h5>Total</h5>
            </div>
          </div>
          <hr></hr>
          {cart.items.map((item) => <CartItem key={item.productId} item={item} />)}
          <EmailCartButton cart={cart}/>
        </div>
        <div className="col-md-3">
          <div className="card bg-dark">
            <div className="card-body">
              <h5 className="card-title">Coupon Code</h5>
              <div className="input-group">
                <input
                  ref={couponRef}
                  type="text"
                  className="form-control"
                  placeholder="Enter coupon code"
                  defaultValue={cart.coupon}
                  disabled={cart.coupon}
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={()=>applyCouponHandler({total: cart.total})}
                    disabled={couponIsPending}
                  >
                    {cart.coupon ? "Remove" : "Apply"}
                  </button>
                </div>
              </div>
              {couponIsError && <p className="text-danger my-0">{couponError?.message || 'Can not apply coupon code'}</p>}
              <p className="mt-3">Total: {currencyFormat(cart.total + cart.discount)}</p>
              {cart.discount > 0 && <p className="text-success">Discount: {currencyFormat(cart.discount)}</p>}
              <p>Final Total: {currencyFormat(cart.total)}</p>
              <Link className="btn btn-success btn-block" to="checkout">
                Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

