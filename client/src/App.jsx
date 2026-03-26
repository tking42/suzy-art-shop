import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Nav from "./components/nav";
import Footer from "./components/Footer";
import Home from "./Home";
import Shop from "./Shop";
import About from "./About";
import Product from "./Product";
import Basket from "./Basket";
import Payment from "./Payment";
import Success from "./Success";
import AdminLogin from "./AdminLogin";
import Admin from "./Admin";

const ProtectedAdmin = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  return token ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin routes — no Nav/Footer */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedAdmin><Admin /></ProtectedAdmin>} />

        {/* Shop routes — with Nav/Footer */}
        <Route path="/*" element={
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <Nav />
            <main style={{ flex: 1, overflowY: "auto", height: "100%" }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/:id" element={<Product />} />
                <Route path="/about" element={<About />} />
                <Route path="/basket" element={<Basket />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/success" element={<Success />} />
              </Routes>
            </main>
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;


  // const API_URL = `${import.meta.env.VITE_API_URL}/products`

  // const getProducts = async () => {
  //   try {
  //     const res = await axios.get(API_URL)
  //     console.log("All Products:", res.data)
  //   } catch (error) {
  //     console.error("Error fetching products:", error)
  //   }
  // }

  // const getSingleProduct = async () => {
  //   try {
  //     const productId = "69a31cbd6deb5273b1230fb1"
  //     const res = await axios.get(`${API_URL}/${productId}`)
  //     console.log("Single Product:", res.data)
  //   } catch (error) {
  //     console.error("Error fetching product:", error)
  //   }
  // }

  // const createProduct = async () => {
  //   try {
  //     const newProduct = {
  //       name: "Test Artwork",
  //       description: "Test description",
  //       price: 150,
  //       stock: 2,
  //       image: "https://via.placeholder.com/150"
  //     }

  //     const res = await axios.post(API_URL, newProduct)
  //     console.log("Created Product:", res.data)
  //   } catch (error) {
  //     console.error("Error creating product:", error)
  //   }
  // }
