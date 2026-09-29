import React, { useEffect, useState } from "react";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import Layout from "./Layout";
import Card from "./components/Cards/Card";
import Form from "./components/form/Form";
import ProductInfo from "./components/productInfo/ProductInfo";
import PaymentMethod from "./components/paymentmethod/PaymentMethod";
import ErrorPage from "./components/errorpage/ErrorPage";
import Login from "./components/Login/Login";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const [products, setProducts] = useState(() => {
    try {
      const added = localStorage.getItem("products");
      return added ? JSON.parse(added) : [];
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
      return [];
    }


  });
  const addProduct = (product) => {
    setProducts((prev) => [...prev, product]);
  };

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products))
  }, [products])

  const router = createBrowserRouter(
    createRoutesFromElements(

      <Route path="/" element={<Layout />}>
        <Route index element={<Card products={products} />} />
        <Route path="productInfo/:productIndex" element={<ProductInfo products={products} />} />
        <Route path="paymentMethod/:productIndex" element={<PaymentMethod products={products} />} errorElement={<ErrorPage />} />
        <Route path="/Form" element={<Form addProduct={addProduct} />} />
        <Route path="/Login" element={<Login />} errorElement={<ErrorPage />} />


      </Route>
    ),
    // Match the "homepage" path from package.json (e.g. /Campus-MarketPlace on GitHub Pages).
    { basename: process.env.PUBLIC_URL || "/" }
  );

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
