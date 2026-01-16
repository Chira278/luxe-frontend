import React from 'react';

function Hero({ onExplore }) {
  return (
    <section className="hero" id="home">
      <div className="hero-bg">
        <div className="floating-shape shape1"></div>
        <div className="floating-shape shape2"></div>
        <div className="floating-shape shape3"></div>
      </div>
      <div className="hero-content">
        <h1>REDEFINE<br />LUXURY</h1>
        <p>Experience premium products with cutting-edge design</p>
        <button className="cta-btn" onClick={onExplore}>
          Explore Collection
        </button>
      </div>
    </section>
  );
}

export default Hero;
