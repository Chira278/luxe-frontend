import React from 'react';

function Header({ cartCount, onCartToggle, onThemeToggle, lightMode, onNavigate }) {
  return (
    <header>
      <nav>
        <div className="logo">LUXE</div>
        <ul className="nav-links">
          <li><a onClick={() => onNavigate('home')}>Home</a></li>
          <li><a onClick={() => onNavigate('products')}>Products</a></li>
          <li><a onClick={() => onNavigate('about')}>About</a></li>
          <li><a onClick={() => onNavigate('contact')}>Contact</a></li>
        </ul>
        <div className="nav-actions">
          <button className="icon-btn" onClick={onThemeToggle}>
            {lightMode ? '🌙' : '☀️'}
          </button>
          <button className="icon-btn" onClick={onCartToggle}>
            🛒
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
