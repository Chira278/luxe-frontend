const API_URL = 'http://localhost:5000/api';

// Helper function for API requests
async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Product APIs
export async function fetchProducts(filters = {}) {
  const params = new URLSearchParams(filters);
  return await apiRequest(`/products?${params}`);
}

export async function fetchProductById(id) {
  return await apiRequest(`/products/${id}`);
}

export async function fetchProductsByCategory(category) {
  return await apiRequest(`/products/category/${category}`);
}

// Cart APIs
export async function getCart(sessionId) {
  return await apiRequest(`/cart/${sessionId}`);
}

export async function addToCartAPI(sessionId, product) {
  return await apiRequest(`/cart/${sessionId}/add`, {
    method: 'POST',
    body: JSON.stringify({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    })
  });
}

export async function updateCartItem(sessionId, productId, quantity) {
  return await apiRequest(`/cart/${sessionId}/update/${productId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity })
  });
}

export async function removeFromCartAPI(sessionId, productId) {
  return await apiRequest(`/cart/${sessionId}/remove/${productId}`, {
    method: 'DELETE'
  });
}

export async function clearCartAPI(sessionId) {
  return await apiRequest(`/cart/${sessionId}/clear`, {
    method: 'DELETE'
  });
}

// Order APIs
export async function createOrder(sessionId, items, customerInfo, shippingAddress, billingAddress, couponCode, paymentResult) {
  return await apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify({
      sessionId,
      items,
      customerInfo,
      paymentMethod: paymentResult.paymentMethod,
      paymentDetails: paymentResult,
      shippingAddress,
      billingAddress,
      couponCode
    })
  });
}

export async function getOrders(email) {
  return await apiRequest(`/orders?email=${email}`);
}

export async function getOrderById(orderId) {
  return await apiRequest(`/orders/${orderId}`);
}

// User APIs
export async function registerUser(name, email, password) {
  return await apiRequest('/users/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  });
}

export async function loginUser(email, password) {
  return await apiRequest('/users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

// Recommendation APIs
export async function getSimilarProducts(viewedProductIds) {
  return await apiRequest('/recommendations/similar', {
    method: 'POST',
    body: JSON.stringify({ viewedProductIds, limit: 4 })
  });
}

export async function getTrendingProducts() {
  return await apiRequest('/recommendations/trending?limit=6');
}

// Checkout APIs
export async function validateCheckout(cart, customerInfo, shippingAddress, billingAddress) {
  return await apiRequest('/checkout/validate', {
    method: 'POST',
    body: JSON.stringify({
      cart,
      customerInfo,
      shippingAddress,
      billingAddress
    })
  });
}

export async function calculateShipping(items, shippingAddress, shippingMethod) {
  return await apiRequest('/checkout/calculate-shipping', {
    method: 'POST',
    body: JSON.stringify({
      items,
      shippingAddress,
      shippingMethod
    })
  });
}

export async function calculateTax(subtotal, shippingAddress) {
  return await apiRequest('/checkout/calculate-tax', {
    method: 'POST',
    body: JSON.stringify({
      subtotal,
      shippingAddress
    })
  });
}

export async function processPayment(paymentMethod, paymentDetails, amount) {
  return await apiRequest('/checkout/process-payment', {
    method: 'POST',
    body: JSON.stringify({
      paymentMethod,
      paymentDetails,
      amount
    })
  });
}

export async function getPaymentMethods() {
  return await apiRequest('/checkout/payment-methods');
}

export async function validateCoupon(code, subtotal) {
  return await apiRequest('/orders/validate-coupon', {
    method: 'POST',
    body: JSON.stringify({
      code,
      subtotal
    })
  });
}

export async function trackOrder(orderId) {
  const result = await apiRequest(`/orders/${orderId}/track`);
  return result;
}

export async function cancelOrder(orderId, reason) {
  return await apiRequest(`/orders/${orderId}/cancel`, {
    method: 'POST',
    body: JSON.stringify({ reason })
  });
}
