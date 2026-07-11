import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster }    from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Navbar         from "./components/Navbar";
import Home           from "./pages/Home";
import History        from "./pages/History";
import Login          from "./pages/Login";
import Register       from "./pages/Register";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(0,0,0,0.06)",
              color: "#1A1F36",
              fontFamily: "'Inter', sans-serif",
              fontSize: "13px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              borderRadius: "12px",
            },
          }}
        />
        <Navbar />
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/history"   element={<History />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/register"  element={<Register />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
