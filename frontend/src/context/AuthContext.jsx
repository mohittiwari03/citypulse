import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

let baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
if (baseURL !== "http://localhost:5000/api" && !baseURL.endsWith("/api")) {
  baseURL = baseURL.replace(/\/$/, "") + "/api";
}
const API = `${baseURL}/auth`;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  // useEffect(() => {
  //   const stored = localStorage.getItem("citypulse_user");
  //   if (stored) setUser(JSON.parse(stored));
  //   setLoading(false);
  // }, []);

    // Check login status from backend
  useEffect(() => {
    const checkUser = async () => {
      try {
        const stored = localStorage.getItem("citypulse_user");
        if (!stored) {
          setLoading(false);
          return;
        }
        const userStored = JSON.parse(stored);
        const { data } = await axios.get(`${API}/me`, {
          headers: { Authorization: `Bearer ${userStored.token}` }
        });
        setUser({ ...data, token: userStored.token });
      } catch {
        setUser(null);
        localStorage.removeItem("citypulse_user");
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const register = async (name, email, password) => {
    const { data } = await axios.post(`${API}/register`, {
      name,
      email,
      password,
    });
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

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
