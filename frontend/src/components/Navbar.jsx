import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Zap, History, LogOut, User, LogIn, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate     = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    toast.success("Logged out");
    navigate("/login");
  }

  const closeMenu = () => setMenuOpen(false);

  const navLinkClass = (to) =>
    `px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all ${
      pathname === to ? "bg-gold/10 text-gold" : "text-muted hover:text-ink"
    }`;

  const navLink = (to, label, icon) => (
    <Link
      to={to}
      className={navLinkClass(to)}
    >
      {icon}
      {label}
    </Link>
  );

  return (
    <nav
      className="fixed top-0 left-0 mt-3 mx-4 rounded-2xl right-0 z-50 backdrop-blur-sm backdrop-brightness-150 bg-white/15"
      style={{
        background: "rgba(13,18,32,0.3)",
        border:"1px solid rgba(255,255,255,0.06)",
        borderBottom: "2px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
            <Zap size={16} className="text-bg" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">
            CityPulse
          </span>
        </Link>

        {/* Nav */}
        <div className="hidden sm:flex items-center gap-1">
          {navLink("/", "Dashboard", null)}
          {navLink("/history", "History", <History size={14} />)}

          {user ? (
            <div className="flex items-center gap-2 ml-3 pl-3 border-l border-white/10">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
                  <User size={13} className="text-white" />
                </div>
                <span className="hidden sm:block text-xs">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 rounded-xl text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-all"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-3 pl-3 border-l border-white/10">
              <Link
                to="/login"
                className="border border-white/10 text-white/90 px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/5 transition-all duration-150 active:scale-75"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] text-white font-semibold py-2 px-4 text-sm rounded-xl transition-all ease-in-out duration-350 active:scale-75"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-2 rounded-xl text-muted hover:text-ink hover:bg-surface transition-all"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-border bg-bg/95 backdrop-blur-md px-4 py-4 flex flex-col gap-2 animate-fade-up">
          <Link
            to="/"
            onClick={closeMenu}
            className={navLinkClass("/")}
          >
            Dashboard
          </Link>
          <Link
            to="/history"
            onClick={closeMenu}
            className={navLinkClass("/history")}
          >
            <History size={14} />History
          </Link>

          <div className="border-t border-border pt-3 mt-1">
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted font-mono">
                  <div className="w-7 h-7 rounded-lg bg-gold/20 border border-gold/30 flex items-center justify-center">
                    <User size={13} className="text-gold" />
                  </div>
                  <span className="text-xs">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm font-semibold text-red-400 hover:bg-red-400/10 px-3 py-2 rounded-xl transition-all"
                >
                  <LogOut size={14} /> Sign out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink transition-colors px-3 py-2.5 rounded-xl border border-border"
                >
                  <LogIn size={14} /> Sign in
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="btn-gold text-center py-2.5 text-sm"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
