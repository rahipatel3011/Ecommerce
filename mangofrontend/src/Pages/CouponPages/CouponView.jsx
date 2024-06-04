import { useQuery } from "@tanstack/react-query";
import { PlusSquare } from "react-bootstrap-icons";
import { Trash } from "react-bootstrap-icons";
import { getCoupon } from "../../Utils/CouponHttp.js";
import ErrorBlock from "../../Components/UI/ErrorBlock.jsx";
import LoadingIndicator from "../../Components/UI/LoadingIndicator.jsx";
import { useContext, useState } from "react";
import DeleteCoupon from "./DeleteCoupon.jsx";
import { Link } from "react-router-dom";
import { TokenContext } from "../../Store/TokenContextProvider.jsx";
import { decodedToken } from "../../Utils/helper.js";

let couponID;

export default function CouponView() {
  const { token } = useContext(TokenContext);
  const user = decodedToken(token);
  const [isDelete, setIsDelete] = useState(false);
  const {
    data: coupons,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["coupon"],
    queryFn: ({ signal }) => getCoupon({ signal, token }),
  });

  function handleStartDelete(id) {
    couponID = id;
    setIsDelete(true);
  }
  function handleCancelDelete() {
    couponID = undefined;
    setIsDelete(false);
  }

  let content;
  if (isPending) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = <ErrorBlock title={error.message || "Could not fetch data"} />;
  }

  if (coupons) {
    content = (
      <table className="table table-dark table-striped coupon-table">
        <thead>
          <tr>
            <th>Coupon Code</th>
            <th>Discount Amount</th>
            <th>Minimum Amount</th>
            {user.role.toLowerCase() === "admin" && <th></th>}
          </tr>
        </thead>
        <tbody>
          {coupons.map((coupon) => (
            <tr key={coupon.couponId}>
              <td>{coupon.couponCode}</td>
              <td>{coupon.discountAmount}</td>
              <td>{coupon.minAmount}</td>
              {user.role.toLowerCase() === "admin" && (
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleStartDelete(coupon.couponId)}
                  >
                    <Trash />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <>
      {isDelete && (
        <DeleteCoupon onClose={handleCancelDelete} couponId={couponID} />
      )}
      <div className="card border-0 m-4 text-light coupon-background">
        <div className="card-header bg-secondary bg-gradient ml-0 py-3">
          <div className="row">
            <div className="col-12 text-center">
              <h1 className="text-white">Coupons List</h1>
            </div>
          </div>
        </div>
        <div className="card-body p-4">
          <div className="row pb-3">
            <div className="col-6"></div>
            <div className="col-6 text-end">
              {user.role.toLowerCase() === "admin" && (
                <Link className="btn btn-primary" to="create">
                  <PlusSquare className="me-2" />
                  Create New Coupon
                </Link>
              )}
            </div>
          </div>
          {content}
        </div>
      </div>
    </>
  );
}
