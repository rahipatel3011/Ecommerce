import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../Utils/ProductHttp";
import LoadingIndicator from "../Components/UI/LoadingIndicator";
import ErrorBlock from "../Components/UI/ErrorBlock";
import { Link } from "react-router-dom";
import { getAuthToken } from "../Utils/helper";
import { useContext } from "react";
import { TokenContext } from "../Store/TokenContextProvider";

export default function HomePage() {
  
  const {
    data: products,
    isPending: productsIsPending,
    isError: productsIsError,
    error: productsError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });
  if (productsIsPending) {
    return <LoadingIndicator />;
  }
  if (productsIsError) {
    return (
      <ErrorBlock
        title={productsError.message || "Could not fetch products from jsx"}
      />
    );
  }

  return (
    <div className="container text-center">
      <div className="row">
        {products.map((product, index) => (
          <div className="col-md-3 my-4" key={index}>
            <div className="card bg-dark text-secondary border-white">
              <h4 className="card-title  m-0 py-2">{product.name}</h4>
              <img
                src={product.imageUrl}
                className="card-img-top homepage-product-image"
                alt={product.name}
              />
              <div className="card-body">
                <div className="d-flex justify-content-between py-2">
                  <span className="text-danger" style={{ fontSize: "20px" }}>
                    ${product.price}
                  </span>
                  <span className="badge bg-warning text-white p-2">
                    {product.categoryName}
                  </span>
                </div>
                <p
                  className="card-text"
                  style={{
                    maxHeight: "200px",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  {product.description}
                </p>
                <div className="row">
                  <div className="col">
                    <Link
                      className="btn btn-success form-control"
                      to={`/products/${product.productId}`}
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
