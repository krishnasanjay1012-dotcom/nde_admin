import React, { useRef, useState } from "react";
import {
    IconButton,
    Divider,
    Button,
    Box,
} from "@mui/material";
import { Close, CloudUpload } from "@mui/icons-material";
import { toast } from "react-toastify";
import Delete from "../../assets/icons/delete.svg";

const AttachmentPopover = ({ anchorEl, onClose }) => {
    const inputRef = useRef(null);
    const [files, setFiles] = useState([]);

    if (!anchorEl) return null;

    const handleUpload = (event) => {
        const selectedFiles = Array.from(event.target.files);

        if (selectedFiles.length + files.length > 5) {
            toast.error("You can upload maximum 5 files");
            return;
        }

        const mapped = selectedFiles.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
            name: file.name,
            size: (file.size / 1024).toFixed(1) + " KB",
            type: file.type,
        }));

        setFiles((prev) => [...prev, ...mapped]);
    };

    const handleRemove = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleFileUploadClick = () => inputRef.current.click();

    return (
        <Box
            sx={{
                position: "absolute",
                top: "18%",
                left: "70%",
                width: "310px",
                bgcolor: "white",
                border: "1px solid #ebeaf2",
                borderRadius: "8px",
                zIndex: 1000,
                boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: "-12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 0,
                    height: 0,
                    borderLeft: "12px solid transparent",
                    borderRight: "12px solid transparent",
                    borderBottom: "12px solid #EBEAF2",
                }}
            />

            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: "8px 12px",
                    bgcolor: "#f9f9fb",
                    borderBottom: "1px solid #ebeaf2",
                }}
            >
                <Box sx={{ fontWeight: 500, fontSize: "14px" }}>
                    Attachments
                </Box>

                <IconButton size="small" onClick={onClose}>
                    <Close fontSize="small" color="secondary" />
                </IconButton>
            </Box>
            <Box
                sx={{
                    p: "8px 12px",
                    display: "flex",
                    flexDirection: "column",
                    maxHeight: files.length > 2 ? "150px" : "auto",
                    overflowY: files.length > 2 ? "auto" : "visible",
                    gap: "10px",
                }}
            >
                {files.length > 0 ? (
                    <Box
                        component="ul"
                        sx={{
                            listStyle: "none",
                            p: 0,
                            m: 0,
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                        }}
                    >
                        {files.map((fileObj, index) => (
                            <Box
                                component="li"
                                key={index}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    p: "8px",
                                    border: "1px solid #eee",
                                    borderRadius: 2,
                                    background: "#fff",
                                }}
                            >
                                {fileObj.type.startsWith("image/") ? (
                                    <Box
                                        component="img"
                                        src={fileObj.preview}
                                        alt="preview"
                                        sx={{
                                            width: "45px",
                                            height: "45px",
                                            borderRadius: "6px",
                                            objectFit: "cover",
                                            mr: "10px",
                                        }}
                                    />
                                ) : (
                                    <Box
                                        sx={{
                                            width: "45px",
                                            height: "45px",
                                            borderRadius: "6px",
                                            bgcolor: "#f5f5f5",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            mr: "10px",
                                            fontSize: "12px",
                                        }}
                                    >
                                        FILE
                                    </Box>
                                )}

                                <Box sx={{ flex: 1 }}>
                                    <Box sx={{ fontSize: "13px", fontWeight: 500 }}>
                                        {fileObj.name}
                                    </Box>
                                    <Box sx={{ fontSize: "11px", color: "#555" }}>
                                        {fileObj.size}
                                    </Box>
                                </Box>

                                <IconButton size="small" onClick={() => handleRemove(index)}>
                                    <img src={Delete} style={{ height: 20 }} />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                ) : (
                    <Box sx={{ textAlign: "center", color: "#777", fontSize: "13px", m: 0 }}>
                        No Files Attached
                    </Box>
                )}
            </Box>

            <Divider sx={{ mb: "10px" }} />

            <Box display="flex" justifyContent="center">
                <Button
                    variant="outlined"
                    startIcon={<CloudUpload />}
                    onClick={handleFileUploadClick}
                    sx={{
                        width: "280px",
                        height: "60px",
                        borderRadius: "6px",
                        border: "1px dashed #d7d5e2",
                        background: "none",
                        textTransform: "none",
                        "&:hover": {
                            background: "none",
                            border: "1px dashed #d7d5e2",
                        },
                    }}
                >
                    Upload your Files
                </Button>

                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept="image/*,application/pdf"
                    style={{ display: "none" }}
                    onChange={handleUpload}
                />
            </Box>

            <Box
                sx={{
                    fontSize: "12px",
                    textAlign: "center",
                    mt: "8px",
                    mb: "8px",
                }}
            >
                You can upload a maximum of 5 files, 10MB each
            </Box>
        </Box>
    );
};

export default AttachmentPopover;
