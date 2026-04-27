import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

const Transition = React.forwardRef(function Transition(props, ref) {
  return (
    <Slide
      direction="up"
      ref={ref}
      {...props}
      timeout={{ enter: 250, exit: 200 }}
    />
  );
});

const CommonDeleteModal = ({
  open,
  onClose,
  onConfirmDelete,
  deleting,
  itemType = "",
  title,
  disableAnimation = false,
  warningMessage = "Are you sure you want to delete this",
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={disableAnimation ? undefined : Transition}
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 1.5,
          width: 360,
          maxWidth: "90%",
          animation: disableAnimation
            ? "none"
            : open
            ? "bounceIn 0.5s ease-out"
            : "none",
          "@keyframes bounceIn": {
            "0%": { transform: "translateY(80%)" },
            "60%": { transform: "translateY(-10px)" },
            "100%": { transform: "translateY(0)" },
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: 600,
          fontSize: 16,
          color: "error.main",
          p: 1,
        }}
      >
        Delete {title}
      </DialogTitle>

      <DialogContent sx={{ py: 1 }}>
        <Tooltip title={itemType} arrow>
          <Typography
            sx={{
              textAlign: "center",
              fontSize: 14,
              maxWidth: 300,
              mx: "auto",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {warningMessage} <strong>{itemType}</strong>?
          </Typography>
        </Tooltip>
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: "center",
          gap: 1.5,
          pb: 1,
        }}
      >
        <Button
          variant="outlined"
          onClick={onClose}
          size="small"
          sx={{
            textTransform: "none",
            color: "#919191",
            borderRadius: "6px",
            height: 34,
            px: 2.5,
            border: "1px solid #919191",
            "&:hover": { border: "1px solid #919191" },
          }}
        >
          Cancel
        </Button>

        <Button
          disabled={deleting}
          onClick={onConfirmDelete}
          variant="contained"
          size="small"
          sx={{
            height: 34,
            px: 2.5,
            textTransform: "none",
            borderRadius: "6px",
            backgroundColor: deleting ? "#E4A9A9" : "error.main",
            color: "primary.contrastText",
            "&:hover": { backgroundColor: "error.main" },
            "&.Mui-disabled": { opacity: 0.6 },
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommonDeleteModal;