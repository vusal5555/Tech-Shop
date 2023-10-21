import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/styles/bootstrap.custom.css";
import "./assets/styles/index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import LoginScreen from "./pages/LoginScreen";
import RegisterPage from "./pages/RegisterPage";
import ShippingPage from "./pages/shippingPage";
import PrivateRoute from "./components/PrivateRoute";
import PaymentPage from "./pages/PaymentPage";
import PlaceOrderPage from "./pages/PlaceOrderPage";
import OrderPage from "./pages/OrderPage";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import store from "./store";
import ProfilePage from "./pages/ProfilePage";
import AdminRoute from "./components/AdminRoute";
import OrderListPage from "./pages/OrderListPage";
import ProductListPage from "./pages/ProductListPage";
import ProductEditPage from "./pages/ProductEditPage";
import UsersListPage from "./pages/UsersListPage";
import UserEditPage from "./pages/UserEditPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App></App>}>
      <Route index={true} path="/" element={<HomePage></HomePage>}></Route>
      <Route path="/search/:keyword" element={<HomePage></HomePage>}></Route>
      <Route path="/page/:pageNumber" element={<HomePage></HomePage>}></Route>
      <Route
        path="/search/:keyword/page/:pageNumber"
        element={<HomePage></HomePage>}
      ></Route>
      <Route path="/product/:id" element={<ProductPage></ProductPage>}></Route>
      <Route path="/cart" element={<CartPage></CartPage>}></Route>
      <Route path="/login" element={<LoginScreen></LoginScreen>}></Route>
      <Route path="/register" element={<RegisterPage></RegisterPage>}></Route>
      <Route path="" element={<PrivateRoute></PrivateRoute>}>
        <Route path="/shipping" element={<ShippingPage></ShippingPage>}></Route>
        <Route path="/payment" element={<PaymentPage></PaymentPage>}></Route>
        <Route
          path="/placeorder"
          element={<PlaceOrderPage></PlaceOrderPage>}
        ></Route>
        <Route path="/order/:id" element={<OrderPage></OrderPage>}></Route>
        <Route path="/profile" element={<ProfilePage></ProfilePage>}></Route>
      </Route>
      <Route path="" element={<AdminRoute></AdminRoute>}>
        <Route
          path="/admin/orderlist"
          element={<OrderListPage></OrderListPage>}
        ></Route>
        <Route
          path="/admin/productlist"
          element={<ProductListPage></ProductListPage>}
        ></Route>
        <Route
          path="/admin/productlist/:pageNumber"
          element={<ProductListPage></ProductListPage>}
        ></Route>
        <Route
          path="/admin/userlist"
          element={<UsersListPage></UsersListPage>}
        ></Route>
        <Route
          path="/admin/product/:id/edit"
          element={<ProductEditPage></ProductEditPage>}
        ></Route>
        <Route
          path="/admin/user/:id/edit"
          element={<UserEditPage></UserEditPage>}
        ></Route>
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <PayPalScriptProvider deferLoading={true}>
          <RouterProvider router={router}>
            <App />
          </RouterProvider>
        </PayPalScriptProvider>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);
