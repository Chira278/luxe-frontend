import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import Products from './components/Products';
import CartSidebar from './components/CartSidebar';
import Checkout from './components/Checkout';
import OrderSuccess from './components/OrderSuccess';
import Notification from './components/Notification';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { fetchProducts } from './services/api';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [lightMode, setLightMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (lightMode) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [lightMode]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
      showNotification('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    
    showNotification(`${product.name} added to cart!`);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, quantity }
        : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const showNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 3000);
  };

  const toggleTheme = () => {
    setLightMode(!lightMode);
  };

  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handleCheckoutSuccess = (order) => {
    setCheckoutOpen(false);
    clearCart();
    setOrderSuccess(order);
    showNotification(`Order ${order.orderId} placed successfully!`);
  };

  const handleCloseOrderSuccess = () => {
    setOrderSuccess(null);
  };

  return (
    <div className="App">
      <Header
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onCartToggle={toggleCart}
        onThemeToggle={toggleTheme}
        lightMode={lightMode}
        onNavigate={scrollToSection}
      />
      
      <Hero onExplore={() => scrollToSection('products')} />
      
      <Products
        products={products}
        onAddToCart={addToCart}
        loading={loading}
      />
      
      <About />
      
      <Contact />
      
      <Footer />
      
      <CartSidebar
        cart={cart}
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onClearCart={clearCart}
        onCheckout={handleCheckout}
      />
      
      {checkoutOpen && (
        <Checkout
          cart={cart}
          onClose={() => setCheckoutOpen(false)}
          onSuccess={handleCheckoutSuccess}
        />
      )}
      
      {orderSuccess && (
        <OrderSuccess
          order={orderSuccess}
          onClose={handleCloseOrderSuccess}
        />
      )}
      
      <Notification
        show={notification.show}
        message={notification.message}
      />
    </div>
  );
}

export default App;
