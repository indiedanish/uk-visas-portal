// src/components/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const { exp } = jwtDecode(token);
    // Check if the current time is past the token expiration time
    return Date.now() >= exp * 1000;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};

const PrivateRoute = ({ element: Component, ...rest }) => {
  const { user, loading, token } = useAuth();

  console.log("token: ", token?.access?.token);

  if (loading)
    return (
      <div className="d-flex w-100 h-100vh align-items-center justify-content-center">
        <img
          className="w-200-px ml-2 "
          src="/assets/images/preloader/Loader-2.svg"
        ></img>
      </div>
    );

  return !isTokenExpired(token?.access?.token) ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/sign-in" replace />
  );
};

export default PrivateRoute;
