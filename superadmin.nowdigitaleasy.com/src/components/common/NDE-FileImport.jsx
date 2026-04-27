import React, { useRef, useState } from "react";
import {
  Box,
  Typography,
  Link,
  useTheme,
  IconButton,
  Stack,
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import Delete from "../../assets/icons/delete.svg";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CommonButton from "./NDE-Button";
import { useParams, useNavigate } from "react-router-dom";

import { useImportCustomerExcel } from "../../hooks/Customer/Customer-hooks";
import { useImportInvoiceExcel } from "../../hooks/sales/invoice-hooks";
import Invoice from "../../pages/sales/invoice/Invoice";

const NDEFileImport = ({
  title = "Import",
  maxSize = "25 MB",
  formats = "XLS",
}) => {
  const theme = useTheme();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);

  const { module } = useParams();
  const navigate = useNavigate();

  const importCustomer = useImportCustomerExcel();
  const importExcel = useImportInvoiceExcel();


  const normalizedModule = module?.toLowerCase().replace(/s$/, "");

  const sampleFileMap = {
    customer: "/samples/Customers.xls",
    contact: "/samples/Contacts.xls",
    lead: "/samples/Leads.xls",
    company: "/samples/Companies.xls",
  };

  const importApiMap = {
    customer: importCustomer,
    invoice: importExcel
  };

  const sampleXlsUrl =
    sampleFileMap[normalizedModule] || "/samples/sample.xls";

  const isDarkMode = theme.palette.mode === "dark";

  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "-";

  const handleChooseFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDeleteFile = () => {
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = () => {
    if (!file) return;

    const api = importApiMap[normalizedModule];

    if (!api) {
      console.error("No import API found for module:", module);
      return;
    }

    const formData = new FormData();
    formData.append("sheet", file);

    api.mutate(formData, {
      onSuccess: () => {
        navigate(-1);
      },
      onError: (error) => {
        console.error("Import failed", error);
      },
    });
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      {/* Title */}
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        {capitalize(module)} {title}
      </Typography>

      {/* Center Container */}
      <Box sx={{ maxWidth: 700, mx: "auto" }}>
        {/* Upload Box */}
        <Box
          sx={{
            border: `1px dashed ${theme.palette.primary.main}80`,
            borderRadius: "8px",
            p: 5,
            textAlign: "center",
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.02)"
              : "rgba(0,0,0,0.02)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            transition: "border-color 0.2s",
            "&:hover": {
              borderColor: theme.palette.primary.main,
            },
          }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <CloudUploadOutlinedIcon
              sx={{ color: "primary.main", fontSize: 32 }}
            />
          </Box>

          <Typography variant="h6" fontWeight={500}>
            Drag and drop file to import
          </Typography>

          <CommonButton
            label="Choose File"
            onClick={handleChooseFileClick}
            startIcon
          />

          <Typography variant="body2" color="text.secondary">
            Maximum File Size: {maxSize} • File Format: {formats}
          </Typography>

          <input
            type="file"
            ref={fileInputRef}
            hidden
            onChange={handleFileChange}
            accept=".csv,.xls,.xlsx,.tsv"
          />
        </Box>

        {/* Uploaded File */}
        {file && (
          <Box
            sx={{
              mt: 2,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              p: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <DescriptionOutlinedIcon color="primary" />
              <Typography variant="body2" fontWeight={500}>
                {file.name}
              </Typography>
            </Stack>

            <IconButton size="small" color="error" onClick={handleDeleteFile}>
              <img src={Delete} alt="delete" style={{ height: 20 }} />
            </IconButton>
          </Box>
        )}

        {/* Sample Download */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2, lineHeight: 1.6 }}
        >
          Download a{" "}
          <Link
            href={sampleXlsUrl}
            underline="hover"
            target="_blank"
            download
            sx={{ color: "primary.main", fontWeight: 500 }}
          >
            sample xls file
          </Link>{" "}
          and compare it to your import file to ensure the file format is
          correct for import.
        </Typography>

        {/* Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mt: 3,
          }}
        >
          <CommonButton
            label="Cancel"
            variant="outlined"
            onClick={handleCancel}
            startIcon
          />

          <CommonButton
            label="Save"
            onClick={handleSave}
            disabled={!file}
            startIcon
          />
        </Box>
      </Box>
    </Box>
  );
};

export default NDEFileImport;