import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Shop.css";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const API_URL = `${import.meta.env.VITE_API_URL}/products`;

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

  const getImageSrc = (image) => {
    if (!image) {
      // Fallback placeholder
      return "https://via.placeholder.com/220";
    }

    // If it's a full URL
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    // Otherwise assume it's a local path inside the public folder
    return image;
  };

  return (
    <div className="shop-layout">
      <h1 className="shop-title">Suzy's Shop</h1>
      <p className="shop-sub-heading">Lorem Ipsum, Lorem, Ipsum Loren, Ipsum.</p>
      <div className="products-grid">
        {products.map((product) => (
          <div className="product-card" key={product._id}>
            <img
              src={getImageSrc(product.image)}
              alt={product.name}
              className="product-image"
            />
            <div className="product-info">
              <button
                className="product-button"
                onClick={() =>
                  (window.location.href = `/shop/${product._id}`)
                }
              >
                View
              </button>
              <div>
                <p className="product-name">{product.name}</p>
                <p className="product-price">£{product.price}</p>
              </div>
  
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;