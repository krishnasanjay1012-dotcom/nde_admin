import React, { useState } from "react";
import { keyframes } from "@emotion/react";
import {
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
  Dialog,
  DialogContent,
  Slide,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import Delete from "../../../assets/icons/delete.svg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CommonButton from "../../../components/common/NDE-Button";
import FlowerLoader from "../../../components/common/NDE-loader";
import { useImportInvoiceExcel } from "../../../hooks/sales/invoice-hooks";

const bounceIn = keyframes`
  0% { transform: translateY(100%); opacity: 0; }
  60% { transform: translateY(-15px); opacity: 1; }
  80% { transform: translateY(10px); }
  100% { transform: translateY(0); }
`;

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

const InvoiceUpload = () => {
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const importExcel = useImportInvoiceExcel();

  const allowedExtensions = [".xlsx"];

  const isValidFile = (filename) =>
    allowedExtensions.some((ext) => filename.toLowerCase().endsWith(ext));

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter((file) => isValidFile(file.name));

    if (validFiles.length !== selectedFiles.length) {
      toast.error("Invalid file detected! Only .xlsx");
    }

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files || []);

    const validFiles = droppedFiles.filter((file) => isValidFile(file.name));
    if (validFiles.length !== droppedFiles.length) {
      toast.error("Invalid file detected! Only .xlsx");
    }
    setFiles((prev) => [...prev, ...validFiles]);
  };

  const handleRemove = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((f) => formData.append("sheet", f));

    importExcel.mutate(formData, {
      onSuccess: (res) => {
        // Create and download the Excel file
        const blob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "invoice.xlsx";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setFiles([]);
        setOpenDialog(false);

        toast.success(
          "Invalid users during invoice upload will be returned in a separate XLSX file.",
        );
      },
      onError: () => {
        toast.error("Failed to upload Excel file.");
      },
    });
  };

  const DialogContentComponent = (
    <Box
      sx={{
        p: 1,
        borderRadius: 2,
        textAlign: "center",
        maxWidth: 490,
        mx: "auto",
        position: "relative",
      }}
    >
      <IconButton
        onClick={() => setOpenDialog(false)}
        color="error"
        sx={{ position: "absolute", top: -10, right: -16 }}
      >
        <CloseIcon fontSize="medium" sx={{ color: "error.main" }} />
      </IconButton>

      <Typography variant="h5" fontWeight={700} mb={1}>
        👋 Welcome!
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Upload your Invoice Excel file to automatically extract customer,
        amount, and invoice details.
      </Typography>

      <Box
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        sx={{
          border: dragOver ? "2px dashed #2330E7" : "2px dashed #bbb",
          borderRadius: 3,
          p: 2,
          mb: 2,
          transition: "0.3s",
          backgroundColor: dragOver ? "#F1F2FD" : "white",
          cursor: "pointer",
        }}
      >
        <CloudUploadIcon sx={{ fontSize: 48, color: "#2330E7", mb: 1 }} />
        <Typography variant="body1" color="text.secondary">
          Drag & drop your Excel or CSV files here
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={1}>
          or click below to browse
        </Typography>
        <Button variant="contained" component="label">
          Browse Files
          <input
            hidden
            accept=".xlsx, .csv"
            type="file"
            multiple
            onChange={handleFileChange}
          />
        </Button>
      </Box>

      {/* FILE LIST WITH SCROLL */}
      {files.length > 0 && (
        <Box
          sx={{
            maxHeight: 70,
            overflowY: "auto",
            pr: 1,
            mb: 2,
          }}
        >
          {files.map((file, index) => (
            <Stack
              key={index}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{
                backgroundColor: "#fff",
                border: "1px solid #E0E0E0",
                borderRadius: 2,
                p: 1.5,
                mb: 1,
              }}
            >
              <Box textAlign="left">
                <Typography fontWeight={500}>{file.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {(file.size / 1024).toFixed(2)} KB
                </Typography>
              </Box>
              <IconButton onClick={() => handleRemove(index)}>
                <img src={Delete} style={{ height: 20 }} />
              </IconButton>
            </Stack>
          ))}
        </Box>
      )}

      <CommonButton
        fullWidth
        disabled={files.length === 0 || importExcel.isPending}
        label={
          importExcel.isPending ? (
            <FlowerLoader size={15} color="white" />
          ) : (
            "Upload"
          )
        }
        onClick={handleUpload}
        startIcon={
          importExcel.isPending ? null : (
            <CloudUploadIcon sx={{ color: "icon.light" }} />
          )
        }
        sx={{ height: 40, borderRadius: 1.4 }}
      />
    </Box>
  );

  return (
    <>
      <CommonButton
        label={"Upload your Excel"}
        onClick={() => setOpenDialog(true)}
        startIcon={<CloudUploadIcon sx={{ color: "icon.light" }} />}
      />

      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setFiles([]);
          setDragOver(false);
        }}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "10px",
            animation: `${bounceIn} 0.7s ease-out`,
            width: 500,
          },
        }}
      >
        <DialogContent>{DialogContentComponent}</DialogContent>
      </Dialog>
    </>
  );
};

export default InvoiceUpload;
