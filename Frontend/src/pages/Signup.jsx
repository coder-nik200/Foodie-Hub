import { Lock, Mail, User, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useUser } from "../context/useContext";

const SignupPage = () => {
  const { register } = useUser();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!acceptedTerms) {
      toast.error("Please accept Terms & Conditions");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match ❌");
      return;
    }

    try {
      setLoading(true);

      await register(formData.name, formData.email, formData.password);

      toast.success("Account created successfully 🎉");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
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
            Create Account
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* NAME */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-base font-semibold text-gray-700">
              <User size={18} /> Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base
              focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-base font-semibold text-gray-700">
              <Mail size={18} /> Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
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
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
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

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-base font-semibold text-gray-700">
              <Lock size={18} /> Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 text-base
                focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2
                rounded-lg p-1 text-slate-500
                hover:bg-orange-50 hover:text-orange-600 transition"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* TERMS */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              className="mt-1 accent-orange-500"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
            />
            <p className="text-sm text-gray-600">
              I agree to the{" "}
              <span className="text-orange-500 cursor-pointer hover:underline">
                Terms & Conditions
              </span>
            </p>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={!acceptedTerms || loading}
            className="flex items-center justify-center w-full rounded-xl 
            bg-orange-500 py-3 text-base font-semibold text-white 
            transition-all duration-300 
            hover:-translate-y-1 hover:bg-orange-600 hover:shadow-lg 
            active:translate-y-0 active:scale-95 
            disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          {/* LOGIN LINK */}
          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="font-semibold text-orange-500 hover:text-orange-600 hover:underline cursor-pointer transition"
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
