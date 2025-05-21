import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import Toast from './Toast';

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);
  
  // Function to add a new toast
  const addToast = useCallback((message, type = 'INFO', duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type, duration }]);
    return id;
  }, []);
  
  // Function to remove a toast by ID
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);
  
  // Expose methods to window for global access
  useEffect(() => {
    // Create or update the toast manager on the window object
    window.toastManager = {
      success: (message, duration) => addToast(message, 'SUCCESS', duration),
      error: (message, duration) => addToast(message, 'ERROR', duration),
      info: (message, duration) => addToast(message, 'INFO', duration),
      remove: removeToast
    };
    
    return () => {
      // Clean up on unmount
      delete window.toastManager;
    };
  }, [addToast, removeToast]);
  
  // Create container if it doesn't exist
  useEffect(() => {
    let toastRoot = document.getElementById('toast-root');
    if (!toastRoot) {
      toastRoot = document.createElement('div');
      toastRoot.id = 'toast-root';
      toastRoot.className = 'fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-xs';
      document.body.appendChild(toastRoot);
    }
    
    return () => {
      // Clean up on unmount if we created the container
      if (document.getElementById('toast-root')) {
        document.body.removeChild(toastRoot);
      }
    };
  }, []);
  
  // Portal the toasts to the container
  return ReactDOM.createPortal(
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>,
    document.getElementById('toast-root') || document.body
  );
};

export default ToastContainer;