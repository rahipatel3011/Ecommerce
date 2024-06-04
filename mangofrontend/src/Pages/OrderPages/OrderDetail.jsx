import { useQuery } from "@tanstack/react-query";
import { Form, Link, useParams } from "react-router-dom";
import { GetOrderById } from "../../Utils/OrderHttp";
import LoadingIndicator from "../../Components/UI/LoadingIndicator";
import ErrorBlock from "../../Components/UI/ErrorBlock";
import { dateFormat } from "../../Utils/formatter";
import OrderInput from "../../Components/UI/OrderPageComponents/OrderInput.jsx";
import { decodedToken } from "../../Utils/helper.js";
import OrderProductDetailCard from "../../Components/UI/OrderPageComponents/OrderProductDetailCard.jsx";
import { useContext } from "react";
import { TokenContext } from "../../Store/TokenContextProvider.jsx";

export default function OrderDetail() {
  const {token} = useContext(TokenContext);
  const params = useParams();
  const orderId = params.orderId;
  const user = decodedToken(token);
  const {
    data: order,
    isPending,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["Order", orderId],
    queryFn: ({ signal }) => GetOrderById({ signal, orderId, token }),
  });
  if (isPending || isLoading) {
    return <LoadingIndicator />;
  }
  if (isError) {
    return (
      <ErrorBlock
        title="Order Fetch Error"
        message={
          error?.message || "Could not fetch order please try again later"
        }
      />
    );
  }


  return (
    <div>
      <br />
      <div className="container">
        <div className="card">
          <div className="card-header bg-dark text-light ml-0">
            <div className="container row">
              <div className="col-12 d-none d-md-block col-md-6 pb-1 text-warning h3">
                Order Summary
              </div>
              <div className="col-12 col-md-4 offset-md-2 text-right mt-2">
                <Link className="btn btn-warning form-control btn-sm" to="..">
                  Back to Orders
                </Link>
              </div>
            </div>
          </div>
          <div className="card-body bg-secondary text-light">
            <div className="container rounded p-2">
              <div className="row">
                <div className="col-12 col-lg-6 pb-4">
                  <OrderInput label="Name" value={order.name} />
                  <OrderInput label="Phone" value={order.phone} />
                  <OrderInput label="Email" value={order.email} />
                  <OrderInput
                    label="Order Date"
                    value={dateFormat(order.orderTime)}
                  />
                  {user.role.toLowerCase() === "admin" && (
                    <>
                      <OrderInput
                        label="PaymentIntent ID"
                        value={order.paymentIntentId}
                      />
                      <OrderInput
                        label="Session ID"
                        value={order.stripeSessionId}
                      />
                    </>
                  )}
                  <OrderInput label="Status" value={order.status} />
                </div>

                <OrderProductDetailCard user={user} order={order} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
