import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  // Dark mode state management
  const [isDark, setIsDark] = useState(() => {
    return (
      localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <nav className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white p-4 shadow-md transition-colors duration-200">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600 dark:text-blue-400"
        >
          ToolX
        </Link>
        <div className="flex gap-4 items-center">
          <Link to="/" className="hover:text-blue-500 dark:hover:text-blue-300">
            Home
          </Link>

          {user ? (
            <>
              <Link
                to="/add-tool"
                className="hover:text-blue-500 dark:hover:text-blue-300"
              >
                Add Tool
              </Link>
              <Link
                to="/dashboard"
                className="hover:text-blue-500 dark:hover:text-blue-300"
              >
                Dashboard
              </Link>

              {user && user.role === "admin" && (
                <Link
                  to="/admin"
                  className="text-sm font-semibold bg-purple-600/20 text-purple-400 border border-purple-500/30 px-3 py-1.5 rounded-lg hover:bg-purple-600/30 transition"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={logout}
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-sm text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-blue-500 dark:hover:text-blue-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 text-sm text-white"
              >
                Register
              </Link>
            </>
          )}

          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Toggle Theme"
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </nav>
  );
}
