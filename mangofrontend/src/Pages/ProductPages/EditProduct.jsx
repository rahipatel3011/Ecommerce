import { useMutation, useQuery } from "@tanstack/react-query";
import { Form, useNavigate, useParams } from "react-router-dom";
import { getProductById, manipulateProduct } from "../../Utils/ProductHttp";
import LoadingIndicator from "../../Components/UI/LoadingIndicator";
import ErrorBlock from "../../Components/UI/ErrorBlock";
import ProductForm from "../../Components/ProductForm";
import { queryClient } from "../../Utils/CouponHttp";
import { useContext } from "react";
import { TokenContext } from "../../Store/TokenContextProvider";

export default function EditProduct() {
  const {token} = useContext(TokenContext);
  const params = useParams();
  const navigate = useNavigate();
  const id = params.id;
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["products", id],
    queryFn: () => getProductById({ id }),
  });


  const {mutate, isPending: updateIsPending, isError: updateIsError, error: updateError} = useMutation({
    mutationFn: manipulateProduct,
    onSuccess: ()=>{
        queryClient.invalidateQueries({"queryKey": ["products"]})
        navigate("..");
    }
  });

  function handleOnSubmit(event){
    event.preventDefault();
    const formElement = event.target;
    const form = new FormData(formElement);
    mutate({id, formData:form, token});
  }

  let content;

  if (isPending) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = <ErrorBlock title="Unable to fetch product" message={error.message} />;
  }

  if(data){
    content = <ProductForm product={data} onSubmit={handleOnSubmit}/>
  }

  return <>{content}</>;
}
