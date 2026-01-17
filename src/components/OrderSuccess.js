import React, { useState, useEffect } from 'react';
import { trackOrder } from '../services/api';
import './OrderSuccess.css';

function OrderSuccess({ order, onClose }) {
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTracking();
    // Auto-refresh tracking every 30 seconds
    const interval = setInterval(loadTracking, 30000);
    return () => clearInterval(interval);
  }, [order.orderId]);

  const loadTracking = async () => {
    try {
      const data = await trackOrder(order.orderId);
      setTracking(data);
    } catch (error) {
      console.error('Failed to load tracking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = () => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    const invoiceUrl = `${apiUrl}/orders/${order.orderId}/invoice`;
    window.open(invoiceUrl, '_blank');
  };

  const getStatusIcon = (status) => {
    const icons = {
      'confirmed': '✓',
      'processing': '⚙️',
      'shipped': '📦',
      'out_for_delivery': '🚚',
      'delivered': '✅',
      'cancelled': '❌'
    };
    return icons[status] || '📋';
  };

  const getStatusColor = (status) => {
    const colors = {
      'confirmed': '#4caf50',
      'processing': '#ff9800',
      'shipped': '#2196f3',
      'out_for_delivery': '#9c27b0',
      'delivered': '#4caf50',
      'cancelled': '#f44336'
    };
    return colors[status] || '#666';
  };

  return (
    <div className="order-success-overlay">
      <div className="order-success-modal">
        <div className="success-header">
          <div className="success-icon">🎉</div>
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your purchase</p>
        </div>

        <div className="order-details">
          <div className="detail-row">
            <span className="detail-label">Order ID:</span>
            <span className="detail-value order-id">{order.orderId}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Order Date:</span>
            <span className="detail-value">
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Total Amount:</span>
            <span className="detail-value total-amount">${order.pricing.total.toFixed(2)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Payment Status:</span>
            <span className="detail-value payment-status">
              <span className="status-badge paid">PAID</span>
            </span>
          </div>
          {order.trackingNumber && (
            <div className="detail-row">
              <span className="detail-label">Tracking Number:</span>
              <span className="detail-value tracking-number">{order.trackingNumber}</span>
            </div>
          )}
          <div className="detail-row">
            <span className="detail-label">Estimated Delivery:</span>
            <span className="detail-value">
              {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>

        <div className="order-actions">
          <button className="btn-download" onClick={handleDownloadInvoice}>
            📄 Download Invoice
          </button>
          <button className="btn-track" onClick={loadTracking}>
            🔄 Refresh Status
          </button>
        </div>

        {/* Order Tracking Timeline */}
        {tracking && (
          <div className="tracking-section">
            <h3>Order Status</h3>
            <div className="current-status" style={{ borderColor: getStatusColor(tracking.status) }}>
              <span className="status-icon">{getStatusIcon(tracking.status)}</span>
              <div>
                <div className="status-name">{tracking.status.replace('_', ' ').toUpperCase()}</div>
                <div className="status-location">{tracking.currentLocation}</div>
              </div>
            </div>

            <div className="status-timeline">
              {tracking.statusHistory.map((item, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-dot" style={{ background: getStatusColor(item.status) }}>
                    {getStatusIcon(item.status)}
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-status">{item.status.replace('_', ' ').toUpperCase()}</div>
                    <div className="timeline-message">{item.message}</div>
                    <div className="timeline-time">
                      {new Date(item.timestamp).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Items Summary */}
        <div className="order-items-summary">
          <h3>Order Items</h3>
          {order.items.map((item, index) => (
            <div key={index} className="summary-item">
              <div className="item-info">
                <span className="item-name">{item.name}</span>
                <span className="item-qty">x{item.quantity}</span>
              </div>
              <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Shipping Address */}
        <div className="shipping-info">
          <h3>Shipping Address</h3>
          <p>{order.customerInfo.name}</p>
          <p>{order.shippingAddress.street}</p>
          {order.shippingAddress.apartment && <p>{order.shippingAddress.apartment}</p>}
          <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
          <p>{order.shippingAddress.country}</p>
        </div>

        <div className="success-footer">
          <p>A confirmation email has been sent to <strong>{order.customerInfo.email}</strong></p>
          <button className="btn-close" onClick={onClose}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
