import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {queryClient } from "../../Utils/CouponHttp.js";
import Modal from "../../Components/UI/Modal.jsx";
import { deleteProduct } from "../../Utils/ProductHttp.js";
import { useContext } from "react";
import { TokenContext } from "../../Store/TokenContextProvider.jsx";

export default function DeleteProduct({ onClose, productId }) {
  const {token} = useContext(TokenContext);
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });

  function handleDelete() {
    mutate({ id: productId, token });
    onClose();
  }

  return (
    <>
      <Modal onClose={onClose}>
        <h2>Are you sure?</h2>
        <p>
          Do you really want to delete this Product? This action can't be
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
