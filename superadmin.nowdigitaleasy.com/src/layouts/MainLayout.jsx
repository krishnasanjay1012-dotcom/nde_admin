import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import { Outlet, useLocation } from "react-router-dom";
import DynamicTitle from "../utils/DynamicTitle";
import CommonPreloader from "../components/common/NDE-CommonPreloader";
import { useEffect, useState } from "react";

const MainLayout = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => setLoading(false), 500);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        // overflow: "hidden",
      }}
    >
      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(0, 0, 0, 0.5)"
                : "rgba(255, 255, 255, 0.7)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CommonPreloader
            loading={true}
            height={8}
            color="primary"
            position="center"
          />
        </Box>
      )}

      <Sidebar />
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <DynamicTitle />
        <Header />
        <Box
          sx={{
            backgroundColor: "background.paper",
            borderRadius: 2,
            flexGrow: 1,
            overflow: "hidden",
            m: 1,

            minHeight: 0,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
