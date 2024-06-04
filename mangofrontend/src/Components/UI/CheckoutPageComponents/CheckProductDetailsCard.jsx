import { useMutation } from "@tanstack/react-query";
import React, { useContext } from "react";
import { createOrder } from "../../../Utils/OrderHttp";
import { Form } from "react-router-dom";
import ErrorBlock from "../ErrorBlock";
import { TokenContext } from "../../../Store/TokenContextProvider";

export default function CheckoutProductDetailsCard({ cart }) {
  const {token} = useContext(TokenContext);
    const {mutate, isPending, isError, error} = useMutation({
        mutationFn: createOrder,
        onSuccess: (sessionUrl)=>{
          window.location.href = sessionUrl;
        }
    });

    function orderSubmitHandler(event){
        event.preventDefault();
        const formElement = new FormData(event.target);
        const form = Object.fromEntries(formElement);
        const cartDTO = {
            ...cart,
            ...form,
        }
        mutate({cart: cartDTO, token});
    }

    if(isError){
      <ErrorBlock title="Error in Order" message={error?.message || "Error while creating order please try again later"} />
    }

  return (
    <Form className="row mt-4" method="post" onSubmit={orderSubmitHandler}>
      <div className="col-md-7">
        <h2>Customer Information</h2>
        <div>
          <div className="row g-3">
            <div className="col-md-12">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                className="form-control"
                name="name"
                required
              />
            </div>
            <div className="col-md-12">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                required
              />
            </div>
            <div className="col-md-12">
              <label htmlFor="phoneNumber" className="form-label">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phone"
                className="form-control"
                required
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-5">
        <h2>Order Details</h2>
        <table className="table text-light">
          <thead>
            <tr className="text-danger">
              <th>Product</th>
              <th>Price</th>
              <th>Count</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {cart.items.map((cartItem) => (
              <tr key={cartItem.id}>
                <td>{cartItem.product.name}</td>
                <td>${cartItem.product.price.toFixed(2)}</td>
                <td>{cartItem.quantity}</td>
                <td>
                  ${(cartItem.product.price * cartItem.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="order-summary text-center">
          <p>Order Total: ${(cart.total + cart.discount).toFixed(2)}</p>
          <p className="text-success">
            Order Discount: ${cart.discount.toFixed(2)}
          </p>
          <p className="text-danger">Final Total: ${cart.total.toFixed(2)}</p>
          <button className="btn btn-success" disabled={isPending}>Place Order</button>
        </div>
      </div>
    </Form>
  );
}
