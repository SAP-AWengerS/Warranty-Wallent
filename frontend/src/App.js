import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import React, { useState } from "react";
import "./App.css";
import Routes from "./Routes/Routes";
import { ToastProvider } from "./Components/ToastContext/ToastContext";
import { WarrantyProvider } from "./Components/WarrantyContext/WarrantyContext";

import { GoogleOAuthProvider } from "@react-oauth/google";

export const UserContext = React.createContext();

function App() {
  const [user, setUser] = useState();

  return (
    <div className="d-flex App">
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_URL}>
        <UserContext.Provider value={{ user, setUser }}>
          <ToastProvider>
            <WarrantyProvider>
              <Routes />
            </WarrantyProvider>
          </ToastProvider>
        </UserContext.Provider>
      </GoogleOAuthProvider>
    </div>
  );
}

export default App;
