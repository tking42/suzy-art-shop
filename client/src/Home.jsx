import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import hero1 from "./assets/heroImage1.jpg";
import hero2 from "./assets/heroImage2.jpg";
import hero3 from "./assets/heroImage3.jpg";
import "./Home.css";

const Home = () => {
  const images = [hero1, hero2, hero3];

  return (
    <div className="hero-layout">
      
      <div className="hero-text">
        <h1>Suzy Parr's Portfolio</h1>
        <p>Lorem Ipsum, Lorem Ipsum, Lorem Ipsum.</p>
        
        <button onClick={() => (window.location.href = "/shop")}>
          Shop
        </button>
      </div>

      <div className="hero-carousel-container">
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          loop
          slidesPerView={1}
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <div className="hero-slide">
                <img src={img} alt={`Hero ${index}`} className="hero-image" />
                <span className="slide-number">0{index + 1}</span>
              </div>
          </SwiperSlide>
          ))}
        </Swiper>
      </div>

    </div>
  );
};
export default Home;