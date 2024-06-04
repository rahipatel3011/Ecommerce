
//export const queryClient = new QueryClient();

// const baseURL = "https://localhost:7777/api/product";
//const baseURL = "https://localhost:7003/api/product";
const baseURL = "https://mangoservicesproductapihost.azurewebsites.net/api/product";




export async function getAllProducts({token, signal}) {
  //const token = getAuthToken();
  const response = await fetch(baseURL,{
    signal
  });
  if (!response.ok) {
    throw new Error("failed to fetch Products");
  }

  const data = await response.json();
  if (!data.isSuccess) {
    return data;
  }
  const allProducts = data.result;
  return allProducts;
}

export async function getProductById({ id, signal, token }) {
  //const token = getAuthToken();
  let url = baseURL + "/" + id;
  const response = await fetch(url, {
    signal: signal,
    headers: { "Authorization": `bearer ${token}` },
  });
  if (response.status === 401) {
    throw new Error("Unauthorised Access");
  }
  if (!response.ok) {
    throw new Error("Failed to fetch Product with id " + id);
  }

  const data = await response.json();
  if (!data.isSuccess) {
    throw new Error(data.message);
  }

  const product = data.result;
  return product;
}




export async function manipulateProduct({formData,id, token}) {
  //const token = getAuthToken();
  let url = baseURL;
  let method = "post";
  if (id) {
    method = "put";
    url += `/${id}`;
  }

  const response = await fetch(url, {
    method: method,
    headers: {
      "Authorization": `bearer ${token}`,
    },
    body: formData,
  });


  if (!response.ok) {
    throw new Error("failed to update Product");
  }

  const data = await response.json();
  if (!data.isSuccess) {
    throw new Error(data.message);
  }

  return data.result;
}



/**
 * Use to delete product
 * @param {Id} param0 
 * @returns number of affected rows in INTEGER
 */
export async function deleteProduct({ id, token }) {
  //const token = getAuthToken();
  let url = baseURL + "/" + id;
  const response = await fetch(url, {
    method: "delete",
    headers: { "Authorization": `bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("failed to Delete Product");
  }

  const data = await response.json();
  if (!data.isSuccess) {
    throw new Error(data.message);
  }

  return data.result;
}
