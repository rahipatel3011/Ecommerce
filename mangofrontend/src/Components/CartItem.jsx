import { useMutation } from "@tanstack/react-query";
import { removeFromCart } from "../Utils/CartHttp";
import { decodedToken } from "../Utils/helper";
import { queryClient } from "../Utils/CouponHttp";





export default function CartItem({item}){
    const user = decodedToken();

    const{mutate, isPending, isError, error} = useMutation({
        mutationFn: removeFromCart,
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey: ["cart"]})
        }
    });



    function removeButtonHandler(){
        mutate({cartItemId: item.id})
    }

    return <div className="row mt-2">
    <div className="col-6">
      <div className="row">
        <div className="col-4">
          <img
            src={item.product.imageUrl}
            className="img-thumbnail"
            alt={item.product.name}
          />
        </div>
        <div className="col-4">
          <p>{item.product.name}</p>
          <p>{item.product.categoryName}</p>
          <button className="btn btn-link px-0" onClick={removeButtonHandler} disabled={isPending}>Remove</button>
          {isError && <p className="text-danger">{error.message}</p>}
        </div>
      </div>
    </div>
    <div className="col-2">
      <span>{item.quantity}</span>
    </div>
    <div className="col-2">
      <span>${item.product.price}</span>
    </div>
    <div className="col-2">
      <span>${item.product.price * item.quantity}</span>
    </div>
  </div>
}