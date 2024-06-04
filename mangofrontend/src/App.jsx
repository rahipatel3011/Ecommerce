import "./App.css";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import Router from "./Router.jsx";
import { queryClient } from "./Utils/CouponHttp.js";
import TokenContextProvider from "./Store/TokenContextProvider.jsx";

function App() {
  return (
    <TokenContextProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={Router} />
      </QueryClientProvider>
    </TokenContextProvider>
  );
}

export default App;
