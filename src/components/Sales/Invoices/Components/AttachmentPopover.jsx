import { Box, Typography, IconButton, Popover } from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export default function AttachmentsPopover({
  open,
  anchorEl,
  onClose,
  files,
  onRemove,
}) {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      PaperProps={{ sx: { width: 320, p: 1 } }}
    >
      {files.length === 0 && (
        <Typography fontSize={13} sx={{ p: 1, color: "#777" }}>
          No attachments
        </Typography>
      )}

      {files.map((file, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 1,
            borderRadius: 1,
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "#4285f4",
              color: "#fff",
            },
            "&:hover .file-size": {
              color: "#e0e0e0",
            },
            "&:hover .delete-icon": {
              color: "#fff",
            },
          }}
        >
          <InsertDriveFileIcon fontSize="small" />

          <Box sx={{ flex: 1 }}>
            <Typography fontSize={13}>{file.name}</Typography>
          </Box>

          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(index);
            }}
          >
            <DeleteOutlineIcon
              fontSize="small"
              className="delete-icon"
              sx={{ color: "#888" }}
            />
          </IconButton>
        </Box>
      ))}
    </Popover>
  );
}
