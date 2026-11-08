import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function ToolDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchTool = async () => {
      try {
        setLoading(true);
        console.log("Fetching tool details for ID from URL params:", id);

        const res = await API.get(`/tools/${id}`);
        console.log("Tool data received:", res.data);
        setTool(res.data);
      } catch (err) {
        console.error("Failed to load tool details:", err.response || err);
        setError(err.response?.data?.message || "Could not find tool details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTool();
    }
  }, [id]);

  // Calculate rental duration in days
  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const totalDays = calculateDays();
  const totalPrice = tool ? totalDays * tool.dailyRate : 0;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }
    if (totalDays <= 0) {
      setError("End date must be after start date.");
      return;
    }

    try {
      setBookingLoading(true);
      setError("");
      await API.post("/rentals", {
        toolId: tool?.id || tool?._id || id,
        startDate,
        endDate,
        totalPrice,
      });

      setSuccessMsg("Rental placed successfully!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      console.error("Rental error:", err);
      setError(err.response?.data?.message || "Failed to submit rental.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-gray-500 dark:text-gray-400 text-center font-medium">
        Loading tool details...
      </div>
    );
  }

  if (error && !tool) {
    return (
      <div className="max-w-md mx-auto mt-16 p-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-center">
        <p className="text-red-600 dark:text-red-400 font-semibold">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg text-xs font-semibold hover:bg-gray-900 transition"
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="p-12 text-red-500 text-center font-medium">
        Tool not found.
      </div>
    );
  }

  // Check if current logged-in user is the tool owner
  const isOwner =
    user && (user.id === tool.ownerId || user.id === tool.owner?.id);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
        {/* Tool Information */}
        <div>
          <div className="bg-gray-100 dark:bg-gray-900 h-64 rounded-xl flex items-center justify-center mb-6 overflow-hidden border border-gray-200 dark:border-gray-700">
            {tool.imageURL ? (
              <img
                src={`http://localhost:5000${tool.imageURL}`}
                alt={tool.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-gray-400 font-medium text-xs">
                No Image Available
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {tool.title}
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-full font-medium">
              {tool.category || "General"}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              📍 {tool.location || "Location not specified"}
            </span>
          </div>
          <p className="text-xl font-extrabold text-green-600 dark:text-green-400 mt-4">
            ₹{tool.dailyRate}{" "}
            <span className="text-xs font-normal text-gray-400">/ day</span>
          </p>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-4 leading-relaxed">
            {tool.description || "No description provided."}
          </p>
        </div>

        {/* Right Column: Owner Banner OR Rental Form */}
        <div className="border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 pt-6 md:pt-0 md:pl-6 flex flex-col justify-between">
          {isOwner ? (
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 p-6 rounded-xl text-center my-auto">
              <h3 className="text-lg font-bold text-blue-800 dark:text-blue-200 mb-2">
                Your Tool Listing
              </h3>
              <p className="text-sm text-blue-600 dark:text-blue-300 mb-6">
                You are the owner of this tool. You cannot rent your own
                listing.
              </p>
              <button
                onClick={() => navigate(`/dashboard`)}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition shadow-sm"
              >
                Manage in Dashboard
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Rent This Tool
              </h2>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 text-xs rounded-lg mb-4 font-medium">
                  {error}
                </div>
              )}
              {successMsg && (
                <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 p-3 text-xs rounded-lg mb-4 font-medium">
                  {successMsg}
                </div>
              )}

              <form
                onSubmit={handleBookingSubmit}
                className="flex flex-col gap-4"
              >
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3 rounded-xl text-sm outline-none focus:border-blue-500 text-gray-900 dark:text-gray-100 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3 rounded-xl text-sm outline-none focus:border-blue-500 text-gray-900 dark:text-gray-100 transition"
                    required
                  />
                </div>

                {/* Price Calculation Preview */}
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 mt-2">
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1 font-medium">
                    <span>Duration:</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">
                      {totalDays} Day(s)
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-gray-800 dark:text-gray-100 border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                    <span>Total Amount:</span>
                    <span className="text-green-600 dark:text-green-400">
                      ₹{totalPrice}
                    </span>
                  </div>
                </div>

                {user ? (
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="w-full bg-blue-600 text-white p-3 rounded-xl font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 transition shadow-sm mt-2"
                  >
                    {bookingLoading ? "Processing..." : "Confirm Rental"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="w-full bg-gray-800 text-white p-3 rounded-xl font-semibold text-sm hover:bg-gray-900 transition shadow-sm mt-2"
                  >
                    Log in to Rent
                  </button>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
