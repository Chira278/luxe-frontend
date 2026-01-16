import React from 'react';

function About() {
  return (
    <section id="about" style={{ background: 'var(--bg-secondary)', borderRadius: '30px', padding: '5rem 3rem' }}>
      <div className="section-header">
        <h2>About LUXE</h2>
        <p>Where innovation meets elegance</p>
      </div>
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
          We're not just another e-commerce platform — we're a movement. Born from the vision of redefining 
          digital shopping experiences, LUXE combines cutting-edge technology with timeless design philosophy. 
          Every pixel, every interaction, every detail is crafted with obsessive attention to create moments 
          that matter. We believe luxury isn't just about products; it's about the journey, the experience, 
          and the connection between innovation and emotion.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎨</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent)' }}>500+</div>
            <div style={{ color: 'var(--text-secondary)' }}>Curated Products</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⭐</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent)' }}>50K+</div>
            <div style={{ color: 'var(--text-secondary)' }}>Happy Customers</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent)' }}>24/7</div>
            <div style={{ color: 'var(--text-secondary)' }}>Premium Support</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
