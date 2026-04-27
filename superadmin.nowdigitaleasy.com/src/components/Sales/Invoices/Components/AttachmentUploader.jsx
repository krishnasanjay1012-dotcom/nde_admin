import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Typography,
  IconButton,
  Paper,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

const MAX_FILES = 15;
const MAX_SIZE_MB = 10;

export default function AttachmentUploader({ files = [], onChange }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const fileInputRef = useRef(null);

  const open = Boolean(anchorEl);
  const isLimitReached = files.length >= MAX_FILES;

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = [];

    for (let file of selectedFiles) {
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        alert(`${file.name} exceeds 10 MB`);
        continue;
      }

      if (files.length + validFiles.length >= MAX_FILES) break;
      validFiles.push(file);
    }

    onChange([...files, ...validFiles]); // 🔥 update RHF
    handleMenuClose();
    e.target.value = "";
  };

  const removeFile = (index) => {
    const updated = files.filter((_, i) => i !== index);
    onChange(updated); // 🔥 update RHF
  };

  return (
    <>
      {!isLimitReached && (
        <Box sx={{ border: "1px dashed #cbd5e1", borderRadius: 2 }} p={1}>
          <Button
            startIcon={<AttachFileIcon />}
            onClick={handleMenuOpen}
            sx={{
              textTransform: "none",
              color: "#2563eb",
              fontWeight: 500,
            }}
          >
            Attachments
          </Button>

          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem
              onClick={() => fileInputRef.current.click()}
              sx={{
                backgroundColor: "#3b82f6",
                color: "#fff",
                borderRadius: 1,
                mx: 1,
                my: 0.5,
                "&:hover": {
                  backgroundColor: "#2563eb",
                },
              }}
            >
              Attach From Desktop
            </MenuItem>

            <MenuItem disabled>Attach From Documents</MenuItem>
          </Menu>

          <input
            ref={fileInputRef}
            type="file"
            hidden
            multiple
            onChange={handleFileSelect}
          />
        </Box>
      )}
      {files.length > 0 && (
        <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
          {files.map((file, index) => (
            <Paper
              key={index}
              variant="outlined"
              sx={{
                display: "flex",
                alignItems: "center",
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                maxWidth: 220,
              }}
            >
              <InsertDriveFileIcon
                sx={{ fontSize: 18, mr: 1, color: "#64748b" }}
              />

              <Typography variant="body2" noWrap sx={{ maxWidth: 140 }}>
                {file.name}
              </Typography>

              <IconButton
                size="small"
                onClick={() => removeFile(index)}
                sx={{ ml: 0.5 }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Paper>
          ))}
        </Box>
      )}

      {/* <Typography
        variant="caption"
        color="text.secondary"
        mt={1}
        display="block"
      >
        {files.length}/{MAX_FILES} files • Max 10 MB per file
      </Typography> */}
    </>
  );
}
