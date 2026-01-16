import React from 'react';

function Notification({ show, message }) {
  return (
    <div className={`notification ${show ? 'show' : ''}`}>
      {message}
    </div>
  );
}

export default Notification;
