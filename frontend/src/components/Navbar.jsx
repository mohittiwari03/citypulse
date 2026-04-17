import { Link, useLocation, useNavigate } from "react-router-dom";
import { Zap, History, LogOut, User, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate     = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    toast.success("Logged out");
    navigate("/login");
  }

  const navLink = (to, label, icon) => (
    <Link
      to={to}
      className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all ${
        pathname === to ? "bg-gold/10 text-gold" : "text-muted hover:text-ink"
      }`}
    >
      {icon}
      {label}
    </Link>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
            <Zap size={16} className="text-bg" />
          </div>
          <span className="text-lg font-extrabold tracking-tight">
            City<span className="text-gold">Pulse</span>
          </span>
        </Link>

        {/* Nav */}
        <div className="flex items-center gap-1">
          {navLink("/", "Dashboard", null)}
          {navLink("/history", "History", <History size={14} />)}

          {user ? (
            <div className="flex items-center gap-2 ml-3 pl-3 border-l border-border">
              <div className="flex items-center gap-2 text-sm text-muted font-mono">
                <div className="w-7 h-7 rounded-lg bg-gold/20 border border-gold/30 flex items-center justify-center">
                  <User size={13} className="text-gold" />
                </div>
                <span className="hidden sm:block text-xs">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 rounded-xl text-muted hover:text-red-400 hover:bg-red-400/10 transition-all"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-3 pl-3 border-l border-border">
              <Link
                to="/login"
                className="flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink transition-colors px-3 py-2 rounded-xl"
              >
                <LogIn size={14} />
                Sign in
              </Link>
              <Link to="/register" className="btn-gold py-2 px-4 text-sm">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
