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
          position="top-right"
          toastOptions={{
            style: {
              background: "#0f1720",
              border: "1px solid #1e2d3d",
              color: "#c8d8e8",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "13px",
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
