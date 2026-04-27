import { AddRounded } from "@mui/icons-material";
import { Button, Tooltip, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useState } from "react";
import SideBarDrawer from "./ComponentsSideBar/SideBarDrawer";

export default function OpenDrawer({
  MAX_COMPONENTS,
  currentCount,
  smallButton = true,
  disable,
}) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [componentType, setComponentType] = useState(null);
  const [componentCreateData, setComponentCreateData] = useState(null);

  const handleDrawer = () => {
    if (!open) {
      setComponentType(null);
      setComponentCreateData(null);
    }
    setOpen((prev) => !prev);
  };
  return (
    <>
      {smallButton ? (
        <Tooltip title={disable ? "Reached limit (12)" : ""} placement="top">
          <Button
            // disabled={disable}
            // size="small"
            onClick={() => {
              if (disable) {
                return;
              }
              handleDrawer();
            }}
            startIcon={
              <AddRounded
                fontSize="medium"
                sx={{ color: theme.palette.primary.contrastText }}
              />
            }
            variant="contained"
            disableElevation
            sx={{
              borderRadius: "10px",
              height: "35px",
              px: 1.5,
              textTransform: "none",
              cursor: disable ? "default" : "pointer",
              backgroundColor: disable
                ? theme.palette.grey[300]
                : theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              "&:hover": {
                backgroundColor: disable
                  ? theme.palette.grey[300]
                  : theme.palette.primary.dark,
              },
              transition: "all 0.2s ease",
            }}
          >
            Component
            {currentCount ? ` ( ${currentCount} / ${MAX_COMPONENTS} )` : ""}
          </Button>
        </Tooltip>
      ) : (
        <Button
          onClick={handleDrawer}
          variant="contained"
          startIcon={
            <AddRounded sx={{ color: theme.palette.primary.contrastText }} />
          }
          disableElevation
          sx={{
            borderRadius: "10px",
            px: 2,
            py: 1.2,
            textTransform: "none",
            fontSize: "0.90rem",
            fontWeight: 500,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            boxShadow: `0 4px 14px 0 ${alpha(theme.palette.primary.main, 0.39)}`,
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
              boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.45)}`,
              transform: "translateY(-1px)",
            },
            transition: "all 0.2s ease",
          }}
        >
          Add Component{" "}
        </Button>
      )}
      <SideBarDrawer
        componentType={componentType}
        setComponentType={setComponentType}
        open={open}
        setComponentCreateData={setComponentCreateData}
        componentCreateData={componentCreateData}
        handleDrawer={handleDrawer}
      />
    </>
  );
}
