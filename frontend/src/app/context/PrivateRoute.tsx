import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user } = useAuth();

  // While checking auth state (user === null but still loading), show loading
  if (user === undefined) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          fontSize: "1.2rem",
        }}
      >
        Checking authentication...
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If logged in, render the route
  return <>{children}</>;
};

export default PrivateRoute;
