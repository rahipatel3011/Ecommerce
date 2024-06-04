import { useLocation } from "react-router-dom";
import OrderImage from "../../assets/order.png";
import { useQuery } from "@tanstack/react-query";
import { validateStripeSession } from "../../Utils/OrderHttp";
import ErrorBlock from "../../Components/UI/ErrorBlock";
import { useContext } from "react";
import { TokenContext } from "../../Store/TokenContextProvider";

export default function OrderConfirmationPage() {
  const {token} = useContext(TokenContext);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const orderId = parseInt(params.get("orderId"));

  const { data, isPending, isError, error } = useQuery({
    queryFn: ({signal})=>validateStripeSession({signal,OrderHeaderId: orderId, token}),
    queryKey: ["Stripe"],
    retry: false,
    refetchOnWindowFocus: false
  });
  let content;

  if (isPending) {
    return (content = <h3 className="text-center">Verifying Payment...</h3>);
  }

  if (data) {
    content = (
      <>
        <h1 className="text-info pt-4">
          Congratulations! you are one step closer to amazing food
        </h1>
        <p className="pb-3">
          We have receiveed your order and will be ready in 30 minutes during
          regular business hours!
        </p>
        <h4 className="text-warning pb-3">Order id- {orderId}</h4>
        <img
          src={OrderImage}
          alt="orderImage"
          className="product-detail-image image-rounded"
        />
      </>
    );
  }

  if (isError) {
    return (
      <ErrorBlock
        title="Payment Error"
        message={
          error?.message || "Cannot verify Payment please try again later"
        }
      />
    );
  }

  return <div className="container text-center">{content}</div>;
}
