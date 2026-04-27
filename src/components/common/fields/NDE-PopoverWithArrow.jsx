import {
  Popover,
  IconButton,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import CommonButton from "../NDE-Button";
import CloseIcon from "@mui/icons-material/Close";
const CommonPopoverWithArrow = ({
  open,
  anchorEl,
  onClose,
  title = "Modal",
  children,
  confirmLabel = "Update",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  showFooter = true,
  popoverProps = {},
  width = 400,
}) => {
  const handleCancel = () => {
    if (onCancel) onCancel();
    else onClose?.();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          onClose?.(event, reason);
        }
      }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      PaperProps={{
        sx: {
          width,
          borderRadius: 2,
          boxShadow: 3,
          position: "relative",
          overflow: "visible",
          border: "1px solid #eee",
          "&::before": {
            content: '""',
            position: "absolute",
            top: -8,
            left: "12%",
            transform: "translateX(-50%) rotate(45deg)",
            width: 16,
            height: 16,
            bgcolor: "background.muted",
            zIndex: 0,
            borderTop: "1px solid #eee",
            borderLeft: "1px solid #eee",
          },
        },
      }}
      {...popoverProps}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 1,
          py: 1,
          borderBottom: "1px solid #eee",
          borderColor: "divider",
          bgcolor: 'background.muted'
        }}
      >
        <Typography variant="body1" fontSize={16}>
          {title}
        </Typography>

        <IconButton size="small" onClick={onClose} color="error">
          <CloseIcon fontSize="small" sx={{ color: "error.main" }} />
        </IconButton>
      </Box>

      <Box sx={{ px: 1, py: 1 }}>{children}</Box>

      {showFooter && (
        <>
          <Divider />
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              px: 1,
              py: 1,
              bgcolor: 'background.muted'
            }}
          >
            <CommonButton
              variant="contained"
              size="small"
              onClick={onConfirm}
              label={confirmLabel}
              startIcon={null}
            />

            <CommonButton
              variant="outlined"
              size="small"
              color="inherit"
              onClick={handleCancel}
              label={cancelLabel}
              startIcon={null}
            />
          </Box>
        </>
      )}
    </Popover>
  );
};

export default CommonPopoverWithArrow;
