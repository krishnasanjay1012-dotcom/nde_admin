import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import Box from "@mui/material/Box";

import CloseIcon from "@mui/icons-material/Close";

const Transition = React.forwardRef(function Transition(props, ref) {
  return (
    <Slide
      direction="up"
      ref={ref}
      {...props}
      timeout={{ enter: 500, exit: 300 }}
    />
  );
});

const CommonDialog = ({
  open,
  onClose,
  title = "Dialog Title",
  children,
  onSubmit,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  maxWidth = "sm",
  fullWidth = true,
  width = 600,
  hideSubmit = false,
  hideCancle = false,
  sx = {},
  disableAnimation = false,
  loading,
  submitDisabled,
  noTitle = false,
  buttonWidth=90,

  ...props
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      TransitionComponent={Transition}
      keepMounted
      sx={{
        borderRadius: "18px",
        "& .MuiPaper-root": {
          margin: 0,
          width: width || "auto",
          borderRadius: "18px",
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
        ...sx,
      }}
      {...props}
    >
      {/* Title with close button */}
      {
        !noTitle && <DialogTitle
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontWeight: 600,
            pb: 0,
            mt: -1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Typography variant="h6">{title}</Typography>
            <IconButton onClick={onClose} size="large" color="error">
              <CloseIcon fontSize="medium" sx={{ color: "error.main" }} />
            </IconButton>
          </Box>
        </DialogTitle>
      }


      {/* Content */}
      <DialogContent dividers>{children}</DialogContent>

      {/* Actions */}
      <DialogActions sx={{ mr: 2 }}>
        {!hideCancle && (
          <Button
            onClick={onClose}
            variant="outlined"
            color="primary.extraLight"
            sx={{ height: 40, width: buttonWidth, borderRadius: 2 }}
          >
            {cancelLabel}
          </Button>
        )}
        {!hideSubmit && (
          <Button
            onClick={onSubmit}
            disabled={submitDisabled || loading}
            variant="contained"
            color="primary"
            type="submit"
            sx={{
              height: 40,
              width: buttonWidth,
              borderRadius: 2,
              "&.Mui-disabled": {
                backgroundColor: "action.disabledBackground",
                color: "text.disabled",
                "&.Mui-disabled": {
                  backgroundColor: "action.disabledBackground",
                  color: "text.disabled",
                  cursor: "not-allowed",
                },
              },
            }}
          >
            {submitLabel}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CommonDialog;
