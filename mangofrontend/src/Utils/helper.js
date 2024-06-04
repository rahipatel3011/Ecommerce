import { redirect } from "react-router-dom";

export function getAuthToken() {
  return localStorage.getItem("jwt");
}

export function tokenLoader() {
  return getAuthToken();
}

export function verifyAuthToken() {
  if (!tokenLoader()) {
    return redirect("/login");
  }
  return null;
}

export function decodedToken(token) {
  try {
    const tokenPayload = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(tokenPayload));

    // Look for role claim using the correct claim type
    const role = decodedPayload && decodedPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    return {
      ...decodedPayload,
      role: role || "No role found" // Provide default value if role claim is not present
    };
  }catch{
    return null;
  }

}
