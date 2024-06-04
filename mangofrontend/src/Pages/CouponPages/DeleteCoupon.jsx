import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { deleteCoupon, queryClient } from "../../Utils/CouponHttp.js";
import Modal from "../../Components/UI/Modal.jsx";
import { TokenContext } from "../../Store/TokenContextProvider.jsx";
import { useContext } from "react";

export default function DeleteCoupon({ onClose, couponId }) {
  //const navigate = useNavigate();
  
  const { token } = useContext(TokenContext);
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: deleteCoupon,
    mutationKey: ["coupon"],
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["coupon"],
      });
      onClose();
    },
  });

  function handleDelete() {
    mutate({ id: couponId, token });
  }

  return (
    <>
      <Modal onClose={onClose}>
        <h2>Are you sure?</h2>
        <p>
          Do you really want to delete this coupon? This action can't be
          reverse.
        </p>
        <div className="form-actions">
          <button onClick={onClose} className="btn btn-danger" disabled={isPending}>
            Cancel
          </button>
          <button onClick={handleDelete} className="btn btn-danger" disabled={isPending}>
            Delete
          </button>
        </div>
      </Modal>
    </>
  );
}
