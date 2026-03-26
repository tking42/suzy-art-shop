import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Product.css";
import { CartContext } from "./context/CartContext";
import { ToastContext } from "./context/ToastContext";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const API_URL = `${import.meta.env.VITE_API_URL}/products/${id}`;

  const { addToCart } = useContext(CartContext);
  const { addToast } = useContext(ToastContext);

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

  const SERVER_BASE = import.meta.env.VITE_API_URL.replace(/\/api$/, "");

  const getImageSrc = (image) => {
    if (!image) return "https://via.placeholder.com/220";
    if (image.startsWith("http://") || image.startsWith("https://")) return image;
    if (image.startsWith("/uploads/")) return `${SERVER_BASE}${image}`;
    if (!image.startsWith("/")) return "/" + image;
    return image;
  };

  if (!product) return null;

  return (
    <div className="product-page">
      <div className="product-image-panel">
        <img src={getImageSrc(product.image)} alt={product.name} />
      </div>

      <div className="product-details-panel">
        <button className="product-breadcrumb" onClick={() => navigate("/shop")}>
          ← Shop
        </button>

        <h1>{product.name}</h1>
        <div className="product-divider" />
        <p className="product-price">£{product.price.toFixed(2)}</p>

        {product.description && (
          <p className="product-description">{product.description}</p>
        )}

        <button
          className="product-button"
          onClick={() => {
            addToCart(product);
            addToast(`${product.name} added to cart`);
          }}
        >
          Add to Cart
        </button>

        {product.stock <= 3 && product.stock > 0 && (
          <p className="product-stock-note">Only {product.stock} left</p>
        )}
      </div>
    </div>
  );
};

export default Product;
