import { redirect, useNavigate } from "react-router-dom";
import { queryClient } from "../../Utils/CouponHttp";
import { useContext, useEffect } from "react";
import { TokenContext } from "../../Store/TokenContextProvider";


export default function LogoutPage(){
    const { removeToken} = useContext(TokenContext);
    const navigate = useNavigate();
    useEffect(()=>{
        removeToken();
        localStorage.removeItem("jwt");
        queryClient.clear();
        navigate("/")
    },[]);
    
    return null;
}

export function action(){
    return redirect("/");
}