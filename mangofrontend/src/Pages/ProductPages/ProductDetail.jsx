import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams, useRouteLoaderData } from "react-router-dom";
import { getProductById } from "../../Utils/ProductHttp.js";
import LoadingIndicator from "../../Components/UI/LoadingIndicator";
import ErrorBlock from "../../Components/UI/ErrorBlock";
import { addToCart } from "../../Utils/CartHttp.js";
import { useContext } from "react";
import { TokenContext } from "../../Store/TokenContextProvider.jsx";
import { decodedToken } from "../../Utils/helper.js";

export default function ProductDetail() {
  const {token} = useContext(TokenContext);
  const user = decodedToken(token);
  const params = useParams();
  const navigate = useNavigate();
  const id = params.id;
  const { data : product, isPending, isError, error } = useQuery({
    queryKey: ["products", id],
    queryFn: () => getProductById({ id, token }),
  });

  const {mutate, isPending:cartIsPending, isError:cartIsError, error:cartError} = useMutation({
    mutationFn: addToCart,
    onSuccess: ()=>{
      navigate("/");
    }
  });


  function handleAddtoCart(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    const cart = {
      userId: user.unique_name,
      coupon: "",
      items: [data]
    };
    //console.log(cart);
    mutate({cart, token});
  }
  

  
  if(isPending){
    return <LoadingIndicator />
  }

  if(isError){
    return <ErrorBlock title="Error" message={error.message} />
  }


  const { productId, imageUrl, name, categoryName, description, price } = product;
  return (
    <form className="product-detail container mt-3" onSubmit={handleAddtoCart} method="post">
      <input defaultValue={productId} name="productId" hidden />
      <div className="row">
        <div className="col-md-6">
          <img src={imageUrl} alt={name} className="product-detail-image img-fluid"/>
        </div>
        <div className="col-md-6">
          <h2>{name}</h2>
          <p>
            <strong>Category:</strong> {categoryName}
          </p>
          <p>{description}</p>
          <p>
            <strong>Price:</strong> ${price}
          </p>
          <input name="quantity" type="text" defaultValue="1"/>
          <button className="btn btn-primary" type="submit" disabled={cartIsPending}>Add to Cart</button>
          {cartIsError && <ErrorBlock title={"Fail to Add"} message={cartError?.message}/>}
        </div>
      </div>
      
    </form>
  );
}
