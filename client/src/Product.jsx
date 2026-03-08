import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Product.css";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const API_URL = `${import.meta.env.VITE_API_URL}/products/${id}`;

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
    <div className="product-details">
      <h1>{product.name}</h1>
      <img
        src={getImageSrc(product.image)}
        alt={product.name}
      />
      <p className="product-price">£{product.price}</p>
      <p className="product-description">{product.description || "No description available."}</p>
      <button className="product-button">Add to Cart</button>
    </div>
  );
};

export default Product;