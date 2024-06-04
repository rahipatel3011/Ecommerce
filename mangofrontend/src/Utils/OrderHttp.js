import { decodedToken } from "./helper";

// const baseURL = "https://localhost:7777/api/order";
//const baseURL = "https://localhost:7006/api/order";
const baseURL = "https://mangoservicesorderapihost.azurewebsites.net/api/order";

/**
 *
 * @param {User Cart} cart
 * @returns session Url of the stripe session
 */
export async function createOrder({cart, token}) {
  try {
    const url = `${baseURL}/createorder`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cart),
    });

    // error handling
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

    if (!data.isSuccess) {
      throw new Error(data.message);
    }

    const orderHeader = data.result;

    // after successfully creating order, create Stripe session and redirect to session URL
    const sessionUrl = await createStripeSession(orderHeader, token);
    return sessionUrl;
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * create a stripe sesion
 * @param {OrderHeader} orderHeader
 * @param {JWT Token} token
 * @returns session URL
 */
async function createStripeSession(orderHeader, token) {
  const domain = window.location.origin;
  const stripeRequestDTO = {
    orderHeader,
    approvedUrl:
      domain + "/cart/confirmation?orderId=" + orderHeader.orderHeaderId,
    cancelUrl: domain + "/cart/checkout",
  };

  let url = baseURL + "/CreateSession";
  const response = await fetch(url, {
    method: "post",
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(stripeRequestDTO),
  });

  // error handling
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
  if (!data.isSuccess) {
    throw new Error(data.message);
  }

  const stripeRequestDTOResponse = data.result;
  const sessionUrl = stripeRequestDTOResponse.stripeSessionUrl;
  return sessionUrl;
}

/**
 * Validate payment for the stripe session
 * @param {OrderHeaderID} orderHeaderID
 */
export async function validateStripeSession({ OrderHeaderId, signal, token }) {
  //const token = getAuthToken();
  try {
    let url = baseURL + "/ValidateStripeSession";
    const response = await fetch(url, {
      signal,
      method: "post",
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(OrderHeaderId),
    });

    // error handling
    if (response.status === 401) {
      throw new Error("Unauthorised Access");
    }

    if (response.status === 403) {
      throw new Error("Access Denied");
    }

    if (!response.ok) {
      throw new Error("Failed to verify order");
    }

    const data = await response.json();
    if (!data.isSuccess) {
      throw new Error(data.message);
    }
    return data.result;
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Returns all Orders
 * @returns All Orders
 */
export async function GetAllOrder({token}) {
  const user = decodedToken(token);
  try {
    const url = `${baseURL}/GetOrders/${user.unique_name}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // error handling
    if (response.status === 401) {
      throw new Error("Unauthorised Access");
    }

    if (response.status === 403) {
      throw new Error("Access Denied");
    }

    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }

    const respData = await response.json();

    if (!respData.isSuccess) {
      throw new Error(respData.message);
    }
    return respData.result;
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Returns Order using orderID
 * @param {Api signal} param0
 * @param {OrderId} param1
 * @returns order
 */
export async function GetOrderById({ signal, orderId, token }) {
  const user = decodedToken(token);
  try {
    const url = `${baseURL}/GetOrder/${orderId}`;
    const response = await fetch(url, {
      signal,
      method: "GET",
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    

    // error handling
    if (response.status === 401) {
      throw new Error("Unauthorised Access");
    }

    if (response.status === 403) {
      throw new Error("Access Denied");
    }

    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }

    const respData = await response.json();

    if (!respData.isSuccess) {
      throw new Error(respData.message);
    }
    const order = respData.result;

    if (
      user.unique_name !== order.userId &&
      user.role.toLowerCase() !== "admin"
    ) {
      throw new Error("order not found");
    }
    return order;
  } catch (error) {
    throw new Error(error.message);
  }
}




/**
 * It updates order based on orderID
 * @param {orderId, newStatus, token} param0 
 * @returns update order
 */
export async function UpdateOrder({ orderId, newStatus, token }) {
  //const token = getAuthToken();
  try {
    const url = `${baseURL}/UpdateOrder/${orderId}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newStatus),
    });

    // error handling
    if (response.status === 401) {
      throw new Error("Unauthorised Access");
    }

    if (response.status === 403) {
      throw new Error("Access Denied");
    }
    if (!response.ok) {
      throw new Error("Failed to update orders");
    }

    const respData = await response.json();

    if (!respData.isSuccess) {
      throw new Error(respData.message);
    }
    return respData.result;
  } catch (error) {
    throw new Error(error.message);
  }
}
