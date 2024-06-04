import { useMutation } from "@tanstack/react-query";
import { Form, useNavigate } from "react-router-dom";
import { queryClient, createCoupon } from "../Utils/CouponHttp";
import Toaster from "./UI/Toaster";
import ErrorBlock from "./UI/ErrorBlock";
import { useContext } from "react";
import { TokenContext } from "../Store/TokenContextProvider";

export default function CouponForm() {
  const navigate = useNavigate();
  
  const { token } = useContext(TokenContext);
  const { mutate, isPending, isError, error } = useMutation({
    mutationKey: ["coupon"],
    mutationFn: createCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["coupon"],
        refetchType: "none",
      });
      navigate("/coupons");
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    mutate({ coupon: data, token });
  };


  return (
    <Form className="coupon-form col-6 mx-auto mt-5" onSubmit={handleSubmit} method="post">
      {isError && <ErrorBlock title="Coupon Error" message={error?.message || "coupon is not created please try again later"} />}
      <input
        type="text"
        className="form-control my-3"
        placeholder="Coupon Code"
        aria-label="Coupon Code"
        name="couponCode"
      />

      <input
        type="text"
        className="form-control my-3"
        placeholder="Discount amount"
        aria-label="Discount amount"
        name="discountAmount"
      />

      <input
        type="text"
        className="form-control my-3"
        placeholder="Minimum Order amount"
        aria-label="Minimum Order amount"
        name="minAmount"
      />
      <div className="text-center">
        <button
          type="submit"
          className="btn btn-primary px-5"
          disabled={isPending}
        >
          Create
        </button>
      </div>
    </Form>
  );
}
