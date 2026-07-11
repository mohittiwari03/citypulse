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
      className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 transition-all ${
        pathname === to
          ? "bg-white/15 text-white"
          : "text-white/60 hover:text-white hover:bg-white/10"
      }`}
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
          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">
            CityPulse
          </span>
        </Link>

        {/* Nav */}
        <div className="flex items-center gap-1 ">
          {navLink("/", "Dashboard", null)}
          {navLink("/history", "History", <History size={14} />)}

          {user ? (
            <div className="flex items-center gap-2 ml-3 pl-3 border-l border-white/10">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
                  <User size={13} className="text-white" />
                </div>
                <span className="hidden sm:block text-xs font-medium text-white/80">{user.name}</span>
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
      </div>
    </nav>
  );
}
