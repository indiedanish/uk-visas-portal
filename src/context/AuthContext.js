// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create AuthContext
const AuthContext = createContext();

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component to wrap around the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching user data (replace with actual auth check)
    const fetchUser = async () => {
      // Simulate delay
      setLoading(true);
      setTimeout(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("tokens");

        setToken(storedToken ? JSON.parse(storedToken) : null);
        setUser(storedUser ? JSON.parse(storedUser) : null);
        setLoading(false);
      }, 1000);
    };
    fetchUser();
  }, []);

  const login = (userData, tokens) => {
    setUser(userData);
    setToken(tokens);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("tokens", JSON.stringify(tokens));

  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("tokens");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
