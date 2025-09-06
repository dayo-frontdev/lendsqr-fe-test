import type { JSX } from "react";
import { Navigate } from "react-router-dom";

interface ProtectRouteProps {
  children: JSX.Element;
}

const ProtectRoute = ({ children }: ProtectRouteProps) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  return isAuthenticated ? children : <Navigate to={"/Login"} replace />;
};

export default ProtectRoute;
