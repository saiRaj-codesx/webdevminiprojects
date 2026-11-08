import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const CATEGORIES = [
  "All",
  "Power Tools",
  "Hand Tools",
  "Gardening",
  "Painting",
];

export default function Home() {
  const [tools, setTools] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoading(true);
        const selectedCategory = category === "All" ? "" : category;
        const response = await API.get(
          `/tools?search=${search}&category=${selectedCategory}`,
        );
        setTools(response.data);
      } catch (err) {
        console.error("Error fetching tools:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, [search, category]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 dark:text-gray-100">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-8 mb-8 shadow-md">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Rent Tools for Any Project
        </h1>
        <p className="text-blue-100 mt-2 max-w-xl text-sm md:text-base">
          Find quality hardware, power tools, and equipment listed by verified
          local owners near you.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search tools by name or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 pl-4 pr-10 py-3 rounded-xl shadow-sm text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition text-gray-900 dark:text-gray-100"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-3.5 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {CATEGORIES.map((cat) => {
            const isActive =
              (category === "" && cat === "All") || category === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat === "All" ? "" : cat)}
                className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all ${
                  isActive
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tools Section */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-4 h-64 animate-pulse"
            >
              <div className="bg-gray-200 dark:bg-gray-700 h-36 rounded-lg mb-4"></div>
              <div className="bg-gray-200 dark:bg-gray-700 h-4 w-3/4 rounded mb-2"></div>
              <div className="bg-gray-200 dark:bg-gray-700 h-4 w-1/2 rounded"></div>
            </div>
          ))}
        </div>
      ) : tools.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-dashed dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-base font-medium">
            No tools match your criteria.
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
            Try resetting your search filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Tool Image Container */}
                <div className="bg-gray-100 dark:bg-gray-900 h-48 overflow-hidden relative border-b border-gray-100 dark:border-gray-700">
                  {tool.imageURL ? (
                    <img
                      src={`http://localhost:5000${tool.imageURL}`}
                      alt={tool.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium text-xs">
                      No Image Preview
                    </div>
                  )}
                  <span className="absolute top-3 right-3 text-xs bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-700 dark:text-gray-200 px-2.5 py-1 rounded-full font-medium border border-gray-200 dark:border-gray-700">
                    {tool.category || "General"}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {tool.title}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 line-clamp-2 leading-relaxed">
                    {tool.description || "No description provided."}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 flex items-center gap-1">
                    📍 {tool.location}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-4 pb-4 pt-2 border-t border-gray-50 dark:border-gray-700 flex items-center justify-between mt-2">
                <div>
                  <span className="text-xs text-gray-400 block font-medium">
                    Daily Rate
                  </span>
                  <span className="text-base font-extrabold text-green-600 dark:text-green-400">
                    ₹{tool.dailyRate}
                  </span>
                </div>
                <Link
                  to={`/tools/${tool.id}`}
                  className="bg-blue-600 text-white text-xs px-4 py-2.5 rounded-lg hover:bg-blue-700 font-semibold transition shadow-sm"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
