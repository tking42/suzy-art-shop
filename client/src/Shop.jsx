import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Shop.css";
import { useNavigate } from "react-router-dom";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const API_URL = `${import.meta.env.VITE_API_URL}/products`;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(API_URL);
        setProducts(res.data);
      } catch (error) {
        if (error.response) {
          console.error(
            "Backend returned error:",
            error.response.status,
            error.response.data
          );
        } else {
          console.error("Axios error:", error.message);
        }
      }
    };

    fetchProducts();
  }, []);

  const SERVER_BASE = import.meta.env.VITE_API_URL.replace(/\/api$/, "");

  const getImageSrc = (image) => {
    if (!image) return "https://via.placeholder.com/220";
    if (image.startsWith("http://") || image.startsWith("https://")) return image;
    if (image.startsWith("/uploads/")) return `${SERVER_BASE}${image}`;
    if (!image.startsWith("/")) return "/" + image;
    return image;
  };

  return (
    <div className="shop-layout">
      <div className="page-header">
        <h1 className="page-title">Shop</h1>
        <span className="page-label">{products.length} {products.length === 1 ? "work" : "works"}</span>
      </div>
      <div className="products-grid">
        {products.map((product) => (
          <div className="product-card" key={product._id} onClick={() => navigate(`/shop/${product._id}`)}>
            <div className="product-card-image-wrap">
              <img
                src={getImageSrc(product.image)}
                alt={product.name}
                className="product-image"
              />
              <div className="product-card-overlay">
                <span>View</span>
              </div>
            </div>
            <div className="product-info">
              <p className="product-name">{product.name}</p>
              <p className="product-price">£{product.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;