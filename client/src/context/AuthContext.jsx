import { createContext, useState } from "react";

export const AuthContext = createContext();

// Helper function to decode JWT payload on the frontend without extra libraries
const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const initialToken = localStorage.getItem("token") || "";
  const [token, setToken] = useState(initialToken);

  // Decode token to extract user details (id, role, etc.)
  const decodedToken = parseJwt(token);
  const user = token && decodedToken ? { ...decodedToken, token } : null;

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
