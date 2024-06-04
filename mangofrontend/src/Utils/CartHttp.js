
//const baseURL = "https://localhost:7777/api/cart";
// const baseURL = "https://localhost:7004/api/cart";
const baseURL = "https://mangoservicesshoppingcartapihost.azurewebsites.net/api/cart";



/**
 * represent to add cart
 * @param {cart, token} param0 
 * @returns Add to cart
 */
export async function addToCart({ cart, token }) {
  //const token = getAuthToken();
  let url = `${baseURL}/CartUpsert`;
  try {
    const response = await fetch(url, {
      method: "post",
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cart),
    });

    if (response.status === 401) {
      throw new Error("Unauthorised Access");
    }
    if (!response.ok) {
      throw new Error("Failed to add product to cart");
    }

    const data = await response.json();
    if (!data.isSuccess) {
      throw new Error(data.message);
    }

    return data.result;
  } catch (error) {
    throw new Error(error);
  }
}




/**
 * update and delete cart based on user action
 * @param {cartItemId, token} param0 
 * @returns remove item from the cart
 */
export async function removeFromCart({ cartItemId, token }) {
  //const token = getAuthToken();
  let url = `${baseURL}/RemoveCart`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cartItemId),
    });

    if (response.status === 401) {
      throw new Error("Unauthorised Access");
    }
    if (!response.ok) {
      throw new Error("Failed delete product from the cart");
    }

    const data = await response.json();
    if (!data.isSuccess) {
      throw new Error(data.message);
    }

    return data.result;
  } catch (error) {
    throw new Error(error);
  }
}




/**
 * retrive cart based on usedId
 * @param {requestSignal, userId, token} param0 
 * @returns get cart for user
 */
export async function getCartByUserId({ signal, userId, token }) {
  try {
    let url = baseURL + "/" + userId;
    const response = await fetch(url, {
      signal: signal,
      headers: { Authorization: `bearer ${token}` },
    });

    if (response.status === 401) {
      throw new Error("Unauthorized access");
    }

    if (!response.ok) {
      throw new Error("Failed to get cart");
    }

    const data = await response.json();
    if (!data.isSuccess) {
      throw new Error(data.message);
    }

    return data.result;
  } catch (error) {
    throw new Error(error);
  }
}


/**
 * Apply coupon in shopping cart
 * @param {couponCode, total, userId, token} param0 
 * @returns Apply coupon
 */
export async function mutateCoupon({ couponCode, total, userId, token }) {
  //const token = getAuthToken();
  try {
    let url = `${baseURL}/${couponCode ? "applycoupon" : "removecoupon"}`;
    const cart = {
      userId,
      coupon: couponCode,
      total,
      items: [],
    };
    const response = await fetch(url, {
      method: "post",
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cart),
    });

    if (response.status === 401) {
      throw new Error("Unauthorized access");
    }

    if (!response.ok) {
      throw new Error(
        `Failed to ${couponCode ? "apply coupon" : "remove coupon"}`
      );
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
 * Returns "Cart sent" if success
 * @param {Object with cart and token} param0 
 * @returns string message
 */
export async function EmailCart({cart,token}) {
  try {
    let url = `${baseURL}/EmailCartRequest`;
    //let token = getAuthToken();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cart),
    });

    if (response.status === 401) {
      throw new Error("Unauthorized access");
    }

    if (!response.ok) {
      throw new Error(`Failed to email cart`);
    }
    const data = await response.json();
    if (!data.isSuccess) {
      throw new Error(data.message);
    }

    return "Cart sent";

  } catch (error) {
    throw new Error(error.message);
  }
}
