import React, { useState, useEffect } from "react";
import { TextField, FormLabel, IconButton, InputAdornment } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";

const CommonFileUpload = ({
  label,
  name,
  value,
  onChange,
  accept = "image/*,application/pdf",
  mandatory = false,
  sx,
  error,
  helperText,
  placeholder = "Select a file",
}) => {
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (value) {
      // If value is a File, use its name; if it's a URL string, extract filename
      if (typeof value === "string") {
        const parts = value.split("/");
        setFileName(parts[parts.length - 1]);
      } else if (value.name) {
        setFileName(value.name);
      }
    } else {
      setFileName("");
    }
  }, [value]);

  const inputId = `file-upload-${name || Math.random()}`;

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0] || null;
    if (onChange) onChange(selectedFile);
  };

  return (
    <div className="forms-input-wrapper" style={sx}>
      <FormLabel>
        {label}
        {mandatory && <span style={{ color: "red" }}> *</span>}
      </FormLabel>
      <TextField
        variant="outlined"
        type="text"
        value={fileName}
        placeholder={placeholder}
        error={error}
        helperText={helperText}
        sx={{
          width: "100%",
          mt: 1,
          mb: 2,
          "& .MuiOutlinedInput-root": {
             borderRadius: "6px",
            height: 44,
            "& fieldset": { border: "1px solid #D1D1D1" },
          },
          ...sx,
        }}
        InputProps={{
          readOnly: true,
          startAdornment: (
            <InputAdornment position="start">
              <input
                accept={accept}
                style={{ display: "none" }}
                id={inputId}
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor={inputId}>
                <IconButton
                  aria-label="upload file"
                  component="span"
                  edge="start"
                  size="small"
                >
                  <AttachFileIcon sx={{ color: "#000334B2" }} />
                </IconButton>
              </label>
            </InputAdornment>
          ),
        }}
      />
      {/* Optional image preview */}
      {/* {value && typeof value === "string" && accept.includes("image") && (
        <img
          src={value}
          alt="preview"
          style={{ marginTop: 8, maxHeight: 100, borderRadius: 8 }}
        />
      )} */}
    </div>
  );
};

export default CommonFileUpload;
