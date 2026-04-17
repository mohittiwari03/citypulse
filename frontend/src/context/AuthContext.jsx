import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

const API = "http://localhost:5000/api/auth";

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const stored = localStorage.getItem("citypulse_user");
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const register = async (name, email, password) => {
    const { data } = await axios.post(`${API}/register`, { name, email, password });
    localStorage.setItem("citypulse_user", JSON.stringify(data));
    setUser(data);
    return data;
  };

  const login = async (email, password) => {
    const { data } = await axios.post(`${API}/login`, { email, password });
    localStorage.setItem("citypulse_user", JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("citypulse_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
