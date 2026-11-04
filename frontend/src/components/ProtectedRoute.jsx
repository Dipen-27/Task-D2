import { Navigate } from "react-router-dom";
import { useUser } from "../context/Usercontext";

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useUser();

  // Wait until Firebase finishes checking authentication.
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Checking authentication...</p>
      </div>
    );
  }

  // Redirect visitors to the login page.
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Allow authenticated users.
  return children;
}

export default ProtectedRoute;