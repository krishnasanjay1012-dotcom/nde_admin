import Box from "@mui/material/Box";
import CommonDialog from "../../../common/NDE-Dialog";

const PreviewModal = ({ open, onClose, children }) => {
  return (
    <CommonDialog
      open={open}
      onClose={onClose}
      title="Preview"
      hideSubmit
      hideCancle
      width={800}
      maxWidth="md"
      sx={{
        "& .MuiDialogContent-root": {
          padding: "24px",
          height: "80vh",
          overflowY: "auto",
          backgroundColor: "#fff",
        },
        "& .MuiDialogTitle-root": {
          borderBottom: "1px solid #eee",
          background: "#807e7e24",
        },
      }}
    >
      <Box>
        {children}
      </Box>
    </CommonDialog>
  );
};

export default PreviewModal;