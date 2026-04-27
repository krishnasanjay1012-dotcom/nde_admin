import { useState, useEffect, lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import { getUserSession } from "../utils/session";
import NdeLoader from "../components/common/NDE-gif";

const MainLayout = lazy(() => import("../layouts/MainLayout"));

const PrivateRoute = () => {
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

  return isAuthenticated ? (
    <Suspense fallback={<NdeLoader />}>
      <MainLayout />
    </Suspense>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoute;




// import React from "react";
// import { Navigate } from "react-router-dom";
// import MainLayout from "../layouts/MainLayout";
// import { getUserSession, isTokenValid } from "../utils/session";

// const PrivateRoute = () => {
//   const { token } = getUserSession();
//   const isAuthenticated = token && isTokenValid(token);

//   return isAuthenticated ? <MainLayout /> : <Navigate to="/login" replace />;
// };

// export default PrivateRoute;
