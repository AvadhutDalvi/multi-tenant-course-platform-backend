import { useState } from "react";
import { AuthContext } from "./AuthContextObject.js";

function parseToken(token) {
  const payload = token.split(".")[1];
  return JSON.parse(atob(payload));
}

function getInitialUser() {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  try {
    return parseToken(token);
  } catch (error) {
    console.error("Invalid token", error);
    localStorage.removeItem("token");
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser);

  const login = (token) => {
    localStorage.setItem("token", token);
    setUser(parseToken(token));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
