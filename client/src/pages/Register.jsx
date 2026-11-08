import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", { name, email, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Create an Account
      </h2>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
            Full Name
          </label>
          <input
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 text-gray-900 dark:text-gray-100 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 text-gray-900 dark:text-gray-100 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 text-gray-900 dark:text-gray-100 transition"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 font-semibold text-sm transition shadow-sm mt-2"
        >
          Register
        </button>
      </form>

      <p className="text-sm text-gray-600 dark:text-gray-400 mt-6 text-center">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
