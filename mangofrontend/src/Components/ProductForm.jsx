import { useMutation } from "@tanstack/react-query";
import { Form, redirect, useNavigate } from "react-router-dom";

export default function ProductForm({ product, onSubmit }) {
  const navigate = useNavigate();

  function cancelButtonHandler() {
    navigate("/products");
  }

  return (
    <form
      className="col-6 mx-auto mt-5 text-center"
      onSubmit={(event) => onSubmit(event)}
      method="post"
      encType="multipart/form-data"
    >
      {product && (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-detail-image"
        />
      )}
      <input
        type="text"
        className="form-control m-3"
        placeholder="Product Name"
        aria-label="Product Name"
        name="name"
        defaultValue={product && product.name}
      />

      <input
        type="text"
        className="form-control m-3"
        placeholder="Category"
        aria-label="Category"
        name="categoryName"
        defaultValue={product && product.categoryName}
      />

      <textarea
        className="form-control m-3"
        placeholder="Product Description"
        aria-label="Product Description"
        name="description"
        defaultValue={product && product.description}
      />

      <input
        type="text"
        className="form-control m-3"
        placeholder="Product Price"
        aria-label="Product Price"
        name="price"
        defaultValue={product && product.price}
      />

      <input
        type="text"
        className="form-control m-3"
        placeholder="Product Image"
        aria-label="Product Image"
        name="imageUrl"
        defaultValue={product && product.imageUrl}
        hidden
      />
      
        <input
          type="file"
          className="form-control m-3"
          aria-label="Product Price"
          name="image"
        />
      

      <button type="submit" className="btn btn-primary px-5 mx-1">
        {product ? "Update" : "Create"}
      </button>
      <button
        type="button"
        className="btn btn-primary px-5 mx-1"
        onClick={cancelButtonHandler}
      >
        Cancel
      </button>
    </form>
  );
}
