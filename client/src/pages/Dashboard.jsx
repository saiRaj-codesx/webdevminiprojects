import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [myListings, setMyListings] = useState([]);
  const [borrowedItems, setBorrowedItems] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [listingsRes, rentalsRes] = await Promise.all([
          API.get("/tools/my-listings"),
          API.get("/rentals/my-rentals"),
        ]);

        setMyListings(Array.isArray(listingsRes.data) ? listingsRes.data : []);

        // Handle the object structure returned by your rentalController
        setBorrowedItems(rentalsRes.data.borrowedItems || []);
        setIncomingRequests(rentalsRes.data.incomingRequests || []);
      } catch (err) {
        console.error("Error loading dashboard data:", err.response || err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  const handleDeleteTool = async (toolId) => {
    if (!toolId) {
      console.error("Delete failed: Tool ID is missing");
      return;
    }

    try {
      await API.delete(`/tools/${toolId}`);

      // Instantly update the state to remove the tool from your listings view
      setMyListings((prevListings) =>
        prevListings.filter((tool) => tool.id !== toolId),
      );
    } catch (err) {
      console.error("Delete request failed:", err.response || err);
      alert(err.response?.data?.message || "Failed to delete tool.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Dashboard
      </h1>

      {/* Counts Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500">Posted Listings</p>
          <p className="text-2xl font-bold text-blue-600">
            {myListings.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500">Borrowed Items</p>
          <p className="text-2xl font-bold text-green-600">
            {borrowedItems.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500">Incoming Requests</p>
          <p className="text-2xl font-bold text-purple-600">
            {incomingRequests.length}
          </p>
        </div>
      </div>

      {/* My Listings Section */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            My Tool Listings
          </h2>
          <button
            onClick={() => navigate("/add-tool")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-blue-700 transition"
          >
            + Add New
          </button>
        </div>

        {myListings.length === 0 ? (
          <p className="text-sm text-gray-400 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
            You haven't listed any tools yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myListings.map((tool) => (
              <div
                key={tool.id}
                className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-gray-100">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-green-600 font-semibold">
                    ₹{tool.dailyRate} / day
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/edit-tool/${tool.id}`)}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-xs font-medium hover:bg-gray-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTool(tool.id)}
                    className="px-3 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-xs font-medium hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Borrowed Items Section */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
          My Borrowed Rentals
        </h2>
        {borrowedItems.length === 0 ? (
          <p className="text-sm text-gray-400 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
            You have no active rentals right now.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {borrowedItems.map((rental) => (
              <div
                key={rental.id}
                className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <h3 className="font-bold text-gray-800 dark:text-gray-100">
                  {rental.tool?.title || "Tool"}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Status:{" "}
                  <span className="font-semibold text-blue-500">
                    {rental.status}
                  </span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  From {rental.startDate} to {rental.endDate}
                </p>
                <p className="text-sm font-extrabold text-green-600 mt-2">
                  Total: ₹{rental.totalPrice}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
