import { useMutation } from "@tanstack/react-query";
import { EmailCart } from "../../Utils/CartHttp";
import { useContext, useState } from "react";
import { decodedToken } from "../../Utils/helper";
import { TokenContext } from "../../Store/TokenContextProvider";

export default function EmailCartButton({ cart }) {
  const { token } = useContext(TokenContext);
  const user = decodedToken(token);
  const [message, setMessage] = useState(undefined);
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: EmailCart,
    onSuccess: () => {
      setMessage("Cart Sent");
    },
  });
  function emailCartHandler() {
    // adding extra detail to cart
    cart.email = user.email;
    cart.firstName = user.name;
    mutate({ cart, token });
  }

  return (
    <div className="text-center">
      <button
        className="btn btn-warning"
        disabled={isPending}
        onClick={emailCartHandler}
      >
        {isPending ? "Emailing" : "Email Cart"}
      </button>
      {message && <p className="text-success">{message}</p>}
      {isError && <p className="text-danger">{error?.message}</p>}
    </div>
  );
}
