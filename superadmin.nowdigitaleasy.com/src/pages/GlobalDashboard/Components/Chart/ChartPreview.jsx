import { Close } from "@mui/icons-material";
import { Box, IconButton, Modal, Typography } from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",

  maxWidth: {
    xs: "90vw",
    sm: "98vw",
    md: "90vw",
    lg: "90vw",
  },
  minWidth: {
    xs: "90vw",
    sm: "98vw",
    md: "60vw",
    lg: "60vw",
  },

  minHeight: "55vh",
  maxHeight: "90vh",
  overflow: "auto",

  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
};

export default function ChartPreview({ child, open, setOpen }) {
  const handleClose = () => setOpen(false);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="chart-preview-modal"
      aria-describedby="chart-preview-content"
    >
      <Box sx={modalStyle}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            height: "60px",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            borderBottom: "1px solid",
            borderBottomColor: "divider",
          }}
        >
          <Typography sx={{ fontSize: "16px", fontWeight: 500 }}>
            Preview
          </Typography>
          <IconButton
            sx={{ width: "30px", height: "30px" }}
            onClick={handleClose}
          >
            <Close />
          </IconButton>
        </Box>

        <Box sx={{ height: "calc(100% - 60px)", p: 3 }}>{child}</Box>
      </Box>
    </Modal>
  );
}
