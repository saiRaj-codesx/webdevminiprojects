import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

const CATEGORIES = [
  "Power Tools",
  "Hand Tools",
  "Gardening",
  "Painting",
  "Other",
];
export default function AddTool() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Power Tools");
  const [dailyRate, setDailyRate] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [existingImageURL, setExistingImageURL] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams(); // Check if an ID exists in the route
  const isEditing = Boolean(id);

  // Fetch tool details if we are in Edit mode
  useEffect(() => {
    if (isEditing) {
      const fetchToolDetails = async () => {
        try {
          setLoading(true);
          const res = await API.get(`/tools/${id}`);
          setTitle(res.data.title || "");
          setDescription(res.data.description || "");
          setCategory(res.data.category || "Power Tools");
          setDailyRate(res.data.dailyRate || "");
          setLocation(res.data.location || "");
          setExistingImageURL(res.data.imageURL || "");
        } catch (err) {
          console.error("Failed to load tool for editing:", err);
          setError("Could not load tool details for editing.");
        } finally {
          setLoading(false);
        }
      };
      fetchToolDetails();
    }
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("dailyRate", dailyRate);
      formData.append("location", location);

      if (image) {
        formData.append("image", image);
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      if (isEditing) {
        await API.put(`/tools/${id}`, formData, config);
      } else {
        await API.post("/tools", formData, config);
      }

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save tool. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 mb-16 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        {isEditing ? "Edit Tool Listing" : "List a New Tool"}
      </h2>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-lg mb-6 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
            Tool Title *
          </label>
          <input
            type="text"
            placeholder="e.g. Cordless Hammer Drill"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 text-gray-900 dark:text-gray-100 transition"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 text-gray-900 dark:text-gray-100 transition"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
              Daily Rate (₹) *
            </label>
            <input
              type="number"
              placeholder="e.g. 250"
              value={dailyRate}
              onChange={(e) => setDailyRate(e.target.value)}
              required
              min="0"
              className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 text-gray-900 dark:text-gray-100 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
            Location / Area *
          </label>
          <input
            type="text"
            placeholder="e.g. Andheri East, Mumbai"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 text-gray-900 dark:text-gray-100 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
            Description *
          </label>
          <textarea
            placeholder="Describe the condition, specifications, or included accessories..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 text-gray-900 dark:text-gray-100 transition resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
            Tool Image
          </label>
          {existingImageURL && !image && (
            <div className="mb-2">
              <img
                src={`http://localhost:5000${existingImageURL}`}
                alt="Current tool"
                className="h-20 w-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700 mb-1"
              />
              <p className="text-xs text-gray-400">
                Current image (upload a new file to replace)
              </p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full text-xs text-gray-500 dark:text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 dark:file:bg-gray-900 dark:file:text-blue-400 hover:file:bg-blue-100 cursor-pointer"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 font-semibold text-sm transition shadow-sm mt-2 disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : isEditing
              ? "Update Tool Listing"
              : "Publish Tool Listing"}
        </button>
      </form>
    </div>
  );
}
