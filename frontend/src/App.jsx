import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster }    from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Navbar         from "./components/Navbar";
import Home           from "./pages/Home";
import History        from "./pages/History";
import Login          from "./pages/Login";
import Register       from "./pages/Register";
import { checkHealth } from "./services/api";
import { Loader2, ServerCrash, RefreshCw } from "lucide-react";

function ServerHealthGuard({ children }) {
  const [isServerUp, setIsServerUp] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Initial health check on mount
    checkHealth()
      .then(() => setIsServerUp(true))
      .catch(() => setIsServerUp(false));

    // Listen to custom api-server-down event dispatched by axios interceptor
    const handleServerDown = () => {
      setIsServerUp(false);
    };

    window.addEventListener("api-server-down", handleServerDown);
    return () => {
      window.removeEventListener("api-server-down", handleServerDown);
    };
  }, []);

  // Poll server status when it's down
  useEffect(() => {
    if (isServerUp) return;

    const interval = setInterval(() => {
      checkHealth()
        .then(() => {
          setIsServerUp(true);
          clearInterval(interval);
        })
        .catch(() => {
          // Still down
        });
    }, 4000);

    return () => clearInterval(interval);
  }, [isServerUp]);

  const handleManualRetry = () => {
    setIsChecking(true);
    checkHealth()
      .then(() => {
        setIsServerUp(true);
      })
      .catch(() => {
        // Still down
      })
      .finally(() => {
        setIsChecking(false);
      });
  };

  if (!isServerUp) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#030712] relative overflow-hidden select-none">
        {/* Soft glowing ambient orbs matching the global theme */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10%] w-[45%] h-[45%] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none" />
        
        <div className="card max-w-md w-full p-8 text-center flex flex-col items-center gap-6 animate-fade-up border border-white/10 bg-slate-900/40 backdrop-blur-xl">
          <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold animate-bounce">
            <ServerCrash size={32} />
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Connecting to Server</h1>
            <p className="text-sm text-white/60 leading-relaxed">
              Our free-tier backend server is spinning up or currently waking up from sleep. This usually takes around 30 seconds.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 w-full mt-2">
            <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold text-gold tracking-wide uppercase">Polling server status...</span>
          </div>

          <button
            onClick={handleManualRetry}
            disabled={isChecking}
            className="w-full btn-gold h-11 text-sm font-semibold flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {isChecking ? (
              <Loader2 size={16} className="animate-spin text-bg" />
            ) : (
              <RefreshCw size={16} className="text-bg" />
            )}
            <span className="text-bg">{isChecking ? "Checking..." : "Retry Connection"}</span>
          </button>
        </div>
      </div>
    );
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <ServerHealthGuard>
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
      </ServerHealthGuard>
    </AuthProvider>
  );
}
