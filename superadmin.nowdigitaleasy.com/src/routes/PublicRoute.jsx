import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getUserSession } from "../utils/session";
import NdeLoader from "../components/common/NDE-gif";

const PublicRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const { token } = getUserSession();
    setIsAuthenticated(!!token);
    setChecking(false); 
  }, []);

  if (checking) {
    return <NdeLoader />;
  }

  return isAuthenticated ? <Navigate to="/home" replace /> : children;
 };

export default PublicRoute;
