import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap, User, Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Register() {
  const { register }  = useAuth();
  const navigate      = useNavigate();
  const [form, setForm]       = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [show, setShow]       = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success("Account created!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96
                        bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm relative">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gold flex items-center justify-center">
            <Zap size={18} className="text-bg" />
          </div>
          <span className="text-2xl font-extrabold">
            City<span className="text-gold">Pulse</span>
          </span>
        </div>

        <div className="card p-8">
          <h1 className="text-xl font-extrabold text-ink mb-1">Create account</h1>
          <p className="text-sm text-muted mb-6">Start exploring your city</p>

          <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input name="name" type="text" placeholder="Full name"
                value={form.name} onChange={handle} required
                className="input-field pl-10" />
            </div>

            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input name="email" type="email" placeholder="Email address"
                value={form.email} onChange={handle} required
                className="input-field pl-10" />
            </div>

            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input name="password" type={show ? "text" : "password"} placeholder="Password (min 6 chars)"
                value={form.password} onChange={handle} required
                className="input-field pl-10 pr-10" />
              <button type="button" onClick={() => setShow(!show)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors">
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            <button type="submit" disabled={loading}
              className="btn-gold w-full flex items-center justify-center gap-2 h-11 mt-1">
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-gold hover:underline font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
