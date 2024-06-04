import { useQuery } from "@tanstack/react-query";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { getCartByUserId } from "../../Utils/CartHttp";
import LoadingIndicator from "../../Components/UI/LoadingIndicator";
import ErrorBlock from "../../Components/UI/ErrorBlock";
import { decodedToken } from "../../Utils/helper";
import CheckoutProductDetailsCard from "../../Components/UI/CheckoutPageComponents/CheckProductDetailsCard";
import { TokenContext } from "../../Store/TokenContextProvider";

const CheckoutPage = () => {
  const{token} = useContext(TokenContext);
  const user = decodedToken(token);
  const {
    data: cart,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: ({ signal }) =>
      getCartByUserId({ signal, userId: user?.unique_name, token }),
  });

  if (isPending) {
    return <LoadingIndicator />;
  }

  if (isError) {
    return (
      <ErrorBlock title="Error loading checkout" message={error?.message} />
    );
  }

  return (
    <div className="container mt-5" method="post">
      <div className="card p-4 bg-dark">
        <header className="d-flex justify-content-between align-items-center">
          <h1 className="text-warning">Order Summary</h1>
          <Link to="/cart" className="btn btn-dark border text-warning">
            Back to Cart
          </Link>
        </header>

        <CheckoutProductDetailsCard cart={cart} />
      </div>
    </div>
  );
};

export default CheckoutPage;
