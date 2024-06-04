import { createContext, useReducer } from "react";

export const TokenContext = createContext({
  token: null,
  addToken: () => {},
  removeToken: () => {},
});


function reducerFunction(state, action){
    if(action.type === "ADD_TOKEN"){
        return { ...state, token: action.payload.token, expiryTime: action.payload.expiryTime };
    }
    if(action.type === "REMOVE_TOKEN"){
        return { ...state, token: null, expiryTime: null };
    }
    return state;
}


export default function TokenContextProvider({children}) {
  let token = localStorage.getItem("jwt");
    const [state, dispatch] = useReducer(reducerFunction, { token: token, expiryTime: null });
    
    // Function to add token and expiry time
  const addToken = (token, expiryTime) => {
    dispatch({ type: "ADD_TOKEN", payload: { token, expiryTime } });
  };

  // Function to remove token and expiry time
  const removeToken = () => {
    dispatch({ type: "REMOVE_TOKEN" });
  };

  const tokenctx = {
    token: state.token,
    addToken: addToken,
    removeToken: removeToken,
}


  return <TokenContext.Provider value={tokenctx}>{children}</TokenContext.Provider>;
}
