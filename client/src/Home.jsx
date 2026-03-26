import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import hero1 from "./assets/heroImage1.jpg";
import hero2 from "./assets/heroImage2.jpg";
import hero3 from "./assets/heroImage3.jpg";
import "./Home.css";

const Home = () => {
  const images = [hero1, hero2, hero3];

  return (
    <div className="hero-layout">
      <div className="hero-text">
        <h1>Original Art &amp; Prints</h1>

        <p className="hero-tagline">Small-batch original works exploring colour, texture, and the quiet moments of everyday life.</p>

        <div className="hero-cta">
          <button onClick={() => (window.location.href = "/shop")}>
            Shop Now
          </button>
        </div>
      </div>

      <div className="hero-carousel-container">
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop
          slidesPerView={1}
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <img src={img} alt={`Artwork ${index + 1}`} className="hero-image" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Home;
