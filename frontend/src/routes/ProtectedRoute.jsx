import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);

  // Still checking token
  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  // Not logged in
  if (user === null) {
    return <Navigate to="/login" replace />;
  }

  // Logged in
  return children;
}

export default ProtectedRoute;
