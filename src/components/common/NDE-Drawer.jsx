import React from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme,
  Slide,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CommonButton from "./NDE-Button";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} timeout={{ enter: 500, exit: 300 }} />;
});

const CommonDrawer = ({
  open,
  onClose,
  anchor = "right",
  title,
  children,
  width = 350,
  topWidth = 600,
  height,
  actions = [],
  disableAnimation = false,
  loading = false,
  actionsJustify = "flex-end",
  p = 1
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Determine bounce direction
  const bounceKeyframes = {
    right: {
      "0%": { transform: "translateX(100%)" },
      "60%": { transform: "translateX(-15px)" },
      "80%": { transform: "translateX(10px)" },
      "100%": { transform: "translateX(0)" },
    },
    left: {
      "0%": { transform: "translateX(-100%)" },
      "60%": { transform: "translateX(15px)" },
      "80%": { transform: "translateX(-10px)" },
      "100%": { transform: "translateX(0)" },
    },
    top: {
      "0%": { transform: "translateY(-100%)" },
      "60%": { transform: "translateY(15px)" },
      "80%": { transform: "translateY(-10px)" },
      "100%": { transform: "translateY(0)" },
    },
    bottom: {
      "0%": { transform: "translateY(100%)" },
      "60%": { transform: "translateY(-15px)" },
      "80%": { transform: "translateY(10px)" },
      "100%": { transform: "translateY(0)" },
    },
  };

  return (
    <Drawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      keepMounted
      PaperProps={{
        sx: {
          width: anchor === "top" || anchor === "bottom" ? (isSmallScreen ? "100%" : topWidth) : width,
          height: anchor === "top" || anchor === "bottom" ? height : "100%",
          mx: anchor === "top" || anchor === "bottom" ? "auto" : undefined,
          borderRadius:
            anchor === "top"
              ? "0 0 12px 12px"
              : anchor === "bottom"
                ? "12px 12px 0 0"
                : "0",
          animation: disableAnimation
            ? "none"
            : open
              ? `bounceIn-${anchor} 0.7s ease-out`
              : "none",
          // Dynamically create keyframes for each anchor
          [`@keyframes bounceIn-${anchor}`]: bounceKeyframes[anchor],
        },
      }}
    >
      <Box
        sx={{
          p:1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {title && (
          <><Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid #D1D1DB",
              pb: 0.5,
            }}
          >
            <Typography variant="h6" ml={1}>{title}</Typography>
            <IconButton onClick={onClose} color="error">
              <CloseIcon sx={{ color: 'error.main' }} />
            </IconButton>
          </Box>
              {/* <Divider /> */}
          </>
        )}
        <Box sx={{ flex: 1, overflowY: "auto", py: 1 ,p,mt:1}}>{children}</Box>

        {actions.length > 0 && (
          <Box
            sx={{
              position: "sticky",
              bottom: 0,
              // backgroundColor: "background.paper",
              borderTop: "1px solid #D1D1DB",
              pt: 1,
              display: "flex",
              justifyContent: actionsJustify,
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            {actions.map((btn, index) => (
              <CommonButton
                key={index}
                variant={btn.variant || "contained"}
                color={btn.color || "primary"}
                onClick={btn.onClick || (() => { })}
                label={btn.label}
                loading={btn.loading ?? loading}
                startIcon={null}
                disabled={btn.disabled}
                sx={btn.sx} 
              />
            ))}
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default CommonDrawer;
