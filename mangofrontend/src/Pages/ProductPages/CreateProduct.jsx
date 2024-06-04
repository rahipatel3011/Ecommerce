  import { useMutation } from "@tanstack/react-query";
  import {useNavigate } from "react-router-dom";
  import { manipulateProduct } from "../../Utils/ProductHttp";
  import LoadingIndicator from "../../Components/UI/LoadingIndicator";
  import ErrorBlock from "../../Components/UI/ErrorBlock";
  import ProductForm from "../../Components/ProductForm";
  import { queryClient } from "../../Utils/CouponHttp";
  import { useContext } from "react";
  import { TokenContext } from "../../Store/TokenContextProvider";

  export default function CreateProduct() {
    const navigate = useNavigate();
    const {token} = useContext(TokenContext);
    const {mutate, isPending, isError, error} = useMutation({
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
      mutate({formData: form, token});
    }


    if (isPending) {
      return <LoadingIndicator />;
    }

    if (isError) {
      return <ErrorBlock title="Unable to fetch product" message={error?.message} />;
    }
      
    return <ProductForm onSubmit={handleOnSubmit}/>;
  }
