import { QueryClient } from "@tanstack/react-query";
import { getAuthToken } from "./helper";

export const queryClient = new QueryClient();

//const baseURL = "https://localhost:7777/api/coupon";
//const baseURL = "https://localhost:7001/api/coupon";
const baseURL = "https://mangoservicescouponapihost.azurewebsites.net/api/coupon";

export async function getCoupon({ couponSignature, signal, token }) {
  let url = baseURL;
  
  if (couponSignature) {
    url += couponSignature;
  }

  const response = await fetch(url, { signal: signal, headers:{"Authorization" : `bearer ${token}`} });
  
  if (response.status === 401) {
    throw new Error("Unauthorised Access");
  }

  if (response.status === 403) {
    throw new Error("Access Denied");
  }

  if (!response.ok) {
    throw new Error("Failed to fetch coupons");
  }


  const data = await response.json();
  if(!data.isSuccess){
    return data;
  }
  return data.result;
}

export async function createCoupon({ coupon, token }) {
  
  try {
    const url = baseURL;

    const response = await fetch(url, {
      method: "post",
      headers: { "content-type": "application/json", "Authorization" : `bearer ${token}` },
      body: JSON.stringify(coupon),
    });

    if (response.status === 401) {
      throw new Error("Unauthorised Access");
    }
  
    if (response.status === 403) {
      throw new Error("Access Denied");
    }
  

    if (!response.ok) {
      throw new Error(response.info?.message || "Error while creating coupon");
    }

    const data = await response.json();
    if (!data.isSuccess) {
      throw new Error(data.message);
    }
    return data.result;
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function deleteCoupon({ id, token }) {
  try {
    let url = baseURL + "/"+id;
    const response = await fetch(url, {
      method: "Delete",
      headers: { "content-type": "application/json", "Authorization" : `bearer ${token}` },
      body: JSON.stringify({ id }),
    });

    if (response.status === 401) {
      throw new Error("Unauthorised Access");
    }
  
    if (response.status === 403) {
      throw new Error("Access Denied");
    }
  

    if (!response.ok) {
      throw new Error(data?.message || "Error while creating coupon");
    }

    const data = await response.json();
    return data;

  } catch (err) {
    throw new Error("Delete coupon request doesnot completed");
  }
}
