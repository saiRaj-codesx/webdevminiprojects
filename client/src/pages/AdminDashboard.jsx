import { useState, useEffect } from "react";
import API from "../services/api";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("tools");
  const [tools, setTools] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [confirmDeleteToolId, setConfirmDeleteToolId] = useState(null);
  const [confirmDeleteUserId, setConfirmDeleteUserId] = useState(null);

  // Fetch all tools and users on mount

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetching all tools and users (ensure your backend has these endpoints)
      const [toolsRes, usersRes] = await Promise.all([
        API.get("/admin/tools"),
        API.get("/admin/users").catch(() => ({ data: [] })), // Fallback if user route differs
      ]);

      setTools(toolsRes.data || []);
      setUsers(usersRes.data || []);
    } catch (err) {
      console.error("Failed to fetch admin data:", err);
      setError(
        "Failed to load admin data. Make sure you have admin privileges.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteTool = async (id) => {
    // 1. Reset alert messages before starting request
    setError("");
    setSuccessMessage("");

    try {
      // 2. Perform backend API delete call
      await API.delete(`/admin/tools/${id}`);

      // 3. Remove the deleted tool from local state
      setTools((prevTools) => prevTools.filter((tool) => tool.id !== id));

      // 4. Set success message and clear after 3 seconds
      setSuccessMessage("Tool deleted successfully.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.response?.data?.message || "Failed to delete tool.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      setSuccessMessage("User deleted successfully.");
      setConfirmDeleteUserId(null);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 mb-16 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Admin Control Panel
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Platform-wide oversight and moderation dashboard
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("tools")}
            className={`px-5 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === "tools"
                ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            Manage Tools ({tools.length})
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-5 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === "users"
                ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            Manage Users ({users.length})
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-xs font-medium">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 p-4 rounded-xl mb-6 text-xs font-medium">
          {successMessage}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-gray-500 dark:text-gray-400 text-sm">
          Loading platform data...
        </div>
      ) : (
        <>
          {/* TOOLS TAB */}
          {activeTab === "tools" && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  All Platform Tool Listings
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-400 text-[11px] uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                      <th className="p-4 font-semibold">Tool Title</th>
                      <th className="p-4 font-semibold">Category</th>
                      <th className="p-4 font-semibold">Daily Rate</th>
                      <th className="p-4 font-semibold">Location</th>
                      <th className="p-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                    {tools.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="p-6 text-center text-gray-400"
                        >
                          No tool listings found.
                        </td>
                      </tr>
                    ) : (
                      tools.map((tool) => (
                        <tr
                          key={tool.id}
                          className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition"
                        >
                          <td className="p-4 font-medium text-gray-900 dark:text-gray-100">
                            {tool.title}
                          </td>
                          <td className="p-4 text-gray-600 dark:text-gray-300">
                            {tool.category}
                          </td>
                          <td className="p-4 text-gray-600 dark:text-gray-300">
                            ₹{tool.dailyRate} / day
                          </td>
                          <td className="p-4 text-gray-600 dark:text-gray-300">
                            {tool.location}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDeleteTool(tool.id)}
                              className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-100 transition"
                            >
                              Delete Listing
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === "users" && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  Registered Platform Users
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-400 text-[11px] uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                      <th className="p-4 font-semibold">Name</th>
                      <th className="p-4 font-semibold">Email</th>
                      <th className="p-4 font-semibold">Role</th>
                      <th className="p-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                    {users.length === 0 ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="p-6 text-center text-gray-400"
                        >
                          No users found or endpoint not configured yet.
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition"
                        >
                          <td className="p-4 font-medium text-gray-900 dark:text-gray-100">
                            {user.name}
                          </td>
                          <td className="p-4 text-gray-600 dark:text-gray-300">
                            {user.email}
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold ${
                                user.role === "admin" || user.role === "Admin"
                                  ? "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                                  : "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-100 transition"
                            >
                              Remove User
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
