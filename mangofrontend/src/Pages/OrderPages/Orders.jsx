import { useContext, useEffect, useState } from "react";
import { GetAllOrder } from "../../Utils/OrderHttp";
import { Link } from "react-router-dom";
import { TokenContext } from "../../Store/TokenContextProvider";

export default function Orders() {
  const {token} = useContext(TokenContext);
  const [active, setActive] = useState();
  useEffect(() => {
    let table;

    async function fetchData() {
      let orders = await GetAllOrder({token});
      if (active !== undefined && active !== "all") {
        orders = orders.filter((order) => order.status === active);
      }

      // Create new DataTable instance
      table = $("#tblData").DataTable({
        data: orders,
        columns: [
          { data: "orderHeaderId" },
          { data: "email" },
          { data: "name" },
          { data: "phone" },
          { data: "status" },
          { data: "orderTotal" },
          {
            data: "orderHeaderId",
            render: function (data) {
              return (
                '<div class="btn-group" role="group"><a class="btn btn-warning mx-1" href="/order/' +
                data +
                '"><span>Details</span></a></div>'
              );
            },
            width: "10%",
          },
        ],
        responsive: true, // Enable responsive mode
        paging: true, // Enable pagination
        searching: true, // Enable searching
      });
    }

    fetchData();

    // Cleanup function
    return () => {
      // Destroy DataTable instance when component unmounts
      if (table) {
        table.destroy();
      }
    };
  }, [active]);
  return (
    <div className="container">
      <div className="card shawdow border-0 mt-4">
        <div className="card-header bg-secondary bg-gradient ml-0 py-3 d-flex justify-content-between">
          <div className="row">
            <h1 className="text-white">Order List</h1>
          </div>
          <div className="btn-group py-2">
            <Link
              to={`/order?status=approved`}
              className={`btn btn-dark ${
                active === "approved" ? "active" : ""
              }`}
              aria-current="page"
              onClick={() => setActive("approved")}
            >
              Approved
            </Link>
            <Link
              to={`/order?status=readyforpickup`}
              className={`btn btn-dark ${
                active === "readyforpickup" ? "active" : ""
              }`}
              onClick={() => setActive("readyforpickup")}
            >
              Ready For Pickup
            </Link>
            <Link
              to={`/order?status=cancelled`}
              className={`btn btn-dark ${
                active === "cancelled" ? "active" : ""
              }`}
              onClick={() => setActive("cancelled")}
            >
              Cancelled
            </Link>
            <Link
              to={`/order?status=all`}
              className={`btn btn-dark ${active === "all" ? "active" : ""}`}
              onClick={() => setActive("all")}
            >
              All
            </Link>
          </div>
        </div>
        <div className="card-body bg-dark p-4">
          <table
            className="table table-bordered table-striped table-dark pt-3"
            id="tblData"
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </div>
  );
}
