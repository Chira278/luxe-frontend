import React from 'react';

function Header({ cartCount, onCartToggle, onThemeToggle, lightMode, onNavigate }) {
  return (
    <header>
      <nav>
        <div className="logo">LUXE</div>
        <ul className="nav-links">
          <li><button onClick={() => onNavigate('home')} style={{background:'none',border:'none',color:'inherit',cursor:'pointer',font:'inherit'}}>Home</button></li>
          <li><button onClick={() => onNavigate('products')} style={{background:'none',border:'none',color:'inherit',cursor:'pointer',font:'inherit'}}>Products</button></li>
          <li><button onClick={() => onNavigate('about')} style={{background:'none',border:'none',color:'inherit',cursor:'pointer',font:'inherit'}}>About</button></li>
          <li><button onClick={() => onNavigate('contact')} style={{background:'none',border:'none',color:'inherit',cursor:'pointer',font:'inherit'}}>Contact</button></li>
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
