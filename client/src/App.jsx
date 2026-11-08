import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddTool from "./pages/AddTool";
import Dashboard from "./pages/Dashboard";
import ToolDetail from "./pages/ToolDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
          <Navbar />
          <div className="container mx-auto p-4">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes (Require Login) */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tools/:id"
                element={
                  <ProtectedRoute>
                    <ToolDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-tool"
                element={
                  <ProtectedRoute>
                    <AddTool />
                  </ProtectedRoute>
                }
              />
              {/* ADD THIS EDIT ROUTE BELOW */}
              <Route
                path="/edit-tool/:id"
                element={
                  <ProtectedRoute>
                    <AddTool />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
