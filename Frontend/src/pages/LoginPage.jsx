import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/useContext";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useUser();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await login(formData.email, formData.password);

      toast.success("Login successful 🍔🎉");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl">
        {/* HEADER */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-gray-500 mt-2">Login to your Foodie-Hub account</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* EMAIL */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-base font-semibold text-gray-700">
              <Mail size={18} /> Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base
              focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-base font-semibold text-gray-700">
              <Lock size={18} /> Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 text-base
                focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2
                rounded-lg p-1 text-slate-500
                hover:bg-orange-50 hover:text-orange-600 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center w-full rounded-xl 
            bg-orange-500 py-3 text-base font-semibold text-white 
            transition-all duration-300 
            hover:-translate-y-1 hover:bg-orange-600 hover:shadow-lg 
            active:translate-y-0 active:scale-95 
            disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* FOOTER */}
        <div className="mt-8 text-center text-sm">
          <p className="text-gray-500">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="font-semibold text-orange-500 hover:text-orange-600 hover:underline cursor-pointer transition"
            >
              Sign up here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
