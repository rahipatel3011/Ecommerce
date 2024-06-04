import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../../Utils/ProductHttp";
import LoadingIndicator from "../../Components/UI/LoadingIndicator";
import ErrorBlock from "../../Components/UI/ErrorBlock";
import { PlusSquare, Trash, PencilSquare } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import DeleteProduct from "./DeleteProduct";
import { TokenContext } from "../../Store/TokenContextProvider";
import { decodedToken } from "../../Utils/helper";

let productId;

export default function Products() {
  const { token } = useContext(TokenContext);
  const user = decodedToken(token);
  const [isDelete, setIsDelete] = useState(false);
  const navigate = useNavigate();
  const {
    data: products,
    isPending: productsIsPending,
    isError: productsIsError,
    error: productsError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: ({ signal }) => getAllProducts({ signal, token }),
  });

  // event handling function
  const handleEditButton = (id) => {
    navigate("edit/" + id);
  };

  function handleStartDelete(id) {
    productId = id;
    setIsDelete(true);
  }

  function handleCancelDelete() {
    productId = undefined;
    setIsDelete(false);
  }

  // content management
  let content;
  if (productsIsPending) {
    content = <LoadingIndicator />;
  }

  if (productsIsError) {
    content = (
      <ErrorBlock
        title={productsError.message || "Could not fetch products from jsx"}
      />
    );
  }

  if (products) {
    content = (
      <table className="table table-dark table-striped coupon-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>

            {user.role.toLowerCase() === "admin" && <th></th>}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.productId}>
              <td>{product.name}</td>
              <td>{product.categoryName}</td>
              <td>{product.price}</td>

              {user.role.toLowerCase() === "admin" && (
                <td>
                  <button
                    className="btn btn-warning mx-1"
                    onClick={() => handleEditButton(product.productId)}
                  >
                    <PencilSquare />
                  </button>
                  <button
                    className="btn btn-danger mx-1"
                    onClick={() => handleStartDelete(product.productId)}
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
        <DeleteProduct onClose={handleCancelDelete} productId={productId} />
      )}
      <div className="card border-0 m-4 text-light coupon-background">
        <div className="card-header bg-secondary bg-gradient ml-0 py-3">
          <div className="row">
            <div className="col-12 text-center">
              <h1 className="text-white">Product List</h1>
            </div>
          </div>
        </div>
        <div className="card-body p-4">
          {user.role.toLowerCase() === "admin" && (
            <div className="row pb-3">
              <div className="col-6"></div>
              <div className="col-6 text-end">
                <Link className="btn btn-primary" to="/products/create">
                  <PlusSquare className="me-2" />
                  Create New product
                </Link>
              </div>
            </div>
          )}
          {content}
        </div>
      </div>
    </>
  );
}
