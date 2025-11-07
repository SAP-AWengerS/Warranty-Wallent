import React, { createContext, useContext } from "react";
import { notification } from "antd";  // or any toast library like react-toastify

const ToastContext = createContext();

export const useToast = () => {
  return useContext(ToastContext);
};

export const ToastProvider = ({ children }) => {
  const toastMessage = (type, message) => {
    notification[type]({
      message: message,
    });
  };

  return (
    <ToastContext.Provider value={toastMessage}>
      {children}
    </ToastContext.Provider>
  );
};