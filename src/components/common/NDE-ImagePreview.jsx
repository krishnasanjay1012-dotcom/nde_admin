import React from "react";
import { Dialog, DialogContent, IconButton, Box, Typography,Slide } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} timeout={{ enter: 500, exit: 300 }} />;
});
const CommonImagePreview = ({
  open,
  onClose,
  src,
  alt = "Preview",
  title = "",              
  width = "600px",
  height = "500px",
  bgcolor = "primary.contrastText",
  borderRadius = 4,
  disableAnimation = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      TransitionComponent={Transition}
      keepMounted
      PaperProps={{
        sx: {
          width: width,
          height: height,
          backgroundColor: bgcolor,
          borderRadius: borderRadius,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column", 
          justifyContent: "center",
          alignItems: "center",
          animation: disableAnimation
            ? "none"
            : open
            ? "bounceIn 0.7s ease-out"
            : "none",
          "@keyframes bounceIn": {
            "0%": { transform: "translateY(100%)" },
            "60%": { transform: "translateY(-15px)" },
            "80%": { transform: "translateY(10px)" },
            "100%": { transform: "translateY(0)" },
          },
        },
      }}
    >
      {/* Close Button */}
      <IconButton
        onClick={onClose}
        color="error"
        sx={{
          position: "absolute",
          top: 14,
          right: 8,
          color: "error.main",
          zIndex: 1,
        }}
      >
        <CloseIcon sx={{color:'error.main'}} />
      </IconButton>


        <Typography
          variant="h4"
          sx={{
            mt: 4,
            width: "90%",
          }}
        >
          {title || "Preview"}
        </Typography>

      {/* Image */}
      <DialogContent
        sx={{
          p: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 1, 
        }}
      >
        <Box
          component="img"
          src={src}
          alt={alt}
          sx={{
            width: "85%",
            height: "85%",
            borderRadius: borderRadius,
            objectFit: "contain",
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CommonImagePreview;
