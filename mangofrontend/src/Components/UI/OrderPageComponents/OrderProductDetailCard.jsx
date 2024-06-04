import { useMutation } from "@tanstack/react-query";
import OrderProductDetail from "./OrderProductDetail";
import { UpdateOrder } from "../../../Utils/OrderHttp";
import { queryClient } from "../../../Utils/CouponHttp";
import { titleCase } from "../../../Utils/formatter";
import { useContext } from "react";
import { TokenContext } from "../../../Store/TokenContextProvider";

export default function OrderProductDetailCard({ user, order }) {
  const {token} = useContext(TokenContext);
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: UpdateOrder,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["Order", order.orderHeaderId],
      });
      window.location.reload();
    },
  });

  function onOrderActionHandler(action) {
    let newStatus;
    if (action === "readyForPickUp") {
      newStatus = "ready for pickup";
    }
    if (action === "complete") {
      newStatus = "completed";
    }
    if (action === "cancel") {
      newStatus = "cancelled";
    }
    mutate({ orderId: order.orderHeaderId, newStatus, token });
  }


  return (
    <div className="col-12 col-lg-5 offset-lg-1">
      <h4 className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-warning">Order Summary</span>
      </h4>
      <label className="bg-info text-dark text-center form-control my-2">
        Order Status -  {titleCase(order?.status)}
      </label>

      <ul className="list-group mb-3">
        {order.orderDetails.map((product) => (
          <OrderProductDetail key={product.productId} product={product} />
        ))}

        <li className="list-group-item bg-primary">
          <div className="row container">
            <div className="col-6">
              <h5 className="text-white">TOTAL </h5>
            </div>
            <div className="col-6 text-end">
              <h5 className="text-white">{order.orderTotal}</h5>
            </div>
          </div>
        </li>
      </ul>
      {isError && (
        <p className="text-center text-warning">
          {error?.message || "Could not perform action"}
        </p>
      )}
      {user.role.toLowerCase() === "admin" && (
        <>
          {order.status === "approved" && (
            <button
              type="button"
              className="btn btn-success form-control my-1"
              onClick={() => onOrderActionHandler("readyForPickUp")}
              disabled={isPending}
            >
              Ready for Pickup
            </button>
          )}
          {order.status === "ready for pickup" && (
            <button
              type="button"
              className="btn btn-success form-control my-1"
              onClick={() => onOrderActionHandler("complete")}
              disabled={isPending}
            >
              Complete
            </button>
          )}
          {(order.status === "ready for pickup" || order.status === "approved" || order.status.toLowerCase() === "completed") &&
          <button
            type="button"
            className="btn btn-danger form-control my-1"
            onClick={() => onOrderActionHandler("cancel")}
            disabled={isPending}
          >
            Cancel Order
          </button>}
        </>
      )}
    </div>
  );
}
