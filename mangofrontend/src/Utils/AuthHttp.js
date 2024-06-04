import { json } from "react-router-dom";

//const baseURL = "https://localhost:7002/api/auth";
const baseURL = "https://mangoservicesauthapihost.azurewebsites.net/api/auth";

export async function login({ loginDTO }) {
  try {
    let url = `${baseURL}/login`;
    const response = await fetch(url, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(loginDTO),
    });

    if (response.status === 401 || response.status === 400) {
      throw new Error ("Invalid Credentials");
    }
    if (!response.ok) {
      throw new Error("could not authenticate user." );
    }
    const data = await response.json();

    // const expiryTime = new Date();
    // expiryTime.setHours(expiryTime.getHours() + 2);
    // addToken(data.result.token, expiryTime);

    localStorage.setItem("jwt", data.result.token);
    return data.result;
  } catch (error) {
    throw new Error(error);
  }
}
