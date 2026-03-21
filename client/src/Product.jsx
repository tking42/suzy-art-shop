import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Product.css";
import { useContext } from "react";
import { CartContext } from "./context/CartContext";
import { useNavigate } from "react-router-dom";

const Product = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const API_URL = `${import.meta.env.VITE_API_URL}/products/${id}`;

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(API_URL);
        setProduct(res.data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const getImageSrc = (image) => {
    if (!image) return "https://via.placeholder.com/220";
  
    if (image.startsWith("http://") || image.startsWith("https://")) return image;
  
    if (!image.startsWith("/")) return "/" + image;
  
    return image;
  };

  if (!product) return <p>Loading product...</p>;

  return (
    <>
      <button
        className="checkout-button"
        onClick={() => navigate("/checkout")}
      >
        Checkout
      </button>
      <div className="product-details">
        <h1>{product.name}</h1>
        <img
          src={getImageSrc(product.image)}
          alt={product.name}
        />
        <p className="product-price">£{product.price}</p>
        <p className="product-description">{product.description || "No description available."}</p>
        <button
          className="product-button"
          onClick={() => {
            addToCart(product);
          }}
        >
          Add to Cart
        </button>
      </div>
    </>
  );
};

export default Product;