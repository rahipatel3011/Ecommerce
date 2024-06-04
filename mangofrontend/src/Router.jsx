import "./App.css";
import { Outlet, createBrowserRouter } from "react-router-dom";
import Header from "./Components/Header";
import CouponView from "./Pages/CouponPages/CouponView";
import CreateCouponPage from "./Pages/CouponPages/CreateCouponPage";
import LoginPage, {loader as authLoader, action as loginAction} from "./Pages/AuthPages/LoginPage";
import LogoutPage, {action as logoutAction} from "./Pages/AuthPages/LogoutPage.jsx";
import ErrorPage from "./Pages/ErrorPage.jsx";
import { decodedToken, verifyAuthToken } from "./Utils/helper.js";
import RegisterPage, {action as registerAction} from "./Pages/AuthPages/RegisterPage.jsx";
import Products from "./Pages/ProductPages/Products.jsx";
import EditProduct from "./Pages/ProductPages/EditProduct.jsx";
import CreateProduct from "./Pages/ProductPages/CreateProduct.jsx";
import ProductDetail from "./Pages/ProductPages/ProductDetail.jsx";
import HomePage from "./Pages/HomePage.jsx";
import ShoppingCartPage from "./Pages/ShoppingCartPage/ShoppingCartPage.jsx";
import CheckoutPage from "./Pages/CheckoutPages/CheckoutPage.jsx";
import OrderConfirmationPage from "./Pages/CheckoutPages/OrderConfirmationPage.jsx";
import Orders from "./Pages/OrderPages/Orders.jsx";
import OrderDetail from "./Pages/OrderPages/OrderDetail.jsx";



const Router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Header />
          <Outlet />
        </>
      ),
      id:"root",
      errorElement : <ErrorPage />,
      children: [
        {index:true, element:<HomePage />},
        { path: "login", element: <LoginPage />, loader: authLoader},
        { path: "register", element: <RegisterPage />, action : registerAction},
        { path: "logout", element: <LogoutPage/> , action: logoutAction},
        {
          path: "coupons",
          loader:verifyAuthToken,
          children: [
            { index: true, element: <CouponView /> },
            { path: "create", element: <CreateCouponPage /> },
          ],
          
        },
        {
          path : "products",
          loader:verifyAuthToken,
          children: [
            {index: true, element: <Products />},
            {path: "edit/:id", element: <EditProduct />},
            {path: ":id", element: <ProductDetail />},
            {path: "create", element: <CreateProduct />},
          ]
        },
        {path: "cart",
        loader:verifyAuthToken,
        children:[
          {index:true, element: <ShoppingCartPage />},
          {path: "checkout",element: <CheckoutPage />},
          {path: "confirmation",element: <OrderConfirmationPage />}
        ]},
        {path: "order",
        loader:verifyAuthToken,
        children:[
          {index:true, element: <Orders />},
          {path: ":orderId", element: <OrderDetail />},
        ]},
      ],
    },
  ]);


  export default Router;