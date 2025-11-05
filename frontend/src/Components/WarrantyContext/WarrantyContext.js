import React, { createContext, useContext, useState } from "react";

const WarrantyContext = createContext();

export const useWarranty = () => {
  return useContext(WarrantyContext);
};

export const WarrantyProvider = ({ children }) => {
  const [warranties, setWarranties] = useState([]);

  return (
    <WarrantyContext.Provider value={{ warranties, setWarranties }}>
      {children}
    </WarrantyContext.Provider>
  );
};
