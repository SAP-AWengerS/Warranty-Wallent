import React, { useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Login from "../Pages/Auth/Login/Login";
import { UserContext } from "../App";

const AppRoutes = () => {
  const { user } = useContext(UserContext);

  return (
    <BrowserRouter>
      <Routes>
        {user ? (
          <Route path="/*" element={<Home />} />
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<Login />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
