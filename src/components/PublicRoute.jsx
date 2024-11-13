import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// A component to protect the SignIn and SignUp pages from logged-in users
const PublicRoute = ({ element: Component, restricted, ...rest }) => {
  // const { user, loading } = useAuth();
  // const location = useLocation();
  // if (loading) return <div>Loading...</div>;
  // // If user is logged in and tries to access the sign-in page, stay on the current page
  // if (user && location.pathname === "/sign-in") {
  //   return <Navigate to={location.state?.from || "/sign-in"} replace />;
  // }

  // // If user is not logged in, redirect to the sign-in page
  // return user ? <Component {...rest} /> : <Navigate to="/sign-in" replace />;
};

export default PublicRoute;
