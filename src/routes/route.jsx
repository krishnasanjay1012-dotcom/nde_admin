// import { lazy } from "react";
// import {
//   RouterProvider,
//   createBrowserRouter,
//   Navigate,
// } from "react-router-dom";
// const PrivateRoute = lazy(() => import("./PrivateRoute"));
// const PublicRoute = lazy(() => import("./PublicRoute"));

// const Home = lazy(() => import("../pages/Home/Home"));
// const GlobalDashboard = lazy(
//   () => import("../pages/GlobalDashboard/GlobalDashboard"),
// );
// const Login = lazy(() => import("../pages/auth/Login"));
// const AdminList = lazy(() => import("../components/auth/AdminList"));

// const NotFound = lazy(() => import("../error/404-Not-found"));
// const Error500 = lazy(() => import("../error/Error500"));
// const NetworkError = lazy(() => import("../error/NetworkError"));
// const AccessDenied = lazy(() => import("../error/AccessDenied"));
// const MaintenancePage = lazy(() => import("../error/Under-Maintanance"));

// import { customerRoutes } from "./customerRoutes";
// import { salesRoutes } from "./salesRoutes";
// import { productRoutes } from "./productRoutes";
// import { paymentRoutes } from "./paymentRoutes";
// import { pricingRoutes } from "./pricingRoutes";
// import { reportRoutes } from "./reportRoutes";
// import { settingsRoutes } from "./settingsRoutes";
// import { purchasedRoutes } from "./purchasedRoute";
// import UserProfile from "../pages/settings/profile/User-Profile";
// import { accountsRoutes } from "./accountsRoutes";
// import { itemsRoutes } from "./itemRoutes";

// const router = createBrowserRouter([
//   {
//     path: "/login",
//     element: (
//       <PublicRoute>
//         <Login />
//       </PublicRoute>
//     ),
//   },
//   { path: "/maintenance", element: <MaintenancePage /> },
//   { path: "*", element: <NotFound /> },
//   { path: "/500", element: <Error500 /> },
//   { path: "/network-error", element: <NetworkError /> },
//   { path: "/access-denied", element: <AccessDenied /> },
//   { path: "/", element: <Navigate to="/home" replace /> },
//   {
//     path: "/",
//     element: <PrivateRoute />,
//     children: [
//       { path: "home", element: <GlobalDashboard /> },
//       { path: "admin", element: <AdminList /> },
//       { path: "user-profile", element: <UserProfile /> },
//       ...customerRoutes,
//       ...salesRoutes,
//       ...productRoutes,
//       ...paymentRoutes,
//       ...purchasedRoutes,
//       ...pricingRoutes,
//       ...reportRoutes,
//       ...settingsRoutes,
//       ...accountsRoutes,
//       ...itemsRoutes,
//     ],
//   },
// ]);

// export default function Router() {
//   return <RouterProvider router={router} />;
// }

import { lazy } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
const PrivateRoute = lazy(() => import("./PrivateRoute"));
const PublicRoute = lazy(() => import("./PublicRoute"));

const Home = lazy(() => import("../pages/Home/Home"));
const GlobalDashboard = lazy(
  () => import("../pages/GlobalDashboard/GlobalDashboard"),
);
const Login = lazy(() => import("../pages/auth/Login"));
const AdminList = lazy(() => import("../components/auth/AdminList"));

const NotFound = lazy(() => import("../error/404-Not-found"));
const Error500 = lazy(() => import("../error/Error500"));
const NetworkError = lazy(() => import("../error/NetworkError"));
const AccessDenied = lazy(() => import("../error/AccessDenied"));
const MaintenancePage = lazy(() => import("../error/Under-Maintanance"));

import { customerRoutes } from "./customerRoutes";
import { salesRoutes } from "./salesRoutes";
import { productRoutes } from "./productRoutes";
import { paymentRoutes } from "./paymentRoutes";
import { pricingRoutes } from "./pricingRoutes";
import { reportRoutes } from "./reportRoutes";
import { settingsRoutes } from "./settingsRoutes";
import { purchasedRoutes } from "./purchasedRoute";
import UserProfile from "../pages/settings/profile/User-Profile";
import { accountsRoutes } from "./accountsRoutes";
import { itemsRoutes } from "./itemRoutes";
import { UnsavedChangesProvider } from "../context/UnsavedChangesContext";

import { Outlet } from "react-router-dom";

const RootLayout = () => (
  <UnsavedChangesProvider>
    <Outlet />
  </UnsavedChangesProvider>
);

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/login",
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      { path: "/maintenance", element: <MaintenancePage /> },
      { path: "*", element: <NotFound /> },
      { path: "/500", element: <Error500 /> },
      { path: "/network-error", element: <NetworkError /> },
      { path: "/access-denied", element: <AccessDenied /> },
      { path: "/", element: <Navigate to="/home" replace /> },
      {
        path: "/",
        element: <PrivateRoute />,
        children: [
          { path: "home", element: <GlobalDashboard /> },
          { path: "admin", element: <AdminList /> },
          { path: "user-profile", element: <UserProfile /> },
          ...customerRoutes,
          ...salesRoutes,
          ...productRoutes,
          ...paymentRoutes,
          ...purchasedRoutes,
          ...pricingRoutes,
          ...reportRoutes,
          ...settingsRoutes,
          ...accountsRoutes,
          ...itemsRoutes,
        ],
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}

