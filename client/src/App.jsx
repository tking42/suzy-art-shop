import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./components/nav";
import Home from "./Home";
import Shop from "./Shop";
import Contact from "./Contact";
import Product from "./Product";
import Checkout from "./checkout";
import Success from "./Success";

function App() {
  return (
    <Router>
      <Nav />
      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:id" element={<Product />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </div>
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
